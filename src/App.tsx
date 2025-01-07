import "react-native-gesture-handler";

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
import ErrorBoundary from "@shared/components/ErrorBoundary";

SplashScreen.preventAutoHideAsync();

const theme = {
  ...DefaultTheme,
  roundness: 8, // Coins arrondis pour un style moderne
  colors: {
    ...DefaultTheme.colors,
    primary: "#4CAF50", // Vert pour un lien naturel
    secondary: "#8BC34A", // Vert clair pour les contrastes
    background: "#E8F5E9", // Vert pâle pour une ambiance apaisante
    surface: "#fff", // Couleur des surfaces (cartes, boutons)
    accent: "#FF5722", // Couleur pour attirer l'attention (comme un bouton d'action)
    text: "#263238", // Couleur sombre et contrastée pour le texte
    placeholder: "#757575", // Couleur pour les champs non remplis
    error: "#D32F2F", // Rouge pour indiquer les erreurs
    secondaryContainer: "#E8F5E9", // Vert clair pour les éléments secondaires
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
