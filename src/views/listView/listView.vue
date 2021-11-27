<template lang="pug">
AppScaffold.listView(
  mainBgColor="hsl(0, 0%, 94%)"
  mainMaxWidth="var(--app-max-width)"
  :isHeaderSticky="true"
  :isFooterSticky="true"
)
  template(v-slot:header)
    listView_header(
      :eventName="eventName"
      :viewing_page="viewing_page"
      @switchViewPage="switchViewPage"
    )

  template(v-slot:footer)
    listView_footer(
      :viewing_page="viewing_page"
      :viewing_list_name="viewing_list_name"
      :list_names="list_names"
      :hasMap="hasMap"
      @switchViewList="switchViewList"
      @switchViewPage="switchViewPage"
      @setListQuery="setListQuery"
    )

  template(v-if="isReady")
    circle_list_table(
      v-if="viewing_page === 'list'"
      :viewing_list_name="viewing_list_name"
      :viewing_list_data="viewing_list_data"
      :header="setting.header[viewing_list_name]"
      :list="list_search"
    )
    event_info(
      v-if="viewing_page === 'event'"
    )
    venue_maps(
      v-if="viewing_page === 'map'"
    )
  template(v-else)
    listView_loading(
      :isReady="isReady"
      :listId="listId"
      :sheet_url="sheet_url"
      :status="status"
    )
  

</template>

<script>
// import { getSettings, getList } from '@/api/g-sheets';
import { mapMutations, mapState, mapGetters, mapActions } from 'vuex';
import listView_loading from './listView_loading.vue';
import listView_header from './listView_header.vue';
import listView_footer from './listView_footer.vue';
import circle_list_table from './circle_list_table.vue';
import venue_maps from './venue_maps.vue';
import event_info from './event_info.vue';
import AppScaffold from '@/components/AppScaffold.vue';

export default {
  name: 'listView',
  props: ['evName', 'listId'],
  components: {
    AppScaffold,
    listView_loading,
    listView_header,
    listView_footer,
    circle_list_table,
    venue_maps,
    event_info,
  },
  // setup() {},
  // data() { return {}; },
  watch: {
    isReady: {
      // immediate: true,
      handler(isReady) {
        console.log('isReady', isReady);
        if (isReady) {
          const [firstList] = this.setting.list;
          // console.log('watch isReady', firstList.key);
          this.switchViewList(firstList.key);
        }
      },
    },
    shortestName: {
      // immediate: true,
      handler(shortName) {
        console.log('shortestName');
        if (shortName) {
          if (!this.isEvNameCurrect) {
            // 如果網址中的活動名與清單中的不合，會自動把網址換成最短的活動名
            this.$router.replace({
              name: 'listView',
              params: {
                evName: shortName,
                listId: this.listId,
              },
            });
            document.title =
              (this.setting.config?.event_name?.value || shortName) +
              ' | circleList';
          }
        }
      },
    },
  },
  computed: {
    ...mapState('viewing_list/', [
      'status',
      'setting',
      'list',
      'viewing_page',
      'viewing_list_name',
      'list_count',
    ]),
    ...mapGetters('viewing_list/', [
      'sheet_url',
      'eventName',
      'allNames',
      'shortestName',
      'list_search',
      'isReady',
      'sheet_url',
      'isEvNameCurrect',
      'list_names',
      'viewing_list_data',
      'hasMap',
    ]),
  },
  methods: {
    ...mapActions('viewing_list/', ['initFromListId']),
    ...mapMutations('viewing_list/', [
      'setStatus',
      'switchViewList',
      'switchViewPage',
      'setListQuery',
    ]),
    ...mapMutations('viewing_list/', ['resetState']),
    init() {
      this.initFromListId({
        listId: this.listId,
        evName: this.evName,
      });
    },
  },
  // ff37
  // 1gN2jSRf_vha_NGzzZmo4eoRU0uB4EB5tRzSZfJWmhZM
  // ch10
  // 1vmI_o2mwvSgHRu971IheGiT_3lRBwWh_Mn6DKg1qvRE
  // ffk14
  // 1NbL2YpuM8jLFDEf0Og_Gfk-kGzOTzJO08wqWrZEwmk0
  async created() {
    this.resetState();
    console.log('listView created');
  },
  mounted() {
    console.log('listView mounted');
    // 從網址夾帶的 id 讀取清單資料
    this.init();
  },
};
</script>
