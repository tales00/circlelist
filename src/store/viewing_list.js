import { getSettings, getList } from '@/api/g-sheets';
let default_state = () => ({
  evName: undefined,
  listId: undefined,
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
  list_queryString: '',
  viewing_list: '',
  viewing_page: '',
});
export default {
  namespaced: true,
  state: default_state(),
  getters: {
    eventName(state, getters) {
      return (
        state.setting.config.event_name?.value ||
        getters?.shortestName ||
        state.evName
      );
    },
    allNames(state) {
      let {
        config: { event_name, alias },
      } = state.setting;
      event_name = event_name ? event_name.value : '';
      alias = alias ? alias.value.split(',') : [];
      return [event_name, ...alias];
    },
    shortestName(state, getters) {
      return getters.allNames.reduce(
        (arr, cur) => (arr.length < cur.length ? arr : cur),
        getters.allNames[0],
      );
    },
    list_names(state) {
      return Object.keys(state.list);
    },
    list_search(state) {
      const { list, viewing_list } = state;
      let { list_queryString: queryString } = state;
      if (
        !queryString ||
        queryString === ':' ||
        queryString === '?' ||
        queryString === 'url:'
      ) {
        return list[viewing_list];
      }

      queryString = queryString.toLowerCase();

      if (queryString.startsWith(':')) {
        queryString = queryString.slice(1);
        // console.log('space search', queryString);
        return list[viewing_list].filter((circle) => {
          return circle.space?.toLowerCase().includes(queryString);
        });
      }

      if (queryString.startsWith('?')) {
        queryString = queryString.slice(1);
        // console.log('name/description search', queryString);
        return list[viewing_list].filter((circle) => {
          const { circle_name, description } = circle;
          return (
            circle_name?.toLowerCase().includes(queryString) ||
            description?.toLowerCase().includes(queryString)
          );
        });
      }

      if (queryString.startsWith('url:')) {
        queryString = queryString.slice(1);
        // console.log('name/description search', queryString);
        return list[viewing_list].filter((circle) => {
          return circle.info_url?.toLowerCase().includes(queryString);
        });
      }

      return list[viewing_list].filter((circle) => {
        // console.log('normal search', queryString);
        const { space, circle_name, description } = circle;
        return (
          space?.toLowerCase().includes(queryString) ||
          circle_name?.toLowerCase().includes(queryString) ||
          description?.toLowerCase().includes(queryString)
        );
      });
    },
    isEvNameCurrect(state, getters) {
      return getters.allNames.includes(state.evName);
    },
    hasMap(state) {
      return state.setting.venue_map.length;
    },
  },
  mutations: {
    setListData(state, { setting, list }) {
      Object.keys(state.setting).forEach((settingKey) => {
        state.setting[settingKey] = setting[settingKey];
      });
      state.list = list;
    },
    switchViewPage(state, page_name) {
      state.viewing_page = page_name;
    },
    switchViewList(state, list_name) {
      if (list_name in state.list) {
        state.viewing_page = 'list';
        state.viewing_list = list_name;
      }
    },
    setListQuery(state, queryString = '') {
      state.list_queryString = queryString;
    },
  },
  actions: {
    async initFromListId({ commit, state }, { listId, evName }) {
      state.listId = listId;
      state.evName = evName;
      const setting = await getSettings(listId);
      const { header, list } = await getList(listId);

      // todo
      // check if list is empty

      commit('setListData', {
        setting: {
          header,
          ...setting,
        },
        list,
      });

      const [firstListName] = Object.keys(list);
      state.viewing_list = firstListName;
      state.viewing_page = 'list';
    },
  },
};
