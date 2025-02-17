<template>
  <div 
    class="node-context-menu"
    :style="menuStyle"
    @click.stop
  >
    <div class="menu-header">
      <div class="node-type">
        <div class="type-icon">
          <svg v-if="node?.type === 'StartNode'" viewBox="0 0 24 24" width="16" height="16">
            <circle cx="12" cy="12" r="8" fill="#1890ff"/>
            <text x="12" y="16" text-anchor="middle" fill="white" font-size="10">S</text>
          </svg>
          <svg v-else-if="node?.type === 'ProcessNode'" viewBox="0 0 24 24" width="16" height="16">
            <rect x="4" y="4" width="16" height="16" rx="2" fill="#52c41a"/>
            <text x="12" y="16" text-anchor="middle" fill="white" font-size="10">P</text>
          </svg>
          <svg v-else-if="node?.type === 'EndNode'" viewBox="0 0 24 24" width="16" height="16">
            <circle cx="12" cy="12" r="8" fill="#ff4d4f"/>
            <text x="12" y="16" text-anchor="middle" fill="white" font-size="10">E</text>
          </svg>
          <svg v-else-if="node?.type === 'ImageNode'" viewBox="0 0 24 24" width="16" height="16">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="#597ef7"/>
          </svg>
          <svg v-else-if="node?.type === 'VideoNode'" viewBox="0 0 24 24" width="16" height="16">
            <path d="M8 5v14l11-7z" fill="#722ed1"/>
          </svg>
        </div>
        {{ node?.type.replace('Node', '') }} Node
      </div>
    </div>
    <div class="menu-item">
      <div class="input-group">
        <div class="input-label">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#666"/>
          </svg>
          <span>Title</span>
        </div>
        <input 
          v-model="editTitle" 
          @keyup.enter.prevent
          @click.stop
          placeholder="Edit title"
        />
        <div class="button-group" v-if="node && editTitle !== node.title">
          <button class="confirm" @click="updateTitle">✓</button>
          <button class="cancel" @click="$emit('close')">✕</button>
        </div>
      </div>
    </div>
    <div class="menu-item">
      <div class="input-group">
        <div class="input-label">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z M17 17H7v-2h10v2z M17 13H7v-2h10v2z M17 9H7V7h10v2z" fill="#666"/>
          </svg>
          <span>Content</span>
        </div>
        <textarea 
          v-model="editContent" 
          @keydown.enter.shift="handleShiftEnter"
          @keyup.enter.prevent
          @click.stop
          placeholder="Edit content"
          rows="3"
        ></textarea>
        <div class="button-group" v-if="node && editContent !== node.content">
          <button class="confirm" @click="updateContent">✓</button>
          <button class="cancel" @click="$emit('close')">✕</button>
        </div>
      </div>
    </div>
    <div class="menu-divider"></div>
    <div class="menu-item">
      <button class="delete-button" @click="removeNode">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
        </svg>
        <span>Remove Node</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NodeContextMenu',
  props: {
    position: Object,
    node: {
      type: Object,
      default: null
    }
  },
  emits: ['update:title', 'update:content', 'close', 'remove-node'],
  data() {
    return {
      editTitle: '',
      editContent: ''
    }
  },
  watch: {
    node: {
      immediate: true,
      handler(newNode) {
        if (newNode) {
          this.editTitle = newNode.title || ''
          this.editContent = newNode.content || ''
        }
      }
    }
  },
  computed: {
    menuStyle() {
      return {
        left: `${this.position.x}px`,
        top: `${this.position.y}px`
      }
    }
  },
  methods: {
    updateTitle() {
      if (this.node) {
        this.$emit('update:title', this.node.id, this.editTitle)
        this.$emit('close')
      }
    },
    updateContent() {
      if (this.node) {
        this.$emit('update:content', this.node.id, this.editContent)
        this.$emit('close')
      }
    },
    handleShiftEnter(event) {
      event.preventDefault()
      const textarea = event.target
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const scrollTop = textarea.scrollTop  // 保存當前滾動位置
      
      // 在光標位置插入換行符
      this.editContent = this.editContent.substring(0, start) + '\n' + this.editContent.substring(end)
      
      // 設置新的光標位置並恢復滾動位置
      this.$nextTick(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1
        textarea.scrollTop = scrollTop  // 恢復滾動位置
      })
    },
    removeNode() {
      if (this.node) {
        this.$emit('remove-node', this.node.id)
        this.$emit('close')
      }
    }
  }
}
</script>

<style scoped>
.node-context-menu {
  position: fixed;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  padding: 4px 0;
  min-width: 200px;
  z-index: 1000;
}

.menu-header {
  padding: 8px 12px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.node-type {
  font-weight: 500;
  color: #333;
}

.menu-item {
  padding: 8px;
}

.input-group {
  display: flex;
  gap: 4px;
  align-items: center;
}

.input-group input {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

.input-group textarea {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  resize: vertical;
  min-height: 60px;
}

.button-group {
  display: flex;
  gap: 2px;
}

.button-group button {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.confirm {
  background: #52c41a;
  color: white;
}

.confirm:hover {
  background: #73d13d;
}

.cancel {
  background: #ff4d4f;
  color: white;
}

.cancel:hover {
  background: #ff7875;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  margin-bottom: 4px;
}

.menu-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 4px 0;
}

.delete-button {
  width: 100%;
  padding: 8px;
  background: none;
  border: none;
  color: #ff4d4f;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.delete-button:hover {
  background: #fff1f0;
}

.type-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.node-type {
  display: flex;
  align-items: center;
}
</style> 