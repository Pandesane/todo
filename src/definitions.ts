export interface LocalNotificationPluginPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
