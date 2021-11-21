<template lang="pug">
.listView_header
  stack
    h1.title.ellipsis {{ eventName }}
</template>

<script>
import {
  // mapMutations,
  // mapState,
  mapGetters,
  // mapActions ,
} from 'vuex';
import stack from '@/components/Stack.vue';
export default {
  name: 'listView_header',
  components: {
    stack,
  },
  computed: {
    ...mapGetters('viewing_list/', [
      'eventName',
      'allNames',
      'shortestName',
      'isEvNameCurrect',
    ]),
  },
};
</script>

<style lang="scss" scoped>
.listView_header {
  background-color: hsl(0, 0%, 96%);
}
.title {
  margin: 0;
  font-size: 1.4rem;
  max-width: calc(100vw - 4rem);
}
</style>
