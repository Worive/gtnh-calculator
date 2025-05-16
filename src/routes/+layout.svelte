<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import GlobalCycleInitializer from '$lib/components/GlobalCycleInitializer.svelte';
    import { dev } from '$app/environment';
    import { RenderScan } from 'svelte-render-scan';
</script>

{#if dev}
    <RenderScan initialEnabled={false}/>
{/if}

<GlobalCycleInitializer />

<slot />
