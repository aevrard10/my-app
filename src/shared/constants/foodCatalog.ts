export type FoodTypeKey =
  | "rodent"
  | "insects"
  | "poultry"
  | "fish"
  | "reptile"
  | "amphibian"
  | "invertebrate"
  | "egg"
  | "vegetal"
  | "other";

export type FoodItem = {
  key: string;
  labelKey: string;
  type: FoodTypeKey;
  aliases?: string[];
};

export const FOOD_TYPES: FoodTypeKey[] = [
  "rodent",
  "insects",
  "poultry",
  "fish",
  "reptile",
  "amphibian",
  "invertebrate",
  "egg",
  "vegetal",
  "other",
];

export const FOOD_ITEMS: FoodItem[] = [
  // Rodents
  { key: "mouse_pinkie", labelKey: "food.mouse_pinkie", type: "rodent" },
  { key: "mouse_fuzzy", labelKey: "food.mouse_fuzzy", type: "rodent" },
  { key: "mouse_hopper", labelKey: "food.mouse_hopper", type: "rodent" },
  {
    key: "mouse_adult",
    labelKey: "food.mouse_adult",
    type: "rodent",
    aliases: ["mouse"],
  },
  { key: "rat_pinkie", labelKey: "food.rat_pinkie", type: "rodent" },
  { key: "rat_fuzzy", labelKey: "food.rat_fuzzy", type: "rodent" },
  { key: "rat_hopper", labelKey: "food.rat_hopper", type: "rodent" },
  { key: "rat_adult", labelKey: "food.rat_adult", type: "rodent" },
  { key: "gerbil", labelKey: "food.gerbil", type: "rodent" },
  { key: "hamster", labelKey: "food.hamster", type: "rodent" },
  { key: "guinea_pig", labelKey: "food.guinea_pig", type: "rodent" },
  { key: "rabbit", labelKey: "food.rabbit", type: "rodent" },

  // Poultry / birds
  { key: "chick", labelKey: "food.chick", type: "poultry" },
  { key: "chicken", labelKey: "food.chicken", type: "poultry" },
  { key: "quail", labelKey: "food.quail", type: "poultry" },
  { key: "duckling", labelKey: "food.duckling", type: "poultry" },
  { key: "turkey_chick", labelKey: "food.turkey_chick", type: "poultry" },

  // Eggs
  { key: "egg_chicken", labelKey: "food.egg_chicken", type: "egg" },
  { key: "egg_quail", labelKey: "food.egg_quail", type: "egg" },
  { key: "egg_duck", labelKey: "food.egg_duck", type: "egg" },

  // Insects & invertebrates
  { key: "cricket", labelKey: "food.cricket", type: "insects" },
  { key: "locust", labelKey: "food.locust", type: "insects" },
  { key: "grasshopper", labelKey: "food.grasshopper", type: "insects" },
  { key: "roach_dubia", labelKey: "food.roach_dubia", type: "insects" },
  { key: "roach_red_runner", labelKey: "food.roach_red_runner", type: "insects" },
  { key: "mealworm", labelKey: "food.mealworm", type: "insects" },
  { key: "superworm", labelKey: "food.superworm", type: "insects" },
  { key: "waxworm", labelKey: "food.waxworm", type: "insects" },
  { key: "silkworm", labelKey: "food.silkworm", type: "insects" },
  { key: "hornworm", labelKey: "food.hornworm", type: "insects" },
  { key: "bsf_larvae", labelKey: "food.bsf_larvae", type: "insects" },
  { key: "earthworm", labelKey: "food.earthworm", type: "invertebrate" },
  { key: "nightcrawler", labelKey: "food.nightcrawler", type: "invertebrate" },
  { key: "snail", labelKey: "food.snail", type: "invertebrate" },

  // Fish
  { key: "guppy", labelKey: "food.guppy", type: "fish" },
  { key: "goldfish", labelKey: "food.goldfish", type: "fish" },
  { key: "tilapia", labelKey: "food.tilapia", type: "fish" },
  { key: "smelt", labelKey: "food.smelt", type: "fish" },
  { key: "feeder_fish", labelKey: "food.feeder_fish", type: "fish" },

  // Reptiles
  { key: "lizard", labelKey: "food.lizard", type: "reptile" },
  { key: "gecko", labelKey: "food.gecko", type: "reptile" },
  { key: "snake", labelKey: "food.snake", type: "reptile" },

  // Amphibians
  { key: "frog", labelKey: "food.frog", type: "amphibian" },
  { key: "tadpole", labelKey: "food.tadpole", type: "amphibian" },

  // Vegetal
  { key: "leafy_greens", labelKey: "food.leafy_greens", type: "vegetal" },
  { key: "vegetables_mix", labelKey: "food.vegetables_mix", type: "vegetal" },
  { key: "fruits_mix", labelKey: "food.fruits_mix", type: "vegetal" },
  { key: "flowers", labelKey: "food.flowers", type: "vegetal" },
  { key: "pellets", labelKey: "food.pellets", type: "vegetal" },

  // Other
  { key: "other", labelKey: "food.other", type: "other" },
];

const FOOD_ALIAS_MAP = new Map<string, string>();
const FOOD_TYPE_ALIAS_MAP = new Map<string, FoodTypeKey>();

const addAlias = (alias: string, key: string) => {
  FOOD_ALIAS_MAP.set(alias.trim().toLowerCase(), key);
};

const addTypeAlias = (alias: string, key: FoodTypeKey) => {
  FOOD_TYPE_ALIAS_MAP.set(alias.trim().toLowerCase(), key);
};

// Food aliases for legacy data (FR labels)
const LEGACY_FOOD_ALIASES: Record<string, string[]> = {
  chick: ["poussin", "poussin d'un jour", "poussin 1 jour"],
  chicken: ["poule", "poulet"],
  quail: ["caille"],
  duckling: ["canard", "caneton"],
  turkey_chick: ["dinde", "dindonneau"],
  mouse_adult: ["souris"],
  rat_adult: ["rat"],
  lizard: ["lézard"],
  cricket: ["criquest", "criquet", "cricket"],
  roach_dubia: ["blatte", "cafard"],
  mealworm: ["vers de farine"],
  earthworm: ["vers de terre"],
  goldfish: ["poisson rouge"],
};

FOOD_ITEMS.forEach((item) => {
  addAlias(item.key, item.key);
  if (item.aliases) {
    item.aliases.forEach((alias) => addAlias(alias, item.key));
  }
  const legacy = LEGACY_FOOD_ALIASES[item.key];
  if (legacy) {
    legacy.forEach((alias) => addAlias(alias, item.key));
  }
});

// Type aliases (FR + EN)
addTypeAlias("rongeur", "rodent");
addTypeAlias("rodent", "rodent");
addTypeAlias("rodents", "rodent");
addTypeAlias("insectes", "insects");
addTypeAlias("insects", "insects");
addTypeAlias("insect", "insects");
addTypeAlias("volaille", "poultry");
addTypeAlias("poultry", "poultry");
addTypeAlias("oiseau", "poultry");
addTypeAlias("poisson", "fish");
addTypeAlias("fish", "fish");
addTypeAlias("reptile", "reptile");
addTypeAlias("amphibien", "amphibian");
addTypeAlias("amphibian", "amphibian");
addTypeAlias("invertébré", "invertebrate");
addTypeAlias("invertebrate", "invertebrate");
addTypeAlias("oeuf", "egg");
addTypeAlias("egg", "egg");
addTypeAlias("végétal", "vegetal");
addTypeAlias("vegetal", "vegetal");
addTypeAlias("autre", "other");
addTypeAlias("other", "other");

export const normalizeFoodName = (name?: string | null): string => {
  if (!name) return "";
  const key = FOOD_ALIAS_MAP.get(name.trim().toLowerCase());
  return key || name.trim();
};

export const getFoodTypeKeyFromFood = (
  name?: string | null,
): FoodTypeKey | null => {
  if (!name) return null;
  const canonical = normalizeFoodName(name);
  const item = FOOD_ITEMS.find((f) => f.key === canonical);
  return item ? item.type : null;
};

export const normalizeFoodType = (
  type?: string | null,
): FoodTypeKey | null => {
  if (!type) return null;
  return FOOD_TYPE_ALIAS_MAP.get(type.trim().toLowerCase()) || null;
};

export const getFoodLabel = (
  name: string | null | undefined,
  t: (key: string) => string,
): string => {
  if (!name) return "";
  const canonical = normalizeFoodName(name);
  const item = FOOD_ITEMS.find((f) => f.key === canonical);
  return item ? t(item.labelKey) : name;
};

export const getFoodTypeLabel = (
  type: string | null | undefined,
  t: (key: string) => string,
): string => {
  const key = normalizeFoodType(type) || (type as FoodTypeKey | null);
  switch (key) {
    case "rodent":
      return t("food_type.rodent");
    case "insects":
      return t("food_type.insects");
    case "poultry":
      return t("food_type.poultry");
    case "fish":
      return t("food_type.fish");
    case "reptile":
      return t("food_type.reptile");
    case "amphibian":
      return t("food_type.amphibian");
    case "invertebrate":
      return t("food_type.invertebrate");
    case "egg":
      return t("food_type.egg");
    case "vegetal":
      return t("food_type.vegetal");
    case "other":
      return t("food_type.other");
    default:
      return type || t("food_type.other");
  }
};

export const getFoodAliases = (name: string): string[] => {
  const canonical = normalizeFoodName(name);
  const aliases = [];
  FOOD_ALIAS_MAP.forEach((value, alias) => {
    if (value === canonical) {
      aliases.push(alias);
    }
  });
  return Array.from(new Set([canonical, ...aliases]));
};
