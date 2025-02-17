<template>
  <div 
    v-if="show"
    class="port-context-menu"
    :style="menuStyle"
    @click.stop
  >
    <div class="menu-header">
      <div class="menu-title">Connect to:</div>
      <div class="port-type">{{ sourcePort === 'out' ? 'Output' : 'Input' }} Port</div>
    </div>
    <div class="menu-content">
      <div 
        v-for="node in availableNodes"
        :key="node.id"
        class="menu-item"
        @click="$emit('select', node.id)"
      >
        <div class="menu-icon">
          <svg v-if="node.type === 'StartNode'" viewBox="0 0 24 24" width="16" height="16">
            <circle cx="12" cy="12" r="8" fill="#1890ff"/>
            <text x="12" y="16" text-anchor="middle" fill="white" font-size="10">S</text>
          </svg>
          <svg v-else-if="node.type === 'ProcessNode'" viewBox="0 0 24 24" width="16" height="16">
            <rect x="4" y="4" width="16" height="16" rx="2" fill="#52c41a"/>
            <text x="12" y="16" text-anchor="middle" fill="white" font-size="10">P</text>
          </svg>
          <svg v-else-if="node.type === 'EndNode'" viewBox="0 0 24 24" width="16" height="16">
            <circle cx="12" cy="12" r="8" fill="#ff4d4f"/>
            <text x="12" y="16" text-anchor="middle" fill="white" font-size="10">E</text>
          </svg>
          <svg v-else-if="node.type === 'ImageNode'" viewBox="0 0 24 24" width="16" height="16">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="#597ef7"/>
          </svg>
          <svg v-else-if="node.type === 'VideoNode'" viewBox="0 0 24 24" width="16" height="16">
            <path d="M8 5v14l11-7z" fill="#597ef7"/>
          </svg>
          <svg v-else-if="node.type === 'URLNode'" viewBox="0 0 24 24" width="16" height="16">
            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" fill="#13c2c2"/>
          </svg>
        </div>
        <span class="node-title">{{ node.title }}</span>
      </div>
      <div v-if="!availableNodes.length" class="empty-message">
        No available nodes to connect
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PortContextMenu',
  props: {
    show: Boolean,
    position: Object,
    sourceNode: String,
    sourcePort: String,
    nodes: Array
  },
  emits: ['select'],
  computed: {
    menuStyle() {
      return {
        left: `${this.position.x}px`,
        top: `${this.position.y}px`
      }
    },
    availableNodes() {
      return this.nodes.filter(node => {
        // 排除源節點
        if (node.id === this.sourceNode) return false
        
        // 根據端口類型過濾可連接的節點
        if (this.sourcePort === 'out') {
          return node.type !== 'StartNode'
        } else {
          return node.type !== 'EndNode'
        }
      })
    }
  }
}
</script>

<style scoped>
.port-context-menu {
  position: fixed;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  padding: 0;
  min-width: 200px;
  z-index: 1100;
}

.menu-header {
  padding: 8px 12px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  border-radius: 4px 4px 0 0;
}

.menu-title {
  font-weight: 500;
  color: #333;
}

.port-type {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.menu-content {
  max-height: 300px;
  overflow-y: auto;
}

.menu-item {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.menu-item:hover {
  background: #f5f5f5;
}

.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.node-title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-message {
  padding: 16px;
  text-align: center;
  color: #999;
  font-style: italic;
}
</style> 