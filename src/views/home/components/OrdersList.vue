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
            <van-grid-item v-for="item in list" :key="item.orderNumber">
              <div class="orderItem">
                <div class="useStatus">
                  <span class="orderTopText">{{ item.orderDriveType }}</span>
                  <span class="orderTopText">{{
                    item.transDate + ' ' + item.transTime
                  }}</span>
                  <span class="orderTopText">{{ item.orderStatusShow }}</span>
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
                </div>
                <div class="orderBtn" v-if="item.orderStatusShow === '未提车'">
                  <van-button
                    type="info"
                    size="small"
                    @click="toAssignDriver(item)"
                    >指派司机</van-button
                  >
                  <van-button
                    type="info"
                    size="small"
                    @click="toAssignCar(item)"
                    >指派车辆</van-button
                  >
                </div>
                <div class="orderBtn returnCar" v-else>
                  <van-button
                    type="info"
                    size="small"
                    @click="toReturnCar(item)"
                    >还车/计算费用</van-button
                  >
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

export default {
  name: 'OrdersList',
  components: {},
  props: {
    thisTabs: {
      type: String,
      default: '全部订单',
    },
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
    }
  },
  computed: {
    // 是否指派司机
    isAssignDriver() {},
  },
  watch: {},
  created() {
    // this.onLoad()
  },

  mounted() {},
  methods: {
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
      this.$router.push('/assign')
    },
    toReturnCar(item) {
      console.log('toReturnCar', item)
      this.$router.push('/return')
    },
    loadAllOrder() {
      getAllOrder({
        currentPage: this.pageNum,
        numOfPerPage: this.pageSize,
      }).then(res => {
        if (res.data.rs === '1') {
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
  margin-bottom: 0.5rem;
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
