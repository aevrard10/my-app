import { View } from "react-native"
import { Avatar, Button, Card, Chip, Icon, ProgressBar } from "react-native-paper"
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
   const stockLow = food.quantity < 10;
   const stockCritical = food.quantity === 0;

   const progress = Math.min(
     Math.floor(food.quantity) / 200,
     1
   )?.toFixed(1); // Par exemple 100 comme valeur max
    return (
        <View style={{ margin: 16 }} key={food.id}>
        <Card>
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
                style={{
                  marginRight: 8,
                  backgroundColor: stockCritical
                    ? "darkred"
                    : stockLow
                    ? "red"
                    : "green",
                }}
                textStyle={{ color: "#fff", fontWeight: "bold" }}
              >
                {food.quantity} {food.unit || "restant(s)"}
              </Chip>
            )}
          />
          <Card.Content>
            <ProgressBar
              progress={progress}
              color={stockLow ? "red" : colors.primary}
            />
          </Card.Content>
         

          <Card.Actions style={{ justifyContent: "space-between" }}>
          <TextInput
            label="Quantité"
            keyboardType="numeric"
            value={String(quantity)}
            onChangeText={(text) => setQuantity(parseInt(text) || 1)}  // Mettre à jour la quantité
            style={{ margin: 16 , backgroundColor: colors.surface}}
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


export default FeedCard;