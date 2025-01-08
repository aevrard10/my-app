import {
  FlatList,
  ScrollView,
  StyleSheet,
  View,
  Platform,
  RefreshControl,
} from "react-native";
import {
  Avatar,
  Chip,
  FAB,
  Icon,
  Portal,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";
import CardComponent from "./components/CardComponent";
import { useNavigation } from "@react-navigation/native";
import useReptilesQuery from "./hooks/queries/useReptilesQuery";
import Animated, { FadeInDown, SlideInDown } from "react-native-reanimated";
import ListEmptyComponent from "@shared/components/ListEmptyComponent";
import ScreenNames from "@shared/declarations/screenNames";
import useCurrentUserQuery from "@shared/hooks/queries/useCurrentUser";
import useBreakpoints from "@shared/hooks/useBreakpoints";
import useSearchFilter from "@shared/hooks/useSearchFilter";
import { useState } from "react";
import React from "react";

const Home = () => {
  const { navigate } = useNavigation();
  const { data, isPending: isLoading, refetch } = useReptilesQuery();
  const { colors } = useTheme();
  const [, user] = useCurrentUserQuery();
  const { isXl } = useBreakpoints();
  const [searchText, setSearchText] = useState("");
  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: "Search",
        onChangeText: (text) => {
          // Do something
        },
      },
    });
  }, [navigation]);
  const [filteredData] = useSearchFilter(
    data,
    searchText,
    ["name", "species"],
    undefined,
    3
  );
  return (
    <Portal.Host>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 16,
          marginTop: 16,
        }}
      >
        <Avatar.Icon size={40} icon="turtle" />
        <Text style={{ paddingLeft: 8 }} variant="titleMedium">
          Bonjour, @{user?.username} !
        </Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          margin: 16,
        }}
      >
        <Searchbar
          elevation={2}
          mode="bar"
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Rechercher un reptile"
          clearButtonMode="always"
        />
      </View>

      <ScrollView style={{ flexGrow: 1 }}>
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refetch}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
        <View style={styles.flatListContainer}>
          <FlatList
            scrollEnabled={false}
            contentContainerStyle={[styles.contentContainerStyle]}
            data={filteredData}
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
      </ScrollView>
      <FAB
        theme={{ colors: { primaryContainer: colors.primary } }}
        variant="primary"
        color="#fff"
        icon="plus"
        style={styles.fab}
        onPress={() => navigate(ScreenNames.ADD_REPTILE)}
      />
    </Portal.Host>
  );
};

const styles = StyleSheet.create({
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
    // alignItems: "flex-start",
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
});

export { Home };
