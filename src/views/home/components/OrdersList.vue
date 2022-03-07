<template>
  <div class="OrdersList">
    <div class="orderList">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <van-grid :gutter="15" :column-num="1">
            <van-grid-item
              v-for="(item, index) in list"
              :key="item.orderNumber"
              @click="stopPropagation"
            >
              <div class="orderItem">
                <div class="useStatus">
                  <span class="orderTopText">{{ item.orderDriveType }}</span>
                  <span class="orderTopText">{{
                    item.transDate + ' ' + item.transTime
                  }}</span>
                  <span class="orderTopText">{{
                    item.tradeStatus === '2' ? '已取消' : item.orderStatusShow
                  }}</span>
                </div>
                <div class="orderInfo">
                  <p>用车单位 : {{ item.purchaseCompanyName }}</p>
                  <p>订单编号 : {{ item.billNo }}</p>
                  <p>用车车型 : {{ item.carType }}</p>
                  <p>
                    用车时间 :
                    {{ item.CARUSETIMEBEGIN + ' ' + item.orderStartTime }}
                  </p>
                  <p>
                    还车时间 :
                    {{ item.CARUSETIMEEND + ' ' + item.orderEndTime }}({{
                      item.useDays
                    }}天)
                  </p>
                  <p>订单金额 : ￥{{ item.orderTotalPrice }}</p>
                  <!-- <p>驾驶方式 : {{ item.orderDriveType }}</p> -->
                  <p>联系人 :{{ item.receiverName }}</p>
                  <p>电话 : {{ item.mobile }}</p>
                  <div class="orderAddress van-multi-ellipsis--l2">
                    接车地址 : {{ item.deliveryAddr }}
                  </div>
                  <p>
                    取车方式 :
                    {{
                      item.orderDriveType === '代驾'
                        ? '送车上门'
                        : item.carPickUpMode
                    }}
                  </p>
                  <p>
                    还车方式 :
                    {{
                      item.orderDriveType === '代驾'
                        ? '上门服务'
                        : item.carReturnMode
                    }}
                  </p>
                </div>

                <div class="orderBtn allBtn" v-if="btnRole === true && item.tradeStatus !== '2'">
                  <van-popover
                    v-model="showPopover[index]"
                    trigger="click"
                    placement="top-end"
                    :actions="actions"
                    @select="onSelect"
                    v-if="item.orderStatusShow !== '已还车'"
                  >
                    <template #reference>
                      <van-button
                        type="primary"
                        size="small"
                        @click="assignInfo(item)"
                      >
                        指派状态</van-button
                      >
                    </template>
                  </van-popover>

                  <div class="orderBtn">
                    <van-button
                      type="info"
                      size="small"
                      @click="toAssignDriver(item)"
                      v-if="assignDriverBtn(item)"
                      >指派司机</van-button
                    >
                    <van-button
                      type="info"
                      size="small"
                      @click="toAssignCar(item)"
                      v-if="item.orderStatusShow === '未提车'"
                      >指派车辆</van-button
                    >
                  </div>
                  <div class="orderBtn returnCar">
                    <van-button
                      type="info"
                      size="small"
                      @click="toReturnCar(item)"
                      v-if="isReturnCar(item)"
                      >还车/计算费用</van-button
                    >
                    <van-button
                      type="info"
                      size="small"
                      @click="carDelivered(item)"
                      v-if="item.orderStatusShow === '上门送车中'"
                      >已送达</van-button
                    >
                    <van-button
                      type="info"
                      size="small"
                      @click="enterViolation(item)"
                      v-if="item.orderStatusShow === '已还车'"
                      >录入违章信息</van-button
                    >
                  </div>
                </div>
              </div>
            </van-grid-item>
          </van-grid>
        </van-list>
        <div style="height: 3rem"></div>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import {
  getAllOrder,
  getWaitOrder,
  getAllOrderOfDriver,
  getWaitOrderOfDriver,
} from '@/api/order'

import { assignCarRentalCollectedCar } from '@/api/assign'

export default {
  name: 'OrdersList',
  components: {},
  props: {
    thisTabs: {
      type: String,
      default: '全部订单',
    },
    btnRole: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      list: [],
      returnList: [],
      loading: false,
      finished: false,
      refreshing: false,
      orderList: [],
      pageNum: 0,
      pageSize: 10,
      totalNum: 0,

      showPopover: [], // 是否显示当前气泡弹窗
      // 通过 actions 属性来定义菜单选项
      actions: [{ text: '司机:未指派' }, { text: '车辆:未指派' }],
    }
  },
  computed: {
    // 是否指派司机
    isAssignDriver() {},

    // 显示指派车辆按钮
    assignCarBtn() {},
  },
  watch: {},
  created() {
    // this.onLoad()
  },

  mounted() {},
  methods: {
    //是否显示当前气泡弹窗 js 重叠处理
    stopPropagation(e) {
      e = e || window.event
      if (e.stopPropagation) {
        //W3C阻止冒泡方法
        e.stopPropagation()
      } else {
        e.cancelBubble = true //IE阻止冒泡方法
      }
    },
    assignInfo(item) {
      // 初始化 防止覆盖
      this.actions = [{ text: '司机：未指派' }, { text: '车辆：未指派' }]
      let showdriver = ''
      if (
        item.delDriver !== '' ||
        item.subDriver !== '' ||
        item.retDriver !== ''
      ) {
        if (item.subDriver) {
          showdriver = `${item.subDriver}(代驾)`
        } else if (item.delDriver) {
          showdriver = `${item.delDriver}(送车)`
        } else if (item.retDriver && item.orderStatusShow === '上门收车中') {
          showdriver = `${item.retDriver}(收车)`
        }
        this.actions[0].text = `司机：${showdriver}`
      } else {
        if (
          item.orderDriveType === '自驾' &&
          item.carPickUpMode === '自行取车' &&
          item.carReturnMode === '自行还车'
        ) {
          this.actions[0].text = '自驾自取自还'
        } else {
          this.actions[0].text = '司机：未指派'
        }
      }
      if (item.orderStatusShow !== '未提车') {
        this.actions[1].text = `车辆：${item.carNumber}`
      } else {
        this.actions[1].text = `车辆：未指派`
      }
    },
    // 显示指派司机按钮
    assignDriverBtn(item) {
      if (item.orderDriveType === '自驾' && item.orderStatusShow === '未提车') {
        if (item.carPickUpMode === '自行取车') {
          return false
        } else {
          if (item.delDriver === '') {
            return true
          } else {
            return false
          }
        }
      } else if (
        item.orderDriveType === '自驾' &&
        item.orderStatusShow === '已提车'
      ) {
        if (item.carReturnMode === '自行还车') {
          return false
        } else {
          return true
        }
      } else if (
        item.orderDriveType === '代驾' &&
        item.orderStatusShow === '未提车'
      ) {
        if (item.subDriver === '') {
          return true
        } else {
          return false
        }
      }
    },
    // 显示还车按钮
    isReturnCar(item) {
      if (item.orderDriveType === '代驾' && item.orderStatusShow === '已提车') {
        return true
      } else if (
        item.orderDriveType === '自驾' &&
        item.carReturnMode === '上门服务'
      ) {
        if (item.orderStatusShow === '上门收车中') {
          return true
        } else {
          return false
        }
      } else if (
        item.orderDriveType === '自驾' &&
        item.carReturnMode === '自行还车'
      ) {
        if (item.orderStatusShow === '已提车') {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      // this.loading = true
      setTimeout(() => {
        if (this.refreshing) {
          this.orderList = []
          this.refreshing = false
        }
        // for (let i = 0; i < 10; i++) {
        //   this.list.push(this.list.length + 1)
        // }
        // 筛选订单类型
        let userRole = window.localStorage.getItem('userRole')

        if (this.thisTabs === '全部订单') {
          this.pageNum++
          if (userRole.indexOf('司机') > -1) {
            this.loadAllOrderOfDriver()
          } else {
            this.loadAllOrder()
          }
        } else if (this.thisTabs === '待出车') {
          this.pageNum++
          if (userRole.indexOf('司机') > -1) {
            this.loadWaitOrderOfDriver()
          } else {
            this.loadWaitOrder()
          }
        }
        // // 加载状态结束
        // this.loading = false
        // // 数据全部加载完成
        // if (this.totalNum.length) {
        //   this.finished = true
        // }
      }, 800)
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false
      this.pageNum = 0

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.onLoad()
    },
    toAssignCar(item) {
      this.$store.commit('order/setIsAssignDriver', true)
      this.$store.commit('order/setCurrentOrder', item)
      this.$router.push('/assign')
    },
    toAssignDriver(item) {
      console.log('toAssignDriver', item)
      this.$store.commit('order/setIsAssignDriver', false)
      this.$store.commit('order/setCurrentOrder', item)
      this.$router.push('/assign')
    },
    toReturnCar(item) {
      console.log('toReturnCar', item)
      this.$store.commit('order/setIsAssignDriver', false)
      this.$store.commit('order/setCurrentOrder', item)
      this.$router.push('/return')
    },
    carDelivered(item) {
      // 上门送车中,调用时改为已提车
      console.log('carDelivered', item)
      let params = {
        billNo: item.billNo,
        saleCmpName: item.saleCmpName,
        employeeName: item.delDriver,
        srlIDForEngine: 'Splenwise微信预约点餐系统',
        busiNameForEngine: '汽车租赁业务',
        busiFunNameForEngine: '出租单位派车',
        miniProcNameForEngine: '租车单位签收送车',
      }
      // 询问是否确定送达
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定已送达？',
        })
        .then(() => {
          // on confirm
          assignCarRentalCollectedCar(params).then(res => {
            if (res.data.rs === '1') {
              this.$toast.success('已送达')
              item.orderStatusShow = '已提车'
            } else {
              this.$toast.fail(res.data.rs)
            }
          })
        })
        .catch(() => {
          // on cancel
        })
    },
    enterViolation(item) {
      console.log('enterViolation', item)
      this.$store.commit('order/setCurrentOrder', item)
      this.$router.push('/violation')
    },
    loadAllOrder() {
      getAllOrder({
        currentPage: this.pageNum,
        numOfPerPage: this.pageSize,
      }).then(res => {
        if (res.data.rs === '1') {
          console.log('管理员全部订单', res)
          console.log('管理员全部订单', res.data)
          this.orderList = this.orderList.concat(res.data.queryCarMercAllOrders)
          this.totalNum = res.data.queryCarMercAllOrders_totalRecNum
          this.list = this.orderList
          console.log('this.list', this.list)
          this.loading = false
          this.finished =
            this.orderList.length >= res.data.queryCarMercAllOrders_totalRecNum
        } else {
          // this.$toast(res.data.rs)
        }
      })
    },
    loadAllOrderOfDriver() {
      getAllOrderOfDriver({
        currentPage: this.pageNum,
        numOfPerPage: this.pageSize,
      }).then(res => {
        if (res.data.rs === '1') {
          console.log('司机全部订单', res.data)
          this.orderList = this.orderList.concat(res.data.queryDriverAllOrders)
          this.totalNum = res.data.queryDriverAllOrders_totalRecNum
          this.list = this.orderList
          console.log('this.list', this.list)
          this.loading = false
          this.finished =
            this.orderList.length >= res.data.queryDriverAllOrders_totalRecNum
        } else {
          // this.$toast(res.data.rs)
        }
      })
    },
    loadWaitOrder() {
      getWaitOrder({
        currentPage: this.pageNum,
        numOfPerPage: this.pageSize,
      }).then(res => {
        if (res.data.rs === '1') {
          console.log('管理员未出行订单', res.data)
          this.orderList = this.orderList.concat(
            res.data.queryCarMercNotTrainOrders
          )
          this.totalNum = res.data.queryCarMercNotTrainOrders_totalRecNum
          this.list = this.orderList
          console.log('this.list', this.list)
          this.loading = false
          this.finished =
            this.orderList.length >=
            res.data.queryCarMercNotTrainOrders_totalRecNum
        } else {
          // this.$toast(res.data.rs)
        }
      })
    },
    loadWaitOrderOfDriver() {
      getWaitOrderOfDriver({
        currentPage: this.pageNum,
        numOfPerPage: this.pageSize,
      }).then(res => {
        if (res.data.rs === '1') {
          console.log('司机未出行订单', res.data)
          this.orderList = this.orderList.concat(
            res.data.queryDriverNotTrainOrders
          )
          this.totalNum = res.data.queryDriverNotTrainOrders_totalRecNum
          this.list = this.orderList
          console.log('this.list', this.list)
          this.loading = false
          this.finished =
            this.orderList.length >=
            res.data.queryDriverNotTrainOrders_totalRecNum
        } else {
          // this.$toast(res.data.rs)
        }
      })
    },
  },
}
</script>

<style scoped lang="less">
.orderList {
  padding-top: 1rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.orderItem {
  width: 95%;
  // height: 6.5rem;
}
.useStatus {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.orderInfo {
  font-size: small;
  color: #6f6f6f;
  line-height: 0.5rem;
}
.orderTopText {
  // font-size: small;
  color: #111;
  // line-height: 0.5rem;
}
.orderAddress {
  width: 100%;
  line-height: 1rem;
  margin-top: -0.3rem;
}
.orderBtn {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .van-button {
    margin-left: 0.5rem;
  }
}
</style>
