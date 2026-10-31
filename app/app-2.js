/* ---------- navigation ---------- */
const VIEWS = {onboard:"#onboardView", home:"#homeView", workout:"#workoutView", sum:"#sumView", month:"#monthView"};
function go(v, keepMonth){
  Object.entries(VIEWS).forEach(([k, sel]) => $(sel).hidden = k !== v);
  document.querySelectorAll(".tabs button").forEach(b => b.toggleAttribute("aria-current", false));
  const tab = document.querySelector(`.tabs [data-go="${v === "sum" ? "workout" : v}"]`); if (tab) tab.setAttribute("aria-current","page");
  $(".tabs").hidden = v === "onboard"; $(".top").hidden = v === "onboard";
  if (v === "home") renderHome();
  if (v === "month") { if (!keepMonth) mOff = mOff > 0 ? 0 : mOff; renderMonth(); }
  window.scrollTo(0,0);
}
document.querySelectorAll(".tabs button").forEach(b => b.addEventListener("click", () => {
  if (b.dataset.go === "month") mOff = 0;
  if (b.dataset.go === "workout" && S.end && totals().done === totals().all) return go("sum");
  go(b.dataset.go);
}));

/* ---------- home ---------- */
const QUOTES = [
  "את לא צריכה מוטיבציה. את צריכה להופיע.",
  "הגוף שלך יכול. הראש שלך צריך להסכים.",
  "אף אחד לא יעשה את הסטים בשבילך.",
  "קשה? מצוין. ככה זה אמור להרגיש.",
  "תירוצים לא שורפים קלוריות.",
  "עוד שבוע מעכשיו תודי לעצמך על היום.",
  "את חזקה יותר ממה שאת חושבת. תוכיחי.",
  "משמעת זה לעשות את זה גם כשלא בא לך."
];
function greet(){ const h = new Date().getHours(); return h < 5 ? "לילה טוב" : h < 12 ? "בוקר טוב" : h < 17 ? "צהריים טובים" : h < 21 ? "ערב טוב" : "לילה טוב"; }
const photoKey = `emily:${cid}:photo`, weightKey = `emily:${cid}:weight`;
function paintPhoto(){
  const src = store.get(photoKey, null);
  $("#avatarImg").hidden = !src; $("#avatarPh").hidden = !!src; if (src) $("#avatarImg").src = src;
}
$("#photo").addEventListener("change", ev => {
  const f = ev.target.files && ev.target.files[0]; if (!f) return;
  const img = new Image(), url = URL.createObjectURL(f);
  img.onload = () => {
    const S2 = 320, c = document.createElement("canvas"); c.width = c.height = S2;
    const k = Math.max(S2 / img.width, S2 / img.height), w = img.width * k, h = img.height * k;
    c.getContext("2d").drawImage(img, (S2 - w) / 2, (S2 - h) / 2, w, h);
    store.set(photoKey, c.toDataURL("image/jpeg", .85)); URL.revokeObjectURL(url); paintPhoto();
  };
  img.src = url;
});

function renderHome(){
  paintPhoto();
  $("#hiTime").textContent = greet();
  $("#hiName").textContent = `היי, ${C.name}`;
  const q = QUOTES[Math.floor(Date.now() / 864e5) % QUOTES.length];
  $("#quote").innerHTML = `“${q}”<span>אמילי</span>`;

  // today's / next workout
  const dw = defaultWorkout(), wk = C.workouts[dw.w];
  const st = store.get(`emily:${cid}:${todayKey()}:${dw.w}`, {sets:{}, start:null, end:null});
  const all = wk.list.reduce((a,e)=>a+e.sets,0), dn = wk.list.reduce((a,e)=>a+(st.sets[e.id]||[]).filter(Boolean).length,0);
  const mins = Math.round(wk.list.reduce((a,e)=>a + e.sets*(45+e.rest),0)/60) + 5;
  const isToday = dw.day === today;
  $("#hLabel").textContent = isToday ? `האימון של היום · אימון ${dw.w}` : `האימון הבא · יום ${DAYFULL[dw.day]}`;
  $("#hTitle").textContent = wk.title;
  $("#hFacts").innerHTML = `<span><b>${wk.list.length}</b> תרגילים</span><span><b>${all}</b> סטים</span><span>כ־<b>${mins}</b> דקות</span>`;
  const btn = $("#hStart");
  $("#hTrack").hidden = !(dn && !st.end); $("#hTrackI").style.width = (dn/all*100) + "%";
  if (st.end && isToday) { btn.className = "btn bigbtn done"; btn.innerHTML = "האימון של היום נעול ✓"; btn.onclick = () => { cur = dw; renderAll(); showSummary(); }; }
  else {
    btn.className = "btn bigbtn";
    btn.innerHTML = (dn ? "להמשיך באימון" : "החלי אימון") + ' <span class="chev" aria-hidden="true" style="display:flex;gap:2px;direction:ltr"><i style="width:10px;height:10px;border-left:3px solid #fff;border-bottom:3px solid #fff;transform:rotate(45deg)"></i><i style="width:10px;height:10px;border-left:3px solid #fff;border-bottom:3px solid #fff;transform:rotate(45deg);opacity:.6"></i></span>';
    btn.onclick = () => { unlockAudio(); cur = dw; renderAll(); go("workout"); };
  }

  // weekly workout table
  const sun = new Date(); sun.setDate(sun.getDate() - today);
  let rows = "", doneN = 0; const plannedN = Object.keys(C.schedule).length;
  for (let d = 0; d < 7; d++){
    const w = C.schedule[d]; if (!w) continue;
    const day = new Date(sun); day.setDate(sun.getDate() + d); const key = ds(day);
    const v = store.get(`emily:${cid}:${key}:${w}`, null), ok = v && v.end;
    if (ok) doneN++;
    const stc = ok ? ["ok","בוצע ✓"] : d === today ? ["today","היום"] : d < today ? ["miss","פוספס"] : ["plan","מתוכנן"];
    rows += `<tr><td class="dy">${DAYFULL[d]}<span class="sub">${day.getDate()}/${day.getMonth()+1}</span></td><td>אימון ${w}<span class="sub">${C.workouts[w].title}</span></td><td style="text-align:left"><span class="st ${stc[0]}">${stc[1]}</span></td></tr>`;
  }
  $("#hWeek").innerHTML = rows;
  $("#hWeekTxt").textContent = `${doneN} מתוך ${plannedN} השבוע`;

  renderFood();
  renderWeight();
  if (PHOTOS) { $("#baCard").hidden = false; renderBA(); }
  renderHomeGoal();
  paintConsent();
  $("#commOpt").checked = commOn();
  renderCommunity();

  // mini month cubes
  const now = new Date(), first = new Date(now.getFullYear(), now.getMonth(), 1), days = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
  const L = allLogs(), tS = ds(now); let cubes = "", hit = 0;
  cubes += "<div></div>".repeat(first.getDay());
  for (let d = 1; d <= days; d++){
    const key = ds(new Date(now.getFullYear(), now.getMonth(), d)), g = L.p[key] || 0;
    const a = g ? Math.max(.15, Math.min(1, g / C.protein)) : 0, fin = Object.values(L.w[key] || {}).some(v => v.end);
    if (g >= C.protein) hit++;
    cubes += `<div class="cube${g >= C.protein ? " full" : ""}${key > tS ? " future" : ""}${key === tS ? " today" : ""}" style="--a:${a.toFixed(2)}" title="${d} · ${g} גרם">${fin ? '<span class="w"></span>' : ""}</div>`;
  }
  $("#hCubes").innerHTML = cubes;
  $("#hMonthTxt").textContent = `${hit} ימים ביעד חלבון`;
}
$("#hMonth").addEventListener("click", () => { mOff = 0; go("month"); });

/* food table: one idea per part of the day, tick to log protein */
const SLOTS = [["morning","בוקר"],["noon","צהריים"],["snack","נשנוש"],["evening","ערב"]];
function dayMenu(){
  const used = new Set(), out = [];
  SLOTS.forEach(([slot, label]) => {
    const pool = slot === "snack" ? C.meals.filter(m => m.min <= 5) : C.meals.filter(m => m.slots.includes(slot));
    const seed = Math.floor(Date.now() / 864e5);
    const pick = pool.filter(m => !used.has(m.name))[seed % Math.max(1, pool.filter(m => !used.has(m.name)).length)] || pool[0];
    if (pick) { used.add(pick.name); out.push({slot, label, m:pick}); }
  });
  return out;
}
function renderFood(){
  const p = store.get(protKey(), {g:0, ids:[], extra:[]});
  $("#hProtGoal").textContent = C.protein;
  $("#ringV").textContent = p.g;
  $("#ringArc").setAttribute("stroke-dashoffset", (263.9 * (1 - Math.min(1, p.g / C.protein))).toFixed(1));
  $("#ringArc").setAttribute("stroke", p.g >= C.protein ? "var(--ok)" : "var(--accent)");
  $("#hFood").innerHTML = dayMenu().map(({label, m}) => {
    const on = p.ids.includes(m.name);
    return `<tr><td class="dy">${label}</td><td>${m.name}<span class="sub">${m.p} גר׳ חלבון · ${m.min} דק׳ הכנה</span></td><td style="text-align:left"><button type="button" class="chk" data-m="${m.name}" aria-pressed="${on}" aria-label="אכלתי ${m.name}"><svg viewBox="0 0 16 16"><path d="M3 8.5l3.2 3L13 4.5"/></svg></button></td></tr>`;
  }).join("");
  document.querySelectorAll("#hFood .chk").forEach(b => b.addEventListener("click", () => {
    const m = C.meals.find(x => x.name === b.dataset.m), cur2 = store.get(protKey(), {g:0, ids:[], extra:[]});
    if (cur2.ids.includes(m.name)) { cur2.ids = cur2.ids.filter(x => x !== m.name); cur2.g = Math.max(0, cur2.g - m.p); }
    else { cur2.ids.push(m.name); cur2.g += m.p; tone(880,.08); }
    store.set(protKey(), cur2); renderFood();
  }));
}
document.querySelectorAll(".quick button").forEach(b => b.addEventListener("click", () => {
  const p = store.get(protKey(), {g:0, ids:[], extra:[]}); p.extra = p.extra || [];
  if (b.dataset.g === "undo") { const last = p.extra.pop(); if (last) p.g = Math.max(0, p.g - last); }
  else { const g = +b.dataset.g; p.g += g; p.extra.push(g); tone(880,.08); }
  store.set(protKey(), p); renderFood();
}));

/* body weight: one entry per day, line chart of the trend */
function renderWeight(){
  const W8 = store.get(weightKey, []).sort((a,b) => a.d < b.d ? -1 : 1);
  const last = W8[W8.length-1], firstW = W8[0];
  $("#wStats").innerHTML = last ? `<div><b>${last.kg}</b>ק״ג עכשיו</div>` + (W8.length > 1 ? `<div><b>${(last.kg - firstW.kg > 0 ? "+" : "") + (last.kg - firstW.kg).toFixed(1)}</b>ק״ג מההתחלה</div><div><b>${W8.length}</b>שקילות</div>` : "") : "";
  const box = $("#wChart");
  if (W8.length < 2) { box.innerHTML = `<div class="empty">אחרי שתי שקילות תופיע כאן המגמה שלך. שוקלות באותה שעה, רצוי בבוקר.</div>`; return; }
  const pts = W8.slice(-12), Wd = 320, Ht = 130, pl = 8, pr = 34, pt = 14, pb = 22;
  const ys = pts.map(p => p.kg), lo = Math.floor(Math.min(...ys) - .5), hi = Math.ceil(Math.max(...ys) + .5);
  const X = i => pl + i * (Wd - pl - pr) / (pts.length - 1), Y = v => pt + (hi - v) / (hi - lo) * (Ht - pt - pb);
  const path = pts.map((p,i) => `${i ? "L" : "M"}${X(i).toFixed(1)},${Y(p.kg).toFixed(1)}`).join("");
  const fmtD = d => { const [y,m,dd] = d.split("-"); return `${+dd}/${+m}`; };
  let svg = `<svg viewBox="0 0 ${Wd} ${Ht}" role="img" aria-label="גרף משקל">`;
  [hi, (hi+lo)/2, lo].forEach(v => { svg += `<line x1="${pl}" x2="${Wd-pr}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)" stroke-width="1"/><text x="${Wd-pr+6}" y="${Y(v)+4}" font-size="10" fill="var(--muted)" text-anchor="start">${v}</text>`; });
  svg += `<text x="${X(0)}" y="${Ht-4}" font-size="10" fill="var(--muted)" text-anchor="start">${fmtD(pts[0].d)}</text><text x="${X(pts.length-1)}" y="${Ht-4}" font-size="10" fill="var(--muted)" text-anchor="end">${fmtD(pts[pts.length-1].d)}</text>`;
  svg += `<path d="${path}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
  svg += `<circle cx="${X(pts.length-1)}" cy="${Y(pts[pts.length-1].kg)}" r="5" fill="var(--accent)" stroke="var(--surface)" stroke-width="2"/>`;
  pts.forEach((p,i) => { svg += `<circle class="hit" data-i="${i}" cx="${X(i)}" cy="${Y(p.kg)}" r="14" fill="transparent"/>`; });
  svg += `</svg><div class="tip" hidden></div>`;
  box.innerHTML = svg;
  const tip = box.querySelector(".tip"), sv = box.querySelector("svg");
  box.querySelectorAll(".hit").forEach(c => {
    const show = () => { const i = +c.dataset.i, r = sv.getBoundingClientRect(), k = r.width / Wd;
      tip.textContent = `${fmtD(pts[i].d)} · ${pts[i].kg} ק״ג`; tip.style.left = X(i)*k + "px"; tip.style.top = Y(pts[i].kg)*k + "px"; tip.hidden = false; };
    c.addEventListener("pointerenter", show); c.addEventListener("click", show);
    c.addEventListener("pointerleave", () => tip.hidden = true);
  });
}
$("#wAdd").addEventListener("click", () => {
  const v = parseFloat($("#wIn").value); if (!(v > 25 && v < 300)) { $("#wIn").focus(); return; }
  const W8 = store.get(weightKey, []).filter(x => x.d !== todayKey()); W8.push({d:todayKey(), kg:+v.toFixed(1)});
  store.set(weightKey, W8); $("#wIn").value = ""; renderWeight(); tone(880,.08);
});


/* ---------- back buttons ---------- */
document.querySelectorAll("[data-back]").forEach(b => b.addEventListener("click", () => go(b.dataset.back)));

/* ---------- onboarding: details → calendar → before photos ---------- */
const GOALS = ["חיטוב","ירידה במשקל","ישבן","להתחזק","להתחיל מאפס","כושר אחרי לידה"];
/* Phase 1 (testing): body photos are switched off. Set to true to bring back the before-photos step and the before/after card. */
const PHOTOS = false;
const OB_STEPS = PHOTOS ? ["ob1","obH","ob2","ob3"] : ["ob1","obH","ob2"];
let obState = {name:"", goal:"", days:[], time:"18:00"};
function obStep(n){
  ["ob1","obH","obWait","ob2","ob3"].forEach(id => $("#"+id).hidden = true);
  OB_STEPS.forEach((id, i) => { $("#"+id).hidden = i+1 !== n; $("#dot"+(i+1))?.classList.toggle("on", i+1 <= n); });
  window.scrollTo(0,0);
}
function startOnboarding(step){
  obState = Object.assign({name:"", goals:[], days:[], time:"18:00"}, PROFILE || {});
  if (!obState.goals || !obState.goals.length) obState.goals = obState.goal ? [obState.goal] : [];
  $("#obName").value = obState.name || ""; $("#obTime").value = obState.time || "18:00";
  $("#obGoal").innerHTML = GOALS.map(g => `<button type="button" aria-pressed="${obState.goals.includes(g)}" data-g="${g}">${g}</button>`).join("");
  $("#obDays").innerHTML = DAYN.map((d,i) => `<button type="button" aria-pressed="${obState.days.includes(i)}" data-d="${i}" aria-label="יום ${DAYFULL[i]}">${d}</button>`).join("");
  $("#obGoal").querySelectorAll("button").forEach(b => b.onclick = () => {
    const g = b.dataset.g, on = obState.goals.includes(g);
    obState.goals = on ? obState.goals.filter(x => x !== g) : obState.goals.concat(g); b.setAttribute("aria-pressed", !on);
  });
  $("#obDays").querySelectorAll("button").forEach(b => b.onclick = () => {
    const d = +b.dataset.d, on = obState.days.includes(d);
    obState.days = on ? obState.days.filter(x => x !== d) : obState.days.concat(d);
    b.setAttribute("aria-pressed", !on);
  });
  go("onboard"); obStep(step || 1);
}
$("#obForm").addEventListener("submit", ev => {
  ev.preventDefault();
  obState.name = $("#obName").value.trim(); obState.time = $("#obTime").value || "18:00";
  const err = !obState.name ? "כתבי את השם שלך." : !obState.goals.length ? "בחרי מטרה אחת לפחות." : (obState.days.length < 2 || obState.days.length > 5) ? "בחרי בין 2 ל־5 ימי אימון." : "";
  $("#obErr").textContent = err; $("#obErr").hidden = !err; if (err) return;
  PROFILE = Object.assign({}, PROFILE || {}, obState); store.set(PROFILE_KEY, PROFILE); applyProfile();
  renderHQ(); obStep(2);
});

/* calendar: one Google Calendar link per workout day, repeating weekly for the length of the plan */
function nextDate(dow){ const d = new Date(); d.setHours(0,0,0,0); const add = (dow - d.getDay() + 7) % 7 || (new Date().getHours() >= +obState.time.split(":")[0] ? 7 : 0); d.setDate(d.getDate() + add); return d; }
const gStamp = (d, hh, mm) => `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(hh)}${pad(mm)}00`;
function renderCal(){
  const [hh, mm] = (PROFILE.time || "18:00").split(":").map(Number), weeks = C.weeks - C.week + 1;
  const added = PROFILE.calAdded || [];
  $("#obCal").innerHTML = Object.entries(C.schedule).sort((a,b)=>a[0]-b[0]).map(([d, w]) => {
    const dt = nextDate(+d), end = new Date(dt); const eh = hh + 1;
    const title = `אימון ${w} · ${C.workouts[w].title}`;
    const url = "https://calendar.google.com/calendar/render?action=TEMPLATE"
      + "&text=" + encodeURIComponent(title + " 💪")
      + "&dates=" + gStamp(dt, hh, mm) + "/" + gStamp(end, eh, mm)
      + "&ctz=Asia/Jerusalem"
      + "&recur=" + encodeURIComponent(`RRULE:FREQ=WEEKLY;COUNT=${weeks}`)
      + "&details=" + encodeURIComponent(`${C.workouts[w].list.length} תרגילים · פותחים את האפליקציה של אמילי ומתחילים.`);
    const on = added.includes(+d);
    return `<div class="calrow"><div><b>יום ${DAYFULL[d]} · ${PROFILE.time}</b><span>${title} · ${weeks} שבועות</span></div>
      <a href="${url}" target="_blank" rel="noopener" data-d="${d}" class="${on ? "done" : ""}">${on ? "נוסף ✓" : "הוספה ליומן"}</a></div>`;
  }).join("");
  $("#obCal").querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    PROFILE.calAdded = Array.from(new Set((PROFILE.calAdded || []).concat(+a.dataset.d))); store.set(PROFILE_KEY, PROFILE);
    a.classList.add("done"); a.textContent = "נוסף ✓";
  }));
  document.querySelector("#ob2 .lead[style]").textContent = `ההוספה נפתחת ביומן Google. כל אימון חוזר כל שבוע, ${weeks} שבועות, עם התראה לפי הגדרות היומן שלך.`;
}
$("#ob2Next").addEventListener("click", () => { if (!PHOTOS) return finishOnboarding(); renderShots(); paintConsent(); obStep(4); });
$("#ob2Back").addEventListener("click", () => { renderHQ(); obStep(2); });

/* before photos (and later, after photos): stored on this device only */
const ANGLES = [["front","מקדימה"],["side","מהצד"],["back","מאחור"]];
const photoSetKey = kind => `emily:${cid}:photos:${kind}`;
function readImage(file, max){
  return new Promise(res => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => { const k = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement("canvas");
      c.width = Math.round(img.width*k); c.height = Math.round(img.height*k); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url); res(c.toDataURL("image/jpeg", .82)); };
    img.onerror = () => res(null); img.src = url;
  });
}
function savePhoto(kind, angle, data){
  const set = store.get(photoSetKey(kind), {});
  set[angle] = {data, d: todayKey()};
  try { localStorage.setItem(photoSetKey(kind), JSON.stringify(set)); return true; }
  catch(e){ return false; }
}
function renderShots(){
  const set = store.get(photoSetKey("before"), {});
  $("#obShots").innerHTML = ANGLES.map(([a, label]) => `<label class="shot ${set[a] ? "has" : ""}" for="shot-${a}">
    ${set[a] ? `<img src="${set[a].data}" alt="${label}">` : `<span style="font-size:28px;line-height:1">+</span>`}<span class="tag">${label}</span>
    <input type="file" accept="image/*" id="shot-${a}" data-a="${a}"></label>`).join("");
  $("#obShots").querySelectorAll("input").forEach(inp => inp.addEventListener("change", async () => {
    const f = inp.files && inp.files[0]; if (!f) return;
    const data = await readImage(f, 900);
    if (!data || !savePhoto("before", inp.dataset.a, data)) { $("#obSaveMsg").textContent = "לא הצלחתי לשמור את התמונה במכשיר. נסי תמונה אחרת."; $("#obSaveMsg").hidden = false; return; }
    renderShots();
  }));
  const any = Object.keys(set).length > 0;
  $("#obSavePh").hidden = !any || !downloadsApi;
}
let downloadsApi = null;
(async () => { try { downloadsApi = await window.claude?.use?.("downloads"); } catch(e){ downloadsApi = null; } })();
$("#obSavePh").addEventListener("click", async () => {
  const set = store.get(photoSetKey("before"), {}), msg = $("#obSaveMsg"); let n = 0;
  for (const [a, label] of ANGLES) {
    if (!set[a] || !downloadsApi) continue;
    const blob = await (await fetch(set[a].data)).blob();
    try { await downloadsApi.save({filename: `לפני - ${label} - ${set[a].d}.jpg`, data: blob}); n++; }
    catch(e){ if (e && e.code === "declined") continue; break; }
  }
  msg.textContent = n ? `נשמרו ${n} תמונות. שימי אותן באלבום "לפני".` : "התמונות לא נשמרו. אפשר לשמור אותן גם ישירות מהגלריה."; msg.hidden = false;
});
function finishOnboarding(){ PROFILE.done = true; store.set(PROFILE_KEY, PROFILE); applyProfile(); cur = defaultWorkout(); renderAll(); go("home"); }
$("#obDone").addEventListener("click", finishOnboarding);
$("#obSkip").addEventListener("click", finishOnboarding);
$("#editProfile").addEventListener("click", () => startOnboarding(1));

/* home card: before / after side by side */
function renderBA(){
  const before = store.get(photoSetKey("before"), {}), after = store.get(photoSetKey("after"), {});
  const nb = Object.keys(before).length;
  $("#baTxt").textContent = nb ? `התחלה: ${before[Object.keys(before)[0]].d.split("-").reverse().slice(0,2).join("/")}` : "עוד לא צילמת";
  $("#baGrid").innerHTML = ANGLES.map(([a, label]) => `<div class="pair"><div class="two">
      <label class="ph" for="ba-before-${a}">${before[a] ? `<img src="${before[a].data}" alt="לפני ${label}">` : "לפני"}<input type="file" accept="image/*" id="ba-before-${a}" data-k="before" data-a="${a}"></label>
      <label class="ph" for="ba-after-${a}">${after[a] ? `<img src="${after[a].data}" alt="אחרי ${label}">` : "אחרי"}<input type="file" accept="image/*" id="ba-after-${a}" data-k="after" data-a="${a}"></label>
    </div>${label}</div>`).join("");
  $("#baGrid").querySelectorAll("input").forEach(inp => inp.addEventListener("change", async () => {
    const f = inp.files && inp.files[0]; if (!f) return;
    const data = await readImage(f, 900); if (data && savePhoto(inp.dataset.k, inp.dataset.a, data)) renderBA();
  }));
}


/* ---------- next month's goal: pick from suggestions and/or write your own ---------- */
const goalKey = d => `emily:${cid}:goal:${d.getFullYear()}-${pad(d.getMonth()+1)}`;
let ngPick = [];
function renderGoalPicker(nxt, sugg){
  const k = goalKey(nxt), saved = store.get(k, null), name = nxt.toLocaleDateString("he-IL", {month:"long"});
  $("#ngTitle").textContent = `היעד שלי ל${name}`;
  const show = (editing) => {
    const s2 = store.get(k, null);
    $("#ngSaved").hidden = editing || !s2;
    [$("#ngOpts"), $("#ngOwn"), $("#ngSave"), document.querySelector("#ngoal .sub")].forEach(el => el.hidden = !editing && !!s2);
    if (s2 && !editing) $("#ngList").innerHTML = s2.items.map(t => `<li>${t.replace(/</g,"&lt;")}</li>`).join("");
  };
  ngPick = saved ? saved.items.filter(t => sugg.some(x => x.t === t)) : [];
  $("#ngOwn").value = saved ? (saved.items.find(t => !sugg.some(x => x.t === t)) || "") : "";
  const tick = '<svg viewBox="0 0 16 16"><path d="M3 8.5l3.2 3L13 4.5"/></svg>';
  $("#ngOpts").innerHTML = sugg.map((x, i) => `<button type="button" class="gopt" data-i="${i}" aria-pressed="${ngPick.includes(x.t)}"><span class="bx">${tick}</span><span>${x.t}<small>${x.why}</small></span></button>`).join("");
  $("#ngOpts").querySelectorAll(".gopt").forEach(b => b.onclick = () => {
    const t = sugg[+b.dataset.i].t, on = ngPick.includes(t);
    ngPick = on ? ngPick.filter(x => x !== t) : ngPick.concat(t); b.setAttribute("aria-pressed", !on);
  });
  $("#ngSave").onclick = () => {
    const own = $("#ngOwn").value.trim(), items = ngPick.concat(own ? [own] : []);
    if (!items.length) { $("#ngErr").textContent = "סמני יעד אחד לפחות, או כתבי יעד משלך."; $("#ngErr").hidden = false; return; }
    $("#ngErr").hidden = true; store.set(k, {items, at: todayKey()});
    tone(784,.12); setTimeout(() => tone(1047,.2), 110); try { navigator.vibrate?.(30); } catch(e){}
    show(false);
  };
  $("#ngEdit").onclick = () => show(true);
  show(!saved);
}
function renderHomeGoal(){
  const now = new Date(), g = store.get(goalKey(now), null);
  $("#hGoalCard").hidden = !g;
  if (g) { $("#hGoalMonth").textContent = now.toLocaleDateString("he-IL", {month:"long"}); $("#hGoalList").innerHTML = g.items.map(t => `<li>${t.replace(/</g,"&lt;")}</li>`).join(""); }
}

/* ---------- health questionnaire (asked at sign-up) ---------- */
const HQ = [
  "האם רופא אמר לך פעם שיש לך בעיה בלב או לחץ דם גבוה?",
  "האם את מרגישה כאב בחזה במנוחה, ביום־יום או במאמץ?",
  "האם קרה שאיבדת שיווי משקל בגלל סחרחורת, או שאיבדת הכרה, בשנה האחרונה?",
  "האם אובחנת עם מחלה כרונית (למשל סוכרת, אסתמה, בעיה בבלוטת התריס)?",
  "האם את נוטלת תרופות באופן קבוע?",
  "האם יש לך פציעה או כאב בגב, במפרקים או בעצמות שעלול להחמיר בפעילות?",
  "האם עברת ניתוח בשנה האחרונה?",
  "האם את בהריון, או שילדת בשנה האחרונה?",
  "האם רופא אמר לך להתאמן רק בהשגחה רפואית?"
];
const healthKey = `emily:${cid}:health`;
let hqAns = {};
function renderHQ(){
  const saved = store.get(healthKey, null);
  hqAns = saved ? Object.assign({}, saved.answers) : {};
  $("#hqMore").value = saved ? (saved.more || "") : ""; $("#hqDecl").checked = !!(saved && saved.declared);
  $("#hq").innerHTML = HQ.map((q, i) => `<div class="hqi" id="hqi${i}"><p>${q}</p>
    <div class="yn"><button type="button" data-q="${i}" data-v="no" aria-pressed="${hqAns[i]?.v === "no"}">לא</button><button type="button" data-q="${i}" data-v="yes" aria-pressed="${hqAns[i]?.v === "yes"}">כן</button></div>
    <textarea data-q="${i}" placeholder="פרטי בקצרה" ${hqAns[i]?.v === "yes" ? "" : "hidden"}>${(hqAns[i]?.note || "").replace(/</g,"&lt;")}</textarea></div>`).join("");
  $("#hq").querySelectorAll(".yn button").forEach(b => b.onclick = () => {
    const i = +b.dataset.q; hqAns[i] = Object.assign(hqAns[i] || {}, {v: b.dataset.v});
    b.parentElement.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
    $(`#hqi${i} textarea`).hidden = b.dataset.v !== "yes"; $(`#hqi${i}`).classList.remove("missing");
    $("#hqWarn").hidden = !Object.values(hqAns).some(a => a.v === "yes");
  });
  $("#hq").querySelectorAll("textarea").forEach(t => t.oninput = () => { const i = +t.dataset.q; hqAns[i] = Object.assign(hqAns[i] || {}, {note: t.value}); });
  $("#hqWarn").hidden = !Object.values(hqAns).some(a => a.v === "yes");
}
$("#hqNext").addEventListener("click", () => {
  const missing = HQ.map((_, i) => i).filter(i => !hqAns[i] || !hqAns[i].v);
  missing.forEach(i => $(`#hqi${i}`).classList.add("missing"));
  const err = missing.length ? `נשארו ${missing.length} שאלות בלי תשובה.` : !$("#hqDecl").checked ? "סמני את ההצהרה כדי להמשיך." : "";
  $("#hqErr").textContent = err; $("#hqErr").hidden = !err;
  if (err) { if (missing.length) $(`#hqi${missing[0]}`).scrollIntoView({behavior:"smooth", block:"center"}); return; }
  store.set(healthKey, {answers: hqAns, more: $("#hqMore").value.trim(), declared: true, at: todayKey()});
  PROFILE = Object.assign({}, PROFILE || {}, {submitted: todayKey()}); store.set(PROFILE_KEY, PROFILE);
  sendToEmily();
  afterDeclaration();
});
$("#hqBack").addEventListener("click", () => obStep(1));

/* photo consent, mirrored on sign-up and home */
function paintConsent(){ const on = !!(PROFILE && PROFILE.photoConsent); $("#phConsent").checked = on; $("#phConsentHome").checked = on; }
[$("#phConsent"), $("#phConsentHome")].forEach(c => c.addEventListener("change", () => {
  PROFILE = Object.assign({}, PROFILE || {}, {photoConsent: c.checked}); store.set(PROFILE_KEY, PROFILE); paintConsent();
}));


/* ---------- community: live presence of everyone who has the app open ---------- */
let room = null, myPeer = null;
const commOn = () => !(PROFILE && PROFILE.community === false);
const FACE_COLORS = ["#C8325F","#5B4038","#2F8A57","#E8508A","#9E2049","#B07A1E"];
const faceColor = s => FACE_COLORS[[...String(s)].reduce((a,c)=>a + c.charCodeAt(0), 0) % FACE_COLORS.length];
const esc = t => String(t ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function pushPresence(){
  if (!room) return;
  if (!commOn()) { room.presence({nm:null, mode:null, w:null, ttl:null, st:null, dn:null, al:null}).catch(()=>{}); return; }
  const t = (typeof totals === "function" && S) ? totals() : {done:0, all:0};
  const training = !!(S && S.start && !S.end);
  room.presence({nm: String(C.name).slice(0, 24), mode: training ? "training" : (S && S.end ? "done" : "online"),
    w: cur.w, ttl: C.workouts[cur.w].title, st: S && S.start || null, dn: t.done, al: t.all}).catch(()=>{});
}
function face(nm, training){ const n = String(nm || "?").trim(); return `<span class="face${training ? " tr" : ""}" style="background:${faceColor(n)}">${esc(n.slice(0,1))}</span>`; }
const cheered = new Set();
function renderCommunity(){
  const peers = room ? room.peers() : [];
  const me = peers.find(p => p.isMe && p.sameTab); if (me) myPeer = me.peer;
  const others = peers.filter(p => !p.isMe && p.kind === "viewer" && p.presence && p.presence.nm);
  const training = others.filter(p => p.presence.mode === "training");
  $("#commDot").classList.toggle("off", !training.length);
  $("#commTxt").textContent = others.length ? `${training.length} מתאמנות · ${others.length} מחוברות` : "";
  $("#commEmpty").hidden = others.length > 0;
  $("#commEmpty").textContent = room ? "כרגע רק את כאן. ברגע שעוד מתאמנת תתחיל, תראי אותה." : "כשעוד מתאמנות יפתחו את האפליקציה, תראי אותן כאן.";
  $("#commFaces").innerHTML = others.slice(0, 8).map(p => face(p.presence.nm, p.presence.mode === "training")).join("");
  const sorted = training.concat(others.filter(p => p.presence.mode !== "training")).slice(0, 6);
  $("#commList").innerHTML = sorted.map(p => {
    const pr = p.presence, mins = pr.st ? Math.max(1, Math.round((Date.now() - pr.st) / 60000)) : 0;
    const what = pr.mode === "training" ? `באימון ${esc(pr.w)} · ${esc(pr.ttl)} · ${mins} דק׳ · ${+pr.dn || 0}/${+pr.al || 0} סטים`
      : pr.mode === "done" ? "סיימה אימון היום ✓" : "מחוברת";
    const sent = cheered.has(p.peer);
    return `<div class="crow">${face(pr.nm, pr.mode === "training")}<div><b>${esc(pr.nm)}</b><span>${what}</span></div>
      <button type="button" class="cheer" data-peer="${esc(p.peer)}" ${sent ? "disabled" : ""}>${sent ? "נשלח 💪" : "שלחי כוח 💪"}</button></div>`;
  }).join("");
  $("#commList").querySelectorAll(".cheer").forEach(b => b.onclick = () => {
    if (!room) return;
    room.emit("cheer", {to: b.dataset.peer, from: String(C.name).slice(0, 24)}).then(() => {
      cheered.add(b.dataset.peer); b.disabled = true; b.textContent = "נשלח 💪"; tone(880,.08);
    }).catch(() => { b.textContent = "לא נשלח"; b.disabled = true; });
  });
  // on the workout screen: who is training with you right now
  $("#together").hidden = !training.length;
  if (training.length) {
    $("#togFaces").innerHTML = training.slice(0, 4).map(p => face(p.presence.nm, true)).join("");
    $("#togTxt").textContent = training.length === 1 ? `${training[0].presence.nm} מתאמנת איתך עכשיו` : `עוד ${training.length} מתאמנות איתך עכשיו`;
  }
}
function toast(text){
  const t = document.createElement("div"); t.className = "toast"; t.setAttribute("role","status"); t.textContent = text;
  document.body.appendChild(t); setTimeout(() => t.remove(), 3500);
}
$("#commOpt").addEventListener("change", e => {
  PROFILE = Object.assign({}, PROFILE || {}, {community: e.target.checked}); store.set(PROFILE_KEY, PROFILE); pushPresence();
});
(async () => {
  try { room = await window.claude?.use?.("room"); } catch(e){ room = null; }
  if (!room) { renderCommunity(); return; }
  room.onPeers(() => renderCommunity(), () => { room = null; renderCommunity(); });
  room.on("cheer", msg => {
    const d = msg.data || {};
    if (myPeer && d.to === myPeer && !msg.isMe) {
      toast(`${String(d.from || "מתאמנת").slice(0, 24)} שלחה לך כוח 💪`);
      tone(784,.1); setTimeout(() => tone(1047,.15), 100); try { navigator.vibrate?.([40,40,40]); } catch(e){}
    }
  });
  pushPresence();
  setInterval(renderCommunity, 30000);   // keep "minutes in" fresh
})();


/* ---------- tester feedback → WhatsApp ---------- */
const EMILY_WHATSAPP = "972524202756";   // e.g. "972501234567" — fill in to open WhatsApp directly
let fbRate = "";
document.querySelectorAll("#fbRate button").forEach(b => b.addEventListener("click", () => {
  fbRate = b.dataset.r; document.querySelectorAll("#fbRate button").forEach(x => x.setAttribute("aria-pressed", x === b));
}));
$("#fbSend").addEventListener("click", () => {
  const txt = $("#fbText").value.trim(), msg = $("#fbMsg");
  if (!fbRate && !txt) { msg.textContent = "בחרי דירוג או כתבי משהו קצר."; msg.hidden = false; return; }
  const wd = weekDone().filter(Boolean).length;
  const body = `משוב על האפליקציה מ${C.name}\nדירוג: ${fbRate || "-"}\n${txt}\n\n(אימונים השבוע: ${wd}, מכשיר: ${/iPhone|iPad/.test(navigator.userAgent) ? "iPhone" : /Android/.test(navigator.userAgent) ? "Android" : "מחשב"})`;
  if (EMILY_WHATSAPP) {
    const a = document.createElement("a"); a.href = `https://wa.me/${EMILY_WHATSAPP}?text=${encodeURIComponent(body)}`; a.target = "_blank"; a.rel = "noopener";
    document.body.appendChild(a); a.click(); a.remove();
    msg.textContent = "נפתח וואטסאפ עם ההודעה. רק ללחוץ שליחה."; msg.hidden = false;
  } else {
    navigator.clipboard.writeText(body).then(() => { msg.textContent = "ההודעה הועתקה. הדביקי אותה בוואטסאפ לאמילי."; msg.hidden = false; })
      .catch(() => { msg.textContent = "לא הצלחתי להעתיק. אפשר לצלם את המסך ולשלוח לאמילי."; msg.hidden = false; });
  }
});

/* ---------- sign-up answers → Emily on WhatsApp ---------- */
function answersText(){
  const P = PROFILE || {}, h = store.get(healthKey, null) || {answers:{}};
  const days = (P.days || []).slice().sort((a,b) => a-b).map(i => DAYFULL[i]).join(", ");
  const yes = HQ.map((q, i) => ({q, a: h.answers[i] || {}})).filter(x => x.a.v === "yes");
  const lines = [`שאלון הצטרפות מ${P.name || C.name} (${cid})`, `מטרות: ${(P.goals || []).join(", ") || "-"}`, `ימי אימון: ${days || "-"}, בשעה ${P.time || "-"}`, "",
    "הצהרת בריאות:", yes.length ? yes.map(x => `• כן: ${x.q}${x.a.note ? `\n  פירוט: ${x.a.note}` : ""}`).join("\n") : "• ענתה \"לא\" על כל השאלות",
    h.more ? `\nעוד משהו שחשוב לדעת: ${h.more}` : "", `\nהצהירה שהתשובות נכונות: ${h.declared ? "כן" : "לא"}`];
  return lines.filter(l => l !== "").join("\n");
}
function sendToEmily(){
  const a = document.createElement("a"); a.href = `https://wa.me/${EMILY_WHATSAPP}?text=${encodeURIComponent(answersText())}`; a.target = "_blank"; a.rel = "noopener";
  document.body.appendChild(a); a.click(); a.remove();
}
/* Gate: the plan opens only after Emily reviewed the declaration, built the plan and the trainee approved it on a call.
   Emily (via Claude) sets approved:true on the trainee's entry in CLIENTS. */
const OPEN_KEY = `emily:${cid}:planOpen`;
if (store.get(OPEN_KEY, false)) C.approved = true;   // seen as approved on the server, even if the browser still has an old app-1.js cached
function showWait(){ go("onboard"); obStep(2); $("#obH").hidden = true; $("#obWait").hidden = false; $("#waitMsg").hidden = true; }
function afterDeclaration(){ if (C.approved) { go("onboard"); renderCal(); obStep(3); } else showWait(); }
$("#waitCheck").addEventListener("click", () => {
  fetch("app-1.js?" + Date.now(), {cache:"no-store"}).then(r => r.text()).then(t => {
    const open = new RegExp(`\\b${cid}\\s*:\\s*\\{[^}]*approved\\s*:\\s*true`).test(t) || new RegExp(`APPROVED\\s*=\\s*\\[[^\\]]*"${cid}"`).test(t);
    if (open) { store.set(OPEN_KEY, true); location.reload(); } else { $("#waitMsg").textContent = "התוכנית עוד לא נפתחה. אמילי תעדכן אותך כשהיא מוכנה."; $("#waitMsg").hidden = false; }
  }).catch(() => location.reload());
});
$("#waitResend").addEventListener("click", sendToEmily);
$("#waitEdit").addEventListener("click", () => startOnboarding(1));

/* ---------- boot ---------- */
function renderAll(){ load(); finishState = null; pendingPush = null; stopPush(); restEnd = 0; restDoneAt = 0; $("#rest").hidden = true; renderDays(); renderPlaylists(); renderWorkout(); tick(); }
renderAll();
if (!C.approved && PROFILE && PROFILE.submitted) showWait();
else if (PROFILE && PROFILE.done) go("home");
else if (PROFILE && PROFILE.submitted) afterDeclaration();
else startOnboarding(1);
window.addEventListener("hashchange", () => location.reload());
