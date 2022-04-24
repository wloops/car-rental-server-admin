<template>
  <div class="home">
    <div class="homeTop">
      <div class="homeTitle">{{ homeTitle }}</div>
      <div class="adminName">{{ adminNameTitle }}：{{ adminName }}</div>
      <!-- <van-button type="primary" @click="goLogin">登录</van-button> -->
      <div class="totalRevenue">
        <van-cell-group inset>
          <van-row gutter="20" type="flex" justify="space-between">
            <van-col span="12">
              <van-cell>
                <template #title>
                  <div class="titleText">本月收入（元）</div>
                  <span class="costText">{{ income.month }}</span>
                </template>
              </van-cell>
            </van-col>
            <van-col span="12">
              <van-cell>
                <template #title>
                  <div class="titleText">当日收入（元）</div>
                  <span class="costText">{{ income.today }}</span>
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
              <site-orders-list
                this-tabs="全部订单"
                :btn-role="isShowBtn"
                page="home"
              ></site-orders-list>
            </van-tab>
            <van-tab title="已预约">
              <site-orders-list
                this-tabs="已预约"
                :btn-role="isShowBtn"
                page="home"
              ></site-orders-list>
            </van-tab>
            <van-tab title="已取消">
              <site-orders-list
                this-tabs="已取消"
                :btn-role="isShowBtn"
                page="home"
              ></site-orders-list>
            </van-tab>
          </van-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import OrdersList from './components/OrdersList.vue'
import siteOrdersList from './components/siteOrdersList.vue'
import { getIncome } from '@/api/site/order'

export default {
  name: 'home',
  components: {
    siteOrdersList,
  },
  props: {},
  data() {
    return {
      active: 0,
      adminName: '',
      income: {
        // total: 0,
        today: '0', // 当日收入
        month: '0', // 本月收入
      },
      userRole: '', // 用户角色
      homeTitle: '', // 首页标题
      adminNameTitle: '', // 管理员标题

      isShowBtn: false, // 是否显示按钮
    }
  },
  computed: {},
  watch: {
    userRole: {
      handler(newVal, oldVal) {
        console.log('userRole', newVal)
        if (newVal.indexOf('运动场地') > -1) {
          this.homeTitle = '惠运动商家管理平台'
          this.adminNameTitle = '运动场馆管理员'
          this.isShowBtn = true
        } else {
          this.homeTitle = '惠运动商家管理平台'
          this.adminNameTitle = '运动场馆管理员'
          this.isShowBtn = true
        }
      },
      immediate: true, // 初始化时立即触发
    },
  },
  created() {
    // this.login()
    this.userRole = window.localStorage.getItem('userRole')
    this.adminName = window.localStorage.getItem('adminNickName')
    if (this.userRole.indexOf('运动场地') > -1) {
      this.loadIncome()
    }
  },
  mounted() {
    console.log('userRole', window.localStorage.getItem('userRole'))
  },
  methods: {
    loadIncome() {
      getIncome().then(res => {
        console.log('income:', res)
        console.log('income:', res.data)
        if (res.data.rs === '1') {
          let income = res.data.querySportBusinessIncome[0]
          this.income.month = income.orderTotalPriceByMonth
          this.income.today = income.orderTotalPriceByDay
          console.log('this.income', this.income)
        } else {
          // this.$toast(res.data.rs)
        }
      })
    },
  },
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
