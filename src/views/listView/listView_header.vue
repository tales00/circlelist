<template lang="pug">
.listView_header
  stack.header(
    gap="0 1rem"
  )
    template(v-slot:left)
      button.text_style #[i.las.la-angle-left.la-2x]
    template(v-slot:right)
      button.text_style #[i.las.la-info-circle.la-2x]

    h1.title.ellipsis {{ eventName }}
</template>

<script>
// import {
//   // mapMutations,
//   // mapState,
//   // mapGetters,
//   // mapActions ,
// } from 'vuex';
import stack from '@/components/Stack.vue';
export default {
  name: 'listView_header',
  props: ['eventName'],
  components: {
    stack,
  },
  // computed: {},
};
</script>

<style lang="scss" scoped>
.listView_header {
  background-color: hsl(0, 0%, 96%);
  padding: 0.5rem;
}

.header {
}

.title {
  margin: 0;
  font-size: 1.4rem;
  max-width: calc(100vw - 10rem);
}
</style>
