<script setup>
import { useRouter, useRoute } from 'vue-router';
import { api } from '@/axios'
import { onMounted } from 'vue';

const router = useRouter()
const route = useRoute()

const { id } = route.params
const inAttack = ref(true)
const enemieTeam = ref({
  id: id,
  members: [null, null, null, null, null, null], 
})
const myTeam = ref({
  id: 'team-1',
  members: [null, null, null, null, null, null], 
})
const indexMyTeam = ref(0)
const attackBtn = ref(false)
const squadBtn = ref(false)
const isActive = ref(false)
const isMyActive = ref(false)

onMounted(async () => {
  await getMyTeam()
  await getEnemieTeam()
  myTeam.value.members.forEach(m => { if(m) m.maxHp = m.hp })
  enemieTeam.value.members.forEach(m => { if(m) m.maxHp = m.hp })
})
async function attackFunction(action,att,indexEnemie = 0){
    switch( action ){
        case 'exit':
            attackBtn.value = !attackBtn.value
            break
        case 'baseAttack':
            let idx = indexEnemie;
            console.log('apre l animazione', isActive.value = true )
            attackBtn.value = false
            const members = enemieTeam.value?.members ?? [];
            const pokemonName = members[idx].name;
            if(!pokemonName){
                console.warn("Nessun nemico trovato")
                return
            }
            const payload = {
                name: pokemonName, 
                damage: att
            }
            const { data } = await api.patch(`/pokemon/${id}/removeHp`,payload)
            console.log(data.message)
            if(data.message.startsWith('HP')){
                refreshData()
                setTimeout(() => {
                console.log('chiude l animazione',isActive.value = false)
                
                enemyAttack()
                }, 1500)
               
            }else{
                refreshData()
                setTimeout(() => {
                console.log('chiude l animazione',isActive.value = false)
                setTimeout(() => { isActive.value = false }, 0)
                
                }, 1500)
          
            }
            break
        case 'specialAttack':
            let idx2 = indexEnemie;
            
            attackBtn.value = !attackBtn.value
            const members2 = enemieTeam.value?.members ?? [];
            const pokemonName2 = members2[idx2].name;
            if(!pokemonName2){
                console.warn("Nessun nemico trovato")
                return
            }
            const payload2 = {
                name: pokemonName2, 
                damage: att
            }
            const  data2  = await api.patch(`/pokemon/${id}/removeHp`,payload2)
            if(data2.data.message.startsWith('HP')){
                refreshData()
                await enemyAttack()
            }else{
                refreshData()
            }
            break
    }
}
async function squadFunction(){
    squadBtn.value = !squadBtn.value
}
async function clickSquad(index){

    indexMyTeam.value = index - 1
    squadBtn.value = !squadBtn.value
    await enemyAttack()
}

async function refreshData() {
  await getMyTeam()
  await getEnemieTeam()
}
async function exit() {
const payload = []
payload.push(id)
await api.patch('/pokemon/reset-enemies',payload)
router.push({ path: `/pokemon` })
}

async function getEnemieTeam(){
    const {data} = await api.get(`/pokemon/${id}`)
    const members = data?.data?.members ?? []
    enemieTeam.value.members = toSixSlots(members)

}
async function getMyTeam(){
    const {data} = await api.get(`/pokemon/team-1`)
    const members = data?.data?.members ?? []
    myTeam.value.members = toSixSlots(members)

}

const hpColorEnemieTeam = ref('green')
const hpColorMyTeam = ref('green')

watch(
  () => enemieTeam.value.members[0]?.hp,
  (newHp) => {
    const member = enemieTeam.value.members[0]
    if (!member) return

    if (newHp <= member.maxHp * 0.2) {
      hpColorEnemieTeam.value = 'red'
    } else if (newHp <= member.maxHp * 0.5) {
      hpColorEnemieTeam.value = 'orange'
    } else {
      hpColorEnemieTeam.value = 'green'
    }
  }
)

watch(
  () => myTeam.value.members[indexMyTeam.value]?.hp,
 async ( newHp) => {
    const member =  await myTeam.value.members[indexMyTeam.value]
    console.log(member)

    if (!member) return

    if (newHp <= member.maxHp * 0.2) {
      hpColorMyTeam.value = 'red'
    } else if (newHp <= member.maxHp * 0.5) {
      hpColorMyTeam.value = 'orange'
    } else {
      hpColorMyTeam.value = 'green'
    }
  }
)
watch(
  () => enemieTeam.value.members,
  (newMembers) => {
    
    const isDefeated = newMembers.every(m => !m || m.hp <= 0)
    if (isDefeated) {
      alert('Victory!')
    }
  },
  { deep: true }
)

watch(
  () => myTeam.value.members,
  (newMembers) => {
    
    const isDefeated = newMembers.every(m => !m || m.hp <= 0)
    if (isDefeated) {
      alert('Defeat!')
    }
  },
  { deep: true }
)

async function enemyAttack(){

    inAttack.value = false
    await new Promise(resolve => setTimeout(resolve, 1000));
    isMyActive.value = true
    const pokemonName = myTeam.value.members[indexMyTeam.value].name

    const att = enemieTeam.value.members[0].attack.basickAttack

    const payload = {
                name: pokemonName, 
                damage: att
            }
    const { data } = await api.patch(`/pokemon/${myTeam.value.id}/removeHp`,payload)
    await new Promise(resolve => setTimeout(resolve, 1000));
    await refreshData()    
    isMyActive.value = false       
    inAttack.value = true
}
function toSixSlots(arr = []) {
  return [...arr, null, null, null, null, null].slice(0, 6)
}

</script>

<template>

    <v-container style="border-radius:20px; background-color: #333;width: 900px; margin-top:100px;height: 600px; padding: 10px; ">

        <div style="width: 100%; height: 100%; background-color: bisque; display: flex; flex-direction: column; border-radius:20px;">

            <!-- BLOCCO NEMICO  -->
            <div style="display: flex; width: 100%; height: 50%; justify-content: start; padding: 20px;">
                <div style="background-color: aliceblue; height: 65px; width: 270px; border-bottom-right-radius:15px; border-top-left-radius:15px;
                        display: flex; flex-direction: column; padding: 3px; border: 3px solid #333; ">
                    <div style="display: flex; flex-direction: row; width: 100%;flex-wrap: nowrap; height: 50%;">
                        <div style="display: flex; width: 70%; justify-content: start;">
                            <h1 style="color: black; font-size: 18px; margin-left: 3px;">{{ enemieTeam?.members[0]?.name}}</h1>
                        </div>
                        <div style="display: flex; width: 30%; justify-content: end; margin-right: 3px;">
                            <h1 style="color: black; font-size: 18px;" ></h1>
                        </div>
                    </div>

                    <div style="display: flex; flex-direction: row; width: 100%; flex-wrap: nowrap; height: 50%;">
                        <div style="display: flex; width: 30%; justify-content: start;">
                            
                        </div>
                        <div style="display: flex; width: 70%; justify-content: end; flex-direction: row; align-items: center;">
                            <p style="color: black; font-size: 14px; font-weight: 400; margin-right: 3px;" >hp: {{enemieTeam?.members[0]?.hp}}</p>
                            <div style="background-color: white; width: 60%; height: 40%; display: flex; margin-right: 3px; border-radius: 8px;">
                                <div 
                                    :style="{
                                    width: (enemieTeam.members[0]?.hp / enemieTeam.members[0]?.maxHp * 100) + '%',
                                    backgroundColor: hpColorEnemieTeam,
                                    height: '100%',
                                    borderRadius: '8px',
                                    transition: 'width 0.5s ease, background-color 0.5s ease'
                                    }">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                 <div style="color: #333; height: 100%; width: 100%; display: flex; justify-content: end;">

                    <div style="position: relative; background-color: #77dd77; height: 60px; width: 400px; border-radius:250px/50px; margin-top: 140px; border: 3px solid green; ">
                        <v-img
                            :src="enemieTeam?.members[0]?.sprites?.front_default"
                            style="position:absolute; 
                                transform: translateX(-50%) scale(3.5);
                                width:140px; right: 15%; bottom: 80%; "
                            :class="{ 'red-blink': isActive }"
                        >
                        </v-img>
                    </div>
                </div>
            </div>

            <!-- BLOCCO TUA SQUADRA  -->
            <div style="display: flex; width: 100%; height: 50%; justify-content: end; padding-top: 20px; padding-right: 20px; padding-left: 20px;">

                <div style="color: #333; height: 100%; width: 100%; display: flex; justify-content: start;">

                    <div style="position: relative; background-color: #77dd77; height: 60px; width: 400px; border-radius:250px/50px; margin-top: 80px; border: 3px solid green; ">
                       
                    <v-img v-if="myTeam?.members[indexMyTeam]?.sprites?.back_default"
                        :src="myTeam.members[indexMyTeam].sprites.back_default"
                        style="position:absolute;
                            transform: translateX(-50%) scale(3.5);
                            width:140px; right: 15%; bottom: 110%;"
                        :class="{ 'red-2blink': isMyActive }"
                        >
                        </v-img>
                        <div v-else >   
                    
                        </div>
                    </div>
                </div>

                <div style="background-color: aliceblue; height: 65px; width: 270px; border-bottom-left-radius:15px; border-top-right-radius:15px;
                    display: flex; flex-direction: column; padding: 3px; border: 3px solid #333; ">
                    <div style="display: flex; flex-direction: row; width: 100%;flex-wrap: nowrap; height: 50%;">
                        <div style="display: flex; width: 30%; justify-content: start;">
                            <h1 style="color: black; font-size: 18px; margin-left: 3px;">{{myTeam?.members[indexMyTeam]?.name}}</h1>
                        </div>
                        <div style="display: flex; width: 70%; justify-content: end; margin-right: 3px;">
                            <h1 style="color: black; font-size: 18px;" ></h1>
                        </div>
                    </div>

                    <div style="display: flex; flex-direction: row; width: 100%; flex-wrap: nowrap; height: 50%;">
                        <div style="display: flex; width: 30%; justify-content: start;">
    
                        </div>
                        <div style="display: flex; width: 70%; justify-content: end; flex-direction: row; align-items: center;">
                            <p style="color: black; font-size: 14px; font-weight: 400; margin-right: 3px;" >hp: {{myTeam?.members[indexMyTeam]?.hp}}</p>
                            <div style="background-color: white; width: 60%; height: 40%; display: flex; margin-right: 3px; border-radius: 8px;">
                                <div 
                                    :style="{
                                    width: (myTeam.members[indexMyTeam]?.hp / myTeam.members[indexMyTeam]?.maxHp * 100) + '%',
                                    backgroundColor: hpColorMyTeam,
                                    height: '100%',
                                    borderRadius: '8px',
                                    transition: 'width 0.5s ease, background-color 0.5s ease'
                                    }">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- BLOCCO BOTTONI  -->
            <div v-if="inAttack" style="display: flex; width: 100%; height: 40%; justify-content: start; background-color: white; flex-direction: column; gap: 3px; padding: 3px; 
                        border-bottom-left-radius:20px; border-bottom-right-radius:20px;">
               <div style="display: flex; flex-direction: row; justify-content: start; gap: 3px; padding-right: 3px;">
                    
                    <v-btn v-if="!attackBtn" @click="attackFunction('exit')"
                        style=" width: 50%; height: 80px; background-color:#c33232; border-radius: 20px;"
                        >Attack</v-btn>
                        
                    <div v-else
                        style=" width: 50%; height: 80px; background-color:#c33232; border-radius: 20px; flex-direction: column; display: flex;"
                    >
                    <div style="display: flex; flex-direction: row;">
                        <v-btn @click="attackFunction('baseAttack',myTeam?.members[indexMyTeam]?.attack.basickAttack)"
                        style=" width: 50%; height: 40px; background-color:brown; border-radius: 20px; z-index: 2;"
                        >Base Attack</v-btn>

                        <v-btn @click="attackFunction('specialAttack',myTeam?.members[indexMyTeam]?.attack.specialAttack)"
                        style=" width: 50%; height: 40px; background-color:brown; border-radius: 20px; z-index: 2;"
                        >Special Attack</v-btn>
                    </div>
                    <v-btn @click="attackBtn = false"
                    style=" width: 100%; height: 40px; background-color:brown; border-radius: 20px; z-index: 1;"
                    >Exit</v-btn>    
                    </div>

                    <v-btn v-if="!squadBtn" @click="squadFunction()"
                    style=" width: 50%; height: 80px; background-color:#22afa7; border-radius: 20px;"
                    >SQUAD</v-btn>
                    <div v-else
                        style=" width: 50%; height: 80px; background-color:#22afa7; border-radius: 20px; flex-direction: column; display: flex;"
                    >

                    <div style="display: flex; flex-direction: row; width: 100%; height: 100%;  border-radius: 20px; gap: 4px;">
                        <div style="display: flex; flex-direction: column; width: 90%; height: 100%;  border-radius: 20px; gap: 4px;">
                            <div style="display: flex; flex-direction: row; width: 100%; height: 50%;  border-radius: 20px; justify-content: space-around; gap: 4px;">
                                 <v-btn
                                v-for="(btn, index) in 3"
                                :key="index"
                                :disabled="index === indexMyTeam"
                                :style="{
                                    flex:1,
                                    borderRadius: '20px',
                                    height: '100%',
                                    backgroundColor: 'darkcyan',
                                    zIndex: 2
                                }"
                
                                @click="clickSquad(index + 1)" 
                                >
                                {{myTeam?.members[index]?.name}}
                                </v-btn>
                            </div>
                            <div style="display: flex; flex-direction: row; width: 100%; height: 50%;  border-radius: 20px;justify-content: space-around; gap: 4px;">
                                <v-btn
                                    v-for="(btn, index) in 3"
                                    :key="index"
                                    style="flex:1; border-radius: 20px; height: 100%; background-color: darkcyan; z-index: 1;"
                                    @click="clickSquad(index + 4)"
                                >
                                {{myTeam?.members[index + 3 ]?.name}}
                                </v-btn>
                            </div>
                        </div>
                            <v-btn @click="squadBtn = false"
                            style=" width: 10%; height: 100%; border-radius: 20px; background-color: darkcyan; "> <- </v-btn>
                    </div>

                    </div>


               </div>
               <v-btn
                    @click="exit"
                    style=" width: 100%; height: 80px; background-color:#333;border-radius: 20px;"
                >EXIT</v-btn>
            </div>
            <div v-else style="display: flex; width: 100%; height: 40%; justify-content: start; background-color: bisque; flex-direction: column; gap: 3px; padding: 3px; 
                        border-bottom-left-radius:20px; border-bottom-right-radius:20px;">

            </div>

        </div>

    </v-container>

</template>
<style scoped>
.red-blink {
  filter: sepia(1) saturate(10000%) hue-rotate(-50deg);
  animation: redBlink 1s infinite ease-in-out;
}

.red-2blink {
  filter: sepia(1) saturate(10000%) hue-rotate(-50deg);
  animation: redBlink 1s infinite ease-in-out;
}

/* con style scoped, usiamo il selettore :deep per raggiungere elementi interni di v-img */
:deep(.red-blink) img,
:deep(.red-blink) .v-image__image {
  filter: sepia(1) saturate(10000%) hue-rotate(-50deg);
  animation: redBlink 1s infinite ease-in-out;
}

:deep(.red-2blink) img,
:deep(.red-2blink) .v-image__image {
  filter: sepia(1) saturate(10000%) hue-rotate(-50deg);
  animation: redBlink 1s infinite ease-in-out;
}

@keyframes redBlink {
  0%, 100% {
    filter: none;
  }
  50% {
    filter: sepia(1) saturate(10000%) hue-rotate(-50deg);
  }
}   

@keyframes red2Blink {
  0%, 100% {
    filter: none;
  }
  50% {
    filter: sepia(1) saturate(10000%) hue-rotate(-50deg);
  }
}   


</style>