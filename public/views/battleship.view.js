Vue.component('route-battleship', {
	data() {
		return {
			color: this.$route.params.color,
			size: 9,
			ships: [0,0,0,0],
			turn: 0,
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
			<div v-for="n in 4">
				{{ n+1 }}: <span class="data">{{ ships[n-1] }}</span><br><br>
			</div>
			<br>
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
