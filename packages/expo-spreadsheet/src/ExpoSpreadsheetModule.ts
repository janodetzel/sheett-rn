import { NativeModule, requireNativeModule } from 'expo';

import { ExpoSpreadsheetModuleEvents } from './ExpoSpreadsheet.types';

declare class ExpoSpreadsheetModule extends NativeModule<ExpoSpreadsheetModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoSpreadsheetModule>('ExpoSpreadsheet');
