import * as React from 'react';

import { ExpoSpreadsheetViewProps } from './ExpoSpreadsheet.types';

export default function ExpoSpreadsheetView(props: ExpoSpreadsheetViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
