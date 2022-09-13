<template>
  <div class="list__category">
    <div
      ref="head"
      :class="['list__head', { 'list__head--active': isActive }]"
      @click="isActive = !isActive"
      @drop="drop"
      @dragover.prevent
      @dragenter.prevent="dragEnter"
    >
      <div class="list__title">{{ category.title }}</div>
      <div class="list__marks">
        <div
          v-for="(mark, i) in category.marks"
          :key="i"
          :class="'list__mark list__mark--' + mark"
        />
      </div>
      <div class="list__text">{{ category.text }}</div>
      <controls-panel
        :element="category"
        type="category"
      />
    </div>
    <div ref="body" class="list__body">
      <list-item
        v-for="item in category.subItems"
        :key="item.id"
        :task="item"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, toRefs } from 'vue';
import { useStore } from 'vuex';
import ListItem from '@/components/ListItem.vue';
import ControlsPanel from '@/components/ControlsPanel.vue';

export default {
  props: ['category', 'open'],
  setup(props) {
    const store = useStore();
    const head = ref(null);
    let isActive = ref(false);
    const { open } = toRefs(props);
    
    watch(open, val => isActive.value = val);

    let activeElem = computed(() => {
      return store.getters['activeElem'];
    });
    
    function drop() {
      if (activeElem.value.type === 'category' && activeElem.value.data.id === props.category.id) return;
      const hoverElem = store.getters['hoverElem'];
      if (!hoverElem) return;

      const tasks = store.getters['tasks'];
      const categoriesList = store.getters['categoriesList'];
      
      if (activeElem.value.type === 'category') {
        //If drag category to category
        const activeIndex = categoriesList.findIndex(item => item.id === activeElem.value.data.id);
        const prevCategoriesList = [
          ...categoriesList.slice(0, activeIndex),
          ...categoriesList.slice(activeIndex + 1),
        ];

        const hoverIndex = prevCategoriesList.findIndex(item => item.id === hoverElem.data.id);
        const newCategoriesList = [
          ...prevCategoriesList.slice(0, hoverIndex + 1),
          categoriesList[activeIndex],
          ...prevCategoriesList.slice(hoverIndex + 1)
        ];

        store.commit('setCategoriesList', newCategoriesList);
      } else {
        if (activeElem.value.isOrphant) {
          //If drag orphant to category
          const newTasks = tasks.filter(item => item.id !== activeElem.value.data.id);
          const newSubitems = [
            { ...activeElem.value.data, parentId: hoverElem.data.id },
            ...hoverElem.data.subItems
          ];
          const newCategory = { ...hoverElem.data, subItems: newSubitems };

          store.commit('setCategory', newCategory);
          store.commit('setTasks', newTasks);
        } else {
          //If drag category item to current category
          if (hoverElem.data.id === activeElem.value.data.parentId) {
            const filterSubItems = hoverElem.data.subItems.filter(item => item.id !== activeElem.value.data.id);

            store.commit('setCategory', {
              ...hoverElem.data,
              subItems: [ activeElem.value.data, ...filterSubItems ]
            });
            return;
          }
          //If drag category item to another category
          const parentActive = categoriesList.find(item => item.id === activeElem.value.data.parentId);
          const activeSubitems = parentActive.subItems.filter(item => item.id !== activeElem.value.data.id);

          const newHoverCategory = {
            ...hoverElem.data,
            subItems: [
              { ...activeElem.value.data, parentId: hoverElem.data.id },
              ...hoverElem.data.subItems
            ]
          };
          const newActiveCategory = { ...parentActive, subItems: activeSubitems };

          store.commit('setCategory', newHoverCategory);
          store.commit('setCategory', newActiveCategory);
        }
      }
      store.commit('removeHoverElem');
    }
    
    function dragEnter() {
      if (activeElem.value.data.id === props.category.id) return;
      store.commit('setHoverElem', { type: 'category', data: props.category, elem: head.value });
    }

    return {
      head,
      isActive,
      drop,
      dragEnter
    }
  },
  components: { ControlsPanel, ListItem }
};
</script>