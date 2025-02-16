<template>
  <div 
    v-if="show"
    class="port-context-menu"
    :style="menuStyle"
    @click.stop
  >
    <div class="menu-title">Connect to:</div>
    <div 
      v-for="node in availableNodes"
      :key="node.id"
      class="menu-item"
      @click="$emit('select', node.id)"
    >
      {{ node.title }}
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
  padding: 4px 0;
  min-width: 120px;
  z-index: 1100;
}

.menu-title {
  padding: 5px 12px;
  color: #999;
  font-size: 12px;
}

.menu-item {
  padding: 5px 12px;
  cursor: pointer;
}

.menu-item:hover {
  background: #f5f5f5;
}
</style> 