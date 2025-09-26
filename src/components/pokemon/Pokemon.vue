<template>

    <v-toolbar flat style="background-color: #212121; display:flex ; flex-direction: row; justify-content: space-between;">
      <v-toolbar-title>Pokemon</v-toolbar-title>
      <v-spacer />
      <v-text-field
        v-model="pokemonName"
        density="compact"
        hide-details
        clearable
        placeholder="Search pokemon"
        prepend-inner-icon="mdi-magnify"
        class="mr-2"
        style="max-width: 300px"
      />
      <v-btn  variant="tonal" class="mr-5" @click="getSingleMovie(pokemonName)">
        Search
      </v-btn>

    </v-toolbar>

  <DialogInfoPokemon 
  v-model="infoPoke"
  :poke="singlePokemon"
  />
  
</template>


<script setup>
import { onMounted , ref} from 'vue';
import {api2} from  "@/axios"
import DialogInfoPokemon from './DialogInfoPokemon.vue';


const pokemon = ref([])
const singlePokemon = ref(null)
const infoPoke = ref(false)
const pokemonName = ref("");

onMounted(() => {
  fetchPokemon();
});

async function fetchPokemon(){
  try{
    const {data} = await api2.get('https://pokeapi.co/api/v2/pokemon')
    pokemon.value = Array.isArray(data?.results) ? data.results : [];
  }catch(err){
    console.error(err)
  }
}

async function getSingleMovie(name) {
  try{

  const {data} = await api2.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
  singlePokemon.value = data;  
  await nextTick()
  infoPoke.value = true;
  console.log(singlePokemon.value)
  }catch(err){
    console.error(err)
  }
}



</script>

<style scoped>

.modalContainer {
  padding: 16px;               
  border-radius: 16px;
}

.content {
  display: flex;
  gap: 16px;                    
  align-items: stretch;        
  max-height: 600px;           
}

.left {
  flex: 1 1 0;
  display: flex;
  flex-direction: column; 
  gap: 12px;
  min-width: 0;
}

.title {
  margin: 0 0 4px 0;
  font-size: 1.4rem;
  line-height: 1.2;
  font-weight: 700;
}

.meta {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 8px;
  align-items: start;
}

.label {
  color: rgba(223, 223, 223, 0.6);
  font-weight: 600;
}

.value {
  overflow: hidden;
  text-overflow: ellipsis;
}

.description p {
  margin: 4px 0 0 0;
  line-height: 1.45;
}

.updated {
  margin-top: auto;            
  display: block;
  color: rgba(239, 239, 239, 0.6);
  font-size: .8rem;
}


.right {
  width: 320px;                  
  max-width: 45%;
  display: flex;
  align-items: center;
}

.poster {
  width: 100%;
  aspect-ratio: 2 / 3;          
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,.08);
}
.actions {
  margin-top: auto;        
  justify-content: flex-start; 
  padding-left: 0;       
}

.movie-table table {
  table-layout: fixed;      
}

.movie-table th,
.movie-table td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}


.movie-table th:nth-child(1),
.movie-table td:nth-child(1) { width: 250px; }

.movie-table th:nth-child(2),
.movie-table td:nth-child(2) { width: 100px; text-align: center; }

.movie-table th:nth-child(3),
.movie-table td:nth-child(3) { width: 120px; }

.col-title {
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.col-year {
  text-align: center;
  width: 100px;
}


@media (max-width: 700px) {
  .content {
    flex-direction: column-reverse; 
  }
  .right {
    width: 100%;
    max-width: 100%;
  }
}

</style>