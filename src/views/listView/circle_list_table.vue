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
    colgroup
      col.space
      col.circle_name
      col.description(v-if="header?.description")
      col.info_url(v-if="header?.info_url")

    thead
      tr
        td.space {{ header?.space }}
        td.circle_name {{ header?.circle_name }}
        td.description(v-if="header?.description") {{ header?.description }}
        td.info_url(v-if="header?.info_url") {{ header?.info_url }}
    tbody
      tr(v-for="circle in list")
        td.space {{ circle?.space }}
        td.circle_name {{ circle?.circle_name }}
        td.description(v-if="header?.description") {{ circle?.description }}
        td.info_url(v-if="header?.info_url") #[a(:href="circle.info_url" target="blank") Link]

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
.circle_list_table {
  width: calc(100% - 1rem);
  margin: 0 auto;

  tbody {
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
      &.circle_name {
        font-weight: bold;
      }
      &.description {
        font-size: 0.8rem;
      }
      &.info_url {
        a {
          display: block;
          border: 1px solid gray;
          border-radius: 0.3rem;
          text-align: center;
          padding: 0.2rem 0.6rem;
        }
      }
    }
  }
  &.view_in_table {
    colgroup col {
      &.space {
        width: 8rem;
      }
      &.circle_name {
        width: auto;
      }
      &.description {
        width: min-content;
      }
      &.info_url {
        width: 5rem;
      }
    }
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
      colgroup {
        display: none;
      }
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
        &.info_url {
          grid-area: info_url;
        }
      }
    }
    &.view_in_list {
      grid-template-columns: 1fr;
      tr {
        display: grid;
        grid-template-columns: minmax(6rem, auto) 1fr minmax(6rem, auto);
        grid-template-rows: auto auto;
        grid-template-areas:
          'space circle_name circle_name'
          'space description info_url';
      }
      td {
        &.space {
          // grid-area: space;
          border: 1px solid gray;
          border-radius: 0.3rem;
          align-self: flex-start;
          margin: 0.5rem;
          text-align: center;
        }
        &.circle_name {
          // grid-area: circle_name;
          font-size: 1.4rem;
          border-bottom: 1px solid gray;
          // font-weight: 600;
        }
        &.description {
          // grid-area: description;
          padding: 1rem 0;
        }
        &.info_url {
          align-self: center;
          justify-self: center;
        }
      }
    }

    &.view_in_grid {
      width: calc(100% - 1rem);
      margin: 0 auto;
      grid-template-columns: repeat(auto-fill, minmax(12.6rem, 1fr));
      gap: 1rem 0.4rem;
      tbody {
        display: contents;
      }
      tr {
        border: 0.1rem solid lightgray;
        border-left: 0.2rem solid gray;
        display: grid;
        grid-template-rows: auto auto 1fr auto;
        grid-template-areas:
          'circle_name'
          'space'
          'description'
          'info_url';

        td {
          &.space {
            font-size: 0.8rem;
            border: 1px solid gray;
            border-radius: 0.3rem;
            align-self: flex-start;
            padding: 0.2rem;
            margin: 0 0.4rem;
            text-align: center;
          }
          &.circle_name {
            padding: 0.6rem 0.4rem;
          }
          &.description {
            padding: 1rem 1rem;
          }
          &.info_url {
            border-top: 0.1rem solid lightgray;
            padding: 0.4rem;
            padding-bottom: 0.6rem;
            display: flex;
            justify-content: end;
          }
        }
      }
    }
  }
  // @media screen and (max-width: $max-mobile) {
  // }
}
</style>
