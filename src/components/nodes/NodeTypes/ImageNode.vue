<template>
  <base-node :node="node" @nodeSelected="$emit('nodeSelected', node)" class="image-node">
    <div class="image-node-content">
      <div class="image-container">
        <template v-if="node.imageUrl">
          <img 
            :src="node.imageUrl" 
            alt="Node image"
            @load="handleImageLoad"
            @click="showLightbox"
          />
          <div class="image-actions">
            <button class="action-button" @click.stop="triggerFileInput" title="Change Image">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor"/>
              </svg>
            </button>
            <button class="action-button delete" @click.stop="removeImage" title="Remove Image">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </template>
        <div v-else class="image-placeholder" @click="triggerFileInput">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path 
              d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" 
              fill="currentColor"
            />
          </svg>
          <span>Click to add image</span>
        </div>
      </div>
      <input 
        type="file" 
        ref="fileInput"
        accept="image/*"
        @change="handleImageUpload"
        style="display: none"
      />
    </div>
    <!-- 左右兩側端口 -->
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

    <!-- 圖片放大燈箱 -->
    <teleport to="body">
      <div v-if="showingLightbox" class="lightbox" @click="closeLightbox">
        <div class="lightbox-wrapper" @click.stop>
          <img 
            :src="node.imageUrl" 
            alt="Enlarged image" 
            @click.stop
          />
          <button class="close-lightbox" @click="closeLightbox">×</button>
        </div>
      </div>
    </teleport>
  </base-node>
</template>

<script>
import BaseNode from '../BaseNode.vue'
import { ref } from 'vue'

export default {
  name: 'ImageNode',
  components: {
    BaseNode
  },
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  setup() {
    const showingLightbox = ref(false)
    return { showingLightbox }
  },
  emits: [
    'nodeSelected',
    'connection-start',
    'connection-end',
    'port-context-menu',
    'disconnect-port'
  ],
  methods: {
    handlePortMouseDown(event) {
      if (event.altKey) {
        this.disconnectPort(event)
      } else if (event.ctrlKey) {
        this.startConnection(event)
      } else {
        this.startConnection(event)
      }
    },

    handlePortMouseUp(event) {
      if (!event.altKey && !event.ctrlKey) {
        this.endConnection(event)
      }
    },

    disconnectPort(event) {
      const portType = event.target.classList.contains('port-in') ? 'in' : 'out'
      this.$emit('disconnect-port', {
        nodeId: this.node.id,
        portType
      })
    },

    startConnection(event) {
      const portType = event.target.classList.contains('port-in') ? 'in' : 'out'
      this.$emit('connection-start', {
        nodeId: this.node.id,
        portType
      })
    },

    endConnection(event) {
      const portType = event.target.classList.contains('port-in') ? 'in' : 'out'
      this.$emit('connection-end', {
        nodeId: this.node.id,
        portType
      })
    },

    showPortMenu(event) {
      const portType = event.target.classList.contains('port-in') ? 'in' : 'out'
      this.$emit('port-context-menu', event, this.node.id, portType)
    },

    triggerFileInput() {
      this.$refs.fileInput.click()
    },

    handleImageUpload(event) {
      const file = event.target.files[0]
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.node.imageUrl = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },

    handleImageLoad() {
      // 可以在這裡處理圖片載入完成後的邏輯
    },

    showLightbox() {
      this.showingLightbox = true
      document.body.style.overflow = 'hidden'
    },

    closeLightbox() {
      this.showingLightbox = false
      document.body.style.overflow = ''
    },

    removeImage() {
      this.node.imageUrl = ''
    }
  }
}
</script>

<style scoped>
.image-node {
  background: #f0f5ff;
  border: 2px solid #597ef7;
}

.image-node-content {
  padding: 10px;
}

.image-container {
  width: 100%;
  height: 120px;
  border: 1px dashed #597ef7;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s;
  padding: 10px;
  position: relative;
}

.image-container:hover {
  border-color: #1890ff;
  background: rgba(24, 144, 255, 0.1);
}

.image-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  cursor: zoom-in;
}

.image-placeholder {
  color: #597ef7;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.image-placeholder svg {
  opacity: 0.5;
}

.port {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #666;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
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

.port:hover {
  transform: translateY(-50%) scale(1.2);
  background: #1890ff;
  box-shadow: 0 0 0 4px rgba(24,144,255,0.2);
}

.image-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-container:hover .image-actions {
  opacity: 1;
}

.action-button {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.action-button:hover {
  background: white;
  transform: scale(1.1);
}

.action-button.delete:hover {
  background: #ff4d4f;
  color: white;
}

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

.lightbox-wrapper img {
  max-width: 100%;
  max-height: 95vh;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
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
</style> 