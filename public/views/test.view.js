Vue.component('test', {
	data() {
		return {
			text: "hoopla",
		}
	},
	created() {
		console.log('test?');
	},
	template: `
	<div>{{ text }}</div>
	`
});
