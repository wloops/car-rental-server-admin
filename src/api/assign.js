// 《出车请求模块》
// 加载 request 模块
import { request } from '@/utils'
// export const hello = () => {
//   return requestHello({
//     method: 'GET',
//     url: '/hello/hello'
//   })
// }
// 查询可派司机
export const getAvailableDriver = params => {
  return request({
    method: 'GET',
    url: '/search/queryAvailableDriver',
    params,
  })
}
// 查询可派车辆
export const getAvailableCar = params => {
  return request({
    method: 'GET',
    url: '/search/queryAvailableCarsNumber',
    params,
  })
}

// 指派代驾车辆
export const assignSubstituteCar = params => {
  return request({
    method: 'get',
    url: '/insertReturn/ZCbtnAssignSubstituteCar',
    params,
  })
}

//指派代驾司机
export const assignSubstituteDriver = params => {
  return request({
    method: 'get',
    url: '/insertReturn/ZCbtnAssignSubstituteDriver',
    params,
  })
}

// 租车单位自行提车
export const assignCarOfSelf = params => {
  return request({
    method: 'get',
    url: '/insertReturn/ZCbtnCarSelfWthdrawal',
    params,
  })
}
