import "react-native-gesture-handler";

import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import MyStack from "./navigation";
import { PaperProvider } from "react-native-paper";
import { QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "@rn-flix/snackbar";
import { NavigationContainer } from "@react-navigation/native";
import AuthProvider, { useAuth } from "@shared/contexts/AuthContext";
import ErrorBoundary from "@shared/components/ErrorBoundary";
import * as Notifications from "expo-notifications";
import { Platform, type ViewStyle } from "react-native";
import { appTheme } from "@shared/theme";
import { useFonts } from "expo-font";
import queryClient from "@shared/graphql/utils/queryClient";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Sentry from "sentry-expo";

// Sentry (Expo wrapper) — single init
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enableInExpoDevelopment: true,
  debug: false,
  tracesSampleRate: 0.1,
  // Uncomment to add replay/feedback when supported in your plan
  // integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],
});

SplashScreen.preventAutoHideAsync();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const linking = {
  prefixes: [
    "http://localhost:8081",
    "http://localhost:19006",
    "http://127.0.0.1:8081",
    "http://127.0.0.1:19006",
    "reptitrack://",
    "https://reptitrack.com",
    "https://reptitrack.vercel.app",
  ],
  config: {
    screens: {
      HomeTabs: {
        path: "reptiTrack",
        screens: {
          Home: "home",
          Reptiles: "my-reptiles",
          Feed: "alimentations",
          Agenda: "agenda",
          Notifications: "notifications",
        },
      },
      ReptileProfileDetails: "reptile/:id",
      AddMeasurements: "add-measurements",
      AddFeed: "add-feed",
      FeedHistory: "feed-history",
      AddReptile: "add-reptile",
      Login: "login",
      Register: "register",
    },
  },
};

const SnackbarProviderCompat =
  SnackbarProvider as unknown as React.ComponentType<
    React.PropsWithChildren<{ style?: ViewStyle }>
  >;

const App: React.FC = () => {
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
      Notifications.addNotificationResponseReceivedListener((response) => {});
    if (Platform.OS === "web") {
      return;
    }
    return () => {
      if (notificationListener.current?.remove) {
        notificationListener.current.remove();
      } else if (notificationListener.current) {
        Notifications.removeNotificationSubscription?.(
          notificationListener.current,
        );
      }

      if (responseListener.current?.remove) {
        responseListener.current.remove();
      } else if (responseListener.current) {
        Notifications.removeNotificationSubscription?.(
          responseListener.current,
        );
      }
    };
  }, []);
  if (!fontsLoaded) {
    return null;
  }
  const AuthGate = ({ children }: { children: React.ReactNode }) => {
    const { isReady } = useAuth();
    if (!isReady) {
      return null;
    }
    return <>{children}</>;
  };
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AuthGate>
          <SnackbarProviderCompat>
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
          </SnackbarProviderCompat>
        </AuthGate>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export { App };
