<template>
  <div :class="{'app-menu':true, 'shown' : isOpen}"  @mouseenter="isMenuOver=true" @mouseleave="isMenuOver=false">
    <slot></slot>
    <a class="app-menu-button d-inline-block d-xl-none" @click.prevent="toggle"><i  class="simple-icon-equalizer"/></a>
  </div>
</template>

<script>
import {
    colors,
    themeRadiusStorageKey
} from "../../constants/config";
import { setTimeout } from 'timers'
export default {
  data () {
    return {
      isOpen: false,
      isMenuOver: false
    }
  },
  methods: {
    addEvents () {
      document.addEventListener('click', this.handleDocumentClick)
      document.addEventListener('touchstart', this.handleDocumentClick)
    },
    removeEvents () {
      document.removeEventListener('click', this.handleDocumentClick)
      document.removeEventListener('touchstart', this.handleDocumentClick)
    },
    handleDocumentClick (e) {
      if (!this.isMenuOver) {
        this.toggle()
      }
    },
    toggle () {
      this.isOpen = !this.isOpen
    }
  },
  watch: {
    isOpen (val) {
      if (val) {
        setTimeout(() => {
          this.$emit('show')
        }, 300)

        this.addEvents()
      } else {
        this.removeEvents()
      }
    }
  },
  beforeDestroy () {
    this.removeEvents()
  }
}
</script>


<style>
  .font_icon{
    font-size: 16px;
    color:#145388;
  }
  .app-menu .app-menu-button{
    padding: 15px 10px 15px 8px !important;
  }
</style>