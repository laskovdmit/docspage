import { createStore, createLogger } from 'vuex';

const plugins = [];

// if (process.env.NODE_ENV === 'development') {
//   plugins.push(createLogger())
// }

export default createStore({
  plugins,
  state() {
    return {
      isSearch: false,
      activeElem: null,
      hoverElem: null,
      categoriesList: [
        {
          id: 1,
          title: 'Обязательные для всех',
          marks: ['pink', 'orange', 'yellow'],
          text: 'Документы, обязательные для всех сотрудников без исключения',
          subItems: [
            {
              id: 11,
              parentId: 1,
              title: 'Паспорт',
              marks: ['blue'],
              note: 'Обязательный',
              text: 'Для всех'
            },
            {
              id: 12,
              parentId: 1,
              title: 'ИНН',
              marks: [],
              note: 'Обязательный',
              text: 'Для всех'
            }
          ]
        },
        {
          id: 2,
          title: 'Обязательные для трудоустройства',
          marks: [],
          text: 'Документы, без которых невозможно трудоустройство человека на какую бы то ни было должность в компании вне зависимости от граж',
          subItems: []
        },
        {
          id: 3,
          title: 'Специальные',
          marks: [],
          text: '',
          subItems: []
        }
      ],
      tasks: [
        {
          id: 21,
          parentId: null,
          title: 'Тестовое задание кандидата',
          marks: [],
          note: '',
          text: 'Россия, Белоруссия, Украина, администратор филиала, повар-сушист, повар-пиццмейкер, повар горячего цеха'
        },
        {
          id: 22,
          parentId: null,
          title: 'Трудовой договор',
          marks: ['blue', 'gray'],
          note: '',
          text: ''
        },
        {
          id: 23,
          parentId: null,
          title: 'Мед. книжка',
          marks: [],
          note: '',
          text: ''
        },
      ]
    }
  },
  getters: {
    isSearch(state) {
      return state.isSearch;
    },
    activeElem(state) {
      return state.activeElem;
    },
    hoverElem(state) {
      return state.hoverElem;
    },
    categoriesList(state) {
      return state.categoriesList;
    },
    tasks(state) {
      return state.tasks;
    }
  },
  mutations: {
    setSearch(state, payload) {
      state.isSearch = payload;
    },
    setActiveElem(state, payload) {
      state.activeElem = payload;
    },
    removeActiveElem(state) {
      state.activeElem = null;
    },
    setHoverElem(state, payload) {
      if (state.hoverElem) {
        state.hoverElem.elem.classList.remove('list__item--hover');
        state.hoverElem.elem.classList.remove('list__head--hover');
      } 

      if (payload.type === 'task') {
        payload.elem.classList.add('list__item--hover');
      } else {
        payload.elem.classList.add('list__head--hover');
      }
      state.hoverElem = payload;
    },
    removeHoverElem(state) {
      state.hoverElem = null;
    },
    setCategoriesList(state, payload) {
      state.categoriesList = payload;
    },
    setCategory(state, payload) {
      const index = state.categoriesList.findIndex(item => item.id === payload.id);

      state.categoriesList = [
        ...state.categoriesList.slice(0, index),
        payload,
        ...state.categoriesList.slice(index + 1)
      ];
    },
    setTasks(state, payload) {
      state.tasks = payload;
    }
  }
})