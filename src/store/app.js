const default_state = () => ({});
export default {
  namespaced: true,
  state: default_state(),
  getters: {},
  mutations: {
    resetState(state) {
      Object.entries(default_state()).forEach(([key, value]) => {
        state[key] = value;
      });
    },
  },
  actions: {},
};
