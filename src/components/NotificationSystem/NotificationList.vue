<template>
  <div class="notification-container">
    <transition-group name="notification">
      <notification
        v-for="notification in notifications"
        :key="notification.id"
        v-bind="notification"
        @close="$emit('remove', notification.id)"
      />
    </transition-group>
  </div>
</template>

<script>
import Notification from './Notification.vue'

export default {
  name: 'NotificationList',
  components: {
    Notification
  },
  props: {
    notifications: {
      type: Array,
      default: () => []
    }
  },
  emits: ['remove']
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 9999;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style> 