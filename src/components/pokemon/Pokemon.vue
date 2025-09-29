<template>
  <v-toolbar flat style="background-color:#212121; display:flex; flex-direction:row; justify-content:space-between;">
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
      @keyup.enter="getSinglePokemon(pokemonName)"
    />
    <v-btn variant="tonal" class="mr-5" @click="getSinglePokemon(pokemonName)">
      Search
    </v-btn>
  </v-toolbar>

  <v-container style="border-top-left-radius:15px; border-top-right-radius:15px; background-color:#212121; margin-top:100px;">
    <h1 style="font-family:Arial, Helvetica, sans-serif; display:flex; justify-content:center;"><strong>Squadra</strong></h1>
  </v-container>

  <v-container style="border-bottom-left-radius:15px; border-bottom-right-radius:15px; background-color:grey; display:flex; flex-direction:column; height:500px; justify-content:space-around;">
    <div
      style="
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 5rem;
        margin: auto;
        justify-content: space-around;
      "
    >
    
      <div
        v-for="i in 6"
        :key="i"
        :class="['circle', team.members[i-1] ? 'full' : 'empty']"
      >
        <template v-if="team.members[i-1]">
          <img
            :src="team.members[i-1].sprites?.front_default || team.members[i-1].sprite"
            :alt="team.members[i-1].name"
          />
        </template>
        <template v-else>
          <img
            src="@/assets/Poké_Ball_icon.svg.png"
            alt="Pokéball"
            class="placeholder"
          />
        </template>
      </div>
    </div>

    <div style="display: flex; justify-content: center; gap: 2rem; margin-top: 2rem;">
    <v-btn class="mr-5" @click="getSinglePokemon(pokemonName)">
      info
    </v-btn>
    <v-btn class="mr-5" @click="getSinglePokemon(pokemonName)">
      Altro
    </v-btn>
</div>
  </v-container>

  <DialogInfoPokemon
    v-model="infoPoke"
    :poke="singlePokemon"
    @add="addSquad"
  />
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { api, api2 } from '@/axios'
import DialogInfoPokemon from './DialogInfoPokemon.vue'

const singlePokemon = ref(null)
const infoPoke = ref(false)
const pokemonName = ref('')

const team = ref({
  id: 'team-1',
  members: [null, null, null, null, null, null], 
})

function toSixSlots(arr = []) {
  return [...arr, null, null, null, null, null].slice(0, 6)
}

onMounted(async () => {
  try {
    const { data } = await api.get(`/pokemon/team-1`)
    const members = data?.data?.members ?? []
    team.value.members = toSixSlots(members)
  } catch (err) {
    console.error('Errore caricamento team:', err)
  }
})

async function getSinglePokemon(name) {
  try {
    if (!name) return
    const { data } = await api2.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
    singlePokemon.value = data
    await nextTick()
    infoPoke.value = true
  } catch (err) {
    console.error('Pokemon inesistente all interno del Database',err)
  }
}

async function addSquad(poke) {
  infoPoke.value = false
  const payload = {
    id: poke.id,
    name: poke.name,
    species: poke.species?.name ?? poke.species,
    sprites: { front_default: poke.sprites?.front_default },
    level: 1,
    types: (poke.types || []).map(t => t.type?.name ?? t),
  }
  try {
    const idx = team.value.members.findIndex(m => m == null)
    if (idx !== -1) {
    const { data } = await api.patch('/pokemon/team-1', payload)
    console.log('API.patch /pokemon/team-1 ->', data)
      team.value.members[idx] = payload
    } else {
      console.log('Team pieno: impossibile aggiungere localmente')
    }
    } catch (err) {
    console.error(err)
    }
}
</script>

<style scoped>
.circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-fit: contain;
  opacity: 0.7;
}

.full {
  border: 8px solid #333;
  border-color: #ffffff;
  background-color: rgba(201, 210, 218, 0.708);
}

.empty {
  border-color: blue;
}
.modalContainer {
  padding: 16px;               
  border-radius: 16px;
  background-color: #333;
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