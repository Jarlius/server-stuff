Vue.component('route-battleship', {
	data() {
		return {
			color: this.$route.params.color,
			size: 9,
		}
	},
	methods: {
			print(msg) {
					console.log(msg);
			}
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
		<div class="grid-item" :id="color + '-background'">
			<h1>Battleship!</h1>
			<h2>{{ color }} player</h2>
			<div :class="'grid-container gameboard '+color" :style="'grid-template-columns: repeat(' + size + ', auto);'">
				<div v-for="n in size*size">
					<div class="grid-item tile" v-on:click="print(n)"></div>
				</div>
			</div>
		</div>
	</div>`
});
