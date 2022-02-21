// 《车辆信息请求模块》
// 加载 request 模块
import { request } from '@/utils'
// export const hello = () => {
//   return requestHello({
//     method: 'GET',
//     url: '/hello/hello'
//   })
// }
// 静默登录
export const silenceLogin = params => {
  return request({
    method: 'GET',
    url: '/currencyLogin/login',
    params,
  })
}

// 退出登录
export const setLogout = () => {
  return request({
    method: 'GET',
    url: '/app/appLogout',
  })
}
