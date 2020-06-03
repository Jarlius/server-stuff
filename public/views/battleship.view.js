Vue.component('route-battleship', {
	data() {
		return {
			color: this.$route.params.color,
			size: 9,
			ships: [0,0,0,0],
			turn: 0,
			state: '',
			blue_board: [],
			red_board: [],
		}
	},
	methods: {
		tileClick(number) {
			fetch('/api/tileclick', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({number: number, color: this.color})
			})
			.then(res => res.json())
			.then(data => {
				this.state = data.state;
				if (data.tile.number != 0) {
					// Using Vue.set forces all state updates, only way to trigger arrays
					if (this.currentBoard() === 'blue')
						Vue.set(this.blue_board, data.tile.number-1, data.tile.color);
					else
						Vue.set(this.red_board, data.tile.number-1, data.tile.color);
				}
			});
		},
		controlButton() {
			fetch('/api/control', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({color: this.color})
			})
			.then(res => res.json())
			.then(data => {
				this.state = data.state;
			});
		},
		currentBoard() {
			switch (this.state) {
			case 'blueprep':
				if (this.color === 'blue')
					return 'blue';
				break;
			case 'redprep':
				if (this.color === 'red')
					return 'red';
				break;
			case 'blueturn':
				return 'blue';
			case 'blueend':
				return 'blue';
			case 'redturn':
				return 'red';
			case 'redend':
				return 'red';
			}
			return 'none';
		},
		tileColor(number) {
			var color;
			var board = this.currentBoard();
			if (board === 'blue')
				color = this.blue_board[number-1];
			if (board === 'red')
				color = this.red_board[number-1];
			switch(color) {
			case 0:
				return 'beige';
			case 1:
				return 'green';
			}
			return '';
		}
	},
	created() {
		fetch(`/api/state/${this.color}`)
			.then(res => res.json())
			.then(data => {
				this.state = data.state;
				this.size = data.size;
				this.blue_board = Array(data.size*data.size).fill(0);
				this.red_board = Array(data.size*data.size).fill(0);
				for (var i=0; i < data.boards.blue.length; i++) {
					this.blue_board[data.boards.blue[i].number - 1] = data.boards.blue[i].color;
				}
				for (var i=0; i < data.boards.red.length; i++) {
					this.red_board[data.boards.red[i].number - 1] = data.boards.red[i].color;
				}
			});
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
			<div
				v-if="currentBoard() !== 'none'"
				:class="'grid-container gameboard ' + currentBoard()"
				:style="'grid-template-columns: repeat(' + size + ', auto);'"
			>
				<div v-for="n in size*size">
					<div
						:class="'grid-item tile ' + tileColor(n)"
						v-on:click="tileClick(n)"
					>
					</div>
				</div>
			</div>
			<button v-if="state === 'start'" v-on:click="controlButton()">
				Start game
			</button>
		</div>
	</div>`
});
