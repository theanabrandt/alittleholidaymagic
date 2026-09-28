// Shared content for the family page, the dashboard, and the email functions.
// ES module: imported by the browser and bundled into Netlify functions.

export const RESERVED_SLUGS = ["api","dashboard","demo","privacy","terms","js","img","css","admin","login","santa","unsubscribe","www","mail","help","support"];

export const DEFAULT_PHOTOS = {
  wave: "/img/santa-wave.jpg",
  read: "/img/santa-read.jpg",
  write: "/img/santa-write.jpg",
  gift: "/img/santa-gift.jpg",
  avatar: "/img/santa-avatar.jpg"
};

export const DEMO_STUDIO = {
  slug: "demo",
  name: "Ana Brandt Photography",
  tagline: "A holiday gift for our families",
  color: "#c61f2e",
  town: "Orange County, CA",
  toy_on: true,
  charity: "our local children's toy drive",
  bonus: "Get one bonus digital image added to your package.",
  gift_pick: "A Santa session or holiday portrait gift card from our studio",
  days: [
    { date: "Saturday, December 5", time: "9am to 2pm · Tustin studio", link: "https://anabrandt.com" },
    { date: "Sunday, December 6", time: "10am to 3pm · Tustin studio", link: "https://anabrandt.com" },
    { date: "Saturday, December 12", time: "9am to 1pm · New York studio", link: "https://anabrandt.com" }
  ],
  notes: {},
  photos: {}
};

// Santa's 24 daily notes. {name} becomes the child's first name.
export const NOTES = [
  "Ho ho ho, {name}! The countdown has begun. My elves started painting toys this morning. Can you do one kind thing today?",
  "Good morning, {name}! Did you know reindeer have fur on the bottom of their hooves? It keeps them from slipping on the ice.",
  "{name}, today's elf challenge: make someone laugh before lunch. I'll be listening for giggles!",
  "Mrs. Claus baked 400 cookies yesterday, {name}, and I only ate 12. Okay, maybe 13.",
  "{name}, I checked my big book this morning. Your gold star is still shining bright!",
  "Brrr! It's snowing at the North Pole today, {name}. The elves built a snow reindeer. Can you draw one?",
  "Today's kindness mission, {name}: help someone at home without being asked. The elves will notice!",
  "{name}, my sleigh got a fresh coat of red paint. It's so shiny I can see my beard in it!",
  "Reading time! The elves love bedtime stories. What book will you read tonight, {name}?",
  "Fun fact, {name}: a reindeer's nose warms up the cold air before it breathes it in.",
  "{name}, can you say \"thank you\" three times today? Elves collect thank-yous in a jar.",
  "Halfway to Christmas Eve, {name}! The toy workshop is humming. I can hear the little hammers from my office.",
  "{name}, today let's share something. A toy, a snack, or a big hug all count.",
  "The reindeer practiced flying loops last night, {name}. Nobody got dizzy except me!",
  "{name}, my elves wrote your name in gold letters in the big book today.",
  "Today's challenge, {name}: tidy up one thing without being asked. Elves love a tidy room.",
  "Ho ho ho, {name}! I tried on my Christmas Eve suit today. Still fits. Mostly.",
  "{name}, did you know I read every wish list twice? Yours made me smile both times.",
  "The elves are wrapping presents now, {name}. They use 1,000 rolls of ribbon every year!",
  "{name}, tell someone in your family what you love about them today.",
  "Only a few more sleeps, {name}! The reindeer are eating extra oats for the big trip.",
  "{name}, don't forget: I'll be looking for cookies on Christmas Eve. Have you picked your plate?",
  "Tomorrow is the big night, {name}! Help your grown-ups get the house ready for my visit.",
  "Tonight's the night, {name}! Go to sleep early so I can land the sleigh. Merry Christmas!"
];
export const VISIT_NOTE = "{name}, today's the day you come visit me! I'll be waiting in my big chair, and I already know all about you. Ho ho ho!";

export const fillName = (t, name) => String(t || "").replace(/\{name\}/gi, name || "friend");
export const decDate = d => { const m = /\bDec(?:ember)?\.?\s+(\d{1,2})\b/i.exec(d || ""); return m ? +m[1] : null; };

// Toy drive wording. Studios can rewrite every line; blanks fall back to these.
export function toyText(S) {
  const t = (S && S.toy) || {};
  const item = (t.item || "").trim() || "a new, unwrapped toy";
  const oldParent = S && (S.charity || S.bonus) ? `Bring ${item} to your Santa session. It goes to ${S.charity || "a local toy drive"}. ${S.bonus || ""}`.trim() : "";
  return {
    item,
    kidTitle: (t.kid_title || "").trim() || "Bring a toy for another child",
    kidText: (t.kid_text || "").trim() || "Some children need a little extra Christmas magic this year. When you visit Santa, bring a new toy and you'll become one of his official elf helpers!",
    parentTitle: (t.parent_title || "").trim() || "Toy drive",
    parentText: (t.parent_text || "").trim() || oldParent || `Bring ${item} to your Santa session.`
  };
}

// The note for a given December day. Studio overrides win, then the visit-day note, then Santa's default.
export function noteFor(studio, day, name, visitDate) {
  const ov = studio && studio.notes && studio.notes[String(day)];
  if (ov) return { text: fillName(ov, name), custom: true };
  if (visitDate && decDate(visitDate) === day) return { text: fillName(VISIT_NOTE, name) + " Love, Santa", custom: false };
  return { text: fillName(NOTES[day - 1], name) + " Love, Santa", custom: false };
}

export const RECIPES = {
  sugar: { title: "Sugar Cookies", meta: ["Oven 375°F", "8–10 min", "About 3 dozen"],
    ing: ["2¾ cups flour", "1 tsp baking soda", "½ tsp baking powder", "1 cup butter, softened", "1½ cups sugar", "1 egg", "1 tsp vanilla", "Sprinkles for decorating"],
    steps: ["Mix the flour, baking soda, and baking powder in a bowl.", "In a big bowl, beat the butter and sugar until fluffy. Beat in the egg and vanilla.", "Stir in the flour mix a little at a time.", "Roll into balls, add sprinkles, and bake on an ungreased sheet for 8 to 10 minutes."] },
  choc: { title: "Chocolate Chip Cookies", meta: ["Oven 375°F", "9–11 min", "About 4 dozen"],
    ing: ["2¼ cups flour", "1 tsp baking soda", "1 tsp salt", "1 cup butter, softened", "¾ cup sugar", "¾ cup brown sugar", "1 tsp vanilla", "2 eggs", "2 cups chocolate chips"],
    steps: ["Mix the flour, baking soda, and salt in a bowl.", "Beat the butter, both sugars, and vanilla until creamy. Add the eggs one at a time.", "Stir in the flour mix, then the chocolate chips.", "Drop spoonfuls onto a baking sheet and bake 9 to 11 minutes."] },
  ginger: { title: "Gingerbread Cookies", meta: ["Oven 350°F", "9–11 min", "Chill 2 hours"],
    ing: ["3 cups flour", "1 tbsp ground ginger", "1¾ tsp cinnamon", "¼ tsp ground cloves", "¾ tsp baking soda", "¼ tsp salt", "6 tbsp butter, softened", "¾ cup brown sugar", "1 egg", "½ cup molasses", "2 tsp vanilla"],
    steps: ["Mix the flour, spices, baking soda, and salt.", "Beat the butter and brown sugar. Add the egg, molasses, and vanilla.", "Stir in the flour mix, wrap the dough, and chill for 2 hours.", "Roll out, cut into shapes, and bake 9 to 11 minutes."] },
  oat: { title: "Oatmeal Cookies", meta: ["Oven 350°F", "10–12 min", "About 4 dozen"],
    ing: ["1 cup butter, softened", "1 cup brown sugar", "½ cup sugar", "2 eggs", "1 tsp vanilla", "1½ cups flour", "1 tsp baking soda", "1 tsp cinnamon", "½ tsp salt", "3 cups oats", "1 cup raisins (optional)"],
    steps: ["Beat the butter and both sugars. Add the eggs and vanilla.", "Mix in the flour, baking soda, cinnamon, and salt.", "Stir in the oats and raisins.", "Drop spoonfuls onto a baking sheet and bake 10 to 12 minutes."] },
  snick: { title: "Snickerdoodles", meta: ["Oven 400°F", "8–10 min", "About 4 dozen"],
    ing: ["1 cup butter, softened", "1½ cups sugar", "2 eggs", "2¾ cups flour", "2 tsp cream of tartar", "1 tsp baking soda", "¼ tsp salt", "For rolling: 2 tbsp sugar + 2 tsp cinnamon"],
    steps: ["Beat the butter and sugar. Add the eggs.", "Mix in the flour, cream of tartar, baking soda, and salt.", "Roll the dough into balls, then roll them in cinnamon sugar.", "Bake 8 to 10 minutes."] }
};
export const COOKIE_KEY = { "sugar cookies": "sugar", "chocolate chip": "choc", "gingerbread": "ginger", "oatmeal": "oat", "snickerdoodles": "snick" };

export const QUIZ = [
  { q: "Your little brother knocks over your block tower. What do you do?", a: [["Help him build a new one together", 2], ["Take a deep breath and build it again", 1], ["Yell at him", 0]] },
  { q: "A friend at school forgot their snack. What do you do?", a: [["Share some of mine", 2], ["Tell a teacher", 1], ["Eat mine quickly", 0]] },
  { q: "It's time to clean up your toys. What do you do?", a: [["Clean up right away", 2], ["Clean up after one more minute", 1], ["Hide them under the bed", 0]] },
  { q: "Grandma gives you socks for a present. What do you say?", a: [["Thank you, Grandma! I love you!", 2], ["Thanks!", 1], ["Socks? Again?", 0]] },
  { q: "Someone new is sitting alone at the park. What do you do?", a: [["Ask them to play", 2], ["Smile and wave", 1], ["Keep playing with my friends", 0]] }
];
export const QUIZ_FB = [["That's pure North Pole kindness! Two gold stars!", "Ho ho ho! The elves are cheering!"], ["Good choice! One gold star.", "Nice! The elves wrote that down."], ["Hmm, the elves think you can do even better. Try being extra kind next time!"]];

// Update each season. Sources for 2026: The Toy Insider Hot 20, Good Morning America trending toys.
export const GIFTS_YEAR = 2026;
export const GIFTS = [
  ["Babies and toddlers (0 to 2)", ["Tickle Me Elmo Giggle Max", "Fisher-Price Little People Mario's Adventure Playset", "LEGO DUPLO Classic Brick Box", "Fisher-Price Rockin' Record Player"]],
  ["Ages 3 to 4", ["Bluey's Light & Surprise Heeler House", "Play-Doh Super Sizzlin' Kitchen Playset", "PAW Patrol Megasaurus Vehicle", "Melissa & Doug Cheery Lane House"]],
  ["Ages 5 to 7", ["KPop Demon Hunters Singing Fashion Dolls", "Primal Hatch Hatching Megalodon", "ChompSaw + Inventor's Club", "NeeDoh squishy collection", "Gui Gui Mega Slime Haul"]],
  ["Ages 8 and up", ["Pokémon TCG 30th Celebration Elite Trainer Box", "LEGO Star Wars Smart Play Throne Room Duel & A-Wing", "Disney Lorcana Collection Starter Set", "Kanoodle Fan Edition", "Miniverse Real Music Record Player"]]
];

// Santa Tracker stops: [name, lon, lat, December UTC offset]. Santa reaches each at local midnight.
export const STOPS = [
  ["Kiritimati", -157.4, 1.9, 14], ["Nuku'alofa, Tonga", -175.2, -21.1, 13], ["Auckland", 174.8, -36.9, 13], ["Suva, Fiji", 178.4, -18.1, 12],
  ["Sydney", 151.2, -33.9, 11], ["Melbourne", 145.0, -37.8, 11], ["Brisbane", 153.0, -27.5, 10], ["Guam", 144.8, 13.4, 10],
  ["Tokyo", 139.7, 35.7, 9], ["Seoul", 127.0, 37.6, 9], ["Manila", 121.0, 14.6, 8], ["Beijing", 116.4, 39.9, 8], ["Perth", 115.9, -32.0, 8],
  ["Jakarta", 106.8, -6.2, 7], ["Bangkok", 100.5, 13.8, 7], ["New Delhi", 77.2, 28.6, 5.5], ["Mumbai", 72.9, 19.1, 5.5], ["Karachi", 67.0, 24.9, 5],
  ["Dubai", 55.3, 25.2, 4], ["Moscow", 37.6, 55.8, 3], ["Nairobi", 36.8, -1.3, 3], ["Johannesburg", 28.0, -26.2, 2], ["Cairo", 31.2, 30.0, 2], ["Athens", 23.7, 38.0, 2],
  ["Rome", 12.5, 41.9, 1], ["Paris", 2.35, 48.9, 1], ["Lagos", 3.4, 6.5, 1], ["London", -0.1, 51.5, 0], ["Reykjavik", -21.9, 64.1, 0],
  ["Rio de Janeiro", -43.2, -22.9, -3], ["Buenos Aires", -58.4, -34.6, -3], ["Santiago", -70.7, -33.5, -3], ["Halifax", -63.6, 44.6, -4],
  ["New York", -74.0, 40.7, -5], ["Toronto", -79.4, 43.7, -5], ["Miami", -80.2, 25.8, -5], ["Atlanta", -84.4, 33.7, -5], ["Chicago", -87.6, 41.9, -6], ["Dallas", -96.8, 32.8, -6], ["Houston", -95.4, 29.8, -6], ["Mexico City", -99.1, 19.4, -6],
  ["Denver", -105.0, 39.7, -7], ["Salt Lake City", -111.9, 40.8, -7], ["Phoenix", -112.1, 33.4, -7], ["San Diego", -117.2, 32.7, -8], ["Orange County, CA", -117.8, 33.7, -8], ["Los Angeles", -118.2, 34.1, -8], ["San Francisco", -122.4, 37.8, -8], ["Seattle", -122.3, 47.6, -8], ["Vancouver", -123.1, 49.3, -8],
  ["Anchorage", -149.9, 61.2, -9], ["Honolulu", -157.9, 21.3, -10], ["Pago Pago", -170.7, -14.3, -11]
];

// Lines for Santa to say at the session, built from the chat answers.
const herHim = r => ["Dancer", "Vixen", "Cupid"].includes(r) ? "her" : "him";
const petPhrase = p => String(p || "").replace(/^(a|an|my)\s+/i, "your ");
export function santaLines(k, toyOn, item = "a toy") {
  const L = [
    `"${k.name}! I've been waiting for you. My elves gave you a gold star for ${k.deed}. That's why you're on the Nice List."`,
    `"I got your message about ${k.wish}. The elves are working very hard."`,
    `"Thank you for the ${k.cookie} tip. Those are my favorite!"`,
    `"${k.reindeer} says hello. ${k.reindeer} is so happy you picked ${herHim(k.reindeer)}."`
  ];
  if (k.pet && String(k.pet).toLowerCase() !== "no pets") L.push(`"And how is ${petPhrase(k.pet)}? Give them a pat from Santa."`);
  if (k.sibling && !["just me", "more than one!"].includes(k.sibling)) L.push(`"Are you being a good helper to your ${String(k.sibling).replace(/^an?\s+/, "")}?"`);
  if (toyOn && k.helper === "Yes") L.push(`"Thank you for bringing ${item}. You're one of my official elf helpers!"`);
  return L;
}
export { herHim, petPhrase };
