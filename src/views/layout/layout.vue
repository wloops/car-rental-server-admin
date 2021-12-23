<template>
  <div class="layout">
    <router-view />
    <van-tabbar v-model="active">
      <van-tabbar-item icon="wap-home">主页</van-tabbar-item>
      <van-tabbar-item icon="friends">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant'
export default {
  name: 'layout',
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
  },
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
