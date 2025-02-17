import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HeaderButton } from "@react-navigation/elements";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ReptileProfileDetails from "./screens/ReptileProfileDetails";
import { NotFound } from "./screens/NotFound";
import AddReptile from "./screens/AddReptile";
import {  Icon, IconButton } from "react-native-paper";
import Login from "./screens/Login";
import { Header, getHeaderTitle } from "@react-navigation/elements";
import { useAuth } from "@shared/contexts/AuthContext";
import useLogoutMutation from "@shared/data/hooks/data/mutations/useLogoutMutation";
import Agenda from "./screens/Agenda";
import Register from "./screens/Register";
import Notifications from "./screens/Notifications";
import ScreenNames from "@shared/declarations/screenNames";
import { Reptiles } from "./screens/Reptiles";
import Feed from "./screens/Feed";
import AddMesuarements from "./screens/AddMesuarements";
import AddFeed from "./screens/AddFeed";
import FeedHistory from "./screens/FeedHistory";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name={ScreenNames.HOME}
        component={Reptiles}
        options={{
          title: "Accueil",
          tabBarActiveTintColor: "#8BC34A",
          tabBarIcon: ({ size }) => (
            <Icon source={"home"} size={size} color={"#4CAF50"} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={ScreenNames.FEED}
        component={Feed}
        options={{
          title: "Aliments",
          tabBarActiveTintColor: "#8BC34A",
          tabBarIcon: ({ size }) => (
            <Icon source={"food-fork-drink"} color={"#4CAF50"} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={ScreenNames.AGENDA}
        component={Agenda}
        options={{
          title: "Agenda",
          tabBarActiveTintColor: "#8BC34A",
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
          tabBarActiveTintColor: "#8BC34A",
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
            headerStyle={{
              backgroundColor: "#4CAF50",
            }}
            headerRight={() => (
              <HeaderButton onPress={() => mutate()}>
                <IconButton icon="logout-variant" iconColor="#fff" />
              </HeaderButton>
            )}
            headerBackButtonDisplayMode="minimal"
            headerTintColor="#fff"
            headerLeftContainerStyle={{
              marginLeft: 10,
            }}
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
            // options: {
            //   headerTitle: (props) => <LogoTitle {...props} />,
            // },
            options={{
              title: "",
            }}
          />
          <Stack.Screen
            name={ScreenNames.ADD_REPTILE}
            component={AddReptile}
            options={{
              title: "Ajouter un reptile",
              presentation: "modal",
              keyboardHandlingEnabled: true,
            }}
          />
          <Stack.Screen
            name={ScreenNames.REPTILE_PROFILE_DETAILS}
            component={ReptileProfileDetails}
          />
          <Stack.Screen
            name={ScreenNames.ADD_MEASUREMENTS}
            component={AddMesuarements}
            options={{
              presentation: "modal",
              title: "Ajouter des mesures",
            }}
          />
          <Stack.Screen
            name={ScreenNames.ADD_FEED}
            component={AddFeed}
            options={{
              presentation: "modal",
              title: "Ajouter des aliments",
            }}
          />
             <Stack.Screen
            name={ScreenNames.FEED_HISTORY}
            component={FeedHistory}
            options={{
              presentation: "modal",
              title: "Historique des stocks",
            }}
          />
          <Stack.Screen name={ScreenNames.NOT_FOUND} component={NotFound} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default MyStack;
