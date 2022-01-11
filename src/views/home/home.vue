<template>
  <div class="home">
    <h3>租车商家管理平台</h3>
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
      <h4>我的订单</h4>
      <div class="orders">
        <div class="tabs">
          <van-tabs v-model="active" swipeable animated sticky>
            <van-tab title="全部订单">
              <orders-list this-tabs="全部订单"></orders-list>
            </van-tab>
            <van-tab title="单位订单">
              <orders-list this-tabs="单位订单"></orders-list>
            </van-tab>
            <van-tab title="个人订单">
              <orders-list this-tabs="个人订单"></orders-list>
            </van-tab>
            <van-tab title="待还车">
              <orders-list this-tabs="待还车"></orders-list>
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
    }
  },
  computed: {},
  watch: {},
  created() {
    console.log('test jenkins 自动部署')
  },
  mounted() {},
  methods: {},
}
</script>

<style scoped lang="less">
.home {
  // text-align: center;
  // padding: 20px;
  background-color: #f7f7f7;
}
h3 {
  color: #196ef7;
  margin: 1rem;
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
