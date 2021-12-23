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
            <van-grid-item v-for="item in list" :key="item">
              <div class="orderItem">
                <div class="useStatus">
                  <span class="orderTopText">***单位</span>
                  <span class="orderTopText">2021-12-21 12:19:36</span>
                  <span class="orderTopText">待取车</span>
                </div>
                <div class="orderInfo">
                  <p>订单编号 : 161344262346</p>
                  <p>用车车型 : 雪佛兰新科鲁兹</p>
                  <p>用车时间 : 2021-12-21至2021-12-21（2天）</p>
                  <p>订单金额 : ￥178</p>
                  <p>是否带司机 : 是</p>
                  <p>联系人 : 张三</p>
                  <p>电话 : 18933552324</p>
                  <p>接车地址 : XXXX</p>
                </div>
                <div class="orderBtn">
                  <van-button type="info" size="mini" @click="toAssignCar"
                    >指派车辆/司机</van-button
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
  props: {},
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
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
          this.list = []
          this.refreshing = false
        }

        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        // 加载状态结束
        this.loading = false
        // 数据全部加载完成
        if (this.list.length >= 10) {
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
