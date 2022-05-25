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
        name="time"
        label="出车时间"
        readonly
      />

      <van-field
        readonly
        clickable
        name="carID"
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
        required
        name="KilometersBefore"
        label="公里数"
        :rules="[{ required: true, message: '请填写公里数' }]"
      />
      <van-field v-model="form.OilBefore" name="OilBefore" label="油量" />
      <div class="otherInfo">
        <h4>其它信息</h4>
        <van-field
          v-model="form.remark"
          rows="3"
          autosize
          name="remark"
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
import {
  getAvailableCar,
  assignSubstituteCar,
  assignCarOfSelf,
  assignCarDeliveryCar,
  replaceAssignCar,
} from '@/api/assign'
export default {
  name: 'assignCar',
  components: {},
  props: {},
  data() {
    return {
      form: {
        startTime: '',
        carID: '',
        KilometersBefore: '',
        OilBefore: '',
        driverName: '',
        driverPhone: '',
        remark: '',
        billNo: '',
      },
      showCarID: false,
      showDriver: false,
      carIDs: [],
    }
  },
  computed: {
    currentOrder() {
      return this.$store.getters['order/currentOrder']
    },
  },
  watch: {},
  created() {
    this.loadAvailableCar()
    console.log('created car ', this.currentOrder)
    this.form.startTime =
      this.currentOrder.CARUSETIMEBEGIN + ' ' + this.currentOrder.orderStartTime
    this.form.billNo = this.currentOrder.billNo
  },
  mounted() {},
  methods: {
    loadAvailableCar() {
      getAvailableCar({
        carType: this.currentOrder.carType,
      }).then(res => {
        console.log('res', res)
        if (res.data.rs !== '1') {
          return false
        }
        this.carIDs = res.data.queryAvailableCarsNumber.map(item => {
          return `${item.srlID}-${item.carNumber}-${item.carClassify}`
        })
      })
    },
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
      this.form.KilometersBefore = ''
      this.form.OilBefore = ''
      this.showCarID = false
    },
    // 指派代驾车辆
    loadAssignSubstituteCar(params) {
      assignSubstituteCar(params).then(res => {
        console.log('指派代驾车辆', res)
        if (res.data.rs !== '1') {
          this.$toast.fail(res.data.rs)
          return false
        }
        this.$toast.success('出车成功')
        this.$router.go(-1)
      })
    },
    // 租车单位自行提车
    loadAssignCarOfSelf(params) {
      assignCarOfSelf(params).then(res => {
        console.log('租车单位自行提车', res)
        if (res.data.rs !== '1') {
          this.$toast.fail(res.data.rs)
          return false
        }
        this.$toast.success('出车成功')
        this.$router.go(-1)
      })
    },
    // 指派上门送车车辆
    loadAssignCarDeliveryCar(params) {
      assignCarDeliveryCar(params).then(res => {
        console.log('指派上门送车车辆', res)
        if (res.data.rs !== '1') {
          this.$toast.fail(res.data.rs)
          return false
        }
        this.$toast.success('出车成功')
        this.$router.go(-1)
      })
    },
    // 替换指派车辆
    loadReplaceAssignCar(params) {
      replaceAssignCar(params).then(res => {
        console.log('替换指派车辆', res)
        if (res.data.rs !== '1') {
          this.$toast.fail(res.data.rs)
          return false
        }
        this.$toast.success('替换指派车辆成功')
        this.$router.go(-1)
      })
    },
    // 提交表单
    onSubmit(values) {
      // 判断是否送车上门,是否有送车上门人员(delDriver),有则继续
      if (this.currentOrder.carPickUpMode === '送车上门') {
        if (this.currentOrder.delDriver === '') {
          this.$toast.fail('请先指派送车上门人员')
          return false
        }
      }
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定出车吗？',
        })
        .then(() => {
          // on confirm
          console.log('submit', values)
          let srlID = values.carID.split('-')[0]
          let carID = values.carID.split('-')[1]
          let params = {
            srlIDForEngine: 'Splenwise微信预约点餐系统',
            busiNameForEngine: '汽车租赁业务',
            busiFunNameForEngine: '出租单位派车',
            miniProcNameForEngine: '安排代驾-不安排代驾员',
            assetsPrdName: '汽车',
            oilPrdName: '燃油',
            assetsStatus: '1000',
            personStatus: '2',
            billNo: this.form.billNo,
            status: '1',
            remark: values.remark,
            assetsSrlID: srlID,
            carID: carID,
            oilSrlID: '汽油',
            beginIndex: values.OilBefore,
            beginMileage: values.KilometersBefore,
          }
          if (this.currentOrder.carNumber === '') {
            if (
              this.currentOrder.orderDriveType === '自驾' &&
              this.currentOrder.carPickUpMode === '自行取车'
            ) {
              // 调用租车单位自行提车
              params.miniProcNameForEngine = '租车单位自提车'
              this.loadAssignCarOfSelf(params)
            } else if (
              this.currentOrder.orderDriveType === '自驾' &&
              this.currentOrder.carPickUpMode === '送车上门'
            ) {
              // 调用租车单位送车上门
              params.miniProcNameForEngine = '安排上门送车-不安排上门送车人员'
              params.personStatus = '3'
              params.status = '3'
              this.loadAssignCarDeliveryCar(params)
            } else {
              // params.miniProcNameForEngine = '安排代驾-安排代驾员'
              this.loadAssignSubstituteCar(params)
            }
          } else {
            // 更换车辆
            params.busiFunNameForEngine = '更改订单驾驶员或车辆信息'
            params.miniProcNameForEngine = '更改订单车辆'
            params.carNumber = this.currentOrder.carNumber
            this.loadReplaceAssignCar(params)
          }
        })
        .catch(() => {
          // on cancel
        })
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
