<template>
  <div class="OrdersList">
    <div class="orderList">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
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
                  <!-- <span class="orderTopText">{{ item.orderDriveType }}</span> -->
                  <!-- <span class="orderTopText">{{
                    item.transDate + ' ' + item.transTime
                  }}</span> -->
                  <span class="orderTopText">{{
                    item.transDate + ' ' + item.transTime
                  }}</span>
                  <!-- <span class="orderTopText">{{
                    item.tradeStatus === '2' ? '已取消' : item.orderStatusShow
                  }}</span> -->
                  <span class="orderTopText">{{ item.statusShow }}</span>
                </div>
                <div class="orderInfo">
                  <p>场馆名称 : {{ item.venueName }}</p>
                  <p v-if="orderActive === '线上预约订单'">
                    预约场地 : {{ siteNameShow(item) }}
                  </p>
                  <p>订单编号 : {{ item.billNo }}</p>
                  <!-- <p>下单账号 :{{ '1063659' }}</p> -->
                  <p v-if="orderActive === '线上预约订单'">
                    预约日期 : {{ item.orderDate }}
                  </p>
                  <p v-if="orderActive === '线上预约订单'">
                    预约时间 :
                    {{ orderTimeShow(item) }}
                  </p>
                  <p v-if="orderActive === '线上预约订单'">
                    预留称呼 : {{ item.receiverName }}
                  </p>
                  <p v-if="orderActive === '线上预约订单'">
                    联系电话 : {{ item.mobile }}
                  </p>
                  <p>订单金额 : ￥{{ item.orderTotalPrice }}</p>
                </div>

                <div
                  class="orderBtn allBtn"
                  v-if="
                    btnRole === true &&
                    item.status !== '7' &&
                    item.status !== '27' &&
                    orderActive === '线上预约订单'
                  "
                >
                  <!-- <van-popover
                    v-model="showPopover[index]"
                    trigger="click"
                    placement="top-end"
                    :actions="actions"
                    @select="changeAssign"
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
                  </van-popover> -->

                  <div class="orderBtn">
                    <van-button
                      type="info"
                      size="small"
                      @click="cancellationOrder(item)"
                      >取消订单</van-button
                    >
                    <van-button
                      type="info"
                      size="small"
                      @click="confirmUseSite(item)"
                      v-if="item.statusShow === '等待使用'"
                      >确认使用</van-button
                    >
                  </div>
                  <!-- <div class="orderBtn returnCar">
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
                  </div> -->
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
  getCancOrder,
  cancelTheOrderOfPayment,
  cancelTheOrderOfUnPayment,
  CGbtnSetOrderStatusToUsed,
  getAllOfflineOrder,
  getAllOfflineCompletedOrder,
  getAllOfflineCancOrder,
} from '@/api/site/order'

export default {
  name: 'OrdersList',
  components: {},
  props: {
    thisTabs: {
      type: String,
      default: '0',
    },
    btnRole: {
      type: Boolean,
      default: false,
    },
    orderActive: {
      type: String,
      default: '线上预约订单',
    },
  },
  data() {
    return {
      list: [],
      returnList: [],
      error: false,
      loading: false,
      finished: false,
      refreshing: false,
      orderList: [],
      pageNum: 0,
      pageSize: 9,
      totalNum: 0,

      showPopover: [], // 是否显示当前气泡弹窗
      // 通过 actions 属性来定义菜单选项
      actions: [{ text: '司机:未指派' }, { text: '车辆:未指派' }],
    }
  },
  computed: {},
  watch: {
    orderActive: {
      handler(newVal, oldVal) {
        this.loading = true
        this.pageNum = 0
        this.orderList = []
        this.list = []
        this.onRefresh()
      },
      // immediate: true,
    },
  },
  created() {
    // this.onLoad()
  },

  mounted() {},
  methods: {
    // 场地名称格式化
    siteNameShow(item) {
      // 去除场馆名称中的'出租'
      let siteName = item.siteName.replace('出租', '')
      return siteName + '-' + item.siteType
    },
    // 预约时间格式化
    orderTimeShow(item) {
      // 100000-100999 格式改为10:00-11:00
      let orderStartTime = item.orderStartTime.replace(
        /^(\d{2})(\d{2})(\d{2})$/,
        '$1:$2'
      )
      let orderEndTime = item.orderEndTime.replace(
        /^(\d{2})(\d{2})(\d{2})$/,
        '$1:$2'
      )
      return orderStartTime + '-' + orderEndTime
    },
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
    onLoad() {
      console.log('onload')

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
        console.log('orderActive:', this.orderActive)

        if (this.thisTabs === '0') {
          this.pageNum++
          if (this.orderActive === '扫码支付订单') {
            this.loadAllOrderOfScan()
          } else {
            this.loadAllOrder()
          }
        } else if (this.thisTabs === '1') {
          this.pageNum++
          if (this.orderActive === '扫码支付订单') {
            this.loadWaitOrderOfScan()
          } else {
            this.loadWaitOrder()
          }
        } else {
          this.pageNum++
          if (this.orderActive === '扫码支付订单') {
            this.loadCancOrderOfScan()
          } else {
            this.loadCancOrder()
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
    loadAllOrder() {
      getAllOrder({
        currentPage: this.pageNum,
        numOfPerPage: this.pageSize,
      }).then(res => {
        if (res.data.rs === '1') {
          console.log('运动管理员全部订单', res)
          console.log('运动管理员全部订单', res.data)
          this.orderList = this.orderList.concat(
            res.data.querySportBusinessOrders
          )
          this.totalNum = res.data.querySportBusinessOrders_totalRecNum
          this.list = this.orderList
          console.log('this.list', this.list)
          this.loading = false
          this.finished =
            this.orderList.length >=
            res.data.querySportBusinessOrders_totalRecNum
        } else {
          console.log(res.data.rs)
          this.loading = false
          this.error = true
          this.pageNum = 0
        }
      })
    },
    loadWaitOrder() {
      getWaitOrder({
        currentPage: this.pageNum,
        numOfPerPage: this.pageSize,
      }).then(res => {
        if (res.data.rs === '1') {
          console.log('管理员已预约订单', res.data)
          this.orderList = this.orderList.concat(
            res.data.querySportBusinessReseOrders
          )
          this.totalNum = res.data.querySportBusinessReseOrders_totalRecNum
          this.list = this.orderList
          console.log('this.list', this.list)
          this.loading = false
          this.finished =
            this.orderList.length >=
            res.data.querySportBusinessReseOrders_totalRecNum
        } else {
          console.log(res.data.rs)
          this.loading = false
          this.error = true
          this.pageNum = 0
        }
      })
    },
    loadCancOrder() {
      getCancOrder({
        currentPage: this.pageNum,
        numOfPerPage: this.pageSize,
      }).then(res => {
        if (res.data.rs === '1') {
          console.log('管理员已预约订单', res.data)
          this.orderList = this.orderList.concat(
            res.data.querySportBusinessCancOrders
          )
          this.totalNum = res.data.querySportBusinessCancOrders_totalRecNum
          this.list = this.orderList
          console.log('this.list', this.list)
          this.loading = false
          this.finished =
            this.orderList.length >=
            res.data.querySportBusinessCancOrders_totalRecNum
        } else {
          console.log(res.data.rs)
          this.loading = false
          this.error = true
          this.pageNum = 0
        }
      })
    },
    loadAllOrderOfScan() {
      getAllOfflineOrder({
        currentPage: this.pageNum,
        numOfPerPage: this.pageSize,
      }).then(res => {
        if (res.data.rs === '1') {
          console.log('线下扫码全部订单', res)
          console.log('线下扫码全部订单', res.data)
          this.orderList = this.orderList.concat(
            res.data.querySportBusinessOfflineOrders
          )
          this.totalNum = res.data.querySportBusinessOfflineOrders_totalRecNum
          this.list = this.orderList
          console.log('this.list', this.list)
          this.loading = false
          this.finished =
            this.orderList.length >=
            res.data.querySportBusinessOfflineOrders_totalRecNum
        } else {
          console.log(res.data.rs)
          this.loading = false
          this.error = true
          this.pageNum = 0
        }
      })
    },
    loadWaitOrderOfScan() {
      getAllOfflineCompletedOrder({
        currentPage: this.pageNum,
        numOfPerPage: this.pageSize,
      }).then(res => {
        if (res.data.rs === '1') {
          console.log('线下扫码已预约订单', res.data)
          this.orderList = this.orderList.concat(
            res.data.querySportBusiOfflineCompletedOrders
          )
          this.totalNum =
            res.data.querySportBusiOfflineCompletedOrders_totalRecNum
          this.list = this.orderList
          console.log('this.list', this.list)
          this.loading = false
          this.finished =
            this.orderList.length >=
            res.data.querySportBusiOfflineCompletedOrders_totalRecNum
        } else {
          console.log(res.data.rs)
          this.loading = false
          this.error = true
          this.pageNum = 0
        }
      })
    },
    loadCancOrderOfScan() {
      getAllOfflineCancOrder({
        currentPage: this.pageNum,
        numOfPerPage: this.pageSize,
      }).then(res => {
        if (res.data.rs === '1') {
          console.log('线下扫码已预约订单', res.data)
          this.orderList = this.orderList.concat(
            res.data.querySportBusinessOfflineCancOrders
          )
          this.totalNum =
            res.data.querySportBusinessOfflineCancOrders_totalRecNum
          this.list = this.orderList
          console.log('this.list', this.list)
          this.loading = false
          this.finished =
            this.orderList.length >=
            res.data.querySportBusinessOfflineCancOrders_totalRecNum
        } else {
          console.log(res.data.rs)
          this.loading = false
          this.error = true
          this.pageNum = 0
        }
      })
    },

    // 取消租场订单
    cancellationOrder(item) {
      let params = {
        srlIDForEngine: 'Splenwise微信预约点餐系统',
        busiNameForEngine: '运动场地出租业务',
        busiFunNameForEngine: '线上退场',
        miniProcNameForEngine: '完成线上退场',
        billNo: item.billNo,
      }
      console.log('取消订单参数', params)
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定取消订单？',
        })
        .then(() => {
          // on confirm
          // 根据支付状态判断如何取消订单
          if (item.status === '1') {
            // 未支付
            params.miniProcNameForEngine = '取消未支付订单'
            cancelTheOrderOfUnPayment(params).then(res => {
              if (res.data.rs === '1') {
                this.onRefresh()
                this.$toast('取消订单成功')
              } else {
                this.$toast(res.data.rs)
              }
            })
          } else if (item.status === '13') {
            // 已支付
            cancelTheOrderOfPayment(params).then(res => {
              if (res.data.rs === '1') {
                this.onRefresh()
                this.$toast('取消订单成功')
              } else {
                this.$toast(res.data.rs)
              }
            })
          }
        })
        .catch(() => {
          // on cancel
        })
    },
    confirmUseSite(item) {
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定使用？',
        })
        .then(() => {
          // on confirm
          CGbtnSetOrderStatusToUsed({
            srlIDForEngine: 'Splenwise微信预约点餐系统',
            busiNameForEngine: '运动场地出租业务',
            busiFunNameForEngine: '更新订单状态',
            miniProcNameForEngine: '置预约订单为已使用',
            billNo: item.billNo,
          }).then(res => {
            console.log('确定使用', res)
            if (res.data.rs === '1') {
              this.onRefresh()
              this.$toast('场地使用成功')
            }
          })
        })
        .catch(() => {
          // on cancel
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
