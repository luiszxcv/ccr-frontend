<template>
<div :class="{'theme-colors':true, 'shown' : isOpenadd, 'add':true}">
    
    <a href="#" class="theme-button add-button" v-b-modal.modal_addLead>
        <i class="simple-icon-plus"></i>
    </a>
    
</div>
</template>

<script>
import {
    colors,
    themeRadiusStorageKey
} from "../../constants/config"

import store from '../../store'

import Modal from './Modal'


export default {
    components: {
        'modal': Modal,
    },
    data() {
        return {
            isOpenadd: false,
            isMenuOveradd: false,
        };
    },
    methods: {
    },
    computed: {
    }
};
</script>

<style>
.add{
    top:87% !important;
    }
.add-button{
    left: -34px  !important;
    padding: 10px !important;
}
</style>
