<template>
  <div id="app">
    <NavBar />
    <!-- <Home /> -->
    <router-view />
  </div>
</template>

<script>
// import Home from './components/Home.vue'
import NavBar from './components/NavBar.vue'

export default {
  name: 'App',
  components: {
    NavBar,
    // Home,
  }
}
</script>

<style>
/* @import './assets/normalize.css';
@import './assets/skeleton.css'; */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
