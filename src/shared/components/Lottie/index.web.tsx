import React, {FC} from 'react';
import RLottie, {LottieRef} from 'lottie-react';
import {LottieProps} from './types';

const Lottie: FC<LottieProps> = (props) => {
  const {source, autoPlay, isLoop, lottieRef, style} = props;
  return (
    <RLottie
      lottieRef={lottieRef as LottieRef}
      animationData={source}
      autoplay={autoPlay}
      loop={isLoop}
      style={style}
    />
  );
};

export default Lottie;
