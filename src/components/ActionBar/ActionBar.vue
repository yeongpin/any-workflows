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
      <button class="icon-button" title="Add Image Node" @click="$emit('addNode', 'image')">
        <svg width="20" height="20" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" fill="#f5222d"/>
          <text x="12" y="16" text-anchor="middle" fill="white">I</text>
        </svg>
      </button>
      <button class="icon-button" title="Add Video Node" @click="$emit('addNode', 'video')">
        <svg width="20" height="20" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" fill="#722ed1"/>
          <text x="12" y="16" text-anchor="middle" fill="white">V</text>
        </svg>
      </button>
      <button class="icon-button" title="Add URL Node" @click="$emit('addNode', 'url')">
        <svg width="20" height="20" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" fill="#13c2c2"/>
          <text x="12" y="16" text-anchor="middle" fill="white">U</text>
        </svg>
      </button>
    </div>
    <div class="node-list-menu">
      <button class="menu-button" @click="showNodeList = !showNodeList">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" fill="currentColor"/>
        </svg>
        <span class="node-count" v-if="nodes.length">{{ nodes.length }}</span>
      </button>
      <div v-if="showNodeList" class="node-list-dropdown">
        <div class="node-list-header">
          <div class="header-title">
            <span>Node List</span>
            <span class="node-count-text">{{ nodes.length }} nodes</span>
          </div>
          <div class="list-actions">
            <button 
              class="action-button"
              :class="{ active: selectedNodes.length === nodes.length }"
              @click.stop="selectAllNodes"
            >
              <svg viewBox="0 0 24 24" width="14" height="14">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" fill="currentColor"/>
                <path d="M18 9l-1.4-1.4-6.6 6.6-2.6-2.6L6 13l4 4z" fill="currentColor"/>
              </svg>
              Select All
            </button>
            <button 
              class="action-button"
              :class="{ active: selectedNodes.length > 0 }"
              @click.stop="deselectAllNodes"
            >
              <svg viewBox="0 0 24 24" width="14" height="14">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" fill="currentColor"/>
              </svg>
              Deselect
            </button>
          </div>
        </div>
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search nodes..."
            @click.stop
          >
        </div>
        <div class="node-list-content">
          <div 
            v-for="node in filteredNodes" 
            :key="node.id"
            class="node-list-item"
            :class="{ selected: selectedNodes.includes(node.id) }"
            @click.stop="toggleNodeSelection(node.id)"
          >
            <div class="node-info">
              <span class="node-type" :class="node.type.toLowerCase()">
                {{ node.type.replace('Node', '') }}
              </span>
              <span class="node-title">{{ node.title }}</span>
            </div>
            <div class="node-actions">
              <button class="icon-btn" title="Edit" @click.stop="editNode(node, $event)">
                <svg viewBox="0 0 24 24" width="14" height="14">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                </svg>
              </button>
              <button 
                v-if="node.type !== 'StartNode'"
                class="icon-btn" 
                title="Connect to Input" 
                @click.stop="connectNode(node, $event, 'input')"
              >
                <svg viewBox="0 0 24 24" width="14" height="14">
                  <path d="M19 15l-6 6-1.42-1.42L15.17 16H4V4h2v10h9.17l-3.59-3.58L13 9l6 6z" fill="currentColor"/>
                </svg>
              </button>
              <button 
                v-if="node.type !== 'EndNode'"
                class="icon-btn" 
                title="Connect from Output" 
                @click.stop="connectNode(node, $event, 'out')"
              >
                <svg viewBox="0 0 90 90" width="14" height="14">
                  <path d="M20.8 53.8h41.5c1.1 0 1.6 1.4.9 2.1l-12 12c-.8.8-.8 1.9 0 2.6l2.8 2.8c.8.8 1.9.8 2.6 0l21.9-22c.8-.8.8-1.9 0-2.6l-22-22c-.8-.8-1.9-.8-2.6 0l-2.6 2.6c-.8.8-.8 1.9 0 2.6l12 12c.8.9.3 2.3-.9 2.3H20.9c-1 0-1.9.8-1.9 1.8v3.8c0 1 .8 2 1.8 2" fill="currentColor"/>
                </svg>
              </button>
              <button class="icon-btn delete" title="Delete" @click.stop="deleteNode(node)">
                <svg viewBox="0 0 24 24" width="14" height="14">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
          <div v-if="filteredNodes.length === 0" class="empty-list">
            No nodes found
          </div>
        </div>
      </div>
    </div>
    <div class="github-button">
      <a href="https://github.com/yeongpin/any-workflows" target="_blank">
        <button class="icon-button">
          <svg width="20" height="20" viewBox="0 0 16 16">
            <path d="M8 1C4.133 1 1 4.13 1 7.993c0 3.09 2.006 5.71 4.787 6.635.35.064.478-.152.478-.337 0-.166-.006-.606-.01-1.19-1.947.423-2.357-.937-2.357-.937-.319-.808-.778-1.023-.778-1.023-.635-.434.048-.425.048-.425.703.05 1.073.72 1.073.72.624 1.07 1.638.76 2.037.582.063-.452.244-.76.444-.935-1.554-.176-3.188-.776-3.188-3.456 0-.763.273-1.388.72-1.876-.072-.177-.312-.888.07-1.85 0 0 .586-.189 1.924.716A6.7 6.7 0 0 1 8 4.381c.595.003 1.194.08 1.753.236 1.336-.905 1.923-.717 1.923-.717.382.963.142 1.674.07 1.85.448.49.72 1.114.72 1.877 0 2.686-1.638 3.278-3.197 3.45.251.216.475.643.475 1.296 0 .934-.009 1.688-.009 1.918 0 .187.127.404.482.336A7 7 0 0 0 15 7.993 6.997 6.997 0 0 0 8 1"/>
          </svg>
        </button>
      </a>
    </div>
    <div class="notification-menu">
      <button 
        class="icon-button" 
        title="Notifications"
        @click="showNotifications = !showNotifications"
      >
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" fill="currentColor"/>
        </svg>
        <span v-if="unreadCount" class="notification-badge">
          {{ unreadCount }}
        </span>
      </button>
      <div v-if="showNotifications" class="notification-history">
        <div class="history-header">
          <h3>Notifications</h3>
          <button @click="clearHistory" class="clear-button">Clear All</button>
        </div>
        <div class="history-content">
          <div 
            v-for="notification in notificationHistory" 
            :key="notification.id"
            class="history-item"
            :class="notification.type"
          >
            <div class="history-message">{{ notification.message }}</div>
            <div class="history-time">{{ formatTime(notification.time) }}</div>
          </div>
          <div v-if="!notificationHistory.length" class="empty-history">
            No notifications
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ActionBar',
  props: {
    notificationHistory: {
      type: Array,
      default: () => []
    },
    nodes: {
      type: Array,
      default: () => []
    }
  },
  emits: [
    'clearHistory',
    'editNode',
    'deleteNode',
    'connectNode'
  ],
  setup(props, { emit }) {
    const showFileMenu = ref(false)
    const showNotifications = ref(false)
    const showNodeList = ref(false)
    const selectedNodes = ref([])
    const searchQuery = ref('')

    const unreadCount = computed(() => {
      return props.notificationHistory.filter(n => !n.read).length
    })

    const formatTime = (time) => {
      return new Date(time).toLocaleString()
    }

    const clearHistory = () => {
      showNotifications.value = false
      emit('clearHistory')
    }

    const toggleNodeSelection = (nodeId) => {
      const index = selectedNodes.value.indexOf(nodeId)
      if (index === -1) {
        selectedNodes.value.push(nodeId)
      } else {
        selectedNodes.value.splice(index, 1)
      }
    }

    const selectAllNodes = () => {
      selectedNodes.value = props.nodes.map(node => node.id)
    }

    const deselectAllNodes = () => {
      selectedNodes.value = []
    }

    const editNode = (node, event) => {
      emit('editNode', node, event)
    }

    const deleteNode = (node) => {
      if (confirm(`Are you sure you want to delete ${node.title}?`)) {
        emit('deleteNode', node)
        showNodeList.value = false
      }
    }

    const connectNode = (node, event, direction) => {
      emit('connectNode', node, event, direction)
    }

    const filteredNodes = computed(() => {
      if (!searchQuery.value) return props.nodes
      const query = searchQuery.value.toLowerCase()
      return props.nodes.filter(node => 
        node.title.toLowerCase().includes(query) ||
        node.type.toLowerCase().includes(query)
      )
    })

    return { 
      showFileMenu, 
      showNotifications,
      unreadCount,
      formatTime,
      clearHistory,
      showNodeList,
      selectedNodes,
      toggleNodeSelection,
      selectAllNodes,
      deselectAllNodes,
      editNode,
      deleteNode,
      connectNode,
      searchQuery,
      filteredNodes
    }
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

.node-list-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 320px;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  margin-top: 8px;
  z-index: 1000;
}

.node-list-header {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-count-text {
  color: #999;
  font-size: 12px;
}

.search-box {
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
}

.search-box input {
  width: 100%;
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  outline: none;
  font-size: 14px;
}

.search-box input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24,144,255,0.2);
}

.empty-list {
  padding: 24px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.node-list-content {
  max-height: 400px;
  overflow-y: auto;
}

.node-list-item {
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.node-list-item:hover {
  background: #f5f5f5;
}

.node-list-item.selected {
  background: #e6f7ff;
}

.node-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-type {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
}

.node-type.startnode {
  background: #1890ff;
}

.node-type.processnode {
  background: #52c41a;
}

.node-type.endnode {
  background: #f5222d;
}

.node-type.imagenode {
  background: #faad14;
}

.node-type.videonode {
  background: #722ed1;
}

.node-type.urlnode {
  background: #13c2c2;
}

.node-title {
  font-size: 14px;
  color: #333;
}

.node-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.node-list-item:hover .node-actions {
  opacity: 1;
}

.icon-btn {
  padding: 4px;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
}

.icon-btn:hover {
  background: #e6f7ff;
  color: #1890ff;
}

.icon-btn.delete:hover {
  background: #fff1f0;
  color: #f5222d;
}

.node-list-menu {
  position: relative;
  margin-left: auto;
}

.menu-button {
  width: 40px;
  height: 40px;
  padding: 8px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.node-count {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #1890ff;
  color: white;
  border-radius: 10px;
  padding: 0 6px;
  font-size: 12px;
  line-height: 16px;
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


.notification-menu {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4d4f;
  color: white;
  border-radius: 10px;
  padding: 0 6px;
  font-size: 12px;
  line-height: 16px;
  min-width: 16px;
  text-align: center;
}

.notification-history {
  position: absolute;
  top: 100%;
  right: 0;
  width: 300px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  margin-top: 8px;
  z-index: 1000;
}

.history-header {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-header h3 {
  margin: 0;
  font-size: 16px;
}

.clear-button {
  background: none;
  border: none;
  color: #1890ff;
  cursor: pointer;
  font-size: 14px;
}

.clear-button:hover {
  color: #40a9ff;
}

.history-content {
  max-height: 400px;
  overflow-y: auto;
}

.history-item {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.history-item:hover {
  background: #f5f5f5;
}

.history-message {
  margin-bottom: 4px;
}

.history-time {
  font-size: 12px;
  color: #999;
}

.empty-history {
  padding: 24px;
  text-align: center;
  color: #999;
}

.history-item.success {
  border-left: 4px solid #52c41a;
}

.history-item.error {
  border-left: 4px solid #ff4d4f;
}

.history-item.info {
  border-left: 4px solid #1890ff;
}

.list-actions {
  display: flex;
  gap: 8px;
  padding: 0 12px;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-button:hover {
  color: #1890ff;
  border-color: #1890ff;
  background: #e6f7ff;
}

.action-button.active {
  color: #1890ff;
  border-color: #1890ff;
  background: #e6f7ff;
}

.action-button svg {
  opacity: 0.7;
}

.action-button:hover svg,
.action-button.active svg {
  opacity: 1;
}
</style>