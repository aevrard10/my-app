import { useNavigation } from "@react-navigation/native";
import useCurrentUserQuery from "@shared/hooks/queries/useCurrentUser";
import useDashboardSummaryQuery from "@shared/hooks/queries/useDashboardSummary";
import useHealthAlertsQuery from "@shared/hooks/queries/useHealthAlertsQuery";
import Screen from "@shared/components/Screen";
import CardSurface from "@shared/components/CardSurface";
import ScreenNames from "@shared/declarations/screenNames";
import { formatDDMMYYYY } from "@shared/utils/formatedDate";
import Skeleton from "@shared/components/Skeleton";
import React from "react";
import { Alert, Linking, Platform, ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Button,
  Icon,
  IconButton,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import useLogoutMutation from "@shared/data/hooks/data/mutations/useLogoutMutation";

const Home = () => {
  const { navigate } = useNavigation();
  const { colors } = useTheme();
  const [, user] = useCurrentUserQuery();
  const {
    data: summary,
    isPending: isSummaryLoading,
    error: summaryError,
  } = useDashboardSummaryQuery();
  const { data: healthAlerts } = useHealthAlertsQuery();
  const { mutate: logout } = useLogoutMutation();

  const upcomingEvents = summary?.upcoming_events ?? [];
  const reptilesCount = summary?.reptiles_count ?? 0;
  const eventsToday = summary?.events_today ?? 0;
  const unreadNotifications = summary?.unread_notifications ?? 0;
  const alertsCount =
    healthAlerts?.filter((a) => (a.alerts?.length ?? 0) > 0).length ?? 0;
  const usefulLinks = [
    {
      label: "INPN (MNHN)",
      description: "Fiches officielles des espèces en France",
      url: "https://inpn.mnhn.fr/accueil/index/",
    },
    {
      label: "Société Herpétologique de France",
      description: "Ressources et actions pour l'herpétofaune",
      url: "https://lashf.org/",
    },
    {
      label: "SOS Serpents, Tortues, Grenouilles",
      description: "Aide et identification en France",
      url: "https://sosserpentstortuesgrenouilles.org/",
    },
    {
      label: "The Reptile Database",
      description: "Base taxonomique mondiale des reptiles",
      url: "https://www.reptile-database.org/",
    },
    {
      label: "iNaturalist",
      description: "Identification communautaire via photos",
      url: "https://www.inaturalist.org/",
    },
  ];

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <CardSurface style={styles.heroCard}>
          <View style={styles.heroRow}>
            <Avatar.Icon size={44} icon="turtle" />
            <View style={styles.heroText}>
              <Text variant="titleMedium">Bonjour, @{user?.username} !</Text>
              <Text variant="bodySmall" style={styles.heroSubtitle}>
                Bienvenue sur votre tableau de bord.
              </Text>
            </View>
            <IconButton
              icon="logout-variant"
              onPress={() => {
                if (Platform.OS === "web" && typeof window !== "undefined") {
                  if (window.confirm("Se déconnecter ?")) {
                    logout();
                  }
                  return;
                }
                Alert.alert("Déconnexion", "Se déconnecter ?", [
                  { text: "Annuler", style: "cancel" },
                  { text: "Déconnexion", style: "destructive", onPress: () => logout() },
                ]);
              }}
            />
          </View>
        </CardSurface>

        <CardSurface style={styles.quickActionsCard}>
          <Text variant="labelLarge">Raccourcis</Text>
          <View style={styles.quickActionsRow}>
            <TouchableRipple
              style={[
                styles.quickAction,
                { backgroundColor: colors.primary },
              ]}
              onPress={() => navigate(ScreenNames.ADD_REPTILE)}
            >
              <View style={styles.quickActionContent}>
                <Icon source="plus" size={18} color={colors.onPrimary} />
                <Text
                  variant="labelSmall"
                  style={[styles.quickActionText, { color: colors.onPrimary }]}
                >
                  Ajouter un reptile
                </Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              style={[
                styles.quickAction,
                { backgroundColor: colors.secondaryContainer },
              ]}
              onPress={() =>
                navigate(ScreenNames.AGENDA, { openAddEvent: true })
              }
            >
              <View style={styles.quickActionContent}>
                <Icon source="calendar" size={18} color={colors.secondary} />
                <Text
                  variant="labelSmall"
                  style={[styles.quickActionText, { color: colors.secondary }]}
                >
                  Nouvel événement
                </Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              style={[
                styles.quickAction,
                { backgroundColor: colors.tertiaryContainer },
              ]}
              onPress={() => navigate(ScreenNames.ADD_FEED)}
            >
              <View style={styles.quickActionContent}>
                <Icon source="food" size={18} color={colors.tertiary} />
                <Text
                  variant="labelSmall"
                  style={[styles.quickActionText, { color: colors.tertiary }]}
                >
                  Ajouter un stock
                </Text>
              </View>
            </TouchableRipple>
          </View>
        </CardSurface>

        <CardSurface style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text variant="titleMedium">Aujourd&apos;hui</Text>
            <Text variant="bodySmall" style={styles.summarySubtitle}>
              Vos indicateurs clés en un coup d&apos;œil.
            </Text>
          </View>
          <View style={styles.statsRow}>
            {[0, 1, 2].map((index) => {
              const pillColors = [
                colors.secondaryContainer,
                colors.primaryContainer,
                colors.tertiaryContainer,
              ];
              const icons = ["turtle", "calendar", "bell"] as const;
              const labels = ["Reptiles", "Événements", "Alertes"];
              return (
                <View
                  key={index}
                  style={[styles.statPill, { backgroundColor: pillColors[index] }]}
                >
                  <Icon
                    source={icons[index]}
                    size={16}
                    color={
                      index === 0
                        ? colors.secondary
                        : index === 1
                        ? colors.primary
                        : colors.tertiary
                    }
                  />
                  {isSummaryLoading ? (
                    <Skeleton height={18} width={36} style={styles.statSkeleton} />
                  ) : (
                    <Text variant="titleMedium" style={styles.statValue}>
                      {summaryError
                        ? "—"
                        : index === 0
                        ? reptilesCount
                        : index === 1
                        ? eventsToday
                        : unreadNotifications}
                    </Text>
                  )}
                  <Text variant="labelSmall" style={styles.statLabel}>
                    {labels[index]}
                  </Text>
                </View>
              );
            })}
            {alertsCount > 0 ? (
              <View
                style={[
                  styles.statPill,
                  { backgroundColor: colors.errorContainer, flex: 1, minWidth: 90 },
                ]}
              >
                <Icon source="alert" size={16} color={colors.error} />
                <Text variant="titleMedium" style={[styles.statValue, { color: colors.error }]}>
                  {alertsCount}
                </Text>
                <Text variant="labelSmall" style={[styles.statLabel, { color: colors.error }]}>
                  Alertes santé
                </Text>
              </View>
            ) : null}
          </View>
          {summaryError ? (
            <Text variant="labelSmall" style={styles.summaryError}>
              Dashboard indisponible — vérifie le backend.
            </Text>
          ) : null}
          <View style={styles.upcomingSection}>
            <Text variant="labelLarge">Prochains événements</Text>
            {isSummaryLoading ? (
              <View style={styles.upcomingList}>
                {[0, 1].map((item) => (
                  <View key={item} style={styles.upcomingItem}>
                    <View style={styles.upcomingDot} />
                    <View style={styles.upcomingText}>
                      <Skeleton height={12} width="60%" />
                      <Skeleton height={10} width="40%" style={{ marginTop: 6 }} />
                    </View>
                  </View>
                ))}
              </View>
            ) : upcomingEvents.length === 0 ? (
              <Text variant="bodySmall" style={styles.upcomingEmpty}>
                Aucun événement prévu pour le moment.
              </Text>
            ) : (
              <View style={styles.upcomingList}>
                {upcomingEvents.map((event) => {
                  const timeLabel = event.event_time
                    ? event.event_time.slice(0, 5)
                    : "";
                  return (
                    <View key={event.id} style={styles.upcomingItem}>
                      <View style={styles.upcomingDot} />
                      <View style={styles.upcomingText}>
                        <Text variant="bodyMedium">{event.event_name}</Text>
                        <Text variant="bodySmall" style={styles.upcomingMeta}>
                          {formatDDMMYYYY(event.event_date)} · {timeLabel}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </CardSurface>

        <CardSurface style={styles.reptilesCard}>
          <View style={styles.reptilesHeader}>
            <Text variant="titleMedium">Mes reptiles</Text>
            <Button
              mode="outlined"
              onPress={() => navigate(ScreenNames.REPTILES)}
              compact
            >
              Voir tous
            </Button>
          </View>
          <Text variant="bodySmall" style={styles.reptilesSubtitle}>
            {reptilesCount} reptiles enregistrés.
          </Text>
        </CardSurface>

        <CardSurface style={styles.linksCard}>
          <View style={styles.linksHeader}>
            <Text variant="titleMedium">Liens utiles</Text>
            <Text variant="bodySmall" style={styles.linksSubtitle}>
              Identification et ressources fiables.
            </Text>
          </View>
          <View style={styles.linksList}>
            {usefulLinks.map((link) => (
              <TouchableRipple
                key={link.url}
                style={styles.linkItem}
                onPress={() => Linking.openURL(link.url)}
              >
                <View style={styles.linkContent}>
                  <View style={styles.linkText}>
                    <Text variant="bodyMedium">{link.label}</Text>
                    <Text variant="bodySmall" style={styles.linkMeta}>
                      {link.description}
                    </Text>
                  </View>
                  <Icon source="open-in-new" size={16} color={colors.primary} />
                </View>
              </TouchableRipple>
            ))}
          </View>
        </CardSurface>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
  },
  heroCard: {
    marginTop: 4,
    marginBottom: 12,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  heroText: {
    flex: 1,
  },
  heroSubtitle: {
    opacity: 0.6,
    marginTop: 2,
  },
  quickActionsCard: {
    marginBottom: 12,
    gap: 10,
  },
  quickActionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  quickAction: {
    flex: 1,
    minWidth: 120,
    borderRadius: 16,
    padding: 12,
  },
  quickActionContent: {
    gap: 8,
  },
  quickActionText: {
    opacity: 0.9,
  },
  summaryCard: {
    marginBottom: 12,
    gap: 12,
  },
  summaryHeader: {
    gap: 4,
  },
  summarySubtitle: {
    opacity: 0.6,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statPill: {
    flex: 1,
    minWidth: 90,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    gap: 4,
    alignItems: "flex-start",
  },
  statValue: {
    marginTop: 6,
  },
  statLabel: {
    opacity: 0.7,
  },
  statSkeleton: {
    marginTop: 6,
  },
  summaryError: {
    marginTop: 6,
    opacity: 0.7,
  },
  upcomingSection: {
    gap: 6,
  },
  upcomingList: {
    gap: 8,
  },
  upcomingItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  upcomingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  upcomingText: {
    flex: 1,
  },
  upcomingMeta: {
    opacity: 0.6,
    marginTop: 2,
  },
  upcomingEmpty: {
    opacity: 0.6,
  },
  reptilesCard: {
    gap: 6,
  },
  reptilesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reptilesSubtitle: {
    opacity: 0.7,
  },
  linksCard: {
    marginTop: 12,
    gap: 10,
  },
  linksHeader: {
    gap: 4,
  },
  linksSubtitle: {
    opacity: 0.6,
  },
  linksList: {
    gap: 8,
  },
  linkItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  linkContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  linkText: {
    flex: 1,
    gap: 2,
  },
  linkMeta: {
    opacity: 0.65,
  },
});

export default Home;
