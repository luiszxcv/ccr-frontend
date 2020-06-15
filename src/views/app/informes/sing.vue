<template >
  <div>
  <b-row>
    <b-colxx xxs="12">
      <piaf-breadcrumb :heading="$t('Informes')"/>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
<b-row class="">
            <b-colxx xxs="12" class="chat-app">
                <conversation-detail key="conversation" :current-user="user1" :other-user="user2" :messages="sInforme" />
                <!--<div v-else class="loading" key="conversationLoading"></div>-->
            </b-colxx>
</b-row>
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
    apiUrl
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
        title: "Empresa"}
      }
    },
    methods:{
      get_informes(){
        const headers = {
        'Content-Type': 'text/plain'
        };
        axios
        //.get(`${apiUrl}/wp-json/wp/v2/informes/?per_page=100&autor=${id}`,{headers:headers()})
        .get(`http://68.183.23.196:8090/v1/conversas`,{headers})
        .then(res => {
            this.sInforme.perguntas=[]
            this.sInforme.respostas=[]
            this.sInforme=[];
            res.data.forEach(user => {
                
                if (user.id == this.id_user ){
    
                    user.Conversa.forEach(msg=> {
                        /*this.sInforme.perguntas.push({sender: 1,
                        text: msg.Mensagem[0].pergunta,
                        time: "09:20"})
                        this.sInforme.respostas.push({sender: 2,
                        text: msg.Mensagem[0].resposta,
                        time: "09:20"})*/
                        this.sInforme.push({sender: 1,
                        text: msg.Mensagem[0].resposta,
                        time: "09:20"})

                        this.sInforme.push({sender: 2,
                        text: msg.Mensagem[0].pergunta,
                        time: "09:20"})
                    });
                    console.log(this.sInforme)
                }
            });
            
            //console.log(res)
        })
      }
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
</style>

