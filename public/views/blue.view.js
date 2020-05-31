Vue.component('blue', {
	data() {
		return {
			text: "Blue player",
		}
	},
	created() {
		console.log('blue');
	},
	template: `
	<div class="blueboard">
		{{ text }}
		<button v-on:click="$root.redirect('/red')">switch</button>
	</div>
	`
});
