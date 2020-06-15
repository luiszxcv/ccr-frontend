import Vue from "vue";
import VueRouter from "vue-router";
import AuthRequired from "./utils/AuthRequired";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "app" */ './views/app'),
    redirect: '/app',
    beforeEnter: AuthRequired,
    children: [
      {
        path: 'app',
        component: () => import(/* webpackChunkName: "inicio" */ './views/app/time'),
        redirect: '/app/time/time',
        children: [
          { path: '', component: () => import(/* webpackChunkName: "inicio" */ './views/app/time/time') },
        ]
      },
      {
        path: 'app/informes',
        component: () => import(/* webpackChunkName: "informes" */ './views/app/informes'),
        redirect: '/app/informes/informes',
        children: [
          { path: 'sing', component: () => import(/* webpackChunkName: "second-menu" */ './views/app/informes/sing') },
          { path: 'avisos', component: () => import(/* webpackChunkName: "second-menu" */ './views/app/informes/avisos') },
        ]
      },
      {
        path: 'app/time',
        component: () => import(/* webpackChunkName: "meu-time" */ './views/app/time'),
        redirect: '/app/time/time',
        children: [
          { path: '', component: () => import(/* webpackChunkName: "meu-time" */ './views/app/time/time') },
        ]
      },
    ]
  },
  { path: '/error', component: () => import(/* webpackChunkName: "error" */ './views/Error') },
  {
    path: '/user',
    component: () => import(/* webpackChunkName: "user" */ './views/user'),
    redirect: '/user/login',
    children: [
      { path: 'login', component: () => import(/* webpackChunkName: "user" */ './views/user/Login') },
      { path: 'register', component: () => import(/* webpackChunkName: "user" */ './views/user/Register') },
      { path: 'forgot-password', component: () => import(/* webpackChunkName: "user" */ './views/user/ForgotPassword') }
    ]
  },
  { path: '*', component: () => import(/* webpackChunkName: "error" */ './views/Error') }
]

const router = new VueRouter({
  linkActiveClass: "active",
  routes,
  mode: "history" //mode: "hash""history"
});

export default router;
