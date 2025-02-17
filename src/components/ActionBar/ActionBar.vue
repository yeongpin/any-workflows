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
    }
  },
  emits: ['clearHistory'],
  setup(props, { emit }) {
    const showFileMenu = ref(false)
    const showNotifications = ref(false)

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

    return { 
      showFileMenu, 
      showNotifications, 
      unreadCount,
      formatTime,
      clearHistory
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
  margin-left: auto;
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
</style> 