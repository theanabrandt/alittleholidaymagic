// Holiday Planner: Gift Finder, Secret Santa, Budget, Kids' Activities, Meal Planner.
// Pre-written content only. Everything a family types stays on their own device (localStorage).
import { AGES, INTERESTS, BUDGETS, GIFTS, ACT_AGES, ACTIVITIES, WORDS, HUNT, MEALS, DIETS, COURSE_NAMES, DISHES, BUDGET_CATS } from "./planner-data.js";

const CSS = `
.pl{--pb:var(--brand,#c61f2e);font-family:var(--body,system-ui);color:var(--ink,#1c2a21)}
.pl *{box-sizing:border-box}
.pl-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 16px}
.pl-tab{border:2px solid var(--line,#dce7df);background:#fff;border-radius:999px;padding:8px 14px;font:800 14px var(--body,system-ui);cursor:pointer;color:inherit}
.pl-tab[aria-selected=true]{background:var(--pb);border-color:var(--pb);color:#fff}
.pl-panel{background:var(--card,#fff);border:1px solid var(--line,#dce7df);border-radius:18px;padding:18px}
.pl h3{font-family:var(--display,inherit);font-size:24px;line-height:1.1;margin:0 0 4px}
.pl .pl-sub{color:var(--muted,#5b6d61);margin:0 0 14px;font-size:15px}
.pl-row{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px}
.pl-lbl{display:block;font-weight:800;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:var(--muted,#5b6d61);margin:10px 0 6px}
.pl-chip{border:1.5px solid var(--line,#dce7df);background:#fff;border-radius:999px;padding:6px 12px;font:700 14px var(--body,system-ui);cursor:pointer;color:inherit}
.pl-chip[aria-pressed=true]{background:var(--pb);border-color:var(--pb);color:#fff}
.pl-in{border:1.5px solid var(--line,#dce7df);border-radius:10px;padding:9px 11px;font:600 15px var(--body,system-ui);background:#fff;color:inherit;min-width:0}
.pl-btn{border:0;background:var(--pb);color:#fff;border-radius:999px;padding:10px 18px;font:800 15px var(--body,system-ui);cursor:pointer}
.pl-btn.ghost{background:#fff;color:var(--pb);box-shadow:inset 0 0 0 2px var(--pb)}
.pl-btn.small{padding:6px 12px;font-size:13px}
.pl-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,230px),1fr));gap:10px;margin-top:14px}
.pl-card{border:1px solid var(--line,#dce7df);border-radius:14px;padding:12px 14px;background:var(--paper,#fffdf9)}
.pl-card b{display:block;font-size:16px;line-height:1.25}
.pl-card span{display:block;color:var(--muted,#5b6d61);font-size:14px;margin-top:4px}
.pl-card i{display:inline-block;font-style:normal;font-size:12px;font-weight:800;color:var(--pb);margin-top:6px}
.pl-pick{border:2px solid var(--pb);background:#fff}
.pl-empty{color:var(--muted,#5b6d61);margin-top:12px}
.pl-names{display:grid;gap:8px}
.pl-pair{display:flex;gap:8px;align-items:center;max-width:560px}
.pl-pair .pl-in{flex:1 1 0;width:auto}
.pl-pair span{flex:none;font-weight:700;color:var(--muted,#5b6d61)}
.pl-links{display:grid;gap:8px;margin-top:14px}
.pl-link{display:flex;gap:8px;align-items:center;flex-wrap:wrap;border:1px solid var(--line,#dce7df);border-radius:12px;padding:10px 12px;background:var(--paper,#fffdf9)}
.pl-link b{flex:1 1 140px}
.pl-reveal{text-align:center;padding:28px 18px;border-radius:18px;background:var(--pb);color:#fff}
.pl-reveal h3{color:#fff;font-size:30px}
.pl-reveal .pl-big{font-family:var(--display,inherit);font-size:44px;line-height:1;margin:14px 0;background:#fff;color:var(--pb);border-radius:14px;padding:16px}
.pl-tbl{width:100%;border-collapse:collapse;margin-top:10px;font-size:15px}
.pl-tbl th{text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted,#5b6d61);padding:6px 4px}
.pl-tbl td{padding:4px}
.pl-tbl .pl-in{width:100%}
.pl-tbl td.num .pl-in{text-align:right}
.pl-sum{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin:14px 0}
.pl-stat{border-radius:14px;padding:12px;background:var(--paper,#fffdf9);border:1px solid var(--line,#dce7df)}
.pl-stat small{display:block;color:var(--muted,#5b6d61);font-weight:700}
.pl-stat b{font-family:var(--display,inherit);font-size:26px}
.pl-stat.over b{color:#b3261e}
.pl-bars{display:grid;gap:6px;margin-top:8px}
.pl-bar{display:grid;grid-template-columns:120px 1fr 150px;gap:8px;align-items:center;font-size:14px}
.pl-bar span:last-child{text-align:right;color:var(--muted,#5b6d61)}
.pl-bar.over div i{background:#b3261e}
.pl-bar.over span:last-child{color:#b3261e;font-weight:800}
.pl-bar div{height:10px;border-radius:99px;background:var(--line,#dce7df);overflow:hidden}
.pl-bar div i{display:block;height:100%;background:#1d6a44;border-radius:99px}
.pl-x{border:0;background:none;color:var(--muted,#5b6d61);font-size:20px;cursor:pointer;line-height:1}
.pl-menu{display:grid;gap:10px;margin-top:14px}
.pl-dish{display:grid;grid-template-columns:110px 1fr auto;gap:12px;align-items:start;border:1px solid var(--line,#dce7df);border-radius:14px;padding:12px;background:var(--paper,#fffdf9)}
.pl-dish small{font-weight:800;text-transform:uppercase;font-size:12px;letter-spacing:.05em;color:var(--pb);padding-top:3px}
.pl-dish b{display:block}.pl-dish span{color:var(--muted,#5b6d61);font-size:14px}
.pl-shop{columns:2 220px;margin-top:8px}
.pl-shop h4{margin:10px 0 4px;font-size:14px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted,#5b6d61)}
.pl-shop label{display:flex;gap:8px;font-size:15px;break-inside:avoid;padding:2px 0}
.pl-note{font-size:13px;color:var(--muted,#5b6d61);margin-top:10px}
@media(max-width:560px){.pl-dish{grid-template-columns:1fr}.pl-bar{grid-template-columns:70px 1fr auto;font-size:13px}
.pl-tbl thead{display:none}
.pl-tbl tr{display:grid;grid-template-columns:1fr 1fr 28px;gap:6px;padding:10px 0;border-bottom:1px solid var(--line,#dce7df)}
.pl-tbl td{padding:0}
.pl-tbl td:nth-child(2){grid-column:2/4}
.pl-tbl td.num{position:relative}
.pl-tbl td.num:before{content:attr(data-label);display:block;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:var(--muted,#5b6d61);margin-bottom:2px}
.pl-tbl td:last-child{grid-column:3;grid-row:2;align-self:end;padding-bottom:8px}}
`;

const el = (tag, attrs = {}, ...kids) => { const e = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) { if (v == null || v === false) continue; if (k === "class") e.className = v; else if (k.startsWith("on")) e[k] = v; else e.setAttribute(k, v === true ? "" : v); } kids.flat().forEach(k => k != null && e.append(k)); return e; };
const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
const money = n => "$" + (Math.round(n * 100) / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
function chips(options, { multi = false, value }, onChange) {
  let sel = multi ? new Set(value || []) : value;
  const row = el("div", { class: "pl-row", role: "group" });
  options.forEach(([v, label]) => {
    const b = el("button", { type: "button", class: "pl-chip", "aria-pressed": String(multi ? sel.has(v) : sel === v) }, label);
    b.onclick = () => {
      if (multi) { sel.has(v) ? sel.delete(v) : sel.add(v); b.setAttribute("aria-pressed", String(sel.has(v))); onChange([...sel]); }
      else { sel = sel === v ? null : v; row.querySelectorAll(".pl-chip").forEach((c, i) => c.setAttribute("aria-pressed", String(options[i][0] === sel))); onChange(sel); }
    };
    row.append(b);
  });
  return row;
}
function printPage(title, bodyHTML, brand) {
  const w = window.open("", "_blank"); if (!w) return alert("Please allow pop-ups to print.");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@800&family=Nunito:wght@600;800&display=swap"><style>body{font-family:Nunito,sans-serif;color:#1c2a21;margin:32px}h1{font-family:"Baloo 2",sans-serif;color:${brand};margin:0 0 6px;font-size:34px}p{margin:0 0 18px;color:#5b6d61}table.ws{border-collapse:collapse;margin:0 auto}table.ws td{width:34px;height:34px;text-align:center;font:800 20px Nunito,sans-serif;border:1px solid #dce7df}.words{columns:3;margin-top:20px;font-weight:800;font-size:17px}.words div{padding:3px 0}.hunt{display:grid;grid-template-columns:1fr 1fr;gap:12px}.hunt div{border:2px solid #dce7df;border-radius:12px;padding:14px;font-size:18px;font-weight:800}.hunt div:before{content:"";display:inline-block;width:18px;height:18px;border:2px solid ${brand};border-radius:5px;margin-right:10px;vertical-align:-3px}.foot{margin-top:28px;font-size:13px;color:#5b6d61;text-align:center}ul{line-height:1.8}@media print{body{margin:12mm}}</style></head><body>${bodyHTML}<script>document.fonts.ready.then(()=>setTimeout(()=>print(),300))<\/script></body></html>`);
  w.document.close();
}
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Secret Santa links: the match is tucked in the link itself, lightly scrambled so a quick glance won't spoil it.
const enc = o => { const s = btoa(unescape(encodeURIComponent(JSON.stringify(o)))).split("").reverse().join(""); return s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
const dec = s => { try { s = s.replace(/-/g, "+").replace(/_/g, "/").split("").reverse().join(""); while (s.length % 4) s = "=" + s; return JSON.parse(decodeURIComponent(escape(atob(s)))); } catch (e) { return null; } };

/**
 * Mount the planner.
 * opts: { brand, studio: {name, gift_pick, slug} | null, site: origin, footer: text, coloringBook: url }
 */
export function mountPlanner(root, opts = {}) {
  if (!document.getElementById("pl-css")) document.head.append(el("style", { id: "pl-css" }, CSS));
  const brand = opts.brand || getComputedStyle(document.documentElement).getPropertyValue("--brand").trim() || "#c61f2e";
  const S = opts.studio || null;
  const site = opts.site || location.origin;
  const who = S && S.name ? S.name : "A Little Holiday Magic";
  const KEY = "alhm-planner-" + (S && S.slug ? S.slug : "free") + "-";
  root.innerHTML = "";
  const wrap = el("div", { class: "pl" }); root.append(wrap);

  // A Secret Santa reveal link was opened: show only the reveal.
  const ss = new URLSearchParams(location.search).get("ss");
  if (ss) { const o = dec(ss); if (o && o.g && o.r) { renderReveal(wrap, o, brand); return; } }

  const TABS = [["gift", "🎁 Gift Finder", gifts], ["ss", "🎅 Secret Santa", secretSanta], ["budget", "💸 Budget", budget], ["kids", "🎄 Kids' Activities", kids], ["meal", "🍪 Meal Planner", meals]];
  const tabs = el("div", { class: "pl-tabs", role: "tablist" });
  const panel = el("div", { class: "pl-panel", role: "tabpanel" });
  let current = store.get(KEY + "tab", "gift");
  if (!TABS.some(t => t[0] === current)) current = "gift";
  TABS.forEach(([id, label, fn]) => {
    const b = el("button", { type: "button", class: "pl-tab", role: "tab", "aria-selected": String(id === current) }, label);
    b.onclick = () => { current = id; store.set(KEY + "tab", id); tabs.querySelectorAll(".pl-tab").forEach(x => x.setAttribute("aria-selected", "false")); b.setAttribute("aria-selected", "true"); panel.innerHTML = ""; fn(panel); };
    tabs.append(b);
  });
  wrap.append(tabs, panel);
  TABS.find(t => t[0] === current)[2](panel);

  // ---------- Gift Finder ----------
  function gifts(p) {
    const st = store.get(KEY + "gift", { age: null, tags: [], price: null });
    const out = el("div");
    const save = () => { store.set(KEY + "gift", st); draw(); };
    p.append(el("h3", {}, "Gift Finder"), el("p", { class: "pl-sub" }, "Pick who it's for, what they love, and your budget."),
      el("span", { class: "pl-lbl" }, "Who's it for?"), chips(AGES, { value: st.age }, v => { st.age = v; save(); }),
      el("span", { class: "pl-lbl" }, "What do they love? (pick any)"), chips(INTERESTS, { multi: true, value: st.tags }, v => { st.tags = v; save(); }),
      el("span", { class: "pl-lbl" }, "Budget"), chips(BUDGETS, { value: st.price }, v => { st.price = v; save(); }), out);
    function draw() {
      out.innerHTML = "";
      if (!st.age && !st.tags.length && !st.price) { out.append(el("p", { class: "pl-empty" }, "Choose at least one option above to see ideas.")); return; }
      const scored = GIFTS.filter(g => (!st.age || g.a.includes(st.age)) && (!st.price || g.p === st.price))
        .map(g => ({ g, s: st.tags.filter(t => g.t.includes(t)).length }))
        .filter(x => !st.tags.length || x.s > 0)
        .sort((a, b) => b.s - a.s || a.g.p - b.g.p);
      const list = el("div", { class: "pl-list" });
      if (S && S.gift_pick) list.append(el("div", { class: "pl-card pl-pick" }, el("i", {}, `${who} pick`), el("b", {}, S.gift_pick)));
      scored.slice(0, 12).forEach(({ g }) => list.append(el("div", { class: "pl-card" }, el("b", {}, g.n), el("span", {}, g.w), el("i", {}, BUDGETS.find(b => b[0] === g.p)[1]))));
      if (!scored.length) out.append(el("p", { class: "pl-empty" }, "Nothing matches all of that. Try a different budget or fewer interests."));
      out.append(list);
    }
    draw();
  }

  // ---------- Secret Santa ----------
  function secretSanta(p) {
    const st = store.get(KEY + "ss", { event: "", budget: "", date: "", names: ["", "", ""], rules: [] });
    p.append(el("h3", {}, "Secret Santa Generator"), el("p", { class: "pl-sub" }, "Add everyone, draw names, then send each person their own private link. Nobody sees the full list, not even you."));
    const grid = el("div", { class: "pl-row" });
    const field = (k, ph, type = "text") => { const i = el("input", { class: "pl-in", type, placeholder: ph, value: st[k], "aria-label": ph }); i.oninput = () => { st[k] = i.value; store.set(KEY + "ss", st); }; return i; };
    grid.append(field("event", "Group name (e.g. Brandt cousins)"), field("budget", "Spending limit (e.g. $30)"), field("date", "Exchange date", "date"));
    const names = el("div", { class: "pl-names" });
    const rulesBox = el("div", { class: "pl-names" });
    const out = el("div");
    function drawNames() {
      names.innerHTML = "";
      st.names.forEach((n, i) => {
        const inp = el("input", { class: "pl-in", placeholder: `Person ${i + 1}`, value: n, "aria-label": `Person ${i + 1}`, maxlength: "40" });
        inp.oninput = () => { st.names[i] = inp.value; store.set(KEY + "ss", st); drawRules(); };
        const x = el("button", { type: "button", class: "pl-x", "aria-label": "Remove", onclick: () => { st.names.splice(i, 1); store.set(KEY + "ss", st); drawNames(); drawRules(); } }, "×");
        names.append(el("div", { class: "pl-pair" }, inp, st.names.length > 3 ? x : null));
      });
    }
    function drawRules() {
      rulesBox.innerHTML = "";
      const list = st.names.map(s => s.trim()).filter(Boolean);
      st.rules.forEach((r, i) => {
        const sel = side => { const s = el("select", { class: "pl-in", "aria-label": "Person" }, el("option", { value: "" }, "Choose…"), list.map(n => el("option", { value: n, selected: r[side] === n }, n))); s.onchange = () => { r[side] = s.value; store.set(KEY + "ss", st); }; return s; };
        rulesBox.append(el("div", { class: "pl-pair" }, sel(0), el("span", {}, "can't draw"), sel(1), el("button", { type: "button", class: "pl-x", "aria-label": "Remove rule", onclick: () => { st.rules.splice(i, 1); store.set(KEY + "ss", st); drawRules(); } }, "×")));
      });
    }
    drawNames(); drawRules();
    p.append(grid, el("span", { class: "pl-lbl" }, "Who's playing?"), names,
      el("div", { class: "pl-row", style: "margin-top:8px" }, el("button", { type: "button", class: "pl-btn ghost small", onclick: () => { st.names.push(""); store.set(KEY + "ss", st); drawNames(); drawRules(); } }, "+ Add person")),
      el("span", { class: "pl-lbl" }, "Couples or anyone who shouldn't draw each other (optional)"), rulesBox,
      el("div", { class: "pl-row", style: "margin-top:8px" }, el("button", { type: "button", class: "pl-btn ghost small", onclick: () => { st.rules.push(["", ""]); store.set(KEY + "ss", st); drawRules(); } }, "+ Add a rule")),
      el("div", { class: "pl-row", style: "margin-top:14px" }, el("button", { type: "button", class: "pl-btn", onclick: draw }, "Draw names")), out);
    function draw() {
      out.innerHTML = "";
      const list = [...new Set(st.names.map(s => s.trim()).filter(Boolean))];
      if (list.length < 3) { out.append(el("p", { class: "pl-empty" }, "Add at least 3 different names.")); return; }
      const blocked = (a, b) => a === b || st.rules.some(([x, y]) => x && y && ((x === a && y === b) || (x === b && y === a)));
      let match = null;
      for (let t = 0; t < 3000 && !match; t++) { const r = shuffle(list); if (list.every((g, i) => !blocked(g, r[i]))) match = list.map((g, i) => [g, r[i]]); }
      if (!match) { out.append(el("p", { class: "pl-empty" }, "Those rules make a fair draw impossible. Remove a rule or add another person.")); return; }
      const base = S && S.slug ? `${site}/toolkit?s=${encodeURIComponent(S.slug)}&ss=` : `${site}/toolkit?ss=`;
      const links = el("div", { class: "pl-links" });
      match.forEach(([g, r]) => {
        const url = base + enc({ g, r, e: st.event.trim(), b: st.budget.trim(), d: st.date });
        const msg = `Hi ${g}! 🎅 Here's your Secret Santa${st.event ? " for " + st.event.trim() : ""}. Only you can see who you got: ${url}`;
        const copy = el("button", { type: "button", class: "pl-btn small" }, "Copy link");
        copy.onclick = () => navigator.clipboard.writeText(msg).then(() => { copy.textContent = "Copied"; setTimeout(() => copy.textContent = "Copy link", 1500); }).catch(() => prompt("Copy this:", msg));
        const share = navigator.share ? el("button", { type: "button", class: "pl-btn ghost small", onclick: () => navigator.share({ title: "Your Secret Santa", text: msg }).catch(() => {}) }, "Share") : null;
        links.append(el("div", { class: "pl-link" }, el("b", {}, `Link for ${g}`), copy, share));
      });
      out.append(el("p", { class: "pl-note" }, "Names are drawn. Send each person their own link (the text is copied with it). Drawing again makes all-new matches, so send the newest links only."), links);
    }
  }

  // ---------- Budget ----------
  function budget(p) {
    const st = store.get(KEY + "budget", { total: "", rows: [["Gifts", "", "", ""], ["Food", "Christmas dinner", "", ""], ["Decor", "", "", ""]] });
    const save = () => { store.set(KEY + "budget", st); summary(); };
    const total = el("input", { class: "pl-in", type: "number", min: "0", step: "1", inputmode: "decimal", placeholder: "e.g. 1200", value: st.total, "aria-label": "Total holiday budget" });
    total.oninput = () => { st.total = total.value; save(); };
    const tbody = el("tbody"); const sum = el("div");
    p.append(el("h3", {}, "Christmas Budget Planner"), el("p", { class: "pl-sub" }, "Set your total, add what you're planning to spend, and fill in what you actually spent as you go. Saved on this device."),
      el("span", { class: "pl-lbl" }, "Total holiday budget ($)"), total, sum,
      el("table", { class: "pl-tbl" }, el("thead", {}, el("tr", {}, el("th", {}, "Category"), el("th", {}, "For / what"), el("th", {}, "Planned"), el("th", {}, "Spent"), el("th", {}, ""))), tbody),
      el("div", { class: "pl-row", style: "margin-top:10px" },
        el("button", { type: "button", class: "pl-btn ghost small", onclick: () => { st.rows.push(["Gifts", "", "", ""]); save(); rows(); } }, "+ Add a line"),
        el("button", { type: "button", class: "pl-btn ghost small", onclick: printBudget }, "Print")));
    function rows() {
      tbody.innerHTML = "";
      st.rows.forEach((r, i) => {
        const cat = el("select", { class: "pl-in", "aria-label": "Category" }, BUDGET_CATS.map(c => el("option", { value: c, selected: r[0] === c }, c))); cat.onchange = () => { r[0] = cat.value; save(); };
        const what = el("input", { class: "pl-in", value: r[1], placeholder: "Mom, teacher gifts, tree…", "aria-label": "For or what" }); what.oninput = () => { r[1] = what.value; save(); };
        const num = k => { const n = el("input", { class: "pl-in", type: "number", min: "0", step: "0.01", inputmode: "decimal", value: r[k], placeholder: "0", "aria-label": k === 2 ? "Planned" : "Spent" }); n.oninput = () => { r[k] = n.value; save(); }; return n; };
        tbody.append(el("tr", {}, el("td", {}, cat), el("td", {}, what), el("td", { class: "num", "data-label": "Planned $" }, num(2)), el("td", { class: "num", "data-label": "Spent $" }, num(3)),
          el("td", {}, el("button", { type: "button", class: "pl-x", "aria-label": "Remove line", onclick: () => { st.rows.splice(i, 1); save(); rows(); } }, "×"))));
      });
    }
    function totals() {
      const by = {}; let planned = 0, spent = 0;
      st.rows.forEach(([c, , pl, sp]) => { const a = +pl || 0, b = +sp || 0; planned += a; spent += b; by[c] = by[c] || [0, 0]; by[c][0] += a; by[c][1] += b; });
      return { by, planned, spent, total: +st.total || 0 };
    }
    function summary() {
      const t = totals(); sum.innerHTML = "";
      const left = t.total - t.spent;
      sum.append(el("div", { class: "pl-sum" },
        el("div", { class: "pl-stat" }, el("small", {}, "Budget"), el("b", {}, money(t.total))),
        el("div", { class: "pl-stat" + (t.total && t.planned > t.total ? " over" : "") }, el("small", {}, "Planned"), el("b", {}, money(t.planned))),
        el("div", { class: "pl-stat" + (t.total && t.spent > t.total ? " over" : "") }, el("small", {}, "Spent so far"), el("b", {}, money(t.spent))),
        el("div", { class: "pl-stat" + (t.total && left < 0 ? " over" : "") }, el("small", {}, left < 0 ? "Over budget by" : "Left to spend"), el("b", {}, t.total ? money(Math.abs(left)) : "–"))));
      const bars = el("div", { class: "pl-bars" });
      Object.entries(t.by).filter(([, v]) => v[0] || v[1]).forEach(([c, [pl, sp]]) => {
        const over = sp > pl;
        const pct = pl ? Math.min(100, Math.round(sp / pl * 100)) : (sp ? 100 : 0);
        const note = over ? `${money(sp)} spent · ${money(sp - pl)} over` : `${money(sp)} of ${money(pl)}`;
        bars.append(el("div", { class: "pl-bar" + (over ? " over" : "") }, el("span", {}, c), el("div", {}, el("i", { style: `width:${pct}%` })), el("span", {}, note)));
      });
      if (bars.children.length) bars.prepend(el("p", { class: "pl-note", style: "margin:0 0 2px" }, "How much of each category's plan you've spent"));
      if (bars.children.length) sum.append(bars);
    }
    function printBudget() {
      const t = totals();
      const rowsH = st.rows.filter(r => r[1] || +r[2] || +r[3]).map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td style="text-align:right">${money(+r[2] || 0)}</td><td style="text-align:right">${money(+r[3] || 0)}</td></tr>`).join("");
      printPage("Christmas budget", `<h1>Our Christmas Budget</h1><p>Budget ${money(t.total)} · Planned ${money(t.planned)} · Spent ${money(t.spent)}</p><table style="width:100%;border-collapse:collapse" border="1" cellpadding="8"><tr><th align="left">Category</th><th align="left">For / what</th><th>Planned</th><th>Spent</th></tr>${rowsH}</table><div class="foot">${esc(who)}</div>`, brand);
    }
    rows(); summary();
  }

  // ---------- Kids' activities ----------
  function kids(p) {
    const st = store.get(KEY + "kids", { age: null, where: null, time: null, tidy: false, name: "" });
    const out = el("div");
    const save = () => { store.set(KEY + "kids", st); draw(); };
    const nm = el("input", { class: "pl-in", placeholder: "Child's first name (optional)", value: st.name, maxlength: "12", "aria-label": "Child's first name" });
    nm.oninput = () => { st.name = nm.value; store.set(KEY + "kids", st); };
    const tidy = el("button", { type: "button", class: "pl-chip", "aria-pressed": String(st.tidy) }, "No-mess only");
    tidy.onclick = () => { st.tidy = !st.tidy; tidy.setAttribute("aria-pressed", String(st.tidy)); save(); };
    p.append(el("h3", {}, "Kids' Christmas Activities"), el("p", { class: "pl-sub" }, "Holiday ideas for any afternoon, plus printables made with your child's name."),
      el("span", { class: "pl-lbl" }, "Age"), chips(ACT_AGES, { value: st.age }, v => { st.age = v; save(); }),
      el("span", { class: "pl-lbl" }, "Where"), chips([["in", "Indoors"], ["out", "Outdoors"]], { value: st.where }, v => { st.where = v; save(); }),
      el("span", { class: "pl-lbl" }, "How much time?"), chips([["s", "15 minutes"], ["m", "Under an hour"], ["l", "An afternoon"]], { value: st.time }, v => { st.time = v; save(); }),
      el("div", { class: "pl-row" }, tidy, el("button", { type: "button", class: "pl-chip", onclick: draw }, "🔀 Shuffle ideas")),
      out,
      el("span", { class: "pl-lbl", style: "margin-top:20px" }, "Printables"),
      el("div", { class: "pl-row" }, nm),
      el("div", { class: "pl-row" },
        el("button", { type: "button", class: "pl-btn small", onclick: wordSearch }, "Print a word search"),
        el("button", { type: "button", class: "pl-btn small", onclick: hunt }, "Print a holiday scavenger hunt"),
        opts.coloringBook ? el("a", { class: "pl-btn small ghost", href: opts.coloringBook, target: "_blank", rel: "noopener", style: "text-decoration:none" }, "Coloring book") : null));
    function draw() {
      out.innerHTML = "";
      const list = shuffle(ACTIVITIES.filter(a => (!st.age || a.a.includes(st.age)) && (!st.where || a.w === st.where || a.w === "either") && (!st.time || a.time === st.time) && (!st.tidy || !a.mess)));
      const box = el("div", { class: "pl-list" });
      list.slice(0, 9).forEach(a => box.append(el("div", { class: "pl-card" }, el("b", {}, a.n), el("span", {}, a.d), el("i", {}, { s: "15 min", m: "Under an hour", l: "An afternoon" }[a.time] + (a.mess ? " · a little messy" : "")))));
      if (!list.length) out.append(el("p", { class: "pl-empty" }, "No ideas match all of that. Try removing a filter."));
      out.append(box);
    }
    function wordSearch() {
      const kid = (st.name || "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 10);
      const young = st.age === "a" || st.age === "b";
      const N = young ? 10 : 13;
      const dirs = young ? [[0, 1], [1, 0]] : [[0, 1], [1, 0], [1, 1], [-1, 1]];
      const pool = shuffle(WORDS.filter(w => w.length <= N)).slice(0, young ? 7 : 11);
      if (kid.length >= 3) pool.unshift(kid);
      const g = Array.from({ length: N }, () => Array(N).fill(""));
      const placed = [];
      pool.forEach(w => {
        for (let t = 0; t < 400; t++) {
          const [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)];
          const r0 = Math.floor(Math.random() * N), c0 = Math.floor(Math.random() * N);
          const ok = [...w].every((ch, k) => { const r = r0 + dr * k, c = c0 + dc * k; return r >= 0 && r < N && c >= 0 && c < N && (!g[r][c] || g[r][c] === ch); });
          if (ok) { [...w].forEach((ch, k) => g[r0 + dr * k][c0 + dc * k] = ch); placed.push(w); break; }
        }
      });
      const AZ = "ABCDEFGHIJKLMNOPRSTUWY";
      const rows = g.map(r => "<tr>" + r.map(ch => `<td>${ch || AZ[Math.floor(Math.random() * AZ.length)]}</td>`).join("") + "</tr>").join("");
      const title = kid.length >= 3 ? `${st.name.trim()}'s Christmas Word Search` : "Christmas Word Search";
      printPage(title, `<h1>${esc(title)}</h1><p>Find every word. Words go across${young ? " and down" : ", down, and diagonally"}.</p><table class="ws">${rows}</table><div class="words">${placed.map(w => `<div>☐ ${w}</div>`).join("")}</div><div class="foot">Made with love by ${esc(who)}</div>`, brand);
    }
    function hunt() {
      const title = st.name.trim() ? `${st.name.trim()}'s Holiday Scavenger Hunt` : "Holiday Scavenger Hunt";
      printPage(title, `<h1>${esc(title)}</h1><p>Find each one around your house or neighborhood and check it off!</p><div class="hunt">${shuffle(HUNT).slice(0, 12).map(h => `<div>${h}</div>`).join("")}</div><div class="foot">Made with love by ${esc(who)}</div>`, brand);
    }
    draw();
  }

  // ---------- Meal Planner ----------
  function meals(p) {
    const st = store.get(KEY + "meal", { meal: "dinner", guests: 8, diets: [], budget: 2, picks: null });
    const out = el("div");
    const save = (reset = true) => { if (reset) st.picks = null; store.set(KEY + "meal", st); draw(); };
    const guests = el("input", { class: "pl-in", type: "number", min: "2", max: "60", value: st.guests, style: "width:110px", "aria-label": "Number of guests" });
    guests.oninput = () => { const n = Math.max(1, Math.min(60, parseInt(guests.value, 10) || 0)); if (n) { st.guests = n; save(false); } };
    p.append(el("h3", {}, "Christmas Meal Planner"), el("p", { class: "pl-sub" }, "Pick your meal, guest count, and any dietary needs. You'll get a full menu and one combined shopping list."),
      el("span", { class: "pl-lbl" }, "Which meal?"), chips(MEALS.map(m => [m[0], m[1]]), { value: st.meal }, v => { st.meal = v || "dinner"; save(); }),
      el("span", { class: "pl-lbl" }, "How many people?"), guests,
      el("span", { class: "pl-lbl" }, "Everyone can eat it (pick any)"), chips(DIETS, { multi: true, value: st.diets }, v => { st.diets = v; save(); }),
      el("span", { class: "pl-lbl" }, "Budget"), chips([[1, "Budget-friendly"], [2, "Classic"], [3, "Splurge"]], { value: st.budget }, v => { st.budget = v || 2; save(); }),
      out);
    function fits(d) { return st.diets.every(x => d.d.includes(x)); }
    function pickFor(course, taken) {
      const ok = DISHES.filter(d => d.c === course && fits(d) && !taken.includes(d.n));
      if (!ok.length) return null;
      const near = ok.filter(d => Math.abs(d.b - st.budget) <= (st.budget === 2 ? 1 : 0));
      const pool = near.length ? near : ok;
      return pool[Math.floor(Math.random() * pool.length)].n;
    }
    function draw() {
      out.innerHTML = "";
      const slots = MEALS.find(m => m[0] === st.meal)[2];
      if (!st.picks || st.picks.length !== slots.length) { const taken = []; st.picks = slots.map(c => { const n = pickFor(c, taken); if (n) taken.push(n); return n; }); store.set(KEY + "meal", st); }
      const menu = el("div", { class: "pl-menu" });
      const chosen = [];
      slots.forEach((c, i) => {
        const d = DISHES.find(x => x.n === st.picks[i]);
        if (!d) { menu.append(el("div", { class: "pl-dish" }, el("small", {}, COURSE_NAMES[c]), el("span", {}, "No dish in our list fits every dietary need you picked for this course."), el("span"))); return; }
        chosen.push(d);
        const swap = el("button", { type: "button", class: "pl-btn ghost small", onclick: () => { const n = pickFor(c, st.picks); if (n) { st.picks[i] = n; save(false); } } }, "Swap");
        menu.append(el("div", { class: "pl-dish" }, el("small", {}, COURSE_NAMES[c]), el("div", {}, el("b", {}, d.n), el("span", {}, d.s)), swap));
      });
      // Combined shopping list, scaled from 8 servings.
      const scale = st.guests / 8, items = {};
      chosen.forEach(d => d.i.forEach(([item, q, u, aisle]) => { const k = item + "|" + u; items[k] = items[k] || { item, u, aisle, q: 0, n: 0, max: 0 }; items[k].q += q * scale; items[k].n++; items[k].max = Math.max(items[k].max, q); }));
      // Staples bought by the container (oil, honey, herbs) are shared across dishes, so they don't simply add up.
      const STAPLE = ["bottle", "jar", "bag", "head", "bunch", "canister", "tub"];
      const PL = { bunch: "bunches", box: "boxes", head: "heads", bottle: "bottles", jar: "jars", bag: "bags", can: "cans", sheet: "sheets", canister: "canisters", tub: "tubs", carton: "cartons", pint: "pints", cup: "cups" };
      const fmtQ = it => {
        let q;
        if (STAPLE.includes(it.u)) q = Math.ceil(it.max) + Math.floor((it.n - 1) / 2) + (scale > 2 ? 1 : 0);
        else if (["lb", "oz", "cups", "gallon"].includes(it.u)) q = Math.max(0.5, Math.ceil(it.q * 2) / 2);
        else q = Math.max(1, Math.ceil(it.q));
        if (it.u === "oz" && q >= 32) return `${Math.ceil(q / 16 * 2) / 2} lb`;
        if (it.u === "gallon") return q <= 0.5 ? "1/2 gallon" : `${q} gallon${q > 1 ? "s" : ""}`;
        if (!it.u) return String(q);
        return `${q} ${q > 1 && PL[it.u] ? PL[it.u] : it.u}`;
      };
      const byAisle = {}; Object.values(items).sort((a, b) => a.item.localeCompare(b.item)).forEach(it => (byAisle[it.aisle] = byAisle[it.aisle] || []).push(it));
      const shop = el("div", { class: "pl-shop" });
      Object.keys(byAisle).sort().forEach(a => { shop.append(el("h4", {}, a)); byAisle[a].forEach(it => shop.append(el("label", {}, el("input", { type: "checkbox" }), `${it.item}: ${fmtQ(it)}`))); });
      const title = MEALS.find(m => m[0] === st.meal)[1];
      const printIt = () => printPage(title, `<h1>${esc(title)}</h1><p>For ${st.guests} people${st.diets.length ? " · " + st.diets.map(x => DIETS.find(d => d[0] === x)[1]).join(", ") : ""}</p><h2>Menu</h2><ul>${chosen.map(d => `<li><b>${esc(d.n)}</b>: ${esc(d.s)}</li>`).join("")}</ul><h2>Shopping list</h2>${Object.keys(byAisle).sort().map(a => `<h3>${a}</h3><ul>${byAisle[a].map(it => `<li>☐ ${esc(it.item)}: ${fmtQ(it)}</li>`).join("")}</ul>`).join("")}<div class="foot">${esc(who)}</div>`, brand);
      out.append(el("div", { class: "pl-row", style: "margin-top:14px" }, el("button", { type: "button", class: "pl-btn small", onclick: () => save(true) }, "🔀 New menu"), el("button", { type: "button", class: "pl-btn ghost small", onclick: printIt }, "Print menu and list")),
        menu, el("span", { class: "pl-lbl", style: "margin-top:18px" }, `Shopping list for ${st.guests}`), shop,
        el("p", { class: "pl-note" }, "Amounts are estimates. Check your pantry for salt, pepper, sugar, flour, and spices. Always check labels for allergens."));
    }
    draw();
  }
}

function renderReveal(wrap, o, brand) {
  if (!document.getElementById("pl-css")) document.head.append(el("style", { id: "pl-css" }, CSS));
  const hidden = el("div", { class: "pl-reveal" },
    el("h3", {}, `Hi ${o.g}! 🎅`),
    el("p", {}, o.e ? `Your Secret Santa for ${o.e} is ready.` : "Your Secret Santa is ready."),
    el("button", { type: "button", class: "pl-btn ghost", style: "background:#fff", onclick: show }, "Tap to see who you got"),
    el("p", { style: "font-size:13px;opacity:.85;margin-top:14px" }, `Not ${o.g}? Close this page so you don't spoil the surprise.`));
  wrap.append(hidden);
  function show() {
    hidden.innerHTML = "";
    const date = o.d ? new Date(o.d + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : "";
    hidden.append(...[el("h3", {}, "You're buying for…"), el("div", { class: "pl-big" }, o.r),
      o.b ? el("p", {}, `Spending limit: ${o.b}`) : null, date ? el("p", {}, `Gift exchange: ${date}`) : null,
      el("p", { style: "font-size:14px;opacity:.9" }, "Shh! Keep it a secret. Need ideas? Try the Gift Finder below.")].filter(Boolean));
    const more = el("p", { style: "margin-top:16px" }, el("a", { href: location.pathname + (new URLSearchParams(location.search).get("s") ? "?s=" + encodeURIComponent(new URLSearchParams(location.search).get("s")) : ""), style: "color:#fff;font-weight:800" }, "Open the Gift Finder"));
    hidden.append(more);
  }
}
