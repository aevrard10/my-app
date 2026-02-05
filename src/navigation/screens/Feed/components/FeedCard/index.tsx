import { View, StyleSheet } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Icon,
  ProgressBar,
  useTheme,
} from "react-native-paper";
import getFoodIcon, { FoodType } from "../../utils/getFoodIcon"
import TextInput from "@shared/components/TextInput"
import { FC } from "react"

type FoodCardProps = {
    food: {
        id: string;
        name: string;
        type: FoodType;
        quantity: number;
        unit: string;
    },
    isLoading: boolean;
    handleUpdateStock: (id: string, quantity: number, reason: string) => void;
    quantity: number;
    setQuantity: (quantity: number) => void;
    colors: any;

}
const FeedCard :FC<FoodCardProps> = (props) => {
   const { food, isLoading, handleUpdateStock, quantity, setQuantity, colors } = props;
   const { colors: themeColors } = useTheme();
   const stockLow = food.quantity < 10;
   const stockCritical = food.quantity === 0;

   const progress = Math.min(
     Math.floor(food.quantity) / 200,
     1
   ); // Par exemple 100 comme valeur max
    return (
        <View style={styles.wrapper} key={food.id}>
        <Card style={styles.card}>
          <Card.Title
            title={food.name}
            subtitle={food.type || "Nourriture"}
            left={({ size }) => (
              <Avatar.Icon
                size={size}
                icon={getFoodIcon(food.type)}
                color="#fff"
              />
            )}
            right={() => (
              <Chip
                icon={() => (
                  <Icon source={getFoodIcon(food.type)} size={16} color="white" />
                )}
                style={[
                  styles.chip,
                  {
                    backgroundColor: stockCritical
                      ? "#C33C3C"
                      : stockLow
                      ? "#B67A2E"
                      : themeColors.primary,
                  },
                ]}
                textStyle={{ color: "#fff", fontWeight: "bold" }}
              >
                {food.quantity} {food.unit || "restant(s)"}
              </Chip>
            )}
          />
          <Card.Content>
            <ProgressBar
              progress={progress}
              color={stockLow ? "#B67A2E" : colors.primary}
              style={styles.progress}
            />
          </Card.Content>
         

          <Card.Actions style={styles.actions}>
          <TextInput
            label="Quantité"
            keyboardType="numeric"
            value={String(quantity)}
            onChangeText={(text) => setQuantity(parseInt(text) || 1)}  // Mettre à jour la quantité
            style={[styles.quantityInput, { backgroundColor: colors.surface }]}
          />
            <Button
              mode="contained"
              disabled={food.quantity === 0 || isLoading}
              onPress={() => handleUpdateStock(food.id, -quantity, `Mise à jour de ${food.name}`)}
              >
              -
            </Button>
            <Button
              mode="contained"
              disabled={isLoading}
              onPress={() => handleUpdateStock(food.id, quantity, `Ajout de ${food.name}`)}
            >
              +
            </Button>
          </Card.Actions>
        </Card>
      </View>
    )
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
  },
  card: {
    borderRadius: 18,
    overflow: "hidden",
  },
  chip: {
    marginRight: 8,
  },
  progress: {
    height: 6,
    borderRadius: 6,
    marginTop: 6,
  },
  actions: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  quantityInput: {
    margin: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
});

export default FeedCard;
