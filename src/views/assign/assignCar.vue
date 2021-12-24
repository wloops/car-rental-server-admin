<template>
  <div class="assignCar">
    <div class="topNav">
      <van-nav-bar
        fixed
        placeholder
        left-text="主页"
        title="指派车辆/司机"
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
      <div class="driverInfo">
        <h4>司机信息</h4>

        <div
          class="changeDriver"
          ref="changeDriver"
          v-if="form.carID.indexOf('自营') > -1"
        >
          <van-field
            readonly
            clickable
            name="姓名"
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
        <van-field
          v-model="form.driverName"
          name="姓名"
          label="姓名"
          readonly
          v-else
        />
        <van-field
          v-model="form.driverPhone"
          name="联系号码"
          label="联系号码"
        />
      </div>
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
import { NavBar, Form, Field, Button, Popup, Picker, Toast } from 'vant'
export default {
  name: 'assignCar',
  components: {
    [NavBar.name]: NavBar,
    [Form.name]: Form,
    [Field.name]: Field,
    [Button.name]: Button,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [Toast.name]: Toast,
  },
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
      drivers: ['张三', '李四', '王五', '赵六', '钱七'],
      carInfo: [
        {
          carID: '桂LR5281 (自营)',
          KilometersBefore: '12000km',
          OilBefore: '12L',
          driverName: '张三一',
          driverPhone: '13888888881',
        },
        {
          carID: '桂LSR005 (自营)',
          KilometersBefore: '13000km',
          OilBefore: '13L',
          driverName: '张三二',
          driverPhone: '13888888882',
        },
        {
          carID: '桂AA19L0 (自营)',
          KilometersBefore: '14000km',
          OilBefore: '14L',
          driverName: '张三三',
          driverPhone: '13888888883',
        },
        {
          carID: '桂L4N835 (挂靠)',
          KilometersBefore: '15000km',
          OilBefore: '15L',
          driverName: '张三四',
          driverPhone: '13888888884',
        },
        {
          carID: '粤H73K11 (挂靠)',
          KilometersBefore: '16000km',
          OilBefore: '16L',
          driverName: '张三五',
          driverPhone: '13888888885',
        },
      ],
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

    onConfirm(value) {
      this.form.carID = value
      if (value.indexOf('挂靠') > -1) {
        let carID = value.split(' ')[0]
        this.form.driverName = this.carInfo[value.indexOf(carID)].driverName
        this.form.driverPhone = this.carInfo[value.indexOf(carID)].driverPhone
      } else {
        this.form.driverName = ''
        this.form.driverPhone = ''
      }
      this.form.KilometersBefore = '120000km'
      this.form.OilBefore = '12L'
      this.showCarID = false
    },
    onConfirmDriver(value) {
      this.form.driverName = value
      this.form.driverPhone = this.carInfo[value.indexOf(value)].driverPhone
      this.showDriver = false
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
