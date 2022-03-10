<template>
  <div class="enterViolation">
    <div class="topNav">
      <van-nav-bar
        fixed
        placeholder
        left-text="主页"
        title="违章信息"
        left-arrow
        color="#000"
        @click-left="onClickLeft"
      />
    </div>
    <h4>已录入的违章信息</h4>
    <div class="content">
      <van-collapse v-model="activeName" accordion v-if="show">
        <van-collapse-item title="违章记录" name="1">
          <!-- 显示违章金额以及备注信息 -->
          <h5>违章总数：{{ trafficTickets.prdNum }}</h5>
          <h5>合计金额：￥{{ trafficTickets.totalAmtAfterDiscount }}</h5>
          <h5>违章备注：{{ trafficTickets.remark }}</h5>
        </van-collapse-item>
        <!-- <van-collapse-item title="违章记录2" name="2">
          <h5>金额：￥200</h5>
          <h5>备注：违章记录2</h5>
        </van-collapse-item>
        <van-collapse-item title="违章记录3" name="3">
          <h5>金额：￥200</h5>
          <h5>备注：违章记录3</h5>
        </van-collapse-item> -->
      </van-collapse>
      <p style="text-align: center;" v-else>{{ showText }}</p>
    </div>
    <div style="height: 3rem"></div>
    <footer>
      <van-button round type="info" native-type="button" @click="toViolation">
        录入新的违章信息
      </van-button>
    </footer>
  </div>
</template>

<script>
import { getViolation } from '@/api/order'
export default {
  name: 'enterViolation',
  components: {},
  props: {},
  data() {
    return {
      activeName: '1',
      trafficTickets: {}, // 交通罚款
      show: false,
      showText: '', // 显示的文本
    }
  },
  computed: {
    currentOrder() {
      return this.$store.getters['order/currentOrder']
    },
  },
  watch: {},
  created() {
    this.loadViolation()
  },
  mounted() {},
  methods: {
    toViolation() {
      this.$router.push('/inputViolation')
    },
    onClickLeft() {
      this.$router.go(-1)
    },
    loadViolation() {
      getViolation({
        billNo: this.currentOrder.billNo,
      }).then(res => {
        if (res.data.rs === '1') {
          if (res.data.queryMyCarViolation_totalRecNum !== 0) {
            this.trafficTickets = res.data.queryMyCarViolation[0]
            this.show = true
            console.log(this.trafficTickets, '违章信息')
          } else {
            this.show = false
            this.showText = '暂无违章信息,请点击下方按钮录入'
          }
        }
      })
    },
  },
}
</script>

<style scoped lang="less">
h4 {
  color: #000;
  margin: 1rem;
}
footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  margin-bottom: 1.5rem;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
