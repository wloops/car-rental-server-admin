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
              <orders-list this-tabs="全部订单" page="home"></orders-list>
            </van-tab>
            <van-tab title="待出车">
              <orders-list this-tabs="待出车" page="home"></orders-list>
            </van-tab>
          </van-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrdersList from './components/OrdersList.vue'
import { getIncome, getIncomeOfDriver } from '@/api/order'

export default {
  name: 'home',
  components: {
    OrdersList,
  },
  props: {},
  data() {
    return {
      active: 0,
      adminName: '张三',
      income: {
        // total: 0,
        today: '0', // 当日收入
        month: '0', // 本月收入
      },
      userRole: '', // 用户角色
      homeTitle: '', // 首页标题
      adminNameTitle: '', // 管理员标题
    }
  },
  computed: {},
  watch: {
    userRole: {
      handler(newVal, oldVal) {
        console.log('userRole', newVal)
        if (newVal.indexOf('司机') > -1) {
          this.homeTitle = '惠租车司机管理平台'
          this.adminNameTitle = '司机'
        } else {
          this.homeTitle = '租车商家管理平台'
          this.adminNameTitle = '租车管理员'
        }
      },
      immediate: true, // 初始化时立即触发
    },
  },
  created() {
    // this.login()
    this.userRole = window.localStorage.getItem('userRole')
    this.adminName = window.localStorage.getItem('adminNickName')
    if (this.userRole.indexOf('司机') > -1) {
      this.loadIncomeOfDriver()
    } else {
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
          let income = res.data.queryIncomeOfMonthAndDay[0]
          this.income.month = income.orderTotalPriceByMonth
          this.income.today = income.orderTotalPriceByDay
          console.log('this.income', this.income)
        } else {
          // this.$toast(res.data.rs)
        }
      })
    },
    loadIncomeOfDriver() {
      getIncomeOfDriver().then(res => {
        console.log('IncomeOfDriver:', res.data)
        if (res.data.rs === '1') {
          let income = res.data.queryIncomeOfDriver[0]
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
