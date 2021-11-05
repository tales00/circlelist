<template lang="pug">
AppScaffold(
  :mainBgColor="'hsl(0, 0%, 92%)'"
)
  template(v-slot:header)
    | HEADER
  router-view
</template>

<script>
// import { defineComponent } from '@vue/composition-api';
import AppScaffold from '@/components/AppScaffold.vue';

export default {
  name: 'home',
  components: {
    AppScaffold,
  },
  // setup() {},
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
