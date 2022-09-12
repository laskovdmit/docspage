import { createStore, createLogger } from 'vuex';

const plugins = [];

if (process.env.NODE_ENV === 'development') {
  plugins.push(createLogger())
}

export default createStore({
  plugins,
  state() {
    return {
      activeElem: null
    }
  },
  getters: {
    activeElem(state) {
      return state.activeElem;
    }
  },
  mutations: {
    setActiveElem(state, payload) {
      state.activeElem = payload;
    },
    removeActiveElem(state) {
      state.activeElem = null;
      
      document.querySelectorAll('.list__category--highlight').forEach(item => {
        item.classList.remove('list__category--highlight');
      });

      document.querySelectorAll('.list__body--highlight').forEach(item => {
        item.classList.remove('list__body--highlight');
      });

      document.querySelectorAll('.main__sublist--highlight').forEach(item => {
        item.classList.remove('main__sublist--highlight');
      });
    }
  }
})