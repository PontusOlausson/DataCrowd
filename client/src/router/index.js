import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginView from '../views/Login.vue';
import AdminView from '../views/Admin.vue';
import GenUttrView from '../views/GenerateUtterance.vue';
import JudgementView from '../views/Judgement.vue';
import SystemResponseView from '../views/SystemResponse.vue';
import store from '../store';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/genUttr' },
  { path: '/login', component: LoginView },
  { path: '/admin', component: AdminView },
  { path: '/genUttr', component: GenUttrView },
  { path: '/judge', component: JudgementView },
  { path: '/sysres', component: SystemResponseView },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

// Setup Authentication guard
router.beforeEach((to, from, next) => {
  if (store.state.isAuthenticated || to.path === '/login') {
    next();
  } else {
    console.info('Unauthenticated user. Redirecting to login page.');
    next('/login');
  }
});

export default router;
