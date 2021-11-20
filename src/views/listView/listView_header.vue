<template lang="pug">
.listView_header
  h1.title {{ eventName }}
</template>

<script>
import {
  // mapMutations,
  // mapState,
  mapGetters,
  // mapActions ,
} from 'vuex';
export default {
  name: 'listView_header',
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
  background-color: hsl(0, 0%, 85%);
}
.title {
  margin: 0;
}
</style>
