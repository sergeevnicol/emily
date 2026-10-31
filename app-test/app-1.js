/* ---------- Exercise library (shared by all clients) ---------- */
const LIB = {
  "hip-thrust":{name:"היפ טראסט עם מוט",tips:["השכמות על הספסל, הסנטר קרוב לחזה","דוחפים דרך העקבים ונועלים ישבן למעלה","בנקודה העליונה השוקיים ניצבות לרצפה"]},
  "goblet":{name:"גובלט סקוואט",tips:["המשקולת צמודה לחזה","המרפקים יורדים בין הברכיים","עולים דרך כל כף הרגל"]},
  "db-rdl":{name:"רומניאן דדליפט עם משקולות",tips:["ברכיים רכות, הירכיים זזות אחורה","המשקולות צמודות לרגליים","יורדים עד מתיחה מאחורי הירך, גב ישר"]},
  "kickback":{name:"קיקבק בעמידת שש",tips:["הגב ישר והבטן אסופה","דוחפים את העקב לכיוון התקרה","לא מקשתים את הגב התחתון"]},
  "hyperext":{name:"היפר אקסטנשן",tips:["התנועה מגיעה מהירכיים","מכווצים ישבן כדי לעלות","עוצרים בקו ישר, לא מעבר"]},
  "latpull":{name:"פולי עליון",tips:["מושכים את המרפקים למטה לכיוון הצלעות","החזה פתוח, בלי להישען הרבה אחורה","חוזרים למעלה לאט"]},
  "bench":{name:"לחיצת חזה עם מוט",tips:["השכמות צמודות לספסל","מורידים את המוט לקו החזה התחתון","כפות הרגליים יציבות על הרצפה"]},
  "cable-row":{name:"חתירה בכבל ביד אחת",tips:["עמידה יציבה, בטן אסופה","מושכים את המרפק אחורה ליד הגוף","מקרבים את השכמה לעמוד השדרה"]},
  "knee-tuck":{name:"קיפול ברכיים בישיבה",tips:["נשענים על הידיים מאחור","מקרבים את הברכיים לחזה","שולטים בירידה בלי לגעת ברצפה"]},
  "bulgarian":{name:"בולגרי ספליט סקוואט",tips:["רק קצה כף הרגל האחורית על הספסל","הטיה קלה קדימה מעבירה עבודה לישבן","הברך הקדמית לא נופלת פנימה"]},
  "db-hip-thrust":{name:"היפ טראסט עם משקולת",tips:["המשקולת על עצמות האגן","עוצרים שנייה למעלה ומכווצים","הסנטר קרוב לחזה"]},
  "sumo":{name:"סומו סקוואט",tips:["עמידה רחבה, אצבעות מעט החוצה","יורדים ישר למטה","לוחצים את הברכיים החוצה"]},
  "squat-bar":{name:"סקוואט עם מוט",tips:["הברכיים בכיוון האצבעות","החזה פתוח והבטן נעולה","יורדים לעומק שבו הגב נשאר ישר"]},
  "crunch":{name:"כפיפות בטן עם משקולת",tips:["הגב התחתון נשאר צמוד לרצפה","נושפים בעלייה","תנועה איטית ומבוקרת"]}
};

/* ---------- Clients. Each client opens the app with her own link: ...#maya ---------- */
const CLIENTS = {
  maya:{
    name:"מאיה", goal:"חיטוב וישבן", week:3, weeks:8, protein:100, approved:true,
    coach:"שבוע 3! מהיום מעלות קצת משקל כשכל החזרות יוצאות נקי. אני גאה בך.",
    // 0=Sunday ... 6=Saturday
    schedule:{0:"A",2:"B",4:"C"},
    workouts:{
      A:{title:"רגליים וישבן", list:[
        {id:"hip-thrust",fail:true,sets:4,reps:"8-10",rest:90,kg:30},
        {id:"goblet",sets:3,reps:"10",rest:90,kg:12},
        {id:"db-rdl",sets:3,reps:"10",rest:90,kg:10},
        {id:"kickback",fail:true,sets:3,reps:"12 לכל צד",rest:45},
        {id:"hyperext",fail:true,sets:3,reps:"12",rest:60}]},
      B:{title:"פלג גוף עליון", list:[
        {id:"latpull",fail:true,sets:3,reps:"10",rest:75,kg:25},
        {id:"bench",sets:3,reps:"10",rest:75,kg:20},
        {id:"cable-row",fail:true,sets:3,reps:"12 לכל יד",rest:60,kg:10},
        {id:"knee-tuck",fail:true,sets:3,reps:"12",rest:45}]},
      C:{title:"ישבן וגוף מלא", list:[
        {id:"bulgarian",sets:3,reps:"8 לכל רגל",rest:90,kg:6},
        {id:"db-hip-thrust",fail:true,sets:3,reps:"12",rest:60,kg:14},
        {id:"sumo",fail:true,sets:3,reps:"12",rest:75,kg:14},
        {id:"squat-bar",sets:3,reps:"10",rest:90,kg:20},
        {id:"crunch",fail:true,sets:3,reps:"15",rest:45,kg:4}]}
    },
    // meals built from her food questionnaire. slot: morning / noon / evening
    meals:[
      {name:"שקשוקה עם קוטג׳",p:32,min:15,slots:["morning","noon","evening"],tags:["חם","מהיר"],steps:["3 ביצים ברוטב עגבניות","כף גדושה קוטג׳ מעל בסוף","פרוסת לחם מלא בצד"]},
      {name:"פיתה עם חזה עוף וטחינה",p:38,min:10,slots:["noon","evening"],tags:["אחרי אימון","משביע"],steps:["150 גרם חזה עוף בגריל או מוכן מראש","פיתה מלאה, ירקות חתוכים","כף טחינה גולמית ולימון"]},
      {name:"קערת יוגורט חלבון",p:28,min:3,slots:["morning","noon","evening"],tags:["בלי בישול","מתוק"],steps:["גביע יוגורט חלבון","חופן פירות יער","כף גרנולה וקצת דבש"]},
      {name:"טונה, אורז ובטטה",p:34,min:20,slots:["noon","evening"],tags:["פחמימה טובה","מכינים מראש"],steps:["קופסת טונה במים","כוס אורז מבושל","חצי בטטה אפויה וסלט ירוק"]},
      {name:"טוסט קוטג׳ וביצה",p:26,min:7,slots:["morning","evening"],tags:["קליל"],steps:["2 פרוסות לחם מלא","קוטג׳ 5% ועגבנייה","ביצה קשה פרוסה מעל"]}
    ],
    outside:"במסעדה: מנה עיקרית עם חלבון (עוף, דג, סטייק) ותוספת ירקות. בחופשה: בארוחת הבוקר במלון מתחילות מביצים ויוגורט, ואז כל השאר."
  }
};
/* ---------- Beta testers (14-day test). Each one starts from the base plan above;
   Emily can give anyone her own plan by adding a full entry to CLIENTS with the same id.
   Links: .../#nicol  .../#alexandra  .../#roni  .../#michal  .../#emily ---------- */
const TESTERS = {nicol:"ניקול", alexandra:"אלכסנדרה", roni:"רוני", michal:"מיכל", emily:"אמילי"};
/* Whose plan is open. Add an id here after Emily reviewed the health declaration and the trainee approved her plan on a call. */
const APPROVED = [];
Object.entries(TESTERS).forEach(([id, name]) => {
  if (CLIENTS[id]) return;
  CLIENTS[id] = Object.assign(JSON.parse(JSON.stringify(CLIENTS.maya)), {
    name, week:1, weeks:2, approved: APPROVED.includes(id),
    coach:"ברוכה הבאה לבדיקה! שבועיים, שלושה אימונים בשבוע. כל הערה שלך עוזרת לי לבנות את האפליקציה."
  });
});

/* ---------- Spotify playlists (Emily's own). Paste each playlist's share link into url. ---------- */
const PLAYLISTS = [
  {name:"אימון רגליים · 60 דק׳", for:["A","C"], url:"https://open.spotify.com/search/gym%20workout%20hits/playlists"},
  {name:"פלג עליון · 60 דק׳",   for:["B"],     url:"https://open.spotify.com/search/upper%20body%20workout/playlists"},
  {name:"היפ הופ לאימון",        for:[],        url:"https://open.spotify.com/search/hip%20hop%20workout/playlists"},
  {name:"מזרחית לאימון",         for:[],        url:"https://open.spotify.com/search/%D7%9E%D7%96%D7%A8%D7%97%D7%99%D7%AA%20%D7%90%D7%99%D7%9E%D7%95%D7%9F/playlists"}
];

/* ---------- Emily's voice. When the recordings are ready, list the files here (e.g. "voice/push1.mp3").
   Until then the phone reads the lines below aloud. ---------- */
const VOICE_CLIPS = [];
const HYPE = [
  "סט אחרון! הולכות עד הסוף",
  "עוד אחת! את יכולה",
  "אל תעצרי עכשיו",
  "זה הסט שבונה את השריר",
  "כשזה שורף, זה עובד",
  "נשימה, ולדחוף!",
  "עוד חזרה אחת בשבילך",
  "אני איתך, עוד אחת!"
];

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const store = {
  get(k,d){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } },
  set(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
};
/* Video address: in secure mode a private, time-limited link from the server; otherwise the local file. */
const clip = f => (window.CLIP_URL && window.CLIP_URL[f]) || "clips/" + f;
const pad = n => String(n).padStart(2,"0");
const fmt = s => `${Math.floor(s/60)}:${pad(s%60)}`;
const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; };
const DAYN = ["א׳","ב׳","ג׳","ד׳","ה׳","ו׳","ש׳"];
const DAYFULL = ["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"];

const cid = (location.hash.slice(1) || "maya");
const C = CLIENTS[cid] || CLIENTS.maya;
const today = new Date().getDay();
const PROFILE_KEY = `emily:${cid}:profile`;
let PROFILE = store.get(PROFILE_KEY, null);
const BASE_SCHEDULE = Object.assign({}, C.schedule), BASE_NAME = C.name;
function applyProfile(){
  C.name = (PROFILE && PROFILE.name) || BASE_NAME;
  if (PROFILE && PROFILE.days && PROFILE.days.length) {
    C.schedule = {}; PROFILE.days.slice().sort((a,b)=>a-b).forEach((d,i) => C.schedule[d] = ["A","B","C"][i % 3]);
  } else C.schedule = Object.assign({}, BASE_SCHEDULE);
}
applyProfile();

function defaultWorkout(){
  if (C.schedule[today]) return {w:C.schedule[today], day:today};
  for (let i=1;i<=7;i++){ const d=(today+i)%7; if (C.schedule[d]) return {w:C.schedule[d], day:d}; }
  return {w:"A", day:today};
}
let cur = defaultWorkout();
const key = () => `emily:${cid}:${todayKey()}:${cur.w}`;
let S;  // state for current workout
function load(){ S = store.get(key(), {sets:{}, kg:{}, start:null, end:null}); }
function save(){ store.set(key(), S); }

/* ---------- header ---------- */
$("#weekLbl").textContent = `שבוע ${C.week} מתוך ${C.weeks}`;
$("#coachHi").textContent = `הודעה מאמילי · ${C.name}`;
$("#coachMsg").textContent = C.coach;

function renderDays(){
  const box = $("#days"); box.innerHTML = "";
  for (let d=0; d<7; d++){
    const w = C.schedule[d];
    const b = document.createElement("button");
    b.type = "button"; b.className = "day" + (w ? "" : " off") + (d===today ? " today" : "");
    b.innerHTML = `${DAYN[d]}<b>${w || "מנוחה"}</b>`;
    b.setAttribute("aria-pressed", w && cur.w===w && cur.day===d ? "true" : "false");
    if (!w) b.disabled = true;
    else b.addEventListener("click", () => { cur = {w, day:d}; renderAll(); });
    box.appendChild(b);
  }
}

/* ---------- workout ---------- */
const playIcon = '<svg viewBox="0 0 16 16"><path d="M4 2l10 6-10 6z"/></svg>';
const checkIcon = '<svg viewBox="0 0 16 16"><path d="M3 8.5l3.2 3L13 4.5"/></svg>';

function W(){ return C.workouts[cur.w]; }
function totals(){
  let done=0, all=0;
  W().list.forEach(e => { all += e.sets; done += (S.sets[e.id]||[]).filter(Boolean).length; });
  return {done, all};
}

function renderWorkout(){
  const w = W();
  const isToday = cur.day === today;
  $("#wLabel").textContent = isToday ? `האימון של היום · אימון ${cur.w}` : `האימון הבא · יום ${DAYFULL[cur.day]} · אימון ${cur.w}`;
  $("#wTitle").textContent = w.title;
  const all = w.list.reduce((a,e)=>a+e.sets,0);
  const mins = Math.round(w.list.reduce((a,e)=>a + e.sets*(45+e.rest),0)/60) + 5;
  $("#wFacts").innerHTML = `<span><b>${w.list.length}</b> תרגילים</span><span><b>${all}</b> סטים</span><span>כ־<b>${mins}</b> דקות</span>`;

  const list = $("#list"); list.innerHTML = "";
  w.list.forEach((e, i) => {
    const L = LIB[e.id];
    const done = S.sets[e.id] || Array(e.sets).fill(false);
    const card = document.createElement("article");
    card.className = "ex" + (done.every(Boolean) ? " done" : "");
    card.id = "ex-" + e.id;
    card.innerHTML = `
      <div class="head">
        <button type="button" class="thumb" aria-label="סרטון: ${L.name}">
          <video src="${clip(e.id + ".mp4")}" poster="${clip(e.id + ".jpg")}" muted loop playsinline preload="none"></video>
          <span class="p">${playIcon}</span>
        </button>
        <div>
          <div class="n">תרגיל ${i+1} מתוך ${w.list.length}</div>
          <h3>${L.name}</h3>
          <div class="meta">
            <span class="pill">${e.sets} סטים</span>
            <span class="pill">${e.reps} חזרות</span>
            <span class="pill">מנוחה ${e.rest} שנ׳</span>
            ${e.fail ? `<span class="pill fail">סט אחרון עד כשל</span>` : ""}
          </div>
        </div>
      </div>
      <div class="sets">${done.map((d,k)=>`<button type="button" class="set" data-k="${k}" aria-pressed="${d}" aria-label="סט ${k+1}"><span class="ring">${checkIcon}</span>סט ${k+1}</button>`).join("")}</div>
      ${e.kg !== undefined ? `<label class="kg" for="kg-${e.id}">משקל שעבדתי איתו<input type="number" inputmode="decimal" id="kg-${e.id}" placeholder="${e.kg}" value="${S.kg[e.id] ?? ""}"> ק״ג · מומלץ ${e.kg}</label>` : ""}
      <details><summary>דגשים לביצוע</summary><ul>${L.tips.map(t=>`<li>${t}</li>`).join("")}</ul></details>`;

    const th = card.querySelector(".thumb"), v = th.querySelector("video");
    th.addEventListener("click", () => {
      if (v.paused){ v.play().catch(()=>{}); th.classList.add("playing"); card.classList.add("big"); }
      else { v.pause(); th.classList.remove("playing"); card.classList.remove("big"); }
    });
    card.querySelectorAll(".set").forEach(b => b.addEventListener("click", () => toggleSet(e, +b.dataset.k)));
    const inp = card.querySelector("input");
    if (inp) inp.addEventListener("change", () => { S.kg[e.id] = inp.value === "" ? undefined : +inp.value; save(); });
    list.appendChild(card);
  });
  updateProgress();
}

function toggleSet(e, k){
  unlockAudio();
  if (!S.start) startWorkout(); else if (S.end) { S.end = null; }
  const arr = S.sets[e.id] || Array(e.sets).fill(false);
  arr[k] = !arr[k]; S.sets[e.id] = arr; save();
  if (pushEx && pushEx.id === e.id) stopPush();
  const card = $("#ex-"+e.id);
  card.querySelectorAll(".set")[k].setAttribute("aria-pressed", arr[k]);
  card.classList.toggle("done", arr.every(Boolean));
  updateProgress();
  if (arr[k]) {
    const t = totals();
    if (t.done < t.all) {
      const nextK = arr.findIndex(x => !x);
      // the set coming up is this exercise's last one → push to failure after the rest
      pendingPush = (e.fail && nextK === e.sets - 1 && arr.filter(x=>!x).length === 1) ? e : null;
      startRest(e.rest, nextLabel(e, arr));
    }
    else { stopRest(); }
  }
}
function nextLabel(e, arr){
  if (arr.some(x=>!x)) return `הבא: ${LIB[e.id].name}, סט ${arr.findIndex(x=>!x)+1}`;
  const nx = W().list.find(x => (S.sets[x.id]||[false]).some(v=>!v) || !S.sets[x.id]);
  return nx ? `הבא: ${LIB[nx.id].name}` : "";
}
function updateProgress(){
  const t = totals();
  $("#progTxt").textContent = `${t.done} מתוך ${t.all} סטים`;
  $("#progBar").style.width = (t.all ? t.done/t.all*100 : 0) + "%";
  $("#startBtn").hidden = !!S.start;
  paintFinish(t);
  pushPresence();
}

/* ---------- clock ---------- */
let wakeLock = null;
function startWorkout(){
  S.start = Date.now(); S.end = null; save(); updateProgress();
  try { navigator.wakeLock?.request("screen").then(l => wakeLock = l).catch(()=>{}); } catch(e){}
}
function tick(){
  if (S.start){
    const s = Math.floor(((S.end || Date.now()) - S.start)/1000);
    $("#clock").textContent = `${pad(Math.floor(s/60))}:${pad(s%60)}`;
  } else $("#clock").textContent = "00:00";
  restTick();
}
setInterval(tick, 250);
$("#startBtn").addEventListener("click", () => { unlockAudio(); startWorkout(); document.querySelector(".ex")?.scrollIntoView({behavior:"smooth"}); });

/* ---------- sound ---------- */
const SET = Object.assign({count:"emily", push:"on"}, store.get("emily:sound", {}));
if (SET.count === "voice") SET.count = "emily";
function paintSound(){ document.querySelectorAll(".tg").forEach(b => b.setAttribute("aria-pressed", SET[b.dataset.k] === b.dataset.v ? "true" : "false")); }
document.querySelectorAll(".tg").forEach(b => b.addEventListener("click", () => { SET[b.dataset.k] = b.dataset.v; store.set("emily:sound", SET); paintSound(); unlockAudio(); }));
paintSound();

let actx = null;
function unlockAudio(){
  try { if (navigator.audioSession) navigator.audioSession.type = "transient"; } catch(e){}  // iPhone: duck Spotify briefly instead of stopping it
  try { if (!actx) actx = new (window.AudioContext||window.webkitAudioContext)(); if (actx.state==="suspended") actx.resume(); } catch(e){}
  try { speechSynthesis.getVoices(); } catch(e){}
  loadClips();
}
/* Emily's recorded countdowns: one is picked for each rest and timed to finish exactly at 0 */
const COUNT_CLIPS = ["voice/count1.mp3","voice/count2.mp3","voice/count3.mp3"];
let clipBufs = [], clipsLoading = false, lastClip = -1;
function loadClips(){
  if (clipsLoading || !actx) return; clipsLoading = true;
  COUNT_CLIPS.forEach((u, i) => fetch(u).then(r => r.arrayBuffer())
    .then(b => new Promise((res, rej) => actx.decodeAudioData(b, res, rej)))
    .then(buf => { clipBufs[i] = buf; }).catch(()=>{}));
}
function pickClip(){
  const ready = clipBufs.map((b,i)=>b?i:-1).filter(i=>i>=0);
  if (!ready.length) return null;
  let i = ready[Math.floor(Math.random()*ready.length)];
  if (ready.length > 1 && i === lastClip) i = ready[(ready.indexOf(i)+1) % ready.length];
  lastClip = i; return clipBufs[i];
}
let clipSrc = null;
function playClipToEnd(buf, remainingSec){
  stopClip();
  try {
    const src = actx.createBufferSource(); src.buffer = buf;
    const g = actx.createGain(); g.gain.value = 1; src.connect(g); g.connect(actx.destination);
    src.start(0, Math.max(0, buf.duration - remainingSec));
    clipSrc = src;
  } catch(e){}
}
function stopClip(){ try { clipSrc?.stop(); } catch(e){} clipSrc = null; }
function tone(freq, dur){
  try { if (!actx) return; const o = actx.createOscillator(), g = actx.createGain();
    o.frequency.value = freq; g.gain.setValueAtTime(.2, actx.currentTime); g.gain.exponentialRampToValueAtTime(.001, actx.currentTime+dur);
    o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime+dur); } catch(e){}
}
function heVoice(){ try { return speechSynthesis.getVoices().find(v => v.lang && v.lang.toLowerCase().startsWith("he")); } catch(e){ return null; } }
function say(text){
  const v = heVoice(); if (!v) return false;
  try { const u = new SpeechSynthesisUtterance(text); u.lang = "he-IL"; u.voice = v; u.rate = 1.05;
    speechSynthesis.cancel(); speechSynthesis.speak(u); return true; } catch(e){ return false; }
}
const NUMS = {10:"עוד עשר שניות",5:"חמש",4:"ארבע",3:"שלוש",2:"שתיים",1:"אחת"};
function countCue(sec){
  if (SET.count === "off") return;
  if (SET.count === "emily" && restClip) return;
  if (sec <= 5) tone(880, .12);
  else if (sec === 10) { tone(660, .1); setTimeout(() => tone(660, .1), 160); }
}
function goCue(){
  if (SET.count === "off") return;
  try { navigator.vibrate?.([200,100,200]); } catch(e){}
  if (SET.count === "emily" && restClip) return;
  tone(1320, .45);
}

/* ---------- rest timer ---------- */
let restEnd = 0, restLen = 0, restDoneAt = 0, lastCue = null, pendingPush = null, restClip = null, restClipOn = false;
function sheetMode(m){
  const r = $("#rest"); r.classList.toggle("push", m === "push"); r.classList.remove("go");
  $("#plus15").hidden = m === "push"; $("#skip").hidden = m === "push";
  $("#pushDone").hidden = m !== "push"; $("#pushStop").hidden = m !== "push";
}
function startRest(sec, next){
  stopPush(true);
  restLen = sec; restEnd = Date.now() + sec*1000; restDoneAt = 0; lastCue = null;
  stopClip(); restClipOn = false;
  restClip = (SET.count === "emily" && actx) ? pickClip() : null;
  sheetMode("rest");
  $("#restNext").textContent = next || "";
  $("#restLbl").textContent = pendingPush ? "מנוחה · אחריה סט אחרון עד כשל" : "מנוחה";
  $("#rest").hidden = false; restTick();
}
function stopRest(){ restEnd = 0; stopClip(); if (!pushEx) $("#rest").hidden = true; }
function restEnded(){
  restEnd = 0;
  if (pendingPush) { const e = pendingPush; pendingPush = null; startPush(e); }
  else { $("#rest").classList.add("go"); $("#restLbl").textContent = "המנוחה נגמרה"; $("#restT").textContent = "יאללה!"; $("#restBar").style.width = "0%";
         restDoneAt = Date.now(); }
}
function restTick(){
  if (restDoneAt && !restEnd && !pushEx) { if (Date.now() - restDoneAt > 4000) { restDoneAt = 0; $("#rest").hidden = true; } return; }
  if (!restEnd) return;
  const left = Math.ceil((restEnd - Date.now())/1000);
  if (left > 0){
    $("#restT").textContent = fmt(left);
    $("#restBar").style.width = Math.max(0, left/restLen*100) + "%";
    const remain = (restEnd - Date.now())/1000;
    if (!restClip && !restClipOn && SET.count === "emily" && actx) restClip = pickClip();
    if (restClip && !restClipOn && remain <= restClip.duration + 0.05) { restClipOn = true; playClipToEnd(restClip, remain); }
    if (left !== lastCue && (left <= 5 || left === 10)) { lastCue = left; countCue(left); }
  } else { goCue(); restEnded(); }
}
$("#plus15").addEventListener("click", () => { if (restEnd) { restEnd += 15000; restLen += 15; if (restClipOn) { stopClip(); restClipOn = false; } } });
$("#skip").addEventListener("click", () => { stopClip(); if (pendingPush) { restEnded(); } else { restEnd = 0; restDoneAt = 0; $("#rest").hidden = true; } });

/* ---------- push to failure (last set) ---------- */
let pushEx = null, pushTimer = null, pushCount = 0, pushMuted = false, voicePlayer = null;
function hype(){
  if (pushMuted || SET.push === "off") return;
  if (VOICE_CLIPS.length) {
    try { voicePlayer?.pause(); voicePlayer = new Audio(VOICE_CLIPS[Math.floor(Math.random()*VOICE_CLIPS.length)]); voicePlayer.play().catch(()=>{}); } catch(e){}
    $("#restT").textContent = "עד הסוף!";
    return;
  }
  const line = pushCount === 0 ? HYPE[0] : HYPE[1 + Math.floor(Math.random()*(HYPE.length-1))];
  $("#restT").textContent = line;
  if (!say(line)) tone(990, .15);
}
function startPush(e){
  if (SET.push === "off") { $("#rest").hidden = true; return; }
  pushEx = e; pushCount = 0; pushMuted = false;
  sheetMode("push");
  $("#restLbl").textContent = `סט אחרון · ${LIB[e.id].name}`;
  $("#restNext").textContent = "ממשיכות עד שאין יותר חזרות נקיות";
  $("#rest").hidden = false;
  hype(); pushCount++;
  pushTimer = setInterval(() => { if (pushCount > 10) return stopPush(); hype(); pushCount++; }, 8000);
}
function stopPush(silent){
  if (!pushEx) return;
  clearInterval(pushTimer); pushTimer = null; pushEx = null;
  try { speechSynthesis.cancel(); } catch(e){}
  try { voicePlayer?.pause(); } catch(e){}
  sheetMode("rest");
  if (!silent) $("#rest").hidden = true;
}
$("#pushDone").addEventListener("click", () => {
  const e = pushEx; if (!e) return;
  const arr = S.sets[e.id] || Array(e.sets).fill(false);
  const k = arr.findIndex(x => !x);
  if (k >= 0) toggleSet(e, k); else stopPush();
});
$("#pushStop").addEventListener("click", () => { pushMuted = true; try { speechSynthesis.cancel(); voicePlayer?.pause(); } catch(e){} $("#restT").textContent = "את יכולה!"; });

document.addEventListener("pointerdown", unlockAudio, {once:true});

$("#nextBtn").addEventListener("click", showSummary);

/* ---------- monthly tracking (reads everything saved on this device) ---------- */
let mOff = 0;
function allLogs(){
  const pre = `emily:${cid}:`, out = {w:{}, p:{}};
  try {
    for (let i = 0; i < localStorage.length; i++){
      const k = localStorage.key(i); if (!k || !k.startsWith(pre)) continue;
      const [date, part] = k.slice(pre.length).split(":");
      const v = store.get(k, null); if (!v) continue;
      if (part === "protein") out.p[date] = v.g || 0;
      else if (C.workouts[part]) (out.w[date] ||= {})[part] = v;
    }
  } catch(e){}
  return out;
}
const ds = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
function renderMonth(){
  const now = new Date(), first = new Date(now.getFullYear(), now.getMonth() + mOff, 1);
  const days = new Date(first.getFullYear(), first.getMonth()+1, 0).getDate();
  const L = allLogs(), todayS = ds(now);
  $("#mTitle").textContent = first.toLocaleDateString("he-IL", {month:"long"});
  $("#mSub").textContent = `${first.getFullYear()} · המעקב של ${C.name}`;
  $("#mNext").disabled = mOff >= 0;

  let done = 0, planned = 0, plannedSoFar = 0, sets = 0, vol = 0, protDays = 0;
  const firstKg = {}, lastKg = {};
  let cells = DAYN.map(d => `<div class="dn">${d}</div>`).join("") + "<div></div>".repeat(first.getDay());
  let pRun = 0, pBest = 0, wRun = 0, wBest = 0;
  for (let d = 1; d <= days; d++){
    const day = new Date(first.getFullYear(), first.getMonth(), d), key = ds(day);
    const plan = C.schedule[day.getDay()], logs = L.w[key] || {};
    const fin = Object.entries(logs).filter(([w, v]) => v.end);
    fin.forEach(([w, v]) => {
      done++;
      C.workouts[w].list.forEach(e => {
        const n = (v.sets[e.id] || []).filter(Boolean).length; sets += n;
        const kg = v.kg[e.id] ?? e.kg ?? 0; vol += n * (parseInt(e.reps) || 0) * kg;
        if (v.kg[e.id] != null) { if (firstKg[e.id] == null) firstKg[e.id] = v.kg[e.id]; lastKg[e.id] = v.kg[e.id]; }
      });
    });
    const g = L.p[key] || 0, hit = g >= C.protein;
    if (hit) { protDays++; pRun++; pBest = Math.max(pBest, pRun); } else if (key < todayS) pRun = 0;
    if (plan) { planned++; if (key <= todayS) plannedSoFar++; }
    if (plan && key <= todayS) { if (fin.length) { wRun++; wBest = Math.max(wBest, wRun); } else if (key < todayS) wRun = 0; }
    else if (!plan && fin.length) { wRun++; wBest = Math.max(wBest, wRun); }
    const a = g ? Math.max(.15, Math.min(1, g / C.protein)) : 0;
    let cls = "cube" + (a >= .6 ? " lit" : "") + (hit ? " full" : "") + (key > todayS ? " future" : "") + (key === todayS ? " today" : "");
    const mark = fin.length ? `<span class="w" title="אימון בוצע"></span>` : (plan && key < todayS ? `<span class="m" title="אימון שפוספס"></span>` : "");
    cells += `<div class="${cls}" style="--a:${a.toFixed(2)}" title="${d} · ${g} גרם חלבון"><span class="n">${d}</span>${mark}</div>`;
  }
  $("#mCal").innerHTML = cells;
  $("#mW").textContent = done;
  $("#mWs").textContent = mOff === 0 ? `מתוך ${plannedSoFar} שתוכננו עד היום` : `מתוך ${planned} שתוכננו`;
  $("#mSets").textContent = sets;
  $("#mSetsS").textContent = done ? `בממוצע ${Math.round(sets/done)} לאימון` : "";
  $("#mVol").textContent = vol.toLocaleString("he-IL");
  $("#mProt").textContent = protDays;
  $("#mProtS").textContent = `יעד: ${C.protein} גרם ביום`;

  // recap: past months always, the current month on its last day
  const isEnd = mOff < 0 || now.getDate() === days;
  $("#recap").hidden = !isEnd;
  if (isEnd) {
    const monthName = first.toLocaleDateString("he-IL", {month:"long"});
    const base = mOff < 0 ? planned : plannedSoFar;
    const pct = base ? Math.round(done / base * 100) : 0;
    let best = null; Object.keys(lastKg).forEach(id => { const d = lastKg[id] - firstKg[id]; if (d > 0 && (!best || d > best.d)) best = {id, d}; });
    $("#rEb").textContent = mOff < 0 ? "סיכום החודש" : "החודש נגמר היום";
    $("#rTitle").textContent = `${monthName} שלך`;
    const msg = pct >= 90 ? "חודש של אלופה. לא ויתרת לעצמך אפילו פעם אחת, וזה בדיוק מה שבונה גוף. בחודש הבא אנחנו מעלות הילוך."
      : pct >= 70 ? "חודש חזק. היו ימים שהיה קשה, ובכל זאת הגעת לרוב האימונים. עכשיו סוגרות את הפער."
      : pct >= 40 ? "התחלה טובה, אבל אני יודעת שיש בך יותר. בחודש הבא כל אימון מתוכנן קורה. בלי תירוצים."
      : "החודש הזה לא הלך כמו שתכננו. זה לא נגמר כאן: מחר מתחילות מחדש, ואני לא מוותרת עלייך.";
    $("#rMsg").innerHTML = `${msg}<small>אמילי</small>`;
    $("#rW").textContent = pct + "%";
    $("#rP").textContent = protDays;
    $("#rPS").textContent = pBest;
    $("#rWS").textContent = wBest;
    $("#rV").textContent = vol >= 1000 ? (vol/1000).toFixed(1) + "K" : vol;
    $("#rUp").textContent = best ? "+" + (+best.d.toFixed(1)) : "–";
    $("#rUpL").textContent = best ? `ק״ג ב${LIB[best.id].name}` : "השיפור הגדול";
    const target = Math.min(days, Math.max(protDays + 5, Math.round(days * .6)));
    const nxt = new Date(first.getFullYear(), first.getMonth()+1, 1), nDays = new Date(nxt.getFullYear(), nxt.getMonth()+1, 0).getDate();
    let nPlanned = 0; for (let d = 1; d <= nDays; d++) if (C.schedule[new Date(nxt.getFullYear(), nxt.getMonth(), d).getDay()]) nPlanned++;
    const wCount = store.get(weightKey, []).filter(x => x.d.startsWith(`${first.getFullYear()}-${pad(first.getMonth()+1)}`)).length;
    const sugg = [];
    sugg.push(protDays < days * .6
      ? {t:`לעמוד ביעד החלבון לפחות ${target} ימים`, why:`החודש: ${protDays} ימים`}
      : {t:`רצף של ${pBest + 3} ימים ביעד חלבון`, why:`הרצף הכי ארוך החודש: ${pBest}`});
    sugg.push(pct < 100
      ? {t:`להגיע לכל ${nPlanned} האימונים בחודש הבא`, why:`החודש: ${done} מתוך ${base}`}
      : {t:`לשמור על 100% אימונים גם בחודש הבא`, why:"לא פספסת אף אימון"});
    sugg.push(best
      ? {t:`להעלות עוד 2.5 ק״ג ב${LIB[best.id].name}`, why:`עלית ${+best.d.toFixed(1)} ק״ג החודש`}
      : {t:"לרשום משקל בכל תרגיל ולעלות בכל שבוע", why:"ככה נראה כמה את מתחזקת"});
    if (wCount < 4) sugg.push({t:"להישקל פעם בשבוע, בבוקר", why:`החודש: ${wCount} שקילות`});
    renderGoalPicker(nxt, sugg);
  }

  const ids = Object.keys(lastKg);
  $("#mProg").innerHTML = ids.length ? ids.map(id => {
    const a = firstKg[id], b = lastKg[id], d = +(b - a).toFixed(1);
    return `<div class="pr"><b>${LIB[id].name}</b><span class="d ${d <= 0 ? "same" : ""}">${d > 0 ? "<bdi>+" + d + "</bdi> ק״ג" : d < 0 ? "<bdi>" + d + "</bdi> ק״ג" : "יציב"}</span><span class="k">${+(+a).toFixed(1)} ק״ג ← ${+(+b).toFixed(1)} ק״ג</span></div>`;
  }).join("") : `<div class="empty">כשתרשמי משקלים באימונים, תראי כאן כמה עלית בכל תרגיל.</div>`;
}
function checkRecapBanner(){
  const now = new Date(), prev = new Date(now.getFullYear(), now.getMonth()-1, 1);
  const tag = `${prev.getFullYear()}-${pad(prev.getMonth()+1)}`, flag = `emily:${cid}:recapSeen:${tag}`;
  const L = allLogs(), had = Object.keys(L.w).concat(Object.keys(L.p)).some(k => k.startsWith(tag));
  if (!had || store.get(flag, false)) return;
  $("#rBannerT").textContent = `הסיכום של ${prev.toLocaleDateString("he-IL", {month:"long"})} מוכן`;
  $("#rBanner").hidden = false;
  $("#rBanner").onclick = () => { store.set(flag, true); $("#rBanner").hidden = true; mOff = -1; renderMonth();
    go("month", true); };
}
checkRecapBanner();
$("#monthBtn").addEventListener("click", () => {
  const b = $("#monthBtn"); if (b.classList.contains("added")) return go("month");
  b.classList.add("added"); $("#monthBtnT").textContent = "נוסף למעקב החודשי";
  tone(784,.12); setTimeout(() => tone(1047,.2), 110); try { navigator.vibrate?.(30); } catch(e){}
  setTimeout(() => { mOff = 0; go("month"); }, 750);
});
$("#mPrev").addEventListener("click", () => { mOff--; renderMonth(); });
$("#mNext").addEventListener("click", () => { if (mOff < 0) { mOff++; renderMonth(); } });
$("#mBack").addEventListener("click", () => go("home"));


/* ---------- playlists ---------- */
function renderPlaylists(){
  const sp = '<svg viewBox="0 0 16 16"><path d="M4 2l10 6-10 6z"/></svg>';
  const box = $("#pls"); box.innerHTML = "";
  [...PLAYLISTS].sort((a,b) => (b.for.includes(cur.w)) - (a.for.includes(cur.w))).forEach(p => {
    const a = document.createElement("a");
    a.className = "pl" + (p.for.includes(cur.w) ? " rec" : ""); a.href = p.url; a.target = "_blank"; a.rel = "noopener";
    a.innerHTML = `<span class="dot">${sp}</span><span>${p.name}${p.for.includes(cur.w) ? "<small>מומלץ לאימון הזה</small>" : ""}</span>`;
    a.addEventListener("click", unlockAudio);
    box.appendChild(a);
  });
}


/* ---------- finish + meals ---------- */
const LOCK = '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
const CHECK = '<svg viewBox="0 0 24 24"><path class="chk" d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
let finishState = null;   // "locked" | "ready" | "done"
function paintFinish(t, quiet){
  const btn = $("#finishBtn");
  if (S.end && t.done === t.all) {
    finishState = "done"; btn.className = "hold done";
    $("#holdLbl").innerHTML = `${CHECK} האימון נעול`; $("#holdHint").textContent = ""; $("#holdHint").hidden = true; $("#nextBtn").hidden = false;
    btn.setAttribute("aria-disabled","true"); return;
  }
  if (t.done === t.all) {
    const was = finishState; finishState = "ready"; $("#nextBtn").hidden = true; $("#holdHint").hidden = false;
    btn.className = "hold ready" + (was === "locked" && !quiet ? " unlock" : "");
    $("#holdLbl").textContent = "לחיצה ארוכה לנעילת האימון";
    $("#holdHint").textContent = "עשית את כל הסטים. מגיע לך הרגע הזה.";
    btn.setAttribute("aria-disabled","false");
    if (was === "locked" && !quiet) unlockMoment();
  } else {
    finishState = "locked"; btn.className = "hold"; $("#nextBtn").hidden = true; $("#holdHint").hidden = false;
    const left = t.all - t.done;
    $("#holdLbl").innerHTML = `${LOCK} עוד ${left} ${left === 1 ? "סט" : "סטים"} לסיום`;
    $("#holdMini").style.width = (t.done/t.all*100) + "%";
    $("#holdHint").textContent = "הכפתור נפתח רק כשכל הסטים מסומנים";
    btn.setAttribute("aria-disabled","true");
  }
}
function unlockMoment(){
  [523,659,784].forEach((f,i) => setTimeout(() => tone(f,.18), i*110));
  try { navigator.vibrate?.([40,60,40]); } catch(e){}
  setTimeout(() => $("#finishBtn").scrollIntoView({behavior:"smooth", block:"center"}), 250);
}

/* press and hold: fills over 1.2s with rising ticks; letting go early resets */
const HOLD_MS = 1200;
let holdStart = 0, holdRaf = 0, lastTick = -1;
function holdFrame(){
  const p = Math.min(1, (performance.now() - holdStart) / HOLD_MS);
  $("#holdFill").style.transform = `scaleX(${p})`;
  const step = Math.floor(p * 6);
  if (step !== lastTick && step < 6) { lastTick = step; tone(440 + step*90, .05); try { navigator.vibrate?.(12); } catch(e){} }
  if (p >= 1) return completeWorkout();
  holdRaf = requestAnimationFrame(holdFrame);
}
function holdDown(ev){
  if (finishState !== "ready") {
    if (finishState === "locked") { const b = $("#finishBtn"); b.animate([{transform:"translateX(0)"},{transform:"translateX(-6px)"},{transform:"translateX(6px)"},{transform:"translateX(0)"}],{duration:260}); try{navigator.vibrate?.(30);}catch(e){} }
    return;
  }
  ev.preventDefault(); unlockAudio();
  holdStart = performance.now(); lastTick = -1;
  $("#finishBtn").classList.add("holding"); $("#holdLbl").textContent = "נועלת את האימון...";
  holdRaf = requestAnimationFrame(holdFrame);
}
function holdUp(){
  if (finishState !== "ready" || !holdStart) return;
  cancelAnimationFrame(holdRaf); holdStart = 0;
  const f = $("#holdFill"); f.style.transition = "transform .25s"; f.style.transform = "scaleX(0)";
  setTimeout(() => f.style.transition = "", 260);
  $("#finishBtn").classList.remove("holding"); $("#holdLbl").textContent = "לחיצה ארוכה לנעילת האימון";
}
const fb = $("#finishBtn");
fb.addEventListener("pointerdown", holdDown);
["pointerup","pointerleave","pointercancel"].forEach(e => fb.addEventListener(e, holdUp));
fb.addEventListener("contextmenu", e => e.preventDefault());
fb.addEventListener("keydown", e => { if ((e.key === " " || e.key === "Enter") && !e.repeat && !holdStart) holdDown(e); });
fb.addEventListener("keyup", e => { if (e.key === " " || e.key === "Enter") holdUp(); });

function completeWorkout(){
  setTimeout(pushPresence, 50);
  cancelAnimationFrame(holdRaf); holdStart = 0;
  if (!S.start) S.start = Date.now();
  S.end = Date.now(); save(); pendingPush = null; stopPush(); restEnd = 0; $("#rest").hidden = true;
  try { wakeLock?.release(); } catch(e){}
  const b = $("#finishBtn"); b.classList.remove("holding","ready","unlock"); b.classList.add("done");
  $("#holdLbl").innerHTML = `${CHECK} האימון ננעל!`;
  [523,659,784,1047].forEach((f,i) => setTimeout(() => tone(f, i===3 ? .6 : .16), i*90));
  try { navigator.vibrate?.([60,40,60,40,180]); } catch(e){}
  confetti();
  setTimeout(() => { paintFinish(totals()); $("#nextBtn").scrollIntoView({behavior:"smooth", block:"center"}); try { navigator.vibrate?.(20); } catch(e){} }, 900);
}

/* celebration: pink dumbbells and water bottles burst out of the button */
function makeSprite(w, h, draw){
  const dpr = devicePixelRatio || 1, c = document.createElement("canvas");
  c.width = w*dpr; c.height = h*dpr; const x = c.getContext("2d"); x.scale(dpr,dpr); draw(x, w, h); return {c, w, h};
}
function rr(x, X, Y, W, H, R){ x.beginPath(); x.moveTo(X+R,Y); x.arcTo(X+W,Y,X+W,Y+H,R); x.arcTo(X+W,Y+H,X,Y+H,R); x.arcTo(X,Y+H,X,Y,R); x.arcTo(X,Y,X+W,Y,R); x.closePath(); }
function dumbbell(main, dark){
  return makeSprite(56, 26, (x, w, h) => {
    x.fillStyle = "#B9A7A3"; rr(x, 12, h/2-2.5, w-24, 5, 2.5); x.fill();               // bar
    x.fillStyle = "#8E7B76"; rr(x, w/2-8, h/2-3.5, 16, 7, 3); x.fill();                 // grip
    [[2,0],[w-12,0]].forEach(([px]) => {                                                  // outer plates
      x.fillStyle = main; rr(x, px, 1, 10, h-2, 4); x.fill();
      x.fillStyle = "rgba(255,255,255,.35)"; rr(x, px+2, 3, 3, h-8, 1.5); x.fill(); });
    [[12,0],[w-17,0]].forEach(([px]) => { x.fillStyle = dark; rr(x, px, 4, 5, h-8, 2.5); x.fill(); }); // inner plates
  });
}
function bottle(water, cap){
  return makeSprite(22, 50, (x, w, h) => {
    x.fillStyle = cap; rr(x, 6, 0, 10, 7, 2); x.fill();                                  // cap
    x.fillStyle = "rgba(210,232,248,.95)"; rr(x, 7, 6, 8, 5, 1.5); x.fill();              // neck
    x.fillStyle = "rgba(210,232,248,.95)"; rr(x, 1, 10, w-2, h-11, 6); x.fill();          // body
    x.fillStyle = water; rr(x, 1, 22, w-2, h-23, 6); x.fill();                            // water
    x.fillStyle = "#F8DCE4"; x.fillRect(1, 27, w-2, 9);                                   // label
    x.fillStyle = "#C8325F"; x.beginPath(); x.arc(w/2, 31.5, 2.6, 0, Math.PI*2); x.fill();
    x.fillStyle = "rgba(255,255,255,.55)"; rr(x, 4, 13, 3, h-18, 1.5); x.fill();          // shine
    x.strokeStyle = "rgba(90,140,180,.5)"; x.lineWidth = 1; rr(x, 1, 10, w-2, h-11, 6); x.stroke();
  });
}
let SPRITES = null;
function sprites(){
  if (!SPRITES) SPRITES = [
    dumbbell("#FF6E98","#C8325F"), dumbbell("#F7A8C4","#E8508A"), dumbbell("#E8508A","#9E2049"),
    dumbbell("#FFC2D6","#FF6E98"), bottle("rgba(98,174,232,.85)","#C8325F"), bottle("rgba(120,196,240,.85)","#FFFFFF"),
    bottle("rgba(98,174,232,.85)","#FF6E98")];
  return SPRITES;
}
function confetti(){
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cv = $("#confetti"), ctx = cv.getContext("2d"), dpr = devicePixelRatio || 1;
  cv.hidden = false; cv.width = innerWidth*dpr; cv.height = innerHeight*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
  const r = fb.getBoundingClientRect(), ox = r.left + r.width/2, oy = r.top + r.height/2;
  const SP = sprites();
  const P = Array.from({length:46}, (_, i) => { const a = -Math.PI/2 + (Math.random()-.5)*2.1, v = 9 + Math.random()*9;
    return {x:ox + (Math.random()-.5)*r.width*.5, y:oy, vx:Math.cos(a)*v, vy:Math.sin(a)*v, r:Math.random()*6.28, vr:(Math.random()-.5)*.25,
            s:.75 + Math.random()*.6, sp:SP[i % SP.length]}; });
  const t0 = performance.now(), DUR = 2800;
  (function f(now){
    const el = now - t0; ctx.clearRect(0,0,innerWidth,innerHeight);
    P.forEach(p => { p.vy += .36; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.globalAlpha = el < DUR-600 ? 1 : Math.max(0, (DUR-el)/600);
      ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.scale(p.s,p.s);
      ctx.drawImage(p.sp.c, -p.sp.w/2, -p.sp.h/2, p.sp.w, p.sp.h); ctx.restore(); });
    if (el < DUR) requestAnimationFrame(f); else { ctx.clearRect(0,0,innerWidth,innerHeight); cv.hidden = true; }
  })(t0);
}

function weekDone(){
  const now = new Date(), sun = new Date(now); sun.setDate(now.getDate() - now.getDay());
  const out = [];
  for (let d = 0; d < 7; d++){
    const day = new Date(sun); day.setDate(sun.getDate() + d);
    const ds = `${day.getFullYear()}-${pad(day.getMonth()+1)}-${pad(day.getDate())}`;
    out.push(["A","B","C"].some(w => { const st = store.get(`emily:${cid}:${ds}:${w}`, null); return st && st.end; }));
  }
  return out;
}

$("#backBtn").addEventListener("click", () => go("home"));

function protKey(){ return `emily:${cid}:${todayKey()}:protein`; }
function renderProtein(){
  const eaten = store.get(protKey(), {g:0, ids:[]});
  $("#protTxt").textContent = `${eaten.g} / ${C.protein} גרם`;
  $("#protBar").style.width = Math.min(100, eaten.g/C.protein*100) + "%";
  return eaten;
}
function showSummary(){
  const w = W(), t = totals();
  const mins = Math.max(1, Math.round((S.end - S.start)/60000));
  let vol = 0;
  w.list.forEach(e => {
    const n = (S.sets[e.id]||[]).filter(Boolean).length;
    const kg = S.kg[e.id] ?? e.kg ?? 0;
    const reps = parseInt(e.reps) || 0;
    vol += n * reps * kg;
  });
  $("#sumTitle").textContent = `כל הכבוד, ${C.name}!`;
  $("#stampTxt").textContent = `אימון ${cur.w} · ${w.title} · הושלם`;
  const wd = weekDone(), planned = Object.keys(C.schedule).length, n = wd.filter(Boolean).length;
  $("#streakTxt").textContent = n >= planned ? `השבוע סגור! ${n} מתוך ${planned} אימונים` : `${n} מתוך ${planned} אימונים השבוע. עוד ${planned-n} והשבוע סגור`;
  $("#streakWk").innerHTML = wd.map((ok,d) => `<span><i class="${ok ? "ok" : C.schedule[d] ? "plan" : ""}"></i>${DAYN[d]}</span>`).join("");
  $("#sTime").textContent = mins;
  $("#sSets").textContent = `${t.done}/${t.all}`;
  $("#sVol").textContent = vol.toLocaleString("he-IL");

  const h = new Date().getHours();
  const slot = h < 11 ? "morning" : h < 17 ? "noon" : "evening";
  const slotName = {morning:"ארוחת בוקר", noon:"ארוחת צהריים", evening:"ארוחת ערב"}[slot];
  $("#mealTitle").textContent = `${slotName} אחרי האימון`;
  $("#mealSub").textContent = "בחרתי לך אפשרויות מהאוכל שאת אוהבת, עם חלבון שעוזר לשרירים להתאושש.";
  const eaten = renderProtein();
  const box = $("#meals"); box.innerHTML = "";
  C.meals.filter(m => m.slots.includes(slot)).slice(0,3).forEach((m, i) => {
    const el = document.createElement("div");
    const id = `${slot}-${i}`;
    const has = eaten.ids.includes(m.name);
    el.className = "meal" + (has ? " eaten" : "");
    el.innerHTML = `<div class="mh"><h3>${m.name}</h3><span class="pg">${m.p} גר׳ חלבון</span></div>
      <div class="tags"><span class="pill">${m.min} דק׳ הכנה</span>${m.tags.map(t=>`<span class="pill">${t}</span>`).join("")}</div>
      <ol>${m.steps.map(s=>`<li>${s}</li>`).join("")}</ol>
      <button type="button" class="btn ate" ${has ? "disabled" : ""}>${has ? "נוסף לחלבון היומי" : "אכלתי את זה"}</button>`;
    el.querySelector(".ate").addEventListener("click", ev => {
      const cur = store.get(protKey(), {g:0, ids:[]});
      if (cur.ids.includes(m.name)) return;
      cur.g += m.p; cur.ids.push(m.name); store.set(protKey(), cur);
      ev.currentTarget.textContent = "נוסף לחלבון היומי"; ev.currentTarget.disabled = true;
      el.classList.add("eaten"); renderProtein();
      const mb = $("#monthBtn"); mb.classList.remove("glow"); void mb.offsetWidth; mb.classList.add("glow");
      setTimeout(() => mb.scrollIntoView({behavior:"smooth", block:"center"}), 300);
    });
    box.appendChild(el);
  });
  $("#outTip").innerHTML = `<b>אוכלת בחוץ היום?</b>${C.outside}`;
  const mb = $("#monthBtn"); mb.classList.remove("added","glow"); $("#monthBtnT").textContent = "הוספה למעקב החודשי";
  go("sum");
}
