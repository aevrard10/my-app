import {MutableRefObject} from 'react';
import {AnimationObject} from 'lottie-react-native';
import {ViewStyle} from 'react-native';

type LottieRef = {
  play: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
};

export type LottieProps = {
  source: string | AnimationObject;
  autoPlay?: boolean;
  isLoop?: boolean;
  lottieRef?: MutableRefObject<LottieRef | null>;
  style?: React.CSSProperties & ViewStyle;
};
