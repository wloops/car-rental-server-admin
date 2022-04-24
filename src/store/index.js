import Vue from 'vue'
import Vuex from 'vuex'

import order from './modules/order'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    businessTimeSlot: {
      beginBusinessTime: '08:00',
      endBusinessTime: '22:00',
    },
  },
  getters: {
    businessTimeSlot: state => state.businessTimeSlot,
  },
  mutations: {
    setBusinessTimeSlot(state, playload) {
      state.businessTimeSlot = playload
    },
  },
  actions: {},
  modules: {
    order,
  },
})
