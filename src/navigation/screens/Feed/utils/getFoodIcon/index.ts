import { normalizeFoodType } from "@shared/constants/foodCatalog";

export enum FoodType {
  RODENT = "rodent",
  INSECTS = "insects",
  POULTRY = "poultry",
  FISH = "fish",
  REPTILE = "reptile",
  AMPHIBIAN = "amphibian",
  INVERTEBRATE = "invertebrate",
  EGG = "egg",
  VEGETAL = "vegetal",
  OTHER = "other",
}

const getFoodIcon = (type?: FoodType | string | null) => {
  const normalized = normalizeFoodType(type?.toString());
  switch (normalized) {
    case FoodType.RODENT:
      return require("../../../../../../assets/souris.png");
    case FoodType.INSECTS:
      return require("../../../../../../assets/voler.png");
    case FoodType.POULTRY:
      return require("../../../../../../assets/poulet.png");
    case FoodType.FISH:
      return "fish";
    case FoodType.REPTILE:
      return require("../../../../../../assets/lizard.png");
    case FoodType.AMPHIBIAN:
      return "frog";
    case FoodType.INVERTEBRATE:
      return "bug";
    case FoodType.EGG:
      return "egg";
    case FoodType.VEGETAL:
      return "leaf";
    default:
      return "food-fork-drink";
  }
};

export default getFoodIcon;
