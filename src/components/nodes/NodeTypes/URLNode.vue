<template>
  <base-node 
    :node="node" 
    @nodeSelected="$emit('nodeSelected', node)" 
    class="url-node"
    @port-context-menu="$emit('port-context-menu', $event)"
    @connection-start="$emit('connection-start', $event)"
    @connection-end="$emit('connection-end', $event)"
    @disconnect-port="$emit('disconnect-port', $event)"
    @node-context-menu="handleNodeContextMenu"
  >
    <div class="url-node-content">
      <div class="url-container">
        <template v-if="node.url">
          <div class="url-display">
            <a :href="node.url" target="_blank" class="url-link" @click.stop>
              {{ node.url }}
            </a>
            <div class="url-actions">
              <button class="action-button" @click.stop="editUrl" title="Edit URL">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                </svg>
              </button>
              <button class="action-button" @click.stop="copyUrl" title="Copy URL">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"/>
                </svg>
              </button>
              <button class="action-button delete" @click.stop="removeUrl" title="Remove URL">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        </template>
        <div v-else class="url-placeholder" @click="editUrl">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path 
              d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"
              fill="currentColor"
            />
          </svg>
          <span>Click to add URL</span>
        </div>
      </div>
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

    <!-- URL 編輯對話框 -->
    <teleport to="body">
      <div v-if="showUrlDialog" class="url-dialog-overlay" @click="closeUrlDialog">
        <div class="url-dialog" @click.stop>
          <h3>{{ node.url ? 'Edit URL' : 'Add URL' }}</h3>
          <input 
            v-model="urlInput"
            type="url"
            placeholder="Enter URL (e.g., https://example.com)"
            @keyup.enter="saveUrl"
            ref="urlInputRef"
          />
          <div class="dialog-buttons">
            <button class="save-button" @click="saveUrl">Save</button>
            <button class="cancel-button" @click="closeUrlDialog">Cancel</button>
          </div>
        </div>
      </div>
    </teleport>
  </base-node>
</template>

<script>
import { ref } from 'vue'
import BaseNode from '../BaseNode.vue'

export default {
  name: 'URLNode',
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
    const showUrlDialog = ref(false)
    const urlInput = ref('')
    const urlInputRef = ref(null)

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

    const handleNodeContextMenu = (event) => {
      emit('node-context-menu', event, props.node)
    }

    const editUrl = () => {
      urlInput.value = props.node.url || ''
      showUrlDialog.value = true
      setTimeout(() => {
        urlInputRef.value?.focus()
      }, 100)
    }

    const saveUrl = () => {
      if (urlInput.value) {
        // 如果沒有 http:// 或 https:// 開頭，添加 https://
        let url = urlInput.value
        if (!/^https?:\/\//i.test(url)) {
          url = 'https://' + url
        }
        props.node.url = url
      }
      closeUrlDialog()
    }

    const closeUrlDialog = () => {
      showUrlDialog.value = false
      urlInput.value = ''
    }

    const copyUrl = async () => {
      if (props.node.url) {
        try {
          await navigator.clipboard.writeText(props.node.url)
          // 可以添加一個提示：URL 已複製
        } catch (err) {
          console.error('Failed to copy URL:', err)
        }
      }
    }

    const removeUrl = () => {
      props.node.url = null
    }

    return {
      showUrlDialog,
      urlInput,
      urlInputRef,
      handlePortMouseDown,
      handlePortMouseUp,
      showPortMenu,
      handleNodeContextMenu,
      editUrl,
      saveUrl,
      closeUrlDialog,
      copyUrl,
      removeUrl
    }
  }
}
</script>

<style scoped>
.url-node {
  min-width: 200px;
  min-height: 100px;
  position: relative;
  background: #e6fffb;
  border: 1px solid #87e8de;
}

.url-node-content {
  padding: 8px;
  height: 100%;
  margin: 0 20px;
}

.url-container {
  position: relative;
  width: 100%;
  min-height: 80px;
  border: 2px dashed #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
}

.url-display {
  padding: 12px;
  position: relative;
}

.url-display:hover .url-actions {
  opacity: 1;
}

.url-link {
  display: block;
  word-break: break-all;
  color: #1890ff;
  text-decoration: none;
  padding-right: 80px;
}

.url-link:hover {
  text-decoration: underline;
}

.url-placeholder {
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

.url-placeholder:hover {
  background: #fafafa;
  color: #666;
}

.url-actions {
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

/* URL 編輯對話框樣式 */
.url-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.url-dialog {
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 400px;
  max-width: 90vw;
}

.url-dialog h3 {
  margin: 0 0 16px 0;
  color: #333;
}

.url-dialog input {
  width: 100%;
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-bottom: 16px;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.save-button, .cancel-button {
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-button {
  background: #1890ff;
  color: white;
}

.save-button:hover {
  background: #40a9ff;
}

.cancel-button {
  background: #f5f5f5;
  color: #666;
}

.cancel-button:hover {
  background: #e8e8e8;
}
</style> 