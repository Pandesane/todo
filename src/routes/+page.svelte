<script>
	import AppBar from '$lib/components/AppBar.svelte';
	import TodoIndex from '$lib/components/resources/todos/TodoIndex.svelte';
	import {LocalNotificationPlugin} from "local-notifications"
// const module = await import(
//   '@local-notifications'
// );
	async function callNativeCode() {
		await LocalNotificationPlugin.echo({ value: 'Pande calling native code' });
		await LocalNotificationPlugin.notify({ title: "Custom Notification", body: "Hello Pande we have made it here" });
	}
</script>

<AppBar />

<TodoIndex />

<button
	onclick={() => {
		callNativeCode();
	}}
	class="btn btn-primary">Run</button
>
