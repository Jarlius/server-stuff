const routes = [
	{ path: '/', redirect: '/blue' },
	{ path: '/blue', component: Vue.component('blue') },
	{ path: '/red', component: Vue.component('red') },
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
