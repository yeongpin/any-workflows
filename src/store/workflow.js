import { defineStore } from 'pinia'

export const useWorkflowStore = defineStore('workflow', {
  state: () => ({
    nodes: [],
    connections: [],
    selectedNode: null
  }),

  actions: {
    addNode(nodeData) {
      const newNode = {
        id: `node-${Date.now()}`,
        ...nodeData
      }
      this.nodes.push(newNode)
    },

    addConnection(startNode, endNode) {
      const newConnection = {
        id: `conn-${Date.now()}`,
        start: startNode.id,
        end: endNode.id
      }
      this.connections.push(newConnection)
    },

    updateNodePosition(nodeId, position) {
      const node = this.nodes.find(n => n.id === nodeId)
      if (node) {
        node.position = position
      }
    }
  }
}) 