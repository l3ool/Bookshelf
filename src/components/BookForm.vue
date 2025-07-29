<script lang="ts" setup>
import { reactive, ref } from 'vue'
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

const fileInput = ref<HTMLInputElement | null>(null)
const errors = reactive({
  title: '',
  author: ''
})

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      book.coverUrl = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}

function validate(): boolean {
  errors.title = book.title.trim() ? '' : 'Název je povinný.'
  errors.author = book.author.trim() ? '' : 'Autor je povinný.'
  return !errors.title && !errors.author
}

function onSubmit() {
  if (validate()) {
    emit('add-book', { ...book })
    book.title = ''
    book.author = ''
    book.year = new Date().getFullYear()
    book.genre = ''
    book.coverUrl = ''
    if (fileInput.value) fileInput.value.value = ''
  }
}
</script>

<template>
  <v-form @submit.prevent="onSubmit" class="book-form">
    <div>
      <v-text-field
        label="Název knihy"
        v-model="book.title"
        :error-messages="errors.title"
        outlined
        class="input-field"
        required
      />
    </div>

    <div>
      <v-text-field
        label="Autor"
        v-model="book.author"
        :error-messages="errors.author"
        outlined
        class="input-field"
        required
      />
    </div>

    <v-text-field
      label="Rok vydání"
      type="number"
      v-model.number="book.year"
      min="0"
      outlined
      class="input-field"
    />

    <v-text-field
      label="Žánr"
      v-model="book.genre"
      outlined
      class="input-field"
    />

    <div class="file-upload">
      <label for="file-input" class="file-label">Nahrát obálku z počítače</label>
      <input
        id="file-input"
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="onFileChange"
        class="file-input"
      />
      <div v-if="book.coverUrl" class="preview-wrapper">
        <img :src="book.coverUrl" alt="Náhled obálky" class="preview-img" />
      </div>
    </div>

    <v-btn type="submit" color="primary" class="submit-btn">Přidat knihu</v-btn>
  </v-form>
</template>

<style scoped>
.book-form {
  padding: 1.5rem 2rem;
  border-radius: 12px;
  max-width: 600px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  color: #ddd;
}

.input-field >>> .v-input__control {
  background: #2c2c44;
  color: #ddd;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}


.file-upload {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-label {
  cursor: pointer;
  color: #ddd;
  font-weight: 400;
  font-size: medium;
  user-select: none;
  text-decoration: underline;
  max-width: max-content;
}

.file-input {
  display: none;
}

.preview-wrapper {
  max-width: 150px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0,0,0,0.7);
}

.preview-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

.submit-btn {
  align-self: flex-start;
  width: 150px;
  font-weight: 700;
  background: linear-gradient(135deg, #5561f2, #4e57d7);
  color: white;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #4e57d7, #5561f2);
}

</style>
