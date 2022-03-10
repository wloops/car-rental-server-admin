<template>
  <div class="assignCar">
    <div class="topNav">
      <van-nav-bar
        fixed
        placeholder
        left-text="主页"
        title="指派司机"
        left-arrow
        color="#000"
        @click-left="onClickLeft"
      />
    </div>
    <van-form @submit="onSubmit">
      <div class="driverInfo">
        <h4>司机信息</h4>

        <div class="changeDriver" ref="changeDriver">
          <van-field
            readonly
            clickable
            name="name"
            :value="form.driverName"
            label="姓名"
            placeholder="点击选择司机"
            @click="showDriver = true"
            :rules="[{ required: true, message: '请选择司机' }]"
          />
          <van-popup v-model="showDriver" position="bottom">
            <van-picker
              show-toolbar
              :columns="drivers"
              @confirm="onConfirmDriver"
              @cancel="showDriver = false"
            />
          </van-popup>
        </div>
        <van-field v-model="form.driverPhone" name="phone" label="联系号码" />
      </div>
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
          >确定指派</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import {
  getAvailableDriver,
  assignSubstituteDriver,
  assignCarDeliveryDriver,
  assignCarCollectDriver,
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
      drivers: [],
    }
  },
  computed: {
    currentOrder() {
      return this.$store.getters['order/currentOrder']
    },
  },
  watch: {},
  created() {
    this.form.billNo = this.currentOrder.billNo
    this.loadAvailableDriver()
  },
  mounted() {},
  methods: {
    loadAvailableDriver() {
      getAvailableDriver().then(res => {
        console.log(res)
        if (res.data.rs !== '1') {
          return false
        }
        let data = res.data.queryAvailableDriver
        this.drivers = data.map(item => {
          return {
            text: item.employeeName,
            phone: item.mobile,
            type: item.postName,
          }
        })
      })
    },
    onClickLeft() {
      this.$router.go(-1)
    },
    onConfirmDriver(value) {
      this.form.driverName = value.text
      // this.form.driverPhone = this.drivers[value.text.indexOf(value)].phone
      this.form.driverPhone = value.phone
      this.showDriver = false
    },
    // 提交表单
    onSubmit(values) {
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定指派该司机吗？',
        })
        .then(() => {
          // on confirm
          console.log('submit', values)
          // console.log(this.currentOrder)
          // this.$store.commit('order/setIsAssignDriver', true)
          let params = {
            srlIDForEngine: 'Splenwise微信预约点餐系统',
            busiNameForEngine: '汽车租赁业务',
            busiFunNameForEngine: '出租单位派车',
            saleCmpName: this.currentOrder.saleCmpName,
            miniProcNameForEngine: '安排代驾-只指派代驾员',
            assetsPrdName: '汽车',
            oilPrdName: '燃油',
            assetsStatus: '1000',
            personStatus: '2',
            billNo: this.form.billNo,
            status: '1',
            remark: values.remark,
            driver: values.name,
          }
          // 逻辑判断
          if (
            this.currentOrder.orderDriveType === '自驾' &&
            this.currentOrder.carPickUpMode === '送车上门' &&
            this.currentOrder.delDriver === ''
          ) {
            params.miniProcNameForEngine = '安排上门送车-只指派代驾员'
            params.personStatus = '3'
            params.status = '3'
            this.loadAssignCarDeliveryDriver(params)
          } else if (
            this.currentOrder.orderDriveType === '自驾' &&
            this.currentOrder.carReturnMode === '上门服务'
          ) {
            params.miniProcNameForEngine = '安排上门收车'
            params.busiFunNameForEngine = '租车单位还车'
            this.loadAssignCarCollectDriver(params)
          } else {
            // 指派代驾司机
            this.loadAssignSubstituteDriver(params)
          }
        })
        .catch(() => {
          // on cancel
        })
    },
    // 指派代驾司机
    loadAssignSubstituteDriver(params) {
      assignSubstituteDriver(params).then(res => {
        console.log('指派代驾司机', res)
        if (res.data.rs !== '1') {
          this.$toast(res.data.rs)
          return false
        } else {
          this.$toast.success('指派司机成功')
          this.$router.go(-1)
        }
      })
    },
    // 指派上门送车人员
    loadAssignCarDeliveryDriver(params) {
      assignCarDeliveryDriver(params).then(res => {
        console.log('指派上门送车人员', res)
        if (res.data.rs !== '1') {
          this.$toast(res.data.rs)
          return false
        } else {
          this.$toast.success('指派司机成功')
          this.$router.go(-1)
        }
      })
    },
    // 指派上门收车人员
    loadAssignCarCollectDriver(params) {
      assignCarCollectDriver(params).then(res => {
        console.log('指派上门收车人员', res)
        if (res.data.rs !== '1') {
          this.$toast(res.data.rs)
          return false
        } else {
          this.$toast.success('指派司机成功')
          this.$router.go(-1)
        }
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
