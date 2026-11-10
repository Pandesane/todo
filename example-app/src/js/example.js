import { LocalNotificationPlugin } from 'local-notifications';

window.testEcho = () => {
    const inputValue = document.getElementById("echoInput").value;
    LocalNotificationPlugin.echo({ value: inputValue })
}
