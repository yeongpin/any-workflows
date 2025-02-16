<template>
  <div class="context-menu" :style="menuStyle">
    <div 
      class="menu-item"
      v-for="type in nodeTypes"
      :key="type"
      @click="$emit('addNode', type)"
    >
      Add {{ type }} Node
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContextMenu',
  props: {
    position: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      nodeTypes: ['Start', 'Process', 'End']
    }
  },
  computed: {
    menuStyle() {
      return {
        left: `${this.position.x}px`,
        top: `${this.position.y}px`
      }
    }
  }
}
</script>

<style scoped>
.context-menu {
  position: fixed;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  padding: 4px 0;
  min-width: 160px;
  z-index: 1000;
}

.menu-item {
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  user-select: none;
}

.menu-item:hover {
  background-color: #f5f5f5;
}
</style> 