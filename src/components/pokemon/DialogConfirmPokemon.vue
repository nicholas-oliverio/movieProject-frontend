<template>

<v-dialog v-model="dialog" max-width="400">
      <v-card style="border-radius: 15px;">
        <v-card-title class="text-h6">
          {{title}}
        </v-card-title>
        <v-card-text>
          {{text}}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" style="border-radius: 15px;" @click="dialog= false">Cancel</v-btn>
          <v-btn color="error" style="border-radius: 15px;" @click="onConfirm()">Confirm</v-btn>
        </v-card-actions>
      </v-card>
</v-dialog>

</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    modelValue:{
        type:Boolean,
        default: false
    },
    titleDialog:{
        type:String,
        default: null
    },
    textDialog:{
        type:String,
        default: null
    },
    poke:{
        type:String,
        default: null
    },
    i:{
        type:Number,
        default: null
    }
})

const emit = defineEmits([
    'update:modelValue',
    'confirm'
])

const dialog =  computed({
    get: () => props.modelValue,
    set: (bool) => emit('update:modelValue',bool)
})
const title = computed(() => props.titleDialog)
const text = computed(() => props.textDialog)




function onConfirm (){
    if (!props.poke || typeof props.poke !== 'string') {
    console.error('No Pokémon name provided in dialog.');
    dialog.value = false
    return
  }
  dialog.value = false
  emit('confirm', { name: props.poke, index: props.i })
}
</script>