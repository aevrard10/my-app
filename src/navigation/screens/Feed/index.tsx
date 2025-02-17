import { useNavigation } from "@react-navigation/native";
import ScreenNames from "@shared/declarations/screenNames";
import { ScrollView, View } from "react-native";
import { Avatar, Card, Chip, FAB, ProgressBar, Text, useTheme } from "react-native-paper";
import useFoodQuery from "./hooks/data/queries/useStockQuery";

const getFoodIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "rongeur":
      return require("../../../../assets/souris.png");
    case "insectes":
      return require("../../../../assets/voler.png");
    case "vollaile":
      return require("../../../../assets/poulet.png");;
    case "poisson":
      return "fish";
      case "reptile":
        return require("../../../../assets/lizard.png");
    default:
      return "food-fork-drink";
  }
};

const Feed = () => {
  const { colors } = useTheme();
  const { navigate } = useNavigation();
  const { data } = useFoodQuery();

  return (
    <>
      <ScrollView>
        {data?.map((food) => {
          const stockLow = food.quantity < 5; // Seuil critique
          const stockCritical = food.quantity === 0;
          const progress = Math.min(food.quantity / 20, 1); // Normalisation

          return (
            <View style={{ margin: 16 }} key={food.id}>
              <Card>
                <Card.Title
                  title={food.name}
                  subtitle={food.type || "Nourriture"}
                  left={({ size }) => (
                    <Avatar.Icon size={size} icon={getFoodIcon(food.type)} color="#fff" />
                  )}
                  right={() => (
                    <Chip
                      icon="cart"
                      style={{
                        marginRight: 8,
                        backgroundColor: stockCritical ? "darkred" : stockLow ? "red" : "green",
                      }}
                      textStyle={{ color: "#fff", fontWeight: "bold" }}
                    >
                      {food.quantity} {food.unit || "restant(s)"}
                    </Chip>
                  )}
                />
                <Card.Content>
                  <ProgressBar progress={progress} color={stockLow ? "red" : colors.primary} />
                  {stockCritical ? (
                    <Text style={{ color: "darkred", fontWeight: "bold" }}>Stock épuisé !</Text>
                  ) : stockLow ? (
                    <Text style={{ color: "red" }}>Stock bas !</Text>
                  ) : null}
                </Card.Content>
              </Card>
            </View>
          );
        })}
      </ScrollView>

      <FAB
        theme={{ colors: { primaryContainer: colors.primary } }}
        color="#fff"
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        icon="plus"
        onPress={() => navigate(ScreenNames.ADD_FEED)}
      />
    </>
  );
};

export default Feed;
