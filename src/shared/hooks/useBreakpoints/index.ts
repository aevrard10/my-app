import {useEffect, useState} from 'react';
import {Dimensions, ScaledSize} from 'react-native';
import {isEqual as eq} from 'lodash';

const breakpointsStatusList = {
  XS: {
    isXs: true,
    isSm: false,
    isMd: false,
    isLg: false,
    isXl: false,
  },
  SM: {
    isXs: true,
    isSm: true,
    isMd: false,
    isLg: false,
    isXl: false,
  },
  MD: {
    isXs: true,
    isSm: true,
    isMd: true,
    isLg: false,
    isXl: false,
  },
  LG: {
    isXs: true,
    isSm: true,
    isMd: true,
    isLg: true,
    isXl: false,
  },
  XL: {
    isXs: true,
    isSm: true,
    isMd: true,
    isLg: true,
    isXl: true,
  },
};

type Breakpoints = {
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
};

function status(scaledSize: ScaledSize): Breakpoints {
  const {width} = scaledSize;
  if (width >= 1200) return breakpointsStatusList.XL;
  if (width >= 992) return breakpointsStatusList.LG;
  if (width >= 768) return breakpointsStatusList.MD;
  if (width >= 576) return breakpointsStatusList.SM;
  if (width < 576) return breakpointsStatusList.XS;
  throw new Error('Invalid width');
}

const useBreakpoints = (): Breakpoints => {
  const [breakpoints, setBreakpoints] = useState<Breakpoints>(
    status(Dimensions.get('window')),
  );

  useEffect(() => {
    const listener = Dimensions.addEventListener('change', ({window}) => {
      const curr = status(window);
      setBreakpoints((prev) => {
        if (eq(prev, curr)) return prev;
        return curr;
      });
    });

    return () => {
      listener.remove();
    };
  }, []);

  return breakpoints;
};

export {type Breakpoints};

export default useBreakpoints;
