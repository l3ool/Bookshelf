import {defineStore} from "pinia";
import type {Book} from "@/model/Book.ts";

const STORAGE_KEY = 'bookshelf-books'

export const useBooksStore = defineStore('books', {
  state: () => ({
    books: [] as Book[],
  }),
  actions: {
    addBook(book: Book) {
      this.books.push(book)
      this.save()
    },
    removeBook(id: number) {
      this.books = this.books.filter(b => b.id !== id)
      this.save()
    },
    save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.books))
    },
    load() {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        this.books = JSON.parse(data)
      }
    }
  }
})
