import React, { forwardRef, useState } from 'react';
import { ScrollView, View, type ScrollViewProps } from 'react-native';

const BOTTOM_GAP = 8;

/**
 * A ScrollView that never lets its content overflow: when the natural content
 * height is taller than the viewport, the whole content is scaled down
 * (uniformly, like lowering the resolution) so that everything — including the
 * last buttons — stays visible on any screen size. On tall screens it renders
 * at full size.
 */
export const FitScrollView = forwardRef<ScrollView, ScrollViewProps>(function FitScrollView({ children, contentContainerStyle, onLayout, ...props }, ref) {
  const [available, setAvailable] = useState(0);
  const [natural, setNatural] = useState(0);
  const limit = available - BOTTOM_GAP;
  const scale = available > 0 && natural > limit ? limit / natural : 1;
  const shrunk = scale < 1;

  return (
    <ScrollView
      ref={ref}
      {...props}
      scrollEnabled={!shrunk && props.scrollEnabled !== false}
      contentContainerStyle={[contentContainerStyle, shrunk && { paddingBottom: BOTTOM_GAP }]}
      onLayout={event => { onLayout?.(event); setAvailable(event.nativeEvent.layout.height); }}
    >
      <View style={shrunk ? { height: natural * scale, overflow: 'visible' } : undefined}>
        <View
          onLayout={event => { const h = event.nativeEvent.layout.height; if (Math.abs(h - natural) >= 1) setNatural(h); }}
          style={shrunk ? { transform: [{ translateY: -(natural * (1 - scale)) / 2 }, { scale }] } : undefined}
        >
          {children}
        </View>
      </View>
    </ScrollView>
  );
});
