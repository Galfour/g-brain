<script lang="ts">
	import { getLocale, setLocale, locales, type Locale } from '$lib/paraglide/runtime';

	let currentLocale = $state(getLocale());
	let isOpen = $state(false);
	let dropdownElement: HTMLDivElement | undefined = $state();
	let triggerElement: HTMLButtonElement | undefined = $state();

	function handleLocaleChange(locale: (typeof locales)[number]) {
		setLocale(locale);
		currentLocale = locale;
		isOpen = false;
	}

	function handleTriggerClick(event: MouseEvent) {
		event.stopPropagation();
		isOpen = !isOpen;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as Node;
		if (
			dropdownElement &&
			!dropdownElement.contains(target) &&
			triggerElement &&
			!triggerElement.contains(target)
		) {
			isOpen = false;
		}
	}

	$effect(() => {
		if (isOpen) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});
</script>

<div class="locale-selector">
	<button
		class="locale-selector__trigger"
		bind:this={triggerElement}
		onclick={handleTriggerClick}
		aria-expanded={isOpen}
		aria-haspopup="true"
	>
		{currentLocale.toUpperCase()}
	</button>
	{#if isOpen}
		<div class="locale-selector__dropdown" bind:this={dropdownElement}>
			{#each locales as locale}
				<button
					class="locale-selector__option"
					class:locale-selector__option--active={locale === currentLocale}
					onclick={() => handleLocaleChange(locale)}
				>
					{locale.toUpperCase()}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.locale-selector {
		position: relative;
	}

	.locale-selector__trigger {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 6px 12px;
		border-radius: var(--radius-sm);
		background: var(--color-elevated);
		border: 1px solid var(--color-border);
		color: var(--color-text);
		font-weight: 600;
		font-size: 13px;
		cursor: pointer;
		transition: background 120ms ease, border-color 120ms ease;
	}

	.locale-selector__trigger:hover {
		background: color-mix(in oklab, var(--color-elevated), #ffffff 5%);
		border-color: var(--color-primary);
	}

	.locale-selector__dropdown {
		position: absolute;
		top: calc(100% + var(--space-2));
		right: 0;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		box-shadow: var(--shadow-md);
		min-width: 80px;
		overflow: hidden;
		z-index: 100;
	}

	.locale-selector__option {
		display: block;
		width: 100%;
		padding: 8px 12px;
		text-align: left;
		background: transparent;
		color: var(--color-text);
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		transition: background 120ms ease, color 120ms ease;
	}

	.locale-selector__option:hover {
		background: var(--color-elevated);
	}

	.locale-selector__option--active {
		background: var(--color-elevated);
		color: var(--color-primary);
	}
</style>

