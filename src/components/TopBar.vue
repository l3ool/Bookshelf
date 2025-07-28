<script setup lang="ts">
import { defineEmits } from 'vue'

const emits = defineEmits(['openDialog'])

function onAddClick() {
  emits('openDialog')
}
</script>

<template>
  <header class="topbar">
    <router-link :to="{ name: 'Home' }" class="logo-link" aria-label="Home">
      <v-icon class="logo-icon" size="36">mdi-book-open-page-variant</v-icon>
      <span class="logo-text">Bookshelf</span>
    </router-link>

    <v-btn
      color="primary"
      class="add-btn"
      elevation="2"
      rounded
      @click="onAddClick"
    >
      Přidat novou knihu
    </v-btn>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  user-select: none;
  padding: 0 1rem;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
}

.logo-icon {
  color: #f0f0f0;
  margin-right: 0.5rem;
}

.logo-text {
  font-weight: 700;
  font-size: 2.25rem;
  letter-spacing: 0.04em;
  color: #f0f0f0;
}

.add-btn {
  display: flex;
  padding: 20px 32px;
  border-radius: 20px;
  background: transparent !important;
  border: 2.5px solid #ff9e3b;
  color: #ff9e3b !important;
  font-weight: 800;
  letter-spacing: 0.05em;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: none;
  transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
  align-items: center;
  user-select: none;
}

.add-btn:hover {
  background: #ff9e3b !important;
  color: #222 !important;
  box-shadow: 0 4px 16px rgba(255, 158, 59, 0.6);
}

</style>
