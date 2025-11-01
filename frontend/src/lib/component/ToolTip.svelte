<script lang="ts">
	import { onMount } from 'svelte';
	
	type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
	
	let { 
		text = '', 
		style = '', 
		position: preferredPosition = 'top',
		children 
	} = $props<{ 
		text?: string; 
		style?: string; 
		position?: TooltipPosition;
		children?: () => any 
	}>();

	let tooltipElement: HTMLSpanElement | undefined = $state();
	let bubbleElement: HTMLSpanElement | undefined = $state();
	let actualPosition = $state<TooltipPosition>(preferredPosition);
	let isVisible = $state(false);
	let showTimeout: ReturnType<typeof setTimeout> | null = $state(null);

	function calculatePosition() {
		if (!tooltipElement || !bubbleElement || !isVisible) return;

		const rect = tooltipElement.getBoundingClientRect();
		const bubbleRect = bubbleElement.getBoundingClientRect();
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;
		const padding = 8;

		let position: TooltipPosition = preferredPosition;
		let left = 0;
		let top = 0;

		// Calculate positions for each direction
		const positions: Record<TooltipPosition, { left: number; top: number; valid: boolean }> = {
			top: {
				left: rect.left + rect.width / 2 - bubbleRect.width / 2,
				top: rect.top - bubbleRect.height - padding,
				valid: rect.top - bubbleRect.height - padding >= 0
			},
			bottom: {
				left: rect.left + rect.width / 2 - bubbleRect.width / 2,
				top: rect.bottom + padding,
				valid: rect.bottom + bubbleRect.height + padding <= viewportHeight
			},
			left: {
				left: rect.left - bubbleRect.width - padding,
				top: rect.top + rect.height / 2 - bubbleRect.height / 2,
				valid: rect.left - bubbleRect.width - padding >= 0
			},
			right: {
				left: rect.right + padding,
				top: rect.top + rect.height / 2 - bubbleRect.height / 2,
				valid: rect.right + bubbleRect.width + padding <= viewportWidth
			}
		};

		// Try preferred position first
		const prefPos = positions[preferredPosition as TooltipPosition];
		if (prefPos?.valid) {
			position = preferredPosition;
		} else {
			// Try alternatives in order
			const alternatives: TooltipPosition[] = 
				preferredPosition === 'top' ? ['bottom', 'left', 'right']
				: preferredPosition === 'bottom' ? ['top', 'left', 'right']
				: preferredPosition === 'left' ? ['right', 'top', 'bottom']
				: ['left', 'top', 'bottom'];
			
			for (const alt of alternatives) {
				if (positions[alt]?.valid) {
					position = alt;
					break;
				}
			}
		}

		// Adjust horizontal position to keep within viewport
		const pos = positions[position]!;
		left = pos.left;
		top = pos.top;

		// Clamp left/right to viewport bounds
		if (position === 'top' || position === 'bottom') {
			left = Math.max(padding, Math.min(left, viewportWidth - bubbleRect.width - padding));
		} else {
			top = Math.max(padding, Math.min(top, viewportHeight - bubbleRect.height - padding));
		}

		actualPosition = position;
		bubbleElement.style.left = `${left}px`;
		bubbleElement.style.top = `${top}px`;
		bubbleElement.style.transform = position === 'top' || position === 'bottom' 
			? 'translateX(-50%)' 
			: 'translateY(-50%)';
	}

	function handleMouseEnter() {
		if (showTimeout) clearTimeout(showTimeout);
		showTimeout = setTimeout(() => {
			isVisible = true;
			// Use requestAnimationFrame to ensure DOM is updated
			requestAnimationFrame(() => {
				calculatePosition();
			});
		}, 300); // Small delay before showing
	}

	function handleMouseLeave() {
		if (showTimeout) {
			clearTimeout(showTimeout);
			showTimeout = null;
		}
		isVisible = false;
	}

	onMount(() => {
		// Recalculate on scroll/resize
		const handleResize = () => {
			if (isVisible) {
				calculatePosition();
			}
		};
		
		window.addEventListener('resize', handleResize);
		window.addEventListener('scroll', handleResize, true);
		
		return () => {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('scroll', handleResize, true);
			if (showTimeout) clearTimeout(showTimeout);
		};
	});
</script>

<span 
	class="tooltip" 
	style={style}
	bind:this={tooltipElement}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	role="button"
	tabindex="0"
>
	{@render children?.()}
	{#if text}
		<span 
			class="tooltip__bubble tooltip__bubble--{actualPosition} {isVisible ? 'visible' : ''}"
			bind:this={bubbleElement}
		>{text}</span>
	{/if}
</span>


