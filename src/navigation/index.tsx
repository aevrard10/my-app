import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ReptileProfileDetails from "./screens/ReptileProfileDetails";
import { NotFound } from "./screens/NotFound";
import AddReptile from "./screens/AddReptile";
import { Icon, IconButton, useTheme } from "react-native-paper";
import Login from "./screens/Login";
import { Header, getHeaderTitle } from "@react-navigation/elements";
import { useAuth } from "@shared/contexts/AuthContext";
import useLogoutMutation from "@shared/data/hooks/data/mutations/useLogoutMutation";
import useDashboardSummaryQuery from "@shared/hooks/queries/useDashboardSummary";
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
  const { colors } = useTheme();
  const { data: summary } = useDashboardSummaryQuery();
  const unreadCount = summary?.unread_notifications ?? 0;
  const notificationsBadge =
    unreadCount > 0 ? (unreadCount > 99 ? "99+" : unreadCount) : undefined;
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.outlineVariant ?? colors.outline,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen
        name={ScreenNames.HOME}
        component={Reptiles}
        options={{
          title: "Accueil",
          tabBarActiveTintColor: colors.secondary,
          tabBarIcon: ({ size }) => (
            <Icon source={"home"} size={size} color={colors.primary} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={ScreenNames.FEED}
        component={Feed}
        options={{
          title: "Aliments",
          tabBarActiveTintColor: colors.secondary,
          tabBarIcon: ({ size }) => (
            <Icon source={"food-fork-drink"} color={colors.primary} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={ScreenNames.AGENDA}
        component={Agenda}
        options={{
          title: "Agenda",
          tabBarActiveTintColor: colors.secondary,
          tabBarIcon: ({ size }) => (
            <Icon source={"calendar"} color={colors.primary} size={size} />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name={ScreenNames.NOTIFICATIONS}
        component={Notifications}
        options={{
          title: "Notifications",
          tabBarActiveTintColor: colors.secondary,
          tabBarIcon: ({ size }) => (
            <Icon source={"bell"} color={colors.primary} size={size} />
          ),
          tabBarBadge: notificationsBadge,
          tabBarBadgeStyle: {
            backgroundColor: colors.error,
            color: "#fff",
            fontSize: 11,
          },
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const MyStack = () => {
  const { colors } = useTheme();
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
            headerStyle={{
              backgroundColor: colors.primary,
            }}
            headerRight={() => (
              <IconButton
                icon="logout-variant"
                iconColor={colors.onPrimary}
                onPress={() => mutate()}
              />
            )}
            headerBackButtonDisplayMode="minimal"
            headerTintColor={colors.onPrimary}
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
