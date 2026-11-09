<script>
	import TodoIndex from '#lib/components/resources/todos/TodoIndex.svelte';
	import { App, Page, Navbar, Block } from 'konsta/svelte';
</script>

<App theme="ios">
	<Page>
		<Navbar title="My App"  />
		<Block>
			<p>Here comes my app</p>
		</Block>

    <TodoIndex relation_id={23} />
	</Page>
</App>
