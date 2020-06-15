import firebase from 'firebase/app'
import 'firebase/auth'
import { apiUrl } from '../../constants/config'
import axios from 'axios';

export default {
  state: {
    currentUser: localStorage.getItem('user') != null ? JSON.parse(localStorage.getItem('user')) : null,
    registerError : null,
    loginError: null,
    processing: false,
    forgotMailSuccess:null,
    resetPasswordSuccess:null
  },
  getters: {
    currentUser: state => state.currentUser,
    processing: state => state.processing,
    loginError: state => state.loginError,
    registerError: state => state.registerError,
    forgotMailSuccess: state => state.forgotMailSuccess,
    resetPasswordSuccess:state => state.resetPasswordSuccess,
  },
  mutations: {
    setUser(state, payload) {
      state.currentUser = payload
      state.processing = false
      state.loginError = null
      state.registerError = null
    },
    setLogout(state) {
      state.currentUser = null
      state.processing = false
      state.loginError = null
      state.registerError = null
    },
    setProcessing(state, payload) {
      state.processing = payload
      state.loginError = null
      state.registerError = null
    },
    setError(state, payload) {
      state.loginError = payload
      state.registerError = payload
      state.currentUser = null
      state.processing = false
    },
    setForgotMailSuccess(state) {
      state.registerError = null
      state.loginError = null
      state.currentUser = null
      state.processing = false
      state.forgotMailSuccess=true
    },
    setResetPasswordSuccess(state) {
      state.registerError = null
      state.loginError = null
      state.currentUser = null
      state.processing = false
      state.resetPasswordSuccess=true
    },
    clearError(state) {
      state.loginError = null
      state.registerError = null
    }
  },
  actions: {
    login({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      //firebase
        //.auth()
        //.signInWithEmailAndPassword(payload.email, payload.password)
        axios.post( apiUrl + '/wp-json/jwt-auth/v1/token/',
        {
          username: payload.email,
          password: payload.password,
        })
        .then(
          user => {
            //const item = { uid: user.user.uid, ...currentUser }
            const item = {
              date: "Ultimo login em "+user.data.u_login,
              id: user.data.id,
              img: "/assets/img/profile-pic-l.jpg",
              title: user.data.name,
              uid: user.data.token
            }
            localStorage.setItem('user', JSON.stringify(item))
            localStorage.setItem('token', user.data.token)
            commit('setUser', item )//{ uid: user.user.uid, ...currentUser })
          },
          err => {
            localStorage.removeItem('user')
            localStorage.removeItem('token')
            commit('setError', err.message)
            setTimeout(() => {
              commit('clearError')
            }, 3000)
          }
        )
    },
    register({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      const parameters = {
              username:payload.email,
              email:payload.email,
              password:payload.password,
              name: payload.fullname,
              meta: {
                "equipe": "",
              }
      }
      axios.post( apiUrl + '/wp-json/wp/v2/users/register',parameters)
      .then(
        us=> {
          
          axios.post( apiUrl + '/wp-json/jwt-auth/v1/token/',
          {
            username: payload.email,
            password: payload.password,
          })
          .then(
            usser => {
              const item = {
                date: "Ultimo login em "+usser.data.u_login,
                id: usser.data.id,
                img: "/assets/img/profile-pic-l.jpg",
                title: usser.data.name,
                uid: usser.data.token
              }
              localStorage.setItem('user', JSON.stringify(item))
              localStorage.setItem('token', usser.data.token)
              commit('setUser', item )//{ uid: user.user.uid, ...currentUser })

            },
            err => {
              localStorage.removeItem('user')
              localStorage.removeItem('token')
              commit('setError', err.message)
              setTimeout(() => {
                commit('clearError')
              }, 3000)
            }
          )
        }
      )
    },
    forgotPassword({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      /*firebase
        .auth()
        .sendPasswordResetEmail(payload.email)*/
        .then(
          user => {
            commit('clearError')
            commit('setForgotMailSuccess')
          },
          err => {
            commit('setError', err.message)
            setTimeout(() => {
              commit('clearError')
            }, 3000)
          }
        )
    },
    resetPassword({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      /*firebase
        .auth()
        .confirmPasswordReset(payload.resetPasswordCode,payload.newPassword)*/
        .then(
          user => {
            commit('clearError')
            commit('setResetPasswordSuccess')
          },
          err => {
            commit('setError', err.message)
            setTimeout(() => {
              commit('clearError')
            }, 3000)
          }
        )
    },
    /*
       return await auth.(resetPasswordCode, newPassword)
        .then(user => user)
        .catch(error => error);
    */
    signOut({ commit }) {
      //firebase
        //.auth()
        //.signOut()
        //.then(() => {
          localStorage.removeItem('user')
          localStorage.removeItem('token')
          commit('setLogout')
        //}, _error => { })
    }
  }
}
