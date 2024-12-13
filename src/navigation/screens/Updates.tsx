import { StyleSheet, View } from "react-native";
import {
  Icon,
  Surface,
  TouchableRipple,
  useTheme,
  Text,
} from "react-native-paper";

export function Updates() {
  const { colors } = useTheme();
  const onPress = () => {
    console.log("Pressed");
  };
  return (
    <TouchableRipple onPress={onPress} style={styles.touchableRipple}>
      <Surface
        style={[
          styles.surface,
          {
            backgroundColor: colors.secondaryContainer,
          },
        ]}
      >
        <View style={styles.surfaceContainer}>
          <View
            style={[
              styles.imageContainer,
              {
                borderColor: colors.secondary,
              },
            ]}
          >
            <View
              style={[
                styles.secondImageContainer,
                {
                  backgroundColor: colors.secondary,
                },
              ]}
            >
              <Icon size={12} source={"material-community"} />
            </View>
          </View>
          <View style={styles.container}>
            <View style={styles.identifierAndText}>
              <Text
                variant="titleMedium"
                style={{
                  color: colors.secondary,
                }}
              >
                {"title"}
              </Text>
              <Text
                variant="bodyLarge"
                style={{
                  color: colors.outline,
                }}
              >
                {" ⸱ "}
                {"date"}
              </Text>
            </View>
            <Text
              variant="bodyMedium"
              style={{
                color: colors.onSurfaceVariant,
              }}
            >
              {"content"}
            </Text>
          </View>
        </View>
      </Surface>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  touchableRipple: {
    marginBottom: 10,
    borderRadius: 6,
    marginHorizontal: 16,
    marginTop: 10,
  },
  surface: {
    borderRadius: 6,
  },
  identifierAndText: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
  },
  container: {
    marginLeft: 16,
    flex: 1,
    width: "100%",
  },
  surfaceContainer: {
    flexDirection: "row",
    paddingLeft: 16,
    paddingVertical: 12,
    alignItems: "center",
    paddingRight: 24,
  },
  imageContainer: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  secondImageContainer: {
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  imageModuleFallback: {
    height: 12,
    width: 12,
  },
});
