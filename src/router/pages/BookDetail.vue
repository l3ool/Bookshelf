<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { useBooksStore } from '@/stores/books'
import { onMounted, ref } from 'vue'

import TopBar from '@/components/TopBar.vue'
import BookForm from "@/components/BookForm.vue"
import type { Book } from "@/model/Book.ts"
import { fetchBookDetailFromOpenLibrary } from '@/api/bookApi'

const route = useRoute()
const router = useRouter()
const booksStore = useBooksStore()
const dialog = ref(false)

const defaultCover = new URL('@/assets/no_poster.jpg', import.meta.url).href

const bookId = route.params.id as string
const isExternal = route.params.external === 'true'

const book = ref<Book | null>(null)
const loading = ref(true)  // loader stav

function onImageLoad() {
  loading.value = false
}

function onImageError() {
  loading.value = false
}

onMounted(async () => {
  console.log('Parametry routy:', route.params)

  const bookId = route.params.id as string
  const isExternal = route.params.external === 'true'
  console.log('bookId:', bookId, 'isExternal:', isExternal)

  if (isExternal) {
    try {
      const result = await fetchBookDetailFromOpenLibrary(bookId)
      console.log('Načtený externí detail:', result)
      book.value = { ...result, external: true }
    } catch (e) {
      console.error('Chyba při načtení externí knihy', e)
      router.push({ name: 'Home' })
    }
  } else {
    const found = booksStore.books.find(b => String(b.id) === bookId)
    console.log('Nalezená lokální kniha:', found)
    if (!found) {
      router.push({ name: 'Home' })
    } else {
      book.value = found
    }
  }
})

function removeBook() {
  if (book.value && !isExternal) {
    booksStore.removeBook(book.value.id)
    router.push({ name: 'Home' })
  }
}

function addBook(newBook: Omit<Book, 'id'>) {
  const localBooks = booksStore.books.filter(b => typeof b.id === 'number')
  const maxId = localBooks.reduce((max, b) => (b.id as number) > max ? (b.id as number) : max, 0)
  const bookWithId: Book = { ...newBook, id: maxId + 1 }
  booksStore.addBook(bookWithId)
  dialog.value = false
}

function openDialog() {
  dialog.value = true
}
</script>

<template>
  <v-container fluid class="page-container">
    <TopBar @openDialog="openDialog" />

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

    <v-container v-if="book" class="book-detail" fluid>
      <v-row class="row-container" align="center" justify="center">
        <v-col cols="12" md="5" class="cover-col">
          <div style="position: relative; width: 100%; aspect-ratio: 2 / 3;">
            <img
              :src="book.coverUrl || defaultCover"
              alt="cover"
              class="cover-img"
              :class="{ 'hidden-img': loading }"
              @load="onImageLoad"
              @error="onImageError"
            />
            <div v-if="loading" class="loader">
              <div class="spinner"></div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="7" class="info-col">
          <h1 class="title">{{ book.title }}</h1>

          <p><strong>Autor:</strong> <span class="info-text">{{ book.author }}</span></p>
          <p><strong>Rok vydání:</strong> <span class="info-text">{{ book.year }}</span></p>
          <p>
            <strong>Žánr:</strong>
            <span
              class="genre"
              v-for="(g, i) in book.genre.split(',')"
              :key="i"
            >{{ g.trim() }}</span>
          </p>

          <v-btn
            v-if="!isExternal"
            color="error"
            class="delete-btn"
            @click="removeBook"
            elevation="2"
            rounded
          >
            Smazat knihu
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
}

.book-detail {
  background-color: #1e1e3f;
  padding: 2.5rem 3rem;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(18, 18, 34, 0.8);
  max-width: 1200px;
  margin: 3rem auto;
  color: #cfd8dc;
  display: flex;
  flex-direction: column;
}

.row-container {
  display: flex;
  flex-wrap: wrap;
  gap: 48px;
  align-items: center;
  justify-content: center;
}

.cover-col {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 400px;
  width: 100%;
  margin-bottom: 2rem;
  position: relative;
}

.cover-img {
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(33, 33, 66, 0.6);
  transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
}

.cover-img:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 32px rgba(85, 97, 242, 0.8);
}

.hidden-img {
  opacity: 0;
  pointer-events: none;
  user-select: none;
}

.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top: 4px solid #5561f2;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #e0e6f8; /* světle modrá */
}

.title {
  font-size: 2.8rem;
  font-weight: 900;
  margin-bottom: 1.2rem;
  letter-spacing: 0.06em;
  color: #ffffff; /* výrazná modrá */
  text-shadow: 0 0 6px rgba(85, 97, 242, 0.8);
}

p {
  font-size: 1.15rem;
  margin-bottom: 0.8rem;
  color: #b0bec5; /* jemně modrošedá */
}

strong {
  color: #ff9e3b; /* sytá oranžová */
  font-weight: 700;
  margin-right: 0.4rem;
}

.delete-btn {
  display: flex;
  margin-top: 2.5rem;
  padding: 20px 32px;
  border-radius: 20px;
  background: transparent !important;
  border: 2.5px solid #ff4c4c;
  color: #ff4c4c !important;
  font-weight: 800;
  letter-spacing: 0.05em;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: none;
  transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
  align-self: flex-start;
  user-select: none;
}

.delete-btn:hover {
  background: #ff4c4c !important;
  color: #222 !important;
  box-shadow: 0 4px 16px rgba(255, 76, 76, 0.6);
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

@media (max-width: 900px) {
  .row-container {
    flex-direction: column;
    gap: 10px;
  }
  .cover-col {
    max-width: 100%;
    margin-bottom: 1.5rem;
  }
  .title {
    font-size: 2.2rem;
  }
  .delete-btn {
    width: 100%;
    text-align: center;
    align-self: center;
  }
}
</style>
