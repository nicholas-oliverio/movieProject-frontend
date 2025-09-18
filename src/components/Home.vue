
<template>


  <v-data-table
  :headers="headers"
  :items="filteredMovies"  
  :items-per-page="30"
  fixed-header          
  height="692px" 
  >
  <template #top>
    <v-toolbar flat style="background-color: #212121; display:flex ; flex-direction: row; justify-content: space-between;">
      <v-toolbar-title>MOVIE LIST</v-toolbar-title>
      <v-spacer />
      <v-text-field
        v-model="q"
        density="compact"
        hide-details
        clearable
        placeholder="Cerca per titolo"
        prepend-inner-icon="mdi-magnify"
        class="mr-2"
        style="max-width: 300px"
      />
      <v-menu v-model="filterMenu" :close-on-content-click="false" transition="scale-transition">
        <template #activator="{ props }">
           <div class="d-flex ga-2">
          <v-btn v-bind="props" prepend-icon="mdi-filter-variant" variant="tonal" class="mr-5">
            Filtri
          </v-btn>
          <v-btn v-if=adminDash variant="tonal" class="mr-5">
            ADD
          </v-btn>
          </div>
        </template>
        <v-card min-width="320">
          <v-card-text>
            <v-select
              v-model="genresFilter"
              :items="allGenres"
              label="Genere"
              multiple
              chips
              clearable
              hide-details
              density="comfortable"
              class="mb-3"
            />
            <div class="d-flex ga-2">
              <v-text-field v-model.number="yearFrom" type="number" label="Anno da" hide-details density="comfortable"/>
              <v-text-field v-model.number="yearTo"   type="number" label="Anno a"   hide-details density="comfortable"/>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="text" @click="clearFilters">Reset</v-btn>
            <v-spacer />
            <v-btn color="primary" @click="filterMenu = false">Applica</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-toolbar>
  </template>
   <template #item.action="{ item }">
    <v-btn size="small" @click="openDetailsMovie(item._id)">
      Info
    </v-btn>
  </template>
  </v-data-table>

  <v-dialog
  v-model="dialog"
  max-width="800"
  persistent
>
  <v-card class="modalContainer">
    <div class="content">
 
      <section class="left">
        <h2 class="title">{{ detail?.title }}</h2>

      <div class="meta" v-if="detail">
      <div class="label">Genres</div>
        <div class="value">
          Commedy
        </div>
      </div>

        <div class="meta">
          <div class="label">Anno di uscita</div>
          <div class="value">{{ detail?.year ?? '—' }}</div>
        </div>

        <div class="description">
          <div class="label">Descrizione</div>
          <p>{{ detail?.fullplot || 'Nessuna descrizione disponibile.' }}</p>
        </div>

        <small class="updated">
          Ultima modifica:
          07.09.2025 - 23:02
        </small>


        <v-card-actions class="actions">
          <v-btn color="primary" variant="text" @click="dialog = false">
            Close
          </v-btn>
            <v-btn color="warning" variant="text" @click="">
            Edit
          </v-btn>
            <v-btn  color="error" variant="text" @click="openDelete(detail)">
            Delete
          </v-btn>
        </v-card-actions>
      </section>

 
      <aside class="right">
        <v-img
          :src="poster || '/fallback.jpg'"
          class="poster"
          cover
        />
      </aside>
    </div>
  </v-card>
</v-dialog>

 <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          Conferma eliminazione
        </v-card-title>
        <v-card-text>
          Vuoi davvero eliminare <strong>{{ movieToDelete?.title }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Annulla</v-btn>
          <v-btn color="error" @click="confirmDelete(movieToDelete?._id),deleteDialog=false,dialog=false">Elimina</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

</template>



<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/axios'


const headers = [
  {
    title:'Title' , key: 'title'
  },
  {
    title:'Year' , key: 'year' 
  },
  {
    title:'Action' , key: 'action', sortable: false
  },
]

const q = ref('')
const filterMenu = ref(false)
const genresFilter = ref([])
const yearFrom = ref()
const yearTo   = ref()
const detail = ref(null)
const dialog = ref(false)
const movie = computed (() =>  respMovie.value?.data ?? [])
const respMovie = ref(null)
const poster = ref('')
const adminDash = ref(false)
const deleteDialog = ref(false);
const movieToDelete = ref(null);


const allGenres = computed(() => {
  const set = new Set()
  for (const m of movie.value) {
    const gs = Array.isArray(m.genres)
      ? m.genres
      : typeof m.genres === 'string'
        ? m.genres.split(',').map(s => s.trim())
        : []
    gs.forEach(g => g && set.add(g))
  }
  return Array.from(set).sort()
})

const normalize = s => (s ?? '').toString().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

const filteredMovies = computed(() => {
  const needle = normalize(q.value)
  return movie.value.filter(m => {
    const titleOk  = normalize(m.title).includes(needle)
    const genres   = Array.isArray(m.genres)
      ? m.genres
      : typeof m.genres === 'string' ? m.genres.split(',').map(s => s.trim()) : []
    const genresOk = genres.some(g => normalize(g).includes(needle))
    const yearOk   = String(m.year ?? '').includes(q.value.trim())
    const textOk   = !needle || titleOk || genresOk || yearOk

    const rangeOk =
      (yearFrom.value == null || (m.year ?? 0) >= yearFrom.value) &&
      (yearTo.value   == null || (m.year ?? 9999) <= yearTo.value)

    const genreFilterOk =
      !genresFilter.value.length ||
      genresFilter.value.every(g => genres.includes(g))

    return textOk && rangeOk && genreFilterOk
  })
})

function clearFilters() {
  q.value = ''
  genresFilter.value = []
  yearFrom.value = undefined
  yearTo.value = undefined
}

onMounted( async () =>{
  getMovies()
})

async function getMovies() {
  try {
    const resMovie = await api.get('/movieList')
    respMovie.value = resMovie.data
    if( respMovie.value.rc !== 0 ) {
      throw new Error(`Errore nella fetch utenti: ${respMovie.value.message}`);
    }
  } catch (err) {
    console.error('Errore fetch:', err)
  }
}

function openDelete(movie) {
  movieToDelete.value = movie;
  deleteDialog.value = true;
}

async function confirmDelete(id) {
  if(!id) return
  try{
  const {data} = await api.delete(`/movieList/${id}`)
  getMovies()
  if(!data){
    console.log('Movie not found', data)
  }
  console.log('Movie succesful deleted', data)
  }catch(err){
    console.error(err)
  }
}


async function openDetailsMovie(id){
  if(!id) return
  
  detail.value = null
  try{
    const {data} = await api.get(`/movieList/${id}`)
    detail.value = data?.data ?? data
    poster.value = detail.value?.poster
    console.log(poster)
    dialog.value = true
  }catch(err){
    console.error('errore nel recupero dei dettagli',err)
  }
}

</script>
<style scoped>

.modalContainer {
  padding: 16px;               
  border-radius: 16px;
}

.content {
  display: flex;
  gap: 16px;                    
  align-items: stretch;        
  max-height: 600px;           
}

.left {
  flex: 1 1 0;
  display: flex;
  flex-direction: column; 
  gap: 12px;
  min-width: 0;
}

.title {
  margin: 0 0 4px 0;
  font-size: 1.4rem;
  line-height: 1.2;
  font-weight: 700;
}

.meta {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 8px;
  align-items: start;
}

.label {
  color: rgba(223, 223, 223, 0.6);
  font-weight: 600;
}

.value {
  overflow: hidden;
  text-overflow: ellipsis;
}

.description p {
  margin: 4px 0 0 0;
  line-height: 1.45;
}

.updated {
  margin-top: auto;            
  display: block;
  color: rgba(239, 239, 239, 0.6);
  font-size: .8rem;
}


.right {
  width: 320px;                  
  max-width: 45%;
  display: flex;
  align-items: center;
}

.poster {
  width: 100%;
  aspect-ratio: 2 / 3;          
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,.08);
}
.actions {
  margin-top: auto;        
  justify-content: flex-start; 
  padding-left: 0;       
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