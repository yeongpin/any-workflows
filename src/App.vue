<template>
  <div class="app-container" @click="closeContextMenu" tabindex="0">
    <action-bar
      @newWorkflow="createNewWorkflow"
      @openWorkflow="openWorkflow"
      @saveWorkflow="saveWorkflow"
      @exportWorkflow="exportWorkflow"
      @importWorkflow="importWorkflow"
      @addNode="addNodeFromToolbar"
      :notificationHistory="notificationHistory"
      @clearHistory="clearNotificationHistory"
      :nodes="currentWorkflow.nodes"
      @editNode="handleEditNode"
      @deleteNode="handleDeleteNode"
      @connectNode="handleConnectNode"
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
        <div class="zoom-buttons">
          <button @click="zoomOut">-</button>
          <span>{{ Math.round(scale * 100) }}%</span>
          <button @click="zoomIn">+</button>
        </div>
        <div class="right-controls">
          <button @click="resetZoom" title="Reset Zoom">Reset</button>
          <button @click="takeScreenshot" title="Take Screenshot">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor"/>
            </svg>
          </button>
        </div>
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
        @remove-node="removeNode"
        @close="closeContextMenu"
      />
    </div>
    <notification-list
      :notifications="notifications"
      @remove="removeNotification"
    />
  </div>

  <!-- 截圖預覽模態框 -->
  <teleport to="body">
    <div v-if="screenshotPreview" class="screenshot-modal">
      <div class="screenshot-content">
        <img :src="screenshotPreview" alt="Workflow Screenshot" />
        <div class="screenshot-info" v-if="screenshotInfo">
          <span>{{ Math.round(screenshotInfo.width) }} x {{ Math.round(screenshotInfo.height) }} px</span>
          <span>{{ screenshotInfo.size }} KB</span>
        </div>
        <div class="screenshot-actions">
          <button class="action-button" @click="saveScreenshot">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor"/>
            </svg>
            Save
          </button>
          <button class="action-button" @click="selectArea">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path d="M3 3h18v18H3V3m2 2v14h14V5H5z" fill="currentColor"/>
            </svg>
            Select Area
          </button>
          <button class="action-button" @click="retakeScreenshot">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"/>
            </svg>
            Retake
          </button>
          <button class="action-button cancel" @click="closeScreenshotPreview">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
            </svg>
            Cancel
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
export { default } from './app.js'
</script>

<style>
@import './styles/app.css';
</style> 