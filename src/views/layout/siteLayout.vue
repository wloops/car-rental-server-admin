<template>
  <div class="layout">
    <router-view />
    <van-tabbar v-model="active">
      <van-tabbar-item icon="wap-home" to="/site">主页</van-tabbar-item>
      <van-tabbar-item icon="friends" to="/siteMy">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'layout',
  components: {},
  props: {},
  data() {
    return {
      active: 0,
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style scoped lang="less"></style>
