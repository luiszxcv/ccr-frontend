export const defaultMenuType = 'menu-default sub-hidden' // 'menu-default', 'menu-sub-hidden', 'menu-hidden';
export const defaultStartPath = '/app'
export const searchPath = '#'
export const buyUrl = '#'

export const subHiddenBreakpoint = 1440
export const menuHiddenBreakpoint = 768

export const defaultLocale = 'pt'
export const defaultDirection = 'ltr'
export const localeOptions = [
  { id: 'pt', name: 'Português LTR', direction: 'ltr' },
  { id: 'en', name: 'Inglês LTR', direction: 'ltr' },
  //{ id: 'enrtl', name: 'Inglês RTL', direction: 'rtl' }
]

/*export const firebaseConfig = {
  apiKey: "AIzaSyDe94G7L-3soXVSpVbsYlB5DfYH2L91aTU",
  authDomain: "piaf-vue-login.firebaseapp.com",
  databaseURL: "https://piaf-vue-login.firebaseio.com",
  projectId: "piaf-vue-login",
  storageBucket: "piaf-vue-login.appspot.com",
  messagingSenderId: "557576321564",
  appId: "1:557576321564:web:bc2ce73477aff5c2197dd9"
};*/


export const apiUrl = 'https://enterprise.escalepro.com.br'

export const headers = function() {
  let token = localStorage.getItem('token') != null ? localStorage.getItem('token'): null
    return  { 'Authorization': 'Bearer ' + token }
}
/*export const menu_data = function() {
  let menu_data = {is:localStorage.getItem('status_atual') != null ? true : false ,get:{status_atual:localStorage.getItem('status_atual'),index:localStorage.getItem('index_menu')}}  
  return  menu_data
}*/

//const userr = localStorage.getItem('user') != null ? JSON.parse(localStorage.getItem('user')) : null
//export const currentUser = userr

export const isDemo = false
export const themeRadiusStorageKey = 'theme_radius'
export const defaultColor = 'light.blue'
export const colors = [
  //'light.purple',
  //'dark.purple',
  'light.blue',
  'dark.blue',
  //'light.green',
  //'dark.green',
  //'light.orange',
  //'dark.orange',
  //'light.red',
  //'dark.red'
]
