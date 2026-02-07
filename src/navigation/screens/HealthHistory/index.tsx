import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import React, { useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Avatar, Button, IconButton, Text, useTheme } from "react-native-paper";
import Screen from "@shared/components/Screen";
import CardSurface from "@shared/components/CardSurface";
import ListEmptyComponent from "@shared/components/ListEmptyComponent";
import { useI18n } from "@shared/i18n";
import { formatDDMMYYYY } from "@shared/utils/formatedDate";
import useReptileQuery from "../Reptiles/hooks/queries/useReptileQuery";
import useReptileHealthEventsQuery from "../ReptileProfileDetails/hooks/data/queries/useReptileHealthEventsQuery";
import useDeleteReptileHealthEventMutation from "../ReptileProfileDetails/hooks/data/mutations/useDeleteReptileHealthEventMutation";
import { useQueryClient } from "@tanstack/react-query";
import QueriesKeys from "@shared/declarations/queriesKeys";
import ScreenNames from "@shared/declarations/screenNames";

type Props = StaticScreenProps<{
  id: string;
}>;

const HealthHistory = ({ route }: Props) => {
  const { id } = route.params;
  const { colors } = useTheme();
  const { t } = useI18n();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { data: reptile } = useReptileQuery(id);
  const { data, isPending } = useReptileHealthEventsQuery(id, 200);
  const { mutate } = useDeleteReptileHealthEventMutation();

  const items = data ?? [];
  const headerSubtitle = useMemo(() => {
    return reptile?.name
      ? t("health.history_subtitle_named", { name: reptile.name })
      : t("health.history_subtitle");
  }, [reptile?.name, t]);

  const getTypeLabel = (value?: string | null) => {
    if (value && !value.includes(" ")) {
      const normalized = value.toUpperCase();
      if (normalized === "ACARIEN") return t("health.type_acarien");
      if (normalized === "REGURGITATION") return t("health.type_regurgitation");
      if (normalized === "REFUS") return t("health.type_refus");
      if (normalized === "UNDERWEIGHT") return t("health.type_underweight");
      if (normalized === "OBESITY") return t("health.type_obesity");
      if (normalized === "SHED_ISSUE") return t("health.type_shed_issue");
      if (normalized === "DIGESTIVE") return t("health.type_digestive");
      if (normalized === "HIBERNATION") return t("health.type_hibernation");
      if (normalized === "MEDICATION") return t("health.type_medication");
      if (normalized === "OVULATION") return t("health.type_ovulation");
      if (normalized === "INJURY") return t("health.type_injury");
      if (normalized === "ABSCESS") return t("health.type_abscess");
      if (normalized === "OTHER") return t("health.type_other");
    }
    return value?.trim() || t("health.type_other");
  };

  const handleDelete = (eventId: string) => {
    mutate(eventId, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QueriesKeys.REPTILE_HEALTH, id],
        });
      },
    });
  };

  return (
    <Screen>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <ListEmptyComponent isLoading={isPending} />
        }
        ListHeaderComponent={
          <CardSurface style={styles.headerCard}>
            <Text variant="titleLarge">{t("health.history_title")}</Text>
            <Text variant="bodySmall" style={styles.headerSubtitle}>
              {headerSubtitle}
            </Text>
          </CardSurface>
        }
        renderItem={({ item }) => {
          const date = item.event_date
            ? formatDDMMYYYY(item.event_date)
            : t("common.date_unavailable");
          const time = item.event_time?.trim() ? item.event_time : "—";
          return (
            <CardSurface style={styles.card}>
              <View style={styles.cardHeader}>
                {reptile?.image_url ? (
                  <Avatar.Image size={42} source={{ uri: reptile.image_url }} />
                ) : (
                  <Avatar.Icon size={42} icon="turtle" />
                )}
                <View style={styles.cardTitle}>
                  <Text variant="titleMedium">{getTypeLabel(item.event_type)}</Text>
                  <Text variant="labelSmall" style={styles.meta}>
                    {date} · {time}
                  </Text>
                </View>
                <IconButton
                  icon="trash-can-outline"
                  iconColor={colors.error}
                  onPress={() => handleDelete(item.id)}
                />
              </View>
              {item.notes ? (
                <Text variant="bodySmall" style={styles.notes}>
                  {item.notes}
                </Text>
              ) : null}
            </CardSurface>
          );
        }}
      />
      <Button
        mode="contained"
        style={styles.fab}
        icon="plus"
        onPress={() =>
          navigation.navigate(ScreenNames.ADD_HEALTH_STATUS as never, {
            id,
          } as never)
        }
      >
        {t("health.add_action")}
      </Button>
    </Screen>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 120,
  },
  headerCard: {
    marginTop: 4,
    marginBottom: 12,
  },
  headerSubtitle: {
    opacity: 0.7,
    marginTop: 4,
  },
  card: {
    marginTop: 12,
    padding: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardTitle: {
    flex: 1,
    gap: 4,
  },
  meta: {
    opacity: 0.6,
  },
  notes: {
    marginTop: 8,
    opacity: 0.7,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
});

export default HealthHistory;
