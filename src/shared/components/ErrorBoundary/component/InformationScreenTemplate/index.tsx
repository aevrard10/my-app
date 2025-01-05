import Lottie from "@shared/components/Lottie";
import { LottieProps } from "@shared/components/Lottie/types";
import useBreakpoints from "@shared/hooks/useBreakpoints";
import React, { type PropsWithChildren, type FC } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { Text } from "react-native-paper";
import { Maybe } from "yup";

const debugStyle: Maybe<ViewStyle> = __DEV__
  ? {
      backgroundColor: "#FFA0AC",
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "#0A100D",
    }
  : undefined;

type InformationScreenTemplateProps = PropsWithChildren<{
  lottie: LottieProps["source"];
  lottieRatio: number;
  title: string;
  body: string;
  lottieWrapperStyle?: ViewStyle;
  debug?: boolean;
}>;
const InformationScreenTemplate: FC<InformationScreenTemplateProps> = (
  props
) => {
  const { lottie, title, body, lottieWrapperStyle, lottieRatio, children } =
    props;
  const { isSm } = useBreakpoints();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.lottieContainer,
          { maxWidth: lottieRatio * 310 },
          __DEV__ && props.debug && debugStyle,
        ]}
      >
        <View
          style={[
            styles.lottieWrapper,
            lottieWrapperStyle,
            { aspectRatio: lottieRatio },
          ]}
        >
          <Lottie style={styles.lottie} source={lottie} autoPlay isLoop />
        </View>
      </View>
      <View style={[styles.content, isSm && styles.contentSm]}>
        <Text variant="titleLarge" style={styles.text}>
          {title}
        </Text>
        <Text variant="bodyLarge" style={[styles.text, styles.body]}>
          {body}
        </Text>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  text: { textAlign: "center" },
  body: { marginBottom: 10 },
  lottieContainer: {
    width: "100%",
    marginBottom: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  lottieWrapper: { width: "100%" },
  lottie: { width: "100%", height: "100%" },
  content: { rowGap: 10 },
  contentSm: { alignItems: "center", maxWidth: 920 },
});

export default InformationScreenTemplate;
