Vue.component('route-battleship', {
	data() {
		return {
			socket: null,
			color: this.$route.params.color,
			size: 0,
			score: [],
			turn: 0,
			state: '',
			boards: [],
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
				for (var i in data.tiles) {
					// Using Vue.set forces all state updates, only way to trigger arrays
					Vue.set(
						this.boards[this.currentBoard()],
						data.tiles[i].number,
						data.tiles[i].color
					);
				}
			});
		},
		controlButton() {
			this.socket.emit('control', {color: this.color});
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
			switch(this.boards[this.currentBoard()][number-1]) {
			case 0:
				return 'beige';
			case 1:
				return 'green';
			case 2:
				return 'orange';
			case 3:
				return 'black';
			}
			return '';
		}
	},
	created() {
		this.socket = io().connect();
		this.socket.on('control', data => {
			this.state = data.state;
			this.score = data.score;
			this.boards = data.boards;
		});
		fetch(`/api/state/${this.color}`)
			.then(res => res.json())
			.then(data => {
				this.state = data.state;
				this.size = data.size;
				this.score = data.score;
				this.boards = data.boards;
			});
		this.socket.emit('created', {color: this.color});
	},
	template: `
	<div class="grid-container origin">
		<div class="grid-item" id="sidebar">
			Ships:<br><br>
			<div v-for="val in score">
				{{ val[0] }}: <span class="data">{{ val[1] }}</span><br><br>
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
						v-on:click="tileClick(n-1)"
					>
					</div>
				</div>
			</div>
			<button v-if="state === 'start'" v-on:click="controlButton()">
				Start game
			</button>
			<button v-if="state === currentBoard() + 'prep'" v-on:click="controlButton()">
				End preparation
			</button>
			<div v-if="state === 'bluewin' || state === 'redwin'">
				<button v-on:click="controlButton()">
					Quit
				</button>
			</div>
		</div>
	</div>`
});
