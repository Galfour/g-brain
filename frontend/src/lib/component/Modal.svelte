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

	let modalElement: HTMLDivElement | undefined = $state();
	let previousActiveElement: HTMLElement | null = $state(null);

	function getFocusableElements(container: HTMLElement): HTMLElement[] {
		const selector = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
		return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
			el => !el.hasAttribute('disabled') && !el.hasAttribute('aria-hidden')
		);
	}

	function trapFocus(e: KeyboardEvent) {
		if (e.key !== 'Tab' || !modalElement) return;

		const focusableElements = getFocusableElements(modalElement);
		if (focusableElements.length === 0) return;

		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];

		if (e.shiftKey) {
			// Shift + Tab
			if (document.activeElement === firstElement || document.activeElement === modalElement) {
				e.preventDefault();
				lastElement.focus();
			}
		} else {
			// Tab
			if (document.activeElement === lastElement) {
				e.preventDefault();
				firstElement.focus();
			}
		}
	}

	function close() {
		// Return focus to previous element before closing
		if (previousActiveElement && previousActiveElement.focus) {
			previousActiveElement.focus();
		}
		previousActiveElement = null;
		if (onclose) onclose();
	}

	// Handle focus when modal opens
	$effect(() => {
		if (open) {
			// Store the currently active element before modal opens
			if (!previousActiveElement) {
				previousActiveElement = document.activeElement as HTMLElement;
			}
			
			// Use setTimeout to ensure the modal element is rendered and bound
			setTimeout(() => {
				if (modalElement) {
					// Try to focus first focusable element if available
					const focusableElements = getFocusableElements(modalElement);
					if (focusableElements.length > 0) {
						focusableElements[0].focus();
					} else {
						// Fallback: focus the modal container
						modalElement.focus();
					}
				}
			}, 0);
		}
	});
</script>


{#if open}
	<div 
		class="modal" 
		role="dialog" 
		aria-modal="true" 
		tabindex="-1" 
		style={style} 
		bind:this={modalElement}
		onclick={(e) => { if (e.target === e.currentTarget) close(); }} 
		onkeydown={(e) => { 
			if (e.key === 'Escape') close();
			trapFocus(e);
		}}
	>
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


