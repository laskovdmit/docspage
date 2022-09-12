<template>
  <div
    ref="wrap"
    class="list__category"
    :draggable="isDraggable"
    @mousedown="mouseDown"
    @mouseup="isDraggable = false"
    @dragstart="startDrag"
    @dragend="endDrag"
    @dragover="dragOver"
    @dragleave="dragLeave"
  >
    <div
      ref="head"
      :class="['list__head', { 'list__head--active': isActive, 'list__head--highlight': isDragging }]"
      @click="isActive = !isActive"
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
      <controls-panel />
    </div>
    <div
      ref="body"
      class="list__body"
      @dragover.prevent
      @dragenter.prevent
      @drop="$emit('drop-list', $event)"
    >
      <list-item
        v-for="item in category.subItems"
        :key="item.id"
        :item="item"
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
  emits: ['drop-list'],
  setup(props) {
    const store = useStore();
    const wrap = ref(null);
    const head = ref(null);
    const body = ref(null);
    const isDraggable = ref(false);
    const isDragging = ref(false);
    let active = ref(false);
    const { open } = toRefs(props);
    
    watch(open, val => {
      isActive.value = val;
    });

    let isActive = computed({
      get() {
        return active.value;
      },
      set(val) {
        active.value = val;
        if (val) {
          body.value.style.display = 'block';
          body.value.style.height = '0px';
          showBody();
        } else {
          hideBody();
        }
      }
    });

    function showBody() {
      const maxHeight = body.value.scrollHeight;
      let count = 0;
      let heightInterval = maxHeight / 10;

      const show = setInterval(() => {
        if (count >= 9.75) {
          clearInterval(show);
        }

        count += 0.25;
        body.value.style.height = `${count * heightInterval}px`;
      }, 10);
    }

    function hideBody() {
      const maxHeight = body.value.scrollHeight;
      let count = 10.25;
      let heightInterval = maxHeight / 10;

      const hide = setInterval(() => {
        if (count <= 0) {
          clearInterval(hide);
          body.value.style.display = 'none';
          body.value.style.height = maxHeight;
        }

        count -= 0.25;
        body.value.style.height = `${count * heightInterval}px`;
      }, 10);
    }

    function mouseDown(event) {
      const elem = event.target.closest('.controls__item--drag');
      if (!elem || event.which !== 1) return;

      isDraggable.value = true;
    }

    function startDrag(event) {
      console.log('start', props.category.id);
      store.commit('setActiveElem', { id: props.category.id, type: 'category' });

      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('categoryID', props.category.id);
      isDragging.value = true;
    }

    function endDrag(event) {
      console.log('end');
      store.commit('removeActiveElem');
      isDraggable.value = false;
      isDragging.value = false;
    }

    function dragLeave(event) {
      wrap.value.classList.remove('list__category--highlight');
    }

    function dragOver(event) {
      if (isDragging.value || wrap.value.classList.contains('list__category--highlight')) return;

      wrap.value.classList.add('list__category--highlight');
      console.log('over');
    }

    return {
      wrap,
      head,
      body,
      isDraggable,
      isDragging,
      isActive,
      startDrag,
      endDrag,
      mouseDown,
      dragLeave,
      dragOver
    }
  },
  components: { ControlsPanel, ListItem }
};
</script>