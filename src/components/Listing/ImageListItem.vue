<template>
<b-card @click.prevent="toggleItem($event,data.id)" :class="{'active' : selectedItems.includes(data.id)}" no-body>
    <div class="position-relative">
        <router-link :to="`?p=${data.id}`" class="w-40 w-sm-100">
            <img :src="data.images[0].src" class="card-img-top" :alt="data.name" />
        </router-link>
        <b-badge pill :variant="data.statusColor" class="position-absolute badge-top-left">{{data.stock_status }}</b-badge>
    </div>
    <b-card-body>
        <b-row>
            <b-colxx xxs="2">
                <b-form-checkbox :checked="selectedItems.includes(data.id)" class="itemCheck mb-0" />
                
            </b-colxx>
            <b-colxx xxs="10" class="mb-3">
                <h6 class=" card-subtitle">{{data.name}}</h6>
                <p class="text-muted text-small mb-0 font-weight-light card-text">{{data.date_created}}</p>
            </b-colxx>
            <b-colxx xxs="12" class="mb-6">
                <p class="mb-0 text-muted text-small"  v-for="(categorie,index)  in data.categories" :key="index" >{{categorie.name}}</p>
            </b-colxx>            
        </b-row>
    </b-card-body>
</b-card>
</template>

<script>
export default {
    props: ['data', 'selectedItems'],
    methods: {
        toggleItem(event, itemId) {
            this.$emit('toggle-item', event, itemId)
        }
    }
}
</script>
