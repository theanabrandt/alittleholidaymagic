import { toyText, DEMO_STUDIO, DEFAULT_PHOTOS, NOTES, noteFor, decDate, RECIPES, COOKIE_KEY, QUIZ, QUIZ_FB, GIFTS, GIFTS_YEAR, STOPS, santaLines, herHim, petPhrase, RESERVED_SLUGS } from "./content.js";

const $ = id => document.getElementById(id);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const pick = a => a[Math.floor(Math.random() * a.length)];
const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
const now = new Date();
let xmas = new Date(now.getFullYear(), 11, 25);
if (now > new Date(now.getFullYear(), 11, 25, 23, 59)) xmas = new Date(now.getFullYear() + 1, 11, 25);

// ---------- Which studio? ----------
const path = location.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
const slug = (path[0] || "demo").toLowerCase();
const isDemo = slug === "demo" || slug === "santa.html" || slug === "santa";
const params = new URLSearchParams(location.search);

// Family code for private pages: from the link (?code=) or remembered on this device.
const CODE_KEY = "alhm-code-" + slug;
let familyCode = (params.get("code") || "").trim();
try { if (familyCode) localStorage.setItem(CODE_KEY, familyCode); else familyCode = localStorage.getItem(CODE_KEY) || ""; } catch (e) {}

async function loadStudio() {
  if (isDemo) return Object.assign({}, DEMO_STUDIO);
  if (RESERVED_SLUGS.includes(slug)) return null;
  try {
    const r = await fetch(`/api/studio?slug=${encodeURIComponent(slug)}${familyCode ? "&code=" + encodeURIComponent(familyCode) : ""}`);
    if (!r.ok) return null;
    return await r.json();
  } catch (e) { return null; }
}

function notFound() {
  $("boot").innerHTML = '<div><h1>We couldn\'t find that Santa page</h1><p>Check the link from your photographer, or <a href="/demo">try the demo</a>.</p></div>';
}

function lockScreen(S) {
  document.documentElement.style.setProperty("--brand", S.color || "#c61f2e");
  document.title = `Chat with Santa · ${S.name}`;
  const box = document.createElement("div"); box.className = "lock";
  const img = new Image(); img.alt = ""; img.src = (S.photos && S.photos.wave) || DEFAULT_PHOTOS.avatar;
  const h = document.createElement("h1"); h.textContent = "A Santa gift for our families";
  const p = document.createElement("p"); p.textContent = `This page is for ${S.name} families. Enter the family code from your booking email.`;
  const f = document.createElement("form");
  f.innerHTML = '<input class="field" id="codeIn" autocomplete="off" aria-label="Family code" placeholder="Family code"><button class="btn red" type="submit">Open</button>';
  const err = document.createElement("span"); err.className = "err"; err.hidden = !S.wrong; err.textContent = "That code didn't work. Check your booking email and try again.";
  f.onsubmit = e => { e.preventDefault(); const v = f.querySelector("input").value.trim(); if (!v) return; try { localStorage.setItem(CODE_KEY, v); } catch (x) {} const u = new URL(location.href); u.searchParams.set("code", v); location.href = u.toString(); };
  box.append(img, h, p, f, err);
  const link = (S.days || []).find(d => /^https?:\/\//.test(d.link || ""));
  if (link) { const b = document.createElement("p"); b.innerHTML = 'No code yet? <a class="book" target="_blank" rel="noopener">Book a Santa session</a>'; b.querySelector("a").href = link.link; box.append(b); }
  $("boot").innerHTML = ""; $("boot").append(box);
  if (S.wrong) { try { localStorage.removeItem(CODE_KEY); } catch (x) {} }
  setTimeout(() => f.querySelector("input").focus(), 50);
}

loadStudio().then(studio => {
  if (!studio) return notFound();
  if (studio.locked) return lockScreen(studio);
  start(studio);
});

function start(S) {
  const photos = Object.assign({}, DEFAULT_PHOTOS, S.photos || {});
  const customWave = S.photos && S.photos.wave;
  const P = k => photos[k] || DEFAULT_PHOTOS[k];
  const days = (S.days || []).filter(d => d && d.date);
  const visitIdx = parseInt(params.get("visit"), 10);
  const bookedDay = (visitIdx >= 1 && days[visitIdx - 1]) ? days[visitIdx - 1] : null;
  const studioName = S.name || "your photographer";

  // ---------- Brand ----------
  document.title = `Chat with Santa · ${studioName}`;
  document.documentElement.style.setProperty("--brand", S.color || "#c61f2e");
  const initials = n => n.replace(/&/g, "").split(/\s+/).filter(w => w && !/^(photography|studio|studios|photo|the|and)$/i.test(w)).slice(0, 2).map(w => w[0].toUpperCase()).join("") || "S";
  $("bName").textContent = studioName;
  $("bTag").textContent = S.tagline || "";
  $("logo").textContent = $("rLogo").textContent = initials(studioName);
  $("cBy").textContent = "Presented by " + studioName;
  $("rBy").textContent = "Santa's favorite · from " + studioName;
  $("demoPill").hidden = !isDemo;
  document.querySelectorAll("[data-slot]").forEach(img => {
    img.src = (img.id === "avaImg") ? (customWave ? P("wave") : DEFAULT_PHOTOS.avatar) : P(img.dataset.slot);
  });
  $("tFace").setAttribute("href", customWave ? P("wave") : DEFAULT_PHOTOS.avatar);
  $("toyKid").hidden = !S.toy_on; $("toyParent").hidden = !S.toy_on;
  const TT = toyText(S);
  $("toyKidTitle").textContent = TT.kidTitle; $("toyKidText").textContent = TT.kidText;
  $("toyPH").textContent = TT.parentTitle; $("toyPText").textContent = TT.parentText;
  $("toyMainTitle").textContent = TT.parentTitle; $("toyMainText").textContent = TT.parentText;
  $("cShareText").textContent = `Share my child's answers with ${studioName} so Santa knows them at our visit`;

  const sl = $("sessions"); sl.innerHTML = "";
  days.forEach((d, i) => {
    const li = document.createElement("li"); const booked = bookedDay === d; if (booked) li.className = "booked";
    const w = document.createElement("div"); const a = document.createElement("div"); a.className = "d"; a.textContent = d.date;
    const t = document.createElement("div"); t.className = "t"; t.textContent = d.time || ""; w.append(a, t); li.appendChild(w);
    if (booked) { const c = document.createElement("span"); c.className = "chip"; c.textContent = "You're booked"; li.appendChild(c); }
    else if (/^https?:\/\//.test(d.link || "")) { const l = document.createElement("a"); l.href = d.link; l.target = "_blank"; l.rel = "noopener"; l.textContent = "Book"; li.appendChild(l); }
    sl.appendChild(li);
  });
  if (!days.length) { const li = document.createElement("li"); li.textContent = "Ask the studio about Santa session days."; sl.appendChild(li); }

  $("boot").hidden = true; $("app").hidden = false;

  // countdown
  $("days").textContent = Math.ceil((xmas - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 864e5);

  // ---------- Chat ----------
  // Before a child chats, everything uses a friendly generic placeholder (never a sample name).
  const GENERIC = { name: "friend", age: "", good: "", deed: "being kind", sibling: "", cookie: "sugar cookies", reindeer: "Dasher", pet: "", wish: "", more: [], helper: "" };
  const KID_KEY = "alhm-kid-" + slug;
  let kid = { more: [] }; let done = false; let step = 0;
  // Remember this child's chat on this device so daily notes keep their name when they come back.
  try { const saved = JSON.parse(localStorage.getItem(KID_KEY) || "null"); if (saved && saved.name) { kid = Object.assign({ more: [] }, saved); done = true; } } catch (e) {}
  const log = $("log"), choices = $("choices");
  const data = () => done ? kid : GENERIC;

  function addMsg(text, who) { const d = document.createElement("div"); d.className = "msg " + who; d.textContent = text; log.appendChild(d); log.scrollTop = log.scrollHeight; }
  function addPic(slot, alt) { const d = document.createElement("div"); d.className = "msg santa pic"; const i = new Image(); i.src = P(slot); i.alt = alt; i.onload = () => log.scrollTop = log.scrollHeight; d.appendChild(i); log.appendChild(d); log.scrollTop = log.scrollHeight; }
  async function santaSays(lines) {
    for (const l of [].concat(lines)) {
      const t = document.createElement("div"); t.className = "typing"; t.innerHTML = "<i></i><i></i><i></i>"; log.appendChild(t); log.scrollTop = log.scrollHeight;
      await new Promise(r => setTimeout(r, reduce ? 150 : Math.min(1500, 450 + l.length * 14)));
      t.remove(); addMsg(l, "santa");
    }
  }
  const clearChoices = () => { choices.innerHTML = ""; };
  function mkBtn(label, onClick, cls) { const b = document.createElement("button"); b.type = "button"; b.className = "choice" + (cls ? " " + cls : ""); b.textContent = label; b.onclick = onClick; return b; }
  function showButtons(opts, cb) { clearChoices(); opts.forEach(o => choices.appendChild(mkBtn(o, () => { clearChoices(); addMsg(o, "kid"); cb(o); }))); const f = choices.querySelector("button"); if (f && step > 0) f.focus({ preventScroll: true }); }
  function showInput(ph, cb, extra) {
    clearChoices();
    if (extra) { const wrap = document.createElement("div"); wrap.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;width:100%"; extra.forEach(o => wrap.appendChild(mkBtn(o.label || o, () => { clearChoices(); addMsg(o.label || o, "kid"); cb(o.label || o, true); }, o.cls))); choices.appendChild(wrap); }
    const f = document.createElement("form"); f.className = "inrow";
    f.innerHTML = '<input class="field" id="kidInput" maxlength="40" autocomplete="off"><button class="btn" type="submit">Send</button>';
    f.querySelector("input").placeholder = ph;
    f.onsubmit = e => { e.preventDefault(); const v = f.querySelector("input").value.trim(); if (!v) return; clearChoices(); addMsg(v, "kid"); cb(v, false); };
    choices.appendChild(f); if (step > 0) f.querySelector("input").focus({ preventScroll: true });
  }

  const flow = [
    async () => { addPic("wave", "Santa waving hello"); await santaSays(["Ho ho ho! Well hello there!", "This is Santa, writing to you all the way from the North Pole. What's your first name?"]);
      showInput("Type your first name", v => { kid.name = cap(v.split(/\s+/)[0]).slice(0, 20); next(); }); },
    async () => { await santaSays([pick([`${kid.name}! What a wonderful name. I have it right here in my big book.`, `${kid.name}! My elves were hoping you'd write today.`]), "How old are you now?"]);
      showButtons(["2 or 3", "4 or 5", "6 or 7", "8 or 9", "10 or older"], o => { kid.age = o; next(); }); },
    async () => { await santaSays([/^(2|4)/.test(kid.age) ? "Oh my, you're getting so big!" : "Wow, you're practically one of my helpers now!", "Now, the big question. Have you been good this year?"]);
      showButtons(["Very good!", "Mostly good", "I'm trying my best"], o => { kid.good = o; next(); }); },
    async () => { const r = { "Very good!": "That's just what Mrs. Claus told me!", "Mostly good": "Mostly good is pretty great. Nobody's perfect, not even my reindeer.", "I'm trying my best": "Trying your best is what the Nice List is all about." }[kid.good];
      await santaSays([r, "Tell me one good thing you did this year."]);
      const map = { "Helped at home": "helping at home", "Was kind to my brother or sister": "being kind to a brother or sister", "Shared my toys": "sharing toys", "Helped a friend": "helping a friend", "Cleaned my room": "keeping a tidy room", "Was brave at the doctor": "being brave at the doctor" };
      showButtons(Object.keys(map), o => { kid.deed = map[o]; next(); }); },
    async () => { await santaSays([pick(["That made my heart as warm as cocoa.", "The elves wrote that down in gold ink!", "Ho ho ho! That's exactly what the Nice List is for."]), "Do you have any brothers or sisters?"]);
      showButtons(["A little brother", "A little sister", "A big brother", "A big sister", "More than one!", "Just me"], o => { kid.sibling = o.toLowerCase(); next(); }); },
    async () => { await santaSays([kid.sibling === "just me" ? "Then you get my extra-special attention!" : "I bet they're lucky to have you.", "What kind of cookie should you leave out for me on Christmas Eve?"]);
      showButtons(["Sugar cookies", "Chocolate chip", "Gingerbread", "Oatmeal", "Snickerdoodles"], o => { kid.cookie = o.toLowerCase(); next(); }); },
    async () => { await santaSays([`${cap(kid.cookie)}! Ho ho, my favorite. Mrs. Claus left the recipe in my workshop for you.`, "Which of my reindeer is your favorite?"]);
      showButtons(["Dasher", "Dancer", "Prancer", "Vixen", "Comet", "Cupid", "Donner", "Blitzen"], o => { kid.reindeer = o; next(); }); },
    async () => { await santaSays([`${kid.reindeer} will be so happy to hear that. I'll give ${herHim(kid.reindeer)} an extra carrot tonight.`, "Do you have any pets at home?"]);
      showInput("Like: a cat named Luna", v => { kid.pet = v; next(); }, ["No pets"]); },
    async () => { const p = kid.pet.toLowerCase() === "no pets" ? "That's okay. You can borrow my reindeer any time!" : `How wonderful! I'll ask the elves to put ${petPhrase(kid.pet)} on my list too.`;
      await santaSays([p, "Now, what's the one thing you're wishing for most this Christmas?"]);
      showInput("Type your biggest wish", v => { kid.wish = v; next(); }); },
    async () => { await santaSays([pick([`${cap(kid.wish)}! I've written that at the very top of your page in my big book.`, `Ho ho ho! "${kid.wish}" goes right at the top of your page in my big book.`]), "Is there anything else you're wishing for?"]);
      askMore(); },
    async () => { const n = kid.more.length;
      await santaSays([n ? `What a wonderful list! That's ${n + 1} wishes. My fastest elf is carrying your page to the workshop right now.` : "One big wish! My fastest elf is carrying your page to the workshop right now."]);
      if (bookedDay) await santaSays([`And guess what, ${kid.name}? I heard you're coming to visit me on ${bookedDay.date}!`, "I'll be the one in the big red suit, and I already know all about you. Wave when you see me!"]);
      if (S.toy_on && bookedDay) {
        await santaSays(["Can I tell you a secret? My elves and I are helping others this Christmas.", `Would you like to be one of my helpers and bring ${TT.item} when you visit me?`]);
        showButtons(["Yes, I'll help!", "I'll ask my grown-ups"], async o => { kid.helper = o.startsWith("Yes") ? "Yes" : "Asking"; await santaSays([kid.helper === "Yes" ? "Ho ho ho! You're officially one of Santa's elf helpers!" : "That's a great idea. Helpers always check with their grown-ups first!"]); finish(); });
      } else finish();
    }
  ];
  async function finish() {
    await santaSays([`You made my whole day, ${kid.name}. I'm writing your name on the Nice List right now. Keep being kind!`]);
    addPic("write", "Santa writing in his big book");
    await santaSays(["I left you a letter, your Nice List certificate, and my favorite cookie recipe in the workshop. Ho ho ho! Merry Christmas!"]);
    addPic("gift", "Santa holding a present");
    done = true; $("pChild").value = kid.name; renderAll();
    try { localStorage.setItem(KID_KEY, JSON.stringify(kid)); } catch (e) {}
    showButtons(["Go to Santa's Workshop"], () => { $("workshopH").scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); showButtons(["Chat again"], restart); });
  }
  function askMore() {
    showInput("Type another wish", (v, isBtn) => {
      if (isBtn) { next(); return; }
      kid.more.push(v); renderAll();
      const reply = pick([`${cap(v)}, got it!`, `Ooh, ${v}! The elves wrote it down.`, `${cap(v)}! It's in my big book.`]);
      santaSays([kid.more.length >= 5 ? reply + " That's a wonderful list!" : reply + " Anything else?"]).then(() => { if (kid.more.length >= 5) next(); else askMore(); });
    }, [{ label: "That's all!", cls: "done" }]);
  }
  function next() { step++; flow[step] && flow[step](); }
  function restart() { log.innerHTML = ""; clearChoices(); kid = { more: [] }; done = false; step = 0; try { localStorage.removeItem(KID_KEY); } catch (e) {} renderAll(); flow[0](); }
  $("restart").onclick = restart;

  // ---------- Recipe ----------
  let recipeOverride = null;
  function renderRecipe() {
    const key = recipeOverride || COOKIE_KEY[data().cookie] || "sugar"; const r = RECIPES[key];
    $("rTitle").textContent = r.title + " for Santa";
    const fill = (id, arr, tag) => { $(id).innerHTML = ""; arr.forEach(t => { const e = document.createElement(tag); e.textContent = t; $(id).appendChild(e); }); };
    fill("rMeta", r.meta, "span"); fill("rIng", r.ing, "li"); fill("rSteps", r.steps, "li");
    $("rTabs").innerHTML = "";
    Object.entries(RECIPES).forEach(([k, v]) => { const b = document.createElement("button"); b.type = "button"; b.className = "rtab"; b.textContent = v.title; b.setAttribute("aria-pressed", String(k === key)); b.onclick = () => { recipeOverride = k; renderRecipe(); }; $("rTabs").appendChild(b); });
  }

  // ---------- Letter, certificate, wish list ----------
  function renderResults() {
    const k = data();
    if (!done) {
      const ps = ["Dear friend,", "I can't wait to hear from you! Chat with me above, and I'll write you a real letter with your name on it.", "Keep being kind,"];
      $("letterBody").innerHTML = ""; ps.forEach(t => { const p = document.createElement("p"); p.textContent = t; $("letterBody").appendChild(p); });
      $("cName").textContent = "Your name here";
      $("cWhy").textContent = "Chat with Santa to get your name on the Nice List!";
      $("wlTitle").textContent = "Your child's wish list";
      const ul = $("wishList"); ul.innerHTML = ""; const li = document.createElement("li"); li.textContent = "Wishes will show up here after your child chats with Santa."; ul.appendChild(li);
      return;
    }
    const paras = [`Dear ${k.name},`, `Thank you for chatting with me today! The elves gave you a gold star for ${k.deed} this year, and that made the whole North Pole smile.`,
      `I've written your wish for ${k.wish} in my big book. My workshop is very busy, but the elves will do their very best.`,
      `I'll be looking for ${k.cookie} on Christmas Eve. ${k.reindeer} sends a big snowy hello.`, `Keep being kind,`];
    $("letterBody").innerHTML = ""; paras.forEach(t => { const p = document.createElement("p"); p.textContent = t; $("letterBody").appendChild(p); });
    $("cName").textContent = k.name;
    $("cWhy").textContent = `is officially on the Nice List for Christmas ${xmas.getFullYear()}, with a gold star for ${k.deed}.`;
    $("wlTitle").textContent = `${k.name}'s wish list`;
    const ul = $("wishList"); ul.innerHTML = "";
    if (k.wish) { const li = document.createElement("li"); li.className = "top"; li.append(cap(k.wish)); const s = document.createElement("small"); s.textContent = "Top wish"; li.appendChild(s); ul.appendChild(li); }
    (k.more || []).forEach(w => { const li = document.createElement("li"); li.textContent = cap(w); ul.appendChild(li); });
    if (!k.wish) { const li = document.createElement("li"); li.textContent = "Wishes show here as your child adds them."; ul.appendChild(li); }
  }

  // ---------- Daily note ----------
  const todayDec = (now.getMonth() === 11 && now.getDate() <= 24) ? now.getDate() : null;
  let selDay = todayDec || 1;
  function renderNotes() {
    const n = data().name; const visit = bookedDay ? decDate(bookedDay.date) : null;
    const grid = $("days24"); grid.innerHTML = "";
    for (let d = 1; d <= 24; d++) { const b = document.createElement("button"); b.type = "button"; b.className = "day" + (d === visit ? " brand" : "") + (d === todayDec ? " today" : ""); b.textContent = d; b.setAttribute("aria-label", "December " + d); b.setAttribute("aria-pressed", String(d === selDay)); b.onclick = () => { selDay = d; renderNotes(); }; grid.appendChild(b); }
    const note = noteFor(S, selDay, n, bookedDay && bookedDay.date);
    $("noteH").textContent = todayDec === selDay ? "Today's note from Santa" : `Santa's note for December ${selDay}`;
    $("noteText").textContent = note.text;
    $("noteSig").textContent = "Delivered by Santa's helpers at " + studioName;
  }

  // ---------- Gifts ----------
  function renderGifts() {
    const g = $("gifts"); g.innerHTML = "";
    if (S.gift_pick) { const p = document.createElement("div"); p.className = "pick"; const s = document.createElement("span"); s.textContent = "Studio pick"; p.append(s, S.gift_pick); g.appendChild(p); }
    GIFTS.forEach(([h, items]) => { const d = document.createElement("div"); const h4 = document.createElement("h4"); h4.textContent = h; const ul = document.createElement("ul"); items.forEach(t => { const li = document.createElement("li"); li.textContent = t; ul.appendChild(li); }); d.append(h4, ul); g.appendChild(d); });
  }

  function renderAll() { recipeOverride = null; renderResults(); renderRecipe(); renderNotes(); }

  // ---------- Quiz ----------
  let qi = 0, score = 0;
  function renderQuiz() {
    const box = $("quiz"); box.innerHTML = ""; $("meterFill").style.width = Math.round(score / 10 * 100) + "%";
    if (qi >= QUIZ.length) {
      const res = score >= 9 ? "Super Nice!" : score >= 6 ? "Very Nice!" : "Nice, with room to sparkle!";
      box.innerHTML = '<p class="q"></p><p class="qfb"></p>'; box.querySelector(".q").textContent = "Your Nice-o-Meter says: " + res;
      box.querySelector(".qfb").textContent = `${score} out of 10 gold stars. Santa is proud of you!`;
      const b = document.createElement("button"); b.className = "btn"; b.type = "button"; b.textContent = "Play again"; b.onclick = () => { qi = 0; score = 0; renderQuiz(); }; box.appendChild(b); return;
    }
    const Q = QUIZ[qi];
    const c = document.createElement("div"); c.className = "qcount"; c.textContent = `Question ${qi + 1} of ${QUIZ.length}`; box.appendChild(c);
    const q = document.createElement("p"); q.className = "q"; q.textContent = Q.q; box.appendChild(q);
    Q.a.slice().sort(() => Math.random() - .5).forEach(([t, pts]) => {
      const b = document.createElement("button"); b.type = "button"; b.className = "qa"; b.textContent = t;
      b.onclick = () => { score += pts; box.querySelectorAll(".qa").forEach(x => x.disabled = true); $("meterFill").style.width = Math.round(score / 10 * 100) + "%";
        const fb = document.createElement("p"); fb.className = "qfb"; fb.textContent = pick(QUIZ_FB[2 - pts]); box.appendChild(fb);
        const n = document.createElement("button"); n.type = "button"; n.className = "btn"; n.textContent = qi < QUIZ.length - 1 ? "Next question" : "See my result"; n.onclick = () => { qi++; renderQuiz(); }; box.appendChild(n); n.focus({ preventScroll: true }); };
      box.appendChild(b);
    });
  }

  // ---------- Grown-ups gate ----------
  const W = ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty"];
  let gateAns = 0;
  function newGate() { const a = 6 + Math.floor(Math.random() * 9), b = 3 + Math.floor(Math.random() * 7); gateAns = a + b; $("gateQ").textContent = `What is ${W[a]} plus ${W[b]}?`; $("gateA").value = ""; }
  $("gateForm").addEventListener("submit", e => { e.preventDefault(); if (parseInt($("gateA").value, 10) === gateAns) { $("gate").hidden = true; $("grown").hidden = false; $("gateErr").hidden = true; } else { $("gateErr").hidden = false; newGate(); } });
  $("lockBtn").onclick = () => { $("grown").hidden = true; $("gate").hidden = false; newGate(); $("grownH").scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); };

  function copy(txt, okId, selectEl) { const ok = () => { $(okId).hidden = false; setTimeout(() => $(okId).hidden = true, 1800); }; const fb = () => { const r = document.createRange(); r.selectNodeContents(selectEl); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }; try { navigator.clipboard.writeText(txt).then(ok).catch(fb); } catch (e) { fb(); } }
  $("copyWish").onclick = () => { if (!done) return; const k = data(); copy(`${k.name}'s Christmas wish list\n★ ${k.wish} (top wish)\n` + (k.more || []).map(w => "• " + w).join("\n") + `\n\nFrom Santa's chat, courtesy of ${studioName}`, "wishCopied", $("wishList")); };

  // ---------- Parent form (the only thing that leaves the device) ----------
  $("parentForm").addEventListener("submit", async e => {
    e.preventDefault();
    const err = m => { $("pErr").textContent = m; $("pErr").hidden = !m; };
    $("pOk").hidden = true; err("");
    const email = $("pEmail").value.trim(), child = $("pChild").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return err("Please enter a valid email address.");
    if (!child) return err("Please add your child's first name.");
    if (!$("cConsent").checked) return err("Please check the box to agree to the privacy policy.");
    if (!$("cLetter").checked && !$("cDaily").checked && !$("cShare").checked) return err("Pick at least one thing to send.");
    if (isDemo) { $("pOk").textContent = "This is the demo, so nothing was sent. On a studio's page, the emails go out right away."; $("pOk").hidden = false; return; }
    const k = done ? kid : null;
    const payload = {
      slug, parentEmail: email, childName: child.split(/\s+/)[0].slice(0, 20),
      answers: k ? { age: k.age, good: k.good, deed: k.deed, sibling: k.sibling, cookie: k.cookie, reindeer: k.reindeer, pet: k.pet, wish: k.wish, more: k.more, helper: k.helper || null } : {},
      visitDay: bookedDay ? bookedDay.date : null, code: familyCode,
      wantsLetter: $("cLetter").checked, wantsDaily: $("cDaily").checked, shareWithStudio: $("cShare").checked && !!k,
      website: $("pWebsite").value
    };
    if ($("cLetter").checked && !k) return err("Finish the chat with Santa first so we can send the letter and certificate.");
    $("pSend").disabled = true; $("pSend").textContent = "Sending…";
    try {
      const r = await fetch("/api/submit", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || "Something went wrong. Please try again.");
      $("pOk").textContent = "Sent! Check your inbox for an email from Santa's Helpers."; $("pOk").hidden = false;
    } catch (ex) { err(ex.message); }
    finally { $("pSend").disabled = false; $("pSend").textContent = "Send"; }
  });

  // ---------- Santa Tracker ----------
  const xy = (lon, lat) => [(lon + 180) / 360 * 1000, (90 - lat) / 180 * 500];
  const POLE = [500, 24];
  const counts = {};
  const flight = STOPS.map(([n, lon, lat, off]) => { counts[off] = counts[off] || 0; const t = Date.UTC(xmas.getFullYear(), 11, 25) - off * 3600e3 + counts[off]++ * 7 * 60e3; return { n, t, p: xy(lon, lat) }; }).sort((a, b) => a.t - b.t);
  const town = S.town;
  (function drawStops() {
    const g = $("tStops"); g.innerHTML = ""; const NS = "http://www.w3.org/2000/svg";
    flight.forEach(s => { const c = document.createElementNS(NS, "circle"); c.setAttribute("cx", s.p[0]); c.setAttribute("cy", s.p[1]); c.setAttribute("r", s.n === town ? 6 : 3); c.setAttribute("fill", s.n === town ? "#ffe9a8" : "rgba(255,255,255,.35)"); c.dataset.t = s.t; if (s.n === town) c.dataset.town = "1"; g.appendChild(c);
      if (s.n === town) { const t = document.createElementNS(NS, "text"); t.setAttribute("x", s.p[0] + 9); t.setAttribute("y", s.p[1] + 4); t.setAttribute("fill", "#ffe9a8"); t.setAttribute("font-size", "12"); t.setAttribute("font-weight", "800"); t.setAttribute("font-family", "Nunito, sans-serif"); t.textContent = studioName; g.appendChild(t); } });
  })();
  const lerpWrap = (a, b, f) => { let dx = b[0] - a[0]; if (dx > 500) dx -= 1000; if (dx < -500) dx += 1000; let x = a[0] + dx * f; x = ((x % 1000) + 1000) % 1000; return [x, a[1] + (b[1] - a[1]) * f]; };
  const fmt = n => Math.round(n).toLocaleString();
  const start = flight[0].t - 3600e3, end = flight[flight.length - 1].t + 2 * 3600e3;
  let practice = null;
  function trackAt(t, isPractice) {
    let pos = POLE, last = "North Pole", nxt = flight[0].n, visited = 0, trail = [];
    if (t < start) { $("tStatus").textContent = "Santa is getting the sleigh ready at the North Pole. Takeoff is Christmas Eve."; }
    else if (t >= end) { last = flight[flight.length - 1].n; nxt = "Home to the North Pole"; visited = flight.length; $("tStatus").textContent = "Santa is home at the North Pole, fast asleep. Merry Christmas!"; }
    else {
      visited = flight.filter(s => s.t <= t).length;
      if (visited === 0) { pos = lerpWrap(POLE, flight[0].p, (t - start) / (flight[0].t - start)); }
      else if (visited >= flight.length) { const L = flight[flight.length - 1]; pos = lerpWrap(L.p, POLE, (t - L.t) / (end - L.t)); last = L.n; nxt = "Home to the North Pole"; }
      else { const A = flight[visited - 1], B = flight[visited]; pos = lerpWrap(A.p, B.p, (t - A.t) / (B.t - A.t)); last = A.n; nxt = B.n; }
      $("tStatus").textContent = (isPractice ? "Practice flight! " : "") + (visited ? `Santa just left ${last} and is flying to ${nxt}.` : "Santa has taken off from the North Pole!");
      const ts = flight.find(s => s.n === town); if (ts && Math.abs(t - ts.t) < 20 * 60e3) $("tStatus").textContent = `Santa is stopping at ${studioName}'s town, ${town}!`;
      trail = flight.slice(0, visited).map(s => s.p);
    }
    const prog = t < start ? 0 : t >= end ? 1 : (t - start) / (end - start);
    $("tGifts").textContent = fmt(prog * 2100000000); $("tCookies").textContent = fmt(prog * 450000000); $("tStopsN").textContent = `${visited} of ${flight.length}`;
    $("tLast").textContent = last; $("tNext").textContent = nxt;
    let d = ""; trail.forEach((p, i) => { const prev = trail[i - 1]; d += (i === 0 || Math.abs(p[0] - prev[0]) > 500) ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`; });
    if (trail.length && t < end && Math.abs(pos[0] - trail[trail.length - 1][0]) <= 500) d += `L${pos[0]},${pos[1]}`;
    $("tTrail").setAttribute("d", d);
    $("tSanta").setAttribute("transform", `translate(${pos[0]},${pos[1]})`);
    $("tStops").querySelectorAll("circle").forEach(c => { if (c.dataset.town) return; c.setAttribute("fill", (t >= start && +c.dataset.t <= t) ? "#ffe9a8" : "rgba(255,255,255,.35)"); });
    const left = xmas.getTime() - t;
    $("tYou").textContent = isPractice ? "Asleep and dreaming" : left > 36 * 3600e3 ? "Christmas Eve, around midnight" : left > 0 ? `About ${Math.floor(left / 3600e3)} h ${Math.floor(left % 3600e3 / 60e3)} m away. Time for bed!` : "Santa has been to your house!";
  }
  const liveTick = () => { if (!practice) trackAt(Date.now(), false); };
  $("tPractice").onclick = () => {
    const reset = () => { practice = null; $("tPractice").textContent = "Watch a practice flight"; $("tEyebrow").textContent = "Christmas Eve · Live"; };
    if (practice) { cancelAnimationFrame(practice); reset(); liveTick(); return; }
    const dur = reduce ? 4000 : 45000, t0 = performance.now();
    $("tPractice").textContent = "Stop practice flight"; $("tEyebrow").textContent = "Practice flight";
    const stepF = n => { const f = Math.min(1, (n - t0) / dur); trackAt(start + (end - start) * f, true); if (f < 1) practice = requestAnimationFrame(stepF); else { reset(); setTimeout(liveTick, 2500); } };
    practice = requestAnimationFrame(stepF);
  };
  liveTick(); setInterval(liveTick, 30000);

  // ---------- Go ----------
  if (done) $("pChild").value = kid.name;
  newGate(); renderGifts(); renderAll(); renderQuiz(); flow[0]();

  // snow
  const c = $("snow"), x = c.getContext("2d"); let Wd, H, flakes = [];
  function size() { const r = c.getBoundingClientRect(); Wd = c.width = r.width; H = c.height = r.height; flakes = Array.from({ length: Math.min(70, Math.floor(Wd / 12)) }, () => ({ x: Math.random() * Wd, y: Math.random() * H, r: Math.random() * 2 + 0.7, s: Math.random() * 0.4 + 0.15, d: Math.random() * Math.PI * 2 })); }
  function draw() { x.clearRect(0, 0, Wd, H); x.fillStyle = "rgba(255,255,255,.8)"; flakes.forEach(f => { x.beginPath(); x.arc(f.x, f.y, f.r, 0, 7); x.fill(); f.y += f.s; f.d += 0.01; f.x += Math.sin(f.d) * 0.3; if (f.y > H) { f.y = -4; f.x = Math.random() * Wd; } }); if (!reduce) requestAnimationFrame(draw); }
  size(); addEventListener("resize", size); draw();
}
