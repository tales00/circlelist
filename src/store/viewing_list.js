import { getSettings, getList } from '@/api/g-sheets';

export default {
  namespaced: true,
  state: {
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
    view_day: '1',
  },
  getters: {
    listName(state) {
      return state.setting.config.event_name?.value;
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
    isEvNameCurrect(state, getters) {
      return getters.allNames.includes(state.evName);
    },
  },
  mutations: {
    setListData(state, { setting, list }) {
      Object.keys(state.setting).forEach((settingKey) => {
        state.setting[settingKey] = setting[settingKey];
      });
      state.list = list;
    },
  },
  actions: {
    async initFromListId({ commit, state }, { listId, evName }) {
      state.listId = listId;
      state.evName = evName;
      const setting = await getSettings(listId);
      const { header, list } = await getList(listId);

      commit('setListData', {
        setting: {
          header,
          ...setting,
        },
        list,
      });
    },
  },
};
