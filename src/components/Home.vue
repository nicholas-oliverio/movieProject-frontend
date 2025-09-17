
<template>

  <v-data-table
  :headers="headers"
  :items="movie"
  :items-per-page="30"
  fixed-header          
  height="745px" 
  >
   <template #item.action="{ item }">
    <v-btn size="small" @click="openDetailsMovie(item._id)">
      Info
    </v-btn>
  </template>
  </v-data-table>

  <v-dialog v-model="dialog">
   <v-card>
   
      <v-card-title>{{detail?.title}}</v-card-title>
      <p>{{ detail?.poster }}</p>
      <v-btn text="Close" @click="dialog=false"></v-btn>
  </v-card>
  </v-dialog>
</template>



<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/axios'


const headers = [
  {
    title:'Title' , key: 'title'
  },
  {
    title:'Year' , key: 'year'
  },
  {
    title:'Cast' , key: 'cast'
  },
  {
    title:'Action' , key: 'action',sortable: false
  },
]

const detail = ref(null)
const dialog = ref(false)
const movie = computed (() =>  respMovie.value?.data ?? [])
const respMovie = ref(null)

onMounted( async () =>{
  try {
    const resMovie = await api.get('/movieList')
    respMovie.value = resMovie.data
    if( respMovie.value.rc !== 0 ) {
      throw new Error(`Errore nella fetch utenti: ${respMovie.value.message}`);
    }
  } catch (err) {
    console.error('Errore fetch:', err)
  }
})

async function openDetailsMovie(id){
  if(!id) return
  dialog.value = true
  detail.value = null
  try{
    const {data} = await api.get(`/movieList/${id}`)
    detail.value = data?.data ?? data
    console.log(detail.value?.title)
  }catch(err){
    console.error('errore nel recupero dei dettagli',err)
  }
}

</script>
<style scoped>

</style>