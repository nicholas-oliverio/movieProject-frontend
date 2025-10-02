<script setup lang="ts">
import { api,api2 } from '@/axios'; 
import { useRouter } from 'vue-router';
const router = useRouter()
const params = new URLSearchParams(window.location.search);
const parametroDecod = params.get('id')

const enemieTeam = ref({
  id: 'team-2',
  members: [null, null, null, null, null, null], 
})
async function fetchEnemieTeam(){
  try {
    console.log(parametroDecod)
    const { data } = await api.get(`/pokemon/${parametroDecod}`)
    const members = data?.data?.members ?? []
    enemieTeam.value.members = toSixSlots(members)
  } catch (err) {
    console.error('Team loading error:', err)
  }
}
function toSixSlots(arr = []) {
  return [...arr, null, null, null, null, null].slice(0, 6)
}
async function exit() {
router.push({ path: `/pokemon` })
}
onMounted(fetchEnemieTeam)
</script>

<template>

    <v-container style="border-radius:20px; background-color: #333;width: 900px; margin-top:100px;height: 600px; padding: 10px;">

        <div style="width: 100%; height: 100%; background-color: bisque; display: flex; flex-direction: column; border-radius:20px;">

            <!-- BLOCCO NEMICO  -->
            <div style="display: flex; width: 100%; height: 50%; justify-content: start; padding: 20px;">
                <div style="background-color: aliceblue; height: 65px; width: 270px; border-bottom-right-radius:15px; border-top-left-radius:15px;
                        display: flex; flex-direction: column; padding: 3px; border: 3px solid #333; ">
                    <div style="display: flex; flex-direction: row; width: 100%;flex-wrap: nowrap; height: 50%;">
                        <div style="display: flex; width: 30%; justify-content: start;">
                            <h1 style="color: black; font-size: 18px; margin-left: 3px;">Lucario</h1>
                        </div>
                        <div style="display: flex; width: 70%; justify-content: end; margin-right: 3px;">
                            <h1 style="color: black; font-size: 18px;" >lv 8</h1>
                        </div>
                    </div>

                    <div style="display: flex; flex-direction: row; width: 100%; flex-wrap: nowrap; height: 50%;">
                        <div style="display: flex; width: 30%; justify-content: start;">
                            
                        </div>
                        <div style="display: flex; width: 70%; justify-content: end; flex-direction: row; align-items: center;">
                            <h1 style="color: black; font-size: 18px; font-weight: 400; margin-right: 3px;" >hp</h1>
                            <div style="background-color: green; width: 60%; height: 50%; display: flex; margin-right: 3px; border: 3px solid white;"></div>
                        </div>
                    </div>
                </div>


                 <div style="color: #333; height: 100%; width: 100%; display: flex; justify-content: end;">

                    <div style="background-color: #77dd77; height: 50px; width: 400px; border-radius:250px/50px; margin-top: 140px; border: 3px solid green; ">
                        <v-img
                            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/405.png"
                            style="object-fit: contain;  height: 200px;"
                        >
                        </v-img>
                    </div>
                </div>
            </div>

            <!-- BLOCCO TUA SQUADRA  -->
            <div style="display: flex; width: 100%; height: 50%; justify-content: end; padding-top: 20px; padding-right: 20px; padding-left: 20px;">

                <div style="color: #333; height: 100%; width: 100%; display: flex; justify-content: start;">

                    <div style="background-color: #77dd77; height: 50px; width: 400px; border-radius:250px/50px; margin-top: 80px; border: 3px solid green; ">
                        <v-img
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/383.png"
                        style="object-fit: contain;  height: 200px;"
                        >
                        </v-img>
                    </div>
                </div>

                <div style="background-color: aliceblue; height: 65px; width: 270px; border-bottom-left-radius:15px; border-top-right-radius:15px;
                    display: flex; flex-direction: column; padding: 3px; border: 3px solid #333; ">
                    <div style="display: flex; flex-direction: row; width: 100%;flex-wrap: nowrap; height: 50%;">
                        <div style="display: flex; width: 30%; justify-content: start;">
                            <h1 style="color: black; font-size: 18px; margin-left: 3px;">Lucario</h1>
                        </div>
                        <div style="display: flex; width: 70%; justify-content: end; margin-right: 3px;">
                            <h1 style="color: black; font-size: 18px;" >lv 8</h1>
                        </div>
                    </div>

                    <div style="display: flex; flex-direction: row; width: 100%; flex-wrap: nowrap; height: 50%;">
                        <div style="display: flex; width: 30%; justify-content: start;">
    
                        </div>
                        <div style="display: flex; width: 70%; justify-content: end; flex-direction: row; align-items: center;">
                            <h1 style="color: black; font-size: 18px; font-weight: 400; margin-right: 3px;" >hp</h1>
                            <div style="background-color: green; width: 60%; height: 50%; display: flex; margin-right: 3px; border: 3px solid white;"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- BLOCCO BOTTONI  -->
            <div style="display: flex; width: 100%; height: 40%; justify-content: start; background-color: white; flex-direction: column; gap: 3px; padding: 3px; 
                        border-bottom-left-radius:20px; border-bottom-right-radius:20px;">
               <div style="display: flex; flex-direction: row; justify-content: start; gap: 3px; padding-right: 3px;">
                    <v-btn
                    style=" width: 50%; height: 80px; background-color:#c33232; border-radius: 20px;"
                    >Attack</v-btn>
                    <v-btn
                    style=" width: 50%; height: 80px; background-color:dodgerblue; border-radius: 20px;"
                    >SQUAD</v-btn>
               </div>
               <v-btn
                    @click="exit"
                    style=" width: 100%; height: 80px; background-color:#333;border-radius: 20px;"
                >EXIT</v-btn>
            </div>

        </div>

    </v-container>

</template>