// 《车辆信息请求模块》
// 加载 request 模块
import { request } from '@/utils'
// export const hello = () => {
//   return requestHello({
//     method: 'GET',
//     url: '/hello/hello'
//   })
// }
// 查询商家本月和当日收入
export const getIncome = params => {
  return request({
    method: 'GET',
    url: '/search/queryIncomeOfMonthAndDay',
    params,
  })
}

// 获取商家全部订单
export const getAllOrder = params => {
  return request({
    method: 'GET',
    url: '/search/queryCarMercAllOrders',
    params,
  })
}

// 获取商家待出车订单
export const getWaitOrder = params => {
  return request({
    method: 'GET',
    url: '/search/queryCarMercNotTrainOrders',
    params,
  })
}
