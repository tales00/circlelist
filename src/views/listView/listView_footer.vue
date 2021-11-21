<template lang="pug">
.listView_footer
  .list_switch
    button.text_style(
      v-for="(list_name, idx) in list_names"
      @click="switchViewList(list_name)"
      :class="{'isViewing': viewing_page === 'list' && viewing_list===list_name}"
      :style="{'--list_count': `'${idx+1}'`, '--list_name': `'${list_name}'` }"
    ) 
      i.las.la-list-ul
  .search_bar
    input(@keyup="onSearchInput")
  .map_switch
    button.text_style(
      v-if="hasMap"
      @click="switchViewPage('map')"
      :class="{'isViewing': viewing_page === 'map'}"
    ) #[i.las.la-map]
</template>

<script>
import {
  // mapMutations,
  mapState,
  mapGetters,
  mapMutations,
  // mapActions ,
} from 'vuex';

export default {
  name: 'listView_footer',
  // setup() {},
  computed: {
    ...mapState('viewing_list/', ['viewing_page', 'viewing_list']),
    ...mapGetters('viewing_list/', ['list_names', 'hasMap']),
  },
  methods: {
    ...mapMutations('viewing_list/', [
      'switchViewList',
      'switchViewPage',
      'setListQuery',
    ]),
    onSearchInput(ev) {
      // console.log('setListQuery', ev.target.value);
      this.setListQuery(ev.target.value);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/_modules/_variables';

.listView_footer {
  color: var(--text-main);
  background-color: hsl(0, 0%, 96%);
  // border-top: 1px solid hsl(0, 0%, 80%);
  padding: 0.5rem 1rem;

  display: flex;
  gap: 1rem;
  align-items: center;
}

.search_bar {
  flex-grow: 1;
  display: flex;
  input {
    flex-grow: 1;
  }
}

.list_switch,
.map_switch {
  button {
    // aspect-ratio: 1/1;
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

.list_switch {
  display: flex;
  gap: 0.5rem;

  button {
    .las {
      display: none;
    }
    &::before {
      content: var(--list_count);
    }
    .list_name {
      display: none;
    }
  }
  @media screen and (min-width: $min-tablet) {
    gap: 1rem;
    // margin-right: 3rem;
    // transform-origin: bottom left;
    // transform: scale(1.4) translateY(-0.3rem);

    button {
      // background-color: ghostwhite;
      // border-color: hsl(0, 0%, 80%);
      // border-radius: 0.5rem;
      padding-top: 0.4rem;
      // padding-right: 0.6rem;
      // padding-left: 0.6rem;
      padding-bottom: 0;

      .las {
        display: inline-block;
      }
      &::before {
        content: var(--list_name);
        position: absolute;
        display: block;
        font-size: 0.6rem;
        top: -0.15rem;
        left: 0;
        padding: 0.1rem 0.2rem;
        // background-color: ghostwhite;
        transform: translateY(-0.2rem);
      }
    }
  }
}
</style>
