<template lang="pug">
.listView
  circle_list_table(
    v-if="viewing_page === 'list'"
    :header="setting.header"
    :list="list_search"
  )
  venue_maps(
    v-if="viewing_page === 'map'"
  )

</template>

<script>
// import { getSettings, getList } from '@/api/g-sheets';
import { mapMutations, mapState, mapGetters, mapActions } from 'vuex';
import listView_header from './listView_header.vue';
import listView_footer from './listView_footer.vue';
import circle_list_table from './circle_list_table.vue';
import venue_maps from './venue_maps.vue';

export default {
  name: 'listView',
  props: ['evName', 'listId'],
  components: {
    circle_list_table,
    venue_maps,
    // listView_header,
    // listView_footer,
  },
  // setup() {},
  // data() { return {}; },
  watch: {
    shortestName: {
      // immediate: true,
      handler(shortName) {
        console.log('shortestName');
        if (shortName) {
          this.init();
          if (!this.isEvNameCurrect) {
            // 如果網址中的活動名與清單中的不合，會自動把網址換成最短的活動名
            this.$router.replace({
              name: 'listView',
              params: {
                evName: shortName,
                listId: this.listId,
              },
            });
          }
        }
      },
    },
  },
  computed: {
    ...mapState('viewing_list/', [
      'setting',
      'list',
      'viewing_page',
      'viewing_list',
    ]),
    ...mapGetters('viewing_list/', [
      'eventName',
      'allNames',
      'shortestName',
      'list_search',
      'isEvNameCurrect',
    ]),
  },
  methods: {
    ...mapActions('viewing_list/', ['initFromListId']),
    ...mapMutations('app/', [
      'resetApp',
      'setHeader',
      'setFooter',
      'setHeaderSticky',
      'setFooterSticky',
    ]),
    init() {
      this.setHeader(listView_header);
      this.setHeaderSticky(true);
      this.setFooter(listView_footer);
      this.setFooterSticky(true);
    },
  },
  async created() {
    this.resetApp();
    // 從網址夾帶的 id 讀取清單資料
    this.initFromListId({
      listId: this.listId,
      evName: this.evName,
    });
    // ff37
    // 1gN2jSRf_vha_NGzzZmo4eoRU0uB4EB5tRzSZfJWmhZM
    // ch10
    // 1vmI_o2mwvSgHRu971IheGiT_3lRBwWh_Mn6DKg1qvRE
    // ffk14
    // 1NbL2YpuM8jLFDEf0Og_Gfk-kGzOTzJO08wqWrZEwmk0
  },
  // mounted() {},
};
</script>

<style lang="scss" scoped>
.event_name {
  font-size: 1.8rem;
}
</style>
