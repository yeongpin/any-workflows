import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useWorkflowStore } from './store/workflow'
import ActionBar from './components/ActionBar/ActionBar.vue'
import TabBar from './components/TabBar/TabBar.vue'
import ContextMenu from './components/ContextMenu.vue'
import Connection from './components/connections/Connection.vue'
import StartNode from './components/nodes/NodeTypes/StartNode.vue'
import ProcessNode from './components/nodes/NodeTypes/ProcessNode.vue'
import EndNode from './components/nodes/NodeTypes/EndNode.vue'
import PortContextMenu from './components/PortContextMenu.vue'
import NodeContextMenu from './components/NodeContextMenu.vue'

export default {
  name: 'App',
  components: {
    ActionBar,
    TabBar,
    ContextMenu,
    Connection,
    StartNode,
    ProcessNode,
    EndNode,
    PortContextMenu,
    NodeContextMenu
  },
  setup() {
    const store = useWorkflowStore()
    const showMenu = ref(false)
    const menuPosition = ref({ x: 0, y: 0 })
    const isCanvasDragging = ref(false)
    const lastMousePosition = ref({ x: 0, y: 0 })
    const selectedNode = ref(null)
    const scale = ref(1)
    const pan = ref({ x: 0, y: 0 })
    const cursorCoords = ref({ x: 0, y: 0 })
    const tempConnectionStart = ref(null)
    const mousePosition = ref({ x: 0, y: 0 })
    const canvasWidth = ref(2000) // 或使用實際畫布寬度
    const canvasHeight = ref(2000) // 或使用實際畫布高度
    
    // 標籤頁管理
    const tabs = ref([
      { id: 'tab-1', title: 'Untitled-1', workflow: { nodes: [], connections: [] } }
    ])
    const activeTabId = ref('tab-1')
    
    const currentWorkflow = computed(() => {
      return tabs.value.find(tab => tab.id === activeTabId.value).workflow
    })

    // 標籤頁操作方法
    const createNewTab = () => {
      const newTabId = `tab-${tabs.value.length + 1}`
      tabs.value.push({
        id: newTabId,
        title: `Untitled-${tabs.value.length + 1}`,
        workflow: { nodes: [], connections: [] }
      })
      activeTabId.value = newTabId
    }

    const switchTab = (tabId) => {
      activeTabId.value = tabId
    }

    const closeTab = (tabId) => {
      const index = tabs.value.findIndex(tab => tab.id === tabId)
      if (index > -1) {
        tabs.value.splice(index, 1)
        if (activeTabId.value === tabId) {
          activeTabId.value = tabs.value[Math.max(0, index - 1)].id
        }
      }
    }

    // 文件操作方法
    const createNewWorkflow = () => {
      createNewTab()
    }

    const saveWorkflow = () => {
      // 實現保存功能
    }

    const openWorkflow = () => {
      // 實現打開功能
    }

    const exportWorkflow = () => {
      // 實現導出功能
    }

    const importWorkflow = () => {
      // 實現導入功能
    }

    const showContextMenu = (event) => {
      event.preventDefault()
      menuPosition.value = {
        x: event.clientX,
        y: event.clientY
      }
      showMenu.value = true
    }

    const closeContextMenu = () => {
      showMenu.value = false
      portContextMenu.value.show = false
      nodeContextMenu.value.show = false
    }

    const handleCanvasContentMouseDown = (event) => {
      // 檢查是否點擊了節點或端口
      let target = event.target;
      while (target !== null) {
        if (target.classList.contains('node') || target.classList.contains('port')) {
          return;
        }
        target = target.parentElement;
      }

      // 如果不是點擊節點或端口，則開始拖動畫布
      isCanvasDragging.value = true;
      lastMousePosition.value = {
        x: event.clientX,
        y: event.clientY
      };
    }

    const handleMouseMove = (event) => {
      const rect = event.currentTarget.getBoundingClientRect()
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top
      
      cursorCoords.value = {
        x: Math.round((mouseX - pan.value.x) / scale.value),
        y: Math.round((mouseY - pan.value.y) / scale.value)
      }

      if (isCanvasDragging.value) {
        const dx = event.clientX - lastMousePosition.value.x
        const dy = event.clientY - lastMousePosition.value.y
        
        pan.value.x += dx
        pan.value.y += dy
        
        lastMousePosition.value = {
          x: event.clientX,
          y: event.clientY
        }
      }

      // 更新臨時連線的鼠標位置
      if (tempConnectionStart.value) {
        const canvasRect = document.querySelector('.canvas-content').getBoundingClientRect()
        mousePosition.value = {
          x: (event.clientX - canvasRect.left) / scale.value,
          y: (event.clientY - canvasRect.top) / scale.value
        }
      }
    }

    const handleCanvasMouseUp = () => {
      isCanvasDragging.value = false
    }

    const selectNode = (node) => {
      selectedNode.value = node
    }

    const addNode = (nodeData) => {
      store.addNode(nodeData)
    }

    const nodeCounters = ref({
      start: 0,
      process: 0,
      end: 0
    })

    const addNodeFromToolbar = (type) => {
      const canvas = document.querySelector('.workflow-canvas')
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const nodeType = type.toString()
      const timestamp = Date.now()
      const uniqueId = `${nodeType.toLowerCase()}-${timestamp}`
      
      // 增加計數器
      nodeCounters.value[nodeType.toLowerCase()]++
      const count = nodeCounters.value[nodeType.toLowerCase()]

      // 修改位置計算
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const position = {
        x: Math.round((centerX - pan.value.x) / scale.value),
        y: Math.round((centerY - pan.value.y) / scale.value)
      }

      const newNode = {
        id: uniqueId,
        type: `${nodeType}Node`,
        title: `${nodeType} Node #${count.toString().padStart(2, '0')}`,
        content: nodeType,
        position: { ...position }  // 確保創建新的對象
      }

      currentWorkflow.value.nodes.push(newNode)
    }

    const connectionStart = ref(null)
    const connectionEnd = ref(null)
    const tempConnection = ref(null)

    const handleConnectionStart = (data) => {
      console.log('Connection start:', data)
      const nodeElement = document.querySelector(`[data-node-id="${data.nodeId}"]`)
      if (!nodeElement) return

      const portElement = nodeElement.querySelector(`.port-${data.portType}`)
      if (!portElement) return

      const portRect = portElement.getBoundingClientRect()
      const canvasRect = document.querySelector('.canvas-content').getBoundingClientRect()

      tempConnectionStart.value = {
        nodeId: data.nodeId,
        portType: data.portType,
        position: {
          x: (portRect.left - canvasRect.left) / scale.value,
          y: (portRect.top - canvasRect.top) / scale.value + (portRect.height / 2 / scale.value)
        }
      }
    }

    const handleConnectionEnd = (data) => {
      console.log('Connection end:', data)
      if (tempConnectionStart.value && 
          tempConnectionStart.value.nodeId !== data.nodeId &&
          tempConnectionStart.value.portType !== data.portType) {
        const newConnection = {
          id: `conn-${Date.now()}`,
          start: tempConnectionStart.value.nodeId,
          startPort: tempConnectionStart.value.portType,
          end: data.nodeId,
          endPort: data.portType
        }
        currentWorkflow.value.connections.push(newConnection)
        console.log('New connection created:', newConnection)
      }
      tempConnectionStart.value = null
    }

    const resetZoom = () => {
      // 保存當前的平移值
      const currentPan = { ...pan.value }
      
      // 獲取當前縮放中心（畫布中心）
      const canvas = document.querySelector('.workflow-canvas')
      if (!canvas) return
      
      const rect = canvas.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      // 計算當前中心點在世界坐標系中的位置
      const worldX = (centerX - currentPan.x) / scale.value
      const worldY = (centerY - currentPan.y) / scale.value

      // 重置縮放值為 1
      scale.value = 1

      // 更新平移值以保持視角中心點不變
      pan.value = {
        x: centerX - worldX * scale.value,
        y: centerY - worldY * scale.value
      }

      console.log('Reset Zoom:', {
        oldScale: scale.value,
        newScale: 1,
        oldPan: currentPan,
        newPan: pan.value,
        centerPoint: { x: centerX, y: centerY }
      })
    }

    const zoomIn = () => {
      const canvas = document.querySelector('.workflow-canvas')
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const worldX = (centerX - pan.value.x) / scale.value
      const worldY = (centerY - pan.value.y) / scale.value

      const newScale = Math.min(2, scale.value + 0.05)
      scale.value = Math.round(newScale * 100) / 100

      console.log('Zoom In:', {
        oldScale: scale.value,
        newScale,
        centerX,
        centerY,
        worldX,
        worldY,
        pan: pan.value
      })

      pan.value = {
        x: centerX - worldX * scale.value,
        y: centerY - worldY * scale.value
      }
    }

    const zoomOut = () => {
      const canvas = document.querySelector('.workflow-canvas')
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const worldX = (centerX - pan.value.x) / scale.value
      const worldY = (centerY - pan.value.y) / scale.value

      const newScale = Math.max(0.1, scale.value - 0.05)
      scale.value = Math.round(newScale * 100) / 100

      console.log('Zoom Out:', {
        oldScale: scale.value,
        newScale,
        centerX,
        centerY,
        worldX,
        worldY,
        pan: pan.value
      })

      pan.value = {
        x: centerX - worldX * scale.value,
        y: centerY - worldY * scale.value
      }
    }

    const handleWheel = (event) => {
      event.preventDefault()
      
      // 獲取鼠標在畫布上的位置
      const rect = event.currentTarget.getBoundingClientRect()
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top

      // 計算鼠標當前指向的世界坐標點
      const worldX = Math.round((mouseX - pan.value.x) / scale.value)
      const worldY = Math.round((mouseY - pan.value.y) / scale.value)
      
      // 更新鼠標坐標顯示
      cursorCoords.value = {
        x: worldX,
        y: worldY
      }

      // 計算新的縮放值
      const delta = event.deltaY > 0 ? 0.95 : 1.05
      const oldScale = scale.value
      const newScale = Math.max(0.1, Math.min(2, oldScale * delta))
      
      // 計算新的平移值，使得鼠標指向的世界坐標點保持不變
      const newPan = {
        x: mouseX - (mouseX - pan.value.x) * newScale / oldScale,
        y: mouseY - (mouseY - pan.value.y) * newScale / oldScale
      }

      // 更新縮放和平移值
      scale.value = Math.round(newScale * 100) / 100
      pan.value = newPan

    }

    const updateNodePosition = (nodeId, newPosition) => {
      // 添加更詳細的安全檢查
      if (!newPosition) {
        console.warn('Position is undefined')
        return
      }

      if (typeof newPosition.x !== 'number' || typeof newPosition.y !== 'number') {
        console.warn('Invalid position coordinates:', newPosition)
        return
      }

      const node = currentWorkflow.value.nodes.find(n => n.id === nodeId)
      if (node) {
        node.position = {
          x: Math.round(newPosition.x),
          y: Math.round(newPosition.y)
        }
      }
    }

    const addNodeFromContextMenu = (type) => {
      const canvas = document.querySelector('.workflow-canvas')
      const canvasContent = document.querySelector('.canvas-content')
      if (!canvas || !canvasContent) return

      const canvasRect = canvas.getBoundingClientRect()
      const contentRect = canvasContent.getBoundingClientRect()
      const nodeType = type.toString()
      const timestamp = Date.now()
      const uniqueId = `${nodeType.toLowerCase()}-${timestamp}`
      
      // 計算相對於 canvas-content 的位置
      const position = {
        x: (menuPosition.value.x - contentRect.left) / scale.value,
        y: (menuPosition.value.y - contentRect.top) / scale.value
      }

      // 增加計數器
      nodeCounters.value[nodeType.toLowerCase()]++
      const count = nodeCounters.value[nodeType.toLowerCase()]

      const newNode = {
        id: uniqueId,
        type: `${nodeType}Node`,
        title: `${nodeType} Node #${count.toString().padStart(2, '0')}`,
        content: nodeType,
        position
      }

      currentWorkflow.value.nodes.push(newNode)
      closeContextMenu()
    }

    const canvasStyle = computed(() => ({
      cursor: isCanvasDragging.value ? 'grabbing' : 'grab'
    }))

    const contentStyle = computed(() => ({
      transform: `scale(${scale.value}) translate(${pan.value.x}px, ${pan.value.y}px)`
    }))

    const handleNodeDrag = (event, node) => {
      const rect = event.currentTarget.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      const realX = (x - pan.value.x) / scale.value
      const realY = (y - pan.value.y) / scale.value

      return {
        x: Math.round(realX),
        y: Math.round(realY)
      }
    }

    const getPortPosition = (nodeId, portType) => {
      const node = currentWorkflow.value.nodes.find(n => n.id === nodeId)
      if (!node) return { x: 0, y: 0 }

      const nodeElement = document.querySelector(`[data-node-id="${nodeId}"]`)
      if (!nodeElement) return { x: 0, y: 0 }

      const rect = nodeElement.getBoundingClientRect()
      const portElement = nodeElement.querySelector(`.port-${portType}`)
      if (!portElement) return { x: 0, y: 0 }

      const portRect = portElement.getBoundingClientRect()
      
      // 考慮縮放和平移
      return {
        x: (portRect.left + portRect.width / 2 - pan.value.x) / scale.value,
        y: (portRect.top + portRect.height / 2 - pan.value.y) / scale.value
      }
    }

    const getTempConnectionPath = () => {
      if (!tempConnectionStart.value) return ''

      const start = tempConnectionStart.value.position
      const end = mousePosition.value

      // 計算控制點
      const dx = Math.abs(end.x - start.x) * 0.5
      const startControl = {
        x: start.x + (tempConnectionStart.value.portType === 'out' ? dx : -dx),
        y: start.y
      }
      const endControl = {
        x: end.x + (tempConnectionStart.value.portType === 'out' ? -dx : dx),
        y: end.y
      }

      return `M ${start.x} ${start.y} C ${startControl.x} ${startControl.y}, ${endControl.x} ${endControl.y}, ${end.x} ${end.y}`
    }

    const portContextMenu = ref({
      show: false,
      position: { x: 0, y: 0 },
      sourceNode: null,
      sourcePort: null
    })

    const showPortContextMenu = (event, nodeId, portType) => {
      console.log('Showing port context menu:', { nodeId, portType })
      event.preventDefault()
      event.stopPropagation()

      portContextMenu.value = {
        show: true,
        position: {
          x: event.clientX,
          y: event.clientY
        },
        sourceNode: nodeId,
        sourcePort: portType
      }
    }

    const quickConnect = (targetNodeId) => {
      const { sourceNode, sourcePort } = portContextMenu.value
      const targetPort = sourcePort === 'out' ? 'in' : 'out'

      const newConnection = {
        id: `conn-${Date.now()}`,
        start: sourceNode,
        startPort: sourcePort,
        end: targetNodeId,
        endPort: targetPort
      }

      currentWorkflow.value.connections.push(newConnection)
      closeContextMenu()
    }

    const disconnectPort = (data) => {
      const { nodeId, portType } = data
      const connections = currentWorkflow.value.connections
      
      // 找到並移除相關連接
      const updatedConnections = connections.filter(conn => {
        const isStart = conn.start === nodeId && conn.startPort === portType
        const isEnd = conn.end === nodeId && conn.endPort === portType
        return !isStart && !isEnd
      })
      
      currentWorkflow.value.connections = updatedConnections
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        // 取消臨時連線
        tempConnectionStart.value = null
        // 關閉所有選單
        closeContextMenu()
      }
    }

    const nodeContextMenu = ref({
      show: false,
      position: { x: 0, y: 0 },
      node: null
    })

    const showNodeContextMenu = (event, node) => {
      event.preventDefault()
      event.stopPropagation()
      
      // 確保 node 存在
      if (!node) {
        console.warn('Node is undefined in context menu')
        return
      }
      
      nodeContextMenu.value = {
        show: true,
        position: {
          x: event.clientX,
          y: event.clientY
        },
        node: { ...node }  // 創建節點的副本
      }
    }

    const updateNodeTitle = (nodeId, newTitle) => {
      const node = currentWorkflow.value.nodes.find(n => n.id === nodeId)
      if (node) {
        node.title = newTitle
      }
    }

    const updateNodeContent = (nodeId, newContent) => {
      const node = currentWorkflow.value.nodes.find(n => n.id === nodeId)
      if (node) {
        node.content = newContent
      }
    }

    onMounted(() => {
      document.addEventListener('keydown', handleKeyDown)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeyDown)
    })

    return {
      showMenu,
      menuPosition,
      tabs,
      activeTabId,
      currentWorkflow,
      nodes: store.nodes,
      connections: store.connections,
      showContextMenu,
      closeContextMenu,
      handleCanvasContentMouseDown,
      handleMouseMove,
      handleCanvasMouseUp,
      addNodeFromContextMenu,
      createNewTab,
      switchTab,
      closeTab,
      createNewWorkflow,
      saveWorkflow,
      openWorkflow,
      exportWorkflow,
      importWorkflow,
      handleConnectionStart,
      handleConnectionEnd,
      tempConnection,
      scale,
      pan,
      handleWheel,
      canvasStyle,
      contentStyle,
      updateNodePosition,
      addNodeFromToolbar,
      selectNode,
      addNode,
      resetZoom,
      cursorCoords,
      zoomIn,
      zoomOut,
      handleNodeDrag,
      tempConnectionStart,
      mousePosition,
      getTempConnectionPath,
      canvasWidth,
      canvasHeight,
      portContextMenu,
      showPortContextMenu,
      quickConnect,
      disconnectPort,
      nodeContextMenu,
      showNodeContextMenu,
      updateNodeTitle,
      updateNodeContent
    }
  }
}
