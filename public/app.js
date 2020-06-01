const routes = [
	{ path: '/', redirect: '/battleship/blue' },
	{ path: '/battleship/:color', component: Vue.component('route-battleship') },
];

// Docs: https://router.vuejs.org/guide
const router = new VueRouter({
	routes
});

// Docs: https://vuejs.org/v2/guide
const app = new Vue({
//	el: '#app',
	router,
	methods: {
		redirect(target) {
			// Used in the navigation
			this.$router.push(target);
		}
	},
	data: {
		message: 'Hello Vue!'
	}
}).$mount('#app');
