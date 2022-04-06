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
        name="carNumber"
        :value="form.carNumber"
        label="车牌号码"
        @click="showCarID = true"
      />
      <van-field
        readonly
        clickable
        colon
        name="endTime"
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
          :formatter="formatter"
          @confirm="datetimeConfirm"
          @cancel="isShowDateTime = false"
          @change="datetimeChange"
        />
      </van-popup>
      <van-field
        colon
        readonly
        v-model="form.useDays"
        name="useDays"
        label="使用时长(天)"
      />
      <van-field
        colon
        readonly
        v-model="basicFee"
        type="number"
        name="basicFee"
        label="基础费用"
      />
      <van-field
        colon
        required
        v-model="form.KilometersAfter"
        type="number"
        name="KilometersAfter"
        label="收车里程(km)"
        placeholder="请填写收车里程"
        @blur="countKm"
        :rules="[{ required: true, message: '请填写收车里程' }]"
      />
      <van-field
        colon
        v-model="KilometersAll"
        name="KilometersAll"
        label="行驶里程(km)"
        readonly
        placeholder="自动计算出车前后的行驶里程"
      />
      <van-field
        colon
        v-model="form.OilAfter"
        type="number"
        name="OilAfter"
        label="收车油量(L)"
        placeholder="请填写收车油量"
        @blur="OilEnd"
      />
      <van-field
        colon
        v-model="form.roadFee"
        type="number"
        name="roadFee"
        label="过路费"
        placeholder="请填写过路费"
      />
      <van-field
        v-model="form.roadTollRemark"
        rows="1"
        autosize
        name="roadTollRemark"
        type="textarea"
        placeholder="请填写过路费备注信息"
      />
      <!-- <van-field
        colon
        v-model="form.parkingFee"
        type="number"
        name="parkingFee"
        label="停车费"
        placeholder="请填写停车费"
      /> -->
      <!-- <van-field
        colon
        v-model="form.driverFee"
        name="driverFee"
        label="司机费用"
      /> -->
      <!-- <van-cell center title="交通罚款">
        <template #right-icon>
          <van-switch @change="changeIsChecked" v-model="isChecked" size="24" />
        </template>
      </van-cell>
      <template v-if="isChecked">
        <div v-for="(item, index) in trafficTickets" :key="index">
          <van-cell-group>
            <van-field
              v-model="item.fee"
              type="number"
              :label="'罚单金额' + (index + 1)"
              clearable
              placeholder="请输入罚单金额"
              :rules="[{ required: true, message: '请填写当前罚单金额' }]"
              @blur="feeAdding"
            >
              <template #button>
                <div class="feeInput">
                  <van-button
                    size="small"
                    icon="plus"
                    round
                    type="info"
                    v-if="index + 1 == trafficTickets.length"
                    native-type="button"
                    @click="addItem"
                  ></van-button>
                  <van-button
                    size="small"
                    icon="minus"
                    round
                    type="info"
                    v-if="index !== 0"
                    native-type="button"
                    @click="removeItem(item, index)"
                  ></van-button>
                </div>
              </template>
            </van-field>
          </van-cell-group>
        </div>
        <van-cell-group>
          <van-field
            v-model="trafficTicketRemark"
            rows="2"
            autosize
            label="罚单备注"
            type="textarea"
            maxlength="50"
            placeholder="请输入罚单备注"
            show-word-limit
          />
        </van-cell-group>
      </template> -->
      <van-field
        colon
        v-model="form.otherFee"
        type="number"
        name="otherFee"
        label="其他费用"
      />
      <van-field
        v-model="form.otherFeesRemark"
        rows="1"
        autosize
        name="otherFeesRemark"
        type="textarea"
        placeholder="请填写其它费用备注信息"
      />
      <van-cell>
        <template #title>
          <span class="totalFee-title"
            >费用总计 :<span class="totalFee" v-if="isChecked">{{
              totalFee
            }}</span></span
          >
        </template>
        <template>
          <van-switch
            v-model="isChecked"
            @input="countFee"
            :disabled="isDisabled"
          />
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
var dayjs = require('dayjs')
// import { BASE_COMNAME } from '@/global/config'
import {
  assignReturnCarBySelf,
  assignSubDrivingCarTakeBack,
  assignCarTakeBack,
  queryMileage,
  countReturnFee,
} from '@/api/assign'

export default {
  name: 'returnCar',
  components: {},
  props: {},
  data() {
    return {
      KilometersAll: '',
      basicFee: '', // 基础费用
      days: '', // 订单天数
      form: {
        // carID: '桂AA19L0 (自营)', // 车牌号码
        endTime: '', // 还车时间
        // totalDays: '2', // 使用时长
        KilometersAfter: '', // 收车里程
        KilometersBefore: '', // 出车里程
        // KilometersAll: '', // 行驶里程（总里程）
        OilAfter: '', // 收车油量
        OilBefore: '', // 出车油量
        roadFee: '', // 过路费
        parkingFee: '', // 停车费
        // driverFee: '', // 司机费用
        otherFee: '', // 其他费用
        remark: '', // 其它信息
      },
      isShowDateTime: false,
      isChecked: false, // 是否计算总价
      trafficTickets: [{ fee: '' }], // 交通罚款
      trafficNum: 0, // 交通罚款数量
      trafficTicketTotal: 0.0, // 交通罚款总金额
      trafficTicketRemark: '交通罚款备注', // 交通罚款备注
      // minDate: new Date(2020, 0, 1),
      // maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
      totalFee: '', // 费用总计
      dateFormat: '', // 日期格式化
      timeFormat: '', // 时间格式化
      isDisabled: true, // 是否禁用
    }
  },
  computed: {
    currentOrder() {
      return this.$store.getters['order/currentOrder']
    },
    // // 计算总价
    // totalFee() {
    //   // 哪一个价格有值，就相加
    //   let totalFee = 0.0
    //   if (this.form.orderTotalPrice) {
    //     totalFee += parseFloat(this.form.orderTotalPrice)
    //   }
    //   if (this.form.roadFee) {
    //     totalFee += parseFloat(this.form.roadFee)
    //   }
    //   if (this.form.parkingFee) {
    //     totalFee += parseFloat(this.form.parkingFee)
    //   }
    //   if (this.form.otherFee) {
    //     totalFee += parseFloat(this.form.otherFee)
    //   }
    //   if (this.trafficTicketTotal) {
    //     totalFee += parseFloat(this.trafficTicketTotal)
    //   }
    //   return totalFee
    // },
  },
  watch: {},
  created() {
    this.form = this.currentOrder
    this.days = Number(this.currentOrder.useDays)
    this.form.endTime =
      this.currentOrder.CARUSETIMEEND + ' ' + this.currentOrder.orderEndTime
    this.form.endTime = dayjs(this.form.endTime).format('YYYY-MM-DD HH:mm')
    // 拆分日期和时间
    let date = this.form.endTime.split(' ')[0] // 日期 2019-01-01
    let time = this.form.endTime.split(' ')[1] // 时间 12:00
    // 格式化日期和时间为 yyyymmdd 和hhmmss
    this.dateFormat = date.replace(/-/g, '')
    this.timeFormat = time.replace(/:/g, '') + '00'
    // 初始化时,赋值基础费用
    this.basicFee = this.currentOrder.orderTotalPrice
  },
  mounted() {},
  methods: {
    datetimeConfirm(e) {
      let etime = dayjs(e).format('YYYY-MM-DD HH:mm')
      // 拆分日期和时间
      let date = etime.split(' ')[0] // 日期 2019-01-01
      let time = etime.split(' ')[1] // 时间 12:00
      // 格式化日期和时间为 yyyymmdd 和hhmmss
      this.dateFormat = date.replace(/-/g, '')
      this.timeFormat = time.replace(/:/g, '') + '00'

      console.log(etime)
      this.form.endTime = etime
      // 根据选择的时间计算相隔天数
      let startDay = dayjs(this.currentOrder.CARUSETIMEBEGIN)
      let endDay = dayjs(etime)
      let startTime = this.currentOrder.orderStartTime
      let endTime = dayjs(e).format('HH:mm:ss')
      let diff = endDay.diff(startDay, 'day')

      let diffDays = 0
      if (diff > 0) {
        if (startTime < endTime) {
          diff = diff + 1
        }
        diffDays = diff
      } else {
        diffDays = 1
      }
      this.form.useDays = diffDays
      // 计算基础费用
      this.countBasicFee(diffDays)

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
      // 拆分日期和时间
      let date = values.endTime.split(' ')[0] // 日期 2019-01-01
      let time = values.endTime.split(' ')[1] // 时间 12:00
      // 格式化日期和时间为 yyyymmdd 和hhmmss
      let dateFormat = date.replace(/-/g, '')
      let timeFormat = time.replace(/:/g, '') + '00'
      let base_comname = window.localStorage.getItem('REALUSERNAME')
      let params = {
        srlIDForEngine: 'Splenwise微信预约点餐系统',
        busiNameForEngine: '汽车租赁业务',
        busiFunNameForEngine: '租车单位还车',
        miniProcNameForEngine: '租车单位自还车',
        billNo: this.currentOrder.billNo,
        saleCmpName: base_comname,
        cardID: values.carNumber,
        driver: this.currentOrder.retDriver
          ? this.currentOrder.retDriver
          : this.currentOrder.subDriver,
        returnDate: dateFormat,
        returnTime: timeFormat,
        endIndex: values.OilAfter.toString(), // 油量
        endMileage: values.KilometersAfter.toString(), // 行驶里程
        roadTollNum: '1',
        roadTollAmt: values.roadFee ? values.roadFee.toString() : '0', // 过路费
        roadTollRemark: values.roadTollRemark,
        trafficTicketNum: this.trafficNum.toString(),
        trafficTicketAmt: this.trafficTicketTotal.toString(),
        trafficTicketRemark: this.trafficTicketRemark, // 交通罚款备注信息
        otherFee: values.otherFee ? values.otherFee.toString() : '0', // 其他费用
        otherFeesRemark: values.otherFeesRemark, // 其他费用备注信息
        remark: values.remark, // 其它信息
      }
      console.log(params)
      this.$dialog
        .confirm({
          title: '提示',
          message: '确认还车吗？',
        })
        .then(() => {
          // on confirm
          if (
            this.currentOrder.orderDriveType === '自驾' &&
            this.currentOrder.carReturnMode === '自行还车'
          ) {
            this.loadAssignReturnCarBySelf(params)
          } else if (
            this.currentOrder.orderDriveType === '自驾' &&
            this.currentOrder.carReturnMode === '上门服务'
          ) {
            params.miniProcNameForEngine = '租车单位签收还车'
            this.loadAssignReturnCarByService(params)
          } else {
            params.miniProcNameForEngine = '代驾还车'
            this.loadAssignReturnCar(params)
          }
        })
        .catch(() => {
          // on cancel
        })
    },
    loadAssignReturnCarBySelf(params) {
      assignReturnCarBySelf(params).then(res => {
        console.log('租车单位自行还车', res)
        if (res.data.rs === '1') {
          this.$toast.success('还车成功')
          this.$router.go(-1)
        } else {
          this.$toast.fail(res.data.rs)
        }
      })
    },
    loadAssignReturnCar(params) {
      assignSubDrivingCarTakeBack(params).then(res => {
        console.log('代驾还车', res)
        if (res.data.rs === '1') {
          this.$toast.success('还车成功')
          this.$router.go(-1)
        } else {
          this.$toast.fail(res.data.rs)
        }
      })
    },
    loadAssignReturnCarByService(params) {
      assignCarTakeBack(params).then(res => {
        console.log('租车单位上门服务', res)
        if (res.data.rs === '1') {
          this.$toast.success('还车成功')
          this.$router.go(-1)
        } else {
          this.$toast.fail(res.data.rs)
        }
      })
    },
    changeIsChecked(e) {
      if (e === false) {
        this.trafficTickets = [{ fee: '' }]
        this.trafficNum = 0
        this.trafficTicketTotal = 0.0
      }
    },
    countKm() {
      // 判断必填项是否为空
      console.log(this.form.KilometersAfter, this.form.OilAfter)
      if (!this.form.KilometersAfter) {
        this.isDisabled = true
      } else {
        this.isDisabled = false
      }
      queryMileage({
        billNo: this.currentOrder.billNo,
        endMileage: this.form.KilometersAfter,
      }).then(res => {
        console.log('查询行驶里程', res)
        if (res.data.rs === '1') {
          let mileage = Number(res.data.queryMileage[0].mileage)
          if (mileage > 0) {
            this.KilometersAll = res.data.queryMileage[0].mileage
          } else {
            this.$toast.fail(
              `结束里程须大于开始的${this.form.KilometersAfter - mileage}km`
            )
          }
        }
      })
    },
    OilEnd() {
      // 判断必填项是否为空
      console.log(this.form.KilometersAfter, this.form.OilAfter)

      if (!this.form.KilometersAfter) {
        this.isDisabled = true
      } else {
        this.isDisabled = false
      }
    },
    addItem() {
      this.trafficTickets.push({
        fee: '',
      })
      this.trafficNum++
    },
    removeItem(item, index) {
      this.trafficNum--
      this.trafficTickets.splice(index, 1)
      this.feeAdding()
      console.log(this.trafficTickets, '删除')
    },
    // feeAdding() {
    //   // 全部罚单费用相加
    //   let sum = 0
    //   this.trafficTickets.forEach(item => {
    //     sum += Number(item.fee)
    //   })
    //   this.trafficTicketTotal = sum
    //   console.log('sum', sum)
    // },
    // 计算基础费用和总费用
    countFee(checked) {
      if (checked) {
        countReturnFee({
          billNo: this.currentOrder.billNo,
          returnDate: this.dateFormat,
          returnTime: this.timeFormat,
          endIndex: this.form.OilAfter ? this.form.OilAfter : '0',
          endMileage: this.form.KilometersAfter,
          roadTollAmt: this.form.roadFee ? this.form.roadFee : '0',
          otherFee: this.form.otherFee ? this.form.otherFee : '0',
        }).then(res => {
          if (res.data.rs !== '1') {
            this.$toast.fail(res.data.rs)
            return false
          }
          console.log(res.data.countReturnFee)
          this.basicFee = res.data.countReturnFee[0].carRentalFee
          this.totalFee = `￥${res.data.countReturnFee[0].billTollAmt}`
        })
      }
    },
    // 选择还车时间计算基础费用
    countBasicFee(diffDays) {
      // 每天价格
      let unitPrice = Number(this.currentOrder.orderTotalPrice) / this.days
      this.basicFee = unitPrice * diffDays
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
/deep/ .feeInput .van-button {
  margin-right: 0.2rem;
}
</style>
