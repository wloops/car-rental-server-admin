<template>
  <div class="assignCar">
    <div class="topNav">
      <van-nav-bar
        fixed
        placeholder
        left-text="主页"
        title="指派车辆"
        left-arrow
        color="#000"
        @click-left="onClickLeft"
      />
    </div>
    <div class="carInfo">
      <h4>车辆信息</h4>
    </div>
    <van-form @submit="onSubmit">
      <!-- 出车时间 -->
      <van-field
        v-model="form.startTime"
        name="出车时间"
        label="出车时间"
        readonly
      />

      <van-field
        readonly
        clickable
        name="车牌号码"
        :value="form.carID"
        label="车牌号码"
        placeholder="点击选择车辆"
        @click="showCarID = true"
        :rules="[{ required: true, message: '请选择车牌号码' }]"
      />
      <van-popup v-model="showCarID" position="bottom">
        <van-picker
          show-toolbar
          :columns="carIDs"
          @confirm="onConfirm"
          @cancel="showCarID = false"
        />
      </van-popup>
      <van-field
        v-model="form.KilometersBefore"
        name="公里数"
        label="公里数"
        readonly
      />
      <van-field v-model="form.OilBefore" name="油量" label="油量" readonly />
      <div class="otherInfo">
        <h4>其它信息</h4>
        <van-field
          v-model="form.otherMessage"
          rows="3"
          autosize
          name="备注"
          type="textarea"
          placeholder="填写其它相关信息"
        />
      </div>

      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit"
          >确定出车</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  name: 'assignCar',
  components: {},
  props: {},
  data() {
    return {
      form: {
        startTime: '2021-12-21',
        carID: '',
        KilometersBefore: '',
        OilBefore: '',
        driverName: '',
        driverPhone: '',
        otherMessage: '',
      },
      showCarID: false,
      showDriver: false,
      carIDs: [
        '桂LR5281 (自营)',
        '桂LSR005 (自营)',
        '桂AA19L0 (自营)',
        '桂L4N835 (挂靠)',
        '粤H73K11 (挂靠)',
      ],
    }
  },
  computed: {
    currentOrder() {
      return this.$store.getters['order/currentOrder']
    },
  },
  watch: {},
  created() {
    console.log('created car ',this.currentOrder)
    this.form.startTime = this.currentOrder.CARUSETIMEBEGIN + ' ' + this.currentOrder.orderStartTime
  },
  mounted() {},
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },

    onConfirm(value) {
      this.form.carID = value
      // if (value.indexOf('挂靠') > -1) {
      //   let carID = value.split(' ')[0]
      //   this.form.driverName = this.carInfo[value.indexOf(carID)].driverName
      //   this.form.driverPhone = this.carInfo[value.indexOf(carID)].driverPhone
      // } else {
      //   this.form.driverName = ''
      //   this.form.driverPhone = ''
      // }
      this.form.KilometersBefore = '120000km'
      this.form.OilBefore = '12L'
      this.showCarID = false
    },
    // 提交表单
    onSubmit(values) {
      console.log('submit', values)
      Toast('出车成功')
    },
  },
}
</script>

<style scoped lang="less">
h4 {
  color: #196ef7;
  margin: 1rem;
}
</style>
