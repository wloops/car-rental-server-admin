// 《车辆信息请求模块》
// 加载 request 模块
import { request } from '@/utils'
// export const hello = () => {
//   return requestHello({
//     method: 'GET',
//     url: '/hello/hello'
//   })
// }
// (查询运动商家本月及当日收入)querySportBusinessIncome
export const getIncome = params => {
  return request({
    method: 'GET',
    url: '/search/querySportBusinessIncome',
    params,
  })
}

// (查询运动商家全部订单)querySportBusinessOrders
export const getAllOrder = params => {
  return request({
    method: 'GET',
    url: '/search/querySportBusinessOrders',
    params,
  })
}

// (查询运动商家已预约订单)querySportBusinessReseOrders
export const getWaitOrder = params => {
  return request({
    method: 'GET',
    url: '/search/querySportBusinessReseOrders',
    params,
  })
}

// (查询运动商家已取消订单)querySportBusinessCancOrders
export const getCancOrder = params => {
  return request({
    method: 'GET',
    url: '/search/querySportBusinessCancOrders',
    params,
  })
}

// (取消已付款订单)CGbtnCancelPaidOrder
export const cancelTheOrderOfPayment = data => {
  return request({
    method: 'POST',
    url: '/insertReturn/CGbtnCancelPaidOrder',
    data,
  })
}

// (取消未付款订单)CGbtnCancelUnPaidOrder
export const cancelTheOrderOfUnPayment = data => {
  return request({
    method: 'POST',
    url: '/insertReturn/CGbtnCancelUnPaidOrder',
    data,
  })
}
