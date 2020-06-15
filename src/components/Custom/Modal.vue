<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <b-modal id="modalcart" ref="modalcart" :title="$t('modal.modal-cart')" modal-class="modal-right" >
                Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna
        <template slot="modal-footer">
            <b-button variant="primary" @click="somethingModal('modalcart')" class="mr-1">Finalizar Pedido</b-button>
            <b-button variant="secondary" @click="hideModal('modalcart')">Voltar</b-button>
        </template>
      </b-modal>

    </b-colxx>
  </b-row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      selectedBackdrop: 'true',
      backdropOptions: ['true', 'false', 'static'],
      isActive: true,
    }
  },
  methods: {
    hideModal (refname) {
      this.$refs[refname].hide()
      console.log('hide modal:: ' + refname)
    },
    somethingModal (refname) {
      this.$refs[refname].hide()
      console.log('something modal:: ' + refname)
    },
    showModal (refname) {
      this.$refs[refname].is
      console.log(this.$refs)
    }
  }
}
</script>
