import React from "react";
import { ScrollView } from "react-native";
import { List, Divider, Text, useTheme } from "react-native-paper";
import Screen from "@shared/components/Screen";
import { spacing } from "@shared/theme/tokens";
import CardSurface from "@shared/components/CardSurface";
import { useI18n } from "@shared/i18n";
import { Linking } from "react-native";
const SettingsSupport: React.FC = () => {
  const { t } = useI18n();
  const { colors } = useTheme();

  return (
    <Screen contentStyle={{ paddingHorizontal: spacing.lg }}>
      <ScrollView>
        <CardSurface style={{ marginTop: 4, marginBottom: 12 }}>
          <Text variant="titleLarge">{t("settings.help")}</Text>
          <Text variant="bodySmall" style={{ opacity: 0.7, marginTop: 4 }}>
            {t("settings.help_desc")}
          </Text>
        </CardSurface>
        <List.Section>
          <Divider style={{ marginVertical: spacing.sm }} />
          <List.Item
            descriptionNumberOfLines={3}
            title={t("settings.support_contact")}
            description={t("settings.support_contact_desc")}
            left={(props) => <List.Icon {...props} icon="email-outline" />}
            onPress={() => {
              Linking.openURL(
                "mailto:u7088832109@id.gle?cc=&subject=abcdefg&body=body",
              );
            }}
          />
          <List.Item
            title={t("settings.support_faq")}
            description={t("settings.support_faq_desc")}
            left={(props) => <List.Icon {...props} icon="help-circle" />}
          />
        </List.Section>
        <Divider style={{ marginVertical: spacing.md }} />
        <List.Section>
          <List.Accordion
            title={t("settings.faq.q1")}
            left={(props) => <List.Icon {...props} icon="database" />}
          >
            <Text style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
              {t("settings.faq.a1")}
            </Text>
          </List.Accordion>
          <List.Accordion
            title={t("settings.faq.q2")}
            left={(props) => <List.Icon {...props} icon="airplane-off" />}
          >
            <Text style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
              {t("settings.faq.a2")}
            </Text>
          </List.Accordion>
          <List.Accordion
            title={t("settings.faq.q3")}
            left={(props) => <List.Icon {...props} icon="apple" />}
          >
            <Text style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
              {t("settings.faq.a3")}
            </Text>
          </List.Accordion>
          <List.Accordion
            title={t("settings.faq.q4")}
            left={(props) => <List.Icon {...props} icon="bell" />}
          >
            <Text style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
              {t("settings.faq.a4")}
            </Text>
          </List.Accordion>
          <List.Accordion
            title={t("settings.faq.q5")}
            left={(props) => <List.Icon {...props} icon="file-pdf-box" />}
          >
            <Text style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
              {t("settings.faq.a5")}
            </Text>
          </List.Accordion>
          <List.Accordion
            title={t("settings.faq.q6")}
            left={(props) => <List.Icon {...props} icon="thermometer" />}
          >
            <Text style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
              {t("settings.faq.a6")}
            </Text>
          </List.Accordion>
          <List.Accordion
            title={t("settings.faq.q7")}
            left={(props) => <List.Icon {...props} icon="cash" />}
          >
            <Text style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
              {t("settings.faq.a7")}
            </Text>
          </List.Accordion>
        </List.Section>
      </ScrollView>
    </Screen>
  );
};

export default SettingsSupport;
