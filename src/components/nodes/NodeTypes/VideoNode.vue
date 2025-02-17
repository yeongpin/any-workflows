<template>
  <base-node 
    :node="node" 
    @nodeSelected="$emit('nodeSelected', node)" 
    class="video-node"
    @port-context-menu="$emit('port-context-menu', $event)"
    @connection-start="$emit('connection-start', $event)"
    @connection-end="$emit('connection-end', $event)"
    @disconnect-port="$emit('disconnect-port', $event)"
    @node-context-menu="handleNodeContextMenu"
  >
    <div class="video-node-content">
      <div class="video-container">
        <template v-if="node.videoUrl">
          <video 
            :src="node.videoUrl" 
            controls
            @loadedmetadata="handleVideoLoad"
            @click="showLightbox"
          ></video>
          <div class="video-actions">
            <button class="action-button" @click.stop="triggerFileInput" title="Change Video">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z" fill="currentColor"/>
              </svg>
            </button>
            <button class="action-button delete" @click.stop="removeVideo" title="Remove Video">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </template>
        <div v-else class="video-placeholder" @click="triggerFileInput">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path 
              d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"
              fill="currentColor"
            />
          </svg>
          <span>Click to add video</span>
        </div>
      </div>
      <input 
        type="file" 
        ref="fileInput"
        accept="video/*"
        @change="handleVideoUpload"
        style="display: none"
      />
    </div>

    <!-- 添加端口 -->
    <div 
      class="port port-in" 
      @mousedown.stop="handlePortMouseDown"
      @mouseup.stop="handlePortMouseUp"
      @contextmenu.prevent.stop="showPortMenu"
    ></div>
    <div 
      class="port port-out" 
      @mousedown.stop="handlePortMouseDown"
      @mouseup.stop="handlePortMouseUp"
      @contextmenu.prevent.stop="showPortMenu"
    ></div>

    <!-- 視頻放大燈箱 -->
    <teleport to="body">
      <div v-if="showingLightbox" class="lightbox" @click="closeLightbox">
        <div class="lightbox-wrapper" @click.stop>
          <video 
            :src="node.videoUrl" 
            controls
            autoplay
            @click.stop
          ></video>
          <button class="close-lightbox" @click="closeLightbox">×</button>
        </div>
      </div>
    </teleport>
  </base-node>
</template>

<script>
import { ref } from 'vue'
import BaseNode from '../BaseNode.vue'

export default {
  name: 'VideoNode',
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
    'port-context-menu',
    'connection-start',
    'connection-end',
    'disconnect-port',
    'node-context-menu'
  ],
  setup(props, { emit }) {
    const fileInput = ref(null)
    const showingLightbox = ref(false)

    const handlePortMouseDown = (event) => {
      if (event.altKey) {
        disconnectPort(event)
      } else if (event.ctrlKey) {
        startConnection(event)
      } else {
        startConnection(event)
      }
    }

    const handlePortMouseUp = (event) => {
      if (!event.altKey && !event.ctrlKey) {
        endConnection(event)
      }
    }

    const disconnectPort = (event) => {
      const portType = event.target.classList.contains('port-in') ? 'in' : 'out'
      emit('disconnect-port', {
        nodeId: props.node.id,
        portType
      })
    }

    const startConnection = (event) => {
      const portType = event.target.classList.contains('port-in') ? 'in' : 'out'
      emit('connection-start', {
        nodeId: props.node.id,
        portType
      })
    }

    const endConnection = (event) => {
      const portType = event.target.classList.contains('port-in') ? 'in' : 'out'
      emit('connection-end', {
        nodeId: props.node.id,
        portType
      })
    }

    const showPortMenu = (event) => {
      const portType = event.target.classList.contains('port-in') ? 'in' : 'out'
      emit('port-context-menu', event, props.node.id, portType)
    }

    const triggerFileInput = () => {
      fileInput.value.click()
    }

    const handleVideoUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        const videoUrl = URL.createObjectURL(file)
        props.node.videoUrl = videoUrl
        props.node.originalFileName = file.name
      }
    }

    const handleVideoLoad = () => {
      // 可以在這裡處理視頻加載完成後的邏輯
      console.log('Video loaded')
    }

    const removeVideo = () => {
      if (props.node.videoUrl) {
        URL.revokeObjectURL(props.node.videoUrl)
      }
      props.node.videoUrl = null
      props.node.originalFileName = null
    }

    const showLightbox = () => {
      showingLightbox.value = true
    }

    const closeLightbox = () => {
      showingLightbox.value = false
    }

    const handleNodeContextMenu = (event) => {
      emit('node-context-menu', event, props.node)
    }

    return {
      fileInput,
      showingLightbox,
      handlePortMouseDown,
      handlePortMouseUp,
      showPortMenu,
      triggerFileInput,
      handleVideoUpload,
      handleVideoLoad,
      removeVideo,
      showLightbox,
      closeLightbox,
      handleNodeContextMenu
    }
  }
}
</script>

<style scoped>
.video-node {
  min-width: 200px;
  min-height: 150px;
  position: relative;
  background: #f9f0ff;
  border: 1px solid #d3adf7;
}

.video-node-content {
  padding: 8px;
  height: 100%;
  margin: 0 20px; /* 為端口留出空間 */
}

.video-container {
  position: relative;
  width: 100%;
  height: 120px;
  min-height: 120px;
  border: 2px dashed #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
}

.video-container:hover .video-actions {
  opacity: 1;
}

.video-container video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
  cursor: pointer;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #999;
  gap: 8px;
  padding: 16px;
}

.video-placeholder:hover {
  background: #fafafa;
  color: #666;
}

.video-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s;
  background: rgba(0, 0, 0, 0.5);
  padding: 4px;
  border-radius: 4px;
}

.action-button {
  width: 24px;
  height: 24px;
  padding: 4px;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.action-button.delete:hover {
  background: rgba(255, 77, 79, 0.2);
  color: #ff4d4f;
}

/* 燈箱樣式 */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: pointer;
}

.lightbox-wrapper {
  position: relative;
  max-width: 95vw;
  max-height: 95vh;
  cursor: default;
}

.lightbox-wrapper video {
  max-width: 100%;
  max-height: 95vh;
  display: block;
}

.close-lightbox {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-lightbox:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.port {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #666;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s;
}

.port:hover {
  transform: scale(1.2);
  background: #1890ff;
  box-shadow: 0 0 0 4px rgba(24,144,255,0.2);
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
</style> 