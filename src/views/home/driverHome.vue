<template>
  <div class="home">
    <div class="homeTop">
      <div class="homeTitle">惠租车司机管理平台</div>
      <div class="adminName">司机：{{ adminName }}</div>
      <div class="totalRevenue">
        <van-cell-group inset>
          <van-row gutter="20" type="flex" justify="space-between">
            <van-col span="12">
              <van-cell>
                <template #title>
                  <div class="titleText">本月收入（元）</div>
                  <span class="costText">1412.00</span>
                </template>
              </van-cell>
            </van-col>
            <van-col span="12">
              <van-cell>
                <template #title>
                  <div class="titleText">当日收入（元）</div>
                  <span class="costText">1412.00</span>
                </template>
              </van-cell>
            </van-col>
          </van-row>
        </van-cell-group>
      </div>
    </div>
    <!-- <div class="revenueDetailed">
      <van-cell-group inset>
        <van-row type="flex" justify="space-between">
          <van-col span="10">
            <van-cell>
              <template #title>
                <div class="titleText">单位订单（元）</div>
                <span class="costText">142.00</span>
              </template>
              <template #label>
                <van-button type="info" size="mini">查看明细</van-button>
              </template>
            </van-cell>
          </van-col>
          <van-col span="4">
            <div class="revenueTime">
              <span>今天</span>
            </div>
          </van-col>
          <van-col span="10">
            <van-cell>
              <template #title>
                <div class="titleText">个人订单（元）</div>
                <span class="costText">112.00</span>
              </template>
              <template #label>
                <van-button type="info" size="mini">查看明细</van-button>
              </template>
            </van-cell>
          </van-col>
        </van-row>
      </van-cell-group>
    </div> -->
    <div class="myOrders">
      <div class="orderTitle">我的订单</div>
      <div class="orders">
        <div class="tabs">
          <van-tabs v-model="active" swipeable animated sticky>
            <van-tab title="全部订单">
              <orders-list this-tabs="全部订单" page="driverHome"></orders-list>
            </van-tab>
            <!-- <van-tab title="单位订单">
              <orders-list this-tabs="单位订单"></orders-list>
            </van-tab>
            <van-tab title="个人订单">
              <orders-list this-tabs="个人订单"></orders-list>
            </van-tab> -->
            <!-- <van-tab title="待还车">
              <orders-list this-tabs="待还车"></orders-list>
            </van-tab> -->
            <van-tab title="待出车">
              <orders-list this-tabs="待出车" page="driverHome"></orders-list>
            </van-tab>
          </van-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrdersList from './components/OrdersList.vue'
import {
  Cell,
  CellGroup,
  Button,
  Toast,
  Col,
  Row,
  NavBar,
  Tab,
  Tabs,
  List,
  Grid,
  GridItem,
  Tag,
  PullRefresh,
} from 'vant'
export default {
  name: 'home',
  components: {
    OrdersList,

    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Toast.name]: Toast,
    [Col.name]: Col,
    [Row.name]: Row,
    [NavBar.name]: NavBar,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [List.name]: List,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [Tag.name]: Tag,
    [PullRefresh.name]: PullRefresh,
  },
  props: {},
  data() {
    return {
      active: 0,
      adminName: '张三',
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style scoped lang="less">
.home {
  // text-align: center;
  // padding: 20px;
  background-color: #f7f7f7;
  .homeTop {
    background: #196ef7;
    border-radius: 0 0 10px 10px;
    padding-bottom: 1rem;
  }
  .homeTitle {
    color: #fff;
    font-size: 1.3rem;
    font-weight: bold;
    padding: 1rem;
  }
  .adminName {
    color: #fff;
    font-size: 1rem;
    padding: 0 1.2rem 0.5rem 1.2rem;
    font-weight: 600;
  }
}
.orderTitle {
  color: #196ef7;
  font-size: 1.1rem;
  font-weight: bold;
  padding: 1rem;
}
.titleText {
  font-size: 0.7rem;
  color: #9f9f9f;
}
.costText {
  font-size: 1.4rem;
  font-weight: 600;
  color: #196ef7;
}
.revenueDetailed {
  margin-top: 0.5rem;
  .revenueTime {
    margin: 0.5rem;
    span {
      font-size: 0.8rem;
      color: #196ef7;
    }
  }
}
</style>
