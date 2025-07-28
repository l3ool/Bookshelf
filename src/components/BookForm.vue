<script lang="ts" setup>
import { reactive, defineEmits } from 'vue'
import type { Book } from "@/model/Book.ts"

const emit = defineEmits<{
  (e: 'add-book', book: Omit<Book, 'id'>): void
}>()

const book = reactive<Omit<Book, 'id'>>({
  title: '',
  author: '',
  year: new Date().getFullYear(),
  genre: '',
  coverUrl: '',
})

function onSubmit() {
  if (book.title && book.author && book.year && book.genre) {
    emit('add-book', { ...book })
    book.title = ''
    book.author = ''
    book.year = new Date().getFullYear()
    book.genre = ''
    book.coverUrl = ''
  }
}
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-text-field
      label="Název knihy"
      v-model="book.title"
      required
    />
    <v-text-field
      label="Autor"
      v-model="book.author"
      required
    />
    <v-text-field
      label="Rok vydání"
      type="number"
      v-model.number="book.year"
      required
      min="0"
    />
    <v-text-field
      label="Žánr"
      v-model="book.genre"
      required
    />
    <v-text-field
      label="URL obálky"
      v-model="book.coverUrl"
      placeholder="https://..."
    />
    <v-btn type="submit" color="primary">Přidat knihu</v-btn>
  </v-form>
</template>
