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
import { computed, watch } from 'vue'

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
    const getPortPosition = (node, isOutput) => {
      // 固定的端口水平位置
      const portX = isOutput ? 150 : 0

      // 根據節點類型決定端口垂直位置
      let portY = 35 // 默認高度
      
      if (node.type === 'ImageNode') {
        portY = 110 // Image 節點的端口位置
      } else if (node.type === 'ProcessNode' || node.type === 'EndNode') {
        portY = 60 // Process 節點的端口位置
      } else if (node.type === 'StartNode') {
        portY = 65 // Start 和 End 節點的端口位置
      } else if (node.type === 'VideoNode') {
        portY = 108 // Video 節點的端口位置
      }

      return {
        x: node.position.x + portX,
        y: node.position.y + portY
      }
    }

    const pathData = computed(() => {
      const startNode = props.nodes.find(n => n.id === props.connection.start)
      const endNode = props.nodes.find(n => n.id === props.connection.end)
      
      if (!startNode || !endNode) {
        console.warn('Nodes not found for connection:', props.connection)
        return ''
      }

      // 計算起點和終點位置
      const isStartOutput = props.connection.startPort === 'out'
      const isEndOutput = props.connection.endPort === 'out'
      
      const start = getPortPosition(startNode, isStartOutput)
      const end = getPortPosition(endNode, isEndOutput)

      // 計算控制點
      const dx = Math.abs(end.x - start.x) * 0.5
      let startControlX, endControlX

      // 根據連接方向調整控制點
      if (isStartOutput) {
        startControlX = start.x + dx
        endControlX = end.x - dx
      } else {
        startControlX = start.x - dx
        endControlX = end.x + dx
      }

      // 確保控制點在起點和終點之間
      if (start.x < end.x) {
        startControlX = Math.min(startControlX, end.x)
        endControlX = Math.max(endControlX, start.x)
      } else {
        startControlX = Math.max(startControlX, end.x)
        endControlX = Math.min(endControlX, start.x)
      }

      // 生成貝塞爾曲線路徑
      return `M ${start.x} ${start.y} C ${startControlX} ${start.y}, ${endControlX} ${end.y}, ${end.x} ${end.y}`
    })

    // 監聽節點位置變化
    watch(() => props.nodes, () => {
      // 當節點位置更新時，路徑會自動重新計算
    }, { deep: true })

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
  transition: stroke 0.3s, stroke-width 0.3s;
}

path:hover {
  stroke: #1890ff !important;
  stroke-width: 3;
}
</style> 