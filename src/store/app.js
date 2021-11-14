export default {
  namespaced: true,
  state: {
    headerComponent: undefined,
    footerComponent: undefined,
    isHeaderSticky: true,
    isFooterSticky: true,
  },
  getters: {},
  mutations: {
    resetApp(state) {
      state.headerComponent = undefined;
      state.footerComponent = undefined;
      state.isHeaderSticky = true;
      state.isFooterSticky = true;
    },
    setHeader(state, headerComponent) {
      state.headerComponent = headerComponent;
    },
    setHeaderSticky(state, isSticky) {
      state.isHeaderSticky = isSticky;
    },
    setFooter(state, footerComponent) {
      state.footerComponent = footerComponent;
    },
    setFooterSticky(state, isSticky) {
      state.isFooterSticky = isSticky;
    },
  },
  actions: {},
};
