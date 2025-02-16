<template>
  <div class="app-container" @click="closeContextMenu" tabindex="0">
    <action-bar
      @newWorkflow="createNewWorkflow"
      @openWorkflow="openWorkflow"
      @saveWorkflow="saveWorkflow"
      @exportWorkflow="exportWorkflow"
      @importWorkflow="importWorkflow"
      @addNode="addNodeFromToolbar"
    />
    <tab-bar
      :tabs="tabs"
      :activeTabId="activeTabId"
      @switchTab="switchTab"
      @closeTab="closeTab"
      @newTab="createNewTab"
    />
    <div class="workflow-container" @contextmenu.prevent="showContextMenu">
      <div class="zoom-controls">
        <button @click="zoomOut">-</button>
        <span>{{ Math.round(scale * 100) }}%</span>
        <button @click="zoomIn">+</button>
        <button @click="resetZoom">Reset</button>
      </div>
      <div class="coordinates-display">
        <div>Cursor: {{ cursorCoords.x }}, {{ cursorCoords.y }}</div>
      </div>
      <div 
        class="workflow-canvas" 
        @mousedown="handleCanvasContentMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleCanvasMouseUp"
        @wheel="handleWheel"
        :style="canvasStyle"
      >
        <div 
          class="canvas-content" 
          :style="contentStyle"
        >
          <svg class="connections-layer" :width="canvasWidth" :height="canvasHeight">
            <connection
              v-for="connection in currentWorkflow.connections"
              :key="connection.id"
              :connection="connection"
              :nodes="currentWorkflow.nodes"
            />
            <path
              v-if="tempConnectionStart"
              :d="getTempConnectionPath()"
              class="temp-connection"
              fill="none"
              stroke="#000"
              stroke-width="3"
              stroke-dasharray="5,5"
            />
          </svg>
          <component
            v-for="node in currentWorkflow.nodes"
            :key="node.id"
            :is="node.type"
            :node="node"
            @nodeSelected="selectNode"
            @update:position="updateNodePosition"
            @port-context-menu="showPortContextMenu"
            @connection-start="handleConnectionStart"
            @connection-end="handleConnectionEnd"
            @disconnect-port="disconnectPort"
            @node-context-menu="showNodeContextMenu"
          />
        </div>
      </div>
      <context-menu
        v-if="showMenu"
        :position="menuPosition"
        @addNode="addNodeFromContextMenu"
        @close="closeContextMenu"
      />
      <port-context-menu
        v-if="portContextMenu.show"
        :show="portContextMenu.show"
        :position="portContextMenu.position"
        :source-node="portContextMenu.sourceNode"
        :source-port="portContextMenu.sourcePort"
        :nodes="currentWorkflow.nodes"
        @select="quickConnect"
      />
      <node-context-menu
        v-if="nodeContextMenu.show"
        :position="nodeContextMenu.position"
        :node="nodeContextMenu.node"
        @update:title="updateNodeTitle"
        @update:content="updateNodeContent"
        @close="closeContextMenu"
      />
    </div>
  </div>
</template>

<script>
export { default } from './app.js'
</script>

<style>
@import './styles/app.css';
</style> 