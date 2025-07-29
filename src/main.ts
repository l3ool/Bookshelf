import { registerPlugins } from '@/plugins'
import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useBooksStore } from '@/stores/books'

const app = createApp(App)

registerPlugins(app)

const booksStore = useBooksStore()
booksStore.load()

app.mount('#app')

const loader = document.getElementById('app-loader')
if (loader) {
  loader.remove()
}
