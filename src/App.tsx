import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import MyStack from "./navigation";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "@rn-flix/snackbar";
import { NavigationContainer } from "@react-navigation/native";
import AuthProvider from "@shared/contexts/AuthContext";

// Asset.loadAsync([
//   ...NavigationAssets,
//   require("./assets/bell.png"),
// ]);

SplashScreen.preventAutoHideAsync();
const theme = {
  ...DefaultTheme,
  // Specify custom property
  myOwnProperty: true,
  // Specify custom property in nested object
  colors: {
    ...DefaultTheme.colors,
    primary: "#BADA55",
  },
};
const queryClient = new QueryClient();

const App = () => {
  return (
    <AuthProvider>
      <SnackbarProvider>
        <PaperProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer
              linking={{
                enabled: "auto",
                prefixes: [
                  // Change the scheme to match your app's scheme defined in app.json
                  "reptitrack://",
                ],
              }}
              onReady={() => {
                SplashScreen.hideAsync();
              }}
            >
              <MyStack />
            </NavigationContainer>
          </QueryClientProvider>
        </PaperProvider>
      </SnackbarProvider>
    </AuthProvider>
  );
};

export { App };
