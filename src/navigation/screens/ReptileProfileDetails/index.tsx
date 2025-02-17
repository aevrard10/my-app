import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, FAB, Surface, useTheme } from "react-native-paper";
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

  // Mutations
  const { mutate } = useAddNotesMutation();
  const { mutate: updateReptile } = useUpdateReptileMutation();

  // States

  const [notes, setNotes] = useState(data?.notes || "");

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
  console.log(data);
  return (
    <>
      <Formik
        initialValues={{
          name: data?.name || "",
          age: data?.age || 0,
          species: data?.species || "",
          acquired_date: data?.acquired_date || "",
          origin: data?.origin || "",
          location: data?.location || "",
          last_fed: data?.last_fed || "",
          feeding_schedule: data?.feeding_schedule || "",
          diet: data?.diet || "",
          health_status: data?.health_status || "",
          notes: data?.notes || "",
          sex: data?.sex || "",

        }}
        enableReinitialize
        onSubmit={(values) => {
          handleUpdateReptile(values);
        }}
        // validationSchema={schema}
      >
        {(formik) => (
          <>
            <ScrollView>
              <ReptilePicture data={data} />

              <FeedPortal id={id} food={food} data={data} />

              <Surface style={styles.inputSection}>
              <TextInfo title="Âge" readOnly={false} value={formik.values.age?.toString()  || "-"}      onChangeText={(text) => {
                      const number = parseInt(text, 10);
                      formik.setFieldValue("age", isNaN(number) ? "" : number); // Ne pas permettre un non-nombre
                    }}
               />
              <TextInfo readOnly={false} title="Espèce" value={formik.values?.species || ""} />
                <TextInfo
                readOnly={false}
                  title="Date d'acquisition"
                  value={formik.values?.acquired_date || ""}
                />
                <TextInfo readOnly={false} title="Origine" value={formik.values?.origin || ""} />
                <TextInfo
                readOnly={false}
                  title="Emplacement"
                  value={formik.values?.location || ""}
                  noDivider
                />
              </Surface>
              <Surface style={styles.inputSection}>
                <TextInfo readOnly title="Dernier repas" value={formik.values?.last_fed || ""} />
                <TextInfo
                readOnly={false}
                  value={formik.values?.feeding_schedule || ""}
                  title="Horaire de repas"
                />
                <TextInfo
                readOnly={false}
                  value={formik.values?.diet || ""}
                  title="Régime alimentaire"
                  noDivider
                />
              </Surface>
<Button mode="contained" onPress={formik.handleSubmit}>
              Modifier les informations
            </Button>
              <Surface style={styles.inputSection}>
                <TextInfo
                readOnly={false}
                  value={formik.values?.health_status || ""}
                  title="État de santé"
                />
              </Surface>

              <View style={{ margin: 20 }}>
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
              </View>
             <Charts data={data} measurements={measurements} isPending={isPending} />
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
          </>
        )}
      </Formik>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 10,
    outlineStyle: "none",
    borderRadius: 30,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
  inputSection: {
    // overflow: "hidden",
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
});

export default ReptileProfileDetails;
