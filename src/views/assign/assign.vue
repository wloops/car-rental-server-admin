<template>
  <div class="assign">
    <div class="assignMain">
      <assign-driver v-if="isAssignDriver === false"></assign-driver>
      <assign-car v-else></assign-car>
    </div>
  </div>
</template>

<script>
import assignCar from './components/assignCar.vue'
import assignDriver from './components/assignDriver.vue'
export default {
  name: 'assign',
  components: {
    assignCar,
    assignDriver,
  },
  props: {},
  data() {
    return {}
  },
  computed: {
    isAssignDriver() {
      return this.$store.getters['order/isAssignDriver']
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onClickLeft() {
      this.$router.go(-1)
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
