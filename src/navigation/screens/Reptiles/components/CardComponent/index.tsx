import {
  Button,
  Dialog,
  Portal,
  Text,
  Avatar,
  IconButton,
} from "react-native-paper";
import { Image, StyleSheet, View } from "react-native";
import { FC, useCallback, useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Reptile } from "@shared/local/reptileStore";
import useRemoveReptileMutation from "../../hooks/mutations/useRemoveReptile";
import { useQueryClient } from "@tanstack/react-query";
import useReptilesQuery from "../../hooks/queries/useReptilesQuery";
import { capitalize } from "lodash";
import ScreenNames from "@shared/declarations/screenNames";
import { getBackgroundColor, getIcon } from "../../utils/getSex";
import { useSnackbar } from "@rn-flix/snackbar";
import { useTheme } from "react-native-paper";
import CardSurface from "@shared/components/CardSurface";
import { useI18n } from "@shared/i18n";
type CardComponentProps = {
  item?: Reptile;
};

const CardComponent: FC<CardComponentProps> = (props) => {
  const { item } = props;
  const { navigate } = useNavigation();
  const queryClient = useQueryClient();
  const { mutate } = useRemoveReptileMutation();
  const [showDialog, setShowDialog] = useState(false);
  const { show } = useSnackbar();
  const { colors } = useTheme();
  const { t } = useI18n();
  const iconSex = useMemo(() => getIcon(item?.sex), [item?.sex]);
  const backgroundColor = useMemo(
    () => getBackgroundColor(item?.sex),
    [item?.sex],
  );
  const removeReptile = useCallback(() => {
    if (!item?.id) {
      return;
    }
    mutate(
      { id: item?.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: useReptilesQuery.queryKey,
          });
          show(t("reptiles.delete_success"), {
            label: t("common.ok"),
          });
        },
        onError: () => {
          show(t("reptiles.delete_error"), {
            label: t("common.ok"),
          });
        },
      },
    );
  }, [item?.id, mutate, queryClient, show]);

  return (
    <CardSurface style={styles.card}>
      <View style={styles.media}>
        <Image
          source={
            item?.image_url
              ? { uri: item?.image_url }
              : require("../../../../../../assets/cobra.png")
          }
          resizeMode="cover"
          style={styles.cover}
        />
        {item?.sex && (
          <View style={styles.sexBadge}>
            <Avatar.Icon
              size={32}
              style={{ backgroundColor, borderRadius: 12 }}
              icon={iconSex}
              color={"#fff"}
            />
          </View>
        )}
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <Text variant="titleMedium">{capitalize(item?.name)}</Text>
            <Text variant="bodySmall" style={styles.subtitle}>
              {(item?.species || t("reptiles.unknown_species")) +
                (item?.age !== null && item?.age !== undefined
                  ? ` · ${item.age} ${t("reptiles.age_suffix")}`
                  : "")}
            </Text>
          </View>
          <IconButton
            icon="trash-can-outline"
            size={20}
            iconColor={colors.error}
            onPress={() => setShowDialog(true)}
            style={styles.deleteButton}
          />
        </View>
        <View style={styles.actions}>
          <Button
            mode="contained"
            icon="chevron-right"
            onPress={() =>
              navigate(ScreenNames.REPTILE_PROFILE_DETAILS, {
                id: item?.id,
              })
            }
          >
            {t("reptiles.view_more")}
          </Button>
        </View>
      </View>
      <Portal>
        <Dialog
          visible={showDialog}
          onDismiss={() => setShowDialog(false)}
          style={{ borderRadius: 20 }}
        >
          <Dialog.Title>{t("reptiles.delete_title")}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {t("reptiles.delete_confirm")}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDialog(false)}>{t("common.cancel")}</Button>
            <Button onPress={removeReptile} textColor={colors.error}>
              {t("reptiles.delete_action")}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </CardSurface>
  );
};
const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    marginBottom: 16,
    padding: 0,
  },
  media: {
    height: 180,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: "hidden",
    backgroundColor: "#2F5D50",
  },
  cover: {
    width: "100%",
    height: "100%",
  },
  sexBadge: {
    position: "absolute",
    top: 12,
    left: 12,
  },
  body: {
    padding: 16,
    gap: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  titleBlock: {
    flex: 1,
    gap: 4,
  },
  subtitle: {
    opacity: 0.6,
  },
  deleteButton: {
    margin: 0,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
export default CardComponent;
