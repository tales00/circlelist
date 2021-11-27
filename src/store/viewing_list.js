import { getSettings, getList } from '@/api/g-sheets';
import { db } from '@/api/db';

const default_status = () => ({
  isFromCache: false,
  isLoading: false,
  isSettingReady: false,
  isListReady: false,
  isError: false,
  errorMessage: '',
});

const default_setting = () => ({
  header: {},
  config: [],
  list: [],
  venue_map: [],
  custom: [],
  host: {},
  creator: {},
});

const default_state = () => ({
  evName: undefined,
  listId: undefined,
  status: default_status(),
  setting: default_setting(),
  list: {},
  list_queryString: '',
  viewing_list_name: '',
  viewing_page: '',
  loadAt: 0,
  expire: 0,
});

export default {
  namespaced: true,
  state: default_state(),
  getters: {
    sheet_url({ listId }) {
      return listId
        ? `https://docs.google.com/spreadsheets/d/${listId}/edit`
        : undefined;
    },
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
      return state.setting?.list.map(({ key }) => key) || [];
    },
    viewing_list_data(state) {
      return (
        state.setting?.list.find(
          ({ key }) => key === state.viewing_list_name,
        ) || {}
      );
    },
    list_search(state) {
      const { list, viewing_list_name } = state;
      let { list_queryString: queryString } = state;
      if (
        !queryString ||
        queryString === ':' ||
        queryString === '?' ||
        queryString === 'url:'
      ) {
        return list[viewing_list_name] || [];
      }

      queryString = queryString.toLowerCase();

      if (queryString.startsWith(':')) {
        queryString = queryString.slice(1);
        // console.log('space search', queryString);
        return list[viewing_list_name].filter((circle) => {
          return circle.space?.toLowerCase().includes(queryString);
        });
      }

      if (queryString.startsWith('?')) {
        queryString = queryString.slice(1);
        // console.log('name/description search', queryString);
        return list[viewing_list_name].filter((circle) => {
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
        return list[viewing_list_name].filter((circle) => {
          return circle.info_url?.toLowerCase().includes(queryString);
        });
      }

      return list[viewing_list_name].filter((circle) => {
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
      const { isLoading, isSettingReady, isListReady, isError } = state.status;
      return isSettingReady && isListReady && !isLoading && !isError;
    },
    isSettingReady(state) {
      const { isSettingReady } = state.status;
      return !!isSettingReady;
    },
    isListReady(state) {
      const { isListReady } = state.status;
      return !!isListReady;
    },
    isEvNameCurrect(state, getters) {
      return getters.allNames.includes(state.evName);
    },
    hasMap(state) {
      return state.setting.venue_map.length;
    },
  },
  mutations: {
    resetState(state) {
      Object.entries(default_state()).forEach(([key, value]) => {
        state[key] = value;
      });
    },
    setStatus(state, { name, code }) {
      if (name in state.status) {
        state.status[name] = code;
      }
    },
    setSetting(state, setting) {
      Object.keys(setting).forEach((settingKey) => {
        if (settingKey in state.setting) {
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
      state.viewing_list_name = list_name;
    },
    setListQuery(state, queryString = '') {
      state.list_queryString = queryString;
    },
  },
  actions: {
    async initFromListId({ dispatch, commit, state }, { listId, evName }) {
      commit('resetState');
      state.listId = listId;
      state.evName = evName;

      // console.log({ listId, evName });
      // commit('setStatus', { name: 'isError', code: true });
      // commit('setStatus', { name: 'errorMessage', code: 'test-error' });

      try {
        const cachedListDB = await db.event.where('id').equals(listId);
        const isListCached = await cachedListDB.count();
        const [cache] = isListCached ? await cachedListDB.toArray() : [false];
        // console.log('isListCached', { isListCached, cache });

        if (cache?.expire > Date.now()) {
          // console.log('cache', cache);
          console.log('use cache');
          await dispatch('loadSheetsFromCache', cache);
        } else {
          console.log('get from net');
          await dispatch('loadSheetsFromNet', { listId, evName });
        }
      } catch (error) {
        // commit('setStatus', { name: 'isFromCache', code: false });
        commit('setStatus', { name: 'isSettingReady', code: false });
        commit('setStatus', { name: 'isListReady', code: false });
        commit('setStatus', { name: 'isLoading', code: false });
        commit('setStatus', { name: 'isError', code: true });
        commit('setStatus', { name: 'errorMessage', code: error });
        return;
      }

      console.log('done');
      commit('setStatus', { name: 'isLoading', code: false });
      commit('setStatus', { name: 'isError', code: false });
      commit('setStatus', { name: 'errorMessage', code: '' });

      // save to local
    },
    async loadSheetsFromCache({ commit, state }, cache) {
      // console.log('cache', cache);
      state.loadAt = cache.loadAt;
      state.expire = cache.expire;

      commit('setSetting', cache.setting);
      commit('setStatus', { name: 'isSettingReady', code: true });

      Object.entries(cache.list).forEach(([key, _listData]) => {
        // console.log('_listData', { key, _listData });
        commit('addList', { name: key, listData: _listData });
      });

      commit('setStatus', { name: 'isFromCache', code: true });
      commit('setStatus', { name: 'isListReady', code: true });
    },
    async loadSheetsFromNet({ dispatch, commit }, { listId, evName }) {
      commit('setStatus', { name: 'isLoading', code: true });

      const setting = await getSettings(listId);
      if (!setting) {
        throw Error('load-setting-error');
      }
      commit('setSetting', setting);
      commit('setStatus', { name: 'isSettingReady', code: true });

      if (!setting?.list.length) {
        throw Error('load-list-error');
      }

      setting.header = {};
      let _list = {};
      // console.log('setting.list', setting.list);
      let _listPromiseArray = setting.list
        .map(async ({ value: tableName, key }) => {
          // console.log('tableName', tableName);
          const { header: thisHeader, list: thisList } = await getList(
            listId,
            tableName,
          );
          if (!thisList) {
            throw Error('load-list-error');
          }
          setting.header[key] = thisHeader;
          _list[key] = thisList;

          return {
            name: key,
            listData: thisList,
          };
        })
        .map((listPromise) => {
          return listPromise.then((thisList) => {
            // console.log('thisList', thisList);
            commit('addList', thisList);
          });
        });
      // console.log('_listPromiseArray', {
      //   header: setting.header,
      //   _listPromiseArray,
      // });

      Promise.allSettled(_listPromiseArray).then(() => {
        // results.forEach((result) => console.log('allSettled', result.status));
        // console.log('state.setting', state.setting);
        commit('setSetting', { header: setting.header });
        commit('setStatus', { name: 'isListReady', code: true });

        const loadAt = Date.now();
        const expire = 60 * 60 * 1000 * 3 + Date.now();
        console.log('saveCache', {
          id: listId,
          evName,
          setting,
          list: _list,
          loadAt,
          expire,
        });

        dispatch('saveCache', {
          id: listId,
          evName,
          setting,
          list: _list,
          loadAt,
          expire,
        });
      });
    },
    saveCache({ state }, { id, evName, setting, list, loadAt, expire }) {
      state.loadAt = loadAt;
      state.expire = expire;
      db.event.add({
        id,
        evName,
        setting,
        list,
        loadAt,
        expire,
      });
    },
  },
};
