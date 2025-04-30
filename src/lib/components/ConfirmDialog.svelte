<script lang="ts">
	import { dialogStore } from '../stores/dialog.store';

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
				<button id="confirm-yes" on:click={() => handleClick('option1')}>
					{$dialogStore.options.option1}
				</button>
			{/if}
			{#if $dialogStore.options.option2}
				<button id="confirm-no" on:click={() => handleClick('option2')}>
					{$dialogStore.options.option2}
				</button>
			{/if}
			{#if $dialogStore.options.cancel}
				<button id="confirm-cancel" on:click={() => handleClick('cancel')}>
					{$dialogStore.options.cancel}
				</button>
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
