<template>
  <div class="app">
    <router-view />
  </div>
</template>

<style>
.app {
  background-color: #121222;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 2rem 10rem;
}

@media (max-width: 1000px) {
  .app{
    padding: 1.5rem;
  }
}
</style>
