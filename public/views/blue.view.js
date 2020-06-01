Vue.component('blue', {
	data() {
		return {
			text: "Blue player",
			dim: 9,
		}
	},
	created() {
		console.log('blue');
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
		<div class="grid-item" id="blue-background">
			<h1>Battleship!</h1>
			<h2>{{ text }}</h2>
			<div class="grid-container gameboard blue" :style="'grid-template-columns: repeat(' + dim + ', auto);'">
				<div v-for="n in dim*dim">
					<div class="grid-item tile"></div>
				</div>
			</div>
			<button v-on:click="$root.redirect('/red')">switch</button>
		</div>
	</div>`
});
