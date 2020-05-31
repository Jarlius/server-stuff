const routes = [
	{ path: '/', redirect: '/test1' },
	{ path: '/test1', component: Vue.component('test1') },
	{ path: '/test2', component: Vue.component('test2') },
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
