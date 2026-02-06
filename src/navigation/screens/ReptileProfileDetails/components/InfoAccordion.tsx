import React from "react";
import { StyleSheet, View } from "react-native";
import { List, Text, Divider } from "react-native-paper";
import TextInput from "@shared/components/TextInput";
import { KeyboardTypeOptions } from "react-native";

export type InfoField = {
  key: string;
  label: string;
  value?: string | number | null;
  onChangeText?: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  readOnly?: boolean;
};

type InfoAccordionProps = {
  title: string;
  icon: string;
  fields: InfoField[];
};

const InfoAccordion = ({ title, icon, fields }: InfoAccordionProps) => {
  return (
    <List.Accordion
      title={title}
      left={(props) => <List.Icon {...props} icon={icon} />}
    >
      {fields.map((field, idx) => {
        const readOnly = field.readOnly ?? false;
        const value =
          field.value !== undefined && field.value !== null
            ? String(field.value)
            : "";
        return (
          <View key={field.key} style={styles.row}>
            <Text style={styles.label} variant="bodyMedium">
              {field.label}
            </Text>
            {readOnly ? (
              <Text variant="bodyMedium" style={styles.value}>
                {value || "—"}
              </Text>
            ) : (
              <TextInput
                keyboardType={field.keyboardType}
                value={value}
                onChangeText={field.onChangeText}
                style={styles.input}
              />
            )}
            {idx === fields.length - 1 ? null : <Divider style={styles.divider} />}
          </View>
        );
      })}
    </List.Accordion>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  label: {
    opacity: 0.7,
    marginBottom: 4,
  },
  value: {
    fontWeight: "600",
  },
  divider: {
    marginTop: 10,
  },
  input: {
    marginTop: 4,
  },
});

export default InfoAccordion;
