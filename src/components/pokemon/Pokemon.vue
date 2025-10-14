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

  <v-container style="border-top-left-radius:15px; border-top-right-radius:15px; background-color:#c33232; margin-top:100px;border-bottom: 10px solid #000; height: 100px; width: 900px">
    <h1 style="font-family:Arial, Helvetica, sans-serif; display:flex; justify-content:center; color: white;">
      <strong>My Team</strong>
    </h1>
  </v-container>

  <v-container style="border-bottom-left-radius:15px; border-bottom-right-radius:15px; background-color:grey; display:flex; flex-direction:column; height:500px; width: 900px; justify-content:space-around;">
    <div style="display: grid; grid-template-columns: repeat(3, 1fr);gap: 5rem;margin: auto;justify-content: space-around;">
      <div
        v-for="i in 6"
        :key="i"
        :class="['circle', team.members[i-1] ? 'full' : 'empty']"
      >
        <v-btn
        v-if=" openEdit && team.members[i-1] "
        variant="text"
        class="remove-btn"
        @click="openDeleteDialog(team.members[i-1].name,i-1)"
        >
        <img src="@/assets/tastoDelete.png" alt="remove" class="remove-img" />
        </v-btn>
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
    <v-btn v-if="!openEdit" style="font-family: Arial, Helvetica, sans-serif;font-weight: bold; color: white; border-radius: 15px; background-color: #262626;" class="mr-5" @click="opendEdit(team.members)">
      Edit Team
    </v-btn>
    <v-btn v-if="openEdit"  style="background-color:#c33232;color: white; font-family: Arial, Helvetica, sans-serif;font-weight: bold; border-radius: 15px;" class="mr-5" @click="openEdit = !opendEdit">
      Close Edit
    </v-btn>
    <v-btn style="background-color:#009b6c;color: white; font-family: Arial, Helvetica, sans-serif;font-weight: bold; border-radius: 15px;" class="mr-5"  :to="{ path: '/chooseEnemie' }">
      Play
    </v-btn>
    </div>
  </v-container>

  <DialogInfoPokemon
    v-if="infoPoke"
    v-model="infoPoke"
    :poke="singlePokemon"
    @add="addSquad"
  />

  <DialogConfirmPokemon
  v-model="confirmDialog"
  title-dialog="Confirmation of exclusion"
  text-dialog="Are you sure you want to remove this Pokémon from your team?"
  :poke="pokemonToDelete"
  :i="indexToConfirmDialog"
  @confirm="removePokemon($event)"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { api, api2 } from '@/axios'
import DialogInfoPokemon from './DialogInfoPokemon.vue'



const pokemonName = ref('')

const singlePokemon = ref(null)
const infoPoke = ref(false)

const openEdit = ref(false)

const confirmDialog = ref(false)
const pokemonToDelete = ref(null)
const indexToConfirmDialog = ref(null)

const team = ref({
  id: 'team-1',
  members: [null, null, null, null, null, null], 
})

function toSixSlots(arr = []) {
  return [...arr, null, null, null, null, null].slice(0, 6)
}

onMounted(async () => {
 getPokemonTeam()
})

async function getPokemonTeam(){
 try {
    const { data } = await api.get(`/pokemon/team-1`)
    const members = data?.data?.members ?? []
    team.value.members = toSixSlots(members)
  } catch (err) {
    console.error('Team loading error:', err)
  }
}

async function getSinglePokemon(name) {
  try {
    if (!name) return
    const { data } = await api2.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
    singlePokemon.value = data
    infoPoke.value = true
    console.log(singlePokemon.value)
  } catch (err) {
    console.error('Pokemon does not exist in the database',err)
  }
}

async function opendEdit(object){
  if (object.some(m => m !== null)) {
    console.log("The team has at least one Pokémon");
    openEdit.value = true
  }else{
    console.log("The team does not have at least one Pokémon");
    return
  }
}


async function openDeleteDialog(name,index){
    confirmDialog.value = true
    pokemonToDelete.value = name
    indexToConfirmDialog.value = index
}

async function addSquad(poke) {
  infoPoke.value = false
  const minHp = 67;
  const maxHp = 150;
  const minBasic = 4
  const maxBasic = 12
  const minSpecial = 13
  const maxSpecial = 18
  const hpValue =   Math.floor(Math.random() * (maxHp - minHp + 1)) + minHp

  const payload = {
    id: poke.id,
    name: poke.name,
    species: poke.species?.name ?? poke.species,
    sprites:{ 
      front_default: poke.sprites?.front_default,
      back_default: poke.sprites?.back_default,
     },
    hp: hpValue,
    maxHp: hpValue,
    attack: {
      basickAttack : Math.floor(Math.random() * (maxBasic - minBasic + 1)) + minBasic,
      specialAttack : Math.floor(Math.random() * (maxSpecial - minSpecial + 1)) + minSpecial,
    },
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
      console.log('Team full: unable to add locally')
    }
    } catch (err) {
    console.error(err)
    }
}

async function removePokemon(object){
  
  const name = object.name
  const index = object.index
  try{
        if (!name) {
        console.error('There are no Pokémon in this location');
        return;
        }
        await api.patch(`/pokemon/team-1/removeByName`,{ name })
           if (index !== undefined && team.value.members[index]?.name === name) {
     
      getPokemonTeam()
      openEdit.value = false
    }
      }catch (err) {
        console.error('Elimination failed!', err.response?.data || err.message);
      }
}
</script>

<style scoped>
.circle {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible; 
}
.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 24px;
  height: 24px;
  padding: 0;
  z-index: 11;
}
.remove-img {
  width: 28px;   
  height: 28px;
  object-fit: contain;
}
.placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-fit: contain;
  opacity: 0.7;
}
.full {
  border: 10px solid #333;
  border-color: #262626;
  background-color: #d9d9d9;
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