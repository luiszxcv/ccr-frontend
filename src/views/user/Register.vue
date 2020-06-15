<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md=10  class="mx-auto my-auto">
      <b-card class="auth-card" no-body>
          <div class="position-relative image-side ">
            <p class=" text-white h2">{{ $t('Gestão de caminhoneiros inteligente') }}</p>
              <p class="white mb-0">  Por favor, use este formulário para se registrar. <br />Já fez cadastro?
                <br />
                <br />
                <router-link tag="a" to="/user/login" class=" btn btn-shadow" style="background: white;">FAÇA LOGIN</router-link>
              </p>
          </div>
          <div class="form-side">
            <router-link tag="a" to="/"><span class="logo-single"/></router-link>
            <h6 class="mb-4">{{ $t('user.register')}}</h6>
            <b-form @submit.prevent="formSubmit">
               <label class="form-group has-float-label mb-4">
                <input type="text" class="form-control" v-model="fullname">
                <span>{{ $t('user.fullname') }}</span>
              </label>
              <label class="form-group has-float-label mb-4">
                <input type="email" class="form-control" v-model="email">
                <span>{{ $t('user.email') }}</span>
              </label>
              <label class="form-group has-float-label mb-4">
                <input type="password" class="form-control" v-model="password">
                <span>{{ $t('user.password') }}</span>
              </label>
              <div class="d-flex justify-content-end align-items-center">
                  <b-button type="submit" variant="primary" size="lg" :class="{'btn-multiple-state btn-shadow': true,
                    'show-spinner': processing,
                    'show-success': !processing && registerError===false,
                    'show-fail': !processing && registerError }">
                            <span class="spinner d-inline-block">
                                <span class="bounce1"></span>
                                <span class="bounce2"></span>
                                <span class="bounce3"></span>
                            </span>
                            <span class="icon success">
                                <i class="simple-icon-check"></i>
                            </span>
                            <span class="icon fail">
                                <i class="simple-icon-exclamation"></i>
                            </span>{{ $t('user.register-button')}}</b-button>
                  
              </div>
          </b-form>
        </div>
      </b-card>
    </b-colxx>
  </b-row>
</template>
<script>
import { apiUrl,isDemo,headers} from '../../constants/config'
import axios from 'axios'
import {
    mapGetters,
    mapActions
} from "vuex";

export default {
  data () {
    return {
      fullname: '',
      email: '',
      password: ''
    }
  },
  methods: {
    ...mapActions(["register"]),
    formSubmit() {

        this.register({
            email: this.email,
            password: this.password,
            fullname: this.fullname
        });
    }
    /*formSubmit () {
      console.log('register')
      this.$router.push('/')
    }*/
  },
    computed: {
        ...mapGetters(["currentUser", "processing", "registerError"])
    },
    beforeMount() {
        if (localStorage.getItem('token') != null && localStorage.getItem('token').length > 0) {
            axios({
                method: 'post', //you can set what request you want to be
                url: apiUrl+'/wp-json/jwt-auth/v1/token/validate',
                data: {},
                headers: headers()
            })
            .then(
                res => {
                    //console.log("autenticado")
                    if (res.status == 200){
                        this.$router.push("/");
                    }

                },
                err => {
                    localStorage.removeItem('user')
                    localStorage.removeItem('token')
                }
            )
        }else{}
    },
    watch: {
        currentUser(val) {
            if (val && val.uid && val.uid.length > 0) {
                setTimeout(() => {
                    this.$router.push("/");
                }, 200);
            }
        },
        registerError(val) {
            if (val != null) {
                this.$notify("error", "Login Error", val, {
                    duration: 3000,
                    permanent: false
                });

            }
        }
    }
}
</script>
