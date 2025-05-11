<script lang="ts">
    import { onDestroy } from 'svelte';
    import { get } from 'svelte/store';
    import { ShowNeiMode } from '$lib/types/enums/ShowNeiMode';
    import { OreDict } from '$lib/core/data/models/OreDict';
    import { Goods } from '$lib/core/data/models/Goods';
    import { NeiService } from '$lib/services/nei.service';
    import { TooltipService } from '$lib/services/tooltip.service';
    import { repositoryStore } from '$lib/stores/repository.store';
    import { globalCycle } from '$lib/stores/globalCycle';
    import { highlightedId } from '$lib/stores/highlightedId';

    const { dataId, action, probability, amount } = $props<{
        dataId: string;
        action?: keyof typeof actions;
        probability?: number | null;
        amount?: number | null;
    }>();

    const actions = {
        item_icon_click: 'Left/Right click to add recipe',
        select: 'Click to select',
        toggle_link_ignore: 'Click to toggle link ignore',
        crafter_click: 'Click to select another crafter'
    } as const;

    let node: HTMLElement;

    let posX = 0;
    let posY = 0;
    let isHovered = false;

    const recipeObject = $derived(get(repositoryStore)?.GetById(dataId) ?? null);
    const isOreDict = $derived(recipeObject instanceof OreDict);
    const oreItems = $derived(isOreDict ? (recipeObject as OreDict).items : []);
    const currentCycleIndex = $derived(oreItems.length ? $globalCycle % oreItems.length : 0);
    const displayedGoods = $derived(
        isOreDict && oreItems.length
            ? oreItems[currentCycleIndex]
            : recipeObject instanceof Goods ? recipeObject : null
    );

    // --- EFFECTS ---
    $effect(() => updatePosition());
    $effect(() => updateTooltip());

    const handleMouseEnter = () => {
        isHovered = true;

        if (!isOreDict) {
            updateTooltip();
        }

    }
    const handleMouseLeave = () => {
        isHovered = false;
        TooltipService.hide();
        highlightedId.set(null);
    };

    const handleRightClick = (event: MouseEvent) => {
        if (action || event.ctrlKey || event.metaKey) return;
        event.preventDefault();
        recipeObject && NeiService.show(recipeObject, ShowNeiMode.Consumption, null);
    };

    const handleLeftClick = () => {
        if (action === 'select') {
            displayedGoods && NeiService.select(displayedGoods);
        } else if (!action) {
            recipeObject && NeiService.show(recipeObject, ShowNeiMode.Production, null);
        }
    };

    onDestroy(() => {
        if (isHovered) {
            TooltipService.hide();
            highlightedId.set(null);
        }
    });

    function updatePosition() {
        if (!displayedGoods?.iconId) return;

        const iconId = displayedGoods.iconId;
        posX = (iconId % 256) * -32;
        posY = Math.floor(iconId / 256) * -32;

        node.style.setProperty('--pos-x', `${posX}px`);
        node.style.setProperty('--pos-y', `${posY}px`);
    }

    function updateTooltip() {
        if (!displayedGoods || !isHovered) return;

        const tooltipAction = action && action in actions
            ? actions[action as keyof typeof actions]
            : 'Left/Right click to view Production/Consumption for this item';

        TooltipService.show(node, { goods: displayedGoods, action: tooltipAction });
        highlightedId.set(displayedGoods.id);
    }
</script>

<div class="item-icon"
     bind:this={node}
     style="--pos-x: {posX}px; --pos-y: {posY}px;"
     on:mouseenter={handleMouseEnter}
     on:mouseleave={handleMouseLeave}
     on:contextmenu={handleRightClick}
     on:click={handleLeftClick}
     class:item-icon-grid={!displayedGoods?.id}
     class:highlighted={$highlightedId === displayedGoods?.id}
>
    {#if probability}
        <span class="item-probability">{Math.round(probability*100)}%</span>
    {/if}

    {#if amount !== null && amount !== 1}
        <span class="item-amount">{amount}</span>
    {/if}

</div>

<style>
    .item-icon {
        display: inline-block;
        width: 32px;
        height: 32px;
        background-image: url('/data/atlas.webp');
        background-position: var(--pos-x) var(--pos-y);
        cursor: pointer;
        image-rendering: crisp-edges;
        contain: strict;
    }

    .highlighted {
        box-shadow: 0 0 0 2px #4CAF50;
        background-color: #4CAF5020;
    }

    .item-amount {
        position: absolute;
        bottom: -6px;
        right: 1px;
        font-size: 8px;
        text-shadow: 1px 1px #342c34;
        color: white;
        pointer-events: none;
        white-space: nowrap;
    }

    .item-probability {
        position: absolute;
        top: -5px;
        right: 1px;
        font-size: 8px;
        color: #ffd700;
        text-shadow: 1px 1px #342c34;
        pointer-events: none;
    }
</style>