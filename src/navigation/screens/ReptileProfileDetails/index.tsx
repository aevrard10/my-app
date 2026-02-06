import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Platform,
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  FAB,
  Icon,
  Modal,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import useAddNotesMutation from "./hooks/data/mutations/useAddNotesMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@rn-flix/snackbar";
import useMeasurementsQuery from "./hooks/data/queries/useMeasurementsQuery";
import TextInfo from "./components/TextInfo";
import ReptilePicture from "./components/ReptilePicture";
import TextInput from "@shared/components/TextInput";
import useReptileQuery from "../Reptiles/hooks/queries/useReptileQuery";
import ScreenNames from "@shared/declarations/screenNames";
import useFoodQuery from "../Feed/hooks/data/queries/useStockQuery";
import useUpdateReptileMutation from "./hooks/data/mutations/useUpdateReptile";
import { Formik } from "formik";
import FeedPortal from "./components/FeedPortal";
import Charts from "./components/Charts";
import {
  formatDateToYYYYMMDD,
  formatLongDateToYYYYMMDD,
  formatDDMMYYYY,
  formatYYYYMMDD,
} from "@shared/utils/formatedDate";
import Screen from "@shared/components/Screen";
import CardSurface from "@shared/components/CardSurface";
import useReptilePhotosQuery from "./hooks/data/queries/useReptilePhotosQuery";
import useDeleteReptilePhotoMutation from "./hooks/data/mutations/useDeleteReptilePhotoMutation";
import handleImageUpload from "@shared/utils/handleImageUpload";
import * as ImagePicker from "expo-image-picker";
import useReptileGeneticsQuery from "./hooks/data/queries/useReptileGeneticsQuery";
import useUpsertReptileGeneticsMutation from "./hooks/data/mutations/useUpsertReptileGeneticsMutation";
import useReptileFeedingsQuery from "./hooks/data/queries/useReptileFeedingsQuery";
import useReptileShedsQuery from "./hooks/data/queries/useReptileShedsQuery";
import useAddReptileShedMutation from "./hooks/data/mutations/useAddReptileShedMutation";
import useDeleteReptileShedMutation from "./hooks/data/mutations/useDeleteReptileShedMutation";
import useDeleteReptileFeedingMutation from "./hooks/data/mutations/useDeleteReptileFeedingMutation";
import useLastFedUpdateMutation from "./hooks/data/mutations/useLastFedUpdate";
import { DatePickerInput } from "react-native-paper-dates";
import ReptileProfileSkeleton from "./components/ReptileProfileSkeleton";
import useGoveeDevicesQuery from "./hooks/data/queries/useGoveeDevicesQuery";
import useGoveeDeviceStateQuery from "./hooks/data/queries/useGoveeDeviceStateQuery";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useHealthAlertsQuery from "@shared/hooks/queries/useHealthAlertsQuery";
import AlertCard from "./components/AlertCard";
import QuickActions from "./components/QuickActions";
import GallerySection from "./components/GallerySection";
import HistorySection from "./components/HistorySection";
import GeneticsSection from "./components/GeneticsSection";
import * as Sharing from "expo-sharing";
import useQuery from "@shared/graphql/hooks/useQuery";
import { gql } from "graphql-request";
import * as FileSystem from "expo-file-system";

type Props = StaticScreenProps<{
  id: string;
}>;

const ReptileProfileDetails = ({ route }: Props) => {
  const id = route.params.id;
  const { colors } = useTheme();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { show } = useSnackbar();

  // States
  const [notes, setNotes] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showShedModal, setShowShedModal] = useState(false);
  const [shedDate, setShedDate] = useState<Date | undefined>(new Date());
  const [shedNotes, setShedNotes] = useState("");
  const [goveeApiKey, setGoveeApiKey] = useState("");
  const [selectedGoveeDevice, setSelectedGoveeDevice] = useState<{
    device: string;
    model: string;
    name?: string | null;
  } | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<{
    id: string;
    url: string;
    created_at: string;
  } | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [geneticsForm, setGeneticsForm] = useState({
    morph: "",
    mutations: "",
    hets: "",
    traits: "",
    lineage: "",
    breeder: "",
    hatch_date: "",
    sire_name: "",
    dam_name: "",
    notes: "",
  });

  // Queries
  const { data: food } = useFoodQuery();
  const { data, isPending: isLoadingReptile } = useReptileQuery(id);
  const { data: measurements, isPending } = useMeasurementsQuery(id);
  const {
    data: genetics,
    isPending: isGeneticsLoading,
    refetch: refetchGenetics,
  } = useReptileGeneticsQuery(id);
  const { data: feedings, refetch: refetchFeedings } =
    useReptileFeedingsQuery(id);
  const { data: sheds, refetch: refetchSheds } = useReptileShedsQuery(id);
  const {
    data: photos,
    isPending: isPhotosLoading,
    refetch: refetchPhotos,
  } = useReptilePhotosQuery(id);
  const { data: healthAlerts } = useHealthAlertsQuery();
  const {
    data: goveeDevices,
    isPending: isLoadingGoveeDevices,
    refetch: refetchGoveeDevices,
  } = useGoveeDevicesQuery(goveeApiKey || undefined);
  const {
    data: goveeReading,
    isPending: isLoadingGoveeReading,
    refetch: refetchGoveeReading,
  } = useGoveeDeviceStateQuery(
    goveeApiKey || undefined,
    selectedGoveeDevice?.device,
    selectedGoveeDevice?.model,
  );
  const exportPdfQuery = useQuery<{ exportReptile: { filename: string; mime: string; base64: string } }, { id: string; format: string }>({
    queryKey: ["exportReptile", id, "PDF"],
    query: gql`
      query ExportReptile($id: ID!, $format: ExportFormat!) {
        exportReptile(id: $id, format: $format) {
          filename
          mime
          base64
        }
      }
    `,
    variables: { id, format: "PDF" },
    options: {
      enabled: !!id,
      staleTime: 1000 * 60 * 5,
    },
  });

  // Mutations
  const { mutate } = useAddNotesMutation();
  const { mutate: updateReptile } = useUpdateReptileMutation();
  const { mutate: deletePhoto } = useDeleteReptilePhotoMutation();
  const { mutate: saveGenetics, isPending: isSavingGenetics } =
    useUpsertReptileGeneticsMutation();
  const { mutate: addShed, isPending: isAddingShed } =
    useAddReptileShedMutation();
  const { mutate: deleteShed } = useDeleteReptileShedMutation();
  const { mutate: deleteFeeding } = useDeleteReptileFeedingMutation();
  const { mutate: updateLastFed, isPending: isUpdatingFed } =
    useLastFedUpdateMutation();

  useEffect(() => {
    if (data?.notes !== undefined && data?.notes !== null) {
      setNotes(data.notes);
    }
  }, [data?.notes]);

  useEffect(() => {
    setGeneticsForm({
      morph: genetics?.morph ?? "",
      mutations: genetics?.mutations ?? "",
      hets: genetics?.hets ?? "",
      traits: genetics?.traits ?? "",
      lineage: genetics?.lineage ?? "",
      breeder: genetics?.breeder ?? "",
      hatch_date: genetics?.hatch_date ?? "",
      sire_name: genetics?.sire_name ?? "",
      dam_name: genetics?.dam_name ?? "",
      notes: genetics?.notes ?? "",
    });
  }, [genetics]);

  useEffect(() => {
    (async () => {
      const savedKey = await AsyncStorage.getItem("govee_api_key");
      if (savedKey) setGoveeApiKey(savedKey);
      const savedDevice = await AsyncStorage.getItem(
        `govee_device_${id ?? "default"}`,
      );
      if (savedDevice) {
        try {
          const parsed = JSON.parse(savedDevice);
          setSelectedGoveeDevice(parsed);
        } catch {
          // ignore
        }
      }
    })();
  }, [id]);

  const addGalleryPhoto = useCallback(async () => {
    try {
      setIsUploadingPhoto(true);
      if (Platform.OS === "web") {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async (event: any) => {
          const file = event.target.files[0];
          if (file) {
            await handleImageUpload(file, id, "gallery");
            refetchPhotos();
          }
          setIsUploadingPhoto(false);
        };
        input.click();
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        await handleImageUpload({ uri: result.assets[0].uri }, id, "gallery");
        refetchPhotos();
      }
    } catch (error) {
      show("Impossible d'ajouter la photo");
    } finally {
      setIsUploadingPhoto(false);
    }
  }, [id, refetchPhotos, show]);

  const confirmDeletePhoto = useCallback(
    (photoId: string) => {
      const onConfirm = () => {
        deletePhoto(
          { id: photoId },
          {
            onSuccess: () => {
              refetchPhotos();
              show("Photo supprimée");
            },
            onError: () => {
              show("Erreur lors de la suppression");
            },
          },
        );
      };

      if (Platform.OS === "web" && typeof window !== "undefined") {
        if (window.confirm("Supprimer cette photo ?")) {
          onConfirm();
        }
        return;
      }

      Alert.alert("Supprimer", "Supprimer cette photo ?", [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: onConfirm },
      ]);
    },
    [deletePhoto, refetchPhotos, show],
  );

  const handleDownloadSelectedPhoto = useCallback(() => {
    if (!selectedPhoto?.url) return;
    try {
      if (Platform.OS === "web" && typeof document !== "undefined") {
        const link = document.createElement("a");
        link.href = selectedPhoto.url;
        link.download = `reptile-${data?.name || "photo"}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        Linking.openURL(selectedPhoto.url);
      }
    } catch (error) {
      show("Impossible de télécharger l'image");
    }
  }, [selectedPhoto?.url, data?.name, show]);

  const handleSharePhoto = useCallback(
    async (photo: { url: string; created_at: string; id: string }) => {
      if (Platform.OS === "web") {
        // fallback web: ouvrir l'image (l'utilisateur peut télécharger)
        setSelectedPhoto(photo);
        setShowPhotoModal(true);
        return;
      }
      try {
        const canShare = await Sharing.isAvailableAsync();
        if (!canShare) {
          show("Partage non disponible sur cet appareil");
          return;
        }
        await Sharing.shareAsync(photo.url, {
          dialogTitle: `Partager ${data?.name || "reptile"}`,
          mimeType: "image/jpeg",
        });
      } catch (e) {
        show("Impossible de partager cette photo");
      }
    },
    [data?.name, show],
  );

  const handleSaveGoveeKey = useCallback(async () => {
    try {
      await AsyncStorage.setItem("govee_api_key", goveeApiKey.trim());
      show("Clé Govee enregistrée");
      refetchGoveeDevices();
    } catch {
      show("Impossible d'enregistrer la clé");
    }
  }, [goveeApiKey, refetchGoveeDevices, show]);

  const handleSelectGoveeDevice = useCallback(
    async (device: { device: string; model: string; deviceName?: string }) => {
      setSelectedGoveeDevice(device);
      await AsyncStorage.setItem(
        `govee_device_${id ?? "default"}`,
        JSON.stringify(device),
      );
      refetchGoveeReading();
    },
    [id, refetchGoveeReading],
  );

  const confirmDeleteFeeding = useCallback(
    (feedingId: string) => {
      const onConfirm = () => {
        deleteFeeding(
          { id: feedingId },
          {
            onSuccess: () => {
              refetchFeedings();
              show("Nourrissage supprimé");
            },
            onError: () => {
              show("Erreur lors de la suppression");
            },
          },
        );
      };

      if (Platform.OS === "web" && typeof window !== "undefined") {
        if (window.confirm("Supprimer ce nourrissage ?")) {
          onConfirm();
        }
        return;
      }

      Alert.alert("Supprimer", "Supprimer ce nourrissage ?", [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: onConfirm },
      ]);
    },
    [deleteFeeding, refetchFeedings, show],
  );

  const confirmDeleteShed = useCallback(
    (shedId: string) => {
      const onConfirm = () => {
        deleteShed(
          { id: shedId },
          {
            onSuccess: () => {
              refetchSheds();
              show("Mue supprimée");
            },
            onError: () => {
              show("Erreur lors de la suppression");
            },
          },
        );
      };

      if (Platform.OS === "web" && typeof window !== "undefined") {
        if (window.confirm("Supprimer cette mue ?")) {
          onConfirm();
        }
        return;
      }

      Alert.alert("Supprimer", "Supprimer cette mue ?", [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: onConfirm },
      ]);
    },
    [deleteShed, refetchSheds, show],
  );

  const trendData = useMemo(() => {
    if (!measurements || measurements.length < 2) return null;

    const parseMeasurementDate = (value: string) => {
      if (!value) return new Date(0);
      const parts = value.split("/");
      if (parts.length === 3) {
        const [day, month, year] = parts.map(Number);
        return new Date(year, month - 1, day);
      }
      return new Date(value);
    };

    const sorted = [...measurements].sort(
      (a, b) =>
        parseMeasurementDate(a.date).getTime() -
        parseMeasurementDate(b.date).getTime(),
    );

    const now = new Date();
    const recentThreshold = new Date();
    recentThreshold.setDate(now.getDate() - 30);
    const recent = sorted.filter(
      (m) => parseMeasurementDate(m.date) >= recentThreshold,
    );

    const base = recent.length >= 2 ? recent : sorted;
    if (base.length < 2) return null;

    const first = base[0];
    const last = base[base.length - 1];

    const weightDelta = last.weight - first.weight;
    const weightPercent =
      first.weight > 0 ? (weightDelta / first.weight) * 100 : 0;
    const sizeDelta = last.size - first.size;
    const sizePercent = first.size > 0 ? (sizeDelta / first.size) * 100 : 0;

    const weightAlert = weightPercent <= -10 || weightPercent >= 15;
    const sizeAlert = sizePercent <= -10 || sizePercent >= 15;

    return {
      weightDelta,
      weightPercent,
      sizeDelta,
      sizePercent,
      weightAlert,
      sizeAlert,
    };
  }, [measurements]);

  const latestMeasurement = useMemo(() => {
    if (!measurements || measurements.length === 0) return null;
    const parseMeasurementDate = (value: string) => {
      if (!value) return new Date(0);
      const parts = value.split("/");
      if (parts.length === 3) {
        const [day, month, year] = parts.map(Number);
        return new Date(year, month - 1, day);
      }
      return new Date(value);
    };
    const sorted = [...measurements].sort(
      (a, b) =>
        parseMeasurementDate(b.date).getTime() -
        parseMeasurementDate(a.date).getTime(),
    );
    return sorted[0];
  }, [measurements]);

  useEffect(() => {
    navigation.setOptions({ title: data?.name ?? "Détails du reptile" });
  }, [data?.name]);

  const currentAlerts = useMemo(
    () => healthAlerts?.find((a) => String(a.reptile_id) === String(id)),
    [healthAlerts, id],
  );

  const addNotes = useCallback(() => {
    mutate(
      { id, notes },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: useReptileQuery.queryKey(id),
          });
          show("Notes enregistrées");
        },
      },
    );
  }, [id, notes, mutate]);
  const handleUpdateReptile = (values: any) => {
    updateReptile(
      { id, input: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: useReptileQuery.queryKey(id),
          });
          show("Informations mises à jour");
        },
        onError: () => {
          show("Erreur lors de la mise à jour");
        },
      },
    );
  };
  const handleQuickFeed = useCallback(() => {
    if (!id) return;
    updateLastFed(
      { id, last_fed: formatYYYYMMDD(new Date()) },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: useReptileQuery.queryKey(id),
          });
          show("Dernier repas mis à jour");
        },
        onError: () => {
          show("Erreur lors de la mise à jour");
        },
      },
    );
  }, [id, updateLastFed, queryClient, show]);
  if (isLoadingReptile) {
    return (
      <Screen>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ReptileProfileSkeleton />
        </ScrollView>
      </Screen>
    );
  }

  return (
    <>
      <Formik
        initialValues={{
          name: data?.name || "",
          age: data?.age || 0,
          species: data?.species || "",
          acquired_date: formatLongDateToYYYYMMDD(data?.acquired_date || ""),
          origin: data?.origin || "",
          location: data?.location || "",
          last_fed: formatDateToYYYYMMDD(data?.last_fed || ""),
          feeding_schedule: data?.feeding_schedule || "",
          diet: data?.diet || "",
          health_status: data?.health_status || "",
          notes: data?.notes || "",
          sex: data?.sex || "",
          humidity_level: data?.humidity_level?.toString() || "",
          temperature_range: data?.temperature_range || "",
        }}
        enableReinitialize
        onSubmit={(values) => {
          handleUpdateReptile(values);
        }}
        // validationSchema={schema}
      >
        {(formik) => (
          <>
            <Screen>
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
              >
                <ReptilePicture data={data} />
                <AlertCard alerts={currentAlerts?.alerts} />

                <QuickActions
                  onAddFeed={() =>
                    navigation.navigate(ScreenNames.ADD_FEED as never)
                  }
                  onAddMeasure={() =>
                    navigation.navigate(ScreenNames.ADD_MEASUREMENTS as never, {
                      id,
                    })
                  }
                  onAddEvent={() =>
                    navigation.navigate(ScreenNames.AGENDA as never, {
                      openAddEvent: true,
                    })
                  }
                  onQuickFeed={handleQuickFeed}
                  loadingQuickFeed={isUpdatingFed}
                  onShare={() => {
                    if (photos?.[0]) {
                      handleSharePhoto(photos[0]);
                    } else {
                      show("Ajoutez une photo pour partager la fiche");
                    }
                  }}
                  onExportPdf={() => {
                    if (exportPdfQuery.data?.exportReptile) {
                      const { base64, filename, mime } =
                        exportPdfQuery.data.exportReptile;
                      if (Platform.OS === "web") {
                        const link = document.createElement("a");
                        link.href = `data:${mime};base64,${base64}`;
                        link.download = filename;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      } else {
                        const fileUri = `${FileSystem.cacheDirectory}${filename}`;
                        FileSystem.writeAsStringAsync(fileUri, base64, {
                          encoding: FileSystem.EncodingType.Base64,
                        })
                          .then(() => Sharing.shareAsync(fileUri))
                          .catch(() => show("Impossible de partager le PDF"));
                      }
                    } else {
                      exportPdfQuery.refetch();
                      show("Génération PDF... réessaie dans un instant");
                    }
                  }}
                />

                <FeedPortal id={id} food={food} data={data} />

                <CardSurface style={styles.reportCard}>
                  <Text variant="titleMedium">Rapport d&apos;élevage</Text>
                  <View style={styles.reportList}>
                    <Text variant="bodySmall">
                      Espèce : {data?.species || "—"}
                    </Text>
                    <Text variant="bodySmall">
                      Sexe : {data?.sex || "—"} · Âge : {data?.age ?? "—"} ans
                    </Text>
                    <Text variant="bodySmall">
                      Morph : {genetics?.morph || "—"}
                    </Text>
                    <Text variant="bodySmall">
                      Mutations : {genetics?.mutations || "—"}
                    </Text>
                    <Text variant="bodySmall">
                      Lignée : {genetics?.lineage || "—"}
                    </Text>
                    <Text variant="bodySmall">
                      Dernier repas :{" "}
                      {feedings?.[0]?.fed_at
                        ? formatDDMMYYYY(feedings[0].fed_at)
                        : "—"}
                    </Text>
                    <Text variant="bodySmall">
                      Dernière mue :{" "}
                      {sheds?.[0]?.shed_date
                        ? formatDDMMYYYY(sheds[0].shed_date)
                        : "—"}
                    </Text>
                    <Text variant="bodySmall">
                      Dernière mesure :{" "}
                      {latestMeasurement
                        ? `${latestMeasurement.weight} ${latestMeasurement.weight_mesure} · ${latestMeasurement.size} ${latestMeasurement.size_mesure}`
                        : "—"}
                    </Text>
                  </View>
                </CardSurface>
                <CardSurface style={styles.trendCard}>
                  <Text variant="titleMedium">Tendances</Text>
                  {trendData ? (
                    <View style={styles.trendRows}>
                      <View style={styles.trendRow}>
                        <Icon
                          source={
                            trendData.weightDelta >= 0
                              ? "trending-up"
                              : "trending-down"
                          }
                          size={20}
                          color={
                            trendData.weightAlert
                              ? colors.error
                              : colors.primary
                          }
                        />
                        <View style={styles.trendText}>
                          <Text variant="bodyMedium">
                            Poids {trendData.weightDelta >= 0 ? "+" : ""}
                            {trendData.weightDelta.toFixed(1)} (
                            {trendData.weightPercent.toFixed(1)}%)
                          </Text>
                          <Text variant="labelSmall" style={styles.trendMeta}>
                            30 derniers jours (ou historique complet)
                          </Text>
                        </View>
                      </View>
                      <View style={styles.trendRow}>
                        <Icon
                          source={
                            trendData.sizeDelta >= 0
                              ? "trending-up"
                              : "trending-down"
                          }
                          size={20}
                          color={
                            trendData.sizeAlert ? colors.error : colors.primary
                          }
                        />
                        <View style={styles.trendText}>
                          <Text variant="bodyMedium">
                            Taille {trendData.sizeDelta >= 0 ? "+" : ""}
                            {trendData.sizeDelta.toFixed(1)} (
                            {trendData.sizePercent.toFixed(1)}%)
                          </Text>
                          <Text variant="labelSmall" style={styles.trendMeta}>
                            30 derniers jours (ou historique complet)
                          </Text>
                        </View>
                      </View>
                      {(trendData.weightAlert || trendData.sizeAlert) && (
                        <Text variant="labelSmall" style={styles.trendAlert}>
                          Variation importante détectée. Vérifiez l&apos;état de
                          santé.
                        </Text>
                      )}
                    </View>
                  ) : (
                    <Text variant="bodySmall" style={styles.mutedText}>
                      Ajoutez au moins 2 mesures pour voir une tendance.
                    </Text>
                  )}
                </CardSurface>
                <GallerySection
                  photos={photos}
                  isLoading={isPhotosLoading}
                  isAdding={isUploadingPhoto}
                  onAdd={addGalleryPhoto}
                  onDelete={confirmDeletePhoto}
                  onOpen={(photo) => {
                    setSelectedPhoto(photo);
                    setShowPhotoModal(true);
                  }}
                  onShare={handleSharePhoto}
                />

                <HistorySection
                  feedings={feedings}
                  sheds={sheds}
                  onDeleteFeeding={confirmDeleteFeeding}
                  onDeleteShed={confirmDeleteShed}
                  onAddShed={() => setShowShedModal(true)}
                />

                <GeneticsSection
                  geneticsForm={geneticsForm}
                  setGeneticsForm={setGeneticsForm}
                  onSave={() =>
                    saveGenetics(
                      {
                        input: {
                          reptile_id: id,
                          ...geneticsForm,
                        },
                      },
                      {
                        onSuccess: () => {
                          refetchGenetics();
                          show("Génétique enregistrée");
                        },
                        onError: () => {
                          show("Erreur lors de l'enregistrement");
                        },
                      },
                    )
                  }
                  isSaving={isSavingGenetics}
                />

                <CardSurface style={styles.inputSection}>
                  <TextInfo
                    keyboardType="numeric"
                    title="Âge"
                    readOnly={false}
                    value={formik.values.age?.toString()}
                    onChangeText={(text) => {
                      const number = parseInt(text, 10);
                      formik.setFieldValue("age", isNaN(number) ? "" : number); // Ne pas permettre un non-nombre
                    }}
                  />
                  <TextInfo
                    readOnly={false}
                    title="Espèce"
                    value={formik.values?.species || ""}
                    onChangeText={(text) => {
                      formik.setFieldValue("species", text);
                    }}
                  />

                  <TextInfo
                    readOnly={false}
                    title="Date d'acquisition"
                    value={formik.values?.acquired_date || ""}
                  />
                  <TextInfo
                    readOnly={false}
                    title="Origine"
                    value={formik.values?.origin || ""}
                    noDivider
                  />
                </CardSurface>
                <CardSurface style={styles.inputSection}>
                  <TextInfo
                    readOnly={false}
                    title="Emplacement"
                    value={formik.values?.location || ""}
                    noDivider
                    onChangeText={(text) => {
                      formik.setFieldValue("location", text);
                    }}
                  />
                  <TextInfo
                    readOnly={false}
                    title="Humidité"
                    value={formik.values?.humidity_level || ""}
                    noDivider
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      const number = parseInt(text, 10);
                      formik.setFieldValue(
                        "humidity_level",
                        isNaN(number) ? "" : number,
                      ); // Ne pas permettre un non-nombre
                    }}
                  />
                  <TextInfo
                    readOnly={false}
                    title="Température"
                    value={formik.values?.temperature_range || ""}
                    noDivider
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      formik.setFieldValue("temperature_range", text);
                    }}
                  />
                </CardSurface>
                <CardSurface style={styles.inputSection}>
                  <TextInfo
                    readOnly={false}
                    title="Dernier repas"
                    value={formik.values?.last_fed || ""}
                  />
                  <TextInfo
                    readOnly={false}
                    value={formik.values?.diet || ""}
                    title="Régime alimentaire"
                    noDivider
                    onChangeText={(text) => {
                      formik.setFieldValue("diet", text);
                    }}
                  />
                </CardSurface>

                <CardSurface style={styles.inputSection}>
                  <TextInfo
                    readOnly={false}
                    value={formik.values?.health_status || ""}
                    title="État de santé"
                    onChangeText={(text) => {
                      formik.setFieldValue("health_status", text);
                    }}
                  />
                </CardSurface>
                <View style={styles.actionBlock}>
                  <Button mode="contained" onPress={formik.submitForm}>
                    Modifier les informations
                  </Button>
                </View>
                <CardSurface style={styles.notesCard}>
                  <TextInput
                    multiline
                    style={styles.input}
                    value={notes}
                    onChange={(e) => setNotes(e.nativeEvent.text)}
                    placeholder="Informations"
                  />

                  <View style={{ marginTop: 10 }}>
                    <Button mode="contained" onPress={addNotes}>
                      Enregistrer les notes
                    </Button>
                  </View>
                </CardSurface>

                <CardSurface style={styles.sensorCard}>
                  <View style={styles.sensorHeader}>
                    <Text variant="titleMedium">Capteur Govee</Text>
                    <Button
                      mode="text"
                      compact
                      onPress={refetchGoveeReading}
                      disabled={!selectedGoveeDevice || isLoadingGoveeReading}
                      loading={isLoadingGoveeReading}
                    >
                      Actualiser
                    </Button>
                  </View>
                  <TextInput
                    placeholder="Clé API Govee"
                    value={goveeApiKey}
                    onChangeText={setGoveeApiKey}
                    secureTextEntry
                  />
                  <View style={styles.sensorActions}>
                    <Button mode="outlined" onPress={handleSaveGoveeKey}>
                      Enregistrer la clé
                    </Button>
                    <Button
                      mode="contained"
                      onPress={refetchGoveeDevices}
                      loading={isLoadingGoveeDevices}
                      disabled={!goveeApiKey}
                    >
                      Lister mes capteurs
                    </Button>
                  </View>
                  {goveeDevices && goveeDevices.length > 0 ? (
                    <View style={styles.devicesList}>
                      {goveeDevices.map((dev) => {
                        const isSelected =
                          selectedGoveeDevice?.device === dev.device &&
                          selectedGoveeDevice?.model === dev.model;
                        return (
                          <Button
                            key={`${dev.device}-${dev.model}`}
                            mode={isSelected ? "contained" : "outlined"}
                            onPress={() => handleSelectGoveeDevice(dev)}
                            style={styles.deviceButton}
                            compact
                          >
                            {dev.deviceName || dev.model}
                          </Button>
                        );
                      })}
                    </View>
                  ) : null}
                  {selectedGoveeDevice ? (
                    <View style={styles.readingRow}>
                      <View style={{ flex: 1 }}>
                        <Text variant="labelLarge">Dernière lecture</Text>
                        {goveeReading ? (
                          <>
                            <Text variant="titleMedium">
                              {goveeReading.temperature ?? "—"} °C ·{" "}
                              {goveeReading.humidity ?? "—"} %
                            </Text>
                            <Text
                              variant="labelSmall"
                              style={styles.readingMeta}
                            >
                              Batterie :{" "}
                              {goveeReading.battery !== null &&
                              goveeReading.battery !== undefined
                                ? `${goveeReading.battery}%`
                                : "—"}{" "}
                              · {formatDDMMYYYY(goveeReading.retrieved_at)}
                            </Text>
                          </>
                        ) : (
                          <Text variant="bodySmall" style={styles.readingMeta}>
                            Aucune donnée. Lance “Actualiser”.
                          </Text>
                        )}
                      </View>
                    </View>
                  ) : (
                    <Text variant="bodySmall" style={styles.readingMeta}>
                      Sélectionnez un capteur pour voir les mesures.
                    </Text>
                  )}
                </CardSurface>
                <Charts
                  data={data}
                  measurements={measurements}
                  isPending={isPending}
                />
              </ScrollView>
              <FAB
                style={{
                  position: "absolute",
                  margin: 16,
                  right: 0,
                  bottom: 0,
                }}
                theme={{ colors: { primaryContainer: colors.primary } }}
                variant="primary"
                color="#fff"
                icon="weight-kilogram"
                onPress={() =>
                  navigation.navigate(ScreenNames.ADD_MEASUREMENTS, { id })
                }
              />
            </Screen>
            <Portal>
              <Modal
                visible={showPhotoModal}
                onDismiss={() => setShowPhotoModal(false)}
                contentContainerStyle={[
                  styles.photoModalContainer,
                  { backgroundColor: colors.surface },
                ]}
              >
                <View style={styles.photoModalHeader}>
                  <Text variant="titleMedium">
                    Photo
                    {selectedPhoto?.created_at
                      ? ` · ${formatDDMMYYYY(selectedPhoto.created_at)}`
                      : ""}
                  </Text>
                  <View style={styles.photoModalActions}>
                    <Button mode="text" onPress={handleDownloadSelectedPhoto}>
                      Télécharger
                    </Button>
                    <Button
                      mode="text"
                      onPress={() => setShowPhotoModal(false)}
                    >
                      Fermer
                    </Button>
                  </View>
                </View>
                {selectedPhoto?.url ? (
                  <Image
                    source={{ uri: selectedPhoto.url }}
                    style={styles.photoModalImage}
                    resizeMode="contain"
                  />
                ) : null}
              </Modal>
              <Modal
                visible={showShedModal}
                onDismiss={() => setShowShedModal(false)}
                contentContainerStyle={styles.modalContainer}
              >
                <Text variant="titleMedium">Ajouter une mue</Text>
                <DatePickerInput
                  mode="outlined"
                  locale="fr"
                  label="Date de mue"
                  value={shedDate}
                  onChange={(date) => setShedDate(date)}
                  inputMode="start"
                  style={styles.pickerInput}
                  outlineStyle={styles.outlineStyle}
                />
                <TextInput
                  placeholder="Notes"
                  value={shedNotes}
                  onChangeText={setShedNotes}
                  multiline
                />
                <View style={styles.modalActions}>
                  <Button mode="text" onPress={() => setShowShedModal(false)}>
                    Annuler
                  </Button>
                  <Button
                    mode="contained"
                    loading={isAddingShed}
                    onPress={() => {
                      if (!shedDate) {
                        show("Veuillez choisir une date");
                        return;
                      }
                      addShed(
                        {
                          input: {
                            reptile_id: id,
                            shed_date: formatYYYYMMDD(shedDate),
                            notes: shedNotes,
                          },
                        },
                        {
                          onSuccess: () => {
                            refetchSheds();
                            setShowShedModal(false);
                            setShedNotes("");
                            show("Mue ajoutée");
                          },
                          onError: () => {
                            show("Erreur lors de l'ajout");
                          },
                        },
                      );
                    }}
                  >
                    Enregistrer
                  </Button>
                </View>
              </Modal>
            </Portal>
          </>
        )}
      </Formik>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 140,
  },
  input: {
    padding: 10,
    outlineStyle: "none",
    borderRadius: 30,
    borderColor: "transparent",
    backgroundColor: "transparent",
  },
  inputSection: {
    marginVertical: 8,
  },
  outlineStyle: {
    borderWidth: 0,
  },
  pickerInput: {
    borderWidth: 0,
    borderColor: "transparent",
    backgroundColor: "transparent",
    borderTopColor: "transparent",
  },
  reportCard: {
    marginVertical: 8,
    gap: 8,
  },
  reportList: {
    gap: 4,
  },
  trendCard: {
    marginVertical: 8,
    gap: 10,
  },
  trendRows: {
    gap: 12,
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  trendText: {
    flex: 1,
  },
  trendMeta: {
    opacity: 0.6,
    marginTop: 2,
  },
  trendAlert: {
    marginTop: 6,
    color: "#C33C3C",
  },
  mutedText: {
    opacity: 0.6,
  },
  photoModalContainer: {
    marginHorizontal: 12,
    padding: 14,
    borderRadius: 22,
    maxHeight: Dimensions.get("window").height * 0.9,
    width: "92%",
    alignSelf: "center",
  },
  photoModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    flexWrap: "wrap",
    gap: 8,
  },
  photoModalActions: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  photoModalImage: {
    width: "100%",
    height: Math.min(420, Dimensions.get("window").height * 0.55),
    borderRadius: 18,
    backgroundColor: "#00000012",
  },
  modalContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    gap: 12,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionBlock: {
    marginHorizontal: 12,
    marginTop: 8,
  },
  notesCard: {
    marginVertical: 12,
  },
  sensorCard: {
    marginVertical: 8,
    gap: 10,
  },
  sensorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sensorActions: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  devicesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  deviceButton: {
    borderRadius: 999,
  },
  readingRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  readingMeta: {
    opacity: 0.6,
    marginTop: 4,
  },
});

export default ReptileProfileDetails;
