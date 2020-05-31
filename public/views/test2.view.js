Vue.component('test2', {
	data() {
		return {
			text: "Test 2",
		}
	},
	created() {
		console.log('test?');
	},
	template: `
	<div>
		{{ text }}
		<button v-on:click="$root.redirect('/test1')">switch</button>
	</div>
	`
});
