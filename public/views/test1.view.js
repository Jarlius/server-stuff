Vue.component('test1', {
	data() {
		return {
			text: "Test 1",
		}
	},
	created() {
		console.log('blue');
	},
	template: `
	<div class="blueboard">
		{{ text }}
		<button v-on:click="$root.redirect('/test2')">switch</button>
	</div>
	`
});
