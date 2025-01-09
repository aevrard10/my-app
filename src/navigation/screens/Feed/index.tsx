import { View } from "react-native";
import { Avatar, Card, Chip, FAB, ProgressBar, Text } from "react-native-paper";

const Feed = () => {
  return (
    <>
      <View style={{ margin: 16 }}>
        <Card style={{}}>
          <Card.Title
            title="Souris"
            subtitle={"Rongeur"}
            left={({ size }) => (
              <Avatar.Icon size={size} icon="food-fork-drink" color="#fff" />
            )}
            right={() => (
              <Chip icon="heart" style={{ marginRight: 8 }}>
                10
              </Chip>
            )}
          />
          <Card.Content>
            <ProgressBar progress={0.5} />
          </Card.Content>
        </Card>
      </View>
      <FAB
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        icon="plus"
        onPress={() => {}}
      />
    </>
  );
};

export default Feed;
