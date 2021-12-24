import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login.vue'),
  },
  {
    path: '/assign',
    name: 'assign',
    component: () => import('@/views/assign/assignCar.vue'),
  },
  {
    path: '/return',
    name: 'return',
    component: () => import('@/views/return/returnCar.vue'),
  },
  {
    path: '/',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      // import(/* webpackChunkName: "about" */ '../views/About.vue'),
      import('@/views/layout/layout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/home/home.vue'),
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my/my.vue'),
      },
    ],
  },
]

const router = new VueRouter({
  routes,
})

export default router
