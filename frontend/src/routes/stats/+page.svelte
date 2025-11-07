<script lang="ts">
	import Column from '$lib/component/Column.svelte';
	import Row from '$lib/component/Row.svelte';
	import Card from '$lib/component/Card.svelte';
	import Title from '$lib/component/Title.svelte';
	import Subtitle from '$lib/component/Subtitle.svelte';
	import {
		getPlayerData,
		getCurrentPlayer,
		getAllPlayerNames,
		createNewPlayer,
		switchPlayer,
		renamePlayer,
		clearPlayerData
	} from '$lib/player-data';
	import type { LevelStart, LevelCompletion, PlayerData } from '$lib/player-data';

	let currentPlayerName = $state('');
	let allPlayers = $state<string[]>([]);
	const playerData = $state<PlayerData>({ userName: '', levelStarts: [], levelCompletions: [] });
	let editingName = $state(false);
	let nameInput = $state(playerData.userName);

	// Initialize and refresh player data
	$effect(() => {
		const current = getCurrentPlayer();
		const players = getAllPlayerNames();
		allPlayers = players;
		
		if (!current && players.length === 0) {
			// No players exist, create a new one
			const newName = createNewPlayer();
			currentPlayerName = newName;
			allPlayers = getAllPlayerNames();
			const data = getPlayerData(newName);
			playerData.userName = data.userName;
			playerData.levelStarts = data.levelStarts;
			playerData.levelCompletions = data.levelCompletions;
			nameInput = data.userName;
		} else if (!current && players.length > 0) {
			// If no current player but players exist, switch to first one
			switchPlayer(players[0]);
			currentPlayerName = players[0];
			const data = getPlayerData(players[0]);
			playerData.userName = data.userName;
			playerData.levelStarts = data.levelStarts;
			playerData.levelCompletions = data.levelCompletions;
			nameInput = data.userName;
		} else if (current) {
			// Refresh current player data
			currentPlayerName = current;
			const data = getPlayerData(current);
			playerData.userName = data.userName;
			playerData.levelStarts = data.levelStarts;
			playerData.levelCompletions = data.levelCompletions;
			nameInput = data.userName;
		}
	});

	function handlePlayerChange(name: string) {
		if (name === '__new__') {
			const newName = createNewPlayer();
			currentPlayerName = newName;
			allPlayers.length = 0;
			allPlayers.push(...getAllPlayerNames());
			const data = getPlayerData(newName);
			playerData.userName = data.userName;
			playerData.levelStarts = data.levelStarts;
			playerData.levelCompletions = data.levelCompletions;
			nameInput = data.userName;
		} else {
			switchPlayer(name);
			currentPlayerName = name;
			const data = getPlayerData(name);
			playerData.userName = data.userName;
			playerData.levelStarts = data.levelStarts;
			playerData.levelCompletions = data.levelCompletions;
			nameInput = data.userName;
		}
		editingName = false;
	}

	function saveName() {
		const oldName = currentPlayerName;
		const newName = nameInput.trim();
		
		if (!newName || newName === oldName) {
			cancelEditName();
			return;
		}

		// Check if name already exists
		if (allPlayers.includes(newName)) {
			alert('A player with this name already exists!');
			return;
		}

		renamePlayer(oldName, newName);
		currentPlayerName = newName;
		// Update allPlayers list
		allPlayers.length = 0;
		allPlayers.push(...getAllPlayerNames());
		playerData.userName = newName;
		editingName = false;
	}

	function cancelEditName() {
		nameInput = playerData.userName;
		editingName = false;
	}

	function formatTime(timestamp: number): string {
		return new Date(timestamp).toLocaleString();
	}

	function formatDuration(ms: number): string {
		const seconds = Math.floor(ms / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);

		if (hours > 0) {
			return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
		} else if (minutes > 0) {
			return `${minutes}m ${seconds % 60}s`;
		} else {
			return `${seconds}s`;
		}
	}

	// Group starts and completions by level
	const levelDataMap = $derived.by(() => {
		const map = new Map<string, { starts: LevelStart[]; completions: LevelCompletion[] }>();
		
		for (const start of playerData.levelStarts) {
			if (!map.has(start.levelId)) {
				map.set(start.levelId, { starts: [], completions: [] });
			}
			map.get(start.levelId)!.starts.push(start);
		}
		
		for (const completion of playerData.levelCompletions) {
			if (!map.has(completion.levelId)) {
				map.set(completion.levelId, { starts: [], completions: [] });
			}
			map.get(completion.levelId)!.completions.push(completion);
		}
		
		return map;
	});

	// Summary stats
	const summary = $derived.by(() => {
		const uniqueLevelsStarted = new Set(playerData.levelStarts.map(s => s.levelId)).size;
		const totalCompletions = playerData.levelCompletions.length;
		const successfulCompletions = playerData.levelCompletions.filter(c => c.status === 'success').length;
		const failedCompletions = playerData.levelCompletions.filter(c => c.status === 'failure').length;
		const totalTimeSpent = playerData.levelCompletions.reduce((sum, c) => sum + c.timeSpent, 0);
		const avgTimePerCompletion = totalCompletions > 0 ? totalTimeSpent / totalCompletions : 0;

		return {
			uniqueLevelsStarted,
			totalCompletions,
			successfulCompletions,
			failedCompletions,
			totalTimeSpent,
			avgTimePerCompletion,
			successRate: totalCompletions > 0 ? (successfulCompletions / totalCompletions) * 100 : 0
		};
	});

	function clearData() {
		if (confirm('Are you sure you want to clear all player data for this player? This cannot be undone.')) {
			clearPlayerData(currentPlayerName);
			const data = getPlayerData(currentPlayerName);
			playerData.userName = data.userName;
			playerData.levelStarts = data.levelStarts;
			playerData.levelCompletions = data.levelCompletions;
			nameInput = data.userName;
		}
	}
</script>

<Column gap="var(--space-6)">
	<Column gap="var(--space-2)">
		<Title>Player Stats</Title>
		<Subtitle>Track your progress and performance</Subtitle>
	</Column>

	<!-- Player Picker -->
	<Card>
		<Column gap="var(--space-4)">
			<div class="subtitle">Select Player</div>
			<select
				value={currentPlayerName}
				onchange={(e) => handlePlayerChange((e.target as HTMLSelectElement).value)}
				style="padding: var(--space-2) var(--space-3); background: var(--color-elevated); border: 1px solid var(--color-border); border-radius: var(--radius-sm); color: var(--color-text); font-size: 16px; cursor: pointer;"
			>
				{#each allPlayers as player}
					<option value={player}>{player}</option>
				{/each}
				<option value="__new__">+ New Player</option>
			</select>
		</Column>
	</Card>

	<!-- User Name Section -->
	<Card>
		<Column gap="var(--space-4)">
			<div class="subtitle">User Name</div>
			{#if editingName}
				<Row gap="var(--space-3)" style="align-items: center;">
					<input
						type="text"
						bind:value={nameInput}
						style="flex: 1; padding: var(--space-2) var(--space-3); background: var(--color-elevated); border: 1px solid var(--color-border); border-radius: var(--radius-sm); color: var(--color-text);"
						onkeydown={(e) => {
							if (e.key === 'Enter') saveName();
							if (e.key === 'Escape') cancelEditName();
						}}
					/>
					<button class="btn btn--primary" onclick={saveName}>Save</button>
					<button class="btn btn--ghost" onclick={cancelEditName}>Cancel</button>
				</Row>
			{:else}
				<Row gap="var(--space-3)" style="align-items: center;">
					<div style="font-size: 18px; font-weight: 600;">
						{playerData.userName || '(No name set)'}
					</div>
					<button class="btn btn--ghost" onclick={() => editingName = true}>Edit</button>
				</Row>
			{/if}
		</Column>
	</Card>

	<!-- Summary Stats -->
	<Card>
		<Column gap="var(--space-4)">
			<div class="subtitle">Summary</div>
			<div class="grid grid--3">
				<div>
					<div style="font-size: 32px; font-weight: 700; color: var(--color-primary);">
						{summary.uniqueLevelsStarted}
					</div>
					<div style="color: var(--color-muted); font-size: 14px;">Levels Started</div>
				</div>
				<div>
					<div style="font-size: 32px; font-weight: 700; color: var(--color-primary);">
						{summary.totalCompletions}
					</div>
					<div style="color: var(--color-muted); font-size: 14px;">Total Completions</div>
				</div>
				<div>
					<div style="font-size: 32px; font-weight: 700; color: var(--color-primary);">
						{summary.successRate.toFixed(1)}%
					</div>
					<div style="color: var(--color-muted); font-size: 14px;">Success Rate</div>
				</div>
			</div>
			<div style="margin-top: var(--space-4); padding-top: var(--space-4); border-top: 1px solid var(--color-border);">
				<Row gap="var(--space-6)" style="flex-wrap: wrap;">
					<div>
						<div style="font-size: 18px; font-weight: 600;">
							{summary.successfulCompletions} success{summary.successfulCompletions !== 1 ? 'es' : ''}
						</div>
					</div>
					<div>
						<div style="font-size: 18px; font-weight: 600;">
							{summary.failedCompletions} failure{summary.failedCompletions !== 1 ? 's' : ''}
						</div>
					</div>
					<div>
						<div style="font-size: 18px; font-weight: 600;">
							{formatDuration(summary.totalTimeSpent)}
						</div>
						<div style="color: var(--color-muted); font-size: 14px;">Total Time</div>
					</div>
					<div>
						<div style="font-size: 18px; font-weight: 600;">
							{formatDuration(summary.avgTimePerCompletion)}
						</div>
						<div style="color: var(--color-muted); font-size: 14px;">Avg Time</div>
					</div>
				</Row>
			</div>
		</Column>
	</Card>

	<!-- Level Details -->
	<Card>
		<Column gap="var(--space-4)">
			<div class="subtitle">Level Details</div>
			{#if levelDataMap.size === 0}
				<div style="color: var(--color-muted); padding: var(--space-4); text-align: center;">
					No level data yet. Start playing levels to see your stats here!
				</div>
			{:else}
				<Column gap="var(--space-4)">
					{#each Array.from(levelDataMap.entries()).sort((a, b) => a[0].localeCompare(b[0])) as [levelId, data]}
						<div style="padding: var(--space-4); background: var(--color-elevated); border-radius: var(--radius-sm); border: 1px solid var(--color-border);">
							<Column gap="var(--space-3)">
								<div style="font-size: 18px; font-weight: 600;">{levelId}</div>
								
								{#if data.starts.length > 0}
									<div>
										<div style="font-size: 14px; color: var(--color-muted); margin-bottom: var(--space-2);">
											Started {data.starts.length} time{data.starts.length !== 1 ? 's' : ''}
										</div>
										<Column gap="var(--space-1)">
											{#each data.starts.sort((a, b) => b.startTime - a.startTime) as start}
												<div style="font-size: 12px; color: var(--color-muted);">
													{formatTime(start.startTime)}
												</div>
											{/each}
										</Column>
									</div>
								{/if}

								{#if data.completions.length > 0}
									<div>
										<div style="font-size: 14px; color: var(--color-muted); margin-bottom: var(--space-2); margin-top: var(--space-2);">
											Completed {data.completions.length} time{data.completions.length !== 1 ? 's' : ''}
										</div>
										<Column gap="var(--space-2)">
											{#each data.completions.sort((a, b) => b.completionTime - a.completionTime) as completion}
												<Row gap="var(--space-3)" style="align-items: center;">
													<div style="font-size: 12px; padding: var(--space-1) var(--space-2); background: {completion.status === 'success' ? 'color-mix(in oklab, var(--color-primary), transparent 80%)' : 'color-mix(in oklab, #ff6a6a, transparent 80%)'}; border-radius: var(--radius-sm); font-weight: 600;">
														{completion.status === 'success' ? '✓ Success' : '✗ Failure'}
													</div>
													<div style="font-size: 12px; color: var(--color-muted);">
														{formatTime(completion.completionTime)}
													</div>
													<div style="font-size: 12px; color: var(--color-muted);">
														({formatDuration(completion.timeSpent)})
													</div>
													{#if completion.scores && Object.keys(completion.scores).length > 0}
														<div style="font-size: 12px; color: var(--color-muted);">
															{Object.entries(completion.scores).map(([key, value]) => `${key}: ${value}`).join(', ')}
														</div>
													{/if}
												</Row>
											{/each}
										</Column>
									</div>
								{/if}
							</Column>
						</div>
					{/each}
				</Column>
			{/if}
		</Column>
	</Card>

	<!-- Clear Data Button -->
	<Card>
		<Column gap="var(--space-4)">
			<div class="subtitle">Danger Zone</div>
			<button class="btn btn--ghost" onclick={clearData} style="color: #ff6a6a;">
				Clear This Player's Data
			</button>
		</Column>
	</Card>
</Column>

