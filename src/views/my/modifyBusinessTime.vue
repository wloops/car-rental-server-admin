<template>
  <div class="modifyBusinessTime">
    <van-nav-bar left-arrow title="营业时间" @click-left="onClickLeft">
      <template #title>
        <span style="color: white">营业时间</span>
      </template>
    </van-nav-bar>
    <div class="timeBox">
      <van-cell-group inset>
        <van-cell title="营业时间设置" size="large" />
        <van-cell
          title="开馆时间"
          size="large"
          is-link
          @click="changeBeginBusinessTime('begin')"
        >
          <template>
            <div class="timeValue">{{ beginBusinessTimeShow }}</div>
          </template>
        </van-cell>
        <van-cell
          title="闭馆时间"
          size="large"
          is-link
          @click="changeEndBusinessTime('end')"
        >
          <template>
            <div class="timeValue">{{ endBusinessTimeShow }}</div>
          </template>
        </van-cell>
        <!-- <van-cell> -->
        <van-button type="default" block @click="confirmModify"
          >确认修改</van-button
        >
        <!-- </van-cell> -->
      </van-cell-group>
    </div>

    <!-- 时间选择器 -->
    <van-popup v-model="show" position="bottom" :style="{ height: '35%' }">
      <van-datetime-picker
        v-model="currentTime"
        type="time"
        :filter="filter"
        @confirm="modifyTimeValue"
        @cancel="cancelModifyTimeValue"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'modifyBusinessTime',
  components: {},
  props: {},
  data() {
    return {
      show: false,
      beginBusinessTimeShow: '08:00', // 开馆时间(接口返回)
      endBusinessTimeShow: '22:00', // 闭馆时间
      currentTime: '12:00',
      timeFlag: 'begin',
    }
  },
  computed: {
    beginBusinessTime() {
      return this.$store.getters['businessTimeSlot'].beginBusinessTime
    },
    endBusinessTime() {
      return this.$store.getters['businessTimeSlot'].endBusinessTime
    },
  },
  watch: {},
  created() {
    this.beginBusinessTimeShow = this.beginBusinessTime
    this.endBusinessTimeShow = this.endBusinessTime
  },
  mounted() {},
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    filter(type, options) {
      if (type === 'minute') {
        return options.filter(option => option % 10 === 0)
      }
      return options
    },
    changeBeginBusinessTime(value) {
      this.timeFlag = value
      this.currentTime = this.beginBusinessTimeShow
      this.show = true
    },
    changeEndBusinessTime(value) {
      this.timeFlag = value
      this.currentTime = this.endBusinessTimeShow
      this.show = true
    },
    modifyTimeValue() {
      this.show = false
      if (this.timeFlag === 'begin') {
        this.beginBusinessTimeShow = this.currentTime
      } else {
        this.endBusinessTimeShow = this.currentTime
      }
    },
    cancelModifyTimeValue(){
      this.show = false
    },
    confirmModify() {
      console.log('confirmModify')
      // 二次提示
      this.$dialog
        .confirm({
          title: '提示',
          message: '确认修改营业时间？',
        })
        .then(() => {
          // on confirm
          this.$store.commit('setBusinessTimeSlot', {
            beginBusinessTime: this.beginBusinessTimeShow,
            endBusinessTime: this.endBusinessTimeShow,
          })
          this.$toast.success('修改成功')
          this.$router.push('/siteMy')
        })
        .catch(() => {
          // on cancel
        })
    },
  },
}
</script>

<style scoped lang="less">
.modifyBusinessTime {
  background-color: #819ced;
  height: 100vh;
  /deep/ .van-nav-bar {
    background-color: #819ced;
  }
  /deep/ .van-hairline--bottom:after {
    border-bottom-width: 0px;
  }
  /deep/ .van-nav-bar .van-icon {
    color: white;
  }
  .timeBox {
    margin-top: 1.2rem;
  }
  /deep/ .van-button__text {
    color: #3f99ff;
  }
}
.timeValue {
  font-size: 1.2rem;
  color: #3f99ff;
}
</style>
