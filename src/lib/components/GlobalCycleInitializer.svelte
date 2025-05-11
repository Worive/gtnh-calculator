<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { globalCycle } from '$lib/stores/globalCycle';

	onMount(() => {
		console.log();
		globalCycle.start();
	});

	onDestroy(() => {
		globalCycle.stop();
	});
</script>
