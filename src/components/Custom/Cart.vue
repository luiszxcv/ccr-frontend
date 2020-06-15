<template>
<div :class="{'theme-colors':true, 'shown' : isOpenCart, 'cart':true}" @mouseenter="isMenuOverCart=true" @mouseleave="isMenuOverCart=false">
    <div class="p-4">
        
        <div class="d-flex flex-row justify-content-between ">
            <modal />
            <b-button v-b-modal.modalcart variant="outline-primary">Ver Itens<i class="iconsminds-shopping-cart" /></b-button>
            <b-button variant="outline-primary">{{ $t('modal.launch-checkout') }}<i class="iconsminds-credit-card-3" /></b-button>
        </div>
    </div>
    
    <a href="#" class="theme-button cart-button" @click.prevent="toggleCart">
        <i class="iconsminds-shopping-cart">{{ cartTotal }}</i>
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
            isOpenCart: false,
            isMenuOverCart: false,
        };
    },
    methods: {

        handleDocumentClick(e) {
            if (!this.isMenuOverCart) {
                this.toggleCart();
            }
        },
        toggleCart() {
            this.isOpenCart = !this.isOpenCart;
        }
    },
    computed: {
        cartTotal () {
            return this.$store.state.cartTotal
        }
    }
};
</script>

<style>
.cart{
    top:88% !important;
}
.cart-button{
    left: -54px  !important;
}
</style>
