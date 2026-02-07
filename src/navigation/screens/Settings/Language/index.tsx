import React from "react";
import { ScrollView } from "react-native";
import { List, Divider, RadioButton } from "react-native-paper";
import {
  getLanguageLabel,
  getSupportedLocales,
  useI18n,
} from "@shared/i18n";
import Screen from "@shared/components/Screen";
import { spacing } from "@shared/theme/tokens";

const SettingsLanguage: React.FC = () => {
  const { locale, setLocale, t } = useI18n();
  const languages = getSupportedLocales();

  return (
    <Screen contentStyle={{ paddingHorizontal: spacing.lg }}>
      <ScrollView>
        <List.Section>
          <List.Subheader>{t("settings.language")}</List.Subheader>
          {languages.map((code) => (
            <RadioButton.Item
              key={code}
              label={getLanguageLabel(code)}
              value={code}
              status={locale === code ? "checked" : "unchecked"}
              onPress={() => setLocale(code)}
            />
          ))}
        </List.Section>
        <Divider style={{ marginVertical: spacing.md }} />
      </ScrollView>
    </Screen>
  );
};

export default SettingsLanguage;
