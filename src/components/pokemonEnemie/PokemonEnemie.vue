<template>
<v-container style="border-top-left-radius:15px; border-top-right-radius:15px; background-color:#c33232;width: 900px; margin-top:100px;border-bottom: 10px solid #000; height: 100px;">
    <h1 style="font-family:Arial, Helvetica, sans-serif; display:flex; justify-content:center; color: white; ">
      <strong>Choose Enemie</strong>
    </h1>
  </v-container>


  <v-container style="border-bottom-left-radius:15px; border-bottom-right-radius:15px; background-color:grey; height:550px;display: flex;
   flex-wrap:wrap; justify-content: center; justify-content: space-around;align-items: center; width: 900px;">
    
    <div style="display: flex; flex-direction: column; gap: 10px; align-items: center;">
        <h1 style="text-align: center; color:#333; font-weight: 800;">Team 1</h1>
        <v-progress-circular v-if="loading"
          color="red"
          indeterminate
        ></v-progress-circular>
        <div v-else style="height: 150px; width: 350px; display: flex; flex-wrap: wrap">
            <div v-for="(member, idx) in team1.members"
                :key="idx"
                 style=" width: 50%; border-radius: 20px; display: flex;"
            >
            <div
              style="background-color: #d9d9d9;; width: 30%; border-radius: 50%; height: 100%;
              display:flex; align-items:center; justify-content:center; overflow:hidden; border: 4px solid #333;
              border-color: #262626;"
            >
              <img
                v-if="member?.sprites?.front_default"
                :src="member.sprites.front_default"
                alt="pokemon"
                class="pokemon-bounce"
                style="width:70%; height:70%; object-fit:contain;"
              />
            </div>
                <div  style="width: 70%; border-radius: 20px; height: 100%;
                      display:flex; align-items:center; justify-content:center; color:white;"> 
                    <div style="background-color:#262626; width: 110%; border-radius: 20px; text-align: center;" >
                        {{ member?.name?.split('-')[0] ?? '' }}
                      </div>
                </div>
            </div>
        </div>
        <v-btn v-if=!loading style="width: 50%; display: flex; border-radius: 15px" @click="chooseEnemie('team-2')">Choose</v-btn>
    </div>

   <div style="display: flex; flex-direction: column; gap: 10px; align-items: center;">
        <h1 style="text-align: center; color:#333; font-weight: 800;">Team 2</h1>
        <v-progress-circular v-if="loading"
          color="red"
          indeterminate
        ></v-progress-circular>
        <div v-else style="height: 150px; width: 350px; display: flex; flex-wrap: wrap">
            <div v-for="(member, idx) in team2.members"
                :key="idx"
                 style=" width: 50%; border-radius: 20px; display: flex;"
            >
            <div
              style="background-color: #d9d9d9;; width: 30%; border-radius: 50%; height: 100%;
              display:flex; align-items:center; justify-content:center; overflow:hidden;  border: 4px solid #333;
              border-color: #262626;"
            >
              <img
                v-if="member?.sprites?.front_default"
                :src="member.sprites.front_default"
                alt="pokemon"
                class="pokemon-bounce"
                style="width:70%; height:70%; object-fit:contain;"
              />
            </div>
                <div  style=" width: 70%; border-radius: 20px; height: 100%;
                      display:flex; align-items:center; justify-content:center; color:white;"> 
                      <div style="background-color:#262626; width: 110%; border-radius: 20px; text-align: center;" >
                        {{ member?.name?.split('-')[0] ?? '' }}
                      </div>
                   
                </div>
            </div>
        </div>
        <v-btn v-if=!loading style="width: 50%; display: flex; border-radius: 15px" @click="chooseEnemie('team-3')">Choose</v-btn>
    </div>

    <div style="display: flex; flex-direction: column; gap: 10px; align-items: center;">
        <h1 style="text-align: center; color:#333; font-weight: 800;">Team 3</h1>
        <v-progress-circular v-if="loading"
          color="red"
          indeterminate
        ></v-progress-circular>
        <div v-else style="height: 150px; width: 350px; display: flex; flex-wrap: wrap">
            <div v-for="(member, idx) in team3.members"
                :key="idx"
                 style=" width: 50%; border-radius: 20px; display: flex;"
            >
            <div
              style="background-color: #d9d9d9;; width: 30%; border-radius: 50%; height: 100%;
              display:flex; align-items:center; justify-content:center; overflow:hidden; border: 4px solid #333;
              border-color: #262626;"
            >
              <img
                v-if="member?.sprites?.front_default"
                :src="member.sprites.front_default"
                alt="pokemon"
                class="pokemon-bounce"
                style="width:70%; height:70%; object-fit:contain;"
              />
            </div>
                <div  style="width: 70%; border-radius: 20px; height: 100%;
                      display:flex; align-items:center; justify-content:center; color:white;"> 
                    <div style="background-color:#262626; width: 110%; border-radius: 20px; text-align: center;" >
                        {{ member?.name?.split('-')[0] ?? '' }}
                      </div>
                </div>
            </div>
        </div>
        <v-btn v-if=!loading style="width: 50%; display: flex; border-radius: 15px;" @click="chooseEnemie('team-4')">Choose</v-btn>
    </div>
  </v-container>

  <router-view />
  
  </template>

<script setup>
import { api,api2 } from '@/axios'; 
import { ref , onMounted} from 'vue'
import { useRouter} from 'vue-router'

const team1Id = ref(false)
const team2Id = ref(false)
const team3Id = ref(false)
const router = useRouter()
const teams = ref([[],[],[]])
const loading = ref(true)
const error = ref(null)
const team1 = ref({
  id: 'team-2',
  members: [null, null, null, null, null, null], 
})
const team2 = ref({
  id: 'team-3',
  members: [null, null, null, null, null, null], 
})
const team3 = ref({
  id: 'team-4',
  members: [null, null, null, null, null, null], 
})

function toSixSlots(arr = []) {
  return [...arr, null, null, null, null, null].slice(0, 6)
}
async function fetchEnemieTeam1(){
  try {
    const { data } = await api.get(`/pokemon/team-2`)
    const members = data?.data?.members ?? []
    team1.value.members = toSixSlots(members)
  } catch (err) {
    console.error('Team loading error:', err)
  }
}
async function fetchEnemieTeam2(){
  try {
    const { data } = await api.get(`/pokemon/team-3`)
    const members = data?.data?.members ?? []
    team2.value.members = toSixSlots(members)
  } catch (err) {
    console.error('Team loading error:', err)
  }
}
async function fetchEnemieTeam3(){
  try {
    const { data } = await api.get(`/pokemon/team-4`)
    const members = data?.data?.members ?? []
    team3.value.members = toSixSlots(members)
  } catch (err) {
    console.error('Team loading error:', err)
  }
}

async function chooseEnemie(_id){
   
    if( _id == 'team-2'){
      team1Id.value = true
    }
    if( _id == 'team-3'){
      team2Id.value = true
    }
    if( _id == 'team-4'){
      team3Id.value = true
    }

  router.push(`/chooseEnemie/arena/${_id}`)
}

onBeforeUnmount(async () => {
 try {
  console.log(team1Id.value)
  console.log(team2Id.value)
  console.log(team3Id.value)
  const payload = []
  if(team1Id.value){
    payload.push('team-3','team-4')
  }
  if(team2Id.value){
    payload.push('team-2','team-4')
  }
  if(team3Id.value){
    payload.push('team-2','team-3')
  }
  if(!team1Id.value && !team2Id.value && !team3Id.value){
    payload.push('team-2','team-3','team-4')
  }
  await api.patch('/pokemon/reset-enemies',payload)
  console.log('Team nemici resettati con successo')
  } catch (err) {
    console.error('Errore nel resettare i team nemici:', err)
  }
})

onMounted(async () => {
try {
    const namePromise =  [fetchRandomPokemon() , fetchRandomPokemon() , fetchRandomPokemon()]
    const nameResults = await Promise.all(namePromise)
    const detailsPromise = nameResults.map(names => fetchDetailsForName(names))
    const filled = await Promise.all(detailsPromise)
    teams.value = filled
    console.log(teams)
    await updateTeamMembers()
    nextTick()
    await fetchEnemieTeam1()
    await fetchEnemieTeam2()
    await fetchEnemieTeam3()
   } catch (err) {
    console.error(err)
    error.value = 'Errore nel caricamento team'
  } finally {
    loading.value = false
  }
});

async function fetchRandomPokemon(){
    try{
    const {data} = await api.get('/pokemonEnemie')
    console.log(data.data)
        return data.data || []
    }catch(err){
      console.error(err)
      return [] 
    }
}

async function fetchDetailsForName(names) {
  const promise = names.map( n =>
  api2.get(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(n.name)}`)
  .then(r => r.data)
  .catch(err => {
        console.warn('Errore fetch pokeapi per', n.name, err)
        return null
  })
  )
  return (await Promise.all(promise)).filter(Boolean)
}

async function updateTeamMembers() {
  try {
    const teamIds = []
  if(team1Id.value){
    teamIds.push('team-3','team-4')
  }
  if(team2Id.value){
    teamIds.push('team-2','team-4')
  }
  if(team3Id.value){
    teamIds.push('team-2','team-3')
  }
  if(!team1Id.value && !team2Id.value && !team3Id.value){
    teamIds.push('team-2','team-3','team-4')
  }
    const minHp = 67;
    const maxHp = 150;
    const minBasic = 4
    const maxBasic = 12
    const minSpecial = 13
    const maxSpecial = 18
    const hpValue =  Math.floor(Math.random() * (maxHp - minHp + 1)) + minHp
    for (let i = 0; i < 3; i++) {

      for(let y = 0; y < 6; y++){
      const index = teamIds[i]  
      const teamData = teams.value[i] || []

      const payload = {
        name: teamData[y].name,
        species: teamData[y].species?.name ?? teamData[i].species,
        sprites:{ 
        front_default: teamData[y].sprites?.front_default,
        back_default: teamData[y].sprites?.back_default,
        },
        hp: hpValue,
        maxHp: hpValue,
        attack: {
          basickAttack : Math.floor(Math.random() * (maxBasic - minBasic + 1)) + minBasic,
          specialAttack : Math.floor(Math.random() * (maxSpecial - minSpecial + 1)) + minSpecial,
        },
        level: 1,
        types: (teamData[y].types || []).map(t => t.type?.name ?? t),
        } 
         console.log(payload)
        await api.patch(`/pokemon/${teamIds[i]}`, payload )
      }
      console.log(`Team ${teamIds[i]} aggiornato`)
    }

  } catch (err) {
    console.error('Errore aggiornamento membri:', err)
  }
}

</script>

<style>

.teams-grid {
  display: grid;
  grid-template-columns: 350px 350px 350px;
  grid-template-rows: auto 1fr;
  gap: 24px 24px;
  justify-content: center; 
  align-items: start;
  padding: 24px;
  height: 500px; 
  box-sizing: border-box;
}

.team-1 { grid-column: 1; grid-row: 1; }
.team-2 { grid-column: 3; grid-row: 1; }
.team-3 { grid-column: 2; grid-row: 2; justify-self: center; }

.team-card {
  background: transparent; 
  display: flex;
  flex-direction: column;
  align-items: center;
}

.team-card h1 {
  text-align: center;
  margin: 0 0 8px 0;
  font-size: 18px;
}

.team-box {
  height: 150px;
  width: 350px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  box-sizing: border-box;
  justify-content: flex-start;
}

.slot {
  width: 50%;
  height: 75px; 
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
}


.circle {
  background-color: #d9d9d9;
  width: 30%;
  height: 100%;
  min-width: 60px; 
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 6px;
  box-sizing: border-box;
}

.circle img {
  width: 70%;
  height: 70%;
  object-fit: contain;
}

.name {
  background-color: black;
  width: 70%;
  height: 100%;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-sizing: border-box;
  font-size: 14px;
  padding: 4px;
  text-align: center;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-8px); }
  60% { transform: translateY(-6px); }
}
.pokemon-bounce { animation: bounce 1.9s ease infinite; }

</style>