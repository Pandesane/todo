import { registerPlugin } from '@capacitor/core';

import type { LocalNotificationPluginPlugin } from './definitions';

const LocalNotificationPlugin = registerPlugin<LocalNotificationPluginPlugin>('LocalNotificationPlugin', {
  web: () => import('./web').then((m) => new m.LocalNotificationPluginWeb()),
});

export * from './definitions';
export { LocalNotificationPlugin };
