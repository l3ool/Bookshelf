<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { useBooksStore } from '@/stores/books'
import { computed } from 'vue'
import type { Book } from '@/model/Book.ts'

const route = useRoute()
const router = useRouter()
const booksStore = useBooksStore()

const bookId = Number(route.params.id)

const book = computed<Book | undefined>(() => {
  return booksStore.books.find(b => b.id === bookId)
})

function goBack() {
  router.back()
}
</script>

<template>
  <v-container>
    <v-btn text @click="goBack">← Zpět</v-btn>

    <div v-if="book">
      <v-card>
        <v-card-title>{{ book.title }}</v-card-title>
        <v-card-text>
          <p><strong>Autor:</strong> {{ book.author }}</p>
          <p><strong>Rok:</strong> {{ book.year }}</p>
          <p><strong>Žánr:</strong> {{ book.genre }}</p>
          <p><strong>Obálka:</strong></p>
          <img :src="book.coverUrl" alt="cover" width="200" />
        </v-card-text>
      </v-card>
    </div>
    <div v-else>
      <p>Kniha nebyla nalezena.</p>
    </div>
  </v-container>
</template>
