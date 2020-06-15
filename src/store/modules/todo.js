import axios from 'axios'
import { apiUrl,headers } from '../../constants/config'

const state = {
  isLoad: false,
  allItems: null,
  items: null,
  todoError: ''
}

const getters = {
  isLoad: state => state.isLoad,
  allItems: state => state.allItems,
  todoError: state => state.todoError,
  items: state => state.items
}

const mutations = {
  getTodoItemsSuccess (state, items) {
    state.isLoad = true
    state.allItems = items
    state.items = items
  },
  getTodoItemsError (state, error) {
    state.isLoad = false
    state.todoError = error
    state.allItems = null
    state.items = null
  },
  addinforme (state, newItem) {
    state.isLoad = false
    axios
    .post(`${apiUrl}/wp-json/wp/v2/informes`,newItem,{headers:headers()})
    .then(res => {
      res.data["ID"] = res.data.id
      res.data["post_date"] =  res.data.date.replace("T", " ");
      state.items.unshift(res.data)
      state.allItems = state.items
      
    })
    state.isLoad = true
  },
  submitEdit(state, datainforme) {
    state.isLoad = false
    axios
    .post(`${apiUrl}/wp-json/wp/v2/informes/${datainforme.informeId}`,datainforme,{headers:headers()})
    .then(res => {
      
      if (datainforme.status == "trash"){
        state.items.splice(datainforme.informeIndex, 1)

        state.allItems = state.items
        state.items.unshift("")
        state.items.shift();
      }
      if (datainforme.status == "publish"){
        state.items[datainforme.informeIndex] = res.data
        state.allItems = state.items
        state.items.unshift("")
        state.items.shift();
      }
      
    })
    state.isLoad = true
  },

}
const actions = {
  getTodoItems ({ commit }) {
    state.isLoad = false
    axios
      .get(`${apiUrl}/wp-json/wp/v2/informes/?per_page=100`,{headers:headers()})
      .then(r => r.data)
      .then(res => {
          commit('getTodoItemsSuccess', res)
          state.isLoad = true
      })
  },
}

export default {
  state,
  getters,
  mutations,
  actions
}
