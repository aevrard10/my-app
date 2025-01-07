import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HeaderButton } from "@react-navigation/elements";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "./screens/Home";
import ReptileProfileDetails from "./screens/ReptileProfileDetails";
import { NotFound } from "./screens/NotFound";
import AddReptile from "./screens/AddReptile";
import { Icon, IconButton } from "react-native-paper";
import Login from "./screens/Login";
import { Header, getHeaderTitle } from "@react-navigation/elements";
import { useAuth } from "@shared/contexts/AuthContext";
import useLogoutMutation from "@shared/data/hooks/data/mutations/useLogoutMutation";
import Agenda from "./screens/Agenda";
import Register from "./screens/Register";
import Notifications from "./screens/Notifications";
import ScreenNames from "@shared/declarations/screenNames";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name={ScreenNames.HOME}
        component={Home}
        options={{
          title: "Accueil",
          tabBarActiveTintColor: "#4CAF50",
          tabBarIcon: ({ size }) => (
            <Icon source={"snake"} size={size} color={"#4CAF50"} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={ScreenNames.AGENDA}
        component={Agenda}
        options={{
          title: "Agenda",
          tabBarActiveTintColor: "#4CAF50",
          tabBarIcon: ({ size }) => (
            <Icon source={"calendar"} color={"#4CAF50"} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={ScreenNames.NOTIFICATIONS}
        component={Notifications}
        options={{
          title: "Notifications",
          tabBarActiveTintColor: "#4CAF50",
          tabBarIcon: ({ size }) => (
            <Icon source={"bell"} color={"#4CAF50"} size={size} />
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
        <>
          <Stack.Screen
            name={ScreenNames.LOGIN}
            component={Login}
            options={{ title: "Connexion", headerShown: false }}
          />
          <Stack.Screen
            name={ScreenNames.REGISTER}
            component={Register}
            options={{ title: "Inscription" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name={ScreenNames.HOME_TABS}
            component={HomeTabs}
            options={{
              title: "ReptiTrack",
            }}
          />
          <Stack.Screen
            name={ScreenNames.ADD_REPTILE}
            component={AddReptile}
            options={{
              title: "Ajouter un reptile",
            }}
          />
          <Stack.Screen
            name={ScreenNames.REPTILE_PROFILE_DETAILS}
            component={ReptileProfileDetails}
          />
          <Stack.Screen name={ScreenNames.NOT_FOUND} component={NotFound} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default MyStack;
