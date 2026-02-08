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
  List,
} from "react-native-paper";
import useAddNotesMutation from "./hooks/data/mutations/useAddNotesMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@rn-flix/snackbar";
import useMeasurementsQuery from "./hooks/data/queries/useMeasurementsQuery";
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
import * as ImagePicker from "expo-image-picker";
import useReptileGeneticsQuery from "./hooks/data/queries/useReptileGeneticsQuery";
import useUpsertReptileGeneticsMutation from "./hooks/data/mutations/useUpsertReptileGeneticsMutation";
import useReptileFeedingsQuery from "./hooks/data/queries/useReptileFeedingsQuery";
import useReptileShedsQuery from "./hooks/data/queries/useReptileShedsQuery";
import useAddReptileShedMutation from "./hooks/data/mutations/useAddReptileShedMutation";
import useDeleteReptileShedMutation from "./hooks/data/mutations/useDeleteReptileShedMutation";
import useDeleteReptileFeedingMutation from "./hooks/data/mutations/useDeleteReptileFeedingMutation";
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
import QrCodeSection from "./components/QrCodeSection";
import * as Sharing from "expo-sharing";
import { useI18n } from "@shared/i18n";
import * as FileSystem from "expo-file-system/legacy";
import InfoAccordion from "./components/InfoAccordion";
import useReptileHealthEventsQuery from "./hooks/data/queries/useReptileHealthEventsQuery";
import {
  addReptilePhotoFromBase64,
  addReptilePhotoFromUri,
} from "@shared/local/reptilePhotosStore";

type Props = StaticScreenProps<{
  id: string;
}>;

const ReptileProfileDetails = ({ route }: Props) => {
  const id = route.params.id;
  const { colors } = useTheme();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { show } = useSnackbar();
  const { t, locale } = useI18n();

  // States
  const [notes, setNotes] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showShedModal, setShowShedModal] = useState(false);
  const [shedDate, setShedDate] = useState<Date | undefined>(new Date());
  const [shedNotes, setShedNotes] = useState("");
  const [goveeApiKey, setGoveeApiKey] = useState("");
  const [showFeedPortal, setShowFeedPortal] = useState(false);
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
  const profileSummary = useMemo(() => {
    const species = data?.species || "?";
    const birthDate = data?.birth_date ? formatDDMMYYYY(data.birth_date) : "?";
    const temp = data?.temperature_range || "?";
    return `${species} · ${birthDate} · ${temp}`;
  }, [data?.species, data?.birth_date, data?.temperature_range]);

  const foodSummary = useMemo(() => {
    const last = data?.last_fed ? formatDDMMYYYY(data.last_fed) : "?";
    const diet = data?.diet || "?";
    return `${t("profile.food_summary_last")}: ${last} · ${t(
      "profile.food_summary_diet",
    )}: ${diet}`;
  }, [data?.last_fed, data?.diet, t]);

  const latestHealthEvent = useMemo(
    () => (healthEvents && healthEvents.length > 0 ? healthEvents[0] : null),
    [healthEvents],
  );

  const healthEventLabel = useMemo(() => {
    if (!latestHealthEvent) return t("health.empty");
    const value = latestHealthEvent.event_type;
    if (value && !value.includes(" ")) {
      const type = value.toUpperCase();
      if (type === "ACARIEN") return t("health.type_acarien");
      if (type === "REGURGITATION") return t("health.type_regurgitation");
      if (type === "REFUS") return t("health.type_refus");
      if (type === "UNDERWEIGHT") return t("health.type_underweight");
      if (type === "OBESITY") return t("health.type_obesity");
      if (type === "SHED_ISSUE") return t("health.type_shed_issue");
      if (type === "DIGESTIVE") return t("health.type_digestive");
      if (type === "HIBERNATION") return t("health.type_hibernation");
      if (type === "MEDICATION") return t("health.type_medication");
      if (type === "OVULATION") return t("health.type_ovulation");
      if (type === "INJURY") return t("health.type_injury");
      if (type === "ABSCESS") return t("health.type_abscess");
      if (type === "OTHER") return t("health.type_other");
    }
    return value?.trim() || t("health.type_other");
  }, [latestHealthEvent, t]);

  // Queries
  const { data: food } = useFoodQuery();
  const { data, isPending: isLoadingReptile } = useReptileQuery(id);
  const [feedingsLimit, setFeedingsLimit] = useState(10);
  const [shedsLimit, setShedsLimit] = useState(10);
  const [measurementsLimit, setMeasurementsLimit] = useState(50);
  const {
    data: genetics,
    isPending: isGeneticsLoading,
    refetch: refetchGenetics,
  } = useReptileGeneticsQuery(id);
  const { data: feedings, refetch: refetchFeedings } = useReptileFeedingsQuery(
    id,
    feedingsLimit + 1,
  );
  const { data: sheds, refetch: refetchSheds } = useReptileShedsQuery(
    id,
    shedsLimit + 1,
  );
  const { data: measurements, isPending } = useMeasurementsQuery(
    id,
    measurementsLimit + 1,
  );
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
  const { data: healthEvents } = useReptileHealthEventsQuery(id, 1);
  const exportPdfQuery = null;

  const handleExportPdf = useCallback(async () => {
    if (Platform.OS === "web") {
      show(t("profile.export_web_only"));
      return;
    }

    if (!data) {
      show(t("profile.export_no_data"));
      return;
    }

    try {
      const { printToFileAsync } = await import("expo-print");

      const photo = data.image_url
        ? `<img src="${data.image_url}" style="width:180px;height:180px;border-radius:12px;object-fit:cover;margin-bottom:12px;" />`
        : "";

      const geneticsBlock = genetics
        ? `<p><strong>${t("genetics.title")} :</strong> ${genetics.morph ?? "—"} | ${
            genetics.mutations ?? ""
          } ${genetics.lineage ? " · " + genetics.lineage : ""}</p>`
        : "";

      const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body { font-family: -apple-system, Roboto, sans-serif; padding: 18px; color: #1c1c1c; }
            .card { border: 1px solid #e6e6e6; border-radius: 14px; padding: 16px; margin-bottom: 14px; }
            h1 { margin: 0 0 6px 0; }
            h2 { margin: 12px 0 8px 0; font-size: 16px; }
            p { margin: 4px 0; }
            .row { display: flex; gap: 12px; flex-wrap: wrap; }
            .pill { padding: 6px 10px; border-radius: 12px; background: #f2f5f4; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>${data.name || t("profile.report_reptile")}</h1>
            <div class="row">
              <div>${photo}</div>
              <div>
                <p><strong>${t("profile.report_species")} :</strong> ${data.species || "—"}</p>
                <p><strong>${t("profile.report_sex")} :</strong> ${data.sex || "—"}</p>
                <p><strong>${t("profile.field_danger")} :</strong> ${data.danger_level || "—"}</p>
                <p><strong>${t("profile.report_age")} :</strong> ${
                  data.birth_date ? formatDDMMYYYY(data.birth_date) : "—"
                }</p>
                <p><strong>${t("profile.report_location")} :</strong> ${data.location || "—"}</p>
                <p><strong>${t("profile.report_acquired")} :</strong> ${
                  data.acquired_date ? formatDDMMYYYY(data.acquired_date) : "—"
                }</p>
              </div>
            </div>
            ${geneticsBlock}
          </div>

          <div class="card">
            <h2>${t("profile.report_recent")}</h2>
            <p><strong>${t("profile.report_last_meal")} :</strong> ${
              feedings?.[0]?.fed_at ? formatDDMMYYYY(feedings[0].fed_at) : "—"
            }</p>
            <p><strong>${t("profile.report_last_shed")} :</strong> ${
              sheds?.[0]?.shed_date ? formatDDMMYYYY(sheds[0].shed_date) : "—"
            }</p>
            <p><strong>${t("profile.report_last_measure")} :</strong> ${
              latestMeasurement
                ? `${latestMeasurement.weight} ${latestMeasurement.weight_mesure} · ${latestMeasurement.size} ${latestMeasurement.size_mesure}`
                : "—"
            }</p>
            <p><strong>${t("profile.report_temp_humidity")} :</strong> ${
              data.temperature_range || "—"
            } | ${data.humidity_level ?? "—"}%</p>
          </div>

          <div class="card">
            <h2>${t("profile.report_notes")}</h2>
            <p>${(data.notes || t("profile.report_no_notes")).replace(/\n/g, "<br/>")}</p>
          </div>
        </body>
      </html>`;

      const pdf = await printToFileAsync({ html, base64: false });

      const available = await Sharing.isAvailableAsync();
      if (!available) {
        show(t("profile.export_no_share"));
        return;
      }

      await Sharing.shareAsync(pdf.uri, {
        UTI: "com.adobe.pdf",
        mimeType: "application/pdf",
      });
    } catch (err: any) {
      if (err?.message?.includes("expo-print")) {
        show(t("profile.export_missing_print"));
        return;
      }
      console.error(err);
      show(t("profile.export_failed"));
    }
  }, [data, genetics, feedings, sheds, latestMeasurement, show, t]);

  // Mutations
  const { mutate } = useAddNotesMutation();
  const { mutate: updateReptile } = useUpdateReptileMutation();
  const { mutate: deletePhoto } = useDeleteReptilePhotoMutation(id);
  const { mutate: saveGenetics, isPending: isSavingGenetics } =
    useUpsertReptileGeneticsMutation();
  const { mutate: addShed, isPending: isAddingShed } =
    useAddReptileShedMutation();
  const { mutate: deleteShed } = useDeleteReptileShedMutation(id);
  const { mutate: deleteFeeding } = useDeleteReptileFeedingMutation(id);
  const feedingsDisplay = feedings?.slice(0, feedingsLimit) ?? [];
  const hasMoreFeedings = (feedings?.length ?? 0) > feedingsLimit;
  const shedsDisplay = sheds?.slice(0, shedsLimit) ?? [];
  const hasMoreSheds = (sheds?.length ?? 0) > shedsLimit;

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
          const file = event.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = async () => {
              const result = reader.result as string;
              const base64 = result.includes(",")
                ? result.split(",")[1]
                : result;
              await addReptilePhotoFromBase64(id, base64);
              refetchPhotos();
              setIsUploadingPhoto(false);
            };
            reader.readAsDataURL(file);
          } else {
            setIsUploadingPhoto(false);
          }
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
        await addReptilePhotoFromUri(id, result.assets[0].uri);
        refetchPhotos();
      }
    } catch (error) {
      show(t("profile.photo_add_error"));
    } finally {
      setIsUploadingPhoto(false);
    }
  }, [id, refetchPhotos, show, t]);

  const confirmDeletePhoto = useCallback(
    (photoId: string) => {
      const confirmMessage = t("profile.photo_delete_confirm");
      const confirmTitle = t("common.delete");
      const cancelLabel = t("common.cancel");
      const deleteLabel = t("common.delete");
      const onConfirm = () => {
        deletePhoto(
          { id: photoId },
          {
            onSuccess: () => {
              refetchPhotos();
              show(t("profile.photo_delete_success"));
            },
            onError: () => {
              show(t("profile.photo_delete_error"));
            },
          },
        );
      };

      if (Platform.OS === "web" && typeof window !== "undefined") {
        if (window.confirm(confirmMessage)) {
          onConfirm();
        }
        return;
      }

      Alert.alert(confirmTitle, confirmMessage, [
        { text: cancelLabel, style: "cancel" },
        { text: deleteLabel, style: "destructive", onPress: onConfirm },
      ]);
    },
    [deletePhoto, refetchPhotos, show, t],
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
      show(t("profile.photo_download_error"));
    }
  }, [selectedPhoto?.url, data?.name, show, t]);

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
          show(t("profile.photo_share_unavailable"));
          return;
        }
        await Sharing.shareAsync(photo.url, {
          dialogTitle: t("profile.photo_share_title", {
            name: data?.name || t("profile.report_reptile"),
          }),
          mimeType: "image/jpeg",
        });
      } catch (e) {
        show(t("profile.photo_share_error"));
      }
    },
    [data?.name, show, t],
  );

  const handleSaveGoveeKey = useCallback(async () => {
    try {
      await AsyncStorage.setItem("govee_api_key", goveeApiKey.trim());
      show(t("profile.govee_key_saved"));
      refetchGoveeDevices();
    } catch {
      show(t("profile.govee_key_error"));
    }
  }, [goveeApiKey, refetchGoveeDevices, show, t]);

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
      const confirmMessage = t("profile.feeding_delete_confirm");
      const confirmTitle = t("common.delete");
      const cancelLabel = t("common.cancel");
      const deleteLabel = t("common.delete");
      const onConfirm = () => {
        deleteFeeding(
          { id: feedingId },
          {
            onSuccess: () => {
              refetchFeedings();
              show(t("profile.feeding_delete_success"));
            },
            onError: () => {
              show(t("profile.feeding_delete_error"));
            },
          },
        );
      };

      if (Platform.OS === "web" && typeof window !== "undefined") {
        if (window.confirm(confirmMessage)) {
          onConfirm();
        }
        return;
      }

      Alert.alert(confirmTitle, confirmMessage, [
        { text: cancelLabel, style: "cancel" },
        { text: deleteLabel, style: "destructive", onPress: onConfirm },
      ]);
    },
    [deleteFeeding, refetchFeedings, show, t],
  );

  const confirmDeleteShed = useCallback(
    (shedId: string) => {
      const confirmMessage = t("profile.shed_delete_confirm");
      const confirmTitle = t("common.delete");
      const cancelLabel = t("common.cancel");
      const deleteLabel = t("common.delete");
      const onConfirm = () => {
        deleteShed(
          { id: shedId },
          {
            onSuccess: () => {
              refetchSheds();
              show(t("profile.shed_delete_success"));
            },
            onError: () => {
              show(t("profile.shed_delete_error"));
            },
          },
        );
      };

      if (Platform.OS === "web" && typeof window !== "undefined") {
        if (window.confirm(confirmMessage)) {
          onConfirm();
        }
        return;
      }

      Alert.alert(confirmTitle, confirmMessage, [
        { text: cancelLabel, style: "cancel" },
        { text: deleteLabel, style: "destructive", onPress: onConfirm },
      ]);
    },
    [deleteShed, refetchSheds, show, t],
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
    navigation.setOptions({
      title: data?.name ?? t("nav.reptile_details"),
    });
  }, [data?.name, navigation, t]);

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
          show(t("profile.notes_saved"));
        },
      },
    );
  }, [id, notes, mutate, queryClient, show, t]);
  const handleUpdateReptile = (values: any) => {
    updateReptile(
      { id, input: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: useReptileQuery.queryKey(id),
          });
          show(t("profile.info_updated"));
        },
        onError: () => {
          show(t("profile.update_error"));
        },
      },
    );
  };

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
          birth_date: formatLongDateToYYYYMMDD(data?.birth_date || ""),
          species: data?.species || "",
          acquired_date: formatLongDateToYYYYMMDD(data?.acquired_date || ""),
          origin: data?.origin || "",
          location: data?.location || "",
          last_fed: formatDateToYYYYMMDD(data?.last_fed || ""),
          diet: data?.diet || "",
          danger_level: data?.danger_level || "",
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
                  onAddFeed={() => setShowFeedPortal(true)}
                  onAddMeasure={() =>
                    navigation.navigate(ScreenNames.ADD_MEASUREMENTS as never, {
                      id,
                    })
                  }
                  onAddEvent={() =>
                    navigation.navigate(ScreenNames.ADD_EVENT as never)
                  }
                  onExportPdf={handleExportPdf}
                />

                <FeedPortal
                  id={id}
                  food={food}
                  data={data}
                  visible={showFeedPortal}
                  onClose={() => setShowFeedPortal(false)}
                />

                <CardSurface style={styles.reportCard}>
                  <Text variant="titleMedium">{t("profile.report_title")}</Text>
                  <View style={styles.reportList}>
                    <Text variant="bodySmall">
                      {t("profile.report_species")} :{" "}
                      {data?.species || t("common.not_available")}
                    </Text>
                    <Text variant="bodySmall">
                      {t("profile.report_sex")} :{" "}
                      {data?.sex || t("common.not_available")} ·{" "}
                      {t("profile.report_age")} :{" "}
                      {data?.birth_date
                        ? formatDDMMYYYY(data.birth_date)
                        : t("common.not_available")}
                    </Text>
                    <Text variant="bodySmall">
                      {t("profile.report_morph")} :{" "}
                      {genetics?.morph || t("common.not_available")}
                    </Text>
                    <Text variant="bodySmall">
                      {t("profile.report_mutations")} :{" "}
                      {genetics?.mutations || t("common.not_available")}
                    </Text>
                    <Text variant="bodySmall">
                      {t("profile.report_lineage")} :{" "}
                      {genetics?.lineage || t("common.not_available")}
                    </Text>
                    <Text variant="bodySmall">
                      {t("profile.report_last_feed")} :{" "}
                      {feedings?.[0]?.fed_at
                        ? formatDDMMYYYY(feedings[0].fed_at)
                        : t("common.not_available")}
                    </Text>
                    <Text variant="bodySmall">
                      {t("profile.report_last_shed")} :{" "}
                      {sheds?.[0]?.shed_date
                        ? formatDDMMYYYY(sheds[0].shed_date)
                        : t("common.not_available")}
                    </Text>
                    <Text variant="bodySmall">
                      {t("profile.report_last_measure")} :{" "}
                      {latestMeasurement
                        ? `${latestMeasurement.weight} ${latestMeasurement.weight_mesure} · ${latestMeasurement.size} ${latestMeasurement.size_mesure}`
                        : t("common.not_available")}
                    </Text>
                  </View>
                </CardSurface>
                <CardSurface style={styles.trendCard}>
                  <Text variant="titleMedium">{t("profile.trends_title")}</Text>
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
                            {t("profile.trends_weight")}{" "}
                            {trendData.weightDelta >= 0 ? "+" : ""}
                            {trendData.weightDelta.toFixed(1)} (
                            {trendData.weightPercent.toFixed(1)}%)
                          </Text>
                          <Text variant="labelSmall" style={styles.trendMeta}>
                            {t("profile.trends_period")}
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
                            {t("profile.trends_size")}{" "}
                            {trendData.sizeDelta >= 0 ? "+" : ""}
                            {trendData.sizeDelta.toFixed(1)} (
                            {trendData.sizePercent.toFixed(1)}%)
                          </Text>
                          <Text variant="labelSmall" style={styles.trendMeta}>
                            {t("profile.trends_period")}
                          </Text>
                        </View>
                      </View>
                      {(trendData.weightAlert || trendData.sizeAlert) && (
                        <Text variant="labelSmall" style={styles.trendAlert}>
                          {t("profile.trends_alert")}
                        </Text>
                      )}
                    </View>
                  ) : (
                    <Text variant="bodySmall" style={styles.mutedText}>
                      {t("profile.trends_empty")}
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
                  feedings={feedingsDisplay}
                  sheds={shedsDisplay}
                  onDeleteFeeding={confirmDeleteFeeding}
                  onDeleteShed={confirmDeleteShed}
                  onAddShed={() => setShowShedModal(true)}
                  hasMoreFeedings={hasMoreFeedings}
                  hasMoreSheds={hasMoreSheds}
                  onLoadMoreFeedings={() => setFeedingsLimit((l) => l + 10)}
                  onLoadMoreSheds={() => setShedsLimit((l) => l + 10)}
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
                          show(t("profile.genetics_saved"));
                        },
                        onError: () => {
                          show(t("profile.genetics_error"));
                        },
                      },
                    )
                  }
                  isSaving={isSavingGenetics}
                />

                <List.Section style={{ marginTop: 12 }}>
                  <InfoAccordion
                    title={t("profile.section_profile")}
                    icon="home"
                    fields={[
                      {
                        key: "birth_date",
                        label: t("profile.field_age"),
                        render: () => (
                          <DatePickerInput
                            mode="outlined"
                            style={[
                              styles.pickerInput,
                              { backgroundColor: colors.surface },
                            ]}
                            dense
                            outlineStyle={[
                              styles.outlineStyle,
                              {
                                borderColor:
                                  colors.outlineVariant ?? colors.outline,
                              },
                            ]}
                            locale={locale}
                            label={t("profile.field_age")}
                            saveLabel={t("common.confirm")}
                            withDateFormatInLabel={false}
                            contentStyle={styles.dateContent}
                            value={
                              formik.values.birth_date
                                ? new Date(formik.values.birth_date)
                                : undefined
                            }
                            onChange={(date) => {
                              formik.setFieldValue(
                                "birth_date",
                                date ? formatYYYYMMDD(date) : "",
                              );
                            }}
                            inputMode="start"
                          />
                        ),
                      },
                      {
                        key: "species",
                        label: t("profile.field_species"),
                        value: formik.values.species,
                        onChangeText: (text) =>
                          formik.setFieldValue("species", text),
                      },
                      {
                        key: "danger_level",
                        label: t("profile.field_danger"),
                        value: formik.values.danger_level,
                        onChangeText: (text) =>
                          formik.setFieldValue("danger_level", text),
                      },
                      {
                        key: "acquired_date",
                        label: t("profile.field_acquired"),
                        value: formik.values.acquired_date,
                        onChangeText: (text) =>
                          formik.setFieldValue("acquired_date", text),
                      },
                      {
                        key: "origin",
                        label: t("profile.field_origin"),
                        value: formik.values.origin,
                        onChangeText: (text) =>
                          formik.setFieldValue("origin", text),
                      },
                      {
                        key: "location",
                        label: t("profile.field_location"),
                        value: formik.values.location,
                        onChangeText: (text) =>
                          formik.setFieldValue("location", text),
                      },
                      {
                        key: "humidity",
                        label: t("profile.field_humidity"),
                        value: formik.values.humidity_level,
                        keyboardType: "numeric",
                        onChangeText: (text) => {
                          const number = parseInt(text, 10);
                          formik.setFieldValue(
                            "humidity_level",
                            Number.isNaN(number) ? "" : number,
                          );
                        },
                      },
                      {
                        key: "temperature",
                        label: t("profile.field_temperature"),
                        value: formik.values.temperature_range,
                        keyboardType: "numeric",
                        onChangeText: (text) =>
                          formik.setFieldValue("temperature_range", text),
                      },
                    ]}
                  />

                  <InfoAccordion
                    title={t("profile.section_feeding")}
                    icon="food"
                    fields={[
                      {
                        key: "last_fed",
                        label: t("profile.field_last_fed"),
                        value: formik.values.last_fed,
                        onChangeText: (text) =>
                          formik.setFieldValue("last_fed", text),
                      },
                      {
                        key: "diet",
                        label: t("profile.field_diet"),
                        value: formik.values.diet,
                        onChangeText: (text) =>
                          formik.setFieldValue("diet", text),
                      },
                    ]}
                  />

                  <List.Accordion
                    title={t("health.section_title")}
                    left={(props) => (
                      <List.Icon {...props} icon="heart-pulse" />
                    )}
                  >
                    <View style={styles.healthAccordionContent}>
                      <Text variant="bodyMedium">{healthEventLabel}</Text>
                      <Text variant="labelSmall" style={styles.mutedText}>
                        {latestHealthEvent?.event_date
                          ? formatDDMMYYYY(latestHealthEvent.event_date)
                          : t("common.not_available")}
                        {latestHealthEvent?.event_time
                          ? ` · ${latestHealthEvent.event_time}`
                          : ""}
                      </Text>
                      <Button
                        mode="outlined"
                        style={styles.healthHistoryButton}
                        onPress={() =>
                          navigation.navigate(
                            ScreenNames.HEALTH_HISTORY as never,
                            { id } as never,
                          )
                        }
                      >
                        {t("health.view_history")}
                      </Button>
                    </View>
                  </List.Accordion>

                  <List.Accordion
                    title={t("profile.charts_title")}
                    left={(props) => <List.Icon {...props} icon="chart-line" />}
                  >
                    <Charts
                      data={data}
                      measurements={measurements}
                      isPending={isPending}
                    />
                  </List.Accordion>
                </List.Section>

                <CardSurface style={styles.saveCard}>
                  <Button mode="contained" onPress={formik.submitForm}>
                    {t("profile.actions_save")}
                  </Button>
                </CardSurface>
                <CardSurface style={styles.notesCard}>
                  <Text variant="titleMedium" style={styles.cardTitle}>
                    {t("profile.notes_title")}
                  </Text>
                  <TextInput
                    multiline
                    style={styles.input}
                    value={notes}
                    onChange={(e) => setNotes(e.nativeEvent.text)}
                    placeholder={t("profile.notes_placeholder")}
                  />

                  <View style={{ marginTop: 10 }}>
                    <Button mode="contained" onPress={addNotes}>
                      {t("profile.notes_save")}
                    </Button>
                  </View>
                </CardSurface>

                <QrCodeSection
                  reptile={
                    data
                      ? {
                          id: data.id,
                          name: data.name,
                          species: data.species,
                          sex: data.sex,
                          danger_level: data.danger_level,
                          acquired_date: data.acquired_date,
                          origin: data.origin,
                          location: data.location,
                          diet: data.diet,
                          temperature_range: data.temperature_range,
                          humidity_level: data.humidity_level,
                        }
                      : null
                  }
                />
                <CardSurface style={styles.sensorCard}>
                  <Text variant="titleMedium" style={styles.cardTitle}>
                    {t("profile.sensor_title")}
                  </Text>
                  <View style={styles.sensorHeader}>
                    <Button
                      mode="text"
                      compact
                      onPress={refetchGoveeReading}
                      disabled={!selectedGoveeDevice || isLoadingGoveeReading}
                      loading={isLoadingGoveeReading}
                    >
                      {t("common.refresh")}
                    </Button>
                  </View>
                  <TextInput
                    placeholder={t("profile.sensor_api_key")}
                    value={goveeApiKey}
                    onChangeText={setGoveeApiKey}
                    secureTextEntry
                  />
                  <View style={styles.sensorActions}>
                    <Button mode="outlined" onPress={handleSaveGoveeKey}>
                      {t("profile.sensor_save_key")}
                    </Button>
                    <Button
                      mode="contained"
                      onPress={refetchGoveeDevices}
                      loading={isLoadingGoveeDevices}
                      disabled={!goveeApiKey}
                    >
                      {t("profile.sensor_list_devices")}
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
                        <Text variant="labelLarge">
                          {t("profile.sensor_last_reading")}
                        </Text>
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
                              {t("profile.sensor_battery")} :{" "}
                              {goveeReading.battery !== null &&
                              goveeReading.battery !== undefined
                                ? `${goveeReading.battery}%`
                                : "—"}{" "}
                              · {formatDDMMYYYY(goveeReading.retrieved_at)}
                            </Text>
                          </>
                        ) : (
                          <Text variant="bodySmall" style={styles.readingMeta}>
                            {t("profile.sensor_no_data")}
                          </Text>
                        )}
                      </View>
                    </View>
                  ) : (
                    <Text variant="bodySmall" style={styles.readingMeta}>
                      {t("profile.sensor_select_device")}
                    </Text>
                  )}
                </CardSurface>
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
                    {t("profile.photo_title")}
                    {selectedPhoto?.created_at
                      ? ` · ${formatDDMMYYYY(selectedPhoto.created_at)}`
                      : ""}
                  </Text>
                  <View style={styles.photoModalActions}>
                    <Button mode="text" onPress={handleDownloadSelectedPhoto}>
                      {t("common.download")}
                    </Button>
                    <Button
                      mode="text"
                      onPress={() => setShowPhotoModal(false)}
                    >
                      {t("common.close")}
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
                <Text variant="titleMedium">{t("profile.shed_add_title")}</Text>
                <DatePickerInput
                  mode="outlined"
                  locale={locale}
                  label={t("profile.shed_date")}
                  value={shedDate}
                  onChange={(date) => setShedDate(date)}
                  inputMode="start"
                  style={styles.pickerInput}
                  outlineStyle={styles.outlineStyle}
                />
                <TextInput
                  placeholder={t("profile.shed_notes")}
                  value={shedNotes}
                  onChangeText={setShedNotes}
                  multiline
                />
                <View style={styles.modalActions}>
                  <Button mode="text" onPress={() => setShowShedModal(false)}>
                    {t("common.cancel")}
                  </Button>
                  <Button
                    mode="contained"
                    loading={isAddingShed}
                    onPress={() => {
                      if (!shedDate) {
                        show(t("profile.shed_date_required"));
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
                            show(t("profile.shed_added"));
                          },
                          onError: () => {
                            show(t("profile.shed_add_error"));
                          },
                        },
                      );
                    }}
                  >
                    {t("common.save")}
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
  dateContent: {
    fontSize: 13,
    paddingVertical: 6,
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
  healthAccordionContent: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 6,
  },
  healthHistoryButton: {
    alignSelf: "flex-start",
    borderRadius: 999,
    marginTop: 6,
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
    gap: 8,
  },
  saveCard: {
    marginTop: 8,
    marginBottom: 4,
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
  sectionTitle: {
    marginTop: 12,
    marginHorizontal: 4,
    fontWeight: "600",
  },
  cardTitle: {
    fontWeight: "600",
    marginBottom: 4,
  },
});

export default ReptileProfileDetails;
// TODO: refactor this screen, it's getting too big. Maybe split into multiple smaller components?
// Also consider moving some logic (like trend calculation) into custom hooks for better separation of concerns and testability.
