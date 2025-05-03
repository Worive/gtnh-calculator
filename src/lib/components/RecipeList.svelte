<script lang="ts">
	import { currentPageStore } from '$lib/stores/currentPage.store.js';
	import { voltageTier } from '$lib/types/constants/voltageTiers.const';
	import { formatAmount } from '$lib/utils/Formatting';
	import { repositoryStore } from '$lib/stores/repository.store';
	import { Goods } from '$lib/core/data/models/Goods';
	import { LinkAlgorithm } from '$lib/types/enums/LinkAlgorithm';
	import { linkAlgorithmNames } from '$lib/types/constants/solver.const';

	$: page = $currentPageStore;
	$: flow = $currentPageStore.rootGroup.flow;
	$: energy = flow.energy;

	$: tierDetails = Object.entries(energy).map(([tier, amount]) => {
		const t = voltageTier[+tier];
		const current = Math.ceil((100 * amount) / t.voltage) / 100; // keep original rounding
		return { label: t.name, current };
	});

	$: totalEnergy = Object.values(energy).reduce((sum, a) => sum + Math.ceil(a), 0);

	$: formattedTotalEnergy = formatAmount(totalEnergy);

	$: sortedFlowInput = sortAndMapGoods(flow.input);
	$: sortedFlowOutput = sortAndMapGoods(flow.output);

	function sortAndMapGoods(goods: { [key: string]: number }) {
		return Object.entries(goods)
			.sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))
			.map(([goodId, amount]) => {
				return [goodId, formatAmount(amount / page.timeScale)];
			});
	}

	$: repository = $repositoryStore;

	$: links = page.rootGroup.actualLinks;

	$: goodsLinks = Object.keys(links)
		.filter((goodsId) => {
			return repository?.GetById<Goods>(goodsId);
		})
		.map((goodsId) => {
			const algorithm = links[goodsId];

			let dataAmount = null;

			if (algorithm !== LinkAlgorithm.Match) {
				dataAmount = ` data-amount="${linkAlgorithmNames[algorithm]}"`;
			}

			return [goodsId, dataAmount];
		});
</script>

<table class="recipe-table root-group">
	<thead>
		<tr>
			<th class="icon-cell"></th>
			<th class="short-info-cell"></th>
			<th class="energy-cell">POWER</th>
			<th class="inputs-cell">INPUTS/{$currentPageStore.settings.timeUnit}</th>
			<th class="outputs-cell">OUTPUTS/{$currentPageStore.settings.timeUnit}</th>
			<th class="action-cell"></th>
		</tr>
		<tr>
			<td></td>
			<td>Grand total:</td>
			<td class="text-small white-text">
				{#each tierDetails as { label, current }}
					<div>{label}: {current}A</div>
				{/each}
				<br /><br />
				<div>EU/t: {formattedTotalEnergy}</div>
			</td>
			<td>
				<div class="io-items">
					{#each sortedFlowInput as [goodId, amount]}
						<item-icon data-id={goodId} class="flow-item" data-amount={amount} data-iid={page.iid}
						></item-icon>
					{/each}
				</div>
			</td>
			<td>
				<div class="io-items">
					{#each sortedFlowOutput as [goodId, amount]}
						<item-icon data-id={goodId} class="flow-item" data-amount={amount} data-iid={page.iid}
						></item-icon>
					{/each}
				</div>
			</td>
			<td></td>
		</tr>
	</thead>
	<tbody>
		<tr class="group-links">
			<td colspan="6">
				<div class="hgroup">
					<span class="links-label" data-tooltip="link">Links: (?)</span>
				</div>
				<div class="links-grid">
					{#each goodsLinks as [goodsId, dataAmount]}
						<item-icon
							data-id={goodsId}
							data-action="toggle_link_ignore"
							data-iid={page.iid}
							{dataAmount}
						></item-icon>
					{/each}
				</div>
			</td>
		</tr>
	</tbody>
</table>
