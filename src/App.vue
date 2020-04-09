<template>
  <v-app>
    <v-content>
      <ToDoList/>
    </v-content>
  </v-app>
</template>

<script>
import ToDoList from './components/ToDoList';

export default {
  name: 'App',

  components: {
    ToDoList,
  },

  data: () => ({
    //
  }),
};
</script>
