<template lang="pug">
.listView
  h1.event_name {{ setting.config.event_name?.value || evName }}
  table.circle_list(:style="headerCssName")
    thead
      tr
        td {{ setting.header?.space }}
        td {{ setting.header?.circle_name }}
        td(v-if="setting.header?.description") {{ setting.header?.description }}
    tbody
      tr(v-for="circle in list[`day${view_day}`]")
        td.space {{ circle?.space }}
        td.circle_name(v-if="circle?.info_url") #[a(:href="circle.info_url" target="blank") {{ circle?.circle_name }}]
        td.circle_name(v-else) {{ circle?.circle_name }}
        td.description(v-if="setting.header?.description") {{ circle?.description }}

</template>

<script>
import { getSettings, getList } from '@/api/g-sheets';
import { mapMutations } from 'vuex';
import listView_header from './listView_header.vue';
import listView_footer from './listView_footer.vue';

export default {
  name: 'listView',
  props: ['evName', 'listId'],
  // setup() {},
  data() {
    return {
      setting: {
        header: {
          space: undefined,
          circle_name: undefined,
          info_url: undefined,
          description: undefined,
        },
        config: [],
        venue_map: [],
        custom: [],
      },
      list: {},
      view_day: '1',
    };
  },
  computed: {
    listName() {
      return this.setting.config.event_name?.value;
    },
    allNames() {
      let {
        config: { event_name, alias },
      } = this.setting;
      event_name = event_name ? event_name.value : '';
      alias = alias ? alias.value.split(',') : [];
      return [event_name, ...alias];
    },
    shortestName() {
      return this.allNames.reduce(
        (arr, cur) => (arr.length < cur.length ? arr : cur),
        this.allNames[0],
      );
    },
    isEvNameCurrect() {
      return this.allNames.includes(this.evName);
    },
    headerCssName() {
      return Object.entries(this.setting?.header || {}).reduce(
        (names, [var_name, display_name]) => {
          names[`--${var_name}`] = `'${display_name}'`;
          return names;
        },
        {},
      );
    },
  },
  methods: {
    ...mapMutations('app/', [
      'setHeader',
      'setFooter',
      'setHeaderSticky',
      'setFooterSticky',
    ]),
  },
  async created() {
    // 從網址夾帶的 id 讀取清單資料
    this.setting = await getSettings(this.listId);
    const { header, list } = await getList(this.listId);
    this.list = list;
    this.setting.header = header;
    // ff37
    // 1gN2jSRf_vha_NGzzZmo4eoRU0uB4EB5tRzSZfJWmhZM
    // ch10
    // 1vmI_o2mwvSgHRu971IheGiT_3lRBwWh_Mn6DKg1qvRE

    // 如果網址中的活動名與清單中的不合，會自動把網址換成最短的活動名
    if (!this.isEvNameCurrect) {
      this.$router.replace({
        name: 'listView',
        params: {
          evName: this.shortestName,
          listId: this.listId,
        },
      });
    }

    this.setHeader(listView_header);
    this.setHeaderSticky(true);
    this.setFooter(listView_footer);
    this.setFooterSticky(true);
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/_modules/_variables';
.event_name {
  font-size: 1.8rem;
}

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
