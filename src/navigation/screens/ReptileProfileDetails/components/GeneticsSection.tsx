import React from "react";
import { Button, List, Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import CardSurface from "@shared/components/CardSurface";
import TextInput from "@shared/components/TextInput";
import { useI18n } from "@shared/i18n";

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
const GeneticsSection = ({
  geneticsForm,
  setGeneticsForm,
  onSave,
  isSaving,
}: GeneticsSectionProps) => {
  const { t } = useI18n();
  const geneticsFields: GeneticsField[] = [
    [t("genetics.field.morph"), "morph"],
    [t("genetics.field.mutations"), "mutations"],
    [t("genetics.field.hets"), "hets"],
    [t("genetics.field.traits"), "traits"],
    [t("genetics.field.lineage"), "lineage"],
    [t("genetics.field.breeder"), "breeder"],
    [t("genetics.field.hatch_date"), "hatch_date"],
    [t("genetics.field.sire_name"), "sire_name"],
    [t("genetics.field.dam_name"), "dam_name"],
    [t("genetics.field.notes"), "notes"],
  ];
  return (
    <CardSurface style={styles.card}>
      <List.Accordion
        title={t("genetics.title")}
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
          {t("genetics.save")}
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
