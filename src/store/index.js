import Vue from 'vue'
import Vuex from 'vuex'

import app from '../main'
import menu from './modules/menu'
import user from './modules/user'
import todo from './modules/todo'
import VueTheMask from 'vue-the-mask'

Vue.use(Vuex)
Vue.use(VueTheMask)

export default new Vuex.Store({
  state: {
    cartTotal: localStorage.getItem( 'itensCart' ) != null && localStorage.getItem( 'itensCart' ).split(",")[0] != "" ? localStorage.getItem( 'itensCart' ).split(",").length : 0
  },
  mutations: {
    changeLang(state, payload) {
      app.$i18n.locale = payload
      localStorage.setItem('currentLanguage', payload)
    },
    increment (state) {
      state.cartTotal = localStorage.getItem( 'itensCart' ) != null && localStorage.getItem( 'itensCart' ).split(",")[0] != "" ? localStorage.getItem( 'itensCart' ).split(",").length : 0
      state.cartItens = localStorage.getItem( 'itensCart' ) != null && localStorage.getItem( 'itensCart' ).split(",")[0] != "" ? localStorage.getItem( 'itensCart' ).split(","): 0
    }
  },
  actions: {
    setLang({ commit }, payload) {
      commit('changeLang', payload)
    }
  },
  modules: {
    menu,
    user,
    todo
  }
})
