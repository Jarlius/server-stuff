Vue.component('route-battleship', {
	data() {
		return {
			socket: null,
			color: this.$route.params.color,
			size: 0,
			score: [],
			turn: 0,
			state: '',
			player: 0,
			boards: [[],[]],
		}
	},
	methods: {
		tileClick(number) {
			this.socket.emit('click', {number: number, color: this.color});
		},
		controlButton() {
			this.socket.emit('control', {color: this.color});
		},
		boardColor() {
			if (this.player)
				return 'red';
			return 'blue';
		},
		tileColor(number) {
			switch(this.boards[this.player][number-1]) {
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
		this.socket.on('state', data => {
			this.state = data.state;
			this.player = data.player;
			this.turn = data.turn;
		});
		this.socket.on('control', data => {
			this.score = data.score;
			this.boards = data.tiles;
		});
		this.socket.on('click', data => {
			this.score = data.score;
			for (var i in data.tiles) {
				// Using Vue.set forces all state updates, only way to trigger arrays
				Vue.set(
					this.boards[this.player],
					data.tiles[i].number,
					data.tiles[i].color
				);
			}
		});
		fetch(`/api/state/${this.color}`)
			.then(res => res.json())
			.then(data => {
				this.state = data.state;
				this.player = data.player;
				this.turn = data.turn;
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
			Turn: <span id="turn" class="data">{{ turn }}</span>
		</div>
		<div
			:class="'grid-item background ' + color"
			:id="state === 'gameover' ? 'flash' : ''"
		>
			<h1>Battleship!</h1>
			<h2>{{ color }} player</h2>
			<div
				v-if="boards[player].length !== 0"
				:class="'grid-container gameboard ' + boardColor()"
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
			<div v-if="state === 'gameover'">
				<br>
				Player {{ boardColor() }} wins!!!
			</div>
			<div v-if="state === 'start' || state === 'prep' || state === 'gameover'">
				<br>
				<button v-if="state === 'start'" v-on:click="controlButton()">
					Start game
				</button>
				<button v-if="state === 'prep'" v-on:click="controlButton()">
					End preparation
				</button>
				<button v-if="state === 'gameover'" v-on:click="controlButton()">
					Quit
				</button>
			</div>
		</div>
	</div>`
});
