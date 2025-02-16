<template>
  <base-node :node="node" @nodeSelected="$emit('nodeSelected', node)" class="end-node">
    <div class="end-node-content">
      <svg class="end-icon" viewBox="0 0 24 24" width="24" height="24">
        <path 
          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
          fill="currentColor"
        />
      </svg>
    </div>
    <!-- 只保留左側端口 -->
    <div 
      class="port port-in" 
      @mousedown.stop="handlePortMouseDown"
      @mouseup.stop="handlePortMouseUp"
      @contextmenu.prevent.stop="showPortMenu"
    ></div>
  </base-node>
</template>

<script>
import BaseNode from '../BaseNode.vue'

export default {
  name: 'EndNode',
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
        this.disconnectPort()
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

    disconnectPort() {
      this.$emit('disconnect-port', {
        nodeId: this.node.id,
        portType: 'in'
      })
    },

    startConnection(event) {
      this.$emit('connection-start', {
        nodeId: this.node.id,
        portType: 'in'
      })
    },

    endConnection(event) {
      this.$emit('connection-end', {
        nodeId: this.node.id,
        portType: 'in'
      })
    },

    showPortMenu(event) {
      this.$emit('port-context-menu', event, this.node.id, 'in')
    }
  }
}
</script>

<style scoped>
.end-node {
  background: #fff1f0;
  border: 1px solid #ffa39e;
}

.end-node-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  color: #ff4d4f;
}

.port-in {
  position: absolute;
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background: #666;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}
.port-in:hover {
  transform: translateY(-50%) scale(1.2);
  background: #1890ff;
  box-shadow: 0 0 0 4px rgba(24,144,255,0.2);
}
</style> 