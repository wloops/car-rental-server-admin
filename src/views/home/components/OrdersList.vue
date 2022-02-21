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
                <div
                  class="orderBtn"
                  v-if="page === 'home' && item.deliveryStatus === '0'"
                >
                  <van-button type="info" size="small" @click="toAssignCar"
                    >指派车辆/司机</van-button
                  >
                </div>
                <div class="orderBtn returnCar" v-else-if="page === 'home'">
                  <van-button type="info" size="small" @click="toReturnCar"
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
// import {
//   NavBar,
//   Tab,
//   Tabs,
//   Cell,
//   CellGroup,
//   List,
//   Grid,
//   GridItem,
//   Tag,
//   PullRefresh,
//   Button,
// } from 'vant'

import { getAllOrder, getWaitOrder } from '@/api/order'

export default {
  name: 'OrdersList',
  components: {
    // [NavBar.name]: NavBar,
    // [Tab.name]: Tab,
    // [Tabs.name]: Tabs,
    // [Cell.name]: Cell,
    // [CellGroup.name]: CellGroup,
    // [List.name]: List,
    // [Grid.name]: Grid,
    // [GridItem.name]: GridItem,
    // [Tag.name]: Tag,
    // [PullRefresh.name]: PullRefresh,
    // [Button.name]: Button,
  },
  props: {
    thisTabs: {
      type: String,
      default: '全部订单',
    },
    page: {
      type: String,
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
  computed: {},
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
        if (this.thisTabs === '全部订单') {
          this.pageNum++
          getAllOrder({
            currentPage: this.pageNum,
            numOfPerPage: this.pageSize,
          }).then(res => {
            if (res.data.rs === '1') {
              console.log('res.data', res.data)
              this.orderList = this.orderList.concat(
                res.data.queryCarMercAllOrders
              )
              this.totalNum = res.data.queryCarMercAllOrders_totalRecNum
              this.list = this.orderList
              console.log('this.list', this.list)
              this.loading = false
              this.finished =
                this.orderList.length >=
                res.data.queryCarMercAllOrders_totalRecNum
            }
          })
        } else if (this.thisTabs === '待出车') {
          this.list = this.orderList.filter(item => {
            return item.useStatus.indexOf('待出车') > -1
          })
        } else {
          this.list = this.orderList.filter(item => {
            return item.orderType.indexOf('已出车') > -1
          })
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
    toAssignCar() {
      this.$router.push('/assign')
    },
    toReturnCar() {
      this.$router.push('/return')
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
}
</style>
