Vue.component('red', {
	data() {
		return {
			text: "Red player",
		}
	},
	created() {
		console.log('red');
	},
	template: `
	<div class="grid-container origin">
		<div class="grid-item" id="sidebar">
			Ships:<br><br>
			2: <span id="s1" class="data">0</span><br><br>
			3: <span id="s2" class="data">0</span><br><br>
			4: <span id="s3" class="data">0</span><br><br>
			5: <span id="s4" class="data">0</span><br><br><br>
			Turn: <span id="turn" class="data">0</span>
		</div>
		<div class="grid-item" id="red-background">
			<h2>Battleship!</h2>
			<div class="grid-container gameboard red">
				<div class="grid-item">{{ text }}</div>
				<div class="grid-item">
					<button v-on:click="$root.redirect('/blue')">switch</button>
				</div>
			</div>
		</div>
	</div>`
});
