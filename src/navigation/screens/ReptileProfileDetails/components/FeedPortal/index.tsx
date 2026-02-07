import { FC, useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Checkbox, Dialog, Portal, useTheme } from "react-native-paper";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@rn-flix/snackbar";
import useReptileQuery from "../../../Reptiles/hooks/queries/useReptileQuery";
import useFoodQuery from "../../../Feed/hooks/data/queries/useStockQuery";
import useLastFedUpdateMutation from "../../hooks/data/mutations/useLastFedUpdate";
import useAddReptileFeedingMutation from "../../hooks/data/mutations/useAddReptileFeedingMutation";
import QueriesKeys from "@shared/declarations/queriesKeys";
import TextInput from "@shared/components/TextInput";
import { executeVoid } from "@shared/local/db";
import { useI18n } from "@shared/i18n";

type FeedPortalProps = {
  id: string;
  data: any;
  food: any;
  visible: boolean;
  onClose: () => void;
};

const FeedPortal: FC<FeedPortalProps> = (props) => {
  const { id, data, food, visible, onClose } = props;
  const [selectedFood, setSelectedFood] = useState<any | null>(null);
  const [foodQuantity, setFoodQuantity] = useState(1);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const { mutate: updateLastFed } = useLastFedUpdateMutation();
  const { mutate: addFeeding } = useAddReptileFeedingMutation();
  const queryClient = useQueryClient();
  const { show } = useSnackbar();
  const { colors } = useTheme();
  const { t } = useI18n();

  const handleNourrissage = useCallback(() => {
    if (!selectedFood) {
      show(t("feed_portal.select_required"));
      return;
    }

    const now = new Date().toISOString();
    const noteLabel = t("feed_portal.note_for", {
      name: data?.name || t("profile.report_reptile"),
    });
    const defaultUnit = t("feed.unit_default");

    updateLastFed(
      { id, last_fed: now.split("T")[0] },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: useReptileQuery.queryKey(id),
          });
          // décrémente le stock local (ligne 'stock')
          executeVoid(
            `INSERT INTO feedings (id, reptile_id, food_name, quantity, unit, fed_at, notes)
             VALUES (?,?,?,?,?,?,?);`,
            [
              `${Date.now()}-${Math.random().toString(16).slice(2)}`,
              "stock",
              selectedFood?.name,
              -foodQuantity,
              selectedFood?.unit ?? defaultUnit,
              now,
              noteLabel,
            ],
          ).catch(() => {});

          // Ajoute le nourrissage sur le reptile
          addFeeding(
            {
              input: {
                reptile_id: id,
                food_name: selectedFood?.name,
                quantity: foodQuantity,
                unit: selectedFood?.unit || defaultUnit,
                fed_at: now,
                notes: noteLabel,
              },
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({
                  queryKey: [QueriesKeys.REPTILE_FEEDINGS, id],
                });
                queryClient.invalidateQueries({
                  queryKey: useFoodQuery.queryKey,
                });
                show(t("feed_portal.feed_saved"));
              },
            },
          );
          setModalIsVisible(false);
        },
        onError: () => {
          show(t("feed_portal.feed_error"));
        },
      },
    );
  }, [
    addFeeding,
    data?.name,
    foodQuantity,
    id,
    queryClient,
    selectedFood,
    show,
    t,
    updateLastFed,
  ]);

  useEffect(() => {
    setModalIsVisible(visible);
  }, [visible]);

  if (!visible) return null;

  return (
    <Portal>
      <Dialog
        visible={modalIsVisible}
        onDismiss={() => {
          setModalIsVisible(false);
          onClose();
        }}
        style={{ borderRadius: 20, backgroundColor: colors.surface }}
      >
        <Dialog.Title>{t("feed_portal.title")}</Dialog.Title>
        <Dialog.Content>
          <View>
            {food?.map((foodItem) => (
              <View
                key={foodItem.id}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Checkbox.Android
                  status={
                    selectedFood?.id === foodItem.id ? "checked" : "unchecked"
                  }
                  onPress={() =>
                    setSelectedFood((prev) =>
                      prev?.id === foodItem.id ? null : foodItem,
                    )
                  }
                />
                <Button
                  mode="text"
                  textColor={colors.onSurface}
                  onPress={() =>
                    setSelectedFood((prev) =>
                      prev?.id === foodItem.id ? null : foodItem,
                    )
                  }
                >
                  {foodItem.name} - {foodItem.quantity}{" "}
                  {foodItem.unit || t("feed.remaining")}
                </Button>
              </View>
            ))}
            <TextInput
              placeholder={t("add_feed.quantity")}
              value={foodQuantity.toString()}
              onChangeText={(text) => {
                const number = parseInt(text, 10);
                setFoodQuantity(isNaN(number) ? 1 : number);
              }}
              keyboardType="numeric"
            />
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              setModalIsVisible(false);
              setSelectedFood(null);
              onClose();
            }}
          >
            {t("common.cancel")}
          </Button>
          <Button
            onPress={() => {
              handleNourrissage();
              onClose();
            }}
          >
            {t("common.confirm")}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default FeedPortal;
