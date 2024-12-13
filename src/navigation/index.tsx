import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HeaderButton, Text } from "@react-navigation/elements";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "./screens/Home";
import ReptileProfileDetails from "./screens/ReptileProfileDetails";
import { Settings } from "./screens/Settings";
import { Updates } from "./screens/Updates";
import { NotFound } from "./screens/NotFound";
import AddReptile from "./screens/AddReptile";
import { Icon } from "react-native-paper";

const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        title: "Animaux",
        tabBarIcon: ({ color, size }) => (
          <Icon source={"snake"} size={size} color={color} />
        ),
      },
    },
    Updates: {
      screen: Updates,
      options: {
        title: "Notifications",
        tabBarIcon: ({ color, size }) => (
          <Icon source={"bell"} color={color} size={size} />
        ),
      },
    },
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    HomeTabs: {
      screen: HomeTabs,
      options: {
        title: "Home",
        headerShown: false,
      },
    },
    AddReptile: {
      screen: AddReptile,
      options: {
        title: "Ajouter un reptile",
      },
    },
    ReptileProfileDetails: {
      screen: ReptileProfileDetails,
      options: {
        title: "Profil",
      },
      linking: {
        path: "profile/:id",
        parse: {
          id: (value) => value.replace("@", ""),
        },
        stringify: {
          id: (value) => value.replace("@", ""),
        },
      },
    },
    Settings: {
      screen: Settings,

      options: ({ navigation }) => ({
        presentation: "modal",
        headerRight: () => (
          <HeaderButton onPress={navigation.goBack}>
            <Text>Close</Text>
          </HeaderButton>
        ),
      }),
    },
    NotFound: {
      screen: NotFound,
      options: {
        title: "404",
      },
      linking: {
        path: "*",
      },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
