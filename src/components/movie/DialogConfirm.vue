<template>

<v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          Conferma eliminazione
        </v-card-title>
        <v-card-text>
          Vuoi davvero procedere con questa azione? 
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialog= false">Annulla</v-btn>
          <v-btn color="error" @click="onConfirm">Conferma</v-btn>
        </v-card-actions>
      </v-card>
</v-dialog>

</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
})


const emit = defineEmits(['update:modelValue','confirm'])

const dialog = computed({
  get: () => props.modelValue,
  set: (bool) => emit('update:modelValue',bool)
})

function onConfirm() {
  dialog.value = false  
  emit('confirm')         
}
</script>