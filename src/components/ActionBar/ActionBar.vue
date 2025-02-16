<template>
  <div class="action-bar">
    <div class="file-menu">
      <button class="menu-button" @click="showFileMenu = !showFileMenu">
        File
        <div v-if="showFileMenu" class="dropdown-menu">
          <div class="menu-item" @click="$emit('newWorkflow')">New Workflow</div>
          <div class="menu-item" @click="$emit('openWorkflow')">Open...</div>
          <div class="menu-item" @click="$emit('saveWorkflow')">Save</div>
          <div class="menu-item" @click="$emit('exportWorkflow')">Export</div>
          <div class="menu-item" @click="$emit('importWorkflow')">Import</div>
        </div>
      </button>
    </div>
    <div class="tool-buttons">
      <button class="icon-button" title="Add Start Node" @click="$emit('addNode', 'start')">
        <svg width="20" height="20" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" fill="#1890ff"/>
          <text x="12" y="16" text-anchor="middle" fill="white">S</text>
        </svg>
      </button>
      <button class="icon-button" title="Add Process Node" @click="$emit('addNode', 'process')">
        <svg width="20" height="20" viewBox="0 0 24 24">
          <rect x="4" y="4" width="16" height="16" rx="2" fill="#52c41a"/>
          <text x="12" y="16" text-anchor="middle" fill="white">P</text>
        </svg>
      </button>
      <button class="icon-button" title="Add End Node" @click="$emit('addNode', 'end')">
        <svg width="20" height="20" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" fill="#f5222d"/>
          <text x="12" y="16" text-anchor="middle" fill="white">E</text>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ActionBar',
  setup() {
    const showFileMenu = ref(false)
    return { showFileMenu }
  }
}
</script>

<style scoped>
.action-bar {
  display: flex;
  align-items: center;
  padding: 8px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  gap: 16px;
}

.file-menu {
  position: relative;
}

.menu-button {
  padding: 6px 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.menu-button:hover {
  background: #f5f5f5;
  border-radius: 4px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 1000;
}

.menu-item {
  padding: 8px 16px;
  cursor: pointer;
  white-space: nowrap;
}

.menu-item:hover {
  background: #f5f5f5;
}

.tool-buttons {
  display: flex;
  gap: 8px;
}

.icon-button {
  padding: 4px;
  background: none;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-button:hover {
  background: #f5f5f5;
}
</style> 