import { DEFAULT_PHOTOS, NOTES, STOPS, RESERVED_SLUGS, santaLines } from "./content.js";

const $ = id => document.getElementById(id);
const C = window.ALHM_CONFIG || {};
const SITE = (C.SITE_URL || location.origin).replace(/\/+$/, "");
const sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY, { auth: { persistSession: true, detectSessionInUrl: true, flowType: "implicit" } });

const views = ["vLoading", "vLogin", "vNone", "vDash"];
const show = v => views.forEach(x => $(x).hidden = x !== v);
let studio = null, families = [];

// ---------- Auth ----------
$("loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  const email = $("loginEmail").value.trim().toLowerCase();
  $("loginErr").hidden = true; $("loginOk").hidden = true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { $("loginErr").textContent = "Please enter a valid email."; $("loginErr").hidden = false; return; }
  $("loginBtn").disabled = true;
  // Works for new and existing accounts alike: no "already registered" errors.
  const { error } = await sb.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: `${location.origin}/dashboard` } });
  $("loginBtn").disabled = false;
  if (error) { $("loginErr").textContent = error.status === 429 ? "Too many tries. Wait a minute, then try again." : "We couldn't send the link. Please try again."; $("loginErr").hidden = false; }
  else $("loginOk").hidden = false;
});
const signOut = async () => { await sb.auth.signOut(); location.href = "/dashboard"; };
$("signOut").onclick = signOut; $("noneOut").onclick = signOut;

sb.auth.onAuthStateChange((_evt, session) => { if (session && !studio) boot(session); });
// If the sign-in link failed (expired, already used), say so on the sign-in screen.
function linkError() {
  const q = new URLSearchParams(location.hash.slice(1) + "&" + location.search.slice(1));
  const d = q.get("error_description") || q.get("error");
  if (!d) return;
  history.replaceState(null, "", "/dashboard");
  $("loginErr").textContent = /expired|invalid/i.test(d) ? "That sign-in link has expired or was already used. Enter your email to get a new one." : "Sign-in didn't work: " + d.replace(/\+/g, " ");
  $("loginErr").hidden = false;
}
sb.auth.getSession().then(({ data }) => { if (data.session) boot(data.session); else { linkError(); show("vLogin"); } }).catch(() => show("vLogin"));
setTimeout(() => { if (!$("vLoading").hidden) show("vLogin"); }, 8000);

let booting = false;
async function boot(session) {
  if (booting || studio) return; booting = true;
  $("signOut").hidden = false;
  const { data, error } = await sb.from("studios").select("*").maybeSingle();
  booting = false;
  if (error || !data) { $("noneEmail").textContent = session.user.email; show("vNone"); return; }
  studio = data;
  fillForm(); show("vDash"); loadFamilies();
  if (!studio.slug || !studio.name) { $("helloEyebrow").textContent = "Welcome! Let's set up your page"; $("fSlug").focus(); }
}

// ---------- Tabs ----------
const tabs = [["t-set", "p-set"], ["t-fam", "p-fam"], ["t-share", "p-share"]];
tabs.forEach(([t]) => $(t).addEventListener("click", () => { tabs.forEach(([t2, p2]) => { $(t2).setAttribute("aria-selected", String(t2 === t)); $(p2).hidden = t2 !== t; }); if (t === "t-fam") loadFamilies(); }));

// ---------- Settings form ----------
const COLORS = ["#c61f2e", "#1d6a44", "#b8862b", "#c0869a", "#3f63c4", "#2b2328"];
let draft = {};
function fillForm() {
  draft = JSON.parse(JSON.stringify({ days: studio.days || [], notes: studio.notes || {}, photos: studio.photos || {}, color: studio.color || "#c61f2e" }));
  $("fSlug").value = studio.slug || ""; $("fName").value = studio.name || ""; $("fTag").value = studio.tagline || "";
  $("fNotify").value = studio.notify_email || studio.owner_email; $("fToy").checked = !!studio.toy_on;
  $("fCharity").value = studio.charity || ""; $("fBonus").value = studio.bonus || ""; $("fPick").value = studio.gift_pick || "";
  // colors
  const sw = $("swatches"); sw.querySelectorAll(".sw").forEach(n => n.remove());
  COLORS.forEach(c => { const b = document.createElement("button"); b.type = "button"; b.className = "sw"; b.style.background = c; b.setAttribute("aria-label", "Color " + c); b.onclick = () => { draft.color = c; $("fColor").value = c; paintSwatches(); }; sw.insertBefore(b, $("fColor")); });
  $("fColor").value = draft.color; $("fColor").oninput = () => { draft.color = $("fColor").value; paintSwatches(); };
  paintSwatches();
  // town
  const t = $("fTown"); t.innerHTML = ""; STOPS.map(s => s[0]).sort().forEach(n => { const o = document.createElement("option"); o.value = o.textContent = n; t.appendChild(o); }); t.value = studio.town || "New York";
  // notes
  const nd = $("fNoteDay"); nd.innerHTML = ""; for (let d = 1; d <= 24; d++) { const o = document.createElement("option"); o.value = d; o.textContent = "December " + d; nd.appendChild(o); }
  nd.onchange = fillNote; fillNote();
  renderSlots(); renderDays(); updateHeader();
}
function paintSwatches() { document.querySelectorAll("#swatches .sw").forEach(b => b.setAttribute("aria-pressed", String(b.style.background && rgbToHex(b.style.background) === draft.color.toLowerCase()))); }
function rgbToHex(rgb) { const m = rgb.match(/\d+/g); return m ? "#" + m.slice(0, 3).map(n => (+n).toString(16).padStart(2, "0")).join("") : rgb; }
function updateHeader() {
  $("helloName").textContent = studio.name || "Set up your studio";
  const link = studio.slug ? `${SITE}/${studio.slug}` : null;
  $("viewPage").hidden = !link; if (link) $("viewPage").href = link;
  renderShare();
}

// notes editor
function fillNote() { const d = $("fNoteDay").value; $("fNoteText").value = draft.notes[d] || NOTES[d - 1]; renderCustomDays(); }
function renderCustomDays() { const cd = Object.keys(draft.notes).map(Number).sort((a, b) => a - b); $("customDays").textContent = cd.length ? "Your own notes on December " + cd.join(", ") + ". Save changes to publish them." : "All 24 notes are Santa's."; }
$("useMine").onclick = () => { const d = $("fNoteDay").value; const t = $("fNoteText").value.trim(); if (t && t !== NOTES[d - 1]) draft.notes[d] = t; else delete draft.notes[d]; renderCustomDays(); };
$("useSanta").onclick = () => { const d = $("fNoteDay").value; delete draft.notes[d]; fillNote(); };

// days editor
function renderDays() {
  const box = $("dayRows"); box.innerHTML = "";
  draft.days.forEach((d, i) => {
    const row = document.createElement("div"); row.className = "dayrow";
    [["date", "Saturday, December 5"], ["time", "9am to 2pm · Main studio"], ["link", "https://your-booking-link"]].forEach(([f, ph]) => {
      const inp = document.createElement("input"); inp.className = "field"; inp.id = `day${i}-${f}`; inp.placeholder = ph; inp.setAttribute("aria-label", f === "date" ? "Day" : f === "time" ? "Time and place" : "Booking link"); inp.value = d[f] || ""; inp.oninput = () => { d[f] = inp.value; }; row.appendChild(inp);
    });
    const x = document.createElement("button"); x.type = "button"; x.className = "x"; x.textContent = "×"; x.setAttribute("aria-label", "Remove this day"); x.onclick = () => { draft.days.splice(i, 1); renderDays(); };
    row.appendChild(x); box.appendChild(row);
  });
  if (!draft.days.length) { const p = document.createElement("p"); p.className = "fine"; p.style.margin = "0"; p.textContent = "No days yet."; box.appendChild(p); }
}
$("addDay").onclick = () => { draft.days.push({ date: "", time: "", link: "" }); renderDays(); $(`day${draft.days.length - 1}-date`).focus(); };

// photos
const SLOTS = { wave: "Waving (header, chat photo)", read: "Daily note", write: "Letter", gift: "Wish list, goodbye" };
function renderSlots() {
  const box = $("slots"); box.innerHTML = "";
  Object.entries(SLOTS).forEach(([k, label]) => {
    const lab = document.createElement("label"); lab.className = "slot"; lab.htmlFor = "photo-" + k;
    const im = new Image(); im.alt = ""; im.src = draft.photos[k] || DEFAULT_PHOTOS[k];
    const cap = document.createElement("span"); cap.textContent = label;
    const inp = document.createElement("input"); inp.type = "file"; inp.accept = "image/*"; inp.id = "photo-" + k;
    inp.onchange = () => upload(k, inp.files[0], im);
    lab.append(im, cap, inp);
    if (draft.photos[k]) { const r = document.createElement("button"); r.type = "button"; r.className = "btn ghost small"; r.textContent = "Use cartoon Santa"; r.onclick = e => { e.preventDefault(); delete draft.photos[k]; renderSlots(); }; lab.appendChild(r); }
    box.appendChild(lab);
  });
}
function shrink(file) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file); const i = new Image();
    i.onload = () => { const s = Math.min(1, 1400 / Math.max(i.width, i.height)); const c = document.createElement("canvas"); c.width = Math.round(i.width * s); c.height = Math.round(i.height * s); c.getContext("2d").drawImage(i, 0, 0, c.width, c.height); c.toBlob(b => { URL.revokeObjectURL(url); b ? res(b) : rej(new Error("Couldn't read that image")); }, "image/jpeg", .85); };
    i.onerror = () => rej(new Error("That file isn't an image we can read. Try a JPG or PNG."));
    i.src = url;
  });
}
async function upload(slot, file, im) {
  if (!file) return;
  $("photoErr").hidden = true; im.style.opacity = .4;
  try {
    const blob = await shrink(file);
    const path = `${studio.id}/${slot}-${Date.now()}.jpg`;
    const { error } = await sb.storage.from("santa-photos").upload(path, blob, { contentType: "image/jpeg", upsert: true });
    if (error) throw error;
    draft.photos[slot] = sb.storage.from("santa-photos").getPublicUrl(path).data.publicUrl;
    renderSlots();
    $("saveOk").hidden = true; $("saveErr").textContent = "Photo uploaded. Save changes to put it on your page."; $("saveErr").hidden = false;
  } catch (e) { $("photoErr").textContent = e.message || "Upload failed. Please try again."; $("photoErr").hidden = false; im.style.opacity = 1; }
}

// save
$("setForm").addEventListener("submit", async e => {
  e.preventDefault();
  const err = m => { $("saveErr").textContent = m; $("saveErr").hidden = !m; };
  $("saveOk").hidden = true; err("");
  const slug = $("fSlug").value.trim().toLowerCase();
  if (!/^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$/.test(slug)) return err("Your page link needs 3 to 40 lowercase letters, numbers, or dashes, and can't start or end with a dash.");
  if (RESERVED_SLUGS.includes(slug)) return err("That link is reserved. Please pick another.");
  if (!$("fName").value.trim()) return err("Please add your studio name.");
  const days = draft.days.map(d => ({ date: (d.date || "").trim(), time: (d.time || "").trim(), link: (d.link || "").trim() })).filter(d => d.date);
  const badLink = days.find(d => d.link && !/^https?:\/\//i.test(d.link));
  if (badLink) return err(`The booking link for ${badLink.date} should start with https://`);
  const noteText = $("fNoteText").value.trim(), nd = $("fNoteDay").value;
  if (noteText && noteText !== NOTES[nd - 1] && noteText !== draft.notes[nd]) draft.notes[nd] = noteText;
  const update = {
    slug, name: $("fName").value.trim(), tagline: $("fTag").value.trim(), color: draft.color,
    notify_email: $("fNotify").value.trim() || null, toy_on: $("fToy").checked, charity: $("fCharity").value.trim(),
    bonus: $("fBonus").value.trim(), gift_pick: $("fPick").value.trim() || null, town: $("fTown").value,
    days, notes: draft.notes, photos: draft.photos
  };
  $("saveBtn").disabled = true;
  const { data, error } = await sb.from("studios").update(update).eq("id", studio.id).select().single();
  $("saveBtn").disabled = false;
  if (error) return err(error.code === "23505" ? "Someone already has that page link. Please pick another." : "We couldn't save. Please try again.");
  studio = data; draft.days = days; renderDays(); renderCustomDays(); updateHeader();
  $("helloEyebrow").textContent = "Your Santa page";
  $("saveOk").hidden = false; setTimeout(() => $("saveOk").hidden = true, 4000);
});

// ---------- Families ----------
async function loadFamilies() {
  if (!studio) return;
  const { data, error } = await sb.from("submissions").select("*").order("created_at", { ascending: false }).limit(2000);
  if (error) { $("famList").textContent = "We couldn't load your families. Please refresh."; return; }
  families = data || [];
  $("sFam").textContent = families.length;
  $("sDaily").textContent = families.filter(f => f.wants_daily && !f.unsubscribed).length;
  $("sToy").textContent = families.filter(f => f.answers && f.answers.helper === "Yes").length;
  const list = $("famList"); list.innerHTML = "";
  if (!families.length) { const p = document.createElement("p"); p.className = "muted"; p.textContent = "No families yet. When a parent sends their child's answers from your Santa page, they show up here and in your inbox."; list.appendChild(p); return; }
  families.forEach(f => {
    const a = f.answers || {};
    const d = document.createElement("details"); d.className = "fam";
    const s = document.createElement("summary");
    const nm = document.createElement("b"); nm.textContent = f.child_name;
    const when = document.createElement("span"); when.className = "muted"; when.textContent = new Date(f.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    s.append(nm, when);
    if (f.visit_day) { const p = document.createElement("span"); p.className = "pill red"; p.textContent = f.visit_day; s.appendChild(p); }
    if (f.share_with_studio) { const p = document.createElement("span"); p.className = "pill"; p.textContent = "Cheat sheet"; s.appendChild(p); }
    d.appendChild(s);
    const body = document.createElement("div"); body.className = "body";
    const dl = document.createElement("dl"); dl.className = "facts";
    [["Parent", f.parent_email], ["Age", a.age], ["Good deed", a.deed], ["Siblings", a.sibling], ["Cookie", a.cookie], ["Reindeer", a.reindeer], ["Pet", a.pet], ["Top wish", a.wish], ["Also wants", (a.more || []).join(", ")], ["Toy helper", a.helper === "Yes" ? "Yes" : a.helper === "Asking" ? "Asking grown-ups" : ""], ["Daily notes", f.wants_daily ? (f.unsubscribed ? "Unsubscribed" : "Yes") : "No"]]
      .filter(r => r[1]).forEach(([l, v]) => { const dt = document.createElement("dt"); dt.textContent = l; const dd = document.createElement("dd"); dd.textContent = v; dl.append(dt, dd); });
    body.appendChild(dl);
    if (f.share_with_studio && a.deed) {
      const h = document.createElement("p"); h.className = "eyebrow"; h.style.margin = "6px 0 0"; h.style.color = "var(--red)"; h.textContent = "Lines for Santa to say"; body.appendChild(h);
      const ol = document.createElement("ol"); ol.style.margin = "0"; santaLines({ name: f.child_name, ...a }, studio.toy_on).forEach(l => { const li = document.createElement("li"); li.textContent = l; ol.appendChild(li); }); body.appendChild(ol);
    }
    d.appendChild(body); list.appendChild(d);
  });
}
$("refreshFam").onclick = loadFamilies;
$("exportCsv").onclick = () => {
  const cols = ["created_at", "child_name", "parent_email", "visit_day", "wants_daily", "unsubscribed", "age", "deed", "sibling", "cookie", "reindeer", "pet", "wish", "more", "helper"];
  const q = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = families.map(f => { const a = f.answers || {}; return [f.created_at, f.child_name, f.parent_email, f.visit_day, f.wants_daily, f.unsubscribed, a.age, a.deed, a.sibling, a.cookie, a.reindeer, a.pet, a.wish, (a.more || []).join("; "), a.helper].map(q).join(","); });
  const blob = new Blob([cols.join(",") + "\n" + rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "santa-families.csv"; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// ---------- Share ----------
function renderShare() {
  const base = studio.slug ? `${SITE}/${studio.slug}` : "Save your page link in Settings first";
  $("mainLink").textContent = base;
  const box = $("dayLinks"); box.innerHTML = "";
  (studio.days || []).forEach((d, i) => {
    if (!studio.slug) return;
    const w = document.createElement("div"); const lab = document.createElement("div"); lab.style.fontWeight = "800"; lab.textContent = d.date;
    const row = document.createElement("div"); row.className = "linkbox"; const code = document.createElement("code"); code.id = "dl" + i; code.textContent = `${base}?visit=${i + 1}`;
    const b = document.createElement("button"); b.type = "button"; b.className = "btn small"; b.textContent = "Copy"; b.dataset.copy = code.id;
    row.append(code, b); w.append(lab, row); box.appendChild(w);
  });
  if (!(studio.days || []).length) { const p = document.createElement("p"); p.className = "fine"; p.style.margin = "0"; p.textContent = "Add Santa session days in Settings to get these links."; box.appendChild(p); }
  $("shareMsg").value = `A little holiday magic for your family!\n\nYour kids can chat with Santa at the North Pole, get a letter back from him, and land on the official Nice List. Grown-ups can sign up for a note from Santa every morning, December 1 to 24.\n\nMeeting Santa can feel big for little ones. Chatting with him at home first means Santa already knows them on visit day.\n\n${base}\n\nWith love,\n${studio.name || ""}`;
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-copy]"); if (!b) return;
  const el = $(b.dataset.copy); const text = el.value !== undefined ? el.value : el.textContent;
  const done = () => { $("copyOk").hidden = false; b.textContent = "Copied"; setTimeout(() => { $("copyOk").hidden = true; b.textContent = b.dataset.copy === "shareMsg" ? "Copy message" : "Copy"; }, 1500); };
  navigator.clipboard.writeText(text).then(done).catch(() => { if (el.select) el.select(); else { const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } });
});
