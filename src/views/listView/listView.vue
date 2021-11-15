<template lang="pug">
.listView
  h1.event_name {{ setting.config.event_name?.value || evName }}
  circle_list_table(
    :header="setting.header"
    :list="list[`day${view_day}`]"
  )
</template>

<script>
// import { getSettings, getList } from '@/api/g-sheets';
import { mapMutations, mapState, mapGetters, mapActions } from 'vuex';
import listView_header from './listView_header.vue';
import listView_footer from './listView_footer.vue';
import circle_list_table from './circle_list_table.vue';

export default {
  name: 'listView',
  props: ['evName', 'listId'],
  components: {
    circle_list_table,
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
    ...mapState('viewing_list/', ['setting', 'list', 'view_day']),
    ...mapGetters('viewing_list/', [
      'listName',
      'allNames',
      'shortestName',
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
  },
  // mounted() {},
};
</script>

<style lang="scss" scoped>
.event_name {
  font-size: 1.8rem;
}
</style>
