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
          >确定指派</van-button
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
      drivers: [
        {
          text: '张三',
          phone: '15888888888',
        },
        {
          text: '李四',
          phone: '15999999999',
        },
        {
          text: '王五',
          phone: '15777777777',
        },
        {
          text: '赵六',
          phone: '15666666666',
        },
        {
          text: '钱七',
          phone: '15555555555',
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
    onConfirmDriver(value) {
      this.form.driverName = value.text
      // this.form.driverPhone = this.drivers[value.text.indexOf(value)].phone
      this.form.driverPhone = value.phone
      this.showDriver = false
    },
    // 提交表单
    onSubmit(values) {
      console.log('submit', values)
      // this.$store.commit('order/setIsAssignDriver', true)
      this.$toast.success('出车成功')
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
