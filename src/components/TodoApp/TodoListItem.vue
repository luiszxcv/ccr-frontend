<template>
    <b-card  :class="{'d-flex mb-3':true, 'active':selectedItems.includes(data.ID)}" no-body><!--@click.prevent="toggleItem($event,data.ID)"-->
        <div class="d-flex flex-grow-1 min-width-zero exclude_check" >
            
            <a :class="{'custom-control custom-checkbox pl-1 align-self-md-center align-self-start mr-0 ':true,'pt-4' :get_size < 768}" v-b-modal.modal_excludeLead @click.prevent="excludeLead_confirm(data.ID)">                    
                <i class="simple-icon-trash btn mb-1 btn-light exclude" ></i>
            </a>
            <div @click.prevent="toggleItem($event,data.ID)" :class="{'checbox custom-control custom-checkbox pl-1 align-self-md-center align-self-start mr-4 ':true,'pt-4' :get_size < 768}">
                <b-form-checkbox :checked="selectedItems.includes(data.ID)" class="itemCheck mb-0 "/>
            </div>
            
        </div>
        <div class="d-flex flex-grow-1 min-width-zero">

            <b-card-body class="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero  pb-2"><!--align-items-md-center-->
                <a href="#" class=" list-item-heading mb-0 truncate w-40 w-xs-100  mb-1 mt-1" @click.prevent="toggleItem($event,data.ID)">
                    <i :class="status_icon(data.categories.status[0].term_id)"/>
                    <span class="align-middle d-inline-block">{{data.acf.name}}</span>
                </a>
                
                <div class="sizes"  >
                    <div class="grid-container"  >
                        <div class="grid-item" v-for="(obs,index) in data.categories.tags[25]" :key="index+'A'">
                            <b-badge   pill>{{obs.name}}</b-badge></div>  
                    </div>

                    <div class = "spacer" ></div>
                    <div class="grid-container" >
                        <div class="grid-item"  v-for="(prospec,index) in data.categories.tags[26]" :key="index+'B'">
                            <b-badge style = "background: gray  !important;" :variant="data.labelColor" pill>{{prospec.name}}</b-badge>
                        </div>  
                    </div>                
                </div>
                
                <p class="mb-1 text-muted text-small size alinha"> <!-- class = "w-15"-->
                    <b-badge :variant="data.labelColor" pill>{{data.categories.status[0].name}}</b-badge>
                    <b-badge v-if="privateVerifi" :variant="data.labelColor" pill><i class= "simple-icon-people" style= "font-weight: 600;"></i></b-badge>
                    <b-badge v-else :variant="data.labelColor" pill><i class= "simple-icon-lock" style= "font-weight: 600;"></i></b-badge>
                </p><!--style = "background: #f09c00 !important; color:white;"-->

                <p class="mb-1  text-small size alinha">{{data.post_date}}</p>
                <p class="mb-1   text-small actions_lead ">
                    <a v-if="get_size < 768" :href="'tel:0'+clean_tel" target="blank">                    
                        <i class="fa fa-phone btn mb-1 btn-success whats"></i>
                    </a>
                    <a :href="'http://api.whatsapp.com/send?1=pt_BR&phone=55'+clean_tel" target="blank">                    
                        <i class="fa fa-whatsapp btn mb-1 btn-success whats"> {{data.acf.contact}}</i>
                    </a>
                    <a v-b-modal.modal_editLead @click.prevent="editLead(data.ID)">                    
                        <i class="simple-icon-note btn mb-1 btn-light edit" ></i>
                    </a>
                    
                    <b-dropdown id="ddown5"  size="sm" right class="">
                        <b-dropdown-item disabled>{{ $t('lead.move to') }}</b-dropdown-item>
                        <b-dropdown-divider></b-dropdown-divider>
                        <b-dropdown-item v-for="(status,index) in all_statusList" :key="`sta${index}`"  @click.prevent="editsLead({id_lead:data.ID,statusId:status.value})"><a >{{status.text}}</a></b-dropdown-item>
                    </b-dropdown>

                </p>
            </b-card-body>
            
        </div>
        <div class="card-body pt-0"><p class="mb-0" v-html="data.detail"></p></div>
    </b-card>
</template>

<script>
export default {
    data(){
        return{
            windowWidth:0
        }
    },
    props: ['data', 'selectedItems' ,'all_statusList'],
    methods: {
        toggleItem (event, itemId) {
            this.$emit('toggle-item', event, itemId)
        },
        editLead(lead_id){
            this.$emit('edit-lead', lead_id)
        },
        editsLead(data){
            this.$emit('edit-sLead', data)
        },
        excludeLead_confirm(id_lead){
            this.$emit('exclude-leadConfirm', id_lead)
        },
        status_icon (id){
            return{ 'heading-icon':true,
                'simple-icon-fire' :id === 68,
                'simple-icon-bubbles' :id === 69,
                'simple-icon-clock' :id === 70,
                'simple-icon-check' :id === 71,
                'simple-icon-dislike' :id === 72,
            }
        },
    },
    computed:{
        clean_tel(){
            return this.data.acf.contact.replace(/[^0-9,]*/g, '').replace(',', '.')
        },
        get_size(){
            return this.windowWidth = window.innerWidth
        },
        privateVerifi(){
            if (this.data.acf.responsaveis_data != null && this.data.acf.responsaveis_data != ""){
                var response = true//JSON.parse(this.data.acf.responsaveis_data)[1].username[0]
            }
            else{
                var response = false
            }
            return response //
        }
    },
}
</script>


<style>


.grid-item {
        text-align: right;
        margin:1%;
    }
.whats{
        text-align: right;
        padding: 5px 10px!important;
        font-size:13px;        font-size:13px;
        vertical-align: top;
    }
.exclude{
        text-align: right;
        padding: 6px 10px!important;
        font-size:13px;
        margin: 0px;
}
.truncate{
    white-space:normal !important;
}

@media only screen and (min-width: 768px) and (max-width: 1600px) {

    .grid-container {
        display: flex;
        flex-wrap: wrap-reverse;
        flex-direction: row;
        justify-content: flex-end;
        grid-template-columns: auto auto auto;
    }
    
    .spacer{
        margin: 0px 10px;
    }

    .size{
        width: 15% !important; 
        text-align: right;
    }
    .actions_lead{
        width: 38% !important; 
        text-align: right;
    }
    .sizes{
        width: 45% !important; 
        text-align: right;
        vertical-align: top;
    }
    .alinha{
        margin:5px 0px;
    }
    .edit{
        text-align: right;
        padding: 5px 10px!important;
        font-size:13px;
        vertical-align: top;
    }
    .send{
        padding: 1px 0px!important;
        vertical-align: top;
        font-size:8px;
    }
    #ddown5 .btn-secondary {
        background-color:#ececec;
        border-color: transparent;
        color: gray;
        padding: 6px 10px!important;
    }
    .checbox{
    background: #ececec;
    padding:  4px 0px 4px 7px!important;
    border-radius: 15px;    
    margin: -4px 15px 0px 5px!important;
    }
    .exclude_check{
        margin-left:auto; 
        margin-right:1.2%;
        margin-top:1.2%;
        margin-bottom:-2%;
    }
        
    
}
@media only screen and (min-width: 1600px) {

    .grid-container {
        display: flex;
        flex-wrap: wrap-reverse;
        flex-direction: row;
        justify-content: flex-end;
        grid-template-columns: auto auto auto;
    }
    
    .spacer{
        margin: 0px 10px;
    }

    .size{
        width: 15% !important; 
        text-align: right;
    }
    .actions_lead{
        width: 27% !important; 
        text-align: right;
    }
    .sizes{
        width: 45% !important; 
        text-align: right;
        vertical-align: top;
    }
    .alinha{
        margin:5px 0px;
    }
    .edit{
        text-align: right;
        padding: 5px 10px!important;
        font-size:13px;
        vertical-align: top;
    }
    .send{
        padding: 1px 0px!important;
        vertical-align: top;
        font-size:8px;
    }
    #ddown5 .btn-secondary {
        background-color:#ececec;
        border-color: transparent;
        color: gray;
        padding: 6px 10px!important;
    }
    .checbox{
    background: #ececec;
    padding:  4px 0px 4px 7px!important;
    border-radius: 15px;    
    margin: -3px 10px 0px 5px!important;
    }
    .exclude_check{
        margin-left:auto; 
        margin-right:1.2%;
        margin-top:1.2%;
        margin-bottom:-2%;
    }
        
    
}
@media only screen and (max-width: 767px) {
    .grid-container {
        display: flex;
        flex-wrap: wrap-reverse;
        flex-direction: row-reverse;
        justify-content: flex-end;
    }
    .size{
       margin:1%;
    }

    .edit{
        text-align: right;
        padding: 5px 10px!important;
        font-size:12px;
        vertical-align: top;
    }
    #ddown5 .btn-secondary {
        background-color:#ececec;
        border-color: transparent;
        color: gray;
        padding: 6px 11px!important;
    }
    .checbox{
    background: #ececec;
    padding:  5px 1px 5px 8px!important;
    margin: 24px 8px 0px 0px!important;
    border-radius: 15px;
    text-align: center !important;
    }
    .exclude_check{
        margin-left:auto; 
        margin-right:1.2%;
        margin-top:1.2%;
        margin-bottom:-18%;
    }
    
}
</style>
