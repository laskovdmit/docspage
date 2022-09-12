<template>
  <div ref="main" class="main">
    <h1 class="title">Документы</h1>
    <div class="main__search">
      <input
        v-model="searchInput"
        type="text"
        placeholder="Поиск"
        class="main__input"
        @input="search"
      >
      <button
        v-if="searchInput.length"
        type="button"
        class="main__btn btn"
        @click="searchInput = ''; toggleContent(true)"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.325608 10.746C-0.0649162 10.3555 -0.0649162 9.72233 0.325608 9.33181L9.36312 0.292893C9.75364 -0.0976313 10.3868 -0.0976309 10.7773 0.292893C11.1679 0.683418 11.1679 1.31658 10.7773 1.70711L1.73982 10.746C1.3493 11.1365 0.716132 11.1365 0.325608 10.746Z" fill="#FF238D"/>
          <path d="M10.6836 10.6835C11.0741 10.293 11.0741 9.65986 10.6836 9.26933L6.19533 4.78111L1.70711 0.292893C1.31658 -0.0976313 0.683417 -0.0976309 0.292893 0.292893C-0.0976311 0.683418 -0.0976311 1.31658 0.292893 1.70711L9.26935 10.6835C9.65987 11.0741 10.293 11.0741 10.6836 10.6835Z" fill="#FF238D"/>
        </svg>
      </button>
    </div>
    <div
      class="main__list list"
      @dragover.prevent
      @dragenter.prevent
      @drop="onDrop($event, 'category')"
    >
      <category-item 
        v-for="category in categories"
        :key="category.id"
        :category="category"
        :open="open"
        @drop-list="(val) => onDrop(val, 'item')"
      />
    </div>
    <div
      ref="sublist"
      class="main__sublist list"
      @dragover.prevent="dragOver"
      @dragleave="dragLeave"
      @dragenter.prevent
      @drop="onDrop($event, 'item')"
    >
      <list-item
        v-for="item in itemsList"
        :key="item.id"
        :item="item"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import ListItem from '@/components/ListItem.vue';
import CategoryItem from '@/components/CategoryItem.vue';

const categoriesList = [
  {
    id: 1,
    title: 'Обязательные для всех',
    marks: ['pink', 'orange', 'yellow'],
    text: 'Документы, обязательные для всех сотрудников без исключения',
    subItems: [
      {
        id: 11,
        title: 'Паспорт',
        marks: ['blue'],
        note: 'Обязательный',
        text: 'Для всех'
      },
      {
        id: 12,
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
];

const list = [
  {
    id: 21,
    title: 'Тестовое задание кандидата',
    marks: [],
    note: '',
    text: 'Россия, Белоруссия, Украина, администратор филиала, повар-сушист, повар-пиццмейкер, повар горячего цеха'
  },
  {
    id: 22,
    title: 'Трудовой договор',
    marks: ['blue', 'gray'],
    note: '',
    text: ''
  },
  {
    id: 23,
    title: 'Мед. книжка',
    marks: [],
    note: '',
    text: ''
  },
];

export default {
  name: 'App',
  setup() {
    const store = useStore();
    const searchInput = ref('');
    const categories = ref([...categoriesList]);
    const itemsList = ref([...list]);
    const main = ref(null);
    const sublist = ref(null);
    const open = ref(false);

    function search(event) {
      const value = event.target.value;

      if (value === '') {
        toggleContent(true);
      } else {
        toggleContent(false);

        const titles = main.value.querySelectorAll('.list__title');
        const subtitles = main.value.querySelectorAll('.list__subtitle');

        [...titles, ...subtitles].forEach(item => {
          const mathes = item.textContent.match(value);
          
          if (mathes && item.classList.contains('list__title')) {
            item.closest('.list__category').style.display = '';
          }

          if (mathes && item.classList.contains('list__subtitle')) {
            item.closest('.list__item').style.display = '';

            if (item.closest('.list__category')) {
              item.closest('.list__category').style.display = '';
            }
          }

          item.innerHTML = item.textContent.replace(value, `<span class="highlight">${value}</span>`);
        });
      }
    };

    function toggleContent(show) {
      open.value = !show;
      const categories = main.value.querySelectorAll('.list__category');
      const items = main.value.querySelectorAll('.list__item');

      if (show) {
        [...categories, ...items].forEach(item => item.style.display = '');

        const titles = main.value.querySelectorAll('.list__title');
        const subtitles = main.value.querySelectorAll('.list__subtitle');

        const reg = /<span class="highlight">(.*)<\/span>/ig;

        [...titles, ...subtitles].forEach(item => {
          if (item.innerHTML.match(reg)) {
            item.innerHTML = item.textContent.replace(reg, (match, p1) => p1);
          }
        });
      } else {
        [...categories, ...items].forEach(item => item.style.display = 'none');
      }
    }

    function dragOver() {
      if (sublist.value.classList.contains('main__sublist--highlight')) return;
      sublist.value.classList.add('main__sublist--highlight');
    }

    function dragLeave() {
      sublist.value.classList.remove('main__sublist--highlight');
    }


    function onDrop(event, type) {
      const activeElem = store.getters['activeElem'];

      if (type !== activeElem.type) return;

      console.log('drop', event);
      console.log(activeElem);
    }
    
    return {
      main,
      sublist,
      itemsList,
      categories,
      search,
      searchInput,
      toggleContent,
      open,
      onDrop,
      dragOver,
      dragLeave
    }
  },
  components: { CategoryItem, ListItem }
}
</script>