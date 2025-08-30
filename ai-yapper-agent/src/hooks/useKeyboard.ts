import { useState, useCallback } from 'react';
import { useLynxGlobalEventListener } from '@lynx-js/react';

export const useKeyboard = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const setNativeProps = useCallback((itemId: string, props: Record<string, unknown>) => {
    if (!lynx) return;
    
    lynx.createSelectorQuery()
      .select(`#${itemId}`)
      .setNativeProps(props)
      .exec();
  }, []);

  const keyboardChanged = useCallback((keyboardHeightInPx: number) => {
    const isKeyboardVisible = keyboardHeightInPx > 0;
    setKeyboardVisible(isKeyboardVisible);

    if (keyboardHeightInPx === 0) {
      setNativeProps("textareaPanel", {
        transform: `translateY(${0}px)`,
        transition: "transform 0.3s ease",
      });
    } else {
      setNativeProps("textareaPanel", {
        transform: `translateY(${-keyboardHeightInPx}px)`,
        transition: "transform 0.3s ease",
      });
      // Refocus textarea after a short delay to allow transform to complete
      setTimeout(() => {
        setNativeProps("userTextarea", {
          focus: true
        });
      }, 350); // Slightly longer than transition duration
    }
  }, [setNativeProps]);

  // Listen for Lynx keyboard events
  useLynxGlobalEventListener(
    "keyboardstatuschanged",
    (status: unknown, keyboardHeight: unknown) => {
      console.log("Keyboard status:", status);
      console.log("Keyboard height:", keyboardHeight);
      // @ts-ignore
      keyboardChanged(status === "on" ? keyboardHeight : 0);
    },
  );

  return {
    keyboardVisible,
    keyboardChanged
  };
};
