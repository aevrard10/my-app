import { View, StyleSheet } from "react-native";
import {
  Avatar,
  Button,
  Chip,
  Icon,
  IconButton,
  ProgressBar,
  useTheme,
} from "react-native-paper";
import getFoodIcon, { FoodType } from "../../utils/getFoodIcon";
import TextInput from "@shared/components/TextInput";
import CardSurface from "@shared/components/CardSurface";
import { FC, useEffect, useState, memo } from "react";
import { Text } from "react-native";
import { useI18n } from "@shared/i18n";

type FoodCardProps = {
  food: {
    id: string;
    name: string;
    type: FoodType | string | null;
    quantity: number;
    unit: string;
  };
  isLoading: boolean;
  handleUpdateStock: (
    name: string,
    delta: number,
    unit?: string | null,
    type?: string | null,
  ) => void;
  handleDelete?: (
    name: string,
    unit?: string | null,
    type?: string | null,
  ) => void;
  colors: any;
};
const FeedCard: FC<FoodCardProps> = (props) => {
  const { food, isLoading, handleUpdateStock, handleDelete, colors } = props;
  const { colors: themeColors } = useTheme();
  const { t } = useI18n();
  const stockLow = food.quantity < 10;
  const stockCritical = food.quantity === 0;
  const [quantityText, setQuantityText] = useState("1");

  useEffect(() => {
    setQuantityText("1");
  }, [food.id]);

  const progress = Math.min(Math.floor(food.quantity) / 200, 1); // Par exemple 100 comme valeur max
  const quantityValue = Math.max(1, parseInt(quantityText, 10) || 1);
  return (
    <View style={styles.wrapper} key={food.id}>
      <CardSurface style={styles.card}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Avatar.Icon
                size={42}
                icon={getFoodIcon(food.type as FoodType)}
                color="#fff"
                style={{ backgroundColor: themeColors.primary }}
              />
              <View style={styles.titleBlock}>
                <View style={styles.titleLine}>
                  <Text style={styles.title}>{food.name}</Text>
                  <Chip
                    icon={() => (
                      <Icon
                        source={getFoodIcon(food.type)}
                        size={14}
                        color="white"
                      />
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
                    {food.quantity} {food.unit || t("feed.remaining")}
                  </Chip>
                </View>
                <Text style={styles.subtitle}>
                  {food.type || t("feed.default_type")}
                </Text>
              </View>
            </View>
          </View>
          <ProgressBar
            progress={progress}
            color={stockLow ? "#B67A2E" : colors.primary}
            style={styles.progress}
          />
        </View>

        <View style={styles.footer}>
          <View style={styles.stepperWrapper}>
            <View style={styles.stepper}>
              <IconButton
                icon="minus"
                size={18}
                onPress={() =>
                  setQuantityText(String(Math.max(1, quantityValue - 1)))
                }
                style={styles.stepperButton}
                iconColor={colors.primary}
              />
              <TextInput
                keyboardType="numeric"
                inputMode="numeric"
                value={quantityText}
                onChangeText={(text) => {
                  if (text === "") {
                    setQuantityText("");
                    return;
                  }
                  if (!/^\d+$/.test(text)) return;
                  setQuantityText(text);
                }}
                style={[
                  styles.stepperInput,
                  { backgroundColor: colors.surface },
                ]}
              />
              <IconButton
                icon="plus"
                size={18}
                onPress={() =>
                  setQuantityText(String(Math.max(1, quantityValue + 1)))
                }
                style={styles.stepperButton}
                iconColor={colors.primary}
              />
            </View>
          </View>
          <View style={styles.actionRow}>
            <Button
              mode="outlined"
              icon="minus"
              disabled={food.quantity === 0 || isLoading}
              onPress={() =>
                handleUpdateStock(
                  food.name,
                  -quantityValue,
                  food.unit,
                  (food.type as string) || null,
                )
              }
            >
              {t("common.remove")}
            </Button>
            <Button
              mode="contained"
              icon="plus"
              disabled={isLoading}
              onPress={() =>
                handleUpdateStock(
                  food.name,
                  quantityValue,
                  food.unit,
                  (food.type as string) || null,
                )
              }
            >
              {t("common.add")}
            </Button>
            {handleDelete ? (
              <Button
                mode="text"
                textColor="#C33C3C"
                icon="delete"
                disabled={isLoading}
                onPress={() =>
                  handleDelete(
                    food.name,
                    food.unit,
                    (food.type as string) || null,
                  )
                }
              >
                {t("common.delete")}
              </Button>
            ) : null}
          </View>
        </View>
      </CardSurface>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
  },
  card: {
    padding: 0,
    overflow: "hidden",
  },
  content: {
    padding: 16,
    gap: 12,
  },
  header: {
    gap: 8,
  },
  titleRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  titleBlock: {
    flex: 1,
    gap: 4,
  },
  titleLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    opacity: 0.6,
  },
  chip: {
    marginRight: 8,
  },
  progress: {
    height: 6,
    borderRadius: 6,
  },
  footer: {
    padding: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  stepperWrapper: {
    alignItems: "flex-start",
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 6,
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  stepperButton: {
    margin: 0,
  },
  stepperInput: {
    minWidth: 56,
    textAlign: "center",
    borderWidth: 0,
    paddingVertical: 6,
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});

export default memo(FeedCard);
