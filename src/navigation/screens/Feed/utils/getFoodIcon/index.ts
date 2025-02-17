export enum FoodType {
    RONGEUR = "rongeur",
    INSECTES = "insectes",
    VOLAILLE = "volaille",
    POISSON = "poisson",
    REPTILE = "reptile",
  }



const getFoodIcon = (type: FoodType) => {
    switch (type.toLowerCase()) {
      case FoodType.RONGEUR:
        return require("../../../../../../assets/souris.png");
      case FoodType.INSECTES:
        return require("../../../../../../assets/voler.png");
      case FoodType.VOLAILLE:
        return require("../../../../../../assets/poulet.png");;
      case FoodType.POISSON:
        return "fish";
        case FoodType.REPTILE:
          return require("../../../../../../assets/lizard.png");
      default:
        return "food-fork-drink";
    }
  };
  

    export default getFoodIcon;