<script lang="ts">
	import type { PageProps } from './$types'
	import History from './history/history.svelte'

	const { data }: PageProps = $props()
</script>

<svelte:head>
	<title>ختم قرآن</title>
	<meta
		name="description"
		content="از طریق این سامانه می‌توانید به صورت گروهی ختم قرآن انجام دهید؛ و وضعیت بازه‌های قرائت شده را رصد کنید."
	/>
	<meta property="og:image" content="https://khatm.esangar.ir/hero.png" />
</svelte:head>

<div class="hero mt-7">
	<div class="hero-content flex flex-col text-center sm:flex-row">
		<img
			src="/hero.png"
			class="h-auto max-w-50 rounded-lg shadow-2xl"
			width="250"
			height="250"
			alt="logo"
		/>
		<div class="max-w-md">
			<h1 class="text-5xl font-black">ختم قرآن</h1>
			<p class="py-6">
				از طریق این سامانه می‌توانید به صورت گروهی ختم قرآن انجام دهید؛ و وضعیت بازه‌های قرائت شده
				را رصد کنید.
			</p>
			<a class="btn btn-primary font-bold" href="/add">ایجاد ختم قرآن جدید</a>
			<a class="btn btn-outline font-bold" href="/add?rangeType=ayah">ایجاد ختم آیه به آیه</a>
		</div>
	</div>
</div>

<History limit={3} title="آخرین مشارکت‌های شما" />

<section class="card card-border bg-base-100 mt-4">
	<div class="card-body">
		<h2 class="card-title">آخرین ختم‌های ثبت شده</h2>
		<ul class="list">
			{#each data.khatms as khatm}
				<li class="">
					<a class="list-row w-full hover:bg-green-500/15" href="/khatm/{khatm.id}">
						{khatm.title}
						{#if khatm.rangeType === 'ayah'}
							<span class="badge badge-xs badge-info">آیه به آیه</span>
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	</div>
</section>
