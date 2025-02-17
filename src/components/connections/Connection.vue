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
    const nodeWidth = ref(new Map())

    const updateNodeWidth = (node) => {
      const nodeElement = document.querySelector(`[data-node-id="${node.id}"]`)
      if (nodeElement) {
        const newWidth = nodeElement.offsetWidth
        const oldWidth = nodeWidth.value.get(node.id)
        
        if (newWidth !== oldWidth) {
          nodeWidth.value.set(node.id, newWidth)
          console.log(`Node ${node.type} width updated: ${newWidth}px`)
          return true
        }
      }
      return false
    }

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
      const width = nodeWidth.value.get(node.id) || updateNodeWidth(node)
      const portX = isOutput ? width : 0
      const height = nodeHeights.value.get(node.id) || updateNodeHeight(node)
      const portY = height ? height / 2 : 35

      return {
        x: node.position.x + portX,
        y: node.position.y + portY
      }
    }

    // 監聽節點變化
    watch(() => props.nodes, (newNodes, oldNodes) => {
      let dimensionsChanged = false
      
      // 檢查相關節點的尺寸是否變化
      const startNode = newNodes.find(n => n.id === props.connection.start)
      const endNode = newNodes.find(n => n.id === props.connection.end)
      
      if (startNode) {
        dimensionsChanged = updateNodeWidth(startNode) || dimensionsChanged
        dimensionsChanged = updateNodeHeight(startNode) || dimensionsChanged
      }
      if (endNode) {
        dimensionsChanged = updateNodeWidth(endNode) || dimensionsChanged
        dimensionsChanged = updateNodeHeight(endNode) || dimensionsChanged
      }

      if (dimensionsChanged) {
        console.log('Node dimensions updated:', 
          startNode && `${startNode.type}: ${nodeWidth.value.get(startNode.id)}x${nodeHeights.value.get(startNode.id)}`,
          endNode && `${endNode.type}: ${nodeWidth.value.get(endNode.id)}x${nodeHeights.value.get(endNode.id)}`
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

      // 確保尺寸已更新
      updateNodeWidth(startNode)
      updateNodeWidth(endNode)
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