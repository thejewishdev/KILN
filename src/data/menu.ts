export type Category = "coffee" | "tea" | "bakery";

/** One option in a pick-one group. `price` is a delta in cents (negative for a discount). */
export interface Choice {
  id: string;
  label: string;
  hint?: string;
  price?: number;
}

export interface ChoiceGroup {
  id: string;
  label: string;
  choices: Choice[];
  defaultId: string;
  /** Only offered while another group has one of these values. Items without that group always show it. */
  showWhen?: { group: string; is: string[] };
}

export type ExtraSection = "free" | "syrups" | "boosts" | "toppings" | "side";

/** An add-on. Price in cents, 0 for free. `max` > 1 renders a stepper counted in `unit`s. */
export interface Extra {
  id: string;
  label: string;
  section: ExtraSection;
  price: number;
  max?: number;
  unit?: string;
  hint?: string;
}

export interface SourcingFact {
  label: string;
  value: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  /** Base price in cents for the default build. */
  price: number;
  blurb: string;
  description: string;
  ingredients: string[];
  sourcing: { story: string; facts: SourcingFact[] };
  choices: string[];
  /** Per-item overrides for a group's default. */
  defaults?: Record<string, string>;
  extras: string[];
  signature?: boolean;
  dietary?: string;
}

export const choiceGroups: Record<string, ChoiceGroup> = {
  size: {
    id: "size",
    label: "Size",
    defaultId: "regular",
    choices: [
      { id: "small", label: "Small", hint: "8 oz", price: -50 },
      { id: "regular", label: "Regular", hint: "12 oz" },
      { id: "large", label: "Large", hint: "16 oz", price: 100 },
    ],
  },
  temperature: {
    id: "temperature",
    label: "Temperature",
    defaultId: "hot",
    choices: [
      { id: "hot", label: "Hot" },
      { id: "extra-hot", label: "Extra hot" },
      { id: "warm", label: "Warm", hint: "About 55°C, ready to drink" },
      { id: "iced", label: "Iced" },
    ],
  },
  ice: {
    id: "ice",
    label: "Ice",
    defaultId: "regular",
    showWhen: { group: "temperature", is: ["iced"] },
    choices: [
      { id: "none", label: "No ice" },
      { id: "light", label: "Light" },
      { id: "regular", label: "Regular" },
      { id: "extra", label: "Extra ice" },
    ],
  },
  milk: {
    id: "milk",
    label: "Milk",
    defaultId: "whole",
    choices: [
      { id: "whole", label: "Whole" },
      { id: "skim", label: "Skim" },
      { id: "oat", label: "Oat", price: 70 },
      { id: "almond", label: "Almond", price: 70 },
      { id: "coconut", label: "Coconut", price: 70 },
      { id: "none", label: "No milk" },
    ],
  },
  beans: {
    id: "beans",
    label: "Beans",
    defaultId: "house",
    choices: [
      { id: "house", label: "House blend" },
      { id: "decaf", label: "Decaf", hint: "Swiss Water process Colombian" },
    ],
  },
  water: {
    id: "water",
    label: "Style",
    defaultId: "straight",
    choices: [
      { id: "straight", label: "Straight" },
      { id: "long", label: "Long", hint: "Topped with hot water, like an Americano" },
    ],
  },
  sweetness: {
    id: "sweetness",
    label: "Sweetness",
    defaultId: "regular",
    choices: [
      { id: "none", label: "None" },
      { id: "half", label: "Half" },
      { id: "regular", label: "Regular" },
      { id: "extra", label: "Extra" },
    ],
  },
  steep: {
    id: "steep",
    label: "Steep",
    defaultId: "standard",
    choices: [
      { id: "light", label: "Light" },
      { id: "standard", label: "Standard" },
      { id: "strong", label: "Strong" },
    ],
  },
  warming: {
    id: "warming",
    label: "Serve it",
    defaultId: "as-baked",
    choices: [
      { id: "as-baked", label: "As baked" },
      { id: "warmed", label: "Warmed" },
    ],
  },
  cut: {
    id: "cut",
    label: "Cut",
    defaultId: "whole",
    choices: [
      { id: "whole", label: "Whole" },
      { id: "halved", label: "Halved", hint: "Easy to share" },
    ],
  },
  toast: {
    id: "toast",
    label: "Toast",
    defaultId: "dark",
    choices: [
      { id: "light", label: "Light" },
      { id: "golden", label: "Golden" },
      { id: "dark", label: "Dark", hint: "How we like it" },
    ],
  },
};

export const extras: Record<string, Extra> = {
  // Free
  "cinnamon-dust": { id: "cinnamon-dust", label: "Cinnamon dust", section: "free", price: 0 },
  "cocoa-dust": { id: "cocoa-dust", label: "Cocoa dust", section: "free", price: 0 },
  "extra-foam": { id: "extra-foam", label: "Extra foam", section: "free", price: 0 },
  "room": { id: "room", label: "Leave room at the top", section: "free", price: 0 },
  "water-side": { id: "water-side", label: "Sparkling water on the side", section: "free", price: 0 },
  "hot-water": { id: "hot-water", label: "Extra hot water for refills", section: "free", price: 0 },
  "flaky-salt": { id: "flaky-salt", label: "Extra flaky salt", section: "free", price: 0 },

  // Syrups, by the pump
  vanilla: { id: "vanilla", label: "Vanilla bean", section: "syrups", price: 75, max: 4, unit: "pump", hint: "Madagascar vanilla, made in-house" },
  caramel: { id: "caramel", label: "Salted caramel", section: "syrups", price: 75, max: 4, unit: "pump" },
  hazelnut: { id: "hazelnut", label: "Toasted hazelnut", section: "syrups", price: 75, max: 4, unit: "pump" },
  lavender: { id: "lavender", label: "Lavender", section: "syrups", price: 75, max: 4, unit: "pump", hint: "Steeped from Willamette Valley buds" },
  "brown-sugar": { id: "brown-sugar", label: "Brown sugar", section: "syrups", price: 75, max: 4, unit: "pump" },
  "burnt-honey": { id: "burnt-honey", label: "Burnt honey", section: "syrups", price: 90, max: 4, unit: "pump", hint: "From the hives on our roof" },
  cardamom: { id: "cardamom", label: "Cardamom", section: "syrups", price: 75, max: 4, unit: "pump" },
  "sf-vanilla": { id: "sf-vanilla", label: "Sugar-free vanilla", section: "syrups", price: 75, max: 4, unit: "pump" },

  // Boosts
  shot: { id: "shot", label: "Extra espresso shot", section: "boosts", price: 150, max: 3, unit: "shot" },
  ceremonial: { id: "ceremonial", label: "Ceremonial-grade matcha", section: "boosts", price: 125, hint: "Brighter, sweeter, less bitter" },
  "extra-spice": { id: "extra-spice", label: "Extra spice", section: "boosts", price: 50, hint: "More ginger and black pepper" },

  // Toppings
  "cold-foam": { id: "cold-foam", label: "Salted cold foam", section: "toppings", price: 125 },
  whipped: { id: "whipped", label: "Whipped cream", section: "toppings", price: 75 },
  "caramel-drizzle": { id: "caramel-drizzle", label: "Caramel drizzle", section: "toppings", price: 50 },
  "honey-drizzle": { id: "honey-drizzle", label: "Wildflower honey drizzle", section: "toppings", price: 50 },
  "choc-shavings": { id: "choc-shavings", label: "Dark chocolate shavings", section: "toppings", price: 50 },

  // On the side
  butter: { id: "butter", label: "Cultured butter", section: "side", price: 75 },
  jam: { id: "jam", label: "Seasonal jam", section: "side", price: 75, hint: "Currently Italian plum" },
  honey: { id: "honey", label: "Rooftop honey", section: "side", price: 50 },
  gelato: { id: "gelato", label: "Scoop of oat gelato", section: "side", price: 250, max: 2, unit: "scoop" },
  "choc-dip": { id: "choc-dip", label: "Dark chocolate dip", section: "side", price: 50 },
  "extra-slice": { id: "extra-slice", label: "Extra slice", section: "side", price: 225, max: 2, unit: "slice" },
};

export const extraSections: { id: ExtraSection; label: string; note: string }[] = [
  { id: "free", label: "On the house", note: "Free" },
  { id: "syrups", label: "Syrups", note: "By the pump" },
  { id: "boosts", label: "Boosts", note: "" },
  { id: "toppings", label: "Toppings", note: "" },
  { id: "side", label: "On the side", note: "" },
];

export const categories: { id: Category; label: string; intro: string }[] = [
  {
    id: "coffee",
    label: "Coffee",
    intro: "Roasted on site every Tuesday and Friday. Espresso is the house blend; the pour-over changes weekly.",
  },
  {
    id: "tea",
    label: "Tea",
    intro: "Loose leaf from three small gardens, steeped to order. Chai is ground by hand each morning.",
  },
  {
    id: "bakery",
    label: "Bakery",
    intro: "Baked from 4 am in the old firing chamber. When a tray sells out, it is gone until tomorrow.",
  },
];

const COFFEE_SYRUPS = ["vanilla", "caramel", "hazelnut", "lavender", "brown-sugar", "burnt-honey", "sf-vanilla"];

export const menu: MenuItem[] = [
  // ——— Coffee ———
  {
    id: "burnt-honey-latte",
    name: "Burnt Honey Latte",
    category: "coffee",
    price: 575,
    signature: true,
    blurb: "Rooftop honey cooked to amber, a double shot and silky milk, finished with flaky salt.",
    description:
      "We take wildflower honey from the hives on our roof and cook it past golden until it turns bittersweet. It meets a double shot of the house blend and steamed milk, then gets a pinch of Maldon salt on top.",
    ingredients: ["Double espresso", "Steamed milk", "Burnt honey syrup", "Flaky sea salt"],
    sourcing: {
      story:
        "The honey comes from four hives on the kiln roof, kept by a beekeeper two doors down. Each jar tastes a little different depending on what is flowering in the neighborhood.",
      facts: [
        { label: "Espresso", value: "House blend, Huila and Sidama" },
        { label: "Honey", value: "Potters Row rooftop hives" },
        { label: "Milk", value: "Organic whole, Ochoa Dairy" },
        { label: "Tastes like", value: "Toffee, cocoa, a hint of smoke" },
      ],
    },
    choices: ["size", "temperature", "ice", "milk", "beans"],
    extras: ["cinnamon-dust", "extra-foam", "room", ...COFFEE_SYRUPS, "shot", "cold-foam", "whipped", "caramel-drizzle"],
  },
  {
    id: "kiln-espresso",
    name: "Kiln Espresso",
    category: "coffee",
    price: 350,
    blurb: "A double shot pulled slow at a 1:2.5 ratio. Syrupy, dark and sweet.",
    description: "Eighteen grams of the house blend, pulled for about 30 seconds into a warmed ceramic cup thrown by the studio next door.",
    ingredients: ["House blend espresso (18 g)", "Filtered water"],
    sourcing: {
      story:
        "Two washed coffees blended for balance: a Colombian for body and chocolate, an Ethiopian for a bright plum finish. We buy both directly and pay well above the market price.",
      facts: [
        { label: "Origin", value: "Huila, Colombia and Sidama, Ethiopia" },
        { label: "Process", value: "Washed" },
        { label: "Elevation", value: "1,750 to 2,100 m" },
        { label: "Tastes like", value: "Cocoa nib, plum, brown sugar" },
      ],
    },
    choices: ["water", "temperature", "ice", "beans"],
    extras: ["water-side", "vanilla", "caramel", "brown-sugar", "shot", "whipped"],
  },
  {
    id: "cortado",
    name: "Cortado",
    category: "coffee",
    price: 425,
    blurb: "Equal parts espresso and warm milk, in a small glass.",
    description: "A double shot cut with the same amount of lightly textured milk. Strong enough to taste the coffee, soft enough to drink fast.",
    ingredients: ["Double espresso", "Lightly steamed milk"],
    sourcing: {
      story: "Made with the house blend and milk from Ochoa Dairy, a family farm that delivers to us three times a week.",
      facts: [
        { label: "Espresso", value: "House blend" },
        { label: "Milk", value: "Ochoa Dairy, organic whole" },
        { label: "Size", value: "4.5 oz glass" },
      ],
    },
    choices: ["temperature", "ice", "milk", "beans"],
    extras: ["cocoa-dust", "cinnamon-dust", "vanilla", "caramel", "hazelnut", "cardamom", "shot"],
  },
  {
    id: "weekly-pour-over",
    name: "Pour-over of the Week",
    category: "coffee",
    price: 600,
    blurb: "A single origin brewed by hand. This week: a washed Gesha from Panama.",
    description:
      "Twenty grams of coffee, 320 grams of water at 94°C, poured in slow circles over about three minutes. Served in a carafe so you can watch it change as it cools.",
    ingredients: ["Single-origin coffee (20 g)", "Filtered water"],
    sourcing: {
      story:
        "Finca Lérida sits in the cloud forest above Boquete. This lot was picked in March and rested for a month before we roasted it light to keep its jasmine aroma.",
      facts: [
        { label: "Origin", value: "Boquete, Panama" },
        { label: "Variety", value: "Gesha" },
        { label: "Elevation", value: "1,650 m" },
        { label: "Tastes like", value: "Jasmine, bergamot, white peach" },
      ],
    },
    choices: ["temperature", "ice", "milk"],
    defaults: { milk: "none" },
    extras: ["room", "water-side", "honey-drizzle"],
  },
  {
    id: "cold-brew",
    name: "Eighteen-Hour Cold Brew",
    category: "coffee",
    price: 500,
    blurb: "Steeped overnight in cold water. Low acid, very smooth.",
    description: "Coarse-ground Colombian steeped for eighteen hours, filtered twice and poured over clear ice.",
    ingredients: ["Cold-steeped Colombian coffee", "Clear ice"],
    sourcing: {
      story: "Made with a natural-process lot from Finca El Mirador, chosen for its cherry and dark chocolate sweetness.",
      facts: [
        { label: "Origin", value: "Huila, Colombia" },
        { label: "Process", value: "Natural" },
        { label: "Steep", value: "18 hours at 4°C" },
        { label: "Tastes like", value: "Black cherry, dark chocolate" },
      ],
    },
    choices: ["size", "ice", "milk"],
    defaults: { milk: "none" },
    extras: ["room", ...COFFEE_SYRUPS, "shot", "cold-foam", "caramel-drizzle"],
  },

  // ——— Tea ———
  {
    id: "kiln-chai",
    name: "Kiln Chai",
    category: "tea",
    price: 500,
    signature: true,
    blurb: "Assam simmered with spices we grind every morning. Warming, peppery, not too sweet.",
    description:
      "Strong Assam black tea simmered with fresh ginger and whole spices we toast and grind by hand before opening. Sweetened lightly with jaggery.",
    ingredients: ["Assam black tea", "Fresh ginger", "Green cardamom", "Clove", "Cinnamon", "Black pepper", "Jaggery", "Milk"],
    sourcing: {
      story:
        "The tea comes from Halmari, a family garden in upper Assam. The spices come from a cooperative in Kerala, and we buy them whole so we can toast them ourselves.",
      facts: [
        { label: "Tea", value: "Halmari Estate, Assam" },
        { label: "Spices", value: "Kerala growers cooperative" },
        { label: "Sweetener", value: "Unrefined jaggery" },
        { label: "Tastes like", value: "Ginger, malt, cracked pepper" },
      ],
    },
    choices: ["size", "temperature", "ice", "milk", "sweetness"],
    extras: ["cinnamon-dust", "extra-foam", "vanilla", "brown-sugar", "burnt-honey", "extra-spice", "shot", "cold-foam", "whipped"],
  },
  {
    id: "matcha-latte",
    name: "Matcha Latte",
    category: "tea",
    price: 550,
    blurb: "Uji matcha whisked by hand in a chawan, then poured over milk.",
    description: "Three grams of first-harvest matcha whisked with a bamboo chasen until it foams, then poured over steamed or cold milk.",
    ingredients: ["Uji matcha (3 g)", "Hot water", "Milk"],
    sourcing: {
      story: "Grown in shade for three weeks before picking, then stone-milled in small batches by a fourth-generation farm in Uji, Kyoto.",
      facts: [
        { label: "Origin", value: "Uji, Kyoto, Japan" },
        { label: "Harvest", value: "First flush, May" },
        { label: "Tastes like", value: "Sweet grass, umami, cream" },
      ],
    },
    choices: ["size", "temperature", "ice", "milk", "sweetness"],
    defaults: { milk: "oat" },
    extras: ["extra-foam", "vanilla", "lavender", "burnt-honey", "sf-vanilla", "ceremonial", "cold-foam"],
  },
  {
    id: "roasted-hojicha",
    name: "Roasted Hojicha",
    category: "tea",
    price: 475,
    blurb: "Green tea roasted over charcoal. Nutty, toasty and low in caffeine.",
    description: "Bancha leaves and stems roasted until they turn red-brown. It tastes like toasted rice and caramel, and is gentle enough for the afternoon.",
    ingredients: ["Roasted bancha tea", "Filtered water"],
    sourcing: {
      story: "Roasted in Shizuoka by a small producer who still uses a ceramic drum over charcoal.",
      facts: [
        { label: "Origin", value: "Shizuoka, Japan" },
        { label: "Caffeine", value: "Low" },
        { label: "Tastes like", value: "Toasted rice, caramel, cedar" },
      ],
    },
    choices: ["size", "temperature", "ice", "milk", "steep"],
    defaults: { milk: "none" },
    extras: ["hot-water", "vanilla", "brown-sugar", "burnt-honey", "honey-drizzle", "cold-foam"],
  },
  {
    id: "mountain-oolong",
    name: "Mountain Oolong",
    category: "tea",
    price: 450,
    blurb: "A rolled oolong from Alishan, served in a pot you can refill twice.",
    description: "High-mountain oolong that opens slowly in the pot. We bring you hot water for two more steeps, and each one tastes a little different.",
    ingredients: ["Alishan oolong (5 g)", "Filtered water"],
    sourcing: {
      story: "Picked by hand in spring on the slopes of Alishan, Taiwan, and lightly oxidized to keep its floral, buttery character.",
      facts: [
        { label: "Origin", value: "Alishan, Taiwan" },
        { label: "Oxidation", value: "Light, about 20%" },
        { label: "Tastes like", value: "Orchid, butter, fresh pear" },
      ],
    },
    choices: ["temperature", "ice", "steep"],
    extras: ["hot-water", "honey-drizzle", "lavender"],
  },

  // ——— Bakery ———
  {
    id: "croissant",
    name: "Kiln Croissant",
    category: "bakery",
    price: 425,
    signature: true,
    blurb: "Laminated over three days with cultured butter. Shattering crust, soft honeycombed middle.",
    description: "Dough mixed on Monday, folded with butter on Tuesday and baked fresh every morning. We make 80 a day and they usually sell out by 11.",
    ingredients: ["Heritage wheat flour", "Cultured butter (82% fat)", "Whole milk", "Cane sugar", "Sea salt", "Levain"],
    sourcing: {
      story:
        "The flour is stone-milled from Edison wheat grown in the Skagit Valley. The butter is cultured for 24 hours for a gentle tang.",
      facts: [
        { label: "Flour", value: "Cairnspring Mills, Skagit Valley" },
        { label: "Proof", value: "72 hours from mix to bake" },
        { label: "Contains", value: "Wheat, dairy" },
      ],
    },
    choices: ["warming", "cut"],
    extras: ["flaky-salt", "butter", "jam", "honey", "choc-dip"],
    dietary: "Contains wheat and dairy",
  },
  {
    id: "cardamom-knot",
    name: "Cardamom Knot",
    category: "bakery",
    price: 475,
    blurb: "A Swedish-style twisted bun with fresh cardamom and pearl sugar.",
    description: "Enriched dough rolled with cardamom butter, twisted into a knot and brushed with syrup straight out of the oven.",
    ingredients: ["Wheat flour", "Butter", "Green cardamom", "Milk", "Egg", "Pearl sugar"],
    sourcing: {
      story: "We crack the cardamom pods ourselves the night before, so the bun smells the way it should.",
      facts: [
        { label: "Cardamom", value: "Kerala growers cooperative" },
        { label: "Flour", value: "Cairnspring Mills" },
        { label: "Contains", value: "Wheat, dairy, egg" },
      ],
    },
    choices: ["warming", "cut"],
    extras: ["butter", "jam", "gelato"],
    dietary: "Contains wheat, dairy and egg",
  },
  {
    id: "miso-cookie",
    name: "Miso Chocolate Cookie",
    category: "bakery",
    price: 375,
    blurb: "Brown butter, white miso and chopped dark chocolate. Salty, chewy, a little gooey.",
    description: "Dough rested for 48 hours so the flavors deepen, then baked to order in small batches through the day.",
    ingredients: ["Brown butter", "White miso", "70% dark chocolate", "Dark brown sugar", "Wheat flour", "Egg"],
    sourcing: {
      story: "The chocolate is a 70% bar from a bean-to-bar maker in Portland, made with cacao from Tumaco, Colombia.",
      facts: [
        { label: "Chocolate", value: "70%, Tumaco cacao" },
        { label: "Miso", value: "Aged one year, Portland" },
        { label: "Contains", value: "Wheat, dairy, egg, soy" },
      ],
    },
    choices: ["warming", "cut"],
    defaults: { warming: "warmed" },
    extras: ["flaky-salt", "gelato", "choc-dip"],
    dietary: "Contains wheat, dairy, egg and soy",
  },
  {
    id: "sourdough-toast",
    name: "Sourdough Toast",
    category: "bakery",
    price: 650,
    blurb: "Two thick slices of our country loaf, toasted dark, with cultured butter and salt.",
    description: "A long-fermented loaf with a deep crust, sliced thick, toasted on the plancha and served with a generous slab of butter.",
    ingredients: ["Country sourdough", "Cultured butter", "Flaky sea salt"],
    sourcing: {
      story: "Our starter is eleven years old. The loaf ferments for 36 hours before it goes into the oven.",
      facts: [
        { label: "Flour", value: "Whole wheat and rye, Cairnspring Mills" },
        { label: "Fermentation", value: "36 hours" },
        { label: "Contains", value: "Wheat, dairy" },
      ],
    },
    choices: ["toast"],
    extras: ["flaky-salt", "jam", "honey", "extra-slice"],
    dietary: "Contains wheat and dairy",
  },
];

export const menuById: Record<string, MenuItem> = Object.fromEntries(menu.map((m) => [m.id, m]));
