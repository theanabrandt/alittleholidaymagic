// Marketing kit: branded graphics + ready-to-send words, built from the studio's settings.
import { DEFAULT_PHOTOS, toyText } from "./content.js";

const GREEN = "#11452c", PINK = "#ffd3d7", CREAM = "#fffdf9", GOLD = "#e5b645", INK = "#1c2a21", MUTED = "#5b6d61";
const DISPLAY = '"Baloo 2", "Trebuchet MS", sans-serif', BODY = 'Nunito, "Segoe UI", sans-serif';

let S, SITE, LINK, RED, photo, $root, CODE = "", FULL = "";

// ---------- drawing helpers ----------
function seeded(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
function background(ctx, W, H) {
  ctx.fillStyle = GREEN; ctx.fillRect(0, 0, W, H);
  const r = seeded(7); ctx.fillStyle = "rgba(255,255,255,.22)";
  for (let i = 0; i < (W * H) / 5200; i++) { ctx.beginPath(); ctx.arc(r() * W, r() * H, 1 + r() * 2.2, 0, 7); ctx.fill(); }
  stripe(ctx, 0, W, Math.round(W * 0.028)); stripe(ctx, H - Math.round(W * 0.028), W, Math.round(W * 0.028));
}
function stripe(ctx, y, W, h) {
  ctx.save(); ctx.beginPath(); ctx.rect(0, y, W, h); ctx.clip();
  const cols = [RED, "#ffffff", "#1d6a44", "#ffffff"], s = h * 1.1;
  for (let x = -h * 2, i = 0; x < W + h * 2; x += s, i++) { ctx.fillStyle = cols[i % 4]; ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x + h, y); ctx.lineTo(x + h + s, y); ctx.lineTo(x + s, y + h); ctx.fill(); }
  ctx.restore();
}
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function font(size, weight = 800, fam = DISPLAY) { return `${weight} ${size}px ${fam}`; }
// Wrapped text. Parts in *asterisks* are drawn in the accent color. Returns the y below the block.
function text(ctx, str, x, y, { size = 40, weight = 800, fam = DISPLAY, color = "#fff", accent = PINK, maxW = 900, lh = 1.1, align = "left" } = {}) {
  ctx.font = font(size, weight, fam); ctx.textBaseline = "top"; ctx.textAlign = "left";
  const words = []; String(str).split(/(\*[^*]+\*)/).forEach(chunk => { const hi = /^\*.*\*$/.test(chunk); chunk.replace(/\*/g, "").split(/(\s+)/).forEach(w => { if (w) words.push({ w, hi }); }); });
  const lines = []; let line = [], width = 0;
  words.forEach(t => { const tw = ctx.measureText(t.w).width; if (width + tw > maxW && line.length && t.w.trim()) { lines.push(line); line = []; width = 0; if (!t.w.trim()) return; } if (!line.length && !t.w.trim()) return; line.push(t); width += tw; });
  if (line.length) lines.push(line);
  lines.forEach((ln, i) => {
    while (ln.length && !ln[ln.length - 1].w.trim()) ln.pop();
    const lw = ln.reduce((a, t) => a + ctx.measureText(t.w).width, 0);
    let cx = align === "center" ? x - lw / 2 : align === "right" ? x - lw : x;
    ln.forEach(t => { ctx.fillStyle = t.hi ? accent : color; ctx.fillText(t.w, cx, y + i * size * lh); cx += ctx.measureText(t.w).width; });
  });
  return y + lines.length * size * lh;
}
function pill(ctx, str, x, y, { size = 26, bg = RED, color = "#fff", align = "left" } = {}) {
  ctx.font = font(size, 800, BODY); const t = str.toUpperCase(); const sp = size * 0.12;
  let w = 0; for (const ch of t) w += ctx.measureText(ch).width + sp; w -= sp;
  const pw = w + size * 1.6, ph = size * 1.9, px = align === "center" ? x - pw / 2 : x;
  ctx.fillStyle = bg; rr(ctx, px, y, pw, ph, ph / 2); ctx.fill();
  ctx.fillStyle = color; ctx.textBaseline = "middle"; let cx = px + size * 0.8;
  for (const ch of t) { ctx.fillText(ch, cx, y + ph / 2 + 1); cx += ctx.measureText(ch).width + sp; }
  return y + ph;
}
function framed(ctx, img, x, y, w, h, rot = 0) {
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rot * Math.PI / 180);
  const b1 = w * 0.026, b2 = w * 0.052, r = w * 0.08;
  ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = w * 0.08; ctx.shadowOffsetY = w * 0.04;
  ctx.fillStyle = RED; rr(ctx, -w / 2 - b2, -h / 2 - b2, w + b2 * 2, h + b2 * 2, r + b2); ctx.fill();
  ctx.shadowColor = "transparent"; ctx.fillStyle = "#fff"; rr(ctx, -w / 2 - b1, -h / 2 - b1, w + b1 * 2, h + b1 * 2, r + b1); ctx.fill();
  ctx.save(); rr(ctx, -w / 2, -h / 2, w, h, r); ctx.clip();
  const s = Math.max(w / img.width, h / img.height), iw = img.width * s, ih = img.height * s;
  ctx.drawImage(img, -iw / 2, -h / 2 - (ih - h) * 0.15, iw, ih);
  ctx.restore(); ctx.restore();
}
function card(ctx, x, y, w, h, rot = 0, fill = CREAM) {
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rot * Math.PI / 180);
  ctx.shadowColor = "rgba(0,0,0,.3)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18; ctx.fillStyle = fill; rr(ctx, -w / 2, -h / 2, w, h, 30); ctx.fill(); ctx.restore();
}
function check(ctx, str, x, y, size = 34, color = "#fff") {
  ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(x + size * 0.45, y + size * 0.62, size * 0.45, 0, 7); ctx.fill();
  ctx.strokeStyle = GREEN; ctx.lineWidth = size * 0.11; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath();
  ctx.moveTo(x + size * 0.25, y + size * 0.63); ctx.lineTo(x + size * 0.4, y + size * 0.78); ctx.lineTo(x + size * 0.67, y + size * 0.47); ctx.stroke();
  return text(ctx, str, x + size * 1.3, y, { size, weight: 800, fam: BODY, color, maxW: 1400 });
}
function footer(ctx, W, H, { center = false } = {}) {
  const pad = W * 0.074, y = H - W * 0.028 - W * 0.19;
  const shortLink = LINK.replace(/^https?:\/\//, "");
  if (center) {
    text(ctx, S.name || "", W / 2, y, { size: W * 0.036, weight: 800, fam: BODY, color: PINK, align: "center", maxW: W });
    text(ctx, shortLink, W / 2, y + W * 0.055, { size: Math.min(W * 0.05, (W * 1.7) / shortLink.length), color: "#fff", align: "center", maxW: W * 2 });
  } else {
    text(ctx, S.name || "", pad, y, { size: W * 0.034, weight: 800, fam: BODY, color: PINK, maxW: W });
    text(ctx, shortLink, pad, y + W * 0.05, { size: Math.min(W * 0.048, (W * 1.6) / shortLink.length), color: "#fff", maxW: W * 2 });
  }
}
function sleepsUntil(dateStr) {
  const d = dateStr ? new Date(dateStr + "T12:00:00") : new Date();
  let x = new Date(d.getFullYear(), 11, 25); if (d > new Date(d.getFullYear(), 11, 25, 23)) x = new Date(d.getFullYear() + 1, 11, 25);
  return Math.round((x - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 864e5);
}

// ---------- templates ----------
const P = 80; // side padding at 1080 wide
const T = [];
T.push({ id: "post", group: "Announce", title: "Announcement post", size: [1080, 1350], note: "Feed post, Facebook, and your Facebook group",
  draw(ctx, W, H) { background(ctx, W, H);
    let y = pill(ctx, "Free for our families", P, 90);
    y = text(ctx, "Your little one can *chat with Santa!*", P, y + 30, { size: 104, maxW: W - P * 2, lh: 0.98 });
    framed(ctx, photo, W - P - 420, y + 50, 420, 525, 3);
    let y2 = text(ctx, "Tap their answers, add their wishes, and Santa writes back with a letter from the North Pole.", P, y + 60, { size: 36, weight: 700, fam: BODY, color: "#d5eadd", maxW: 460, lh: 1.3 });
    y2 = check(ctx, "Letter from Santa", P, y2 + 36, 32); y2 = check(ctx, "Nice List certificate", P, y2 + 14, 32); check(ctx, "Santa Tracker, Dec 24", P, y2 + 14, 32);
    footer(ctx, W, H); },
  caption: () => `🎅 Santa wants to hear from your little one!\n\nThis year we made something magical for our families: your child can chat with Santa at the North Pole, tell him their wishes, and get a letter back plus their very own Nice List certificate.\n\nIt's free for our families. Tap the link in our bio, or go to ${LINK.replace(/^https?:\/\//, "")}\n\n#santa #christmasmagic #nicelist #${(S.slug || "").replace(/-/g, "")}` });

const CAROUSEL = [
  { title: "Slide 1", draw(ctx, W, H) { background(ctx, W, H);
      pill(ctx, S.name || "Our studio", W / 2, 90, { align: "center", bg: "rgba(255,255,255,.14)" });
      text(ctx, "Santa wants to hear from *your little one*", W / 2, 210, { size: 100, maxW: W - P * 2, align: "center", lh: 0.98 });
      framed(ctx, photo, W / 2 - 250, 520, 500, 625, -2);
      text(ctx, "Swipe →", W - P, H - 150, { size: 44, fam: BODY, color: PINK, align: "right" }); } },
  { title: "Slide 2", draw(ctx, W, H) { background(ctx, W, H);
      let y = pill(ctx, "How it works", P, 110);
      y = text(ctx, "Three easy steps from your couch", P, y + 30, { size: 88, maxW: W - P * 2, lh: 1 });
      [["1", "Open our Santa page", "On your phone, tablet, or computer."], ["2", "Chat with Santa", "Your child taps answers: their name, a good deed, their wishes."], ["3", "Santa writes back", "A letter, a Nice List certificate, and his favorite cookie recipe."]].forEach(([n, h, s], i) => {
        const cy = y + 60 + i * 215; ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(P + 50, cy + 50, 50, 0, 7); ctx.fill();
        text(ctx, n, P + 50, cy + 14, { size: 64, align: "center" });
        const yy = text(ctx, h, P + 140, cy, { size: 54, maxW: W - P * 2 - 140 });
        text(ctx, s, P + 140, yy + 6, { size: 34, weight: 700, fam: BODY, color: "#d5eadd", maxW: W - P * 2 - 140, lh: 1.3 }); });
      footer(ctx, W, H); } },
  { title: "Slide 3", draw(ctx, W, H) { background(ctx, W, H);
      let y = pill(ctx, "What your child gets", P, 110);
      y = text(ctx, "A little *North Pole magic* all December", P, y + 30, { size: 88, maxW: W - P * 2, lh: 1 });
      card(ctx, P, y + 60, W - P * 2, 480, -1.5);
      let yy = y + 110;
      ["A personal letter from Santa", "Their name on the official Nice List", "Santa's favorite cookie recipe", "A kindness quiz: the Nice-o-Meter", "The Santa Tracker on Christmas Eve"].forEach(t => { yy = check(ctx, t, P + 50, yy, 38, INK) + 26; });
      text(ctx, "Grown-ups: get a note from Santa to read aloud every morning, Dec 1 to 24.", P, y + 590, { size: 34, weight: 700, fam: BODY, color: PINK, maxW: W - P * 2, lh: 1.3 });
      footer(ctx, W, H); } },
  { title: "Slide 4", draw(ctx, W, H) { background(ctx, W, H);
      let y = pill(ctx, "Coming to see Santa?", P, 110);
      y = text(ctx, "Santa will already *know your child* when you arrive", P, y + 30, { size: 84, maxW: W - P * 2, lh: 1 });
      y = text(ctx, "Meeting Santa can feel big for little ones. When they chat with him at home first, he greets them by name and asks about their wish. Nervous kids relax, and the smiles are real.", P, y + 36, { size: 36, weight: 700, fam: BODY, color: "#d5eadd", maxW: W - P * 2, lh: 1.35 });
      const days = (S.days || []).filter(d => d.date).slice(0, 3);
      if (days.length) { card(ctx, P, y + 44, W - P * 2, 70 + days.length * 92, 0);
        let yy = y + 80; days.forEach(d => { const a = text(ctx, d.date, P + 44, yy, { size: 44, color: RED, maxW: W - P * 2 - 88 }); text(ctx, d.time || "", P + 44, a, { size: 28, weight: 700, fam: BODY, color: MUTED, maxW: W - P * 2 - 88 }); yy += 92; }); }
      footer(ctx, W, H); } },
  { title: "Slide 5", draw(ctx, W, H) { background(ctx, W, H);
      framed(ctx, photo, W / 2 - 200, 120, 400, 500, 2);
      text(ctx, "Start chatting with *Santa*", W / 2, 700, { size: 104, maxW: W - P * 2, align: "center", lh: 0.98 });
      text(ctx, "Free for our families. Link in bio.", W / 2, 940, { size: 40, weight: 800, fam: BODY, color: "#d5eadd", align: "center", maxW: W - P * 2 });
      footer(ctx, W, H, { center: true }); } }
];
T.push({ id: "carousel", group: "Announce", title: "5-slide carousel", size: [1080, 1350], slides: CAROUSEL, note: "Instagram and Facebook carousel. Post all 5 in order.",
  caption: () => `Swipe to see how it works 👉\n\nOur families can chat with Santa at home this year! Your child tells Santa about their year, adds their wishes, and Santa writes back.\n\nComing to see Santa at our studio? Chat first, and he'll already know your little one when you arrive.\n\nFree for our families: ${LINK.replace(/^https?:\/\//, "")}` });

T.push({ id: "story", group: "Announce", title: "Announcement story", size: [1080, 1920], note: "Instagram or Facebook story. Add a link sticker to your page.",
  draw(ctx, W, H) { background(ctx, W, H);
    let y = pill(ctx, "New for our families", W / 2, 150, { align: "center", size: 32 });
    y = text(ctx, "Your child can *chat with Santa!*", W / 2, y + 40, { size: 130, maxW: W - P * 2, align: "center", lh: 0.96 });
    framed(ctx, photo, W / 2 - 240, y + 70, 480, 600, -2);
    text(ctx, "Tap the link to start", W / 2, y + 740, { size: 52, fam: BODY, color: PINK, align: "center", maxW: W });
    ctx.fillStyle = "rgba(255,255,255,.1)"; rr(ctx, P, y + 820, W - P * 2, 140, 30); ctx.fill();
    text(ctx, "[ put your link sticker here ]", W / 2, y + 872, { size: 34, weight: 700, fam: BODY, color: "rgba(255,255,255,.55)", align: "center" });
    footer(ctx, W, H, { center: true }); },
  caption: () => `Story tip: add a Link sticker pointing to ${LINK} and place it in the dotted box.` });

T.push({ id: "countdown", group: "Countdown", title: "Sleeps until Christmas", size: [1080, 1920], countdown: true, note: "Post this on any day. Pick the date and the number updates.",
  draw(ctx, W, H, o) { background(ctx, W, H); const n = sleepsUntil(o.date);
    pill(ctx, "Countdown to Christmas", W / 2, 180, { align: "center", size: 32 });
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.3)"; ctx.shadowBlur = 30; ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(W / 2, 640, 330, 0, 7); ctx.fill(); ctx.restore();
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(W / 2, 640, 300, 0, 7); ctx.stroke();
    text(ctx, String(n), W / 2, 640 - (n > 99 ? 190 : 230), { size: n > 99 ? 300 : 400, align: "center", lh: 1 });
    text(ctx, n === 1 ? "sleep until Christmas" : "sleeps until Christmas", W / 2, 1010, { size: 92, align: "center", maxW: W - P });
    text(ctx, "Has your little one chatted with *Santa* yet?", W / 2, 1180, { size: 60, align: "center", maxW: W - P * 2, lh: 1.05 });
    text(ctx, "Tap the link: it's free for our families", W / 2, 1400, { size: 38, weight: 700, fam: BODY, color: "#d5eadd", align: "center", maxW: W - P * 2 });
    footer(ctx, W, H, { center: true }); },
  caption: o => { const n = sleepsUntil(o.date); return `⏰ ${n} ${n === 1 ? "sleep" : "sleeps"} until Christmas!\n\nHas your little one told Santa their wish yet? Chat with him at ${LINK.replace(/^https?:\/\//, "")} 🎅`; } });

T.push({ id: "countdown-post", group: "Countdown", title: "Countdown square post", size: [1080, 1080], countdown: true, note: "Square version for your feed.",
  draw(ctx, W, H, o) { background(ctx, W, H); const n = sleepsUntil(o.date);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.3)"; ctx.shadowBlur = 30; ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(330, 470, 250, 0, 7); ctx.fill(); ctx.restore();
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(330, 470, 226, 0, 7); ctx.stroke();
    text(ctx, String(n), 330, 470 - (n > 99 ? 140 : 170), { size: n > 99 ? 220 : 300, align: "center", lh: 1 });
    const y = text(ctx, n === 1 ? "sleep until *Christmas!*" : "sleeps until *Christmas!*", 640, 290, { size: 84, maxW: 380, lh: 0.98 });
    text(ctx, "Tell Santa your wish before he packs the sleigh.", 640, y + 30, { size: 32, weight: 700, fam: BODY, color: "#d5eadd", maxW: 380, lh: 1.3 });
    footer(ctx, W, H); },
  caption: o => { const n = sleepsUntil(o.date); return `Only ${n} ${n === 1 ? "sleep" : "sleeps"} to go! 🎄 Santa is reading wish lists now. Chat with him: ${LINK.replace(/^https?:\/\//, "")}`; } });

T.push({ id: "booked", group: "Booked families", title: "For families booked for Santa", size: [1080, 1920], note: "Story for families who booked a Santa session. Send them their special link too.",
  draw(ctx, W, H) { background(ctx, W, H);
    let y = pill(ctx, "Booked for Santa?", W / 2, 170, { align: "center", size: 34 });
    y = text(ctx, "Here's a little *secret*...", W / 2, y + 50, { size: 120, align: "center", maxW: W - P * 2, lh: 0.98 });
    y = text(ctx, "Before your session, let your child chat with Santa at home. When you arrive, he'll already know their name, their wish, and maybe even their dog's name.", W / 2, y + 50, { size: 46, weight: 700, fam: BODY, color: "#d5eadd", align: "center", maxW: W - P * 2, lh: 1.35 });
    framed(ctx, photo, W / 2 - 230, y + 70, 460, 575, 2);
    text(ctx, "Check your email for your special link", W / 2, y + 740, { size: 52, align: "center", maxW: W - P * 2, color: PINK });
    footer(ctx, W, H, { center: true }); },
  caption: () => `To our families booked for Santa: check your inbox! 🎅 We sent you a special link so your little one can chat with Santa before your session. He'll greet them like an old friend.` });

T.push({ id: "days", group: "Santa sessions", title: "Santa session days", size: [1080, 1350], needs: "days", note: "Promote your Santa session days.",
  draw(ctx, W, H) { background(ctx, W, H);
    let y = pill(ctx, "Now booking", P, 100);
    y = text(ctx, `Santa is coming to *${S.name || "our studio"}*`, P, y + 30, { size: 92, maxW: W - P * 2, lh: 1 });
    const days = (S.days || []).filter(d => d.date).slice(0, 4);
    framed(ctx, photo, W - P - 300, y + 60, 300, 375, 4);
    let yy = y + 60; days.forEach(d => { const a = text(ctx, d.date, P, yy, { size: 50, maxW: W - P * 2 - 360 }); yy = text(ctx, d.time || "", P, a, { size: 30, weight: 700, fam: BODY, color: "#d5eadd", maxW: W - P * 2 - 360 }) + 34; });
    text(ctx, "Your child can chat with Santa at home first, so he knows them when they arrive.", P, Math.max(yy, y + 480) + 20, { size: 34, weight: 700, fam: BODY, color: PINK, maxW: W - P * 2, lh: 1.3 });
    footer(ctx, W, H); },
  caption: () => { const days = (S.days || []).filter(d => d.date).map(d => `🎄 ${d.date}${d.time ? " · " + d.time : ""}`).join("\n"); return `Santa is coming to ${S.name}! 🎅\n\n${days}\n\nBooked families get a special link so their child can chat with Santa before the big day. Book your spot at the link in our bio.`; } });

T.push({ id: "toy", group: "Santa sessions", title: "Toy drive", size: [1080, 1350], needs: "toy", note: "Uses the toy drive wording from your Settings.",
  draw(ctx, W, H) { background(ctx, W, H); const TT = toyText(S);
    let y = pill(ctx, "Santa's helper mission", P, 100);
    y = text(ctx, TT.kidTitle, P, y + 30, { size: 92, maxW: W - P * 2, lh: 1 });
    const probe = document.createElement("canvas").getContext("2d");
    const endY = text(probe, TT.parentText, P + 50, 0, { size: 38, weight: 800, fam: BODY, maxW: W - P * 2 - 100, lh: 1.3 });
    card(ctx, P, y + 60, W - P * 2, Math.min(560, endY + 110), -1.5, "#ffffff");
    text(ctx, TT.parentText, P + 50, y + 115, { size: 38, weight: 800, fam: BODY, color: INK, maxW: W - P * 2 - 100, lh: 1.3 });
    footer(ctx, W, H); },
  caption: () => { const TT = toyText(S); return `🎁 Be one of Santa's helpers!\n\n${TT.parentText}\n\nLittle helpers make the biggest magic. 💚`; } });

T.push({ id: "tracker", group: "Christmas Eve", title: "Track Santa tonight", size: [1080, 1920], note: "Post on December 24.",
  draw(ctx, W, H) { background(ctx, W, H);
    let y = pill(ctx, "December 24", W / 2, 170, { align: "center", size: 34 });
    y = text(ctx, "Santa is on his way *tonight!*", W / 2, y + 50, { size: 130, align: "center", maxW: W - P * 2, lh: 0.96 });
    framed(ctx, photo, W / 2 - 260, y + 70, 520, 650, -2);
    y = text(ctx, `Watch his sleigh fly around the world and stop in ${S.town || "our town"}.`, W / 2, y + 820, { size: 48, weight: 700, fam: BODY, color: "#d5eadd", align: "center", maxW: W - P * 2, lh: 1.3 });
    text(ctx, "Then off to bed!", W / 2, y + 30, { size: 60, color: PINK, align: "center" });
    footer(ctx, W, H, { center: true }); },
  caption: () => `🦌 Santa has left the North Pole! Track his sleigh tonight and watch him stop in ${S.town || "our town"}: ${LINK.replace(/^https?:\/\//, "")}\n\nMerry Christmas from all of us at ${S.name}! ❤️` });

T.push({ id: "flyer", group: "Print", title: "Printable QR sign", size: [2550, 3300], qr: true, note: "Print on letter paper for your front desk, Santa set, or local shops.",
  draw(ctx, W, H) { background(ctx, W, H);
    let y = pill(ctx, "Free for our families", W / 2, 260, { align: "center", size: 70 });
    y = text(ctx, "Scan to chat with *Santa!*", W / 2, y + 90, { size: 300, align: "center", maxW: W - 360, lh: 0.95 });
    const q = 1200, qx = W / 2 - q / 2, qy = y + 120;
    ctx.fillStyle = "#fff"; rr(ctx, qx - 80, qy - 80, q + 160, q + 160, 80); ctx.fill();
    drawQR(ctx, FULL, qx, qy, q);
    text(ctx, LINK.replace(/^https?:\/\//, ""), W / 2, qy + q + 160, { size: Math.min(120, (W * 1.7) / LINK.length), color: "#fff", align: "center", maxW: W * 2 });
    text(ctx, S.name || "", W / 2, H - 480, { size: 110, fam: BODY, color: PINK, align: "center", maxW: W - 300 }); },
  caption: () => `Print tip: choose "Fit to page" on letter-size paper. Put one at your front desk, on the Santa set, and in local coffee shops or preschools (with permission).` });

function drawQR(ctx, url, x, y, size) {
  if (typeof window.qrcode !== "function") { ctx.fillStyle = INK; text(ctx, "QR code unavailable", x + size / 2, y + size / 2, { size: 60, color: INK, align: "center" }); return; }
  const qr = window.qrcode(0, "M"); qr.addData(url); qr.make();
  const n = qr.getModuleCount(), m = size / n; ctx.fillStyle = GREEN;
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) ctx.fillRect(Math.floor(x + c * m), Math.floor(y + r * m), Math.ceil(m), Math.ceil(m));
}

// ---------- words ----------
function words() {
  const short = LINK.replace(/^https?:\/\//, ""), name = S.name || "our studio";
  const days = (S.days || []).filter(d => d.date);
  const dayLinks = days.map((d, i) => `${d.date}: ${FULL}${CODE ? "&" : "?"}visit=${i + 1}`).join("\n");
  const codeLine = CODE ? `\n\nYour family code: ${CODE.toUpperCase()}` : "";
  return [
    { title: "Email to all your clients", when: "Early November", text: `Subject: Santa wants to hear from your little one 🎅\n\nHi there!\n\nThis year we made something magical for our families. Your child can chat with Santa at the North Pole, tell him about their year, and add their wishes to his big book. Santa writes back with a letter and puts them on the official Nice List.\n\nGrown-ups can also sign up for a short note from Santa every morning, December 1 to 24, to read aloud at breakfast.\n\nIt's free for our families:\n${LINK}\n\nWith love,\n${name}` },
    { title: "Email to families booked for Santa", when: "Right after they book, and again 1 week before", text: `Subject: A secret before your Santa session 🤫\n\nHi!\n\nWe can't wait to see you for your Santa session. Here's a little secret: before you come, let your child chat with Santa using this special link. When you arrive, Santa will already know their name, their wish, and maybe even their pet's name.\n\n${days.length ? "Your special link (pick your session day):\n" + dayLinks : FULL}${codeLine}\n\nAt the end of the chat, open the grown-ups door and tick "Share my child's answers" so Santa gets the details.\n\nSee you soon!\n${name}` },
    { title: "Line for your booking confirmation", when: "Add once to your booking emails", text: `🎅 Before your session: let your child chat with Santa at home! He'll greet them by name when you arrive. ${days.length ? "Use the link for your day:\n" + dayLinks : FULL}${codeLine}` },
    { title: "Text message", when: "Any time", text: `Hi from ${name}! 🎅 Your little one can chat with Santa this year and get a letter back from the North Pole. Free for our families: ${short}` },
    { title: "December 1 reminder", when: "December 1", text: `Santa's daily notes start today! 🎄 Sign up to get a short note from Santa every morning until Christmas Eve, perfect for reading aloud at breakfast. Open ${short}, chat with Santa, then find the grown-ups door.` },
    { title: "Christmas Eve text", when: "December 24", text: `Santa has left the North Pole! 🦌 Track his sleigh tonight: ${short}. Merry Christmas from ${name}! ❤️` },
    { title: "Instagram bio link or website button", when: "November to December", text: `🎅 Chat with Santa: ${short}` },
    { title: "Email signature", when: "November to December", text: `P.S. Has your little one chatted with Santa yet? ${short}` }
  ];
}
const IDEAS = [
  ["Put it in your booking confirmation", "Every Santa family gets the link automatically. Use the booked-day link so Santa mentions their visit."],
  ["Link in bio and a website button", "Add \"Chat with Santa\" to your Instagram link in bio and a button on your homepage."],
  ["Print the QR sign", "Front desk, Santa set, and your gallery reveal table. Parents scan it while they wait."],
  ["Local partners", "Ask preschools, dance studios, coffee shops, and toy stores to post your QR sign. It's a free gift for their families too."],
  ["School and mom-group newsletters", "Offer the link as a free holiday activity. Local parent groups love sharing free things."],
  ["A quick screen-recording reel", "Record your phone while a child chats with Santa (with permission). Add music and your link."],
  ["Pin a countdown post", "Post the sleeps-until-Christmas graphic once a week in December."],
  ["Thank-you after the session", "After their Santa session, send a note: \"Santa loved meeting you! Keep checking your daily notes.\""],
  ["Christmas Eve", "Post the tracker story. Families love watching Santa stop in their town."]
];

// ---------- UI ----------
const el = (tag, attrs = {}, ...kids) => { const e = document.createElement(tag); Object.entries(attrs).forEach(([k, v]) => k === "class" ? e.className = v : k.startsWith("on") ? e[k] = v : e.setAttribute(k, v)); kids.forEach(k => e.append(k)); return e; };
function download(canvas, name) {
  canvas.toBlob(b => { const u = URL.createObjectURL(b); const a = el("a", { href: u, download: name }); document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 1500); }, "image/png");
}
function copyBtn(getText, label = "Copy") {
  const b = el("button", { type: "button", class: "btn small ghost" }, label);
  b.onclick = () => { navigator.clipboard.writeText(getText()).then(() => { b.textContent = "Copied"; setTimeout(() => b.textContent = label, 1500); }).catch(() => {}); };
  return b;
}
function loadImg(src) { return new Promise(res => { const i = new Image(); i.crossOrigin = "anonymous"; i.onload = () => res(i); i.onerror = () => res(null); i.src = src; }); }

export async function initMarketing(studio, siteUrl, root) {
  S = studio; SITE = siteUrl; $root = root; RED = S.color || "#c61f2e";
  LINK = S.slug ? `${SITE}/${S.slug}` : `${SITE}/yourstudio`;
  CODE = S.private && S.family_code ? S.family_code : "";
  FULL = CODE ? `${LINK}?code=${encodeURIComponent(CODE)}` : LINK;
  root.innerHTML = "";
  if (!S.slug) { root.append(el("p", { class: "muted" }, "Save your page link in Settings first. Your graphics use it.")); return; }
  root.append(el("p", { class: "muted", style: "margin:0 0 6px" }, "Loading your graphics…"));
  try { await Promise.all([document.fonts.load(font(80)), document.fonts.load(font(40, 800, BODY)), document.fonts.load(font(40, 700, BODY))]); } catch (e) {}
  photo = (S.photos && S.photos.wave && await loadImg(S.photos.wave)) || await loadImg(DEFAULT_PHOTOS.wave);
  root.innerHTML = "";

  root.append(el("div", { class: "mk-intro" },
    el("h2", {}, "Your marketing kit"),
    el("p", { class: "muted" }, "Everything below already has your studio name, color, link, and Santa photo. Download the images and copy the words. If you change your settings, save, then reopen this tab to refresh.")));

  const groups = [...new Set(T.map(t => t.group))];
  let dateVal = new Date().toISOString().slice(0, 10);
  groups.forEach(g => {
    const list = T.filter(t => t.group === g && (!t.needs || (t.needs === "days" ? (S.days || []).some(d => d.date) : !!S.toy_on)));
    if (!list.length) return;
    root.append(el("h3", { class: "mk-group" }, g));
    const grid = el("div", { class: "mk-grid" }); root.append(grid);
    list.forEach(t => {
      const box = el("div", { class: "card mk-card" });
      const [W, H] = t.size; const opts = { date: dateVal };
      const canvases = (t.slides || [t]).map(s => { const c = el("canvas", { width: W, height: H, class: "mk-canvas" }); s.draw(c.getContext("2d"), W, H, opts); return c; });
      const prev = el("div", { class: "mk-prev" + (t.slides ? " mk-slides" : "") }); canvases.forEach(c => prev.append(c));
      box.append(prev, el("b", { class: "mk-title" }, t.title), el("span", { class: "fine" }, `${t.note} · ${W}×${H}`));
      const cap = el("textarea", { class: "field mk-cap", rows: "5" }); cap.value = t.caption(opts);
      if (t.countdown) {
        const d = el("input", { type: "date", class: "field", value: dateVal, "aria-label": "Post date" });
        d.onchange = () => { opts.date = d.value; const c = canvases[0]; c.getContext("2d").clearRect(0, 0, W, H); t.draw(c.getContext("2d"), W, H, opts); cap.value = t.caption(opts); };
        box.append(el("label", { class: "lbl" }, "Date you'll post it", d));
      }
      const row = el("div", { class: "linkbox" });
      if (t.slides) {
        row.append(el("button", { type: "button", class: "btn small", onclick: () => canvases.forEach((c, i) => setTimeout(() => download(c, `${S.slug}-${t.id}-${i + 1}.png`), i * 600)) }, "Download all 5"));
      } else {
        row.append(el("button", { type: "button", class: "btn small", onclick: () => download(canvases[0], `${S.slug}-${t.id}.png`) }, "Download"));
      }
      row.append(copyBtn(() => cap.value, "Copy caption"));
      box.append(row, cap); grid.append(box);
    });
  });

  root.append(el("h3", { class: "mk-group" }, "Emails and texts"));
  const wg = el("div", { class: "mk-grid" }); root.append(wg);
  words().forEach(w => { const ta = el("textarea", { class: "field mk-cap", rows: "8" }); ta.value = w.text;
    wg.append(el("div", { class: "card mk-card" }, el("b", { class: "mk-title" }, w.title), el("span", { class: "fine" }, "When: " + w.when), ta, el("div", { class: "linkbox" }, copyBtn(() => ta.value)))); });

  root.append(el("h3", { class: "mk-group" }, "More ways to spread the word"));
  const ul = el("ol", { class: "mk-ideas" }); IDEAS.forEach(([h, d]) => ul.append(el("li", {}, el("b", {}, h), el("span", {}, d)))); root.append(ul);
}
