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
// 检查登录状态
export const checkLogin = () => {
  return request({
    method: 'GET',
    url: '/app/checkLogin',
  })
}

// 退出登录
export const setLogout = () => {
  return request({
    method: 'GET',
    url: '/app/appLogout',
  })
}

//账号方式登录
export const loginOfAccount = data => {
  return request({
    method: 'POST',
    url: '/app/apploginByAccount',
    data,
  })
}

// 手机验证码方式登录
export const loginOfPhone = data => {
  return request({
    method: 'POST',
    url: '/app/login',
    data,
  })
}

// 获取短信验证码
export const getSmsCode = data => {
  return request({
    method: 'POST',
    url: '/insertReturn/genAuthCodeForMobile',
    data,
  })
}
