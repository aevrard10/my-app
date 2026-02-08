import React from "react";
import TestRenderer, { act } from "react-test-renderer";

export function renderHook<TProps, TResult>(
  callback: (props?: TProps) => TResult,
) {
  let result: TResult;
  let renderer: TestRenderer.ReactTestRenderer;

  const HookWrapper = (props: TProps) => {
    result = callback(props);
    return null;
  };

  act(() => {
    renderer = TestRenderer.create(<HookWrapper />);
  });

  return {
    result: {
      get current() {
        return result;
      },
    },
    rerender: (props?: TProps) => {
      act(() => {
        renderer.update(<HookWrapper {...(props as TProps)} />);
      });
    },
    unmount: () => {
      act(() => {
        renderer.unmount();
      });
    },
  };
}

export { act };
