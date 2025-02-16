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
  computed: {
    pathData() {
      const startNode = this.nodes.find(n => n.id === this.connection.start)
      const endNode = this.nodes.find(n => n.id === this.connection.end)
      
      if (!startNode || !endNode) return ''

      // 獲取節點元素
      const startElement = document.querySelector(`[data-node-id="${this.connection.start}"]`)
      const endElement = document.querySelector(`[data-node-id="${this.connection.end}"]`)
      
      if (!startElement || !endElement) return ''

      // 獲取端口元素
      const startPort = startElement.querySelector(`.port-${this.connection.startPort}`)
      const endPort = endElement.querySelector(`.port-${this.connection.endPort}`)
      
      if (!startPort || !endPort) return ''

      // 計算端口的絕對位置
      const startRect = startPort.getBoundingClientRect()
      const endRect = endPort.getBoundingClientRect()
      const canvasRect = document.querySelector('.workflow-canvas').getBoundingClientRect()

      const start = {
        x: startNode.position.x + (this.connection.startPort === 'out' ? 150 : 0),
        y: startNode.position.y + startPort.offsetTop + startPort.offsetHeight / 2
      }

      const end = {
        x: endNode.position.x + (this.connection.endPort === 'out' ? 150 : 0),
        y: endNode.position.y + endPort.offsetTop + endPort.offsetHeight / 2
      }

      // 計算控制點
      const dx = Math.abs(end.x - start.x) * 0.5
      const startControl = {
        x: start.x + (this.connection.startPort === 'out' ? dx : -dx),
        y: start.y
      }
      const endControl = {
        x: end.x + (this.connection.endPort === 'out' ? dx : -dx),
        y: end.y
      }

      return `M ${start.x} ${start.y} C ${startControl.x} ${startControl.y}, ${endControl.x} ${endControl.y}, ${end.x} ${end.y}`
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