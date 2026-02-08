import {
  normalizeFoodName,
  getFoodTypeKeyFromFood,
  normalizeFoodType,
  getFoodTypeLabel,
  getFoodLabel,
} from "./foodCatalog";

describe("foodCatalog", () => {
  const t = (key: string) => key;

  it("normalizes legacy names to canonical keys", () => {
    expect(normalizeFoodName("Souris")).toBe("mouse_adult");
    expect(normalizeFoodName("Rat")).toBe("rat_adult");
    expect(normalizeFoodName("Blatte")).toBe("roach_dubia");
  });

  it("returns the correct type for a food", () => {
    expect(getFoodTypeKeyFromFood("mouse_adult")).toBe("rodent");
    expect(getFoodTypeKeyFromFood("cricket")).toBe("insects");
    expect(getFoodTypeKeyFromFood("goldfish")).toBe("fish");
  });

  it("normalizes food types", () => {
    expect(normalizeFoodType("Rongeur")).toBe("rodent");
    expect(normalizeFoodType("Insectes")).toBe("insects");
    expect(normalizeFoodType("Poisson")).toBe("fish");
  });

  it("resolves labels using translation keys", () => {
    expect(getFoodLabel("mouse_adult", t)).toBe("food.mouse_adult");
    expect(getFoodTypeLabel("rodent", t)).toBe("food_type.rodent");
  });
});
