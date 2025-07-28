<script lang="ts" setup>
import type { Book } from "@/model/Book.ts";

const props = defineProps<{
  book: Book
}>();

const emit = defineEmits<{
  (e: 'remove-book', id: number): void;
  (e: 'select-book', book: Book): void;
}>();

function remove() {
  emit('remove-book', props.book.id);
}

function onClick() {
  emit('select-book', props.book);
}
</script>

<template>
  <div class="book-card" @click="onClick" style="cursor: pointer;">
    <img :src="props.book.coverUrl" alt="cover" width="100" />
    <div>
      <h3>{{ props.book.title }}</h3>
      <p><strong>Autor:</strong> {{ props.book.author }}</p>
      <p><strong>Rok:</strong> {{ props.book.year }}</p>
      <p><strong>Žánr:</strong> {{ props.book.genre }}</p>
      <v-btn small color="error" @click.stop="remove">Smazat</v-btn>
    </div>
  </div>
</template>

<style scoped>
.book-card {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
