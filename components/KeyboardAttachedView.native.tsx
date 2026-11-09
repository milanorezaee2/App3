import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Keyboard, Platform, View, type ViewProps } from 'react-native';
import { KeyboardEvents } from 'react-native-keyboard-controller';

/**
 * Self-measuring keyboard attachment for the chat composer.
 *
 * Instead of trusting a reported keyboard height (which on Android can be off
 * by the system bars), it measures where this view actually is on screen and
 * where the keyboard's top edge actually is, moves the view by exactly that
 * difference, then re-measures once and corrects any residual gap.
 */
export function KeyboardAttachedView({ children, style, ...props }: React.PropsWithChildren<ViewProps>) {
  const container = useRef<View>(null);
  const translate = useRef(new Animated.Value(0)).current;
  const current = useRef(0);
  const keyboardTop = useRef<number | null>(null);
  const alive = useRef(true);

  const animateTo = (value: number) => {
    const rounded = Math.round(value);
    if (rounded === current.current) return;
    current.current = rounded;
    Animated.timing(translate, { toValue: rounded, duration: 140, useNativeDriver: true }).start();
  };

  const attach = (attempt = 0) => {
    const top = keyboardTop.current;
    const node = container.current;
    if (top === null || !node || !alive.current) return;
    node.measureInWindow((_x, y, _w, h) => {
      if (!alive.current || keyboardTop.current === null) return;
      const bottomNow = y + h; // includes the translation already applied
      const gap = top - bottomNow; // > 0: floating above the keyboard; < 0: hidden behind it
      if (Math.abs(gap) >= 1) animateTo(current.current + gap);
      // Verify once more after layout and animation settle.
      if (attempt < 2) setTimeout(() => attach(attempt + 1), 180);
    });
  };

  useEffect(() => {
    alive.current = true;
    const screenHeight = () => Dimensions.get('screen').height;
    const show = (top: number) => { keyboardTop.current = top; attach(); };
    const hide = () => { keyboardTop.current = null; animateTo(0); };

    // React Native reports the keyboard's top edge in screen coordinates.
    const subscriptions = [
      Keyboard.addListener('keyboardDidShow', event => show(event.endCoordinates.screenY)),
      Keyboard.addListener('keyboardDidHide', hide),
    ];
    if (Platform.OS === 'ios') {
      subscriptions.push(Keyboard.addListener('keyboardWillShow', event => show(event.endCoordinates.screenY)));
      subscriptions.push(Keyboard.addListener('keyboardWillHide', hide));
    }
    // Fallback through the keyboard controller when the RN events are swallowed.
    const controllerShow = KeyboardEvents.addListener('keyboardDidShow', event => {
      if (keyboardTop.current === null && event.height > 0) show(screenHeight() - event.height);
    });
    const controllerHide = KeyboardEvents.addListener('keyboardDidHide', () => { if (keyboardTop.current !== null) hide(); });

    return () => {
      alive.current = false;
      subscriptions.forEach(subscription => subscription.remove());
      controllerShow.remove();
      controllerHide.remove();
    };
    // Listeners are registered once per mount by design.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View ref={container} {...props} onLayout={event => { props.onLayout?.(event); if (keyboardTop.current !== null) attach(); }} style={[style, { transform: [{ translateY: translate }] }]}>
      {children}
    </Animated.View>
  );
}
