import { notificationsMultiFormat } from "@shared/utils/formatedDate";
import React, { FC, useCallback, memo } from "react";
import { StyleSheet, View } from "react-native";
import {
  Icon,
  TouchableRipple,
  useTheme,
  Text,
} from "react-native-paper";
import useMarkNotificationAsReadMutationMutation from "../../hooks/mutations/useMarkNotificationAsReadMutation";
import { useQueryClient } from "@tanstack/react-query";
import useGetNotificationsQuery from "../../hooks/queries/GetNotificationsQuery";
import CardSurface from "@shared/components/CardSurface";
import useDashboardSummaryQuery from "@shared/hooks/queries/useDashboardSummary";
import { useI18n } from "@shared/i18n";
type NotifItemProps = {
  item: {
    message: string;
    read: boolean;
    created_at: string | number;
    id: string;
  };
};

const NotifItem: FC<NotifItemProps> = (props) => {
  const { item } = props;
  const { colors } = useTheme();
  const { t } = useI18n();
  const { mutate } = useMarkNotificationAsReadMutationMutation();
  const queryClient = useQueryClient();
  const markNotificationAsRead = useCallback(() => {
    mutate(
      {
        id: item?.id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: useGetNotificationsQuery.queryKey,
          });
          queryClient.invalidateQueries({
            queryKey: useDashboardSummaryQuery.queryKey,
          });
        },
      }
    );
  }, [item?.id, mutate, queryClient]);
  const created_at =
    typeof item?.created_at === "number"
      ? item?.created_at * 1000
      : item?.created_at;
  return (
    <TouchableRipple
      onPress={markNotificationAsRead}
      style={styles.touchableRipple}
    >
      <CardSurface
        style={[
          styles.surface,
          {
            backgroundColor: item?.read
              ? colors.surface
              : colors.secondaryContainer,
          },
        ]}
      >
        <View style={styles.surfaceContainer}>
          <View
            style={[
              styles.imageContainer,
              {
                borderColor: colors.secondary,
              },
            ]}
          >
            <View
              style={[
                styles.secondImageContainer,
                {
                  backgroundColor: item?.read
                    ? colors.secondary
                    : colors.primary,
                },
              ]}
            >
              <Icon size={12} source={"calendar"} color="#fff" />
            </View>
          </View>
          <View style={styles.container}>
            <View style={styles.identifierAndText}>
              <Text
                variant="titleMedium"
                style={{
                  color: colors.secondary,
                }}
              >
                {t("agenda.title")}
              </Text>
              <Text
                variant="bodyLarge"
                style={{
                  color: colors.outline,
                }}
              >
                {notificationsMultiFormat(created_at)}
              </Text>
            </View>
            <Text
              variant="bodyMedium"
              style={{
                color: colors.onSurfaceVariant,
              }}
            >
              {item?.message}
            </Text>
          </View>
        </View>
      </CardSurface>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  touchableRipple: {
    marginBottom: 12,
    borderRadius: 18,
    marginTop: 8,
  },
  surface: {
    borderRadius: 18,
    padding: 12,
  },
  identifierAndText: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
  },
  container: {
    marginLeft: 12,
    flex: 1,
    width: "100%",
  },
  surfaceContainer: {
    flexDirection: "row",
    paddingVertical: 4,
    alignItems: "center",
    paddingRight: 8,
  },
  imageContainer: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  secondImageContainer: {
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  imageModuleFallback: {
    height: 12,
    width: 12,
  },
});

export default memo(NotifItem);
