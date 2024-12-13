import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HeaderButton, Text } from "@react-navigation/elements";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "./screens/Home";
import ReptileProfileDetails from "./screens/ReptileProfileDetails";
import { Settings } from "./screens/Settings";
import { Updates } from "./screens/Updates";
import { NotFound } from "./screens/NotFound";
import AddReptile from "./screens/AddReptile";
import { Icon } from "react-native-paper";
import Login from "./screens/Login";
import { Header, getHeaderTitle } from "@react-navigation/elements";
import { useAuth } from "@shared/contexts/AuthContext";
import useLogoutMutation from "@shared/hooks/data/mutations/useLogoutMutation";

const Stack = createNativeStackNavigator();
const HomeTabs = createBottomTabNavigator({
  screens: {
    Login: {
      screen: Login,
      options: {
        title: "ReptiTrack",
        tabBarIcon: ({ color, size }) => (
          <Icon source={"snake"} size={size} color={color} />
        ),
      },
    },
    Home: {
      screen: Home,
      options: {
        title: "ReptiTrack",
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
const MyStack = () => {
  const { token } = useAuth();
  const { mutate } = useLogoutMutation();
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({ options, route, back }) => (
          <Header
            {...options}
            back={back}
            title={getHeaderTitle(options, route.name)}
            headerRight={() => (
              <HeaderButton onPress={() => mutate()}>
                <Text>Se déconnecter</Text>
              </HeaderButton>
            )}
          />
        ),
      }}
    >
      {!token ? (
        <Stack.Screen name="Login" component={Login} />
      ) : (
        <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="AddReptile" component={AddReptile} />
          <Stack.Screen
            name="ReptileProfileDetails"
            component={ReptileProfileDetails}
          />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="NotFound" component={NotFound} />
        </>
      )}
    </Stack.Navigator>
  );
};
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
      linking: {
        path: "addReptile",
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

export default MyStack;
