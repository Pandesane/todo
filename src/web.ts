import { WebPlugin } from '@capacitor/core';

import type { LocalNotificationPluginPlugin } from './definitions';

export class LocalNotificationPluginWeb extends WebPlugin implements LocalNotificationPluginPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
