<template>
  <base-node :node="node" @nodeSelected="$emit('nodeSelected', node)" class="process-node">
    <div class="process-node-content">
      <svg class="process-icon" viewBox="0 0 24 24" width="24" height="24">
        <path 
          d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" 
          fill="currentColor"
        />
      </svg>
    </div>
    <!-- 左右兩側端口 -->
    <div 
      class="port port-in" 
      @mousedown.stop="handlePortMouseDown"
      @mouseup.stop="handlePortMouseUp"
      @contextmenu.prevent.stop="showPortMenu"
    ></div>
    <div 
      class="port port-out" 
      @mousedown.stop="handlePortMouseDown"
      @mouseup.stop="handlePortMouseUp"
      @contextmenu.prevent.stop="showPortMenu"
    ></div>
  </base-node>
</template>

<script>
import BaseNode from '../BaseNode.vue'

export default {
  name: 'ProcessNode',
  components: {
    BaseNode
  },
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  emits: [
    'nodeSelected',
    'connection-start',
    'connection-end',
    'port-context-menu',
    'disconnect-port'
  ],
  methods: {
    handlePortMouseDown(event) {
      if (event.altKey) {
        this.disconnectPort(event)
      } else if (event.ctrlKey) {
        this.startConnection(event)
      } else {
        this.startConnection(event)
      }
    },

    handlePortMouseUp(event) {
      if (!event.altKey && !event.ctrlKey) {
        this.endConnection(event)
      }
    },

    disconnectPort(event) {
      const portType = event.target.classList.contains('port-in') ? 'in' : 'out'
      this.$emit('disconnect-port', {
        nodeId: this.node.id,
        portType
      })
    },

    startConnection(event) {
      const portType = event.target.classList.contains('port-in') ? 'in' : 'out'
      this.$emit('connection-start', {
        nodeId: this.node.id,
        portType
      })
    },

    endConnection(event) {
      const portType = event.target.classList.contains('port-in') ? 'in' : 'out'
      this.$emit('connection-end', {
        nodeId: this.node.id,
        portType
      })
    },

    showPortMenu(event) {
      const portType = event.target.classList.contains('port-in') ? 'in' : 'out'
      this.$emit('port-context-menu', event, this.node.id, portType)
    }
  }
}
</script>

<style scoped>
.process-node {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
}

.process-node-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  color: #52c41a;
}

.process-icon {
  width: 24px;
  height: 24px;
}

.port {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  background: #666;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}
.port-in {
  left: -6px;
  transform: translateY(-50%);
}
.port-out {
  right: -6px;
  transform: translateY(-50%);
}
.port:hover {
  transform: translateY(-50%) scale(1.2);
  background: #1890ff;
  box-shadow: 0 0 0 4px rgba(24,144,255,0.2);
}
</style> 