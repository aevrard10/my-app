import { notificationsMultiFormat } from "@shared/utils/formatedDate";
import React, { FC, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import {
  Icon,
  Surface,
  TouchableRipple,
  useTheme,
  Text,
} from "react-native-paper";
import useMarkNotificationAsReadMutationMutation from "../../hooks/mutations/useMarkNotificationAsReadMutation";
import { useQueryClient } from "@tanstack/react-query";
import useGetNotificationsQuery from "../../hooks/queries/GetNotificationsQuery";
type NotifItemProps = {
  item: {
    message: string;
    read: boolean;
    created_at: string;
    id: string;
  };
};

const NotifItem: FC<NotifItemProps> = (props) => {
  const { item } = props;
  const { colors } = useTheme();
  const { mutate } = useMarkNotificationAsReadMutationMutation(item?.id);
  const queryClient = useQueryClient();
  const markNotificationAsRead = useCallback(() => {
    console.log("item", item?.id);

    mutate(
      {
        id: item?.id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: useGetNotificationsQuery.queryKey,
          });
        },
        onError: (e) => {
          console.log("Error", e);
        },
      }
    );
  }, [item?.id]);
  const created_at = item?.created_at * 1000;
  return (
    <TouchableRipple
      onPress={markNotificationAsRead}
      style={styles.touchableRipple}
    >
      <Surface
        style={[
          styles.surface,
          {
            backgroundColor: item?.read ? "#fff" : colors.secondaryContainer,
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
                {"Agenda"}
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
      </Surface>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  touchableRipple: {
    marginBottom: 10,
    borderRadius: 6,
    marginHorizontal: 16,
    marginTop: 10,
  },
  surface: {
    borderRadius: 6,
  },
  identifierAndText: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
  },
  container: {
    marginLeft: 16,
    flex: 1,
    width: "100%",
  },
  surfaceContainer: {
    flexDirection: "row",
    paddingLeft: 16,
    paddingVertical: 12,
    alignItems: "center",
    paddingRight: 24,
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

export default NotifItem;
