<script lang="ts">
	let {
		open = false,
		title = '',
		onclose,
		style = '',
		children
	} = $props<{
		open?: boolean;
		title?: string;
		onclose?: () => void;
		style?: string;
		children?: () => any;
	}>();

	function close() {
		if (onclose) onclose();
	}
</script>


{#if open}
	<div class="modal" role="dialog" aria-modal="true" tabindex="-1" style={style} onclick={(e) => { if (e.target === e.currentTarget) close(); }} onkeydown={(e) => { if (e.key === 'Escape') close(); }}>
		<div class="modal__dialog">
			{#if title}
				<div class="title" style="margin-bottom: var(--space-4);">{title}</div>
			{/if}
			<div>
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}


