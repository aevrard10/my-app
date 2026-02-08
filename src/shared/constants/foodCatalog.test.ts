import {
  normalizeFoodName,
  getFoodTypeKeyFromFood,
  normalizeFoodType,
  getFoodTypeLabel,
  getFoodLabel,
  getFoodAliases,
} from "./foodCatalog";

describe("foodCatalog", () => {
  const t = (key: string) => key;

  it("normalizes legacy names to canonical keys", () => {
    expect(normalizeFoodName("Souris")).toBe("mouse_adult");
    expect(normalizeFoodName("Rat")).toBe("rat_adult");
    expect(normalizeFoodName("Blatte")).toBe("roach_dubia");
    expect(normalizeFoodName("mouse")).toBe("mouse_adult");
    expect(normalizeFoodName(null)).toBe("");
  });

  it("returns the correct type for a food", () => {
    expect(getFoodTypeKeyFromFood("mouse_adult")).toBe("rodent");
    expect(getFoodTypeKeyFromFood("cricket")).toBe("insects");
    expect(getFoodTypeKeyFromFood("goldfish")).toBe("fish");
    expect(getFoodTypeKeyFromFood("unknown")).toBeNull();
    expect(getFoodTypeKeyFromFood(null)).toBeNull();
  });

  it("normalizes food types", () => {
    expect(normalizeFoodType("Rongeur")).toBe("rodent");
    expect(normalizeFoodType("Insectes")).toBe("insects");
    expect(normalizeFoodType("Poisson")).toBe("fish");
    expect(normalizeFoodType(null)).toBeNull();
  });

  it("resolves labels using translation keys", () => {
    expect(getFoodLabel("mouse_adult", t)).toBe("food.mouse_adult");
    expect(getFoodLabel("unknown", t)).toBe("unknown");
    expect(getFoodLabel(null, t)).toBe("");

    expect(getFoodTypeLabel("rodent", t)).toBe("food_type.rodent");
    expect(getFoodTypeLabel("insects", t)).toBe("food_type.insects");
    expect(getFoodTypeLabel("poultry", t)).toBe("food_type.poultry");
    expect(getFoodTypeLabel("fish", t)).toBe("food_type.fish");
    expect(getFoodTypeLabel("reptile", t)).toBe("food_type.reptile");
    expect(getFoodTypeLabel("amphibian", t)).toBe("food_type.amphibian");
    expect(getFoodTypeLabel("invertebrate", t)).toBe("food_type.invertebrate");
    expect(getFoodTypeLabel("egg", t)).toBe("food_type.egg");
    expect(getFoodTypeLabel("vegetal", t)).toBe("food_type.vegetal");
    expect(getFoodTypeLabel("other", t)).toBe("food_type.other");
    expect(getFoodTypeLabel("unknown", t)).toBe("unknown");
    expect(getFoodTypeLabel(null, t)).toBe("food_type.other");
  });

  it("returns all aliases for a food", () => {
    const aliases = getFoodAliases("mouse_adult");
    expect(aliases).toEqual(expect.arrayContaining(["mouse_adult", "mouse"]));
  });
});
