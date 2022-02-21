import Vue from 'vue'
import VueRouter from 'vue-router'
import { Toast, Dialog } from 'vant'
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
      // {
      //   path: '',
      //   name: 'login',
      //   component: () => import('@/views/login/login.vue'),
      // },
      // {
      //   path: '',
      //   name: 'login',
      //   component: () => import('@/views/login/loginTest.vue'),
      // },
      {
        path: '',
        name: 'home',
        component: () => import('@/views/home/home.vue'),
      },
      {
        path: '/driverHome',
        name: 'driverHome',
        component: () => import('@/views/home/driverHome.vue'),
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

// 路由导航守卫:也就是所有页面的导航都会经过这里
// to: 要去的路由信息
// from: 来自哪里的路由信息
// next: 放行方法(符合通过条件可调用放行)
router.beforeEach((to, from, next) => {
  console.log('to:', to)
  // 用户登录状态信息
  let user = window.localStorage.getItem('memberID')
  console.log('user:', user)
  // 单位登录状态信息
  // let unitUser = store.getters.getUnitToken
  // let userID = window.localStorage.getItem('memberID')
  // console.log('unitToken', unitUser)
  //   // 验证下单页面的登录状态
  if (to.path == '/') {
    if (user) {
      next()
    } else {
      // 没有登录信息,跳转到登陆页面
      // Toast.loading({
      //   message: '请先登录,正在跳转到登录页面...',
      //   forbidClick: true,
      //   duration: 1000,
      // })

      next('/login')
    }
  }

  next()
})
export default router
