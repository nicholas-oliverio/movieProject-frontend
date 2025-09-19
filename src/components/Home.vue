<template>
<!-- ---------------- -->
<!-- TABLE PRINCIPALE -->
<!-- ---------------- -->
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
        @click:clear="clearFilters"
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
          <v-btn  variant="tonal" class="mr-5" @click="openAdd">
            Add
          </v-btn>
          </div>
        </template>
        <v-card min-width="320">
          <v-card-text>
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

<!-- ---------------- -->
<!--    INFO MOVIE    -->
<!-- ---------------- -->
  </template>
   <template #item.action="{ item }">
    <v-btn size="small" @click="openDetailsMovie(item._id)">
      Info
    </v-btn>
  </template>
  </v-data-table>

<!-- ---------------- -->
<!---DIALOG INFO MOVIE-->
<!-- ---------------- -->

  <v-dialog v-model="dialog" max-width="800">
  <v-card class="modalContainer">
    <div class="content">
      <section class="left">
        <h2 class="title">{{ detail?.title }}</h2>
      <div class="meta" v-if="detail">
      <div class="label">Genres</div>
        <div class="value">
          Drama
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

                  <!---------------------------------->
                  <!--- CLOSE ---- EDIT ---- DELETE -->
                  <!---------- X INFO MOVIE ---------->

        <v-card-actions class="actions">
          <v-btn color="primary" variant="text" @click="dialog = false">
            Close
          </v-btn>
            <v-btn color="warning" variant="text" @click="openEdit(detail)">
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

<!-- ----------------- -->
<!--DELETE MOVIE DIALOG-->
<!-- ----------------- -->

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

<!-- --------------------------- -->
<!--    EDIT ADD MOVIE DIALOG    -->
<!-- --------------------------- -->

    <v-dialog v-model="formEditAddDialog" max-width="600">
    <v-card>
      <v-card-title>
        <span class="text-h6">
          {{ isNew ? 'Add Movie' : 'Edit Movie'}}
        </span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
        <input type="hidden" :value="editForm._id" />
        <v-text-field
          v-model="editForm.title"
          label="Title"
          clearable
          :rules="titleRules"
        />

        <v-text-field
          v-model="editForm.fullplot"
          label="Description"
          clearable
          :rules="fullplotRules"
        />
        <v-text-field
          v-model="editForm.year"
          label="Year"
          type="number"
          :rules="yearRules"
          clearable
        />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="formEditAddDialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="editConfirm()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
<!-- ----------------- -->
<!-- ----------------- -->

 <v-snackbar v-model="snackbar" color="red" timeout="3000">
  {{ snackbarMessage }}
</v-snackbar>

</template>



<script setup>
//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
//------------------------------         IMPORT        -----------------------------------
//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
import { ref, onMounted, computed,reactive } from 'vue'
import api from '@/axios'


//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
//------------------------------    CONST-VAR-ARRAY    -----------------------------------
//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------

//CONST HEADERS DATA TABLE KEY AND VALUE
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

const emptyMovie = () => ({
  _id: undefined,
  title: '',
  fullplot: '',
  year: '',
})
const editForm = reactive(emptyMovie())

const currentYear = new Date().getFullYear()
//RULES FOR V-TEXT
const form = ref(null)
async function isFormValid() {
  const res = form.value?.validate?.()
 
  if (res && typeof res.then === 'function') {
    const { valid } = await res
    return !!valid
  }
  return !!res
}
const snackbar = ref(false)
const snackbarMessage = ref('')
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
//CONST FOR POPULATE DATA TABLE WITHOUT FILTER
const movie = computed (() =>  respMovie.value?.data ?? [])

//CONST FOR POPULATE
const detail = ref(null)
const movieToDelete = ref(null);
const respMovie = ref(null)
const isNew = ref(false)
//CONST X OPEN DIALOG -- GENERAL INFO MOVIE --- DELETE CONFIRM --- EDIT AND ADD FORM ---
const dialog = ref(false)
const deleteDialog = ref(false);
const formEditAddDialog = ref(false);
//CONST X OPEN DIALOG FILTER
const filterMenu = ref(false)
//CONST FOR FILTER
const q = ref('')
const genresFilter = ref([])
const yearFrom = ref()
const yearTo   = ref()
const poster = ref('')


//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
//-----------------------          START FUNCTION-API       ------------------------------
//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------

//---------------
//FILTER FUNCTION
//---------------

const normalize = s => (s ?? '').toString().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

const filteredMovies = computed(() => {
  const needle = normalize(q.value)
  return movie.value.filter(m => {
    const titleOk  = normalize(m.title).includes(needle)
    const yearOk   = String(m.year ?? '').includes(q.value.trim())
    const textOk   = !needle || titleOk || yearOk

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
   getMovies()
}

onMounted( async () =>{
  getMovies()
})

//--------------------------------------------------------
//----API CRUD ( GET - DELETE - POST - PATCH ) -----------
//--------------------------------------------------------

//API GET FOR ALL MOVIES
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
//API GET FOR SINGLE MOVIE WITH ID
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

//API DELETE FOR SINGLE MOVIE
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

//API EDIT OR ADD FOR MOVIE LIST
async function openAdd() {
  isNew.value = true 
  Object.assign(editForm, emptyMovie())
  formEditAddDialog.value = true
}
async function openEdit(item) {
  if(!item._id) return
  isNew.value = false 
  formEditAddDialog.value = true
  console.log(item.year)
  fillForm(item)
}
function fillForm(item){
  editForm._id = item._id
  editForm.title = item.title
  editForm.fullplot = item.fullplot
  editForm.year = item.year

}
async function editConfirm() {
  try {
    const valid = await isFormValid()
    if (!valid) {
      snackbarMessage.value = 'Errore: controlla i campi prima di continuare'
      snackbar.value = true
      return
    }
    const payload = {
      title: editForm.title,
      fullplot: editForm.fullplot,
      year: editForm.year != null && editForm.year !== '' ? Number(editForm.year) : null,
    }
    if (isNew.value) {
      const { data } = await api.post(`/addMovie/`, payload)
      const created = data?.data ?? data
      detail.value = created
      formEditAddDialog.value = false
      dialog.value = true
      await getMovies()
    } else {
      const id = editForm._id
      if (!id) throw new Error('ID mancante per update')
      await api.patch(`/editMovie/${id}`, payload)
      if (dialog.value && detail.value?._id === id) {
        detail.value = { ...detail.value, ...payload }
      }
      formEditAddDialog.value = false
      await getMovies()
    }
  } catch (err) {
    console.error(err)
    snackbarMessage.value = err?.response?.data?.message || err?.message || 'Errore imprevisto'
    snackbar.value = true
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