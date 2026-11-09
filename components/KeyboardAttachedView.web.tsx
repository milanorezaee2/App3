import React from 'react';
import { View, type ViewProps } from 'react-native';

/** Browsers resize the layout with the keyboard, so no translation is needed. */
export function KeyboardAttachedView({ children, ...props }: React.PropsWithChildren<ViewProps>) {
  return <View {...props}>{children}</View>;
}
