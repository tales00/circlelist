<template lang="pug">
.circle_list
  .circle_info
    h3 {{ viewing_list }}
  .list_view_mode_switch
    button.text_style(
      @click="switch_view_mode('list')"
    )
      i.las.la-list
    button.text_style(
      @click="switch_view_mode('grid')"
    )
      i.las.la-grip-horizontal
    button.text_style(
      @click="switch_view_mode('table')"
    )
      i.las.la-th-list
  table.circle_list_table(
    :class="['view_in_'+view_mode]"
    :style="headerCssName"
  )
    thead
      tr
        td {{ header?.space }}
        td {{ header?.circle_name }}
        td(v-if="header?.description") {{ header?.description }}
    tbody
      tr(v-for="circle in list")
        td.space {{ circle?.space }}
        td.circle_name(v-if="circle?.info_url") #[a(:href="circle.info_url" target="blank") {{ circle?.circle_name }}]
        td.circle_name(v-else) {{ circle?.circle_name }}
        td.description(v-if="header?.description") {{ circle?.description }}

</template>

<script>
export default {
  name: 'circle_list',
  props: ['viewing_list', 'header', 'list'],
  // setup() {},
  data() {
    return {
      view_mode: 'list',
    };
  },
  // watch: {
  //   'list.length': {
  //     handler(length) {
  //       console.log('list.length', length);
  //     },
  //   },
  // },
  computed: {
    headerCssName() {
      return Object.entries(this?.header || {}).reduce(
        (names, [var_name, display_name]) => {
          if (display_name) {
            names[`--${var_name}`] = `'${display_name}'`;
          }
          return names;
        },
        {},
      );
    },
  },
  methods: {
    switch_view_mode(mode) {
      if (['list', 'grid', 'table'].includes(mode)) {
        this.view_mode = mode;
      }
    },
  },

  //
  // created() {
  //   console.log('table created');
  // },
  // mounted() {
  //   console.log('table mounted');
  // },
};
</script>

<style lang="scss" scoped>
// @import '@/scss/_modules/_variables';
.list_view_mode_switch {
  display: flex;
  justify-content: flex-end;
  button {
    font-size: 2.5rem;
  }
}

@supports (display: contents) {
  .circle_list_table {
    // display: grid;
    // grid-template-columns: auto 1fr auto;
    // thead,
    // tbody,
    // tr {
    //   display: contents;
    // }
    &.view_in_list,
    &.view_in_grid {
      display: grid;
      thead {
        display: none;
      }
      td {
        &.space {
          grid-area: space;
        }
        &.circle_name {
          grid-area: circle_name;
        }
        &.description {
          grid-area: description;
        }
      }
    }
    &.view_in_list {
      grid-template-columns: 1fr;
      tr {
        display: grid;
        grid-template-columns: minmax(6rem, auto) 1fr;
        grid-template-rows: auto auto;
        grid-template-areas:
          'space circle_name'
          'space description';
      }
      td {
        // &.space::before {
        //   display: inline;
        //   content: var(--space);
        //   font-size: 0.8rem;
        // }
        // &.circle_name::before {
        //   display: block;
        //   content: var(--circle_name);
        // }
        // &.description::before {
        //   display: block;
        //   content: var(--description);
        // }
        &.space {
          grid-area: space;
          border: 1px solid gray;
          border-radius: 0.3rem;
          align-self: flex-start;
          margin: 0.5rem;
          text-align: center;
        }
        &.circle_name {
          grid-area: circle_name;
          font-size: 1.4rem;
          border-bottom: 1px solid gray;
          font-weight: 600;
        }
        &.description {
          grid-area: description;
          padding: 1rem 0;
        }
      }
    }

    &.view_in_grid {
      grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
      gap: 1rem;
      tbody {
        display: contents;
      }
      tr {
        display: grid;
        grid-template-areas:
          'circle_name'
          'space'
          'description';
      }
    }
  }
  // @media screen and (max-width: $max-mobile) {
  // }
}
</style>
