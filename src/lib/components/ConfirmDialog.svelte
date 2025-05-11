<script lang="ts">
	import { dialogStore } from '../stores/dialog.store';
	import McButton from '$lib/components/McButton.svelte';

	function handleClick(result: 'option1' | 'option2' | 'cancel') {
		$dialogStore.resolver?.(result);
		dialogStore.update((s) => ({ ...s, show: false }));
	}
</script>

{#if $dialogStore.show}
	<div id="confirm-dialog" class="panel">
		<p id="confirm-text">{$dialogStore.options.text}</p>
		<div class="hgroup">
			{#if $dialogStore.options.option1}
				<McButton id="confirm-yes" on:click={() => handleClick('option1')}>
					{$dialogStore.options.option1}
				</McButton>
			{/if}
			{#if $dialogStore.options.option2}
				<McButton id="confirm-no" on:click={() => handleClick('option2')}>
					{$dialogStore.options.option2}
				</McButton>
			{/if}
			{#if $dialogStore.options.cancel}
				<McButton id="confirm-cancel" on:click={() => handleClick('cancel')}>
					{$dialogStore.options.cancel}
				</McButton>
			{/if}
		</div>
	</div>
{/if}

<style>
	#confirm-dialog {
		flex-direction: column;
		padding: 20px;
		gap: 20px;
	}

	#confirm-dialog button {
		min-width: 100px;
	}

	#confirm-text {
		text-align: center;
		flex-grow: 1;
		max-width: 550px;
	}

	.hgroup {
		justify-content: center;
		gap: 10px;
	}
</style>
