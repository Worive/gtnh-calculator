<script lang="ts">
	import { onDestroy } from 'svelte';

	export let items: any[] = [];
	export let itemSize: number;

	export let containerElement: HTMLDivElement | null = null;

	let containerWidth = 0;
	let containerHeight = 0;
	let scrollTop = 0;
	let rafId: number | null = null;

	const handleScroll = (event: UIEvent) => {
		const target = event.currentTarget as HTMLElement;
		if (!target) return;

		if (rafId !== null) cancelAnimationFrame(rafId);
		rafId = requestAnimationFrame(() => {
			scrollTop = target.scrollTop;
			rafId = null;
		});
	};

	$: itemsPerRow = Math.max(1, Math.floor(containerWidth / itemSize));
	$: totalRows = Math.ceil(items.length / itemsPerRow);
	$: totalHeight = totalRows * itemSize;

	const BUFFER_ROWS = 10;
	let startRow = 0;
	let endRow = 0;

	$: {
		if (itemSize <= 0 || containerHeight <= 0) {
			startRow = 0;
			endRow = 0;
		} else {
			const visibleStartRow = Math.floor(scrollTop / itemSize);
			const visibleEndRow = Math.ceil((scrollTop + containerHeight) / itemSize);
			startRow = Math.max(0, visibleStartRow - BUFFER_ROWS);
			endRow = Math.min(totalRows - 1, visibleEndRow + BUFFER_ROWS);
		}
	}

	$: visibleItems = items.slice(
		startRow * itemsPerRow,
		Math.min(items.length, (endRow + 1) * itemsPerRow)
	);

	onDestroy(() => {
		if (rafId !== null) cancelAnimationFrame(rafId);
	});
</script>

<div
	class="scroll-container"
	bind:clientWidth={containerWidth}
	bind:clientHeight={containerHeight}
	on:scroll={handleScroll}
>
	<div class="scroll-content" style="height: {totalHeight}px;" bind:this={containerElement}>
		{#each visibleItems as item, localIndex (item.id)}
			<div
				class="virtual-item"
				style="transform: translate(
          {(localIndex % itemsPerRow) * itemSize}px,
          {(startRow + Math.floor(localIndex / itemsPerRow)) * itemSize}px
        );
        width: {itemSize}px;
        height: {itemSize}px;"
			>
				<slot name="item" {item} />
			</div>
		{/each}
	</div>
</div>

<style>
	.scroll-container {
		overflow-y: auto;
		position: relative;
		height: 100%;
	}

	.scroll-content {
		position: relative;
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fill, 36px);
		background-size: 36px;
		background-image: url('/assets/images/Slot.png');
		height: 41154px;
		background-repeat: repeat;
		image-rendering: pixelated;
	}

	.virtual-item {
		position: absolute;
		top: 0;
		left: 0;
		will-change: transform;
		box-sizing: border-box;
	}
</style>
