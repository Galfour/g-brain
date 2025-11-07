<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import LocaleSelector from '$lib/component/LocaleSelector.svelte';
	import { m } from '$lib/paraglide/messages.js';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="nav">
	<div class="container nav__inner">
		<div class="brand">g-brain</div>
		<div class="nav__links">
			<a href="/">{m.nav_home()}</a>
			<a href="/levels/list">{m.nav_levels()}</a>
			<a href="/stats">{m.nav_stats()}</a>
			<LocaleSelector />
		</div>
	</div>
</nav>

<main class="main container">
	{@render children?.()}
</main>
