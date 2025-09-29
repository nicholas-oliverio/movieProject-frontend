<template>

<v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          {{title}}
        </v-card-title>
        <v-card-text>
          {{text}}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialog= false">Cancel</v-btn>
          <v-btn color="error" @click="onConfirm">Confirm</v-btn>
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
  titleDialog: {
    type: String,
    default: null
  },
  textDialog: {
    type: String,
    default: null
  }
})


const emit = defineEmits(['update:modelValue','confirm'])

const dialog = computed({
  get: () => props.modelValue,
  set: (bool) => emit('update:modelValue',bool)
})
const title = computed(() => props.titleDialog)
const text = computed(() => props.textDialog)


function onConfirm() {
  dialog.value = false  
  emit('confirm')         
}
</script>