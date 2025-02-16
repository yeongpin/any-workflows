<template>
  <div 
    class="node"
    :style="nodeStyle"
    :data-coords="`(${Math.round(node.position.x)}, ${Math.round(node.position.y)})`"
    :data-node-id="node.id"
    @mousedown="startDrag"
    @contextmenu.prevent="showContextMenu"
  >
    <div class="node-header">
      {{ node.title }}
    </div>
    <div class="node-content">
      <div class="node-text" style="white-space: pre-wrap;">{{ node.content }}</div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'BaseNode',
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  emits: [
    'update:position', 
    'nodeSelected',
    'connection-start',
    'connection-end',
    'node-context-menu'
  ],
  setup(props, { emit }) {
    const isDragging = ref(false)
    const startPos = ref({ x: 0, y: 0 })
    const nodeStartPos = ref({ x: 0, y: 0 })
    const scale = ref(1)

    const handleDrag = (event) => {
      if (!isDragging.value) return

      requestAnimationFrame(() => {
        if (!startPos.value || !nodeStartPos.value) return

        const dx = (event.clientX - startPos.value.x) / scale.value
        const dy = (event.clientY - startPos.value.y) / scale.value

        const newPosition = {
          x: Math.round(nodeStartPos.value.x + dx),
          y: Math.round(nodeStartPos.value.y + dy)
        }

        if (typeof newPosition.x === 'number' && typeof newPosition.y === 'number') {
          emit('update:position', props.node.id, newPosition)
        }
      })
    }

    const handleMouseUp = (event) => {
      if (!isDragging.value) return
      
      isDragging.value = false
      document.removeEventListener('mousemove', handleDrag)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseUp)
    }

    const startDrag = (event) => {
      if (event.target.classList.contains('port')) return
      
      event.stopPropagation()
      event.preventDefault()
      
      isDragging.value = true
      startPos.value = {
        x: event.clientX,
        y: event.clientY
      }
      
      nodeStartPos.value = props.node.position ? { ...props.node.position } : { x: 0, y: 0 }
      
      emit('nodeSelected', props.node)

      document.addEventListener('mousemove', handleDrag, { passive: true })
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('mouseleave', handleMouseUp)
    }

    const startConnection = (event) => {
      emit('connection-start', {
        nodeId: props.node.id,
        portType: event.target.classList.contains('port-in') ? 'in' : 'out'
      })
    }

    const endConnection = (event) => {
      emit('connection-end', {
        nodeId: props.node.id,
        portType: event.target.classList.contains('port-in') ? 'in' : 'out'
      })
    }

    const showContextMenu = (event) => {
      emit('node-context-menu', event, props.node)
    }

    onUnmounted(() => {
      document.removeEventListener('mousemove', handleDrag)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseUp)
    })

    return {
      isDragging,
      startDrag,
      startConnection,
      endConnection,
      showContextMenu
    }
  },
  computed: {
    nodeStyle() {
      return {
        left: `${this.node.position.x}px`,
        top: `${this.node.position.y}px`,
        zIndex: this.isDragging ? 1000 : 1,
        transform: 'none',
        position: 'absolute',
        cursor: this.isDragging ? 'grabbing' : 'grab',
        transition: this.isDragging ? 'none' : 'transform 0.05s ease'
      }
    }
  }
}
</script>

<style scoped>
.node {
  position: absolute;
  min-width: 150px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  user-select: none;
  z-index: 100;
  touch-action: none;
  will-change: transform, left, top;
  pointer-events: all;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

.node-header {
  padding: 8px;
  border-bottom: 1px solid #e8e8e8;
  font-weight: 500;
  text-rendering: optimizeLegibility;
}

.node-content {
  padding: 8px;
}

.node-ports {
  position: relative;
  height: 100%;
}

.port {
  width: 12px;
  height: 12px;
  background: #666;
  border-radius: 50%;
  position: absolute;
  cursor: pointer;
  transition: transform 0.2s;
}

.port:hover {
  transform: scale(1.2);
  background: #1890ff;
}

.port-in {
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
}

.port-out {
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
}

.port-in:hover, .port-out:hover {
  box-shadow: 0 0 0 4px rgba(24,144,255,0.2);
}

.node-text {
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 14px;
  line-height: 1.5;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style> 