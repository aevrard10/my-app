import { act, renderHook } from "../../../testUtils/renderHook";
import useBreakpoints, {type Breakpoints} from '..';
import * as reactNative from 'react-native';

type ScaledSize = reactNative.ScaledSize;

describe('useBreakpoints', () => {
  let getSpy;
  let addEventListenerSpy;

  beforeAll(() => {
    getSpy = jest.spyOn(reactNative.Dimensions, 'get');
    addEventListenerSpy = jest.spyOn(
      reactNative.Dimensions,
      'addEventListener',
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('should return the correct breakpoints status', () => {
    test('for eXtra Large screens', () => {
      getSpy.mockReturnValue({width: 1200} as ScaledSize); // prettier-ignore
      const {result} = renderHook(() => useBreakpoints());
      const expected: Breakpoints = {isXl: true, isLg: true, isMd: true, isSm: true, isXs: true}; // prettier-ignore
      expect(result.current).toEqual(expected);
    });

    test('for LarGe screens', () => {
      getSpy.mockReturnValue({width: 1199} as ScaledSize); // prettier-ignore
      const r1 = renderHook(() => useBreakpoints());
      getSpy.mockReturnValue({width: 992} as ScaledSize);
      const r2 = renderHook(() => useBreakpoints());
      const expected: Breakpoints = {isXl: false, isLg: true, isMd: true, isSm: true, isXs: true}; // prettier-ignore
      expect(r1.result.current).toEqual(expected);
      expect(r2.result.current).toEqual(expected);
    });

    test('for MeDium screens', () => {
      getSpy.mockReturnValue({width: 991} as ScaledSize);
      const r1 = renderHook(() => useBreakpoints());
      getSpy.mockReturnValue({width: 768} as ScaledSize);
      const r2 = renderHook(() => useBreakpoints());
      const expected: Breakpoints = {isXl: false, isLg: false, isMd: true, isSm: true, isXs: true}; // prettier-ignore
      expect(r1.result.current).toEqual(expected);
      expect(r2.result.current).toEqual(expected);
    });

    test('for SMall screens', () => {
      getSpy.mockReturnValue({width: 767} as ScaledSize);
      const r1 = renderHook(() => useBreakpoints());
      getSpy.mockReturnValue({width: 576} as ScaledSize);
      const r2 = renderHook(() => useBreakpoints());
      const expected: Breakpoints = {isXl: false, isLg: false, isMd: false, isSm: true, isXs: true}; // prettier-ignore
      expect(r1.result.current).toEqual(expected);
      expect(r2.result.current).toEqual(expected);
    });

    test('for eXtra Small screens', () => {
      getSpy.mockReturnValue({width: 575} as ScaledSize);
      const {result} = renderHook(() => useBreakpoints());
      const expected: Breakpoints = {isXl: false, isLg: false, isMd: false, isSm: false, isXs: true}; // prettier-ignore
      expect(result.current).toEqual(expected);
    });
  });

  it('should listen to changes on Dimensions', () => {
    getSpy.mockReturnValue({width: 1200} as ScaledSize); // prettier-ignore
    const {result, rerender} = renderHook(() => useBreakpoints());
    expect(result.current.isXl).toBeTruthy();

    const remove = jest.fn();
    addEventListenerSpy.mockImplementation((event, callback) => {
      if (event === 'change') {
        callback({window: {width: 575}});
      }
      return {remove};
    });

    act(() => {
      rerender();
    });

    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(addEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function)); // prettier-ignore
    expect(remove).not.toHaveBeenCalled();
    expect(result.current.isXs).toBeTruthy();
  });

  it('should remove the listener on unmount', () => {
    const remove = jest.fn();
    addEventListenerSpy.mockReturnValue({remove});

    const {unmount, rerender} = renderHook(() => useBreakpoints());
    expect(remove).not.toHaveBeenCalled();

    act(() => {
      rerender();
    });
    expect(remove).not.toHaveBeenCalled();

    unmount();
    expect(remove).toHaveBeenCalledTimes(1);
  });
});
