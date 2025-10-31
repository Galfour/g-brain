<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="nav">
	<div class="container nav__inner">
		<div class="brand">g-brain</div>
		<div class="nav__links">
			<a href="/">Home</a>
			<a href="/levels/list">Levels</a>
		</div>
	</div>
</nav>

<main class="main container">
	{@render children?.()}
</main>
