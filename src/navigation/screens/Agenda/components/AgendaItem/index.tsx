import { ReptileEventQuery } from "@shared/graphql/utils/types/types.generated";
import { FC } from "react";
import { View, Text } from "react-native";

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
    <View
      style={{
        marginVertical: 10,
        marginTop: 30,
        backgroundColor: "white",
        marginHorizontal: 10,
        padding: 10,
      }}
    >
      <Text style={{ fontWeight: "bold" }}>{item?.name}</Text>
      <Text>{item?.time}</Text>
    </View>
  );
};

export default AgendaItem;
