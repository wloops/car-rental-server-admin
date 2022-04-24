// 《请求模块》
// 加载 request 模块
import { request } from '@/utils'
// export const hello = () => {
//   return requestHello({
//     method: 'GET',
//     url: '/hello/hello'
//   })
// }

// (查询运动场馆开放状态及营业时间)querySportsHallInfor
export const getSportsHallInfo = params => {
  return request({
    method: 'GET',
    url: '/search/querySportsHallInfor',
    params,
  })
}

// (设置场馆开放状态)CGbtnSetVenueStatus
export const setSportsHallStatus = data => {
  return request({
    method: 'POST',
    url: '/insertReturn/CGbtnSetVenueStatus',
    data,
  })
}

// (设置场馆营业时间)CGbtnSetVenueOpenTime
export const setSportsHallBusinessTime = data => {
  return request({
    method: 'POST',
    url: '/insertReturn/CGbtnSetVenueOpenTime',
    data,
  })
}
