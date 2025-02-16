<template>
  <div class="tab-bar">
    <div 
      v-for="tab in tabs" 
      :key="tab.id"
      :class="['tab', { active: tab.id === activeTabId }]"
      @click="$emit('switchTab', tab.id)"
    >
      {{ tab.title }}
      <button 
        v-if="tabs.length > 1" 
        class="close-tab"
        @click.stop="$emit('closeTab', tab.id)"
      >
        ×
      </button>
    </div>
    <button class="add-tab" @click="$emit('newTab')">+</button>
  </div>
</template>

<script>
export default {
  name: 'TabBar',
  props: {
    tabs: {
      type: Array,
      required: true
    },
    activeTabId: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.tab-bar {
  display: flex;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  padding: 0 8px;
  height: 40px;
  align-items: center;
  gap: 2px;
}

.tab {
  padding: 8px 16px;
  background: #f0f0f0;
  border: 1px solid #e8e8e8;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  margin-top: 8px;
}

.tab.active {
  background: white;
  border-bottom: 1px solid white;
  margin-bottom: -1px;
}

.close-tab {
  background: none;
  border: none;
  padding: 0 4px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  color: #999;
}

.close-tab:hover {
  color: #666;
}

.add-tab {
  padding: 4px 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #999;
  margin-left: 8px;
}

.add-tab:hover {
  color: #666;
}
</style> 