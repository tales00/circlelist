<template lang="pug">
.circle_list
  .circle_info
    h3 {{ viewing_list_data?.description || viewing_list_name }}
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
    caption {{ viewing_list_data?.description || viewing_list_name }}
    colgroup
      col.option
      col.space
      col.circle_name
      col.description(v-if="header?.description")
      col.info_url(v-if="header?.info_url")

    thead
      tr
        td.option
        td.space {{ header?.space }}
        td.circle_name {{ header?.circle_name }}
        td.description(v-if="header?.description") {{ header?.description }}
        td.info_url(v-if="header?.info_url") {{ header?.info_url }}
    tbody
      tr(v-for="circle in list")
        td.option
          .star
            button.text_style #[i.lar.la-star]
          .share
            button.text_style #[i.las.la-share]
        td.space {{ circle?.space }}
        td.circle_name {{ circle?.circle_name }}
        td.description(v-if="header?.description") {{ circle?.description }}

        td.info_url(v-if="header?.info_url") 
          a(:href="circle.info_url" target="blank")
            i.las.la-link
            span.link_text Link

</template>

<script>
export default {
  name: 'circle_list',
  props: ['viewing_list_name', 'viewing_list_data', 'header', 'list'],
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
@import '@/scss/_modules/_variables';

.list_view_mode_switch {
  display: flex;
  justify-content: flex-end;
  button {
    font-size: 2.5rem;
  }
}
.circle_list_table {
  width: calc(100% - 1rem);
  max-width: 100%;
  margin: 0 auto;

  transition: max-width, 0.2s 0.1s ease-out;

  caption {
    display: none;
  }

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
      // &.description {}
      &.option {
        .star,
        .share {
          margin-bottom: 1rem;
        }
        button {
          // border: 1px solid gray;
          border-radius: 0.3rem;
          text-align: center;
          padding: 0.3rem 0.4rem;
          background-color: transparent;
          font-size: 1.4rem;
        }
      }
      &.info_url {
        a {
          display: block;
          // border: 1px solid gray;
          border-radius: 0.3rem;
          text-align: center;
          padding: 0.2rem 0.4rem;
        }
      }
    }
  }
  &.view_in_table {
    max-width: 60rem;
    colgroup col {
      &.space {
        width: 5.5rem;
      }
      &.circle_name {
        width: auto;
      }
      &.description {
        width: auto;
      }
      &.option {
        width: 5rem;
        @media screen and (max-width: $size-sm - 1) {
          width: 3.5rem;
        }
      }
      &.info_url {
        width: 5rem;
        @media screen and (max-width: $size-sm - 1) {
          width: 3.5rem;
        }
      }
    }
    tbody td {
      // &.space { }
      // &.circle_name { }
      // &.description { }
      // &.option { }
      &.info_url {
        @media screen and (max-width: $size-sm - 1) {
          .link_text {
            display: none;
          }
        }
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
          display: flex;
          align-items: center;
        }
        &.description {
          grid-area: description;
        }
        &.option {
          display: contents;
          .star,
          .share {
            margin: 0;
          }
          .star {
            grid-area: star;
          }
          .share {
            grid-area: share;
          }
        }
        &.info_url {
          grid-area: info_url;
        }
      }
    }
    &.view_in_list {
      max-width: 50rem;
      grid-template-columns: 1fr;
      tr {
        display: grid;
        grid-template-columns: minmax(6rem, auto) 1fr repeat(2, 3rem);
        grid-template-rows: auto auto;
        grid-template-areas:
          'space circle_name star share'
          '...   description info_url info_url';
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
        &.option {
          .star,
          .share {
            border-bottom: 1px solid gray;
            display: flex;
            justify-content: center;
            align-items: center;
          }
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

      @media screen and (min-width: $min-wide) {
        max-width: 80rem;
      }

      gap: 1rem 0.4rem;

      tbody {
        display: contents;
      }
      tr {
        border: 0.1rem solid lightgray;
        border-left: 0.2rem solid gray;
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-rows: auto auto 1fr auto;
        grid-template-areas:
          'star circle_name'
          'space space'
          'description description'
          'share info_url';

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
            font-size: 0.9rem;
            padding: 1rem 1rem;
          }
          &.option {
            .star,
            .share {
              border-top: 0.1rem solid lightgray;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .star {
              padding: 0.6rem 0.4rem;
            }
            .share {
              padding: 0.4rem;
            }
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
