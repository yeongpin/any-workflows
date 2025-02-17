<template>
  <div class="context-menu" :style="menuStyle">
    <div 
      class="menu-item"
      v-for="type in nodeTypes"
      :key="type"
      @click="$emit('addNode', type)"
    >
      <div class="menu-icon">
        <svg v-if="type === 'Start'" viewBox="0 0 24 24" width="16" height="16">
          <circle cx="12" cy="12" r="8" fill="#1890ff"/>
          <text x="12" y="16" text-anchor="middle" fill="white" font-size="10">S</text>
        </svg>
        <svg v-else-if="type === 'Process'" viewBox="0 0 24 24" width="16" height="16">
          <rect x="4" y="4" width="16" height="16" rx="2" fill="#52c41a"/>
          <text x="12" y="16" text-anchor="middle" fill="white" font-size="10">P</text>
        </svg>
        <svg v-else-if="type === 'End'" viewBox="0 0 24 24" width="16" height="16">
          <circle cx="12" cy="12" r="8" fill="#ff4d4f"/>
          <text x="12" y="16" text-anchor="middle" fill="white" font-size="10">E</text>
        </svg>
        <svg v-else-if="type === 'Image'" viewBox="0 0 24 24" width="16" height="16">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="#597ef7"/>
        </svg>
        <svg v-else-if="type === 'Video'" viewBox="0 0 24 24" width="16" height="16" fill="#597ef7" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
      <span>Add {{ type }} Node</span>
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
      nodeTypes: ['Start', 'Process', 'End', 'Image', 'Video']
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
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.3s;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}
</style> 