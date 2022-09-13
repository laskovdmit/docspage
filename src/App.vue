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
        @click="resetSearch"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.325608 10.746C-0.0649162 10.3555 -0.0649162 9.72233 0.325608 9.33181L9.36312 0.292893C9.75364 -0.0976313 10.3868 -0.0976309 10.7773 0.292893C11.1679 0.683418 11.1679 1.31658 10.7773 1.70711L1.73982 10.746C1.3493 11.1365 0.716132 11.1365 0.325608 10.746Z" fill="#FF238D"/>
          <path d="M10.6836 10.6835C11.0741 10.293 11.0741 9.65986 10.6836 9.26933L6.19533 4.78111L1.70711 0.292893C1.31658 -0.0976313 0.683417 -0.0976309 0.292893 0.292893C-0.0976311 0.683418 -0.0976311 1.31658 0.292893 1.70711L9.26935 10.6835C9.65987 11.0741 10.293 11.0741 10.6836 10.6835Z" fill="#FF238D"/>
        </svg>
      </button>
    </div>
    <div class="main__list list">
      <category-item 
        v-for="category in categoriesList"
        :key="category.id"
        :category="category"
        :open="open"
      />
    </div>
    <div class="main__sublist list">
      <list-item
        v-for="task in tasks"
        :key="task.id"
        :task="task"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import ListItem from '@/components/ListItem.vue';
import CategoryItem from '@/components/CategoryItem.vue';

export default {
  name: 'App',
  setup() {
    const store = useStore();
    const categoriesList = computed(() => store.getters['categoriesList']);
    const tasks = computed(() => store.getters['tasks']);

    const searchInput = ref('');
    const main = ref(null);
    const open = ref(false);

    function search(event) {
      const value = event.target.value;

      if (value === '') {
        store.commit('setSearch', false);
        toggleContent(true);
      } else {
        store.commit('setSearch', true);
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

    function resetSearch() {
      searchInput.value = '';
      toggleContent(true);
      store.commit('setSearch', false);
    }

    return {
      categoriesList,
      tasks,
      searchInput,
      main,
      open,
      search,
      toggleContent,
      resetSearch
    }
  },
  components: { CategoryItem, ListItem }
}
</script>