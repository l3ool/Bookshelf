import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw
} from "vue-router"

import HomePage from "@/router/pages/HomePage.vue";
import BookDetail from '@/router/pages/BookDetail.vue'


const routes = [
  { path: '/', name: 'Home', component: HomePage, },
  { path: '/book/:id', name: 'BookDetail', component: BookDetail, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});


export default router;
