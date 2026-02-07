import React from "react";
import { ScrollView } from "react-native";
import { List, Divider, useTheme } from "react-native-paper";
import { useI18n } from "@shared/i18n";
import Screen from "@shared/components/Screen";
import { spacing } from "@shared/theme/tokens";
import { useNavigation } from "@react-navigation/native";
import ScreenNames from "@shared/declarations/screenNames";

const Settings: React.FC = () => {
  const { t } = useI18n();
  const { colors } = useTheme();
  const { navigate } = useNavigation();

  return (
    <Screen contentStyle={{ paddingHorizontal: spacing.lg }}>
      <ScrollView>
        <List.Section>
          <List.Subheader>{t("settings.about")}</List.Subheader>
          <List.Item
            title={t("settings.language")}
            description={t("settings.language")}
            left={(props) => <List.Icon {...props} icon="translate" color={colors.primary} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigate(ScreenNames.SETTINGS_LANGUAGE)}
          />
          <List.Item
            title={t("settings.pricing")}
            description={t("settings.pricing_desc")}
            left={(props) => <List.Icon {...props} icon="cash" color={colors.primary} />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigate(ScreenNames.SETTINGS_PRICING)}
          />
          <List.Item
            title={t("settings.help")}
            description={t("settings.help_desc")}
            left={(props) => (
              <List.Icon {...props} icon="help-circle" color={colors.primary} />
            )}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigate(ScreenNames.SETTINGS_SUPPORT)}
          />
        </List.Section>
      </ScrollView>
    </Screen>
  );
};

export default Settings;
