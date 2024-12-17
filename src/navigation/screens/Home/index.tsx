import {
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Drawer,
  FAB,
  Text,
  useTheme,
} from "react-native-paper";
import CardComponent from "./components/CardComponent";
import { useNavigation } from "@react-navigation/native";
import EmptyList from "../../../shared/components/EmptyList";
import useReptilesQuery from "./hooks/queries/useReptilesQuery";
import useCurrentUserQuery from "@shared/hooks/queries/useCurrentUser";

const Home = () => {
  const { navigate } = useNavigation();
  const { data, isLoading } = useReptilesQuery();
  const [, currentUser] = useCurrentUserQuery();
  const { colors } = useTheme();
  if (isLoading) return <ActivityIndicator />;
  return (
    <>
      <Drawer.CollapsedItem
        focusedIcon="inbox"
        unfocusedIcon="inbox-outline"
        label="Inbox"
      />
      <ScrollView>
        <ImageBackground
          blurRadius={2}
          source={{
            uri: "https://lapauseinfo.fr/wp-content/uploads/2024/02/26771140-une-bleu-serpent-naturel-contexte-gratuit-photo-scaled.jpeg",
          }}
          style={styles.backgroundImg}
        >
          <View style={styles.container}>
            <Text
              style={{
                color: colors.onPrimary,
              }}
              variant="displayLarge"
            >
              {"ReptiTrack"}
            </Text>
          </View>

          <View style={styles.flatListContainer}>
            <Text style={styles.myReptileContainer} variant="headlineMedium">
              Mes reptiles
            </Text>
            <FlatList
              scrollEnabled={false}
              contentContainerStyle={styles.contentContainerStyle}
              data={data}
              renderItem={({ item }) => <CardComponent item={item} />}
              ListEmptyComponent={<EmptyList />}
              refreshing={isLoading}
            />
          </View>
        </ImageBackground>
      </ScrollView>
      <FAB
        theme={{ colors: { primaryContainer: colors.primary } }}
        variant="primary"
        color={colors.primaryContainer}
        icon="plus"
        style={styles.fab}
        onPress={() => navigate("AddReptile")}
      />
    </>
  );
};

const styles = StyleSheet.create({
  myReptileContainer: {
    marginTop: 20,
  },
  backgroundImg: {
    width: "100%",
    height: 200,
  },
  card: {
    margin: 20,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    width: "100%",
    height: 200,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  flatListContainer: {
    flexDirection: "column",
    margin: 16,
  },
  contentContainerStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
  },
});

export { Home };
