<template>
  <div 
    class="notification"
    :class="type"
    @click="$emit('close')"
  >
    <div class="icon">
      <svg v-if="type === 'success'" viewBox="0 0 24 24" width="20" height="20">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
      </svg>
      <svg v-else-if="type === 'error'" viewBox="0 0 24 24" width="20" height="20">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor"/>
      </svg>
      <svg v-else viewBox="0 0 24 24" width="20" height="20">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
      </svg>
    </div>
    <div class="content">
      <div class="message">{{ message }}</div>
      <div class="time">{{ formatTime }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  props: {
    message: String,
    type: {
      type: String,
      default: 'info'
    },
    time: {
      type: Date,
      required: true
    }
  },
  computed: {
    formatTime() {
      return this.time.toLocaleTimeString()
    }
  }
}
</script>

<style scoped>
.notification {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s;
  gap: 8px;
  min-width: 300px;
}

.notification:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  flex: 1;
}

.message {
  margin-bottom: 4px;
}

.time {
  font-size: 12px;
  color: #999;
}

.success {
  border-left: 4px solid #52c41a;
}

.success .icon {
  color: #52c41a;
}

.error {
  border-left: 4px solid #ff4d4f;
}

.error .icon {
  color: #ff4d4f;
}

.info {
  border-left: 4px solid #1890ff;
}

.info .icon {
  color: #1890ff;
}
</style> 