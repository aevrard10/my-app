import React from "react";
import { StyleSheet } from "react-native";
import { List } from "react-native-paper";
import TextInfo from "@shared/components/TextInput";
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
    <List.Accordion title={title} left={(props) => <List.Icon {...props} icon={icon} />}> 
      {fields.map((field, idx) => (
        <TextInfo
          key={field.key}
          title={field.label}
          value={field.value !== undefined && field.value !== null ? String(field.value) : ""}
          readOnly={field.readOnly ?? false}
          onChangeText={field.onChangeText}
          keyboardType={field.keyboardType}
          noDivider={idx === fields.length - 1}
        />
      ))}
    </List.Accordion>
  );
};

const styles = StyleSheet.create({});

export default InfoAccordion;
