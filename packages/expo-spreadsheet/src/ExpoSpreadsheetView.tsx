import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoSpreadsheetViewProps } from './ExpoSpreadsheet.types';

const NativeView: React.ComponentType<ExpoSpreadsheetViewProps> =
  requireNativeView('ExpoSpreadsheet');

export default function ExpoSpreadsheetView(props: ExpoSpreadsheetViewProps) {
  return <NativeView {...props} />;
}
