import { FlatList, StyleSheet } from "react-native";
import NotifItem from "./components/NotifItem";
import useGetNotificationsQuery from "./hooks/queries/GetNotificationsQuery";
import ListEmptyComponent from "@shared/components/ListEmptyComponent";

const renderItem = ({ item }) => <NotifItem item={item} />;

const Notifications = () => {
  const { data, isPending, refetch } = useGetNotificationsQuery();
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      refreshing={isPending}
      onRefresh={refetch}
      ListEmptyComponent={
        <ListEmptyComponent isLoading={isPending} disabled={isPending} />
      }
    />
  );
};
const styles = StyleSheet.create({});

export default Notifications;
