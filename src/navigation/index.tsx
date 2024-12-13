import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HeaderButton } from "@react-navigation/elements";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "./screens/Home";
import ReptileProfileDetails from "./screens/ReptileProfileDetails";
import { Settings } from "./screens/Settings";
import { Updates } from "./screens/Updates";
import { NotFound } from "./screens/NotFound";
import AddReptile from "./screens/AddReptile";
import { Icon, IconButton } from "react-native-paper";
import Login from "./screens/Login";
import { Header, getHeaderTitle } from "@react-navigation/elements";
import { useAuth } from "@shared/contexts/AuthContext";
import useLogoutMutation from "@shared/hooks/data/mutations/useLogoutMutation";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, size }) => (
            <Icon source={"snake"} size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Updates}
        options={{
          title: "Notifications",
          tabBarIcon: ({ color, size }) => (
            <Icon source={"bell"} color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const MyStack = () => {
  const { token } = useAuth();
  const { mutate } = useLogoutMutation();
  console.log("token", token);
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
                <IconButton icon="logout-variant" />
              </HeaderButton>
            )}
          />
        ),
      }}
    >
      {!token ? (
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "ReptiTrack", headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="HomeTabs"
            component={HomeTabs}
            options={{
              title: "ReptiTrack",
            }}
          />
          <Stack.Screen
            name="AddReptile"
            component={AddReptile}
            options={{
              title: "Ajouter un reptile",
            }}
          />
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

export default MyStack;
