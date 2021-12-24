<template>
  <div class="returnCar">
    <div class="topNav">
      <van-nav-bar
        fixed
        placeholder
        left-text="主页"
        title="还车"
        left-arrow
        color="#000"
        @click-left="onClickLeft"
      />
    </div>
    <van-form @submit="onSubmit">
      <div class="costInfo">
        <h4>费用信息</h4>
      </div>
      <van-field
        readonly
        clickable
        colon
        name="车牌号码"
        :value="form.carID"
        label="车牌号码"
        @click="showCarID = true"
      />
      <van-field
        readonly
        clickable
        colon
        name="还车时间"
        :value="form.endTime"
        label="还车时间"
        placeholder="点击选择还车时间"
        @click="showCalendar = true"
        :rules="[{ required: true, message: '请选择还车时间' }]"
      />
      <van-calendar v-model="showCalendar" @confirm="onConfirm" />
      <van-field
        colon
        v-model="form.totalTime"
        name="使用时长(天)"
        label="使用时长(天)"
      />
      <van-field
        colon
        v-model="form.basicFee"
        name="基础费用"
        label="基础费用"
      />
      <van-field
        colon
        v-model="form.KilometersAfter"
        name="收车里程"
        label="收车里程"
        placeholder="请填写收车里程"
      />
      <van-field
        colon
        v-model="form.KilometersAll"
        name="行驶里程"
        label="行驶里程"
        placeholder="自动计算出车前后的行驶里程"
      />
      <van-field
        colon
        v-model="form.OilAfter"
        name="收车油量"
        label="收车油量"
        placeholder="请填写收车油量"
      />
      <van-field
        colon
        v-model="form.roadFee"
        name="过路费"
        label="过路费"
        placeholder="请填写过路费"
      />
      <van-field
        colon
        v-model="form.parkingFee"
        name="停车费"
        label="停车费"
        placeholder="请填写停车费"
      />
      <van-field
        colon
        v-model="form.driverFee"
        name="司机费用"
        label="司机费用"
      />
      <van-field
        colon
        v-model="form.otherFee"
        name="其他费用"
        label="其他费用"
      />
      <van-cell>
        <template #title>
          <span class="totalFee-title">费用总计 :</span>
        </template>
        <template>
          <span class="totalFee">￥780</span>
        </template>
      </van-cell>
      <div class="OtherInfo">
        <h4>其它信息</h4>
      </div>
      <van-field
        v-model="form.otherMessage"
        rows="1"
        autosize
        name="其它信息"
        type="textarea"
        placeholder="请填写其它相关信息"
      />
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit"
          >确定还车</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { NavBar, Form, Field, Calendar, Cell, CellGroup, Button } from 'vant'
export default {
  name: 'returnCar',
  components: {
    [NavBar.name]: NavBar,
    [Form.name]: Form,
    [Field.name]: Field,
    [Calendar.name]: Calendar,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
  },
  props: {},
  data() {
    return {
      form: {
        carID: '桂AA19L0 (自营)', // 车牌号码
        endTime: '', // 还车时间
        totalTime: '2', // 使用时长
        basicFee: '', // 基础费用
        KilometersAfter: '', // 收车里程
        KilometersBefore: '', // 出车里程
        KilometersAll: '', // 行驶里程（总里程）
        OilAfter: '', // 收车油量
        OilBefore: '', // 出车油量
        roadFee: '', // 过路费
        parkingFee: '', // 停车费
        driverFee: '', // 司机费用
        otherFee: '', // 其他费用
        otherMessage: '', // 其它信息
      },
      showCalendar: false,
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    onSubmit(values) {
      console.log('submit', values)
    },
    onConfirm(date) {
      console.log('confirm', date)
      this.form.endTime = `${date.getFullYear()}/${
        date.getMonth() + 1
      }/${date.getDate()}`
      this.showCalendar = false
    },
  },
}
</script>

<style scoped lang="less">
h4 {
  // color: #196ef7;
  margin: 1rem;
}

.totalFee-title {
  font-weight: 700;
}
.totalFee {
  color: red;
  font-weight: 600;
}
</style>
