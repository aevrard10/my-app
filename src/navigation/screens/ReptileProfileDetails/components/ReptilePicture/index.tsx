import React, { FC, useState } from "react";
import { Alert, Button, Platform, StyleSheet, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Avatar, Chip, TouchableRipple } from "react-native-paper";
import { ReptileQuery } from "@shared/graphql/utils/types/types.generated";

import handleImageUpload from "@shared/utils/handleImageUpload";

type ReptilePictureProps = {
  data: ReptileQuery["reptile"];
};

const ReptilePicture: FC<ReptilePictureProps> = (props) => {
  const { data } = props;
  const [imageUri, setImageUri] = useState<string | null>(
    data?.image_url || null
  );
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
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <TouchableRipple onPress={pickImage} style={{ borderRadius: 100 }}>
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
      <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
        <Chip
          icon={
            data?.sort_of_species === "snake"
              ? "snake"
              : require("../../../../../../assets/lizard.png")
          }
        >
          {data?.species}
        </Chip>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  avatarContainer: { padding: 10 },
});

export default ReptilePicture;
