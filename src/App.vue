<template lang="pug">
AppScaffold(
  mainBgColor="hsl(0, 0%, 94%)"
  mainMaxWidth="var(--app-max-width)"
  :isHeaderSticky="isHeaderSticky"
  :isFooterSticky="isFooterSticky"
)
  template(v-if="headerComponent" v-slot:header)
    component(:is="headerComponent")

  template(v-slot:footer)
    component(
      :is="footerComponent"
    )

  router-view
</template>

<script>
// import { defineComponent } from '@vue/composition-api';
import AppScaffold from '@/components/AppScaffold.vue';
import { mapState } from 'vuex';

export default {
  name: 'home',
  components: {
    AppScaffold,
  },
  computed: {
    ...mapState('app/', [
      'headerComponent',
      'footerComponent',
      'isHeaderSticky',
      'isFooterSticky',
    ]),
  },
  // setup() {},
  created() {
    console.log('app created');
    document.querySelector('html').setAttribute('lang', 'zh-TW');
  },
};
</script>

<style lang="scss"></style>
