<template>
  <v-data-table
  :headers="headers"
  :items="movies"  
  :items-per-page="30"
  :items-per-page-options="[ 30, 50 , 100 ]" 
  fixed-header
  fixed-footer        
  height="692px" 
  class="movie-table"
  >
  <template #top>
    <v-toolbar flat style="background-color: #212121; display:flex ; flex-direction: row; justify-content: space-between;">
      <v-toolbar-title>MOVIE LIST</v-toolbar-title>
      <v-spacer />
      <v-text-field
        v-model="searchName"
        @input="getMovies"
        density="compact"
        hide-details
        clearable
        placeholder="Search for title"
        prepend-inner-icon="mdi-magnify"
        class="mr-2"
        style="max-width: 300px"
      />
        <v-text-field
        v-model="searchYear"
        @input="getMovies"
        density="compact"
        hide-details
        clearable
        placeholder="Search for year"
        prepend-inner-icon="mdi-magnify"
        class="mr-2"
        style="max-width: 300px"
      />
      <v-btn  variant="tonal" class="mr-5" @click="openEditAdd()">
        Add
      </v-btn>
       <v-btn variant="tonal" class="mr-5" @click="getMovies()" >
       <v-icon >mdi-refresh</v-icon>
       </v-btn>

    </v-toolbar>

  </template>
    <template #item.action="{item}">
      <v-btn size="small" @click="getSingleMovie(item._id)">
        Info
      </v-btn>
    </template>
  </v-data-table>

  <DialogInfoMovie
    v-model="dialogInfo"     
    :movie="selectedMovie"
    @edit="openEditAdd"
    @delete="deleteMovie"
  />
  <DialogFormMovie
    v-model="dialogForm"
    :movie="selectedMovie"   
    :mode="titleForm"
    @save="saveMovie"
  />

</template>



<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import {api}  from '@/axios'
import DialogInfoMovie from './DialogInfoMovie.vue';
import DialogFormMovie from './DialogFormMovie.vue';

const headers = [
  { title: 'Title',  key: 'title',  width: '250px' },
  { title: 'Year',   key: 'year',   width: '100px', align: 'center' },
  { title: 'Action', key: 'action', sortable: false, width: '120px' },
]

const dialogInfo = ref(false);
const dialogForm = ref(false)
const movies = ref([]);    
const selectedMovie = ref(null);
const searchName = ref('')
const searchYear = ref('')
const searchGenres = ref('')
const titleForm = computed(() => (selectedMovie.value ? 'edit' : 'add'))
onMounted(getMovies)
 
async function getMovies() {
  try {
    const params = {
      name: searchName.value || undefined,
      year: searchYear.value || undefined,
      genres: Array.isArray(searchGenres.value)
        ? searchGenres.value.join(",")
        : searchGenres.value || undefined
    };

    const { data } = await api.get("/movies", { params });

    console.log("API.get /movies ->", data);

    if (data.rc !== 0) {
      throw new Error(`Error in fetch film: ${data.msg}`);
    }

    movies.value = Array.isArray(data.data) ? data.data : [];

  } catch (err) {
    console.error("Error fetch:", err);
  }
}

async function getSingleMovie(id){
  try {
    const {data} = await api.get('/movies', {params:{id}})
    if (data?.rc !== 0 || !data?.data) return
    selectedMovie.value = data.data 
    dialogInfo.value = true                                
    console.log('API.get /movies/id ->',data)
  } catch (err) {
    console.error('Error get :', err)
  }
}

async function openEditAdd(movie = null){
  dialogInfo.value = false     
  dialogForm.value = true     
  selectedMovie.value = movie || null
  console.log(selectedMovie.value)
  console.log('mode:', titleForm.value)
}

async function saveMovie(payload){
  try {
  if(!payload._id){
    const { data } = await api.post("/movies",payload) 
    console.log('API.post /movies/ ->',data)
  }else{
    const { data } = await api.patch(`/movies/${payload._id}`,payload)
    console.log('API.patch /movies/:id ->',data)
  }
  getMovies()
  }catch (err) {
  console.error('Error post/patch :', err)
  }
}

async function deleteMovie(id) {
  try {
    if (!id) return
    dialogInfo.value = false
    selectedMovie.value = null
    await nextTick()
    const { data } = await api.delete(`/movies/${id}`)
    if (data?.rc !== 0) throw new Error(data?.msg || 'Delete failed')

    await getMovies()              
    console.log('Movie deleted:', id, data)
  } catch (err) {
    console.error('Error delete:', err)
  }
}

</script>

<style>

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

.movie-table table {
  table-layout: fixed;      
}

.movie-table th,
.movie-table td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}


.movie-table th:nth-child(1),
.movie-table td:nth-child(1) { width: 250px; }

.movie-table th:nth-child(2),
.movie-table td:nth-child(2) { width: 100px; text-align: center; }

.movie-table th:nth-child(3),
.movie-table td:nth-child(3) { width: 120px; }

.col-title {
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.col-year {
  text-align: center;
  width: 100px;
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