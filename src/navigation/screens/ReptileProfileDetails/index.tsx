import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Image, Platform, ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  FAB,
  Icon,
  Modal,
  Portal,
  Text,
  TouchableRipple,
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
import { DatePickerInput } from "react-native-paper-dates";

type Props = StaticScreenProps<{
  id: string;
}>;

const ReptileProfileDetails = ({ route }: Props) => {
  const id = route.params.id;
  const { colors } = useTheme();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { show } = useSnackbar();

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

  // States

  const [notes, setNotes] = useState(data?.notes || "");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showShedModal, setShowShedModal] = useState(false);
  const [shedDate, setShedDate] = useState<Date | undefined>(new Date());
  const [shedNotes, setShedNotes] = useState("");
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
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        await handleImageUpload(blob, id, "gallery");
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
          }
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
    [deletePhoto, refetchPhotos, show]
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
          }
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
    [deleteFeeding, refetchFeedings, show]
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
          }
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
    [deleteShed, refetchSheds, show]
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
        parseMeasurementDate(b.date).getTime()
    );

    const now = new Date();
    const recentThreshold = new Date();
    recentThreshold.setDate(now.getDate() - 30);
    const recent = sorted.filter(
      (m) => parseMeasurementDate(m.date) >= recentThreshold
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
        parseMeasurementDate(a.date).getTime()
    );
    return sorted[0];
  }, [measurements]);

  useEffect(() => {
    navigation.setOptions({ title: data?.name ?? "Détails du reptile" });
  }, [data?.name]);

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
      }
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
      }
    );
  };
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

              <CardSurface style={styles.galleryCard}>
                <View style={styles.galleryHeader}>
                  <Text variant="titleMedium">Galerie</Text>
                  <Button
                    mode="outlined"
                    compact
                    onPress={addGalleryPhoto}
                    loading={isUploadingPhoto}
                  >
                    Ajouter
                  </Button>
                </View>
                {isPhotosLoading ? (
                  <ActivityIndicator style={styles.galleryLoader} />
                ) : photos && photos.length > 0 ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.galleryRow}>
                      {photos.map((photo) => (
                        <TouchableRipple
                          key={photo.id}
                          onLongPress={() => confirmDeletePhoto(photo.id)}
                          style={styles.photoItem}
                        >
                          <View>
                            <Image
                              source={{ uri: photo.url }}
                              style={styles.photoImage}
                            />
                            <Text variant="labelSmall" style={styles.photoDate}>
                              {formatDDMMYYYY(photo.created_at)}
                            </Text>
                          </View>
                        </TouchableRipple>
                      ))}
                    </View>
                  </ScrollView>
                ) : (
                  <Text variant="bodySmall" style={styles.galleryEmpty}>
                    Ajoutez des photos pour garder l&apos;historique.
                  </Text>
                )}
              </CardSurface>

              <FeedPortal id={id} food={food} data={data} />

              <CardSurface style={styles.geneticsCard}>
                <View style={styles.geneticsHeader}>
                  <Text variant="titleMedium">Génétique</Text>
                  <Button
                    mode="outlined"
                    compact
                    onPress={() => {
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
                        }
                      );
                    }}
                    loading={isSavingGenetics}
                  >
                    Enregistrer
                  </Button>
                </View>
                <View style={styles.geneticsGrid}>
                  <TextInput
                    placeholder="Morph"
                    value={geneticsForm.morph}
                    onChangeText={(text) =>
                      setGeneticsForm((prev) => ({ ...prev, morph: text }))
                    }
                  />
                  <TextInput
                    placeholder="Mutations (ex: Albinos, Hypo)"
                    value={geneticsForm.mutations}
                    onChangeText={(text) =>
                      setGeneticsForm((prev) => ({ ...prev, mutations: text }))
                    }
                  />
                  <TextInput
                    placeholder="Hets (ex: 50% het albinos)"
                    value={geneticsForm.hets}
                    onChangeText={(text) =>
                      setGeneticsForm((prev) => ({ ...prev, hets: text }))
                    }
                  />
                  <TextInput
                    placeholder="Traits (couleurs, motifs)"
                    value={geneticsForm.traits}
                    onChangeText={(text) =>
                      setGeneticsForm((prev) => ({ ...prev, traits: text }))
                    }
                  />
                  <TextInput
                    placeholder="Lignée"
                    value={geneticsForm.lineage}
                    onChangeText={(text) =>
                      setGeneticsForm((prev) => ({ ...prev, lineage: text }))
                    }
                  />
                  <TextInput
                    placeholder="Éleveur"
                    value={geneticsForm.breeder}
                    onChangeText={(text) =>
                      setGeneticsForm((prev) => ({ ...prev, breeder: text }))
                    }
                  />
                  <TextInput
                    placeholder="Date d'éclosion (YYYY-MM-DD)"
                    value={geneticsForm.hatch_date}
                    onChangeText={(text) =>
                      setGeneticsForm((prev) => ({
                        ...prev,
                        hatch_date: text,
                      }))
                    }
                  />
                  <TextInput
                    placeholder="Nom du père"
                    value={geneticsForm.sire_name}
                    onChangeText={(text) =>
                      setGeneticsForm((prev) => ({
                        ...prev,
                        sire_name: text,
                      }))
                    }
                  />
                  <TextInput
                    placeholder="Nom de la mère"
                    value={geneticsForm.dam_name}
                    onChangeText={(text) =>
                      setGeneticsForm((prev) => ({
                        ...prev,
                        dam_name: text,
                      }))
                    }
                  />
                  <TextInput
                    placeholder="Notes génétiques"
                    value={geneticsForm.notes}
                    onChangeText={(text) =>
                      setGeneticsForm((prev) => ({ ...prev, notes: text }))
                    }
                    multiline
                  />
                </View>
              </CardSurface>

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

              <CardSurface style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text variant="titleMedium">Historique</Text>
                  <Button
                    mode="outlined"
                    compact
                    onPress={() => setShowShedModal(true)}
                  >
                    Ajouter une mue
                  </Button>
                </View>
                <View style={styles.historySection}>
                  <Text variant="labelLarge">Repas récents</Text>
                  {feedings && feedings.length > 0 ? (
                    <View style={styles.historyList}>
                      {feedings.slice(0, 5).map((feeding) => (
                        <TouchableRipple
                          key={feeding.id}
                          onLongPress={() => confirmDeleteFeeding(feeding.id)}
                          style={styles.historyItem}
                        >
                          <View>
                            <Text variant="bodyMedium">
                              {feeding.food_name || "Repas"}
                            </Text>
                            <Text variant="labelSmall" style={styles.historyMeta}>
                              {formatDDMMYYYY(feeding.fed_at)} ·{" "}
                              {feeding.quantity ?? 1} {feeding.unit ?? ""}
                            </Text>
                          </View>
                        </TouchableRipple>
                      ))}
                    </View>
                  ) : (
                    <Text variant="bodySmall" style={styles.historyEmpty}>
                      Aucun repas enregistré.
                    </Text>
                  )}
                </View>
                <View style={styles.historySection}>
                  <Text variant="labelLarge">Mues récentes</Text>
                  {sheds && sheds.length > 0 ? (
                    <View style={styles.historyList}>
                      {sheds.slice(0, 5).map((shed) => (
                        <TouchableRipple
                          key={shed.id}
                          onLongPress={() => confirmDeleteShed(shed.id)}
                          style={styles.historyItem}
                        >
                          <View>
                            <Text variant="bodyMedium">
                              Mue enregistrée
                            </Text>
                            <Text variant="labelSmall" style={styles.historyMeta}>
                              {formatDDMMYYYY(shed.shed_date)}
                            </Text>
                          </View>
                        </TouchableRipple>
                      ))}
                    </View>
                  ) : (
                    <Text variant="bodySmall" style={styles.historyEmpty}>
                      Aucune mue enregistrée.
                    </Text>
                  )}
                </View>
              </CardSurface>

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
                      isNaN(number) ? "" : number
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
              <CardSurface style={styles.trendCard}>
                <Text variant="titleMedium">Tendances</Text>
                {trendData ? (
                  <View style={styles.trendRows}>
                    <View style={styles.trendRow}>
                      <Icon
                        source={trendData.weightDelta >= 0 ? "trending-up" : "trending-down"}
                        size={20}
                        color={
                          trendData.weightAlert
                            ? colors.error
                            : colors.primary
                        }
                      />
                      <View style={styles.trendText}>
                        <Text variant="bodyMedium">
                          Poids{" "}
                          {trendData.weightDelta >= 0 ? "+" : ""}
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
                        source={trendData.sizeDelta >= 0 ? "trending-up" : "trending-down"}
                        size={20}
                        color={
                          trendData.sizeAlert
                            ? colors.error
                            : colors.primary
                        }
                      />
                      <View style={styles.trendText}>
                        <Text variant="bodyMedium">
                          Taille{" "}
                          {trendData.sizeDelta >= 0 ? "+" : ""}
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
                        Variation importante détectée. Vérifiez l&apos;état de santé.
                      </Text>
                    )}
                  </View>
                ) : (
                  <Text variant="bodySmall" style={styles.galleryEmpty}>
                    Ajoutez au moins 2 mesures pour voir une tendance.
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
                  <Button
                    mode="text"
                    onPress={() => setShowShedModal(false)}
                  >
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
                        }
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
  galleryCard: {
    marginBottom: 12,
    gap: 10,
  },
  galleryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  galleryRow: {
    flexDirection: "row",
    gap: 12,
  },
  photoItem: {
    borderRadius: 14,
    overflow: "hidden",
  },
  photoImage: {
    width: 120,
    height: 120,
    borderRadius: 14,
  },
  photoDate: {
    marginTop: 6,
    opacity: 0.6,
    textAlign: "center",
  },
  galleryEmpty: {
    opacity: 0.6,
  },
  galleryLoader: {
    alignSelf: "center",
    marginVertical: 12,
  },
  geneticsCard: {
    marginVertical: 8,
    gap: 12,
  },
  geneticsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  geneticsGrid: {
    gap: 10,
  },
  historyCard: {
    marginVertical: 8,
    gap: 12,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  historySection: {
    gap: 6,
  },
  historyList: {
    gap: 8,
  },
  historyItem: {
    borderRadius: 12,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  historyMeta: {
    opacity: 0.6,
    marginTop: 2,
  },
  historyEmpty: {
    opacity: 0.6,
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
});

export default ReptileProfileDetails;
