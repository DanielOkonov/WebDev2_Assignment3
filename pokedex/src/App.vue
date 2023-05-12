<template>
  <!-- <div id="app">
    <entity-list></entity-list>
  </div> -->
  <PokeList/>
</template>

<script>
import PokeList from './components/PokeList.vue';

export default {
  name: 'App',
  components: {
    PokeList,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
