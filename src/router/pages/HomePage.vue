<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBooksStore } from "@/stores/books"
import BookForm from "@/components/BookForm.vue"
import BookCard from "@/components/BookCard.vue"
import TopBar from '@/components/TopBar.vue'
import type { Book } from "@/model/Book"

const booksStore = useBooksStore()
const router = useRouter()

const dialog = ref(false)
const searchTerm = ref('')
const genreFilter = ref<string | null>(null)
const authorFilter = ref('')

function addBook(newBook: Omit<Book, 'id'>) {
  const maxId = booksStore.books.reduce((max, b) => b.id > max ? b.id : max, 0)
  const bookWithId: Book = { ...newBook, id: maxId + 1 }
  booksStore.addBook(bookWithId)
  dialog.value = false
}

function onSelectBook(book: Book) {
  router.push({ name: 'BookDetail', params: { id: book.id } })
}

const filteredBooks = computed(() => {
  return booksStore.books.filter(book => {
    const matchesTitle = book.title.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesGenre = genreFilter.value ? book.genre.toLowerCase() === genreFilter.value.toLowerCase() : true
    const matchesAuthor = authorFilter.value ? book.author.toLowerCase().includes(authorFilter.value.toLowerCase()) : true

    return matchesTitle && matchesGenre && matchesAuthor
  })
})

const genres = ['History', 'Fiction', 'Sci-Fi', 'Biography', 'Fantasy']

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
          flat
        />
      </div>

      <div class="filter-group">
        <v-text-field
          v-model="authorFilter"
          placeholder="Autor"
          hide-details
          dense
          flat
          rounded
          solo
          clearable
          clear-icon="mdi-close-circle"
        />
        <v-select
          v-model="genreFilter"
          :items="genres"
          placeholder="Žánr"
          hide-details
          dense
          flat
          rounded
          solo
          clearable
          clear-icon="mdi-close-circle"
        />
      </div>
    </section>

    <section class="book-list">
      <div v-if="filteredBooks.length === 0" class="empty-msg">
        Žádné knihy neodpovídají zadaným kritériím.
      </div>

      <div class="grid">
        <BookCard
          v-for="book in filteredBooks"
          :key="book.id"
          :book="book"
          @select-book="onSelectBook"
        />
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
  padding: 2rem 3rem;
  color: #eee;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  user-select: none;
}

.header h1 {
  font-weight: 700;
  font-size: 2.25rem;
  letter-spacing: 0.04em;
  color: #f0f0f0;
}

.add-btn {
  background: linear-gradient(135deg, #5561f2, #4e57d7);
  color: white;
  padding: 0.6rem 1.6rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(85, 97, 242, 0.6);
  transition: background-color 0.3s ease;
}

.add-btn:hover {
  background: linear-gradient(135deg, #4e57d7, #5561f2);
}

.filters {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1rem;
}

.search-main {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.search-main .v-input {
  background: linear-gradient(135deg, #1e1e30, #2a2a44);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  border-radius: 18px;
  padding: 0.5rem 1.2rem;
  font-size: 1.2rem;
}

.search-main input {
  color: #f5f5f5;
  font-size: 1.2rem;
  letter-spacing: 0.03em;
}

.filter-group {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  justify-content: center;
  opacity: 0.85;
}

.filter-group .v-input {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  min-width: 200px;
  max-width: 300px;
  padding: 0.2rem 0.6rem;
  font-size: 0.9rem;
  color: #ccc;
  backdrop-filter: blur(6px);
}

.filter-group input,
.filter-group .v-select__selection-text {
  color: #ccc !important;
}

.filter-group .v-field__label {
  display: none;
}

.book-list {
  flex-grow: 1;
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
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
</style>
