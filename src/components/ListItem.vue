<template>
  <div
    ref="wrap"
    class="list__item"
    @drop="drop"
    @dragover="dragOver"
    @dragenter="dragEnter"
  >
    <div class="list__subtitle">{{ task.title }}</div>
    <div class="list__marks">
      <div
        v-for="(mark, i) in task.marks"
        :key="i"
        :class="'list__mark list__mark--' + mark"
      />
    </div>
    <div v-if="task.note" class="list__note">{{ task.note }}</div>
    <div class="list__text">{{ task.text }}</div>
    <controls-panel
      :element="task"
      type="task"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import ControlsPanel from '@/components/ControlsPanel.vue';

export default {
  props: ['task'],
  setup(props) {
    const store = useStore();
    const wrap = ref(null);

    let activeElem = computed(() => {
      return store.getters['activeElem'];
    });

    function drop() {
      if (activeElem.value.type === 'category') return;
      if (activeElem.value.data.id === props.task.id) return;
      const hoverElem = store.getters['hoverElem'];
      if (!hoverElem) return;

      const tasks = store.getters['tasks'];
      const categoriesList = store.getters['categoriesList'];
      const isHoverOrphant = tasks.includes(hoverElem.data);

      if (activeElem.value.isOrphant) {
        if (isHoverOrphant) {
          //if drag orphant item to orphant item
          const activeIndex = tasks.findIndex(item => item.id === activeElem.value.data.id);
          const prevTaskList = [
            ...tasks.slice(0, activeIndex),
            ...tasks.slice(activeIndex + 1)
          ];

          const hoverIndex = prevTaskList.findIndex(item => item.id === hoverElem.data.id);
          const newTasksList = [
            ...prevTaskList.slice(0, hoverIndex + 1),
            tasks[activeIndex],
            ...prevTaskList.slice(hoverIndex + 1)
          ];
          
          store.commit('setTasks', newTasksList);
        } else {
          //if drag orphant to category item
          const parent = categoriesList.find(item => item.id === hoverElem.data.parentId);
          const parentIndex = categoriesList.findIndex(item => item.id === parent.id);
          const hoverIndex = parent.subItems.findIndex(item => item.id === hoverElem.data.id);

          const newSubitems = [
            ...parent.subItems.slice(0, hoverIndex),
            parent.subItems[hoverIndex],
            { ...activeElem.value.data, parentId: parent.id },
            ...parent.subItems.slice(hoverIndex + 1)
          ];

          const newTasksList = tasks.filter(item => item.id !== activeElem.value.data.id);
          
          const newCategoriesList = [
            ...categoriesList.slice(0, parentIndex),
            { ...parent, subItems: newSubitems },
            ...categoriesList.slice(parentIndex + 1),
          ];

          store.commit('setCategoriesList', newCategoriesList);
          store.commit('setTasks', newTasksList);
        }
      } else {
        const parent = categoriesList.find(item => item.id === activeElem.value.data.parentId);
        const parentIndex = categoriesList.findIndex(item => item.id === parent.id);

        if (isHoverOrphant) {
          //if drag category item to orphant
          const newSubitems = parent.subItems.filter(item => item.id !== activeElem.value.data.id);
          const hoverIndex = tasks.findIndex(item => item.id === hoverElem.data.id);

          const newTasksList = [
            ...tasks.slice(0, hoverIndex),
            tasks[hoverIndex],
            { ...activeElem.value.data, parentId: null },
            ...tasks.slice(hoverIndex + 1)
          ];

          const newCategoriesList = [
            ...categoriesList.slice(0, parentIndex),
            { ...parent, subItems: newSubitems },
            ...categoriesList.slice(parentIndex + 1),
          ];

          store.commit('setCategoriesList', newCategoriesList);
          store.commit('setTasks', newTasksList);
        } else {
          if (hoverElem.data.parentId === activeElem.value.data.parentId) {
            // if drag inside category
            const parent = categoriesList.find(item => item.id === activeElem.value.data.parentId);
            const activeIndex = parent.subItems.findIndex(item => item.id === activeElem.value.data.id);

            const prevTaskList = [
              ...parent.subItems.slice(0, activeIndex),
              ...parent.subItems.slice(activeIndex + 1)
            ];

            const hoverIndex = prevTaskList.findIndex(item => item.id === hoverElem.data.id);
            const newTasksList = [
              ...prevTaskList.slice(0, hoverIndex + 1),
              parent.subItems[activeIndex],
              ...prevTaskList.slice(hoverIndex + 1)
            ];

            store.commit('setCategory', { ...parent, subItems: newTasksList });
            return;
          }
          //if drag item between categories

          const nextParent = categoriesList.find(item => item.id === hoverElem.data.parentId);
          const hoverIndex = nextParent.subItems.findIndex(item => item.id === hoverElem.data.id);

          const nextSubitems = [
            ...nextParent.subItems.slice(0, hoverIndex),
            nextParent.subItems[hoverIndex],
            { ...activeElem.value.data, parentId: nextParent.id },
            ...nextParent.subItems.slice(hoverIndex + 1)
          ];

          const prevSubitems = parent.subItems.filter(item => item.id !== activeElem.value.data.id);
          const prevCategoriesList = [
            ...categoriesList.slice(0, parentIndex),
            { ...parent, subItems: prevSubitems },
            ...categoriesList.slice(parentIndex + 1),
          ];

          const nextParentIndex = prevCategoriesList.findIndex(item => item.id === nextParent.id);
          
          const newCategoriesList = [
            ...prevCategoriesList.slice(0, nextParentIndex),
            { ...nextParent, subItems: nextSubitems },
            ...prevCategoriesList.slice(nextParentIndex + 1),
          ];
          store.commit('setCategoriesList', newCategoriesList);
        }
      }
      store.commit('removeHoverElem');
    }

    function dragEnter(event) {
      if (activeElem.value.type === 'category') return;
      if (activeElem.value.data.id === props.task.id) return;
      event.preventDefault();

      store.commit('setHoverElem', { type: 'task', data: props.task, elem: wrap.value });
    }

    function dragOver(event) {
      if (activeElem.value.type === 'category') return;
      console.log('over');
      event.preventDefault();
    }

    return {
      wrap,
      drop,
      dragEnter,
      dragOver
    }
  },
  components: { ControlsPanel }
};
</script>