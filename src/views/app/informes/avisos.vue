<template >
  <div>
  <b-row>
    <b-colxx xxs="12">
      <piaf-breadcrumb :heading="$t('Avisos')"/>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>

<b-row>
    <b-colxx xxs="12">
      <b-card class="mb-3 d-flex flex-row"  v-for="(infome , index) in sInforme" v-bind:key="'aviso'+index" no-body>
        
        
          <div src="/assets/img/profile-pic-l.jpg" alt="Card image cap" class="align-self-center list-thumbnail-letters rounded-circle m-4 small">{{infome.acf.name.match(/\b(\w)/g).join('')}}</div>
        
        
        <div class=" d-flex flex-grow-1 min-width-zero">
          <div class=" pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
            <div class="min-width-zero">
              <h6 class="mb-1 card-subtitle truncate">{{infome.acf.name}}</h6>
              
              
              <a @click.prevent="showModal_whats('modal_whats',index)" style="display:inline-block !important;"  class="trassh align-self-start informe" >                    
                  <i class="iconsminds-sharethis"></i>Enviar via whats para:
              </a>              
              <p style="padding-top:5px;" class="text-muted text-small mb-1">ID: {{infome.ID}}
              </p>
            </div>
          </div>
        </div>
        <div class=" d-flex flex-grow-1 min-width-zero">
          <div class=" pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
            <div class="min-width-zero text-small">
              <P style="padding-top:5px;" class="text-muted text-small mb-1">
              Check'in realizado em</p>
              <h6 style="padding-top:5px;" class="mb-1 card-subtitle truncate">{{infome.post_date}}</h6>
              <div v-if="coordverifi(infome)" >
              <p style="padding-top:5px;" class="text-muted text-small mb-1">
                Checkpoint {{JSON.parse(infome.acf.coordenadas).checkin}}              
              </p></div>
            </div>
          </div>
        </div>
      </b-card>
    </b-colxx>
  </b-row>

  <b-modal id="modal_whats" ref="modal_whats" size="lg" title="Escreva a mensagem" hide-footer>
    <b-form-textarea
      id="textarea"
      v-model="msg_whats"
      placeholder="Enter something..."
      rows="3"
      max-rows="6"
    ></b-form-textarea>
    <b-form-group :label="$t('contato')">
                                <b-form-input v-model="numero_whats" />Ex: 556696181212 (sem o nono dígito)
                            </b-form-group>
    <br/>  
    <b-button variant="secondary" @click="hideModal('modal_whats')">Cancelar</b-button>
    <b-button variant="primary" @click="submit_msg()" class="mr-1">Enviar</b-button>
  </b-modal>

  <div>
    <b-row>
      <b-colxx xxs="12">
          <b-card >
        
          </b-card>
      </b-colxx>
      <b-colxx xxs="12">
      </b-colxx>
    </b-row>
  </div>
  
  <hr>

  </div>
</template>

<script>
    import {
    mapGetters,
    mapActions
} from 'vuex'
import ApplicationMenu from '../../../components/Common/ApplicationMenu'
import ContactList from '../../../components/ChatApp/ContactList'
import ConversationList from '../../../components/ChatApp/ConversationList'
import ConversationDetail from '../../../components/ChatApp/ConversationDetail'

  import axios from 'axios';
  import Comments from '../../../components/Custom/Comments'
  import {
    apiUrl,headers
} from '../../../constants/config'
  //import Post from '../../../components/Cards/Post'
  
  export default {
    name: 'SinglePost',
    components: {
        Comments,
        'application-menu': ApplicationMenu,
        'contact-list': ContactList,
        'conversation-list': ConversationList,
        'conversation-detail': ConversationDetail
    },
    data () {
      return {
        sInforme: [],
        id_user:"",
        user2:{date: "Last seen today 15:24",
        id: 2,
        img: "/assets/img/profile-pic-l.jpg",
        title: "Funcionário"},
        user1:{date: "Last seen today 15:24",
        id: 1,
        img: "/assets/img/profile-pic-l-4.jpg",
        title: "Empresa",},
        numero_whats:"",
        msg_whats:""
      }
    },
    methods:{
      hideModal(refname) {
            this.numero_whats= ""
            this.msg_whats =""
            this.$refs[refname].hide()
      },
      coordverifi(data){
            try{
              JSON.parse(data.acf.coordenadas)
              return true
            }
            catch{
              return false
            }
            
        },

      get_informes(){

        axios
        .get(`${apiUrl}/wp-json/wp/v2/informes/?per_page=100&author=${this.id_user}`)
        .then(res => {
            this.sInforme=[];
            this.sInforme =res.data
            
            console.log(res)
        })
        .catch(err=>{
          console.log(err)
        })
      },
      showModal_whats(refname,index) {
        this.$refs[refname].show()
        this.msg_whats = JSON.stringify(this.sInforme[index]["acf"])
      },
    

      submit_msg(){

        const headers = {
        'Content-Type': 'text/plain'
        };

        var msg = {
          "phone": this.numero_whats,
          "body": this.msg_whats
        }
        alert(this.numero_whats)

        if(this.msg_whats != ""){
          axios.post(`http://68.183.23.196:8090/v1/send`, msg)
          .then(res=>{
            this.addNotification('success','Sucesso','Msg enviada.')
            this.numero_whats="";
            this.msg_whats ="";
            this.hideModal('modal_whats')
            
          })
          .catch(err=>{
            console.log(err)
          })
        }
        else{
          alert("Mensagem vazia!")
        }

      },
      addNotification (type,title,message){
        this.$notify(type, title, message, { duration: 3000, permanent: false })
      },
    },
    beforeMount() {
        this.id_user= this.$route.query.post_id;
        this.get_informes()
    }
  }
</script>

<style>
.link_nova_linha{

}

.ps-container div div{
    align-content: right !important;
    align-items: right !important;
}
.trassh{

  border-radius: 15px;
  padding:5px;
  transition: .4s;
  background: green !important;
  color: white !important;

}
.trassh:hover{

  background: black;
  color: white;

}
</style>

