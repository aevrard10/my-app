import { ReptileQuery } from "@shared/graphql/utils/types/types.generated";
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Chip } from "react-native-paper";

type ReptilePictureProps = {
  data: ReptileQuery["reptile"];
};

const ReptilePicture: FC<ReptilePictureProps> = (props) => {
  const { data } = props;
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar.Image
          size={150}
          source={{
            uri: data?.image_url,
          }}
        />
      </View>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Chip
          icon={
            data?.sort_of_species === "snake"
              ? "snake"
              : require("../../../../../../assets/lizard.png")
          }
          onPress={() => console.log("Pressed")}
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
