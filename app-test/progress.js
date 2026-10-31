/* Progress graphs, shared by the app (one trainee) and admin.html (all trainees).
   Input is a map of saved keys for one trainee: { "emily:<cid>:<rest>": value }.
   Nothing here touches storage; callers pass the data in. */
window.Progress = (() => {
  const pad = n => String(n).padStart(2, "0");
  const ds = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const parse = s => { const [y,m,d] = s.split("-").map(Number); return new Date(y, m-1, d); };
  const fmtD = s => { const [, m, d] = s.split("-"); return `${+d}/${+m}`; };
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const weekStart = d => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() - x.getDay()); return x; };

  /* Pull workouts, protein, body weight and the plan summary out of the saved keys. */
  function collect(map, cid){
    const pre = `emily:${cid}:`, out = {workouts:[], protein:{}, weight:[], meta:{}, profile:{}};
    Object.entries(map || {}).forEach(([k, v]) => {
      if (!k.startsWith(pre) || v == null) return;
      const rest = k.slice(pre.length), parts = rest.split(":");
      if (rest === "weight") out.weight = (Array.isArray(v) ? v : []).slice();
      else if (rest === "meta") out.meta = v || {};
      else if (rest === "profile") out.profile = v || {};
      else if (/^\d{4}-\d\d-\d\d$/.test(parts[0]) && parts.length === 2) {
        if (parts[1] === "protein") out.protein[parts[0]] = (v && v.g) || 0;
        else if (/^[A-Z]$/.test(parts[1]) && v && v.end) out.workouts.push({d: parts[0], w: parts[1], kg: v.kg || {}});
      }
    });
    out.workouts.sort((a,b) => a.d < b.d ? -1 : 1);
    out.weight.sort((a,b) => a.d < b.d ? -1 : 1);
    out.perWeek = (out.profile.days && out.profile.days.length) || out.meta.perWeek || 3;
    out.proteinGoal = out.meta.protein || 100;
    return out;
  }

  /* The last n weeks (Sunday to Saturday), oldest first. */
  function weeks(P, n = 8){
    const now = weekStart(new Date()), res = [];
    for (let i = n - 1; i >= 0; i--){
      const s = new Date(now); s.setDate(s.getDate() - 7*i);
      const e = new Date(s); e.setDate(e.getDate() + 6);
      const a = ds(s), b = ds(e);
      res.push({
        d: a,
        done: P.workouts.filter(x => x.d >= a && x.d <= b).length,
        prot: Object.entries(P.protein).filter(([d, g]) => d >= a && d <= b && g >= P.proteinGoal).length
      });
    }
    return res;
  }

  /* Weight lifted per exercise over time: { id: [{d, kg}] }, the heaviest of each day. */
  function strength(P){
    const out = {};
    P.workouts.forEach(x => Object.entries(x.kg).forEach(([id, kg]) => {
      kg = +kg; if (!(kg > 0)) return;
      const arr = out[id] ||= [], last = arr[arr.length-1];
      if (last && last.d === x.d) last.kg = Math.max(last.kg, kg); else arr.push({d: x.d, kg});
    }));
    return out;
  }

  /* Headline numbers for Emily's cards. */
  function summary(P){
    const W = weeks(P, 1)[0], S = strength(P);
    let best = null;
    Object.entries(S).forEach(([id, a]) => { const d = a[a.length-1].kg - a[0].kg; if (d > 0 && (!best || d > best.d)) best = {id, d: +d.toFixed(1)}; });
    const last = P.workouts.length ? P.workouts[P.workouts.length-1].d : null;
    const daysSince = last ? Math.round((parse(ds(new Date())) - parse(last)) / 864e5) : null;
    const w = P.weight, wDelta = w.length > 1 ? +(w[w.length-1].kg - w[0].kg).toFixed(1) : null;
    return {thisWeek: W.done, perWeek: P.perWeek, total: P.workouts.length, last, daysSince, best,
            weightNow: w.length ? w[w.length-1].kg : null, wDelta};
  }

  /* ---- charts (inline SVG, one series each, hover/tap tooltip) ---- */
  function hookTips(box, pts){
    const tip = box.querySelector(".tip"), sv = box.querySelector("svg"); if (!tip || !sv) return;
    box.querySelectorAll(".hit").forEach(c => {
      const show = () => { const p = pts[+c.dataset.i], k = sv.getBoundingClientRect().width / sv.viewBox.baseVal.width;
        tip.textContent = p.tip; tip.style.left = p.x*k + "px"; tip.style.top = p.y*k + "px"; tip.hidden = false; };
      c.addEventListener("pointerenter", show); c.addEventListener("click", show);
      c.addEventListener("pointerleave", () => tip.hidden = true);
    });
  }

  /* Line over time. data: [{d, v}], unit: "ק״ג". */
  function line(box, data, unit, label){
    if (data.length < 2) { box.innerHTML = `<div class="empty">${esc(label || "עוד אין מספיק נתונים לגרף.")}</div>`; return; }
    const pts = data.slice(-16), Wd = 320, Ht = 130, pl = 8, pr = 40, pt = 14, pb = 22;
    const ys = pts.map(p => p.v); let lo = Math.floor(Math.min(...ys) - .5), hi = Math.ceil(Math.max(...ys) + .5);
    if (hi - lo < 2) { hi++; lo--; }
    const X = i => pl + i * (Wd - pl - pr) / (pts.length - 1), Y = v => pt + (hi - v) / (hi - lo) * (Ht - pt - pb);
    const P = pts.map((p,i) => ({x: X(i), y: Y(p.v), tip: `${fmtD(p.d)} · ${p.v} ${unit}`}));
    let svg = `<svg viewBox="0 0 ${Wd} ${Ht}" style="direction:ltr" role="img" aria-label="${esc(label || "גרף")}">`;
    [hi, Math.round((hi+lo)/2), lo].forEach(v => { svg += `<line x1="${pl}" x2="${Wd-pr}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)" stroke-width="1"/><text x="${Wd-pr+12}" y="${Y(v)+4}" font-size="10" fill="var(--muted)">${v}</text>`; });
    svg += `<text x="${X(0)}" y="${Ht-4}" font-size="10" fill="var(--muted)" text-anchor="start">${fmtD(pts[0].d)}</text><text x="${X(pts.length-1)}" y="${Ht-4}" font-size="10" fill="var(--muted)" text-anchor="end">${fmtD(pts[pts.length-1].d)}</text>`;
    svg += `<path d="${P.map((p,i) => (i ? "L" : "M") + p.x.toFixed(1) + "," + p.y.toFixed(1)).join("")}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
    P.forEach((p,i) => { svg += `<circle cx="${p.x}" cy="${p.y}" r="${i === P.length-1 ? 5 : 3}" fill="var(--accent)" stroke="var(--surface)" stroke-width="2"/>`; });
    P.forEach((p,i) => { svg += `<circle class="hit" data-i="${i}" cx="${p.x}" cy="${p.y}" r="14" fill="transparent"/>`; });
    box.innerHTML = svg + `</svg><div class="tip" hidden></div>`;
    hookTips(box, P);
  }

  /* Weekly bars with a dashed goal line. data: [{d, v}] one per week. */
  function bars(box, data, goal, unit, label){
    const Wd = 320, Ht = 130, pl = 8, pr = 40, pt = 16, pb = 22;
    const hi = Math.max(goal || 0, ...data.map(x => x.v), 1);
    const n = data.length, slot = (Wd - pl - pr) / n, bw = Math.min(26, slot - 6);
    const Y = v => pt + (hi - v) / hi * (Ht - pt - pb), base = Y(0);
    const P = [];
    let svg = `<svg viewBox="0 0 ${Wd} ${Ht}" style="direction:ltr" role="img" aria-label="${esc(label)}">`;
    svg += `<line x1="${pl}" x2="${Wd-pr}" y1="${base}" y2="${base}" stroke="var(--line)" stroke-width="1"/><text x="${Wd-pr+6}" y="${base+4}" font-size="10" fill="var(--muted)">0</text>`;
    if (goal) svg += `<line x1="${pl}" x2="${Wd-pr}" y1="${Y(goal)}" y2="${Y(goal)}" stroke="var(--muted)" stroke-width="1" stroke-dasharray="4 4"/><text x="${Wd-pr+6}" y="${Y(goal)+4}" font-size="10" fill="var(--muted)">יעד ${goal}</text>`;
    else svg += `<line x1="${pl}" x2="${Wd-pr}" y1="${Y(hi)}" y2="${Y(hi)}" stroke="var(--line)" stroke-width="1"/><text x="${Wd-pr+6}" y="${Y(hi)+4}" font-size="10" fill="var(--muted)">${hi}</text>`;
    data.forEach((x, i) => {
      const cx = pl + slot * (i + .5), h = base - Y(x.v), y = Y(x.v), r = Math.min(4, h);
      const met = goal && x.v >= goal;
      if (x.v > 0) svg += `<path d="M${cx-bw/2},${base}V${y+r}Q${cx-bw/2},${y} ${cx-bw/2+r},${y}H${cx+bw/2-r}Q${cx+bw/2},${y} ${cx+bw/2},${y+r}V${base}Z" fill="var(${met ? "--ok" : "--accent"})"/>`;
      if (i === 0 || i === n-1) svg += `<text x="${cx}" y="${Ht-4}" font-size="10" fill="var(--muted)" text-anchor="middle">${fmtD(x.d)}</text>`;
      P.push({x: cx, y: Math.min(y, base - 2), tip: `שבוע ${fmtD(x.d)} · ${x.v} ${unit}`});
      svg += `<rect class="hit" data-i="${i}" x="${cx - slot/2}" y="${pt}" width="${slot}" height="${base - pt}" fill="transparent"/>`;
    });
    box.innerHTML = svg + `</svg><div class="tip" hidden></div>`;
    hookTips(box, P);
  }

  /* Full progress panel: workouts per week, strength per exercise (chips), protein per week. */
  function panel(root, P, names){
    const W = weeks(P, 8), S = strength(P), ids = Object.keys(S).sort((a,b) => S[b].length - S[a].length);
    const nm = id => (names && names[id]) || (P.meta.ex && P.meta.ex[id]) || id;
    root.innerHTML = `
      <div class="pg"><h3>אימונים בשבוע</h3><p class="sub">8 השבועות האחרונים. ירוק = הגיעה ליעד השבועי</p><div class="chart" data-c="w"></div></div>
      <div class="pg"><h3>כוח בתרגילים</h3><p class="sub">המשקל שהרימה בכל אימון</p>
        <div class="pchips">${ids.map((id,i) => `<button type="button" data-id="${esc(id)}" aria-pressed="${i === 0}">${esc(nm(id))}</button>`).join("")}</div>
        <div class="chart" data-c="s"></div></div>
      <div class="pg"><h3>ימים ביעד חלבון</h3><p class="sub">בכל שבוע, יעד ${P.proteinGoal} גרם ביום</p><div class="chart" data-c="p"></div></div>`;
    bars(root.querySelector('[data-c="w"]'), W.map(x => ({d: x.d, v: x.done})), P.perWeek, "אימונים", "אימונים בשבוע");
    bars(root.querySelector('[data-c="p"]'), W.map(x => ({d: x.d, v: x.prot})), 0, "ימים", "ימים ביעד חלבון");
    const sBox = root.querySelector('[data-c="s"]');
    const showS = id => line(sBox, id ? S[id].map(x => ({d: x.d, v: x.kg})) : [], "ק״ג", "אחרי שני אימונים עם משקל רשום יופיע כאן גרף הכוח.");
    showS(ids[0]);
    root.querySelectorAll(".pchips button").forEach(b => b.onclick = () => {
      root.querySelectorAll(".pchips button").forEach(x => x.setAttribute("aria-pressed", x === b)); showS(b.dataset.id);
    });
  }

  return {collect, weeks, strength, summary, line, bars, panel, fmtD};
})();
