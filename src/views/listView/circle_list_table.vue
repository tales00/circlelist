<template lang="pug">
table.circle_list(:style="headerCssName")
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
  props: ['header', 'list'],
  // setup() {},
  computed: {
    headerCssName() {
      return Object.entries(this?.header || {}).reduce(
        (names, [var_name, display_name]) => {
          names[`--${var_name}`] = `'${display_name}'`;
          return names;
        },
        {},
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/_modules/_variables';
@supports (display: contents) {
  .circle_list {
    display: grid;
    // grid-template-columns: auto 1fr auto;
    // thead,
    // tbody,
    // tr {
    //   display: contents;
    // }
  }
  // @media screen and (max-width: $max-mobile) {
  .circle_list {
    // display: grid;
    grid-template-columns: 1fr;
    thead {
      display: none;
    }
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
  // }
}
</style>
