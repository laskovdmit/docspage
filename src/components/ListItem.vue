<template>
  <div
    class="list__item"
    :draggable="isDraggable"
    @mousedown="mouseDown"
    @mouseup="isDraggable = false"
    @dragstart="startDrag"
    @dragend="endDrag"
  >
    <div class="list__subtitle">{{ item.title }}</div>
    <div class="list__marks">
      <div
        v-for="(mark, i) in item.marks"
        :key="i"
        :class="'list__mark list__mark--' + mark"
      />
    </div>
    <div v-if="item.note" class="list__note">{{ item.note }}</div>
    <div class="list__text">{{ item.text }}</div>
    <controls-panel />
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import ControlsPanel from '@/components/ControlsPanel.vue';

export default {
  props: ['item'],
  setup(props) {
    const store = useStore();
    const isDraggable = ref(false);

    function startDrag(event) {
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.effectAllowed = 'move';
      store.commit('setActiveElem', { id: props.item.id, type: 'item' });
    }

    function mouseDown(event) {
      const elem = event.target.closest('.controls__item--drag');
      if (!elem || event.which !== 1) return;

      isDraggable.value = true;
    }

    function endDrag(event) {
      console.log('end');
      store.commit('removeActiveElem');
      isDraggable.value = false;
    }

    return {
      startDrag,
      isDraggable,
      mouseDown,
      endDrag
    }
  },
  components: { ControlsPanel }
};
</script>