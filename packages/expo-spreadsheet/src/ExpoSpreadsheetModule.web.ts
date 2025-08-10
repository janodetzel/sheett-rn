import { registerWebModule, NativeModule } from 'expo';

import { ExpoSpreadsheetModuleEvents } from './ExpoSpreadsheet.types';

class ExpoSpreadsheetModule extends NativeModule<ExpoSpreadsheetModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoSpreadsheetModule, 'ExpoSpreadsheetModule');
