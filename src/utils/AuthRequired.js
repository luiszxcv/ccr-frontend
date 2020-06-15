import { apiUrl,isDemo,headers} from '../constants/config'
import axios from 'axios'

export default (to, from, next) => {

  /*if (isDemo)
    next()*/
  if (localStorage.getItem('token') != null && localStorage.getItem('token').length > 0) {

    axios({
      method: 'post', //you can set what request you want to be
      url: apiUrl+'/wp-json/jwt-auth/v1/token/validate',
      data: {},
      headers: headers()
    })
    .then(
      res => {
        if (res.status == 200){
          next()
        }
      },
      err => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        next('/user/login')
      }
    )
  } else {  
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    next('/user/login')
  }
  
}
