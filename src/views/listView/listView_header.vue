<template lang="pug">
.listView_header
  stack.header(
    gap="0 1rem"
  )
    template(v-slot:left)
      .backToHome
        button.text_style(
          @click="backToHome"
        ) #[i.las.la-angle-left]

    template(v-slot:right)
      .event_switch
        button.text_style(
        @click="$emit('switchViewPage', 'event')"
        :class="{'isViewing': viewing_page === 'event'}"
      ) #[i.las.la-info-circle]

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
  props: ['eventName', 'viewing_page'],
  components: {
    stack,
  },
  // computed: {},
  methods: {
    backToHome() {
      this.$router.push({ name: 'Home' });
    },
  },
};
</script>

<style lang="scss" scoped>
.listView_header {
  background-color: hsl(0, 0%, 96%);
  padding: 0.5rem;
}
.header {
  ::v-deep {
  }
}

.title {
  margin: 0;
  font-size: 1.4rem;
  max-width: calc(100vw - 10rem);
}

.backToHome,
.event_switch {
  button {
    position: relative;
    border-bottom: 2px solid transparent;
    font-size: 1.4rem;
    padding: 0.2rem 0.6rem;
    &.isViewing {
      border-color: saddlebrown;
      &::after {
        position: absolute;
        top: -0.2rem;
        right: -0.3rem;
        display: block;
        content: ' ';
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
        background-color: red;
      }
    }
  }
}
</style>
