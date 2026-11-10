import { registerPlugin } from '@capacitor/core';

import type { ILocalNotificationPlugin } from './definitions';

const LocalNotificationPlugin = registerPlugin<ILocalNotificationPlugin>('LocalNotificationPlugin', {
  web: () => import('./web').then((m) => new m.LocalNotificationPluginWeb()),
});

export * from './definitions';
export { LocalNotificationPlugin };
