<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBooksStore } from '@/stores/books'
import BookForm from '@/components/BookForm.vue'
import BookCard from '@/components/BookCard.vue'
import TopBar from '@/components/TopBar.vue'
import type { Book } from '@/model/Book'
import { searchBooksOpenLibrary } from '@/api/bookApi'

const booksStore = useBooksStore()
const router = useRouter()

const dialog = ref(false)
const searchTerm = ref('')
const genreFilter = ref('')
const authorFilter = ref('')

const remoteBooks = ref<Book[]>([])
const isSearching = ref(false)
const currentPage = ref(1)
const hasMoreResults = ref(true)

// Combine books – first local, then remote
const allBooks = computed(() => [
  ...booksStore.books,
  ...remoteBooks.value
])

function addBook(newBook: Omit<Book, 'id'>) {
  const localBooks = booksStore.books.filter(b => typeof b.id === 'number')
  const maxId = localBooks.reduce((max, b) => (b.id as number) > max ? (b.id as number) : max, 0)
  const bookWithId: Book = { ...newBook, id: maxId + 1 }
  booksStore.addBook(bookWithId)
  dialog.value = false
}


function onSelectBook(book: Book) {
  console.log('Kliknuto na knihu:', book.id, 'external:', book.external)

  router.push({
    name: 'BookDetail',
    params: {
      id: String(book.id),
      // external vždy jako string 'true' nebo 'false' (pro debug)
      external: book.external ? 'true' : 'false'
    }
  })
}


const filteredBooks = computed(() => {
  return allBooks.value.filter(book => {
    const matchesTitle = book.title.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesGenre = genreFilter.value
      ? book.genre?.toLowerCase().includes(genreFilter.value.toLowerCase())
      : true
    const matchesAuthor = authorFilter.value
      ? book.author.toLowerCase().includes(authorFilter.value.toLowerCase())
      : true
    return matchesTitle && matchesGenre && matchesAuthor
  })
})

// Load books from API
async function loadBooksFromApi() {
  isSearching.value = true
  try {
    const results = await searchBooksOpenLibrary(searchTerm.value || 'book')

    const externalBooks = results.map((b: Book) => ({
      ...b,
      external: true
    }))

    console.log("Načtené knihy z API:", externalBooks) // pro ověření

    if (currentPage.value === 1) {
      remoteBooks.value = externalBooks
    } else {
      remoteBooks.value = [...remoteBooks.value, ...externalBooks]
    }

    hasMoreResults.value = results.length > 0
  } catch (e) {
    console.error('Chyba při načítání knih z Open Library', e)
  } finally {
    isSearching.value = false
  }
}


// Delay search input
let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(searchTerm, () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    currentPage.value = 1
    loadBooksFromApi()
  }, 500)
})

// initial load
onMounted(() => {
  loadBooksFromApi()
})

function loadNextPage() {
  if (isSearching.value || !hasMoreResults.value) return
  currentPage.value++
  loadBooksFromApi()
}

function openDialog() {
  dialog.value = true
}
</script>

<template>
  <v-container class="home-container" fluid>
    <TopBar @openDialog="openDialog" />

    <section class="filters">
      <div class="search-main">
        <v-text-field
          v-model="searchTerm"
          placeholder="Hledat knihy podle názvu..."
          prepend-inner-icon="mdi-magnify"
          hide-details
        />
      </div>

      <div class="filter-group">
        <v-text-field
          v-model="authorFilter"
          placeholder="Autor"
          hide-details
          dense
          clearable
          clear-icon="mdi-close-circle"
        />
        <v-text-field
          v-model="genreFilter"
          placeholder="Žánr"
          hide-details
          dense
          clearable
          clear-icon="mdi-close-circle"
        />
      </div>
    </section>

    <section class="book-list">
      <v-progress-circular
        v-if="isSearching"
        indeterminate
        color="primary"
        size="36"
        class="mx-auto mt-4"
      />

      <div v-if="filteredBooks.length === 0 && !isSearching" class="empty-msg">
        Žádné knihy neodpovídají zadaným kritériím.
      </div>

      <div class="grid">
        <BookCard
          v-for="book in filteredBooks"
          :key="`${book.id}-${book.external ? 'ext' : 'local'}`"
          :book="book"
          @select-book="onSelectBook"
        />
      </div>

      <div class="load-more-container" v-if="hasMoreResults && !isSearching">
        <v-btn @click="loadNextPage" color="primary" variant="flat">
          Načíst další
        </v-btn>
      </div>
    </section>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card class="dialog-card">
        <v-card-title class="dialog-title">Přidat novou knihu</v-card-title>
        <v-card-text>
          <BookForm @add-book="addBook" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false" color="#bbb">Zrušit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.home-container {
  background-color: #121222;
  min-height: 100vh;
  color: #eee;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem 1.5rem;
}

.filters {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1rem;
  width: 100%;
}

.search-main {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.search-main .v-input,
.filter-group .v-input {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: #ccc;
  backdrop-filter: blur(6px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7);
}

.filter-group {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  justify-content: center;
  opacity: 0.9;
  width: 100%;
  max-width: 500px;
}

.filter-group .v-input {
  flex: 1 1 240px;
  min-width: 200px;
}

.filter-group .v-field__label {
  display: none;
}

.book-list {
  flex-grow: 1;
  width: 100%;
}

.empty-msg {
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  margin-top: 2rem;
  color: #8889a0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
  width: 100%;
}

.dialog-card {
  background-color: #1f1f33;
  color: #eee;
  border-radius: 12px;
}

.dialog-title {
  font-weight: 700;
  font-size: 1.3rem;
  color: #eee;
  margin: 10px 0 0 10px;
}

.load-more-container{
  margin-top: 1rem;
}

@media (max-width: 900px) {
  .home-container {
    padding: 1rem;
    gap: 1.2rem;
  }

  .search-main,
  .filter-group {
    max-width: 100%;
  }

  .filter-group {
    height: 70px;
    gap: 1rem;
    margin-bottom: 80px;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .search-main .v-input,
  .filter-group .v-input {
    font-size: 0.95rem;
    padding: 0.4rem 0.8rem;
  }

  .dialog-title {
    font-size: 1.1rem;
  }
}

</style>
