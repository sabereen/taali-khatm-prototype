<script lang="ts">
	import { PickedKhatmPart } from '$lib/entity/PickedKhatmPart'
	import { onMount, type Snippet } from 'svelte'
	import { slide } from 'svelte/transition'
	import { base } from '$app/paths'
	import IconEye from '~icons/ic/outline-remove-red-eye'

	type Props = {
		/** حداکثر چند آیتم رندر شود؟ */
		limit?: number
		title?: string
		fallback?: Snippet
	}

	const props: Props = $props()

	let loading = $state(true)
	let hasMore = $state(false)

	let history = $state<PickedKhatmPart[]>()
	onMount(async () => {
		const limit = props.limit ? props.limit + 1 : undefined
		const list = await PickedKhatmPart.getList(limit)
		loading = false
		if (props.limit && list.length > props.limit) {
			list.length = props.limit
			hasMore = true
		}
		history = list
	})
</script>

{#if history?.length}
	<section transition:slide={{ axis: 'y' }} class="card card-border bg-base-200">
		<div class="card-body">
			{#if props.title}
				<h2 class="card-title">{props.title}</h2>
			{/if}
			<ul class="list">
				{#each history as item}
					<li class="list-row !flex !flex-col">
						<span>
							<strong>بازه:</strong>
							{item.range.getTitle()}
							<a
								class="btn btn-circle btn-ghost btn-xs vertical-middle ms-1 !p-0"
								target="_blank"
								href={item.range.externalLink}
							>
								<IconEye class="size-4" />
							</a>
						</span>
						<span>
							<strong>ختم:</strong>
							«<a class="link link-info" href={item.khatm.link}>{item.khatm.title}</a>»
							{#if item.khatm.private}
								<span class="badge badge-xs badge-info">خصوصی</span>
							{/if}
							{#if !item.khatm.isFree}
								<span class="badge badge-xs">{item.khatm.rangeTypeTitle}</span>
							{/if}
						</span>
						<span>
							<strong>تاریخ:</strong>
							{item.date.toLocaleString('fa-IR')}
						</span>
					</li>
				{/each}
				{#if hasMore}
					<li class="list-row">
						<a class="btn btn-primary !btn-outline" href={`${base}/history`}>نمایش همه‌ی موارد...</a
						>
					</li>
				{/if}
			</ul>
		</div>
	</section>
{:else if !loading}
	{@render props.fallback?.()}
{/if}
