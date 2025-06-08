<button class="minecraft-button" on:click>
	<slot />
</button>

<style>
	.minecraft-button {
		font-family: 'Minecraftia', sans-serif;
		font-size: 16px;
		line-height: 22px;
		border: 2px solid;
		border-bottom-width: 4px;
		border-color: #a8a8a8 #565656 #565656 #a8a8a8;
		background-color: #727272;
		color: white;
		text-shadow: 2px 2px #342c34;
		cursor: pointer;
		pointer-events: all;
		box-shadow: 0 0 0 2px black;
	}

	.minecraft-button:hover {
		box-shadow: 0 0 0 2px white;
	}
</style>
