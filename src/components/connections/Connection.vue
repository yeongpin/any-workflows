<template>
  <path
    :d="pathData"
    fill="none"
    :stroke="connection.selected ? '#1890ff' : '#666'"
    :stroke-width="connection.selected ? 3 : 2"
    @click="$emit('select', connection.id)"
  />
</template>

<script>
import { computed, watch, ref } from 'vue'

export default {
  name: 'Connection',
  props: {
    connection: {
      type: Object,
      required: true
    },
    nodes: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    // 緩存節點高度
    const nodeHeights = ref(new Map())

    const updateNodeHeight = (node) => {
      const nodeElement = document.querySelector(`[data-node-id="${node.id}"]`)
      if (nodeElement) {
        const newHeight = nodeElement.offsetHeight
        const oldHeight = nodeHeights.value.get(node.id)
        
        if (newHeight !== oldHeight) {
          nodeHeights.value.set(node.id, newHeight)
          return true
        }
      }
      return false
    }

    const getPortPosition = (node, isOutput) => {
      const portX = isOutput ? 150 : 0
      const height = nodeHeights.value.get(node.id) || updateNodeHeight(node)
      const portY = height ? height / 2 : 35 // 默認高度為 35

      return {
        x: node.position.x + portX,
        y: node.position.y + portY
      }
    }

    // 監聽節點變化
    watch(() => props.nodes, (newNodes, oldNodes) => {
      let heightChanged = false
      
      // 檢查相關節點的高度是否變化
      const startNode = newNodes.find(n => n.id === props.connection.start)
      const endNode = newNodes.find(n => n.id === props.connection.end)
      
      if (startNode) {
        heightChanged = updateNodeHeight(startNode) || heightChanged
      }
      if (endNode) {
        heightChanged = updateNodeHeight(endNode) || heightChanged
      }

      if (heightChanged) {
        console.log('Node heights updated:', 
          startNode && `${startNode.type}: ${nodeHeights.value.get(startNode.id)}px`,
          endNode && `${endNode.type}: ${nodeHeights.value.get(endNode.id)}px`
        )
      }
    }, { deep: true, immediate: true })

    const pathData = computed(() => {
      const startNode = props.nodes.find(n => n.id === props.connection.start)
      const endNode = props.nodes.find(n => n.id === props.connection.end)
      
      if (!startNode || !endNode) {
        console.warn('Nodes not found for connection:', props.connection)
        return ''
      }

      // 確保高度已更新
      updateNodeHeight(startNode)
      updateNodeHeight(endNode)

      const isStartOutput = props.connection.startPort === 'out'
      const isEndOutput = props.connection.endPort === 'out'
      
      const start = getPortPosition(startNode, isStartOutput)
      const end = getPortPosition(endNode, isEndOutput)

      const dx = Math.abs(end.x - start.x) * 0.5
      let startControlX, endControlX

      if (isStartOutput) {
        startControlX = start.x + dx
        endControlX = end.x - dx
      } else {
        startControlX = start.x - dx
        endControlX = end.x + dx
      }

      if (start.x < end.x) {
        startControlX = Math.min(startControlX, end.x)
        endControlX = Math.max(endControlX, start.x)
      } else {
        startControlX = Math.max(startControlX, end.x)
        endControlX = Math.min(endControlX, start.x)
      }

      return `M ${start.x} ${start.y} C ${startControlX} ${start.y}, ${endControlX} ${end.y}, ${end.x} ${end.y}`
    })

    return {
      pathData
    }
  }
}
</script>

<style scoped>
path {
  pointer-events: all;
  cursor: pointer;
}

path:hover {
  stroke: #1890ff !important;
  stroke-width: 3;
}
</style> 