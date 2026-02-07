import React from "react";
import { ScrollView } from "react-native";
import { List, Divider, useTheme, Text } from "react-native-paper";
import Screen from "@shared/components/Screen";
import { spacing } from "@shared/theme/tokens";
import CardSurface from "@shared/components/CardSurface";
import { useI18n } from "@shared/i18n";

const SettingsPricing: React.FC = () => {
  const { t } = useI18n();
  const { colors } = useTheme();

  return (
    <Screen contentStyle={{ paddingHorizontal: spacing.lg }}>
      <ScrollView>
        <CardSurface style={{ marginTop: 4, marginBottom: 12 }}>
          <Text variant="titleLarge">{t("settings.pricing")}</Text>
          <Text variant="bodySmall" style={{ opacity: 0.7, marginTop: 4 }}>
            {t("settings.pricing_desc")}
          </Text>
        </CardSurface>
        <List.Section>
          <List.Item
            titleNumberOfLines={2}
            title={`${t("settings.pricing_monthly")} ${t(
              "settings.pricing_monthly_price",
            )}`}
            description={t("settings.pricing_monthly_desc")}
            left={(props) => (
              <List.Icon
                {...props}
                icon="calendar-month"
                color={colors.primary}
              />
            )}
          />
          <Divider style={{ marginVertical: spacing.sm }} />
          <List.Item
            titleNumberOfLines={2}
            title={`${t("settings.pricing_yearly")} ${t(
              "settings.pricing_yearly_price",
            )}`}
            description={t("settings.pricing_yearly_desc")}
            left={(props) => (
              <List.Icon {...props} icon="calendar" color={colors.primary} />
            )}
          />
        </List.Section>
      </ScrollView>
    </Screen>
  );
};

export default SettingsPricing;
