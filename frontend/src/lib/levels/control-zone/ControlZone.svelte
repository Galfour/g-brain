<script lang="ts">
	import Row from '$lib/component/Row.svelte';
	import Column from '$lib/component/Column.svelte';
	import Card from '$lib/component/Card.svelte';
	import Button from '$lib/component/Button.svelte';
	import Title from '$lib/component/Title.svelte';
	import Subtitle from '$lib/component/Subtitle.svelte';
	import type { ControlZoneConfig, Transform } from './types';
	import { m } from '$lib/paraglide/messages.js';

	let { config, oncomplete, children }: { config: ControlZoneConfig; oncomplete?: (status: 'success' | 'failure', scores?: Record<string, number>) => void; children?: any } = $props();

	// Player state: only x, y
	const playerState = $state({
		x: config.initialPlayerPos.x,
		y: config.initialPlayerPos.y
	});

	// Transform states (initialized from config)
	const transformStates = $state<Transform[]>(
		config.transforms.map(t => ({ ...t }))
	);
	
	// Track number of button clicks
	let clickCount = $state(0);

	// Calculate player position without clamping (for collision detection)
	function calculatePlayerPos(transforms: Transform[]): { x: number; y: number } {
		let x = playerState.x;
		let y = playerState.y;

		for (const transform of transforms) {
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

		return { x, y };
	}

	// Apply all transforms in sequence to compute final player position
	const finalPlayerPos = $derived.by(() => {
		const pos = calculatePlayerPos(transformStates);

		// Clamp to bounds (0-600)
		const x = Math.max(0, Math.min(600, pos.x));
		const y = Math.max(0, Math.min(600, pos.y));

		return { x, y };
	});

	// Check if player is in target zone
	const isInTarget = $derived(
		finalPlayerPos.x >= config.targetZone.x - config.targetZone.width / 2 &&
		finalPlayerPos.x <= config.targetZone.x + config.targetZone.width / 2 &&
		finalPlayerPos.y >= config.targetZone.y - config.targetZone.height / 2 &&
		finalPlayerPos.y <= config.targetZone.y + config.targetZone.height / 2
	);

	// Track if completion has been called to avoid multiple calls
	let completionCalled = $state(false);

	// Call oncomplete when player reaches target
	$effect(() => {
		if (isInTarget && !completionCalled && oncomplete) {
			completionCalled = true;
			const scores: Record<string, number> = { clicks: clickCount };
			oncomplete('success', scores);
		}
	});

	// Check if a position is out of bounds or in an obstacle
	function isPositionInvalid(pos: { x: number; y: number }): boolean {
		// Check out of bounds (0-600)
		if (pos.x < 0 || pos.x > 600 || pos.y < 0 || pos.y > 600) {
			return true;
		}

		// Check collision with obstacles
		for (const obstacle of config.obstacles) {
			const obstacleLeft = obstacle.x;
			const obstacleRight = obstacle.x + obstacle.width;
			const obstacleTop = obstacle.y;
			const obstacleBottom = obstacle.y + obstacle.height;

			if (
				pos.x >= obstacleLeft &&
				pos.x <= obstacleRight &&
				pos.y >= obstacleTop &&
				pos.y <= obstacleBottom
			) {
				return true;
			}
		}

		return false;
	}

	// Handle button click: modify transform property
	function handleButtonClick(buttonId: string) {
		const button = config.buttons.find(b => b.id === buttonId);
		if (!button) return;

		const transform = transformStates.find(t => t.id === button.transformId);
		if (!transform) return;

		// Get current value
		const currentValue = (transform as any)[button.property];
		if (currentValue === undefined) return;

		// Save entire state
		const savedPlayerState = { x: playerState.x, y: playerState.y };
		const savedTransformStates = transformStates.map(t => ({ ...t }));

		// Increment click count
		clickCount++;

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

		// Apply the change
		(transform as any)[button.property] = newValue;

		// Calculate new player position (without clamping)
		const newPos = calculatePlayerPos(transformStates);

		// Check if position is invalid (out of bounds or in obstacle)
		if (isPositionInvalid(newPos)) {
			// Reload saved state
			playerState.x = savedPlayerState.x;
			playerState.y = savedPlayerState.y;
			transformStates.forEach((t, i) => {
				Object.assign(t, savedTransformStates[i]);
			});
		}
		// Otherwise, the change is already applied and we're done
		// Reset completion flag when player makes a change
		completionCalled = false;
	}

	// Reset everything
	function reset() {
		playerState.x = config.initialPlayerPos.x;
		playerState.y = config.initialPlayerPos.y;
		transformStates.forEach((transform, i) => {
			const original = config.transforms[i];
			Object.assign(transform, { ...original });
		});
		// Reset completion flag and click count when player resets
		completionCalled = false;
		clickCount = 0;
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
				<div class="subtitle">{m.control_zone_controls()}</div>
				<Column gap="var(--space-3)">
					{#each config.buttons as btn}
						<Button onclick={() => handleButtonClick(btn.id)}>
							{btn.label}
						</Button>
					{/each}
				</Column>
				<div style="margin-top: var(--space-2);">
					<Button onclick={reset} variant="ghost">
						{m.control_zone_reset()}
					</Button>
				</div>
				{#if isInTarget}
					<div style="color: var(--color-primary); font-weight: 700; margin-top: var(--space-2);">
						{m.control_zone_target_reached()}
					</div>
				{/if}
			</Column>
		</Card>

		<Card>
			<Column gap="var(--space-4)">
				<div class="subtitle">{m.control_zone_display_zone()}</div>
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
