//const domain = 'www.gxgscloud.cn';
const domain = 'www.paytunnel.cn'
//const agreement = 'http';
const agreement = 'https'
const token = ''
const projectName = 'orderFoodsClientRH'
const path =
  agreement + '://' + domain + '/socketServer/images/cardMall/imgsrc/'
const serverName = 'orderFoodServerRH'
const filenameUrl = ''
const memberID = ''
const appId = ''
const nickName = ''
/*   购物车数据相关  start */
const shoppingCart = []
const timeTypeT = []
const currentDate = []
/*  购物车数据相关  end   */
export default {
  token, //用户token身份
  appId, //微信的appId
  path, //图片路径地址
  filenameUrl, //文件地址
  memberID, //会员号
  domain, //域名
  nickName, //昵称
  agreement, //网络协议
  projectName, //项目名
  shoppingCart, //购物车
  timeTypeT, //购物车
  currentDate, //购物车
}
