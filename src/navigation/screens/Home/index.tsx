import { FlatList, StyleSheet } from "react-native";
import { FAB, Text } from "react-native-paper";
import CardComponent from "./components/CardComponent";
import { useNavigation } from "@react-navigation/native";
import EmptyList from "../../../shared/components/EmptyList";
import useReptilesQuery from "./hooks/queries/useReptilesQuery";

const Home = () => {
  const { navigate } = useNavigation();
  const { data, error, isLoading } = useReptilesQuery();
  if (isLoading) return <Text>Loading...</Text>;
  if (error instanceof Error) return <Text>Error: {error.message}</Text>;
  return (
    <>
      <FlatList
        data={data}
        renderItem={({ item }) => <CardComponent item={item} />}
        ListEmptyComponent={<EmptyList />}
        refreshing={isLoading}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigate("AddReptile")}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 20,
  },
  container: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    flexDirection: "row",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export { Home };
