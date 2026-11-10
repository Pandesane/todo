import { WebPlugin } from '@capacitor/core';

import type { ILocalNotificationPlugin } from './definitions';

export class LocalNotificationPluginWeb extends WebPlugin implements ILocalNotificationPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }

  async notify(options: {title: string, body: string}) {
     console.log("To display notification in web g: ", options)
  }
}
