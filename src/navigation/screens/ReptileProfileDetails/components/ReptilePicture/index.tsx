import React, { FC, useState } from "react";
import { Alert, Platform, StyleSheet, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Avatar, Chip, Text, TouchableRipple, useTheme } from "react-native-paper";
import { LocalReptile } from "@shared/local/reptileStore";

import { addReptilePhotoFromUri } from "@shared/local/reptilePhotosStore";
import { useQueryClient } from "@tanstack/react-query";
import QueriesKeys from "@shared/declarations/queriesKeys";
import CardSurface from "@shared/components/CardSurface";

type ReptilePictureProps = {
  data: LocalReptile | null | undefined;
};

const ReptilePicture: FC<ReptilePictureProps> = (props) => {
  const { data } = props;
  const [imageUri, setImageUri] = useState<string | null>(
    data?.image_url || null
  );
  const { colors } = useTheme();
  const qc = useQueryClient();

  const pickImage = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (event: any) => {
        const file = event.target.files[0];
        if (file && data?.id) {
          const uri = URL.createObjectURL(file);
          setImageUri(uri);
          await addReptilePhotoFromUri(data.id, uri);
          qc.invalidateQueries({ queryKey: [QueriesKeys.REPTILE, data.id, "photos"] });
        }
      };
      input.click();
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri && data?.id) {
      setImageUri(result.assets[0].uri);
      await addReptilePhotoFromUri(data.id, result.assets[0].uri);
      qc.invalidateQueries({ queryKey: [QueriesKeys.REPTILE, data.id, "photos"] });
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
