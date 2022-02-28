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
        name="carID"
        :value="form.carID"
        label="车牌号码"
        @click="showCarID = true"
      />
      <van-field
        readonly
        clickable
        colon
        name="time"
        :value="form.endTime"
        label="还车时间"
        placeholder="点击选择还车时间"
        @click="showDateTime"
        :rules="[{ required: true, message: '请选择还车时间' }]"
      />
      <!-- <van-calendar v-model="showCalendar" @confirm="onConfirm" /> -->
      <van-popup
        v-model="isShowDateTime"
        position="bottom"
        round
        :style="{ height: '35%' }"
      >
        <van-datetime-picker
          v-model="currentDate"
          type="datetime"
          title="请选择还车时间"
          :min-date="minDate"
          :max-date="maxDate"
          :formatter="formatter"
          @confirm="datetimeConfirm"
          @cancel="isShowDateTime = false"
          @change="datetimeChange"
        />
      </van-popup>
      <van-field
        colon
        v-model="form.totalDays"
        name="totalDays"
        label="使用时长(天)"
      />
      <van-field
        colon
        v-model="form.basicFee"
        name="basicFee"
        label="基础费用"
      />
      <van-field
        colon
        v-model="form.KilometersAfter"
        name="KilometersAfter"
        label="收车里程"
        placeholder="请填写收车里程"
      />
      <van-field
        colon
        v-model="form.KilometersAll"
        name="KilometersAll"
        label="行驶里程"
        placeholder="自动计算出车前后的行驶里程"
      />
      <van-field
        colon
        v-model="form.OilAfter"
        name="OilAfter"
        label="收车油量"
        placeholder="请填写收车油量"
      />
      <van-field
        colon
        v-model="form.roadFee"
        name="roadFee"
        label="过路费"
        placeholder="请填写过路费"
      />
      <van-field
        colon
        v-model="form.parkingFee"
        name="parkingFee"
        label="停车费"
        placeholder="请填写停车费"
      />
      <van-field
        colon
        v-model="form.driverFee"
        name="driverFee"
        label="司机费用"
      />
      <van-field
        colon
        v-model="form.otherFee"
        name="otherFee"
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
        v-model="form.remark"
        rows="1"
        autosize
        name="remark"
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
var dayjs = require('dayjs')
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
        totalDays: '2', // 使用时长
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
        remark: '', // 其它信息
      },
      isShowDateTime: false,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
    }
  },
  computed: {
    currentOrder() {
      return this.$store.getters['order/currentOrder']
    },
  },
  watch: {},
  created() {
    this.form.carID = this.currentOrder.carNumber
  },
  mounted() {},
  methods: {
    datetimeConfirm(e) {
      let time = dayjs(e).format('YYYY-MM-DD HH:mm')
      console.log(time)
      this.form.endTime = time
      this.isShowDateTime = false
    },
    showDateTime() {
      this.isShowDateTime = !this.isShowDateTime
    },
    formatter(type, val) {
      if (type === 'year') {
        return val + '年'
      }
      if (type === 'month') {
        return val + '月'
      }
      if (type === 'day') {
        return val + '日'
      }
      if (type === 'hour') {
        return val + '时'
      }
      if (type === 'minute') {
        return val + '分'
      }
      if (type === 'second') {
        return val + '秒'
      }
      return val
    },
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
