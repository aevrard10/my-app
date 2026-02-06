import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Avatar, Button, Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import ScreenNames from "@shared/declarations/screenNames";
import Screen from "@shared/components/Screen";
import CardSurface from "@shared/components/CardSurface";

const Register = () => {
  const { navigate } = useNavigation();
  const { colors } = useTheme();

  return (
    <Screen contentStyle={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.hero}>
            <View
              style={[styles.heroBadge, { backgroundColor: colors.secondary }]}
            >
              <Avatar.Image
                size={100}
                source={require("../../../assets/twoReptile/reptile.png")}
              />
            </View>
            <Text variant="headlineMedium" style={styles.title}>
              Inscription via Apple
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Utilise "Se connecter avec Apple" sur l'écran de connexion.
            </Text>
          </View>

          <CardSurface style={styles.card}>
            <Text variant="bodySmall" style={styles.formSubtitle}>
              Pour protéger tes données et simplifier l'authentification, nous
              ne proposons plus l'inscription par email.
            </Text>
            <View style={styles.formContainer}>
              <Button
                mode="contained"
                onPress={() => navigate(ScreenNames.LOGIN)}
                contentStyle={styles.primaryButtonContent}
              >
                Retour à la connexion
              </Button>
            </View>
          </CardSurface>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  hero: {
    alignItems: "center",
    marginBottom: 24,
  },
  heroBadge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
    marginTop: 6,
  },
  card: {
    padding: 20,
  },
  formSubtitle: {
    opacity: 0.75,
  },
  formContainer: {
    marginTop: 16,
    gap: 12,
  },
  primaryButtonContent: {
    paddingVertical: 6,
  },
});

export default Register;
