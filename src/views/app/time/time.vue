<template>

  <div>
  
  <b-row>
    <b-colxx xxs="12">
      <piaf-breadcrumb :heading="$t('menu.meu-time')"/>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>

  <b-button v-b-modal.modal_adduser variant="primary" size="lg" class="top-right-button"><i class="simple-icon-plus">&nbsp;</i>ADD</b-button>
  <br/><br/>

  <b-modal id="modal_adduser" ref="modal_adduser" :title="$t('Novo Caminhoneiro')" modal-class="modal">
  <b-form class="av-tooltip tooltip-label-bottom">

    <b-form-group :label="$t('Nome do Caminhoneiro')">
    <b-form-input v-model="form.name" />
    </b-form-group>
        
    <b-form-group :label="$t('WhatsApp Caminhoneiro')">
    <b-form-input type="tel"  v-mask="'## #####-####'" v-model="form.contact"/>
    </b-form-group>

    <b-form-group :label="$t('Nome do responsável na família')">
    <b-form-input v-model="form.namef" />
    </b-form-group>

    <b-form-group :label="$t('WhatsApp do responsável na família')">
    <b-form-input type="tel"  v-mask="'## #####-####'" v-model="form.contactf"/>
    </b-form-group>

    <p v-if="errors.length">
      <b>Por favor, corrija o(s) seguinte(s) erro(s):</b>
      <ul>
      <li v-for="(error,index) in errors" :key="`er${index}`">{{ error }}</li>
      </ul>
    </p>

    <div class="d-flex justify-content-between align-items-center mb-2">
      <b-button type="button" variant="primary" size="lg" @click="formSubmit()" :disabled="processing" :class="{'btn-multiple-state btn-shadow': true}">
        <span class="label"><i class="simple-icon-check"></i> Adicionar</span>
      </b-button>
    </div>
  </b-form>
  <template slot="modal-footer">
    <b-button variant="outline-secondary" @click="hideModal('modal_adduser')">{{ $t('Fechar') }}</b-button>
  </template>
  </b-modal>


  <!-- Modal - exclude confirm? -->
  <b-modal id="modal_excludeuser" ref="modal_excludeuser" size="sm" title="Você tem certeza?" hide-footer>
                        <b-button variant="secondary" @click="hideModal('modal_excludeuser')">Cancelar</b-button>
                        <b-button variant="primary" @click="remove_userEquipe()" class="mr-1">Sim</b-button>
  </b-modal>
  <b-modal id="modal_whats" ref="modal_whats" size="lg" title="Escreva a mensagem" hide-footer>
    <b-form-textarea
      id="textarea"
      v-model="msg_whats"
      placeholder="Enter something..."
      rows="3"
      max-rows="6"
    ></b-form-textarea>
    <b-input-group
    <br/>
    <b-button variant="secondary" @click="hideModal('modal_whats')">Cancelar</b-button>
    <b-button variant="primary" @click="submit_msg()" class="mr-1">Enviar</b-button>
  </b-modal>

  
  
  <b-row>
    <b-colxx md="6" sm="6" lg="4" xxs="12"  v-for="(people , index) in arPessoas" v-bind:key="'people'+index">
      <b-card class="mb-3 d-flex flex-row" no-body>
        
        <a class="align-self-start" @click.prevent="showModal('modal_excludeuser',people.id)" >                    
            <i class="simple-icon-trash trash"></i>
        </a>
        
        <a  class = "" :href="'tel:0'+tel_clean(people.contato_caminhoneiro)" target="blank">                    
                        <i class="fa fa-phone btn mb-1 contact"></i>
        </a>
        <a @click.prevent="showModal_whats('modal_whats',tel_whats(people.contato_caminhoneiro))" > <!--:href="'http://api.whatsapp.com/send?1=pt_BR&phone=55'+tel_clean(people.contato_caminhoneiro)" target="blank"-->        
          <i class="fa fa-whatsapp btn mb-1 whats"></i>
        </a>
        
        <router-link  v-on:click="passParams(people.id)" :to="{ path: '/app/informes/sing', query: { post_id:  people.id  }}" class="d-flex">
          <div src="/assets/img/profile-pic-l.jpg" alt="Card image cap" class="align-self-center list-thumbnail-letters rounded-circle m-4 small">{{people.name.match(/\b(\w)/g).join('')}}</div>
        </router-link>
        
        <div class=" d-flex flex-grow-1 min-width-zero">
          <div class=" pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
            <div class="min-width-zero">
              <h6 class="mb-1 card-subtitle truncate">{{people.name}}</h6>
               <p  class="text-muted text-small mb-1">{{people.contato_caminhoneiro}} | 
              ID: {{people.id}}<br/>
              <router-link style="display:inline-block !important; padding-top:5px;" v-on:click="passParams(people.id)" :to="{ path: '/app/informes/sing', query: { post_id:  people.id  }}" class="d-flex">
              <a style="display:inline-block !important;"  class="align-self-start informe" >                    
                  <i class="simple-icon-eye"></i>Ver conversas
              </a>
              </router-link>
              <router-link style="display:inline-block !important;" v-on:click="passParams(people.id)" :to="{ path: '/app/informes/avisos', query: { post_id:  people.id  }}" class="d-flex">
              <a class="align-self-start informe" >                    
                  <i class="simple-icon-eye"></i>Ver avisos
              </a>
              </router-link>
              </p>
              <p class="text-muted text-small mb-1">
              Familiar: {{people.nome_familiar}} {{people.contato_familiar}}</p>
            </div>
          </div>
        </div>
      </b-card>
    </b-colxx>
  </b-row>
</div>
</template>

<script>



import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import axios from 'axios'
import { apiUrl,headers } from '../../../constants/config'
import {
    validationMixin
} from "vuelidate";
import {
    mapGetters,
    mapActions
} from "vuex";
const {
    required,
    maxLength,
    minLength,
    email
} = require("vuelidate/lib/validators");
  
  export default {
    name: 'Pessoas',
    components: {
        'v-select': vSelect,
        
    },
    data () {
      return {
        arPessoas: [],
        form: {
          email: "",
        },
        error: null,
        response:false,
        errors: [],
        id_exclude: false,
        msg_whats:"",
        numero_whats:"",

        
      }
    },
    mixins: [validationMixin],
    validations: {
        form: {
          name:"",
          contact:"",
          namef:"",
          contactf:"",
            /*email: {
                required,
                email,
                minLength: minLength(4)
            }*/
        }
    },
    computed:{
      ...mapGetters(["processing"]),
      
      
    }
    ,
    methods:{
      
      showModal_whats(refname,n) {
        this.$refs[refname].show()
        this.numero_whats=n
        //alert(n)
      },
    

      submit_msg(){

        const headers = {
        'Content-Type': 'text/plain'
        };

        var msg = {
          "phone": this.numero_whats,
          "body": this.msg_whats
        }

        if(this.msg_whats != ""){
          axios.post(`http://68.183.23.196:8090/v1/send`, msg)
          .then(res=>{
            this.addNotification('success','Sucesso','Msg enviada.')
            this.numero_whats="";
            this.msg_whats ="";
            
          })
          .catch(err=>{
            console.log(err)
          })
        }
        else{
          alert("Mensagem vazia!")
        }

      },
      passParams(id){
        this.$emit('id-post',{
          id : id
        });
        console.log(id);
      },
      add_userEquipe(id_novoUser){
 
        axios
        .post(`${apiUrl}/wp-json/wp/v2/users/${id_novoUser}`,{
            "equipe_modifi":"add"
        },{headers:headers()})
        .then(res => {
          this.addNotification('success','Sucesso','O caminhoneiro já era cadastrado na plataforma e foi adicionado a sua equipe.')
          this.form ={
            name:"",
            contact:"",
            namef:"",
            contactf:"",
          }
          this.get_allEquipe()
        })
        .catch(err=>{
          alert(err)
        })

      },
      remove_userEquipe(){

        axios
        .post(`${apiUrl}/wp-json/wp/v2/users/${this.id_exclude}`,{
            "equipe_modifi":"remove"
        },{headers:headers()})
        .then(res => {
          alert("Removido com sucesso")
          this.get_allEquipe()
        })
        .catch(err=>{
          alert(err)
        })
        this.hideModal('modal_excludeuser')
        this.id_exclude = false

      },
      add_newUser(){

        var email = this.form.contact.replace(/[^0-9\.]+/g, "")+'@gmail.com'

        axios
        .post(`${apiUrl}/wp-json/wp/v2/users/register/`,{
        "username": email,
        "email": email,
        "password": this.form.contact.replace(/[^0-9\.]+/g, ""),
        "name": this.form.name,
        "meta": {
            "equipe": ",71,",
            "nome_caminhoneiro":this.form.name,
            "contato_caminhoneiro": this.form.contact,
            "nome_familiar": this.form.namef,
            "contato_familiar":this.form.contactf}
        })
        .then(res => {
          this.addNotification('success','Sucesso','Caminhoneiro adicionado com sucesso!.')
          this.form ={
            name:"",
            contact:"",
            namef:"",
            contactf:"",
          }
          this.get_allEquipe()
        })

      },
      verifi_userExist(){
        axios
        .post(`${apiUrl}/wp-json/wp/v2/existuser`,{"email":this.form.contact.replace(/[^0-9\.]+/g, "")+'@gmail.com'},{headers:headers()})
        .then(
          res => {
            if (res.status == 200){
              let exist = []

              exist = this.arPessoas.filter((user) => {
                return user.id == res.data;
              })

              if (exist.length == 0){
                this.add_userEquipe(res.data) 
              }
              else{
                this.addNotification('error','Atenção','Caminhoneiro já está na equipe!.')

                this.form ={
                  name:"",
                  contact:"",
                  namef:"",
                  contactf:"",
                }
                return(false)
              }
            }
            
          },
          err => {
            
            this.add_newUser()
            
          }
        )
      },
      formSubmit() {
            if(!this.checkForm()){
              this.verifi_userExist()
            }
      },
      get_allEquipe(){
        axios
        .get(`${apiUrl}/wp-json/wp/v2/users`,{headers:headers()})
        .then(res => {
          this.arPessoas = res.data
          //console.log(this.arPessoas)
        })
      },
      checkForm(){

            if ( !(this.form.contact) || !(this.form.name) || (this.form.contact.length < 13) || !(this.form.contactf) || !(this.form.namef) || (this.form.contactf.length < 13)) {
                this.errors = [];
                if (!this.form.name) {
                    this.errors.push('O nome é obrigatório.');
                }
                if (!this.form.contact) {
                    this.errors.push('O contato é obrigatório.');
                }
                try {
                  if (this.form.contact.length < 13 ) {
                    this.errors.push('O contato está com números faltando.');
                  }
                } catch (error) {
                  //
                }
                if (!this.form.namef) {
                    this.errors.push('O nome do familiar é obrigatório.');
                }
                if (!this.form.contactf) {
                    this.errors.push('O contato do familiar é obrigatório.');
                }

                try {
                if (this.form.contactf.length < 13 ) {
                    this.errors.push('O contato está com números faltando.');
                }
                } catch (error) {
                  //
                }
                return true
            }
            else{
                this.errors = []
                return false
            }
      },
      hideModal(refname) {
            this.form = {
                    name: '',
                    contact: ''
            }
            this.$refs[refname].hide()
      },
      showModal(refname,id) {
        this.$refs[refname].show()
        this.id_exclude = id
      },
      tel_clean(contato){
        return contato.replace(/[^0-9\.]+/g, "")
      },
      tel_whats(contato){
        return "5566"+contato.replace(/[^0-9\.]+/g, "").slice(4); 
      },
      addNotification (type,title,message){
        this.$notify(type, title, message, { duration: 3000, permanent: false })
      },
    },
   
    beforeMount() {
      //var id = this.$route.params.slug;
      this.get_allEquipe()
    },
    
  }
</script>

<style>
.link_nova_linha{

}

.informe{
  padding: 5px 7px;
  margin: 1px;
  border-radius: 15px;
  color:white !important;
  background: gray !important;
  transition: .4s;
}
.informe:hover{
  background: green !important;
  transition: .4s;
}

.contact{
  border-radius: 50%;
  position: absolute;
  font-size: 14px;
  color:gray;
  top: 68px;
  right:15px;
  padding:3px 9px;
  transition: .4s;
}
.contact:hover{

  background:green;
  color: white;

}
.whats{
  border-radius: 50%;
  position: absolute;
  font-size: 16px;
  color: green;
  top: 38px;
  right:15px;
  padding:2px 8px;
  transition: .4s;
}
.whats:hover{

  background:green;
  color: white;

}

.trash{

  border-radius: 50%;
  position: absolute;
  top: 10px;
  right:15px;
  padding:10px;
  transition: .4s;

}
.trash:hover{

  background: black;
  color: white;

}
</style>