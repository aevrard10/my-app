import React from "react";
import { Button, List, Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import CardSurface from "@shared/components/CardSurface";
import TextInput from "@shared/components/TextInput";

type GeneticsForm = {
  morph: string;
  mutations: string;
  hets: string;
  traits: string;
  lineage: string;
  breeder: string;
  hatch_date: string;
  sire_name: string;
  dam_name: string;
  notes: string;
};

type GeneticsSectionProps = {
  geneticsForm: GeneticsForm;
  setGeneticsForm: React.Dispatch<React.SetStateAction<GeneticsForm>>;
  onSave: () => void;
  isSaving?: boolean;
};

type GeneticsField = [string, keyof GeneticsForm];
const geneticsFields: GeneticsField[] = [
  ["Morph", "morph"],
  ["Mutations (ex: Albinos, Hypo)", "mutations"],
  ["Hets (ex: 50% het albinos)", "hets"],
  ["Traits (couleurs, motifs)", "traits"],
  ["Lignée", "lineage"],
  ["Éleveur", "breeder"],
  ["Date d'éclosion (YYYY-MM-DD)", "hatch_date"],
  ["Nom du père", "sire_name"],
  ["Nom de la mère", "dam_name"],
  ["Notes génétiques", "notes"],
];
const GeneticsSection = ({
  geneticsForm,
  setGeneticsForm,
  onSave,
  isSaving,
}: GeneticsSectionProps) => {
  return (
    <CardSurface style={styles.card}>
      <List.Accordion
        title="Génétique"
        left={(props) => <List.Icon {...props} icon="dna" />}
        style={styles.accordion}
      >
        <View style={styles.grid}>
          {geneticsFields.map(([placeholder, key]) => (
            <TextInput
              key={key}
              placeholder={placeholder}
              value={(geneticsForm as any)[key] ?? ""}
              onChangeText={(text) =>
                setGeneticsForm((prev) => ({ ...prev, [key]: text }))
              }
              multiline={key === "notes"}
            />
          ))}
        </View>
        <Button
          mode="contained"
          style={{ marginTop: 12 }}
          onPress={onSave}
          loading={isSaving}
        >
          Enregistrer
        </Button>
      </List.Accordion>
    </CardSurface>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    gap: 12,
  },
  accordion: {
    backgroundColor: "transparent",
    paddingHorizontal: 0,
  },
  grid: {
    marginTop: 10,
    gap: 10,
  },
});

export default GeneticsSection;
