import React, {FC, LegacyRef} from 'react';
import RNLottie from 'lottie-react-native';
import {LottieProps} from './types';
import {StyleSheet} from 'react-native';

const Lottie: FC<LottieProps> = (props) => {
  const {source, autoPlay, isLoop, lottieRef, style} = props;

  return (
    <RNLottie
      style={[styles.lottie, style]}
      ref={lottieRef as LegacyRef<RNLottie>}
      source={source}
      autoPlay={autoPlay}
      loop={isLoop}
    />
  );
};

const styles = StyleSheet.create({
  lottie: {
    width: '100%',
    height: '100%',
  },
});

export default Lottie;
