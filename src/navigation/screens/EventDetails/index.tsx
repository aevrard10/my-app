import { ScrollView, View, StyleSheet, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Text, useTheme, Avatar } from "react-native-paper";
import Screen from "@shared/components/Screen";
import CardSurface from "@shared/components/CardSurface";
import TextInfo from "../ReptileProfileDetails/components/TextInfo";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useI18n } from "@shared/i18n";
import useReptileEventQuery from "../Agenda/hooks/queries/useReptileEventQuery";
import useDeleteReptileEventMutation from "../Agenda/hooks/mutations/useDeleteReptileEventMutation";
import useExcludeReptileEventOccurrenceMutation from "../Agenda/hooks/mutations/useExcludeReptileEventOccurrenceMutation";
import { useQueryClient } from "@tanstack/react-query";
import useReptileEventsQuery from "../Agenda/hooks/queries/useReptileEventsQuery";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenNames from "@shared/declarations/screenNames";

const NOTIF_KEY = "reptitrack_event_notifs";

const EventDetails = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const eventId = route.params?.id as string | undefined;
  const occurrenceDate = route.params?.date as string | undefined;
  const { data: event } = useReptileEventQuery(eventId);
  const { mutate: deleteEvent, isPending: isDeleting } =
    useDeleteReptileEventMutation();
  const { mutate: excludeOccurrence, isPending: isExcluding } =
    useExcludeReptileEventOccurrenceMutation();
  const [notifMap, setNotifMap] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(NOTIF_KEY);
      if (raw) {
        try {
          setNotifMap(JSON.parse(raw));
        } catch {
          setNotifMap({});
        }
      }
    })();
  }, []);

  const saveNotifMap = async (map: Record<string, string>) => {
    setNotifMap(map);
    await AsyncStorage.setItem(NOTIF_KEY, JSON.stringify(map));
  };

  const cancelNotification = async (id: string) => {
    if (Platform.OS === "web") return;
    const notifId = notifMap[id];
    if (notifId) {
      try {
        await Notifications.cancelScheduledNotificationAsync(notifId);
      } catch {}
      const next = { ...notifMap };
      delete next[id];
      await saveNotifMap(next);
    }
  };

  const getEventTypeLabel = (value?: string | null) => {
    const normalized = (value || "OTHER").toUpperCase();
    if (normalized === "FEEDING") return t("agenda.type_feeding");
    if (normalized === "CLEANING") return t("agenda.type_cleaning");
    if (normalized === "MISTING") return t("agenda.type_misting");
    if (normalized === "VET") return t("agenda.type_vet");
    return t("agenda.type_other");
  };
  const getPriorityLabel = (value?: string | null) => {
    const normalized = (value || "NORMAL").toUpperCase();
    if (normalized === "LOW") return t("agenda.priority_low");
    if (normalized === "HIGH") return t("agenda.priority_high");
    return t("agenda.priority_normal");
  };
  const getReminderLabel = (value?: number | null) => {
    const minutes = Number(value ?? 0);
    if (minutes === 10) return t("agenda.reminder_10m");
    if (minutes === 30) return t("agenda.reminder_30m");
    if (minutes === 60) return t("agenda.reminder_1h");
    if (minutes === 1440) return t("agenda.reminder_1d");
    return t("agenda.reminder_at_time");
  };

  const refreshEvents = () => {
    queryClient.invalidateQueries({
      queryKey: useReptileEventsQuery.queryKey,
    });
  };

  if (!event) {
    return (
      <Screen>
        <View style={styles.header}>
          <Text variant="titleLarge">{t("agenda.edit_event_title")}</Text>
        </View>
        <Text>{t("common.not_available")}</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="titleLarge">{event.event_name}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <CardSurface style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={{ flex: 1 }}>
              <Text variant="titleMedium">{event.event_name}</Text>
              <Text variant="labelSmall" style={styles.summaryMeta}>
                {getEventTypeLabel(event.event_type)} · {event.event_date} ·{" "}
                {event.event_time || "—"}
              </Text>
            </View>
            {event.reptile_image_url ? (
              <Avatar.Image size={56} source={{ uri: event.reptile_image_url }} />
            ) : (
              <Avatar.Icon size={56} icon="turtle" />
            )}
          </View>
          {event.reptile_name ? (
            <Text variant="labelSmall" style={styles.summaryReptile}>
              {event.reptile_name}
            </Text>
          ) : null}
        </CardSurface>

        <CardSurface style={styles.sectionCard}>
          <TextInfo title={t("agenda.info_type")} value={getEventTypeLabel(event.event_type)} />
          <TextInfo title={t("agenda.info_date")} value={event.event_date} />
          <TextInfo title={t("agenda.info_time")} value={event.event_time || "—"} />
          {event.reptile_name ? (
            <TextInfo title={t("agenda.info_reptile")} value={event.reptile_name} />
          ) : null}
        </CardSurface>

        <CardSurface style={styles.sectionCard}>
          <TextInfo title={t("agenda.info_priority")} value={getPriorityLabel(event.priority)} />
          <TextInfo title={t("agenda.info_reminder")} value={getReminderLabel(event.reminder_minutes)} />
          <TextInfo title={t("agenda.info_notes")} value={event.notes || ""} />
          {event.recurrence_type && event.recurrence_type !== "NONE" ? (
            <TextInfo
              title={t("agenda.info_recurrence")}
              value={event.recurrence_type}
            />
          ) : null}
        </CardSurface>

        <View style={styles.actions}>
          <Button
            mode="contained"
            icon="pencil"
            onPress={() =>
              navigation.navigate(ScreenNames.EDIT_EVENT as never, {
                id: event.id,
              } as never)
            }
          >
            {t("agenda.edit_event_button")}
          </Button>

          {event.recurrence_type && event.recurrence_type !== "NONE" ? (
            <View style={styles.deleteRow}>
              <Button
                mode="outlined"
                loading={isExcluding}
                onPress={() => {
                  if (!event?.id || !occurrenceDate) return;
                  excludeOccurrence(
                    { id: event.id, date: occurrenceDate },
                    {
                      onSuccess: () => {
                        refreshEvents();
                        navigation.goBack();
                      },
                    },
                  );
                }}
              >
                {t("agenda.delete_occurrence")}
              </Button>
              <Button
                mode="outlined"
                loading={isDeleting}
                textColor={colors.error}
                onPress={() => {
                  if (!event?.id) return;
                  cancelNotification(event.id);
                  deleteEvent(
                    { id: event.id },
                    {
                      onSuccess: () => {
                        refreshEvents();
                        navigation.goBack();
                      },
                    },
                  );
                }}
              >
                {t("agenda.delete_series")}
              </Button>
            </View>
          ) : (
            <Button
              mode="outlined"
              loading={isDeleting}
              textColor={colors.error}
              onPress={() => {
                if (!event?.id) return;
                cancelNotification(event.id);
                deleteEvent(
                  { id: event.id },
                  {
                    onSuccess: () => {
                      refreshEvents();
                      navigation.goBack();
                    },
                  },
                );
              }}
            >
              {t("agenda.delete_event")}
            </Button>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 4,
    marginBottom: 12,
    gap: 4,
  },
  content: {
    paddingBottom: 24,
  },
  summaryCard: {
    padding: 16,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  summaryMeta: {
    opacity: 0.7,
    marginTop: 4,
  },
  summaryReptile: {
    marginTop: 8,
    opacity: 0.7,
  },
  sectionCard: {
    padding: 14,
    marginBottom: 12,
  },
  actions: {
    marginTop: 4,
    gap: 10,
  },
  deleteRow: {
    gap: 10,
  },
});

export default EventDetails;
