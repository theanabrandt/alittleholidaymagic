// Content for the Holiday Planner. Everything here is pre-written: no AI, nothing leaves the device.

// ---------- Gift Finder ----------
// ages: baby (0-1), toddler (1-3), little (4-7), big (8-12), teen, adult, grand
// tags: creative, outdoors, stem, books, music, sports, pretend, cozy, cooking, games, tech, experience, keepsake
// p: 1 = under $25, 2 = $25-50, 3 = $50-100, 4 = $100+
export const AGES = [
  ["baby", "Baby (0-1)"], ["toddler", "Toddler (1-3)"], ["little", "Kid (4-7)"], ["big", "Kid (8-12)"],
  ["teen", "Teen"], ["adult", "Adult"], ["grand", "Grandparent"]
];
export const INTERESTS = [
  ["creative", "Arts & crafts"], ["outdoors", "Outdoors"], ["stem", "Science & building"], ["books", "Books & reading"],
  ["music", "Music"], ["sports", "Sports & active"], ["pretend", "Pretend play"], ["cozy", "Cozy & self-care"],
  ["cooking", "Cooking & baking"], ["games", "Games & puzzles"], ["tech", "Tech & gadgets"], ["experience", "Experiences"],
  ["keepsake", "Sentimental"]
];
export const BUDGETS = [[1, "Under $25"], [2, "$25 to $50"], [3, "$50 to $100"], [4, "$100+"]];

export const GIFTS = [
  { n: "Soft fabric activity book", a: ["baby"], t: ["books", "pretend"], p: 1, w: "Crinkly pages and textures for tiny hands." },
  { n: "Stacking cups or rings", a: ["baby", "toddler"], t: ["stem", "games"], p: 1, w: "A classic that grows from chewing to stacking to counting." },
  { n: "Board books set", a: ["baby", "toddler"], t: ["books"], p: 1, w: "Sturdy pages for bedtime stories on repeat." },
  { n: "Baby's first Christmas ornament", a: ["baby"], t: ["keepsake"], p: 1, w: "Engraved with their name and year." },
  { n: "Musical play mat or baby piano", a: ["baby"], t: ["music"], p: 2, w: "Kick-to-play music for tummy time." },
  { n: "Wooden push walker with blocks", a: ["baby", "toddler"], t: ["stem", "sports"], p: 3, w: "Helps early walkers and doubles as a block cart." },
  { n: "Milestone photo session", a: ["baby"], t: ["keepsake", "experience"], p: 4, w: "Capture the sitter or first-birthday stage before it's gone." },
  { n: "Toddler kitchen play food set", a: ["toddler", "little"], t: ["pretend", "cooking"], p: 1, w: "Cut-apart fruits and veggies for little chefs." },
  { n: "Chunky crayons and a jumbo coloring pad", a: ["toddler"], t: ["creative"], p: 1, w: "Easy-grip crayons made for first scribbles." },
  { n: "Ride-on toy or balance bike", a: ["toddler", "little"], t: ["outdoors", "sports"], p: 3, w: "Builds balance before a pedal bike." },
  { n: "Magnetic building tiles", a: ["toddler", "little", "big"], t: ["stem", "creative"], p: 3, w: "Open-ended building that holds attention for years." },
  { n: "Dress-up costume trunk", a: ["toddler", "little"], t: ["pretend"], p: 2, w: "Capes, crowns, and hats for endless stories." },
  { n: "Toddler drum or rhythm set", a: ["toddler", "little"], t: ["music"], p: 1, w: "Shakers, tambourine, and a drum for kitchen concerts." },
  { n: "Peg puzzles with big knobs", a: ["toddler"], t: ["games", "stem"], p: 1, w: "First puzzles that little fingers can actually grab." },
  { n: "Personalized name puzzle", a: ["toddler", "little"], t: ["keepsake", "games"], p: 2, w: "Teaches letters with their own name." },
  { n: "Play kitchen or workbench", a: ["toddler", "little"], t: ["pretend", "cooking"], p: 4, w: "A big Christmas-morning gift they'll use daily." },
  { n: "Art easel with paper roll", a: ["toddler", "little"], t: ["creative"], p: 3, w: "Chalkboard on one side, whiteboard on the other." },
  { n: "Kids' gardening kit", a: ["little", "big"], t: ["outdoors", "stem"], p: 1, w: "Seeds, pots, and kid-size tools for spring." },
  { n: "Beginner LEGO-style building set", a: ["little", "big"], t: ["stem", "creative"], p: 2, w: "Pick a theme they love: animals, space, or vehicles." },
  { n: "Slime or science experiment kit", a: ["little", "big"], t: ["stem", "creative"], p: 1, w: "Gooey, colorful, and a little bit educational." },
  { n: "Picture book bundle by a favorite author", a: ["little"], t: ["books"], p: 2, w: "Wrap each book separately for more unwrapping fun." },
  { n: "Scooter and helmet", a: ["little", "big"], t: ["outdoors", "sports"], p: 3, w: "Get them outside after the holiday sugar rush." },
  { n: "Kids' camera", a: ["little", "big"], t: ["tech", "creative"], p: 2, w: "Their own camera for photos of pets, toys, and you." },
  { n: "First board game night set", a: ["little"], t: ["games"], p: 1, w: "Simple matching and counting games the whole family can play." },
  { n: "Doll or action figure with accessories", a: ["toddler", "little"], t: ["pretend"], p: 2, w: "Pick one that looks like a hero they love." },
  { n: "Kids' baking set with real tools", a: ["little", "big"], t: ["cooking"], p: 2, w: "Kid-safe tools plus a recipe card set." },
  { n: "Bedtime story projector or night light", a: ["toddler", "little"], t: ["cozy", "books"], p: 2, w: "Stars on the ceiling make bedtime easier." },
  { n: "Ice skating or snow day outing", a: ["little", "big", "teen"], t: ["experience", "sports", "outdoors"], p: 2, w: "A wrapped ticket and mittens for the box." },
  { n: "Friendship bracelet or bead kit", a: ["little", "big", "teen"], t: ["creative"], p: 1, w: "Hours of making, plus bracelets to give away." },
  { n: "Chapter book series box set", a: ["big"], t: ["books"], p: 2, w: "Start a series so they're hooked all winter." },
  { n: "Robot or coding kit", a: ["big", "teen"], t: ["stem", "tech"], p: 3, w: "Builds a robot they can program from a tablet." },
  { n: "Walkie-talkies", a: ["little", "big"], t: ["outdoors", "pretend", "tech"], p: 1, w: "Backyard spy missions and campout chatter." },
  { n: "Sketchbook and quality art markers", a: ["big", "teen", "adult"], t: ["creative"], p: 2, w: "Real artist supplies make kids feel grown-up." },
  { n: "Sports equipment for their team", a: ["little", "big", "teen"], t: ["sports", "outdoors"], p: 2, w: "A new ball, glove, or practice net." },
  { n: "Beginner ukulele", a: ["big", "teen", "adult"], t: ["music"], p: 2, w: "Easy first instrument with free video lessons online." },
  { n: "Strategy board game", a: ["big", "teen", "adult"], t: ["games"], p: 2, w: "A game the whole family can play after dinner." },
  { n: "1,000-piece jigsaw puzzle", a: ["teen", "adult", "grand"], t: ["games", "cozy"], p: 1, w: "The perfect holiday-break table project." },
  { n: "Trampoline park or climbing gym pass", a: ["little", "big", "teen"], t: ["experience", "sports"], p: 2, w: "Burn energy on a rainy day." },
  { n: "Telescope or microscope", a: ["big", "teen"], t: ["stem", "outdoors"], p: 4, w: "Planets, moon craters, or pond water up close." },
  { n: "Room decor: LED lights or a cozy throw", a: ["big", "teen"], t: ["cozy"], p: 1, w: "Lets them make their room feel like their own." },
  { n: "Wireless earbuds", a: ["teen", "adult"], t: ["tech", "music"], p: 3, w: "Pick a pair with a kid-safe volume limit for younger teens." },
  { n: "Instant camera and film", a: ["big", "teen", "adult"], t: ["tech", "creative", "keepsake"], p: 3, w: "Prints in seconds for walls and scrapbooks." },
  { n: "Concert or show tickets", a: ["teen", "adult", "grand"], t: ["experience", "music"], p: 4, w: "A memory, not more stuff." },
  { n: "Teen skincare or self-care set", a: ["teen"], t: ["cozy"], p: 2, w: "Gentle basics they'll actually use." },
  { n: "Portable phone charger", a: ["teen", "adult"], t: ["tech"], p: 1, w: "Useful every single day." },
  { n: "Cooking class for two", a: ["teen", "adult", "grand"], t: ["experience", "cooking"], p: 4, w: "Make it a date with the person who gave it." },
  { n: "Personalized cutting board", a: ["adult", "grand"], t: ["cooking", "keepsake"], p: 2, w: "Engraved with a family recipe or last name." },
  { n: "Cozy robe and slippers", a: ["adult", "grand"], t: ["cozy"], p: 3, w: "The gift everyone secretly wants." },
  { n: "Candle or coffee subscription", a: ["adult"], t: ["cozy", "cooking"], p: 2, w: "A little treat that shows up every month." },
  { n: "Family photo session", a: ["adult", "grand"], t: ["keepsake", "experience"], p: 4, w: "Everyone in the photo for once, including Mom." },
  { n: "Framed print of a favorite family photo", a: ["adult", "grand"], t: ["keepsake"], p: 3, w: "Pull one from this year's session and frame it big." },
  { n: "Photo book of the year", a: ["adult", "grand"], t: ["keepsake", "books"], p: 3, w: "This year's best phone photos, finally printed." },
  { n: "Digital photo frame preloaded with photos", a: ["grand"], t: ["keepsake", "tech"], p: 3, w: "Send new grandkid photos to it all year." },
  { n: "Handwritten recipe made into a tea towel", a: ["grand", "adult"], t: ["keepsake", "cooking"], p: 2, w: "Grandma's handwriting, kept forever." },
  { n: "Large-print puzzle book or audiobook subscription", a: ["grand"], t: ["books", "games"], p: 1, w: "Easy on the eyes, great for quiet afternoons." },
  { n: "Bird feeder and seed", a: ["grand", "adult"], t: ["outdoors"], p: 1, w: "A little show outside the window every morning." },
  { n: "Hand and footprint keepsake kit", a: ["grand", "adult"], t: ["keepsake", "creative"], p: 1, w: "Made by the grandkids, given to the grandparents." },
  { n: "Weighted blanket", a: ["teen", "adult"], t: ["cozy"], p: 3, w: "Calming and cozy for winter nights." },
  { n: "Smart speaker", a: ["adult", "grand"], t: ["tech", "music"], p: 3, w: "Music, timers, and video calls with family." },
  { n: "Hiking day pack and water bottle", a: ["teen", "adult"], t: ["outdoors", "sports"], p: 2, w: "Ready for the first spring trail." },
  { n: "Pottery or painting class", a: ["big", "teen", "adult"], t: ["experience", "creative"], p: 3, w: "Make something together and take it home." },
  { n: "Zoo, aquarium, or museum membership", a: ["toddler", "little", "big", "adult"], t: ["experience", "stem"], p: 4, w: "A year of family outings in one gift." },
  { n: "Family game night basket", a: ["little", "big", "teen", "adult"], t: ["games", "cooking"], p: 2, w: "A game, popcorn, and cocoa packets in a basket." },
  { n: "Letter from Santa keepsake box", a: ["toddler", "little"], t: ["keepsake"], p: 1, w: "A box to keep Santa's letters year after year." },
  { n: "Stocking stuffer: stickers and mini notebooks", a: ["toddler", "little", "big"], t: ["creative"], p: 1, w: "Cheap, cheerful, and always a hit." },
  { n: "Stocking stuffer: card game", a: ["little", "big", "teen", "adult"], t: ["games"], p: 1, w: "Small enough for the stocking, big on fun." },
  { n: "Stocking stuffer: lip balm, socks, and treats", a: ["teen", "adult", "grand"], t: ["cozy"], p: 1, w: "Useful little things that feel special." }
];

// ---------- Kids' activities ----------
// a: ages (a = 2-4, b = 5-7, c = 8-12), w: in / out, time: s (15 min), m (30-60 min), l (afternoon), mess: 0 tidy, 1 messy
export const ACT_AGES = [["a", "Ages 2-4"], ["b", "Ages 5-7"], ["c", "Ages 8-12"]];
export const ACTIVITIES = [
  { n: "Paper chain countdown", a: ["a", "b", "c"], w: "in", time: "m", mess: 0, d: "Cut red and green strips, write one fun job on each, and tear one off every morning until Christmas." },
  { n: "Reindeer food sprinkle", a: ["a", "b"], w: "out", time: "s", mess: 1, d: "Mix oats with colored sugar in a jar. On Christmas Eve, sprinkle it on the lawn so the reindeer can find your house." },
  { n: "Sock snowmen", a: ["b", "c"], w: "in", time: "m", mess: 1, d: "Fill a white sock with rice, tie off two balls, add buttons and a ribbon scarf." },
  { n: "Holiday light scavenger hunt", a: ["a", "b", "c"], w: "out", time: "m", mess: 0, d: "Drive or walk at dusk. Spot a blue house, a blow-up Santa, a star, a reindeer, and a candy cane. Bring cocoa." },
  { n: "Salt dough ornaments", a: ["a", "b", "c"], w: "in", time: "l", mess: 1, d: "Mix 1 cup flour, 1/2 cup salt, and 1/2 cup water. Press in a handprint, bake at 250°F for 2 hours, then paint." },
  { n: "Cookie decorating bar", a: ["a", "b", "c"], w: "in", time: "m", mess: 1, d: "Set out plain sugar cookies, frosting, and sprinkles in a muffin tin. Pick the best one for Santa's plate." },
  { n: "Write a letter to Santa", a: ["b", "c"], w: "in", time: "s", mess: 0, d: "Tell Santa about your year, one kind thing you did, and one wish. Little ones can draw it instead." },
  { n: "Christmas story fort", a: ["a", "b", "c"], w: "in", time: "m", mess: 0, d: "Build a blanket fort, add twinkle lights, and read holiday books inside with a flashlight." },
  { n: "Pinecone bird feeders", a: ["a", "b", "c"], w: "out", time: "m", mess: 1, d: "Spread sunflower butter on a pinecone, roll it in birdseed, and hang it from a tree." },
  { n: "Snowflake cutting", a: ["b", "c"], w: "in", time: "s", mess: 0, d: "Fold paper into a triangle, snip shapes, and unfold. Tape them to the windows." },
  { n: "Jingle bell sorting", a: ["a"], w: "in", time: "s", mess: 0, d: "Sort jingle bells, pom-poms, and bows by color into a muffin tin. Count them together." },
  { n: "Kindness elf mission", a: ["b", "c"], w: "either", time: "m", mess: 0, d: "Make a card for a neighbor, leave a treat for the mail carrier, or donate a toy." },
  { n: "Holiday movie night", a: ["a", "b", "c"], w: "in", time: "l", mess: 0, d: "Make tickets, pop popcorn, and set up pillows on the floor." },
  { n: "Gingerbread house", a: ["b", "c"], w: "in", time: "l", mess: 1, d: "Use graham crackers and frosting if you skip the kit. Candy walls are mandatory." },
  { n: "Freeze dance to Christmas music", a: ["a", "b"], w: "in", time: "s", mess: 0, d: "Dance until the music stops, then freeze like a snowman." },
  { n: "Wrap a present for someone special", a: ["b", "c"], w: "in", time: "s", mess: 0, d: "Let them pick, wrap, and tag a small gift for a sibling or grandparent all by themselves." },
  { n: "Ice ornaments", a: ["b", "c"], w: "out", time: "l", mess: 1, d: "Freeze berries, pine sprigs, and a string loop in water in a muffin tin. Hang them outside on a cold night." },
  { n: "Christmas I Spy jar", a: ["a", "b"], w: "in", time: "m", mess: 0, d: "Fill a jar with rice and tiny holiday trinkets. Shake and spot the bell, the star, and the candy cane." },
  { n: "Handprint reindeer card", a: ["a", "b"], w: "in", time: "s", mess: 1, d: "Paint a brown footprint for the face and handprints for antlers. Add a red thumbprint nose." },
  { n: "Holiday bingo", a: ["b", "c"], w: "in", time: "m", mess: 0, d: "Draw a 4x4 grid of holiday words. Call them out and use candy as markers." },
  { n: "Make wrapping paper", a: ["a", "b", "c"], w: "in", time: "m", mess: 1, d: "Stamp kraft paper with potato-cut stars or finger-paint dots." },
  { n: "Snow (or leaf) angel contest", a: ["a", "b", "c"], w: "out", time: "s", mess: 0, d: "No snow? Make leaf angels in a pile of leaves or sand angels at the beach." },
  { n: "Elf obstacle course", a: ["b", "c"], w: "either", time: "m", mess: 0, d: "Crawl under chairs, hop on pillows, and deliver a present to the finish line." },
  { n: "Hot cocoa taste test", a: ["b", "c"], w: "in", time: "s", mess: 1, d: "Try peppermint, cinnamon, and marshmallow cocoa. Everyone votes for the best." },
  { n: "Build a cardboard sleigh", a: ["a", "b"], w: "in", time: "l", mess: 1, d: "Turn a big box into a sleigh, add paper plate reindeer, and deliver toys around the house." },
  { n: "Christmas Eve box", a: ["a", "b", "c"], w: "in", time: "s", mess: 0, d: "Pack new pajamas, a book, and cocoa to open on Christmas Eve." },
  { n: "Count the trees on a walk", a: ["a", "b"], w: "out", time: "s", mess: 0, d: "Count every decorated tree you see in windows. Who can find the most?" },
  { n: "Holiday photo walk", a: ["c"], w: "out", time: "m", mess: 0, d: "Hand them a phone or kids' camera and a list: something red, something sparkly, something cozy." },
  { n: "Stocking stuffer shop", a: ["b", "c"], w: "in", time: "m", mess: 0, d: "Set up a pretend shop with price tags. Kids use play money to 'buy' gifts for the family." },
  { n: "Candy cane hunt", a: ["a", "b"], w: "either", time: "s", mess: 0, d: "Hide candy canes like Easter eggs around the house or yard." },
  { n: "Make a thank-you card for Santa", a: ["a", "b", "c"], w: "in", time: "s", mess: 0, d: "Leave it with the cookies on Christmas Eve." },
  { n: "Christmas charades", a: ["b", "c"], w: "in", time: "m", mess: 0, d: "Act out a reindeer, an elf wrapping gifts, a melting snowman, or Santa stuck in a chimney." }
];

export const WORDS = ["SANTA", "ELF", "STAR", "SNOW", "GIFT", "TREE", "BELLS", "SLEIGH", "COCOA", "COOKIE", "REINDEER", "MITTENS", "CANDY", "WREATH", "JOLLY", "NORTHPOLE"];
export const HUNT = ["Something red", "Something green", "A star", "A bow", "A candy cane", "A snowman", "Something that jingles", "A reindeer", "A wreath", "Something sparkly", "Santa's picture", "A present", "A pinecone", "Twinkle lights", "A stocking", "Something soft and cozy"];

// ---------- Meal Planner ----------
// Recipes serve 8. d: diets it fits (v vegetarian, gf gluten-free, df dairy-free, nf nut-free). b: 1 budget, 2 classic, 3 splurge.
// i: [item, qty, unit, aisle]
export const MEALS = [
  ["dinner", "Christmas dinner", ["starter", "main", "side", "side", "dessert"]],
  ["eve", "Christmas Eve supper", ["starter", "main", "side", "dessert"]],
  ["brunch", "Christmas morning brunch", ["brunch", "brunch", "bside", "dessert"]]
];
export const DIETS = [["v", "Vegetarian"], ["gf", "Gluten-free"], ["df", "Dairy-free"], ["nf", "Nut-free"]];
export const COURSE_NAMES = { starter: "Starter", main: "Main", side: "Side", dessert: "Dessert", brunch: "Brunch dish", bside: "On the side" };

export const DISHES = [
  // starters
  { n: "Caprese wreath", c: "starter", d: ["v", "gf", "nf"], b: 2, s: "Ring cherry tomatoes and mozzarella pearls on a platter, tuck in basil, drizzle balsamic glaze.",
    i: [["cherry tomatoes", 2, "pint", "Produce"], ["fresh basil", 1, "bunch", "Produce"], ["mozzarella pearls", 16, "oz", "Dairy"], ["balsamic glaze", 1, "bottle", "Pantry"]] },
  { n: "Veggie Christmas tree with hummus", c: "starter", d: ["v", "gf", "df", "nf"], b: 1, s: "Arrange broccoli as a tree, peppers as ornaments, a carrot star on top. Hummus on the side.",
    i: [["broccoli", 2, "head", "Produce"], ["bell peppers", 3, "", "Produce"], ["carrots", 1, "lb", "Produce"], ["cucumbers", 2, "", "Produce"], ["hummus", 20, "oz", "Deli"]] },
  { n: "Baked brie with cranberry", c: "starter", d: ["v", "nf"], b: 2, s: "Wrap brie in puff pastry with cranberry sauce on top. Bake at 400°F for 25 minutes. Serve with crackers.",
    i: [["brie wheel", 1, "", "Dairy"], ["puff pastry", 1, "sheet", "Frozen"], ["cranberry sauce", 1, "can", "Pantry"], ["crackers", 2, "box", "Pantry"]] },
  { n: "Shrimp cocktail", c: "starter", d: ["gf", "df", "nf"], b: 3, s: "Chill cooked shrimp on ice. Serve with cocktail sauce and lemon wedges.",
    i: [["cooked shrimp", 2, "lb", "Seafood"], ["cocktail sauce", 12, "oz", "Pantry"], ["lemons", 2, "", "Produce"]] },
  { n: "Butternut squash soup", c: "starter", d: ["v", "gf", "df", "nf"], b: 1, s: "Roast cubed squash and onion, simmer in broth 15 minutes, blend with coconut milk, season.",
    i: [["butternut squash", 2, "", "Produce"], ["yellow onions", 1, "", "Produce"], ["vegetable broth", 6, "cups", "Pantry"], ["coconut milk", 1, "can", "Pantry"], ["olive oil", 1, "bottle", "Pantry"]] },
  { n: "Holiday snack board", c: "starter", d: ["nf"], b: 3, s: "Fan out salami and prosciutto, add cheese, grapes, and crackers. Fill gaps with rosemary sprigs.",
    i: [["salami", 8, "oz", "Deli"], ["prosciutto", 6, "oz", "Deli"], ["sharp cheddar", 8, "oz", "Dairy"], ["grapes", 1, "lb", "Produce"], ["crackers", 2, "box", "Pantry"], ["fresh rosemary", 1, "bunch", "Produce"]] },
  // mains
  { n: "Herb-roasted turkey breast", c: "main", d: ["gf", "df", "nf"], b: 2, s: "Rub with olive oil, garlic, rosemary, and thyme. Roast at 350°F until 165°F inside, about 2 hours. Rest 20 minutes.",
    i: [["bone-in turkey breast", 6, "lb", "Meat"], ["garlic", 1, "head", "Produce"], ["fresh rosemary", 1, "bunch", "Produce"], ["fresh thyme", 1, "bunch", "Produce"], ["olive oil", 1, "bottle", "Pantry"]] },
  { n: "Honey-glazed ham", c: "main", d: ["gf", "df", "nf"], b: 2, s: "Warm a spiral ham at 325°F, brush with honey, brown sugar, and Dijon for the last 20 minutes.",
    i: [["spiral-cut ham", 8, "lb", "Meat"], ["honey", 1, "jar", "Pantry"], ["brown sugar", 1, "bag", "Baking"], ["Dijon mustard", 1, "jar", "Pantry"]] },
  { n: "Beef tenderloin with garlic and rosemary", c: "main", d: ["gf", "df", "nf"], b: 3, s: "Sear all over, roast at 425°F to 130°F for medium-rare, about 35 minutes. Rest, then slice.",
    i: [["beef tenderloin", 4, "lb", "Meat"], ["garlic", 1, "head", "Produce"], ["fresh rosemary", 1, "bunch", "Produce"], ["olive oil", 1, "bottle", "Pantry"]] },
  { n: "Lemon herb roast chickens", c: "main", d: ["gf", "df", "nf"], b: 1, s: "Stuff two chickens with lemon and herbs, rub with oil, roast at 425°F for about 1 hour 15 minutes.",
    i: [["whole chickens", 2, "", "Meat"], ["lemons", 2, "", "Produce"], ["fresh thyme", 1, "bunch", "Produce"], ["garlic", 1, "head", "Produce"], ["olive oil", 1, "bottle", "Pantry"]] },
  { n: "Citrus roasted salmon", c: "main", d: ["gf", "df", "nf"], b: 3, s: "Lay salmon on sliced oranges and lemons, top with dill and oil, roast at 400°F for 15 to 20 minutes.",
    i: [["salmon side", 3, "lb", "Seafood"], ["oranges", 2, "", "Produce"], ["lemons", 2, "", "Produce"], ["fresh dill", 1, "bunch", "Produce"]] },
  { n: "Mushroom and spinach lasagna", c: "main", d: ["v", "nf"], b: 1, s: "Layer noodles, marinara, ricotta, sautéed mushrooms and spinach, and mozzarella. Bake at 375°F for 45 minutes.",
    i: [["lasagna noodles", 1, "box", "Pantry"], ["marinara sauce", 2, "jar", "Pantry"], ["ricotta", 32, "oz", "Dairy"], ["shredded mozzarella", 16, "oz", "Dairy"], ["mushrooms", 1.5, "lb", "Produce"], ["baby spinach", 10, "oz", "Produce"]] },
  { n: "Wild rice stuffed acorn squash", c: "main", d: ["v", "gf", "df", "nf"], b: 1, s: "Roast squash halves. Fill with wild rice cooked with onion, celery, and dried cranberries.",
    i: [["acorn squash", 4, "", "Produce"], ["wild rice blend", 2, "cups", "Pantry"], ["vegetable broth", 4, "cups", "Pantry"], ["yellow onions", 1, "", "Produce"], ["celery", 1, "bunch", "Produce"], ["dried cranberries", 1, "bag", "Pantry"]] },
  // sides
  { n: "Garlic mashed potatoes", c: "side", d: ["v", "gf", "nf"], b: 1, s: "Boil potatoes with garlic until tender. Mash with butter and warm milk. Season well.",
    i: [["Yukon Gold potatoes", 5, "lb", "Produce"], ["garlic", 1, "head", "Produce"], ["butter", 1, "lb", "Dairy"], ["milk", 0.5, "gallon", "Dairy"]] },
  { n: "Balsamic roasted Brussels sprouts", c: "side", d: ["v", "gf", "df", "nf"], b: 1, s: "Halve, toss with oil and salt, roast at 425°F for 25 minutes. Drizzle with balsamic.",
    i: [["Brussels sprouts", 2, "lb", "Produce"], ["olive oil", 1, "bottle", "Pantry"], ["balsamic glaze", 1, "bottle", "Pantry"]] },
  { n: "Green beans almondine", c: "side", d: ["v", "gf"], b: 2, s: "Blanch green beans, then toss in butter with toasted sliced almonds and lemon.",
    i: [["green beans", 2, "lb", "Produce"], ["sliced almonds", 1, "bag", "Baking"], ["butter", 1, "lb", "Dairy"], ["lemons", 1, "", "Produce"]] },
  { n: "Honey-roasted carrots", c: "side", d: ["v", "gf", "df", "nf"], b: 1, s: "Roast carrots with oil at 425°F for 25 minutes, then toss with honey and thyme.",
    i: [["carrots", 3, "lb", "Produce"], ["honey", 1, "jar", "Pantry"], ["fresh thyme", 1, "bunch", "Produce"]] },
  { n: "Baked mac and cheese", c: "side", d: ["v", "nf"], b: 1, s: "Toss cooked pasta with a cheddar cream sauce, top with more cheese, bake at 350°F for 25 minutes.",
    i: [["elbow pasta", 2, "lb", "Pantry"], ["sharp cheddar", 16, "oz", "Dairy"], ["milk", 0.5, "gallon", "Dairy"], ["butter", 1, "lb", "Dairy"]] },
  { n: "Classic herb stuffing", c: "side", d: ["v", "nf"], b: 1, s: "Toss bread cubes with sautéed onion and celery, broth, butter, and sage. Bake at 350°F for 40 minutes.",
    i: [["bread cubes for stuffing", 2, "bag", "Bakery"], ["yellow onions", 1, "", "Produce"], ["celery", 1, "bunch", "Produce"], ["vegetable broth", 4, "cups", "Pantry"], ["butter", 1, "lb", "Dairy"], ["fresh sage", 1, "bunch", "Produce"]] },
  { n: "Winter pear and pomegranate salad", c: "side", d: ["v", "gf", "df", "nf"], b: 2, s: "Toss greens with sliced pears, pomegranate seeds, and a quick olive oil and maple vinaigrette.",
    i: [["mixed greens", 10, "oz", "Produce"], ["pears", 3, "", "Produce"], ["pomegranate seeds", 1, "cup", "Produce"], ["maple syrup", 1, "bottle", "Pantry"], ["olive oil", 1, "bottle", "Pantry"]] },
  { n: "Warm dinner rolls", c: "side", d: ["v", "nf"], b: 1, s: "Bake store-bought rolls and brush with melted butter and a pinch of salt.",
    i: [["dinner rolls", 2, "dozen", "Bakery"], ["butter", 1, "lb", "Dairy"]] },
  { n: "Maple roasted sweet potatoes", c: "side", d: ["v", "gf", "df", "nf"], b: 1, s: "Cube, toss with oil, maple syrup, and cinnamon. Roast at 425°F for 30 minutes.",
    i: [["sweet potatoes", 4, "lb", "Produce"], ["maple syrup", 1, "bottle", "Pantry"], ["olive oil", 1, "bottle", "Pantry"]] },
  // brunch
  { n: "Overnight French toast bake", c: "brunch", d: ["v", "nf"], b: 1, s: "Soak brioche cubes overnight in eggs, milk, and cinnamon. Bake at 350°F for 45 minutes. Serve with syrup.",
    i: [["brioche loaf", 1, "", "Bakery"], ["eggs", 8, "", "Dairy"], ["milk", 0.5, "gallon", "Dairy"], ["maple syrup", 1, "bottle", "Pantry"]] },
  { n: "Veggie egg and hash brown casserole", c: "brunch", d: ["v", "gf", "nf"], b: 1, s: "Layer hash browns, peppers, spinach, and cheese. Pour over whisked eggs and milk. Bake at 350°F for 50 minutes.",
    i: [["eggs", 12, "", "Dairy"], ["frozen hash browns", 30, "oz", "Frozen"], ["bell peppers", 2, "", "Produce"], ["baby spinach", 5, "oz", "Produce"], ["sharp cheddar", 8, "oz", "Dairy"], ["milk", 0.5, "gallon", "Dairy"]] },
  { n: "Bagel and smoked salmon bar", c: "brunch", d: ["nf"], b: 3, s: "Slice bagels and set out cream cheese, smoked salmon, tomato, red onion, and capers.",
    i: [["bagels", 12, "", "Bakery"], ["cream cheese", 16, "oz", "Dairy"], ["smoked salmon", 12, "oz", "Seafood"], ["tomatoes", 3, "", "Produce"], ["red onion", 1, "", "Produce"]] },
  { n: "Sheet-pan potato hash with eggs", c: "brunch", d: ["v", "gf", "df", "nf"], b: 1, s: "Roast diced potatoes, peppers, and onion at 425°F for 30 minutes. Crack eggs on top and bake 8 more minutes.",
    i: [["russet potatoes", 3, "lb", "Produce"], ["bell peppers", 2, "", "Produce"], ["yellow onions", 1, "", "Produce"], ["eggs", 8, "", "Dairy"], ["olive oil", 1, "bottle", "Pantry"]] },
  { n: "Cinnamon rolls", c: "brunch", d: ["v", "nf"], b: 1, s: "Bake refrigerated or homemade rolls and drizzle with icing while warm.",
    i: [["cinnamon roll dough", 2, "can", "Dairy"]] },
  { n: "Crispy oven bacon", c: "bside", d: ["gf", "df", "nf"], b: 2, s: "Lay bacon on a rack over a sheet pan. Bake at 400°F for 18 to 20 minutes.",
    i: [["bacon", 2, "lb", "Meat"]] },
  { n: "Winter fruit salad", c: "bside", d: ["v", "gf", "df", "nf"], b: 1, s: "Toss oranges, grapes, kiwi, and pomegranate with a little honey and lime.",
    i: [["oranges", 4, "", "Produce"], ["grapes", 1, "lb", "Produce"], ["kiwi", 4, "", "Produce"], ["pomegranate seeds", 1, "cup", "Produce"], ["limes", 1, "", "Produce"]] },
  { n: "Yogurt parfait bar", c: "bside", d: ["v", "gf", "nf"], b: 1, s: "Set out yogurt, berries, and granola (choose a nut-free, gluten-free granola if needed).",
    i: [["vanilla yogurt", 32, "oz", "Dairy"], ["mixed berries", 2, "lb", "Frozen"], ["granola", 1, "bag", "Pantry"]] },
  // desserts
  { n: "Gingerbread cookies", c: "dessert", d: ["v", "nf"], b: 1, s: "Roll, cut, and bake gingerbread dough at 350°F for 8 to 10 minutes. Decorate with icing.",
    i: [["gingerbread cookie mix", 2, "box", "Baking"], ["eggs", 2, "", "Dairy"], ["butter", 1, "lb", "Dairy"], ["icing tubes", 2, "", "Baking"]] },
  { n: "Peppermint brownies", c: "dessert", d: ["v", "nf"], b: 1, s: "Bake a brownie mix, frost with chocolate, and top with crushed candy canes.",
    i: [["brownie mix", 2, "box", "Baking"], ["eggs", 4, "", "Dairy"], ["chocolate frosting", 1, "tub", "Baking"], ["candy canes", 1, "box", "Baking"]] },
  { n: "Apple crisp", c: "dessert", d: ["v", "nf"], b: 1, s: "Slice apples with cinnamon and sugar. Top with oats, flour, brown sugar, and butter. Bake at 375°F for 45 minutes.",
    i: [["apples", 8, "", "Produce"], ["rolled oats", 1, "canister", "Pantry"], ["brown sugar", 1, "bag", "Baking"], ["butter", 1, "lb", "Dairy"], ["vanilla ice cream", 1, "carton", "Frozen"]] },
  { n: "Classic pumpkin pie", c: "dessert", d: ["v", "nf"], b: 1, s: "Whisk pumpkin, eggs, evaporated milk, sugar, and spice. Bake in a crust at 425°F, then 350°F until set.",
    i: [["pumpkin puree", 2, "can", "Baking"], ["evaporated milk", 2, "can", "Baking"], ["eggs", 4, "", "Dairy"], ["pie crusts", 2, "", "Frozen"], ["whipped cream", 1, "can", "Dairy"]] },
  { n: "Chocolate-dipped strawberries", c: "dessert", d: ["v", "gf", "nf"], b: 2, s: "Dip strawberries in melted chocolate, drizzle white chocolate, chill 30 minutes.",
    i: [["strawberries", 2, "lb", "Produce"], ["chocolate chips", 1, "bag", "Baking"], ["white chocolate chips", 1, "bag", "Baking"]] },
  { n: "Berry sorbet cups with mint", c: "dessert", d: ["v", "gf", "df", "nf"], b: 1, s: "Scoop sorbet into small glasses, top with berries and a mint leaf.",
    i: [["raspberry sorbet", 2, "pint", "Frozen"], ["mixed berries", 1, "lb", "Frozen"], ["fresh mint", 1, "bunch", "Produce"]] },
  { n: "Chocolate yule log", c: "dessert", d: ["v", "nf"], b: 3, s: "Roll a chocolate sponge with whipped cream, frost like bark, and dust with powdered sugar snow.",
    i: [["chocolate cake mix", 1, "box", "Baking"], ["heavy cream", 1, "pint", "Dairy"], ["chocolate frosting", 1, "tub", "Baking"], ["powdered sugar", 1, "bag", "Baking"], ["eggs", 4, "", "Dairy"]] }
];

export const BUDGET_CATS = ["Gifts", "Food", "Decor", "Travel", "Cards & postage", "Events & outings", "Giving", "Other"];
