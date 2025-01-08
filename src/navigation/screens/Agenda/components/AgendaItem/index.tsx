import { ReptileEventQuery } from "@shared/graphql/utils/types/types.generated";
import { FC } from "react";
import { View } from "react-native";
import { Surface, Text } from "react-native-paper";

type AgendaItemProps = {
  item: {
    name: string;
    time: string;
    notes: string;
  };
};

const AgendaItem: FC<AgendaItemProps> = (props) => {
  const { item } = props;

  return (
    <Surface
      style={{
        marginTop: 16,
        backgroundColor: "white",
        marginHorizontal: 10,
        padding: 20,

        borderRadius: 10,
        flex: 1,
      }}
    >
      <View
        style={{
          justifyContent: "space-between",

          flexDirection: "row",
          marginBottom: 10,
          alignItems: "center",
          gap: 10,
        }}
      >
        <Text
          style={{
            flex: 1, // Permet au texte de s'adapter dans l'espace disponible
            marginRight: 10, // Espacement pour éviter le chevauchement avec l'heure
          }}
          numberOfLines={1}
          variant="titleMedium"
        >
          {item?.name}
        </Text>
        <Text
          style={{
            flexShrink: 0, // Empêche l'heure de rétrécir
          }}
          variant="labelSmall"
        >
          {item?.time}
        </Text>
      </View>
      <Text numberOfLines={1}>{item?.notes}</Text>
    </Surface>
  );
};

export default AgendaItem;
