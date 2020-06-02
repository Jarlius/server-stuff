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
			test(msg) {
					fetch('/api/test', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({msg: msg})
					})
					.then(res => res.json())
					.then(data => {
						console.log(data.ans);
					});
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
					<div class="grid-item tile" v-on:click="test(n)"></div>
				</div>
			</div>
		</div>
	</div>`
});
