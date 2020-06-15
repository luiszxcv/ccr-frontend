<template>
<div class="disable-text-selection">
    <!-- page -->
    <b-row class="app-row survey-app">
        <b-colxx xxs="12">

            <!-- header and modal -->
            <div class="mb-2">
                <h1>{{ $t('menu.todo') }}</h1>
                <div class="top-right-button-container" >

                    <!-- Butons e select all + actions -->
                    <b-button v-b-modal.modal_addinforme variant="primary" size="lg" class="top-right-button"><i class="simple-icon-plus">&nbsp;</i>ADD</b-button>
                    <b-button variant="primary" class="top-right-button" @click="getTodoItems()"><i style="font-size: 15px;" class="simple-icon-refresh" ></i></b-button>
                    
                    <b-button-group >
                        <b-dropdown split right @click="selectAll(true)" class="check-button" variant="primary">
                            <label class="custom-control custom-checkbox pl-4 mb-0 d-inline-block" slot="button-content">
                                <input class="custom-control-input" type="checkbox" :checked="isSelectedAll()" v-shortkey="{select: ['ctrl','a'], undo: ['ctrl','d']}" @shortkey="keymap" />
                                <span :class="{'custom-control-label' :true,'indeterminate' : isAnyItemSelected()}"></span>
                            </label>
                            <b-dropdown-item disabled>{{ $t('informe.move to') }}</b-dropdown-item>
                            <b-dropdown-divider></b-dropdown-divider>
                            <b-dropdown-item v-for="(stat,index) in a_allStatus" :key="`stat${index}`"  @click.prevent="edit_statusinformes(stat.value)"><a >{{stat.text}}</a></b-dropdown-item>
                        </b-dropdown>
                    </b-button-group>

                    <!--  Modal Add Novo -->
                    <b-modal id="modal_addinforme" ref="modal_addinforme" :title="$t('informe.add-new-title')" modal-class="modal-right">
                        <b-form>
                            <b-form-group :label="$t('informe.name')">
                                <b-form-input v-model="informeData.name" />
                            </b-form-group>
                            <b-form-group :label="$t('informe.contact')">
                                <b-form-input type="tel"  v-mask="'## #####-####'" v-model="informeData.contact"/>
                            </b-form-group>
                            
                            <!--tags obs-->
                            <b-form-group :label="$t('informe.tags')">
                            <b-input-group>
                                <v-select style = "width: 83%;"  multiple :options="a_allObs" v-model="informeData.tags" />
                                <b-input-group-append style = "width: 17%;" > 
                                    <b-button v-if="(show_addObs)" variant="outline-secondary" @click="show_add_Obs()"><i style = "font-size: 14px;" class= "simple-icon-minus"></i></b-button>
                                    <b-button v-if="!(show_addObs)" variant="outline-secondary" @click="show_add_Obs()"><i style = "font-size: 14px;" class= "simple-icon-plus"></i></b-button>
                                </b-input-group-append>
                            </b-input-group>
                            </b-form-group>

                            <!--add_new category-->
                            <b-form-group v-if="show_addObs" :label="'Título da tag'">
                            <b-input-group>
                                <b-form-input style = "width: 83%;" v-model="new_tagName"/>
                                <b-input-group-append style = "width: 17%;">
                                    <b-button variant="outline-secondary" @click="add_tag(25)"><i style = "font-size: 14px;"  class = "simple-icon-check"></i></b-button>
                                </b-input-group-append>
                            </b-input-group>
                            </b-form-group>

                            <!--tags prospec-->
                            <b-form-group :label="$t('informe.prospectado')">
                            <b-input-group>
                                <v-select  style = "width: 83%;"  :options="a_allProspec" v-model="informeData.prospec" />
                                <b-input-group-append style = "width: 17%;" > 
                                    <b-button v-if="(show_addPros)" variant="outline-secondary" @click="show_add_Pros()"><i style = "font-size: 14px;" class= "simple-icon-minus"></i></b-button>
                                    <b-button v-if="!(show_addPros)" variant="outline-secondary" @click="show_add_Pros()"><i style = "font-size: 14px;" class= "simple-icon-plus"></i></b-button>
                                </b-input-group-append>
                            </b-input-group>
                            </b-form-group>

                            <!--add_new prospec-->
                            <b-form-group v-if="show_addPros" :label="'Novo meio de prospecção'">
                            <b-input-group>
                                <b-form-input style = "width: 83%;" v-model="new_tagName"/>
                                <b-input-group-append style = "width: 17%;">
                                    <b-button variant="outline-secondary" @click="add_tag(26)"><i style = "font-size: 14px;"  class = "simple-icon-check"></i></b-button>
                                </b-input-group-append>
                            </b-input-group>
                            </b-form-group>
                            
                            <b-form-group :label="$t('informe.status')">
                                <b-form-radio-group stacked class="pt-2" :options="a_allStatus" v-model="informeData.status" />
                            </b-form-group>
                            <p v-if="errors.length">
                                <b>Por favor, corrija o(s) seguinte(s) erro(s):</b>
                                <ul>
                                    <li v-for="(error,index) in errors" :key="`er${index}`">{{ error }}</li>
                                </ul>
                            </p>
                        </b-form>

                        <template slot="modal-footer">
                            <b-button variant="outline-secondary" @click="hideModal('modal_addinforme')">{{ $t('informe.cancel') }}</b-button>
                            <b-button variant="primary" @click="addNewinforme()" class="mr-1">{{ $t('informe.submit') }}</b-button>
                        </template>
                    </b-modal>

                    <!--  Modal Edit -->
                    <b-modal id="modal_editinforme" ref="modal_editinforme" :title="$t('informe.add-new-title')" modal-class="modal-right">
                        <b-form>
                            <b-form-group :label="$t('informe.name')">
                                <b-form-input v-model="informeData.name" />
                            </b-form-group>
                            <b-form-group :label="$t('informe.contact')">
                                <b-form-input type="tel"  v-mask="'## #####-####'" v-model="informeData.contact"/>
                            </b-form-group>
                            
                            <b-form-group :label="$t('informe.tags')">
                            <b-input-group>
                                <v-select style = "width: 83%;"  multiple :options="a_allObs" v-model="informeData.tags" />
                                <b-input-group-append style = "width: 17%;" > 
                                    <b-button v-if="(show_addObs)" variant="outline-secondary" @click="show_add_Obs()"><i style = "font-size: 14px;" class= "simple-icon-minus"></i></b-button>
                                    <b-button v-if="!(show_addObs)" variant="outline-secondary" @click="show_add_Obs()"><i style = "font-size: 14px;" class= "simple-icon-plus"></i></b-button>
                                </b-input-group-append>
                            </b-input-group>
                            </b-form-group>

                            <!--add_new category-->
                            <b-form-group v-if="show_addObs" :label="'Título da tag'">
                            <b-input-group>
                                <b-form-input style = "width: 83%;" v-model="new_tagName"/>
                                <b-input-group-append style = "width: 17%;">
                                    <b-button variant="outline-secondary" @click="add_tag(25)"><i style = "font-size: 14px;"  class = "simple-icon-check"></i></b-button>
                                </b-input-group-append>
                            </b-input-group>
                            </b-form-group>


                            <!--tags prospec-->
                            <b-form-group :label="$t('informe.prospectado')">
                            <b-input-group>
                                <v-select  style = "width: 83%;"  :options="a_allProspec" v-model="informeData.prospec" />
                                <b-input-group-append style = "width: 17%;" > 
                                    <b-button v-if="(show_addPros)" variant="outline-secondary" @click="show_add_Pros()"><i style = "font-size: 14px;" class= "simple-icon-minus"></i></b-button>
                                    <b-button v-if="!(show_addPros)" variant="outline-secondary" @click="show_add_Pros()"><i style = "font-size: 14px;" class= "simple-icon-plus"></i></b-button>
                                </b-input-group-append>
                            </b-input-group>
                            </b-form-group>

                            <!--add_new prospec-->
                            <b-form-group v-if="show_addPros" :label="'Novo meio de prospecção'">
                            <b-input-group>
                                <b-form-input style = "width: 83%;" v-model="new_tagName"/>
                                <b-input-group-append style = "width: 17%;">
                                    <b-button variant="outline-secondary" @click="add_tag(26)"><i style = "font-size: 14px;"  class = "simple-icon-check"></i></b-button>
                                </b-input-group-append>
                            </b-input-group>
                            </b-form-group>
                            
                            <b-form-group :label="$t('informe.status')">
                                <b-form-radio-group stacked class="pt-2" :options="a_allStatus" v-model="informeData.status" />
                            </b-form-group>
                            <p v-if="errors.length">
                                <b>Por favor, corrija o(s) seguinte(s) erro(s):</b>
                                <ul>
                                    <li v-for="(error,index) in errors" :key="`err${index}`">{{ error }}</li>
                                </ul>
                            </p>
                        </b-form>

                        <template slot="modal-footer">
                            <b-button variant="outline-secondary" @click="hideModal('modal_editinforme')">{{ $t('informe.cancel') }}</b-button>
                            <b-button variant="primary" @click="editinforme()" class="mr-1">{{ $t('informe.refresh') }}</b-button>
                        </template>
                    </b-modal>

                    <!-- Modal - exclude confirm? -->
                    <b-modal id="modal_excludeinforme" ref="modal_excludeinforme" size="sm" title="Você tem certeza?" hide-footer>
                        <b-button variant="secondary" @click="hideModal('modal_excludeinforme')">Cancelar</b-button>
                        <b-button variant="primary" @click="excludeinforme" class="mr-1">Excluir</b-button>
                    </b-modal>
                    
                    <!--button flutuante add new-->
                    <addnew />

                </div>
                
                <piaf-breadcrumb />

            </div>

            <!--  Filters e search -->
            <!--<div class="mb-2">
                <b-button variant="empty" class="pt-0 pl-0 d-inline-block d-md-none" v-b-toggle.displayOptions>
                    {{ $t('informe.display-options') }} <i class="simple-icon-arrow-down align-middle" />
                </b-button>
                <b-collapse id="displayOptions" class="d-md-block">
                    <div class="d-block d-md-inline-block pt-1">
                        <b-dropdown id="ddown1" :text="`${$t('informe.orderby')} ${sort.label}`" variant="outline-dark" class="mr-1 float-md-left btn-group " size="xs">
                            <b-dropdown-item v-for="(order,index) in sortOptions" :key="`order${index}`" @click="changeOrderBy(order)">{{ order.label }}</b-dropdown-item>
                        </b-dropdown>
                        <div class="search-sm d-inline-block float-md-left mr-1 align-top">
                            <b-input :placeholder="$t('menu.search')" v-model="search" />
                        </div>
                    </div>
                </b-collapse>
            </div>-->

            <div class="mb-2 ">
            <carousel  :per-page="1"  @page-change="get_dataCarousel" :navigateTo="navigateTo">
                <slide
                    class = "carousel_menu"
                    data-index="0"
                    >

                    <div class="pr-0 pl-0 mb-4 glide__slide">
                        <b-card class="flex-row" no-body >
                            <div class="pl-2 d-flex flex-grow-1 min-width-zero">
                                <b-card-body class="align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                    <i class="heading-icon simple-icon-people" />
                                    <p class="mb-0 text-muted heading-icon">{{$t('informe.all-tasks')}}</p>
                                    <div>
                                        <b-badge variant="primary" pill class="mr-1" v-if="isLoad">{{a_informesFiltred.length}}</b-badge>
                                    </div>
                                </b-card-body>
                            </div>
                        </b-card>
                    </div>

                </slide>
                <slide
                    class = "carousel_menu"
                    v-for="(sta,index) in a_statusFiltred" :key="'st2'+index"
                    :data-index="sta.value"
                    >

                    <div class="pr-0 pl-0 mb-4 glide__slide" >
                        <b-card class="flex-row" no-body >
                            <div class="pl-2 d-flex flex-grow-1 min-width-zero">
                                <b-card-body class="align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                    <i :class="status_icon(sta.value)"/>
                                    <p class="mb-0 text-muted heading-icon">{{sta.label}}</p>
                                    <div>
                                        <b-badge variant="primary" pill class="mr-1" v-if="isLoad">{{a_informesFiltred.filter(x => x.categories.status[0].term_id == sta.value).length}}</b-badge>
                                    </div>
                                </b-card-body>
                            </div>
                        </b-card>
                    </div>

                </slide>
            </carousel>
            </div>

            <div class="separator mb-5" />

            <!--  List informes -->
            <b-row v-if="isLoad" key="itemList">
                <div class="" v-if="!(a_informesFiltred.length > 0)">Ainda não há informes aqui, adicione um :)</div>
                <b-colxx v-else xxs="12" v-for="(item,index) in a_informesFiltred" :key="`item${index}`">
                    <todo-list-item :key="item.ID" :all_statusList="a_allStatus" :data="item" :selected-items="selectedItems"
                    @toggle-item="toggleItem" @edit-informe="prepareinforme" @exclude-informeConfirm="prepareinforme" @edit-sinforme ="edit_statusinforme" v-contextmenu:contextmenu />
                </b-colxx>
            </b-row>
            <div v-else class="loading" key="itemLoading"></div>

        </b-colxx>
    </b-row>

    <!--  mistério (menu não utilizado) -->
    <v-contextmenu ref="contextmenu" @contextmenu="handleContextmenu">
        <!--<v-contextmenu-item @click="onContextCopy()"><i class="simple-icon-docs" /> <span>Copy</span></v-contextmenu-item>
        <v-contextmenu-item @click="onContextArchive()"><i class="simple-icon-drawer" /> <span>Move to archive</span></v-contextmenu-item>
        <v-contextmenu-item @click="onContextDelete()"><i class="simple-icon-trash" /> <span>Delete</span></v-contextmenu-item>-->
        <v-contextmenu-item disabled>{{ $t('informe.move to') }}</v-contextmenu-item>
        <v-contextmenu-item v-for="(stat,index) in a_allStatus" :key="`stat${index}`"  @click.prevent="edit_statusinformes(stat.value)"><a >{{stat.text}}</a></v-contextmenu-item>
    </v-contextmenu>

    <!--  menu lateral esquerdo -->
    <application-menu>
        <vue-perfect-scrollbar :settings="{ suppressScrollX: true, wheelPropagation: false }">
            <div class="p-4">

                 <b-row class="mb-3">
                    <b-colxx xxs="12">
                        <label>{{$t('form-components.filter-by-date')}}</label>
                    </b-colxx>
                    <b-colxx xxs="12">
                        <p style = "margin-top:8px;" class="mb-1 d-sm-inline-block" >
                            <a href="#" @click="removerFilter('data')">
                                <b-badge pill class="mb-1 mr-1">Todas as Datas</b-badge>
                            </a>
                        </p>
                        <v-date-picker mode="range" v-model="intervalDatas" :input-props="{ class: 'form-control', placeholder: $t('form-components.select-date')}"></v-date-picker>
                    </b-colxx>
                    
                </b-row>
                
                <!--  status -->
                <!--<p class="text-muted text-small mb-3">{{$t('informe.status')}}</p>
                <ul class="list-unstyled mb-4">
                    <li class="nav-item"><a href="#" @click="get_allinformes()">
                            <i class="simple-icon-people" /><span class="d-inline-block">{{$t('informe.all-tasks')}}</span> <span class="float-right" v-if="isLoad">{{items.length}}</span>
                        </a>
                    </li>
                    -->

                    <!--<li class="nav-item"><a href="#">
                            <i class="simple-icon-refresh" /><span class="d-inline-block">{{$t('informe.pending-tasks')}}</span> <span class="float-right" v-if="isLoad">{{items.filter(x => x.status === "PENDING").length}}</span>
                        </a>
                    </li>
                    <li class="nav-item"><a href="#">
                            <i class="simple-icon-check" /><span class="d-inline-block">{{$t('informe.completed-tasks')}}</span> <span class="float-right" v-if="isLoad">{{items.filter(x => x.status === "COMPLETED").length}}</span>
                        </a>
                    /li>-->
                    
                    <!--
                    <li class="nav-item"  v-for="(st,index) in a_statusFiltred" :key="'st'+index" >
                        <a href="#" @click="get_informesFiltred_status(st.value)">
                            <i :class="{'heading-icon':true,
                                'simple-icon-check' :st.value === 50,
                                'simple-icon-clock' :st.value === 48,
                                'simple-icon-bubbles' :st.value === 51,
                                'simple-icon-fire' :st.value === 47,
                                'simple-icon-dislike' :st.value === 49,
                            }"/>
                            <span class="d-inline-block ">{{st.label}}</span> 
                            <span class="float-right" v-if="isLoad">{{a_informesFiltred.filter(x => x.categories.status[0].term_id == st.value).length}}</span>
                        </a>
                    </li>
                    
                </ul>-->

                <!--  tags obs -->
                <p class="text-muted text-small mb-3">{{$t('informe.tags')}}</p>
                <ul class="list-unstyled mb-4">

                        <p class="mb-1 d-sm-inline-block" >
                            <a href="#" @click="removerFilter('obs')">
                                <b-badge pill class="mb-1 mr-1">Todas as Tags</b-badge>
                            </a>
                        </p>
                        <p class="custom-switch mb-1 d-sm-inline-block" v-for="(o,index) in a_obsFiltred" :key="'obs'+index">
                            <a href="#"  @click="addFilter('obs',o.value)">
                                <b-badge pill class="mb-1 mr-1">{{o.label}}
                                    <switches v-if="a_allFilters.obs[o.value] == true" v-model="active_obs"  theme="custom" color="primary"></switches>
                                    <switches v-if="a_allFilters.obs[o.value] != true" v-model="disable_obs"  theme="custom" color="primary"></switches>
                                </b-badge>
                            </a>
                        </p>
                        
                    <!--<b-form-radio-group stacked  v-model="obs" class="pt-2" :options="a_obsFiltred.map((c)=> {return {text:c.label,value:c.value}})" />-->
                </ul>

                <!--  tags prospec -->
                <p class="text-muted text-small mb-3">{{$t('informe.labels')}}</p>
                <div>
                    <p class="d-sm-inline-block mb-1">
                        <a href="#" @click="removerFilter('prospec')">
                            <b-badge pill class="mb-1 mr-1">Todas as Mídias</b-badge>
                        </a>
                    </p>
                    <p class="custom-switch d-sm-inline-block mb-1" v-for="(l,index) in a_prospecFiltred" :key="'prospec'+index">
                        <a href="#" @click="addFilter('prospec',l.value)" ><!-- -->
                            <b-badge pill class="mb-1 mr-1">{{l.label}}
                                <switches v-if="a_allFilters.prospec[l.value] == true" v-model="active_prospec"  theme="custom" color="primary"></switches>
                                <switches v-if="a_allFilters.prospec[l.value] != true" v-model="disable_prospec"  theme="custom" color="primary"></switches>
                            </b-badge>
                        </a>
                    </p>
                </div>
            </div>

        </vue-perfect-scrollbar>
    </application-menu>
    
</div>
</template>

<script>
import {
    mapGetters,
    mapMutations,
    mapActions
} from 'vuex'

import { Carousel, Slide } from 'vue-carousel';
import VSelect from 'vue-select'
import Switches from 'vue-switches'
import 'vue-select/dist/vue-select.css'
import TodoListItem from '../../../components/TodoApp/TodoListItem'
import ApplicationMenu from '../../../components/Common/ApplicationMenu'
import axios from 'axios'
import add_floatButton from "../../../components/Custom/add_floatButton";
import { apiUrl,headers,menu_data } from '../../../constants/config'


export default {
    components: {
        VSelect,
        'todo-list-item': TodoListItem,
        'application-menu': ApplicationMenu,
        Carousel,
        Slide,
        "addnew":add_floatButton,
        'switches': Switches,
    },
    data() {
        return {
            glideSingleOption: {
                gap: 6,
                perView: 1,
                type: "carousel"
            },
            
            sort: {
                column: 'title',
                label: 'Title'
            },
            sortOptions: [{
                    column: 'title',
                    label: 'Title'
                },
                {
                    column: 'category',
                    label: 'Category'
                },
                {
                    column: 'label',
                    label: 'Label'
                },
                {
                    column: 'status',
                    label: 'Status'
                }
            ],
            search: '',
            selectedItems: [],

            informeData: {
                name: '',
                tags: '',
                contact: '',
                prospec: '',
                status: ''
            },
            new_tagName:"",
            show_addObs:false,
            show_addPros:false,

            navigateTo:0,
            data_vue:0,
            data_dom:{listElements:"",status_id:0,index:0},

            errors: [],

            //custom variables
            active_obs:true,
            disable_obs:false,
            active_prospec:true,
            disable_prospec:false,
            intervalDatas:{},

            a_informesFiltred:[],
            a_statusFiltred:{},
            a_obsFiltred:{},
            a_prospecFiltred:{},
            a_allStatus:[],
            a_allObs:[],
            a_allProspec:{},
            a_allFilters:{prospec:[],obs:[],data:{}}
        }
    },
    computed: {
        ...mapGetters(['isLoad', 'items','allItems', 'todoError']),
        
    },
     
    methods: {

        //mapeamento funções do arquivo informe.js
        ...mapActions(['getTodoItems']),
        ...mapMutations(['addinforme',"submitEdit"]),

        //informes
        isSelectedAll() {
            return this.selectedItems.length >= this.a_informesFiltred.length
        },
        isAnyItemSelected() {
            return this.selectedItems.length > 0 && this.selectedItems.length < this.items.length
        },
        selectAll(isToggle) {
            if (this.selectedItems.length >= this.a_informesFiltred.length) {
                if (isToggle) {
                    this.selectedItems = []
                }
            } else {
                this.selectedItems = this.a_informesFiltred.map(x => x.ID)
            }            
        },
        keymap(event) {
            switch (event.srcKey) {
                case 'select':
                    this.selectAll(false)
                    break
                case 'undo':
                    this.selectedItems = []
                    break
            }
        },
        toggleItem(event, itemId) {
            if (event.shiftKey && this.selectedItems.length > 0) {
                let itemsForToggle = this.items

                var start = this.getIndex(itemId, itemsForToggle, 'id')
                var end = this.getIndex(this.selectedItems[this.selectedItems.length - 1], itemsForToggle, 'id')
                itemsForToggle = itemsForToggle.slice(Math.min(start, end), Math.max(start, end) + 1)

                this.selectedItems.push(
                    ...itemsForToggle.map(item => {
                        return item.ID
                    })
                )

            } else {
                if (this.selectedItems.includes(itemId)) {
                    this.selectedItems = this.selectedItems.filter(x => x !== itemId)
                } else {
                    this.selectedItems.push(itemId)
                }
            }
        },
        
        //actions custom
        addNewinforme() {
            if(this.checkForm()){
                return 
            }else{

                //const date = new Date()
                if (typeof this.informeData.tags !== 'undefined' && this.informeData.tags.length > 0) {
                    var categories = (this.informeData.tags.map((x) => {return x.value})).join(",")+","+String(this.informeData.prospec.value)
                }else{
                    var categories = this.informeData.prospec.value
                }

                this.addinforme({
                    title: this.informeData.name,
                    status:"publish",
                    acf: {
                        name: this.informeData.name,
                        contact: this.informeData.contact,
                        responsaveis: ""
                    },
                    categories,
                    tags: String(this.informeData.status),
                    //date: date.getDay() + '.' + date.getMonth() + 1 + '.' + date.getFullYear(),
                    //labelColor: this.informeData.label.color
                })

                this.informeData = {
                    name: '',
                    tags: '',
                    contact: '',
                    prospec: '',
                    status: ''
                }

                this.hideModal('modal_addinforme')
                this.get_informesFiltred_tod()
            }
        },
        prepareinforme(id_informe) {
            var tags = []
            var prospec = {}
            var y
            var index_update =this.getIndex(id_informe, this.items, 'ID') 
            var index =this.getIndex(id_informe,this.a_informesFiltred, 'ID') 

            //console.log(this.a_informesFiltred[index])

            if(typeof this.a_informesFiltred[index].categories.tags[25] !== 'undefined'
            && this.a_informesFiltred[index].categories.tags[25].length > 0 && typeof this.a_informesFiltred[index].categories.tags[25] !== null){
                for (y of this.a_informesFiltred[index].categories.tags[25]) {
                    tags.push({label:y.name,value:y.term_id})
                }
            }
            

            for (y of this.a_informesFiltred[index].categories.tags[26]) {
                prospec ={label:y.name,value:y.term_id} 
            }
            var status = this.a_informesFiltred[index].categories.status[0].term_id
                
            this.informeData = {
                contact: this.a_informesFiltred[index].acf.contact,
                name: this.a_informesFiltred[index].acf.name,
                prospec,
                status,
                tags,
                index:index_update
            }
            
        },
        editinforme(){

            if(this.checkForm()){
                return 
            }else{
                if (typeof this.informeData.tags !== 'undefined' && this.informeData.tags.length > 0) {
                    var categories = (this.informeData.tags.map((x) => {return x.value})).join(",")+","+String(this.informeData.prospec.value)
                }else{
                    var categories = this.informeData.prospec.value
                }

                this.submitEdit({
                    title: this.informeData.name,
                    acf: {
                        name: this.informeData.name,
                        contact: this.informeData.contact,
                        responsaveis: ""
                    },
                    status:"publish",
                    categories: categories,
                    tags: String(this.informeData.status),
                    informeId: this.items[this.informeData.index].ID,
                    informeIndex: this.informeData.index
                })

                this.informeData = {
                    name: '',
                    tags: '',
                    contact: '',
                    prospec: '',
                    status: ''
                }
                this.hideModal('modal_editinforme')
                this.get_informesFiltred_tod()
            }
        },
        edit_statusinforme(data){

            this.prepareinforme(data.id_informe)

            if (typeof this.informeData.tags !== 'undefined' && this.informeData.tags.length > 0) {
                var categories = (this.informeData.tags.map((x) => {return x.value})).join(",")+","+String(this.informeData.prospec.value)
            }else{
                var categories = this.informeData.prospec.value
            }
            this.submitEdit({
                title: this.informeData.name,
                acf: {
                    name: this.informeData.name,
                    contact: this.informeData.contact,
                    responsaveis: ""
                },
                status:"publish",
                categories: categories,
                tags: String(data.statusId),
                informeId: this.items[this.informeData.index].ID,
                informeIndex: this.informeData.index
            })
            this.informeData = {
                name: '',
                tags: '',
                contact: '',
                prospec: '',
                status: ''
            }
            this.hideModal('modal_editinforme')

        },
        edit_statusinformes(status_Id){

            if (this.selectedItems.length > 0){
                for (let index = 0; index < this.selectedItems.length; index++) {
                    var informe_id = this.selectedItems[index];

                    this.edit_statusinforme({id_informe:informe_id,statusId:status_Id})
                }
                this.selectedItems = []
            }
            else{
               this.addNotification('error','informe','Selecione algum informe.')
            }
        },
        excludeinforme(){
            this.submitEdit({
                status:"trash",
                informeId: this.items[this.informeData.index].ID,
                informeIndex: this.informeData.index
            })
            this.informeData = {
                    name: '',
                    tags: '',
                    contact: '',
                    prospec: '',
                    status: ''
            }
            this.hideModal('modal_excludeinforme')
        },
        hideModal(refname) {
            this.informeData = {
                    name: '',
                    tags: '',
                    contact: '',
                    prospec: '',
                    status: ''
            }
            this.$refs[refname].hide()
        },
        checkForm(){

            if ( !(this.informeData.prospec) || !(this.informeData.contact) || !(this.informeData.name) || !(this.informeData.status) || (this.informeData.contact.length < 13)) {
                this.errors = [];
                if (!this.informeData.name) {
                    this.errors.push('O nome é obrigatório.');
                }
                if (!this.informeData.contact) {
                    this.errors.push('O contato é obrigatório.');
                }
                if (this.informeData.contact.length < 13) {
                    this.errors.push('O contato está com números faltando.');
                }
                if (!this.informeData.prospec) {
                    this.errors.push('A tag de prospecção é obrigatória.');
                }
                if (!this.informeData.status) {
                    this.errors.push('O status é obrigatório.');
                }
                return true
            }
            else{
                this.errors = []
                return false
            }

            
        },
        addNotification (type,title,message){
            this.$notify(type, title, message, { duration: 3000, permanent: false })
        },
        refresh_page(){
            location.reload()
        },

        //actions predefinidas
        changeOrderBy(sort) {
            this.sort = sort
        },
        getIndex(value, arr, prop) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i][prop] === value) {
                    return i
                }
            }
            return -1
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
        
        //menu mistério
        handleContextmenu(vnode) {
            if (!this.selectedItems.includes(vnode.key)) {
                this.selectedItems = [vnode.key]
            }
        },
        onContextCopy() {
            console.log('context menu item clicked - Copy Items: ', this.selectedItems)
        },
        onContextArchive() {
            console.log('context menu item clicked - Move to Archive Items: ', this.selectedItems)
        },
        onContextDelete() {
            console.log('context menu item clicked - Delete Items: ', this.selectedItems)
        },

        // custom functions filter informes
        addFilter(tipo,id) {

            if(tipo == "obs"){

                if (this.a_allFilters.obs[id] !== 'undefined'){
                    this.a_allFilters.obs[id]= !this.a_allFilters.obs[id]
                }
                else{
                    this.a_allFilters.obs[id]= true
                }
                if (this.a_allFilters.obs[id] != true){
                    this.a_allFilters.obs = []
                }
            }
            if(tipo == "prospec"){

                if (this.a_allFilters.prospec[id] !== 'undefined'){
                    this.a_allFilters.prospec[id]= !this.a_allFilters.prospec[id]
                }
                else{
                    this.a_allFilters.prospec[id]= true
                }
                if (this.a_allFilters.prospec[id] != true){
                    this.a_allFilters.prospec=[]
                }
            }
            if (tipo == "data"){
                this.get_informesFiltred_data()
            }
            this.get_informesFiltred_tod()
        },
        removerFilter(tipo) {
            if(tipo == "obs"){
                this.a_allFilters.obs = []
            }
            if(tipo == "prospec"){
                this.a_allFilters.prospec=[]
            }
            if (tipo =="data"){
                this.intervalDatas = {}
                this.a_allFilters.data = {}
            }
            this.get_informesFiltred_tod()
        },
        
        //tod = tags, obs e data //filtro dinâmico
        get_informesFiltred_tod(){

            this.get_allinformes()

            this.get_informesFiltred_status(this.data_dom.status_id)

            if(this.a_allFilters.prospec.length > 0 && this.a_allFilters.obs.length > 0){
                for (const key in this.a_allFilters.prospec) {
                    if (this.a_allFilters.prospec.hasOwnProperty(key)) {
                        //const element = this.a_allFilters.prospec[key];
                        this.get_informesFiltred_prospec(key)
                        
                    }
                }
                for (const key in this.a_allFilters.obs) {
                    if (this.a_allFilters.obs.hasOwnProperty(key)) {
                        const element = this.a_allFilters.obs[key];
                        this.get_informesFiltred_obs(key)
                        
                    }
                }
            }
            if(this.a_allFilters.obs.length > 0 && this.a_allFilters.prospec.length == 0){
                for (const key in this.a_allFilters.obs) {
                    if (this.a_allFilters.obs.hasOwnProperty(key)) {
                        const element = this.a_allFilters.obs[key];
                        this.get_informesFiltred_obs(key)
                       
                    }
                }
            }
            if(this.a_allFilters.obs.length == 0 && this.a_allFilters.prospec.length > 0){
                for (const key in this.a_allFilters.prospec) {
                    if (this.a_allFilters.prospec.hasOwnProperty(key)) {
                        //const element = this.a_allFilters.prospec[key];
                        this.get_informesFiltred_prospec(key)
                        
                    }
                }
            }
            this.get_informesFiltred_data()
        },
        //filtro estático
        get_informesFiltred_status(id_status){
            
            if (id_status == 0){
                this.get_allinformes()
                var response = "all"
            }else{
                this.a_informesFiltred = this.items.filter((x) => {
                return x.categories.status[0].term_id == id_status;
                })
                this.get_tagsFiltred({status:false,tags:true})
                var response = "filtred"
            }

            return(response)
            
        },
        //formatando e filtrando por tags
        get_informesFiltred_obs(id_obs){

            this.a_informesFiltred = this.a_informesFiltred.filter((x) => {
                if(typeof x.categories.tags[25] !== 'undefined' && x.categories.tags[25].length > 0 && typeof x.categories.tags[25] !== null){
                    return x.categories.tags[25].filter((y) =>{
                        return y.term_id == id_obs
                    }).length != 0
                }
            })
            this.get_tagsFiltred({status:true,tags:true})
        },
        get_informesFiltred_prospec(id_prospec){
            
            this.a_informesFiltred = this.a_informesFiltred.filter((x) => {
                return x.categories.tags[26].filter((y) =>{
                    return y.term_id == id_prospec
                }).length != 0
            })
            this.get_tagsFiltred({status:true,tags:true})
        },
        //formatando e filtrando por data
        get_informesFiltred_data(){
            if (Object.keys(this.a_allFilters.data).length !== 0) {
                this.a_informesFiltred = this.a_informesFiltred.filter((informe) => {
                    if (this.a_allFilters.data.start <= informe.dateObject && this.a_allFilters.data.end >= informe.dateObject){
                        return informe;
                    }
                })
            }
            this.get_tagsFiltred({status:false,tags:true})
        },
        //filtrando as tags e limpando os filtros
        get_tagsFiltred(filterBy){
                var x
                var y
                var index 

                if (filterBy.status){
                    this.a_statusFiltred = {}
                }
                if (filterBy.tags){
                    this.a_prospecFiltred = {}
                    this.a_obsFiltred = {}
                }

                for (x of this.a_informesFiltred) {
                    
                    if (filterBy.status){

                        this.a_allStatus.forEach(status => {
                            this.a_statusFiltred[status.value]={label:status.text, value:status.value}
                        });

                        index = this.a_informesFiltred.indexOf(x)
                        this.a_statusFiltred[String(x.categories.status[0].term_id)]={label:x.categories.status[0].name,value:x.categories.status[0].term_id,index} 
                    } // {label:x.categories.status[0].name}
                    
                    if (filterBy.tags){
                        if(typeof x.categories.tags[25] !== 'undefined' && x.categories.tags[25].length > 0 && typeof x.categories.tags[25] !== null){
                            for (y of x.categories.tags[25]) {
                                this.a_obsFiltred[String(y.term_id)]={label:y.name,value:y.term_id} 
                            }
                        }
                        for (y of x.categories.tags[26]) {
                            this.a_prospecFiltred[String(y.term_id)]={label:y.name,value:y.term_id} 
                        }
                    }
                }
                this.selectedItems = []
        },
        get_formatDatas(){
            var data= {}
            var string_date = ""
            var dateObject = {}

            this.a_informesFiltred.map((informe)=> {

                string_date = ""
                string_date  = informe.post_date.split(" ");

                data.data  = string_date[0].split("-");
                data.horas = string_date[1].split(":");

                informe.dateObject = new Date(data.data[0],data.data[1]-1,data.data[2],data.horas[0],data.horas[1],data.horas[2])
                //return dateObject
            })
        },

        //get the backend tags
        get_allinformes(){
            this.a_informesFiltred = this.items
            this.get_tagsFiltred({status:true,tags:true})
            //this.get_informesFiltred_status(this.data_dom.status_id)
        },
        get_allStatus(){
            
            axios
            .get(`${apiUrl}/wp-json/wp/v2/tags?per_page=100`,{headers:headers()})
            .then(r =>{
                let x
                this.a_allStatus =[]
                for (x of r.data) {
                    this.a_allStatus.push({text:x.name,value:x.id})
                }
            })
        },
        get_allTags(){

            axios
            .get(`${apiUrl}/wp-json/wp/v2/categories/?per_page=100`,{headers:headers()})
            .then(r =>{
                let x
                this.a_allObs=[]
                this.a_allProspec=[]
                this.a_allObs["data"]=r.data.filter(x => x.parent == 25)
                this.a_allProspec["data"]=r.data.filter(x => x.parent == 26)

                for (x of this.a_allObs["data"]) {
                    this.a_allObs.push({label:x.name,value:x.id})
                }
                for (x of this.a_allProspec["data"]) {
                    this.a_allProspec.push({label:x.name,value:x.id})
                }
                delete this.a_allProspec.data
                delete this.a_allObs.data
            })
            
        },

        //tags modal (add and edit)
        add_tag(parent_id){

            if (this.new_tagName != ""){
            axios
                .post(`${apiUrl}/wp-json/wp/v2/categories/`,{parent:parent_id,name:this.new_tagName},{headers:headers()})
                .then(r =>{
                    //this.a_allObs.push({label:this.new_tagName,value:r.id})
                    this.get_allTags()

                    if (parent_id == 25){
                        this.show_add_Obs()
                        this.addNotification('success','Sucesso','Você já pode seleciona-la em "Tags".')
                    }
                    if (parent_id == 26){
                        this.show_add_Pros()
                        this.addNotification('success','Sucesso','Você já pode seleciona-la em "Veio por".')
                    }
                })
                .catch(error => {
                    if (error.response) {
                        if (error.response.status == 400){
                            var response = ['error','Já existe','Esta tag já existe.']
                        }
                        else{
                            var response = ['error','Erro','Você está escrevendo algo errado?']
                        }
                    }
                    else{
                        var response = ['error','Erro','Você está escrevendo algo errado?']
                    }
                    this.addNotification(response[0],response[1],response[2])
                })
                
            this.new_tagName = ""
            }else{
                this.addNotification('erro','Erro','Digite o nome da tag.')
            }
        },
        show_add_Obs(){
            this.show_addObs = !this.show_addObs
        },
        show_add_Pros(){
            this.show_addPros = !this.show_addPros
        },
        
        //carousel menu
        /*handleSlideClick (dataset) {
            console.log(dataset.index, dataset.name)
        },*/
        /*save_pageStorage(data){
            //localStorage.setItem('status_atual', data.status_atual)
            //localStorage.setItem('index_menu', data.index)
            //localStorage.setItem('navigate_to', data.index)
            //menu_status().nav
            //this.navigateTo = [data.index,false
            
            //this.verifi_statusExist()
            //console.log(this.a_statusFiltred[data.id].value)
            //console.log(this.getIndex(data.id, this.a_statusFiltred, 'value'))
        },*/
        /*filter_dataBy_carousel(){
            this.save_pageStorage({status_atual:id_status,index})
        },*/

        get_atribute_html(html,atribute){

            if(html.hasAttribute(atribute)){
                var response = html.getAttribute(atribute)
            }else{
                var response = 0
            }
            return(response)

        },
        get_itens_byClass(classs){
            //if (document.body.classList.contains('thatClass')) {
            //}
            return document.getElementsByClassName(classs)//"carousel_menu"
            
        },
        get_dataCarousel(status_index){
            var listElements = this.get_itens_byClass("carousel_menu")
            var status_id= this.get_atribute_html(listElements[status_index],"data-index")

            this.data_dom = {listElements,status_id,index:status_index}
        },
    },
    //inicializando functions
    mounted() {
        this.getTodoItems()
        this.get_allStatus()
        this.get_allTags()
        document.body.classList.add("right-menu"); 
    },
    beforeMount(){
    },
    beforeDestroy() {
        document.body.classList.remove("right-menu");
    },

    //observando
    watch: {
        items: function () {
            this.a_informesFiltred = this.items
            this.get_tagsFiltred({status:true,tags:true})
            this.get_informesFiltred_status(this.data_dom.status_id)
            this.get_formatDatas()
        },     
        data_dom: function(){

            this.removerFilter("data")
            this.removerFilter("obs")
            this.removerFilter("prospec")
            this.get_informesFiltred_status(this.data_dom.status_id)
            
        },
        intervalDatas: function(){
            this.a_allFilters.data = this.intervalDatas
            this.addFilter("data")
        },  
    },
    
    
}
</script>



<style>
    .VueCarousel-dot-container{
        margin-top: -20px !important; 
    }
    .VueCarousel-dot{
        margin-top: -20px !important; 
        background-color:gray !important; 
    }
    .VueCarousel-dot--active{
        margin-top: -20px !important; 
        background-color:black !important; 
    }
    .carousel_menu{
        padding: 1%;
    }
    .custom-switch .vue-switcher div{
        height:16px !important;
        width:42px !important;
    }

    .custom-switch .vue-switcher div:after{
        width: 10px !important;
        height: 10px !important;
        top: 2px !important;
        margin-left: -3px !important;
    }
    .custom-switch .vue-switcher.vue-switcher--unchecked div:after {
        left: 6px !important;
        top: 2px !important;
    }
    .custom-switch .vue-switcher{
        vertical-align: middle;
    }
    .custom-switch{
        padding-left: 0px;
    }

    .custom-switch label {
        margin-bottom:0px;
    }
</style>