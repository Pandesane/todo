import { registerPlugin } from '@capacitor/core';

import type { ILocalNotificationPlugin } from './definitions';
import {LocalNotificationPluginWeb} from "./web"

const LocalNotificationPlugin = registerPlugin<ILocalNotificationPlugin>('LocalNotificationPlugin', {
  // web: () => import('./web').then((m) => new m.LocalNotificationPluginWeb()),
  web: () => new LocalNotificationPluginWeb(),
});

export * from './definitions';
export { LocalNotificationPlugin };
