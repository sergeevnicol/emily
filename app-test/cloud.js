/* Secure mode: login with a one-time code by email, data saved on the server (Supabase),
   plan opens only when Emily approves in the admin screen. Loads app-1.js and app-2.js after login. */
(function(){
  const CFG = window.CLOUD_CONFIG || {};
  const APP_SCRIPTS = ["app-1.js", "app-2.js"];
  const SKIP = /:photos:|:planOpen$/;   // photos stay on the phone; plan access comes only from the server
  function loadScripts(list){
    return list.reduce((p, src) => p.then(() => new Promise((ok, bad) => {
      const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = bad; document.body.appendChild(s);
    })), Promise.resolve());
  }
  if (!CFG.url || !CFG.anonKey) { loadScripts(APP_SCRIPTS); return; }

  const sb = window.supabase.createClient(CFG.url, CFG.anonKey, {auth:{persistSession:true, autoRefreshToken:true, detectSessionInUrl:true, flowType:"implicit"}});
  const orig = {set: Storage.prototype.setItem, remove: Storage.prototype.removeItem};
  let USER = null, PROF = null, pending = {}, timer = null;

  /* ---------- login screen ---------- */
  const css = `.cl{position:fixed;inset:0;z-index:999;background:var(--bg);display:grid;place-items:center;padding:24px;direction:rtl}
  .cl .box{width:100%;max-width:400px;display:grid;gap:14px}
  .cl h1{font-family:var(--display);font-size:52px;color:var(--mocha);line-height:1}
  .cl p{color:var(--muted)}
  .cl input{width:100%;font:18px var(--body);padding:14px;border-radius:14px;border:1.5px solid var(--line);background:var(--surface);color:var(--fg);direction:ltr;text-align:center}
  .cl .err{color:var(--accent);font-size:14px}
  .cl .linkbtn{background:none;border:0;color:var(--muted);text-decoration:underline;cursor:pointer;font:14px var(--body)}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  const box = document.createElement("div"); box.className = "cl";
  box.innerHTML = `<div class="box">
    <div class="brand" style="font-family:var(--display);font-size:28px;color:var(--mocha)">אמילי <span style="color:var(--accent)">·</span> אימון</div>
    <div id="clStep1"><h1>כניסה</h1><p style="margin:8px 0 14px">כתבי את המייל שלך ונשלח אלייך קישור כניסה. בלי סיסמה.</p>
      <input id="clEmail" type="email" autocomplete="email" inputmode="email" placeholder="you@example.com">
      <button class="btn" id="clSend" type="button" style="margin-top:14px">שלחי לי קישור</button></div>
    <div id="clStep2" hidden><h1>בדקי את המייל</h1><p style="margin:8px 0 14px">שלחנו מייל ל־<b id="clTo"></b>. פתחי אותו בטלפון הזה ולחצי על הקישור. אם קיבלת קוד, אפשר להקליד אותו כאן.</p>
      <input id="clCode" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="10" placeholder="123456">
      <button class="btn" id="clVerify" type="button" style="margin-top:14px">כניסה</button>
      <button class="linkbtn" id="clBack" type="button" style="margin-top:10px">מייל אחר או שליחה מחדש</button></div>
    <p class="err" id="clErr" hidden></p></div>`;
  const $c = s => box.querySelector(s);
  const err = t => { $c("#clErr").textContent = t; $c("#clErr").hidden = !t; };
  function showLogin(){
    document.body.appendChild(box);
    $c("#clSend").onclick = async () => {
      const email = $c("#clEmail").value.trim().toLowerCase();
      if (!/^\S+@\S+\.\S+$/.test(email)) return err("המייל לא נראה תקין.");
      err(""); $c("#clSend").disabled = true;
      const { error } = await sb.auth.signInWithOtp({ email, options:{ shouldCreateUser:true, emailRedirectTo: location.origin + location.pathname + location.search } });
      $c("#clSend").disabled = false;
      if (error) return err(/rate|seconds/i.test(error.message) ? "נשלחו יותר מדי קודים. נסי שוב בעוד כמה דקות." : "לא הצלחנו לשלוח קוד. נסי שוב.");
      $c("#clTo").textContent = email; $c("#clStep1").hidden = true; $c("#clStep2").hidden = false; $c("#clCode").focus();
    };
    $c("#clVerify").onclick = async () => {
      const email = $c("#clEmail").value.trim().toLowerCase(), token = $c("#clCode").value.replace(/\s/g, "");
      if (!token) return err("הקלידי את הקוד מהמייל.");
      err(""); $c("#clVerify").disabled = true;
      const { data, error } = await sb.auth.verifyOtp({ email, token, type:"email" });
      $c("#clVerify").disabled = false;
      if (error || !data.session) return err("הקוד לא נכון או שפג תוקפו.");
      box.remove(); start(data.session.user);
    };
    $c("#clBack").onclick = () => { $c("#clStep2").hidden = true; $c("#clStep1").hidden = false; err(""); };
    $c("#clEmail").addEventListener("keydown", e => { if (e.key === "Enter") $c("#clSend").click(); });
    $c("#clCode").addEventListener("keydown", e => { if (e.key === "Enter") $c("#clVerify").click(); });
  }

  /* ---------- sync: every app save is also saved on the server ---------- */
  function flush(){
    timer = null; const rows = Object.entries(pending).map(([k, v]) => ({ user_id: USER.id, k, v, updated_at: new Date().toISOString() }));
    pending = {}; if (!rows.length) return;
    const ups = rows.filter(r => r.v !== undefined), dels = rows.filter(r => r.v === undefined).map(r => r.k);
    if (ups.length) sb.from("app_data").upsert(ups).then(({error}) => { if (error) ups.forEach(r => pending[r.k] = r.v); });
    if (dels.length) sb.from("app_data").delete().eq("user_id", USER.id).in("k", dels).then(() => {});
  }
  const queue = (k, v) => { pending[k] = v; if (!timer) timer = setTimeout(flush, 800); };
  function hook(prefix){
    Storage.prototype.setItem = function(k, v){
      orig.set.call(this, k, v);
      if (this === window.localStorage && k.startsWith(prefix) && !SKIP.test(k)) { let j; try { j = JSON.parse(v); } catch(e){ j = v; } queue(k, j); }
    };
    Storage.prototype.removeItem = function(k){
      orig.remove.call(this, k);
      if (this === window.localStorage && k.startsWith(prefix) && !SKIP.test(k)) queue(k, undefined);
    };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(); });
  }

  async function fetchProfile(){
    const { data } = await sb.from("profiles").select("client_id, approved, role").eq("id", USER.id).single();
    return data;
  }

  async function start(user){
    USER = user;
    PROF = await fetchProfile();
    if (!PROF) { document.body.insertAdjacentHTML("beforeend", `<p style="padding:24px">לא מצאנו את הפרופיל שלך. נסי להיכנס שוב.</p>`); return; }
    if (new URLSearchParams(location.search).get("next") === "admin") { location.href = "admin.html"; return; }
    const cid = PROF.client_id || "u" + USER.id.slice(0, 8);
    if (location.hash.slice(1) !== cid) history.replaceState(null, "", "#" + cid);
    const prefix = `emily:${cid}:`;
    /* Bring the server copy to this phone (server wins), then upload anything only this phone had. */
    const { data: rows } = await sb.from("app_data").select("k, v").eq("user_id", USER.id);
    const have = new Set();
    (rows || []).forEach(r => { have.add(r.k); orig.set.call(localStorage, r.k, JSON.stringify(r.v)); });
    for (let i = 0; i < localStorage.length; i++){
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix) && !have.has(k) && !SKIP.test(k)) { try { pending[k] = JSON.parse(localStorage.getItem(k)); } catch(e){} }
    }
    if (PROF.approved) orig.set.call(localStorage, prefix + "planOpen", "true"); else orig.remove.call(localStorage, prefix + "planOpen");
    hook(prefix); flush();
    window.CLOUD = {
      email: USER.email, approved: !!PROF.approved, admin: PROF.role === "admin",
      async refresh(){ const p = await fetchProfile(); this.approved = !!(p && p.approved); return this.approved; },
      async signOut(){ flush(); await sb.auth.signOut(); location.reload(); }
    };
    await loadScripts(APP_SCRIPTS);
  }

  sb.auth.getSession().then(({ data }) => data.session ? start(data.session.user) : showLogin());
})();
