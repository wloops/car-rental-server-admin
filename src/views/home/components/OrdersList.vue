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
                  <span class="orderTopText">{{ item.contactName }}</span>
                  <span class="orderTopText">{{ item.orderTime }}</span>
                  <span class="orderTopText">{{ item.useStatus }}</span>
                </div>
                <div class="orderInfo">
                  <p>订单编号 : {{ item.orderNumber }}</p>
                  <p>用车车型 : {{ item.carType }}</p>
                  <p>用车时间 : {{ item.useCarTime }}</p>
                  <p>订单金额 : {{ item.orderMoney }}</p>
                  <p>是否带司机 : {{ item.isDriver }}</p>
                  <p>联系人 :{{ item.contactName }}</p>
                  <p>电话 : {{ item.contactPhone }}</p>
                  <p>接车地址 : {{ item.address }}</p>
                </div>
                <div
                  class="orderBtn"
                  v-if="page === 'home' && item.useStatus === '待出车'"
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
import {
  NavBar,
  Tab,
  Tabs,
  Cell,
  CellGroup,
  List,
  Grid,
  GridItem,
  Tag,
  PullRefresh,
  Button,
} from 'vant'
export default {
  name: 'OrdersList',
  components: {
    [NavBar.name]: NavBar,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [List.name]: List,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [Tag.name]: Tag,
    [PullRefresh.name]: PullRefresh,
    [Button.name]: Button,
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
      orderList: [
        {
          useStatus: '已出车',
          orderType: '单位订单',
          orderNumber: '161344262346',
          orderTime: '2021-12-21 12:19:36',
          carType: '雪佛兰新科鲁兹',
          useCarTime: '2021-12-21至2021-12-21（2天）',
          orderMoney: '￥178',
          isDriver: '是',
          contactName: '张三单位',
          contactPhone: '18933552324',
          address: '惠保县上村',
        },
        {
          useStatus: '已出车',
          orderType: '个人订单',
          orderNumber: '161344262347',
          orderTime: '2021-12-21 12:09:36',
          carType: '雪佛兰新科鲁兹',
          useCarTime: '2021-12-21至2021-12-21（2天）',
          orderMoney: '￥178',
          isDriver: '是',
          contactName: '李四',
          contactPhone: '18933552324',
          address: '惠保县中村',
        },
        {
          useStatus: '待出车',
          orderType: '单位订单',
          orderNumber: '161344262348',
          orderTime: '2021-12-21 12:59:36',
          carType: '雪佛兰新科鲁兹',
          useCarTime: '2021-12-21至2021-12-21（2天）',
          orderMoney: '￥178',
          isDriver: '是',
          contactName: '王五单位',
          contactPhone: '18933552324',
          address: '惠保县下村',
        },
      ],
    }
  },
  computed: {},
  watch: {},
  created() {},

  mounted() {},
  methods: {
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
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
          this.list = this.orderList
        } else if (this.thisTabs === '待出车') {
          this.list = this.orderList.filter(item => {
            return item.useStatus.indexOf('待出车') > -1
          })
        } else {
          this.list = this.orderList.filter(item => {
            return item.orderType.indexOf('已出车') > -1
          })
        }
        // 加载状态结束
        this.loading = false
        // 数据全部加载完成
        if (this.orderList.length) {
          this.finished = true
        }
      }, 1000)
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false

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
  font-size: small;
  color: #6f6f6f;
  line-height: 0.5rem;
  margin-bottom: 0.5rem;
}
.orderBtn {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
