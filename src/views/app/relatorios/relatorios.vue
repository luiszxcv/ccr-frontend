<template>

  <div>
  
  <b-row>
    <b-colxx xxs="12">
      <piaf-breadcrumb :heading="$t('menu.relatorios')"/>
      <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>

  <div v-for="(item , index) in arPessoas" v-bind:key="index">
    <b-row>
      <b-colxx xxs="12">
          <b-card class="mb-4" >
            <h1 class="sPost_title">{{ item.title.rendered }} - <h5 class="sPost_date">{{ item.date }}</h5></h1>
          </b-card>
      </b-colxx>
      <b-colxx xxs="12">
        <!--<hr>
        <span v-html="item.content.rendered"></span>
        <hr>-->
        <!--{{ item.tags }}
        <hr>
        {{ item.author }}-->
      </b-colxx>
    </b-row>
  </div>
  </div>
</template>

<script>

import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import axios from 'axios'
import { apiUrl,headers,menu_data } from '../../../constants/config'
  
  export default {
    name: 'Pessoas',
    components: {
        'v-select': vSelect,
    },
    data () {
      return {
        arPessoas: []
      }
    },
    methods:{
      passParams(id){
        this.$emit('id-post',{
          id : id
        });
        console.log(id);
      }
    },
    beforeMount() {
          var id = this.$route.params.slug;
          /*axios.all([
            axios.get(apiUrl+'/wp-json/wp/v2/Pessoas/',{
              params: {
                slug: this.$route.params.slug
              }
            })
          ]).then(([{ data: Pessoas }]) => {
            this.arPessoas = Pessoas;
            console.dir(this.arPessoas);
          });*/
    },
  }
</script>

<style>
.link_nova_linha{

}
</style>