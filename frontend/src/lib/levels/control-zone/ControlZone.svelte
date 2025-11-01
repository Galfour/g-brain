<script lang="ts">
	import Row from '$lib/component/Row.svelte';
	import Column from '$lib/component/Column.svelte';
	import Card from '$lib/component/Card.svelte';
	import Button from '$lib/component/Button.svelte';
	import Title from '$lib/component/Title.svelte';
	import Subtitle from '$lib/component/Subtitle.svelte';
	import type { ControlZoneConfig, Transform } from './types';

	let { config, children }: { config: ControlZoneConfig; children?: any } = $props();

	// Player state: only x, y
	const playerState = $state({
		x: config.initialPlayerPos.x,
		y: config.initialPlayerPos.y
	});

	// Transform states (initialized from config)
	const transformStates = $state<Transform[]>(
		config.transforms.map(t => ({ ...t }))
	);

	// Apply all transforms in sequence to compute final player position
	const finalPlayerPos = $derived.by(() => {
		let x = playerState.x;
		let y = playerState.y;

		for (const transform of transformStates) {
			switch (transform.type) {
				case 'translation': {
					// Convert direction (degrees) and distance to dx/dy
					// 0 degrees = right, 90 degrees = down, 180 degrees = left, 270 degrees = up
					const rad = (transform.direction * Math.PI) / 180;
					const dx = transform.distance * Math.cos(rad);
					const dy = transform.distance * Math.sin(rad);
					x += dx;
					y += dy;
					break;
				}
				case 'rotation': {
					const rad = (transform.angle * Math.PI) / 180;
					const cos = Math.cos(rad);
					const sin = Math.sin(rad);
					
					// Translate point to origin (center of rotation)
					const dx = x - transform.centerX;
					const dy = y - transform.centerY;
					
					// Rotate
					const newDx = dx * cos - dy * sin;
					const newDy = dx * sin + dy * cos;
					
					// Translate back
					x = transform.centerX + newDx;
					y = transform.centerY + newDy;
					break;
				}
				case 'scaling': {
					x *= transform.scaleX;
					y *= transform.scaleY;
					break;
				}
			}
		}

		// Clamp to bounds (0-600)
		x = Math.max(0, Math.min(600, x));
		y = Math.max(0, Math.min(600, y));

		return { x, y };
	});

	// Check if player is in target zone
	const isInTarget = $derived(
		finalPlayerPos.x >= config.targetZone.x - config.targetZone.width / 2 &&
		finalPlayerPos.x <= config.targetZone.x + config.targetZone.width / 2 &&
		finalPlayerPos.y >= config.targetZone.y - config.targetZone.height / 2 &&
		finalPlayerPos.y <= config.targetZone.y + config.targetZone.height / 2
	);

	// Handle button click: modify transform property
	function handleButtonClick(buttonId: string) {
		const button = config.buttons.find(b => b.id === buttonId);
		if (!button) return;

		const transform = transformStates.find(t => t.id === button.transformId);
		if (!transform) return;

		// Get current value
		const currentValue = (transform as any)[button.property];
		if (currentValue === undefined) return;

		// Calculate new value
		let newValue = currentValue + button.increment;

		// Apply limits if specified
		if (button.minValue !== undefined) {
			newValue = Math.max(button.minValue, newValue);
		}
		if (button.maxValue !== undefined) {
			newValue = Math.min(button.maxValue, newValue);
		}

		// Also apply transform-specific limits
		if (transform.type === 'rotation') {
			if (transform.minAngle !== undefined) {
				newValue = Math.max(transform.minAngle, newValue);
			}
			if (transform.maxAngle !== undefined) {
				newValue = Math.min(transform.maxAngle, newValue);
			}
		}

		if (transform.type === 'translation') {
			if (transform.minDistance !== undefined) {
				newValue = Math.max(transform.minDistance, newValue);
			}
			if (transform.maxDistance !== undefined) {
				newValue = Math.min(transform.maxDistance, newValue);
			}
		}

		// Update transform property
		(transform as any)[button.property] = newValue;
	}

	// Reset everything
	function reset() {
		playerState.x = config.initialPlayerPos.x;
		playerState.y = config.initialPlayerPos.y;
		transformStates.forEach((transform, i) => {
			const original = config.transforms[i];
			Object.assign(transform, { ...original });
		});
	}
</script>

<Column gap="var(--space-6)">
	<Column gap="var(--space-2)">
		<Title>{config.title}</Title>
		<Subtitle>{config.subtitle}</Subtitle>
	</Column>

	<Row gap="var(--space-6)">
		<Card>
			<Column gap="var(--space-4)">
				<div class="subtitle">Controls</div>
				<Column gap="var(--space-3)">
					{#each config.buttons as btn}
						<Button onclick={() => handleButtonClick(btn.id)}>
							{btn.label}
						</Button>
					{/each}
				</Column>
				<div style="margin-top: var(--space-2);">
					<Button onclick={reset} variant="ghost">
						Reset
					</Button>
				</div>
				{#if isInTarget}
					<div style="color: var(--color-primary); font-weight: 700; margin-top: var(--space-2);">
						Target reached! ✔
					</div>
				{/if}
			</Column>
		</Card>

		<Card>
			<Column gap="var(--space-4)">
				<div class="subtitle">Display Zone</div>
				<div
					style="position: relative; width: 600px; height: 600px; background: var(--color-bg); border: 2px solid var(--color-border); border-radius: var(--radius-sm); overflow: hidden;"
				>
					<!-- Obstacles -->
					{#each config.obstacles as obstacle}
						<div
							style="position: absolute; left: {obstacle.x}px; top: {obstacle.y}px; width: {obstacle.width}px; height: {obstacle.height}px; background: var(--color-elevated); border: 2px solid var(--color-border); pointer-events: none;"
						></div>
					{/each}

					<!-- Target Zone -->
					<div
						style="position: absolute; left: {config.targetZone.x - config.targetZone.width / 2}px; top: {config.targetZone.y - config.targetZone.height / 2}px; width: {config.targetZone.width}px; height: {config.targetZone.height}px; border: 3px dashed var(--color-primary); border-radius: var(--radius-sm); background: color-mix(in oklab, var(--color-primary), transparent 90%); pointer-events: none;"
					></div>

					<!-- Player Icon -->
					<div
						style="position: absolute; left: {finalPlayerPos.x - 10}px; top: {finalPlayerPos.y - 10}px; width: 20px; height: 20px; background: var(--color-primary); border-radius: 50%; transition: left 0.3s ease-out, top 0.3s ease-out; pointer-events: none;"
					></div>
				</div>
			</Column>
		</Card>
	</Row>

	{@render children?.()}
</Column>
