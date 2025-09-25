 <template>
 <v-dialog v-model="dialogForm" max-width="600">
    <v-card>
      <v-card-title>
        <span class="text-h6">
          {{ mode === 'edit' ? 'Edit film' : 'Add film' }}
        </span>
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef">
        <v-input type="hidden" v-model="form._id"/>
        <v-text-field
          label="Title"
          v-model="form.title"
          clearable
          :rules="titleRules"
        />

        <v-text-field
          label="Description"
          v-model="form.fullplot"
          clearable
          :rules="fullplotRules"
        />
        <v-text-field
          label="Year"
          v-model="form.year"
          type="number"
          :rules="yearRules"
          clearable
        />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialogForm = false">Cancel</v-btn>
        <v-btn color="primary" @click="saveForm">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({ 
  modelValue:{
    type: Boolean,
    default: false
  },
  movie:{
    type: Object,
    default: null
  },
  mode:{
    type: String,
    default: null
  }
})
const emit = defineEmits(['update:modelValue','save'])

const dialogForm = computed({
get: () => props.modelValue,
set: (bool) => emit("update:modelValue",bool)
})


const currentYear = new Date().getFullYear()
const titleRules = [
  v => !!v || 'The title is mandatory',
  v => (v && v.length >= 3) || 'Min 3 characters',
  v => (v && v.length <= 100) || 'Max 100 characters'
]
const fullplotRules = [
  v => !!v || 'The description is mandatory',
  v => (v && v.length >= 10) || 'Min 10 characters',
  v => (v && v.length <= 500) || 'Max 500 characters'
]
const yearRules = [
  v => !!v || 'The year is mandatory',
  v => /^\d+$/.test(v) || 'must be a number',
  v => (v >= 1888 && v <= currentYear) || `must be between 1888 and ${currentYear}`
]
const formRef = ref(null)  
const form = reactive({
  _id: null,
  title: '',
  year:'',
  fullplot:'',
})
function resetForm() {
  form._id = null
  form.title = ''
  form.year = ''
  form.fullplot = ''
}

watch(
  () => props.movie,
  (m) => {
    if (m && typeof m === 'object') {
      form._id = m._id ?? null
      form.title = m.title ?? ''
      form.year = m.year ?? ''
      form.fullplot = m.fullplot ?? ''
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

async function isFormValid() {
  const res = formRef.value?.validate?.()
 
if (res && typeof res.then === 'function') {
    const { valid } = await res
    return !!valid
  }
  return !!res
}

async function saveForm() {
  const valid = await isFormValid()
  if (!valid) return
  emit('save', { ...form })
  dialogForm.value = false
}
</script>