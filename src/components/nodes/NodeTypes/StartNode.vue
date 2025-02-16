<template>
  <base-node :node="node" @nodeSelected="$emit('nodeSelected', node)" class="start-node">
    <div class="start-node-content">
      <svg class="start-icon" viewBox="0 0 24 24" width="24" height="24">
        <path 
          d="M8 5v14l11-7z" 
          fill="currentColor"
        />
      </svg>
    </div>
    <!-- 只保留右側端口 -->
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
  name: 'StartNode',
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
        // Alt + 左鍵：斷開連接
        this.disconnectPort(event)
      } else if (event.ctrlKey) {
        // Ctrl + 左鍵：重新連接
        this.startConnection(event)
      } else {
        // 普通左鍵：開始連接
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
        portType: 'out'
      })
    },

    startConnection(event) {
      this.$emit('connection-start', {
        nodeId: this.node.id,
        portType: 'out'
      })
    },
    endConnection(event) {
      this.$emit('connection-end', {
        nodeId: this.node.id,
        portType: 'out'
      })
    },
    showPortMenu(event) {
      console.log('Port context menu triggered')
      this.$emit('port-context-menu', event, this.node.id, 'out')
    }
  }
}
</script>

<style scoped>
.start-node {
  background: #e6f7ff;
  border: 2px solid #1890ff;
}

.start-node-content {
  padding: 10px;
  text-align: center;
}

.port-out {
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background: #666;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.port-out:hover {
  transform: translateY(-50%) scale(1.2);
  background: #1890ff;
  box-shadow: 0 0 0 4px rgba(24,144,255,0.2);
}
</style> 