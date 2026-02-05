import "react-native-gesture-handler";

import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import MyStack from "./navigation";
import { PaperProvider } from "react-native-paper";
import { QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "@rn-flix/snackbar";
import { NavigationContainer } from "@react-navigation/native";
import AuthProvider from "@shared/contexts/AuthContext";
import ErrorBoundary from "@shared/components/ErrorBoundary";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { appTheme } from "@shared/theme";
import { useFonts } from "expo-font";
import queryClient from "@shared/graphql/utils/queryClient";

SplashScreen.preventAutoHideAsync();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const linking = {
  prefixes: ["reptitrack://", "https://reptitrack.com"],
  config: {
    screens: {
      HomeTabs: "reptiTrack",
      Home: "my-reptiles",
      ReptileProfileDetails: "reptile/:id",
      AddMeasurements: "add-measurements",
      Feed: "alimentations",
      Agenda: "agenda",
      Notifications: "notifications",
      AddFeed: "add-feed",
      FeedHistory: "feed-history",
      AddReptile: "add-reptile",
      Login: "login",
      Register: "register",
   
    },
  },
};

const App = () => {
  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Regular": require("../assets/fonts/JetBrainsMono-Regular.ttf"),
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });
  const [notification, setNotification] = React.useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = React.useRef<Notifications.EventSubscription>();
  const responseListener = React.useRef<Notifications.EventSubscription>();

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  React.useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
      });
    if (Platform.OS === "web") {
      return;
    }
    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  if (!fontsLoaded) {
    return null;
  }
  return (
    <AuthProvider>
      <SnackbarProvider>
        <PaperProvider theme={appTheme}>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer
              linking={linking}
              onReady={() => {
                SplashScreen.hideAsync();
              }}
            >
              <ErrorBoundary>
                <MyStack />
              </ErrorBoundary>
            </NavigationContainer>
          </QueryClientProvider>
        </PaperProvider>
      </SnackbarProvider>
    </AuthProvider>
  );
};

export { App };
