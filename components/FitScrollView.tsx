import React, { forwardRef, useState } from 'react';
import { ScrollView, View, useWindowDimensions, type ScrollViewProps } from 'react-native';

/**
 * Lesson pages render at a slightly lower "resolution" on phones: the whole
 * content is drawn at a fixed scale (layout stays identical, everything is
 * simply smaller and fills the full width), so more of the lesson fits on the
 * screen. Scrolling behaves exactly as before. Wide screens render at 1:1.
 */
const PHONE_SCALE = 0.86;
const WIDE_BREAKPOINT = 700;

export const FitScrollView = forwardRef<ScrollView, ScrollViewProps>(function FitScrollView({ children, onLayout, ...props }, ref) {
  const { width: windowWidth } = useWindowDimensions();
  const scale = windowWidth >= WIDE_BREAKPOINT ? 1 : PHONE_SCALE;
  const [width, setWidth] = useState(0);
  const [natural, setNatural] = useState(0);
  const ready = scale < 1 && width > 0;

  return (
    <ScrollView ref={ref} {...props} onLayout={event => { onLayout?.(event); setWidth(event.nativeEvent.layout.width); }}>
      {ready ? (
        <View style={{ width, height: natural ? natural * scale : undefined, overflow: 'visible' }}>
          <View
            onLayout={event => { const h = event.nativeEvent.layout.height; if (Math.abs(h - natural) >= 1) setNatural(h); }}
            style={{
              width: width / scale,
              // Scale around the top-left corner so the content starts at the top and spans the full width.
              transform: [{ translateX: -(width / scale) * (1 - scale) / 2 }, { translateY: -(natural * (1 - scale)) / 2 }, { scale }],
            }}
          >
            {children}
          </View>
        </View>
      ) : children}
    </ScrollView>
  );
});

/** Converts a content-space y offset into scroll-space for `scrollTo`. */
export function lessonScrollOffset(contentY: number, windowWidth: number): number {
  return contentY * (windowWidth >= WIDE_BREAKPOINT ? 1 : PHONE_SCALE);
}
