<template lang="pug">
router-view
</template>

<script>
// import { defineComponent } from '@vue/composition-api';
// import AppScaffold from '@/components/AppScaffold.vue';
// import { mapState } from 'vuex';

export default {
  name: 'home',
  // components: {},
  computed: {
    // ...mapState('app/', []),
  },
  // setup() {},
  created() {
    console.log('app created');
    document.querySelector('html').setAttribute('lang', 'zh-TW');
  },
};
</script>

<style lang="scss"></style>
