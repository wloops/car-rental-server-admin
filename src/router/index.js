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
    component: () => import('@/views/assign/assign.vue'),
  },
  {
    path: '/return',
    name: 'return',
    component: () => import('@/views/return/returnCar.vue'),
  },
  {
    path: '/violation',
    name: 'violation',
    component: () => import('@/views/violation/violation.vue'),
  },
  {
    path: '/inputViolation',
    name: 'inputViolation',
    component: () => import('@/views/violation/components/inputViolation.vue'),
  },
  {
    path: '/',
    component: () => import('@/views/layout/layout.vue'),
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
  {
    path: '/site',
    component: () => import('@/views/layout/siteLayout.vue'),
    children: [
      {
        path: '',
        name: 'siteHome',
        component: () => import('@/views/home/siteHome.vue'),
      },
      {
        path: '/siteMy',
        name: 'siteMy',
        component: () => import('@/views/my/siteMy.vue'),
      },
    ],
  },
  {
    path: '/modifyBusinessTime',
    name: 'modifyBusinessTime',
    component: () => import('@/views/my/modifyBusinessTime.vue'),
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
  // console.log('to:', to)
  // 用户登录状态信息
  const user = JSON.parse(window.localStorage.getItem('userAdmin'))
  let userID = window.localStorage.getItem('adminMemberID')
  let userRole = window.localStorage.getItem('userRole')
  // console.log('user:', user)
  // 验证登录页面的登录状态
  if (to.path !== '/login') {
    if (user && userID) {
      // 已登录,允许通过
      next()
    } else {
      // 没有登录信息,跳转到登陆页面
      next('/login')
    }
  } else {
    // 如果是登录页面 就允许通过
    next()
  }
  if (to.path == '/') {
    if (userRole.indexOf('运动场地') > -1) {
      next('/site')
    } else {
      next()
    }
  }

  // next()
})
export default router
