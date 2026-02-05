import React, { FC, useState } from "react";
import { Alert, Platform, StyleSheet, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Avatar, Chip, Text, TouchableRipple, useTheme } from "react-native-paper";
import { ReptileQuery } from "@shared/graphql/utils/types/types.generated";

import handleImageUpload from "@shared/utils/handleImageUpload/index";
import CardSurface from "@shared/components/CardSurface";

type ReptilePictureProps = {
  data: ReptileQuery["reptile"];
};

const ReptilePicture: FC<ReptilePictureProps> = (props) => {
  const { data } = props;
  const [imageUri, setImageUri] = useState<string | null>(
    data?.image_url || null
  );
  const { colors } = useTheme();
  const pickImage = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (event: any) => {
        const file = event.target.files[0];
        if (file) {
          setImageUri(URL.createObjectURL(file)); // Prévisualisation
          await handleImageUpload(file, data?.id); // Envoi au backend
        }
      };
      input.click();
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setImageUri(result.assets[0].uri); // Prévisualisation
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        await handleImageUpload(blob, data?.id); // Envoi au backend
      }
    }
  };

  return (
    <CardSurface style={styles.card}>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <TouchableRipple onPress={pickImage} style={styles.avatarTouch}>
            <Avatar.Image
              size={150}
              source={
                data?.image_url || imageUri
                  ? { uri: imageUri ? imageUri : data?.image_url }
                  : require("../../../../../../assets/cobra.png")
              }
            />
          </TouchableRipple>
        </View>
        <Text variant="titleLarge">{data?.name}</Text>
        <Text variant="bodySmall" style={styles.subtitle}>
          Appuyez pour changer la photo.
        </Text>
        <View style={styles.chipRow}>
          <Chip
            icon={
              data?.sort_of_species === "snake"
                ? "snake"
                : require("../../../../../../assets/lizard.png")
            }
            style={{ backgroundColor: colors.secondaryContainer }}
          >
            {data?.species}
          </Chip>
          {data?.sex ? (
            <Chip style={{ backgroundColor: colors.surfaceVariant }}>
              {data?.sex}
            </Chip>
          ) : null}
        </View>
      </View>
    </CardSurface>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  avatarContainer: { padding: 10 },
  avatarTouch: {
    borderRadius: 100,
  },
  subtitle: {
    opacity: 0.6,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
    flexWrap: "wrap",
    justifyContent: "center",
  },
});

export default ReptilePicture;
