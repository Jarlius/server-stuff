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
	<div class = "redboard">
		{{ text }}
		<button v-on:click="$root.redirect('/blue')">switch</button>
	</div>
	`
});
