import {
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
  Platform,
} from "react-native";
import {
  ActivityIndicator,
  FAB,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import CardComponent from "./components/CardComponent";
import { useNavigation } from "@react-navigation/native";
import EmptyList from "../../../shared/components/EmptyList";
import useReptilesQuery from "./hooks/queries/useReptilesQuery";
import useCurrentUserQuery from "@shared/hooks/queries/useCurrentUser";
import Animated, { FadeInDown, SlideInDown } from "react-native-reanimated";
import ListEmptyComponent from "@shared/components/ListEmptyComponent";

const Home = () => {
  const { navigate } = useNavigation();
  const { data, isLoading, refetch } = useReptilesQuery();
  const [, currentUser] = useCurrentUserQuery();
  const { colors } = useTheme();

  return (
    <Portal.Host>
      <ScrollView>
        <ImageBackground
          blurRadius={2}
          source={{
            uri: "https://lapauseinfo.fr/wp-content/uploads/2024/02/26771140-une-bleu-serpent-naturel-contexte-gratuit-photo-scaled.jpeg",
          }}
          style={styles.backgroundImg}
        >
          <View style={styles.container}>
            <Animated.View
              entering={Platform.select({
                android: SlideInDown,
                default: FadeInDown,
              }).delay(50)}
            >
              <Text
                style={{
                  color: colors.onPrimary,
                }}
                variant="displayLarge"
              >
                {"ReptiTrack"}
              </Text>
            </Animated.View>
          </View>

          <View style={styles.flatListContainer}>
            {/* <Text style={styles.myReptileContainer} variant="headlineMedium">
              Mes reptiles
            </Text> */}
            <FlatList
              scrollEnabled={false}
              contentContainerStyle={styles.contentContainerStyle}
              data={data}
              renderItem={({ item, index }) => (
                <Animated.View
                  entering={Platform.select({
                    android: SlideInDown,
                    default: FadeInDown,
                  }).delay(index * 50)}
                  key={item?.id}
                >
                  <CardComponent item={item} />
                </Animated.View>
              )}
              ListEmptyComponent={<ListEmptyComponent isLoading={isLoading} />}
              onRefresh={Platform.select({
                web: undefined,
                default: refetch,
              })}
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
    </Portal.Host>
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
