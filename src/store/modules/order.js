export default {
  namespaced: true,
  state() {
    return {
      // 是否指派司机
      isAssignDriver: false,
      // 当前订单
      currentOrder: {},
    }
  },
  getters: {
    // 是否指派司机
    isAssignDriver: state => state.isAssignDriver,
    // 当前订单
    currentOrder: state => state.currentOrder,
  },
  mutations: {
    // 是否指派司机
    setIsAssignDriver(state, playload) {
      state.isAssignDriver = playload
    },
    // 当前订单
    setCurrentOrder(state, playload) {
      state.currentOrder = playload
    },
  },
  actions: {},
}
