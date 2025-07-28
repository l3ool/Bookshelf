import { registerPlugins } from '@/plugins'
import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useBooksStore } from '@/stores/books'

const app = createApp(App)

registerPlugins(app)

// Načti data ze store před mountem
const booksStore = useBooksStore()
booksStore.load()

// Mount aplikace
app.mount('#app')

// Odeber loader
const loader = document.getElementById('app-loader')
if (loader) {
  loader.remove()
}
