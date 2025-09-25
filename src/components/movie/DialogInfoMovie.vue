<template>
  <v-dialog v-model="infoDialog" max-width="800">
    <v-card class="modalContainer">
      <div class="content">
        <section class="left">
          <h2 class="title">{{ movie?.title ?? 'TITOLO' }}</h2>

          <div class="meta">
            <div class="label">Genres</div>
            <div class="value">

              <template v-if="Array.isArray(movie?.genres)">
                {{ movie.genres.join(', ') }}
              </template>
              <template v-else>
                {{ movie?.genres ?? '—' }}
              </template>
            </div>
          </div>

          <div class="meta">
            <div class="label">Anno di uscita</div>
            <div class="value">{{ movie?.year ?? '—' }}</div>
          </div>

          <div class="description">
            <div class="label">Descrizione</div>
            <p>{{ movie?.fullplot ?? '—' }}</p>
          </div>

          <small class="updated">
            Last updated
            {{ dayjs(movie?.tomatoes?.lastupdated).format('DD/MM/YYYY - HH:mm:ss ') }}
          </small>

          <v-card-actions class="actions">
            <v-btn color="primary" variant="text" @click="close">Close</v-btn>
            <v-btn color="warning" variant="text" @click="$emit('edit', movie)">Edit</v-btn>
            <v-btn color="error" variant="text" @click="confirmDialog = true">Delete</v-btn>
          </v-card-actions>
        </section>

        <aside class="right">
          <v-img
            class="poster"
            :src="movie?.poster"
            cover
          />
        </aside>
      </div>
    </v-card>
     <DialogConfirm 
        v-model="confirmDialog"
        @confirm="$emit('delete',movie?._id)"
      />
  </v-dialog>


</template>

<script setup>
import dayjs from 'dayjs'
import DialogConfirm from './DialogConfirm.vue'

const props = defineProps({
  modelValue: {
    type : Boolean,
    default : false
  },
  movie: {
    type : Object,
    default : null
  },
  movieId: {
    type : String,
    default : null
  }
})
const confirmDialog = ref(false)

const emit = defineEmits([
  'update:modelValue', 
  'edit',
  'delete',
])

const infoDialog = computed({
  get: () => props.modelValue,
  set: (bool) => emit('update:modelValue', bool),
})

function close () {
  infoDialog.value = false
}

</script>

