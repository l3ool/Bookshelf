<script lang="ts" setup>
import type { Book } from "@/model/Book.ts";
import { ref } from 'vue';

const props = defineProps<{
  book: Book
}>();

const emit = defineEmits<{
  (e: 'select-book', book: Book): void;
}>();

const defaultCover = new URL('@/assets/no_poster.jpg', import.meta.url).href;

const imgSrc = ref(props.book.coverUrl || defaultCover);

function onError() {
  imgSrc.value = defaultCover;
}

function onClick() {
  emit('select-book', props.book);
}
</script>

<template>
  <div class="book-card" @click="onClick">
    <img :src="imgSrc" alt="cover" @error="onError" />
    <div class="info">
      <h3>{{ props.book.title }}</h3>
      <p class="author">{{ props.book.author }}</p>
      <p class="details">{{ props.book.year }} &mdash; {{ props.book.genre }}</p>
    </div>
  </div>
</template>

<style scoped>
.book-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  background: #1e1e2f;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7);
  cursor: pointer;
  transition: background-color 0.25s ease;
  user-select: none;
}

.book-card:hover {
  background: #2c2c44;
}

.book-card img {
  width: 100px;
  height: 140px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.6);
  flex-shrink: 0;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #ddd;
}

h3 {
  margin: 0;
  font-weight: 700;
  font-size: 1.2rem;
  color: #f0f0f0;
  line-height: 1.2;
}

.author {
  margin: 0.15rem 0 0.4rem 0;
  font-weight: 500;
  color: #a0a0b8;
  font-size: 0.9rem;
}

.details {
  font-size: 0.85rem;
  color: #80809a;
  letter-spacing: 0.02em;
}
</style>
