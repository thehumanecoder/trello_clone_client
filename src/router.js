import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import signup from './views/Signup.vue';
import login from './views/Login.vue';
import boards from './views/Boards.vue';
import board from './views/Board.vue';
import store from './store';

Vue.use(Router);
function isLoggedIn(to, from, next) {
  store.dispatch('auth/authenticate').then(() => {
    next();
  }).catch(() => {
    next('login');
  });
}
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter(to, from, next) {
        store.dispatch('auth/authenticate').then(() => {
          next('/boards');
        }).catch(() => {
          next('login');
        });
      },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: signup,
    },
    {
      path: '/login',
      name: 'login',
      component: login,
    },
    {
      path: '/boards',
      name: 'boards',
      component: boards,
      beforeEnter: isLoggedIn,
    },
    {
      path: '/boards/:id',
      name: 'board',
      component: board,
      beforeEnter: isLoggedIn,
    },
  ],
});
