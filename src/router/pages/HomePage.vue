<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBooksStore } from "@/stores/books";
import BookForm from "@/components/BookForm.vue";
import BookCard from "@/components/BookCard.vue";
import type { Book } from "@/model/Book.ts";

const booksStore = useBooksStore()
const router = useRouter()

const dialog = ref(false)
const searchTerm = ref('')    // pro hledání podle názvu knihy
const genreFilter = ref('')   // žánr
const authorFilter = ref('')  // autor

function addBook(newBook: Omit<Book, 'id'>) {
  const maxId = booksStore.books.reduce((max, b) => b.id > max ? b.id : max, 0)
  const bookWithId: Book = { ...newBook, id: maxId + 1 }
  booksStore.addBook(bookWithId)
  dialog.value = false
}

function removeBook(id: number) {
  booksStore.removeBook(id)
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
</script>

<template>
  <v-container>
    <v-row align="center" class="mb-4" dense>
      <v-col cols="12" sm="4" md="3">
        <v-text-field
          v-model="searchTerm"
          label="Hledat podle názvu"
          clearable
          clear-icon="mdi-close-circle"
          outlined
        />
      </v-col>

      <v-col cols="12" sm="4" md="3">
        <v-text-field
          v-model="authorFilter"
          label="Filtrovat podle autora"
          clearable
          clear-icon="mdi-close-circle"
          outlined
        />
      </v-col>

      <v-col cols="12" sm="4" md="3">
        <v-select
          v-model="genreFilter"
          :items="genres"
          label="Filtrovat podle žánru"
          clearable
          outlined
        />
      </v-col>

      <v-col cols="12" sm="12" md="3" class="d-flex justify-end">
        <v-btn color="primary" @click="dialog = true">
          Přidat novou knihu
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="book in filteredBooks"
        :key="book.id"
        cols="12"
        sm="6"
        md="4"
      >
        <BookCard
          :book="book"
          @remove-book="removeBook"
          @select-book="onSelectBook"
        />
      </v-col>
      <v-col v-if="filteredBooks.length === 0" cols="12">
        <p>Žádné knihy neodpovídají zadaným kritériím.</p>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>Přidat novou knihu</v-card-title>
        <v-card-text>
          <BookForm @add-book="addBook" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">Zrušit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
</style>
