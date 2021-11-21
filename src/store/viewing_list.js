import { getSettings, getList } from '@/api/g-sheets';
let default_state = () => ({
  evName: undefined,
  listId: undefined,
  status: {
    isLoading: false,
    isError: false,
    errorMessage: '',
  },
  setting: {
    header: {},
    config: [],
    list: {},
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
      return state.setting.list.map((_list) => _list.key);
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
        return list[viewing_list] || [];
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
    isReady(state) {
      const { isLoading, isError } = state.status;
      return !isLoading && !isError;
    },
    isEvNameCurrect(state, getters) {
      return getters.allNames.includes(state.evName);
    },
    hasMap(state) {
      return state.setting.venue_map.length;
    },
  },
  mutations: {
    setStatus(state, { name, code }) {
      if (name in state.status) {
        state.status[name] = code;
      }
    },
    setSetting(state, setting) {
      Object.keys(setting).forEach((settingKey) => {
        if (settingKey in state.setting) {
          // console.log('setSetting', {
          //   key: settingKey,
          //   value: setting[settingKey],
          // });
          state.setting[settingKey] = setting[settingKey];
        }
      });
    },
    addList(state, { name, listData }) {
      // console.log('addList', { name, listData });
      state.list[name] = listData;
    },
    switchViewPage(state, page_name) {
      // console.log('switchViewPage', page_name);
      state.viewing_page = page_name;
    },
    switchViewList(state, list_name) {
      state.viewing_page = 'list';
      state.viewing_list = list_name;
    },
    setListQuery(state, queryString = '') {
      state.list_queryString = queryString;
    },
  },
  actions: {
    async initFromListId({ commit, state }, { listId, evName }) {
      commit('setStatus', { name: 'isLoading', code: true });

      state.listId = listId;
      state.evName = evName;
      const setting = await getSettings(listId);
      commit('setSetting', setting);

      let header = {};
      if (setting.list.length) {
        setting.list.forEach(async (_listData) => {
          const { header: thisHeader, list: thisList } = await getList(
            listId,
            _listData.value,
          );
          commit('addList', { name: _listData.key, listData: thisList });
          header[_listData.key] = thisHeader;
        });
      } else {
        commit('setStatus', { name: 'isLoading', code: false });
        commit('setStatus', { name: 'isError', code: true });
        commit('setStatus', { name: 'errorMessage', code: 'no-list-setting' });
        return;
      }
      commit('setSetting', { header });

      commit('setStatus', { name: 'isLoading', code: false });
      commit('setStatus', { name: 'isError', code: false });
      commit('setStatus', { name: 'errorMessage', code: '' });
    },
  },
};
