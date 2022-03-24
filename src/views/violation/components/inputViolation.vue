<template>
  <div class="inputViolation">
    <div class="topNav">
      <van-nav-bar
        fixed
        placeholder
        title="录入违章信息"
        left-arrow
        color="#000"
        @click-left="onClickLeft"
      />
    </div>
    <div class="content">
      <van-form @submit="onSubmit">
        <van-cell center title="交通罚款">
          <!-- <template #right-icon>
          <van-switch @change="changeIsChecked" v-model="isChecked" size="24" />
        </template> -->
        </van-cell>
        <!-- <template v-if="isChecked"> -->
        <template>
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
          <!-- <van-field name="uploader" label="罚单照片">
            <template #input>
              <van-uploader v-model="fileList" multiple />
            </template>
          </van-field> -->
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
        </template>
        <div style="margin: 16px">
          <van-button round block type="info" native-type="submit"
            >提交</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { inputViolation } from '@/api/order'
export default {
  name: 'inputViolation',
  components: {},
  props: {},
  data() {
    return {
      trafficTickets: [{ fee: '' }], // 交通罚款
      trafficNum: 1, // 交通罚款数量
      trafficTicketTotal: 0.0, // 交通罚款总金额
      trafficTicketRemark: '', // 交通罚款备注
      fileList: [
        { url: 'https://img01.yzcdn.cn/vant/leaf.jpg' },
        // Uploader 根据文件后缀来判断是否为图片文件
        // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
        // { url: 'https://cloud-image', isImage: true },
      ], // 交通罚款照片
    }
  },
  computed: {
    currentOrder() {
      return this.$store.getters['order/currentOrder']
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onClickLeft() {
      this.$router.go(-1)
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
    feeAdding() {
      // 全部罚单费用相加
      let sum = 0
      this.trafficTickets.forEach(item => {
        sum += Number(item.fee)
      })
      this.trafficTicketTotal = sum
      console.log('sum', sum)
    },
    onSubmit(values) {
      console.log(values)
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定录入吗？',
        })
        .then(() => {
          inputViolation({
            billNo: this.currentOrder.billNo,
            trafficTicketNum: this.trafficNum,
            trafficTicketAmt: this.trafficTicketTotal,
            trafficTicketRemark: this.trafficTicketRemark,
          }).then(res => {
            console.log(res)
            if (res.data.rs === '1') {
              this.$toast('录入成功')
              this.$router.go(-1)
            } else {
              this.$toast.fail(res.data.rs)
            }
          })
        })
    },
  },
}
</script>

<style scoped lang="less">
/deep/ .feeInput .van-button {
  margin-right: 0.2rem;
}
</style>
