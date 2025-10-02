<template>
  <v-dialog v-model="dialog" max-width="700">
    <v-card class="pa-4" style="border-radius: 16px;">
      <v-row>
        <v-col cols="12" md="4" class="d-flex justify-center align-center">
          <v-img
            :src="poke?.sprites?.front_default"
            max-width="200"
            class="rounded-lg"
          />
        </v-col>

        <v-col cols="12" md="8">
          <h2 class="text-h5 mb-2 text-capitalize">{{ poke?.name }}</h2>
          <p><strong>Types:</strong> {{ poke?.types?.map(t => t.type.name).join(", ") }}</p>
          <p><strong>Height:</strong> {{ poke?.height }}</p>
          <p><strong>Weight:</strong> {{ poke?.weight }}</p>

          <v-divider class="my-2" />

          <p><strong>Base experience:</strong> {{ poke?.base_experience }}</p>
          <p><strong>Abilities:</strong>
            {{ poke?.abilities?.map(a => a.ability.name).join(", ") }}
          </p>
        </v-col>

        <v-col cols="12" class="d-flex justify-center mt-4" style="gap: 1rem;">
          <v-btn variant="text" style="border-radius: 15px;" @click="close">Close</v-btn>
          <v-btn variant="text" style="border-radius: 15px;" @click="add(poke)">Add</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>


<script setup>

const props = defineProps({
  modelValue: {
    type : Boolean,
    default : false
  },
  poke:{
    type:Object,
    default:null
  }
})

const emit = defineEmits([
  'update:modelValue',
  'add'
])

const dialog = computed({
    get: () => props.modelValue,
    set: (bool) => emit('update:modelValue',bool),
})
function close () {
  dialog.value = false
}
function add(poke){
  emit('add',poke)
}
</script>