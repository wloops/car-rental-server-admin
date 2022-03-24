// 1.方式一: 手动的切换不同的环境(不推荐)
// const BASE_URL = 'http://coderwhy.org/dev'
// const BASE_NAME = 'coderwhy'

// const BASE_URL = 'http://coderwhy.org/prod'
// const BASE_NAME = 'kobe'

// const BASE_URL = 'http://coderwhy.org/test'
// const BASE_NAME = 'james'

// 2.根据process.env.NODE_ENV区分
// 开发环境: development
// 生成环境: production
// 测试环境: test
// let storage = window.localStorage
// let param = decodeURI(location.search)
// let appid = ''
// let code = ''
// let REALTERMTYPE = ''
// let REALUSERNAME = ''
// if (param.indexOf('appid') != -1) {
//   let params = param.split('&')
//   params.forEach((item, index, err) => {
//     if (item.indexOf('appid') != -1) {
//       appid = item.substring(item.indexOf('=') + 1)
//     }
//     if (item.indexOf('REALTERMTYPE') != -1) {
//       REALTERMTYPE = item.substring(item.indexOf('=') + 1)
//     }
//     if (item.indexOf('REALUSERNAME') != -1) {
//       REALUSERNAME = item.substring(item.indexOf('=') + 1)
//     }
//     if (item.indexOf('code') != -1) {
//       code = item.substring(item.indexOf('=') + 1)
//     }
//   })
//   storage.setItem('appid', appid)

//   console.log('appid::' + appid)
//   console.log('code::' + code)
//   console.log('REALTERMTYPE::' + REALTERMTYPE)
//   console.log('REALUSERNAME::' + REALUSERNAME)

//   // storage.setItem('REALUSERNAME', REALUSERNAME)
// }

let BASE_URL = ''
let BASE_DOMAIN = ''
// let BASE_COMNAME = window.localStorage.getItem('REALUSERNAME')
const TIME_OUT = 10000

console.log('process.env.NODE_ENV', process.env.NODE_ENV)

if (process.env.NODE_ENV === 'development') {
  BASE_URL = 'http://www.paytunnel.cn/carRentalServerRH'
  BASE_DOMAIN = 'http://www.paytunnel.cn'
  // BASE_COMNAME = '广州睿颢软件技术有限公司'
} else if (process.env.NODE_ENV === 'production') {
  // 测试环境
  BASE_URL = 'http://www.paytunnel.cn/carRentalServerRH'
  BASE_DOMAIN = 'http://www.paytunnel.cn'
  // 生产环境
  // BASE_URL = ''
  // BASE_DOMAIN = ''

  // BASE_COMNAME = '广州睿颢软件技术有限公司'
} else {
  BASE_URL = 'http://www.paytunnel.cn/carRentalServerRH'
  BASE_DOMAIN = 'http://www.paytunnel.cn'
  // BASE_COMNAME = '广州睿颢软件技术有限公司'
}

export { BASE_URL, BASE_DOMAIN, TIME_OUT }
