import React, { createContext, forwardRef, useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, View, useWindowDimensions, type ScrollViewProps } from 'react-native';

/**
 * Lesson pages render at a slightly lower "resolution" on phones: the whole
 * content is drawn at a fixed scale (layout stays identical, everything is
 * simply smaller and fills the full width), so more of the lesson fits on the
 * screen. Scrolling behaves exactly as before. Wide screens render at 1:1.
 */
const PHONE_SCALE = 0.78;
/** Text keeps the visual size it had at the earlier 86% layout scale. */
const TEXT_REFERENCE_SCALE = 0.86;
export const TextScaleContext = createContext(1);
const WIDE_BREAKPOINT = 700;

type FitScrollViewProps = ScrollViewProps & {
  /** 'classic': the earlier uniform 86% rendering (text scales with the layout). */
  variant?: 'default' | 'classic';
};

export const FitScrollView = forwardRef<ScrollView, FitScrollViewProps>(function FitScrollView({ children, onLayout, variant = 'default', ...props }, ref) {
  const { width: windowWidth } = useWindowDimensions();
  const phoneScale = variant === 'classic' ? TEXT_REFERENCE_SCALE : PHONE_SCALE;
  const scale = windowWidth >= WIDE_BREAKPOINT ? 1 : phoneScale;
  const [width, setWidth] = useState(0);
  const [natural, setNatural] = useState(0);
  const naturalRef = useRef(0);
  naturalRef.current = natural;
  const innerRef = useRef<View>(null);
  const ready = scale < 1 && width > 0;
  const applyNatural = (h: number) => { if (Math.abs(h - naturalRef.current) >= 1) setNatural(h); };
  // react-native-web does not deliver onLayout for this absolutely positioned, transformed box, so on web the
  // natural (unscaled) height is observed directly; without it the scaled content sat ~120px too low.
  useEffect(() => {
    if (Platform.OS !== 'web' || !ready) return;
    const node = innerRef.current as unknown as HTMLElement | null;
    if (!node || typeof ResizeObserver === 'undefined') return;
    const update = () => applyNatural(node.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [ready]);

  return (
    <ScrollView ref={ref} {...props} onLayout={event => { onLayout?.(event); setWidth(event.nativeEvent.layout.width); }}>
      {ready ? (
        <View style={{ width, height: natural ? natural * scale : undefined, overflow: 'visible' }}>
          <View
            ref={innerRef}
            onLayout={event => applyNatural(event.nativeEvent.layout.height)}
            style={{
              // Anchored explicitly at the left edge: the inner box is wider than its parent, and on web with an
              // RTL document a wider in-flow child overflows to the LEFT, which shifted every lesson page sideways.
              position: 'absolute',
              top: 0,
              left: 0,
              width: width / scale,
              // Scale around the top-left corner so the content starts at the top and spans the full width.
              transform: [{ translateX: -(width / scale) * (1 - scale) / 2 }, { translateY: -(natural * (1 - scale)) / 2 }, { scale }],
            }}
          >
            <TextScaleContext.Provider value={TEXT_REFERENCE_SCALE / scale}>{children}</TextScaleContext.Provider>
          </View>
        </View>
      ) : children}
    </ScrollView>
  );
});

/** Converts a content-space y offset into scroll-space for `scrollTo`. */
export function lessonScrollOffset(contentY: number, windowWidth: number, variant: 'default' | 'classic' = 'default'): number {
  return contentY * (windowWidth >= WIDE_BREAKPOINT ? 1 : variant === 'classic' ? TEXT_REFERENCE_SCALE : PHONE_SCALE);
}
