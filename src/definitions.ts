export interface ILocalNotificationPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
  notify(options: { title: string, body: string }): Promise<void> | void;
}
