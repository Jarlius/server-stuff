const routes = [
	{ path: '/', component: Vue.component('test') },
];

// Docs: https://router.vuejs.org/guide
const router = new VueRouter({
	routes
});

// Docs: https://vuejs.org/v2/guide
const app = new Vue({
//	el: '#app',
	router,
	data: {
		message: 'Hello Vue!'
	}
}).$mount('#app');
