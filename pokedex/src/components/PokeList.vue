<template>
    <div>
      <h1>Entities</h1>
      <ul>
        <li v-for="entity in entities" :key="entity.url">
          {{ entity.name }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        entities: [],
      };
    },
    mounted() {
      axios.get('https://pokeapi.co/api/v2/pokemon?limit=10')        
        .then((response) => {
          this.entities = response.data.results;          
        })
        .catch((error) => {
          console.log(error);
        });
    },
  };
  </script>
  