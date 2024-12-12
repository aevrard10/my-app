import * as SplashScreen from "expo-splash-screen";
import * as React from "react";
import { Navigation } from "./navigation";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "@rn-flix/snackbar";

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
    <SnackbarProvider>
      <PaperProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Navigation
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
          />
        </QueryClientProvider>
      </PaperProvider>
    </SnackbarProvider>
  );
};

export { App };
