import { IconSource } from "react-native-paper";

const lizardIcon = require("../../../assets/lizard.png");

const getSpeciesIcon = (type?: string | null): IconSource => {
  const normalized = (type || "").toLowerCase();
  switch (normalized) {
    case "snake":
      return "snake";
    case "lizard":
    case "gecko":
    case "monitor":
      return lizardIcon;
    case "turtle":
      return "turtle";
    case "amphibian":
      return "frog";
    case "crocodilian":
      return "alligator";
    default:
      return "paw";
  }
};

export default getSpeciesIcon;
