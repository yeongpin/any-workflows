<template>
  <div 
    class="node-context-menu"
    :style="menuStyle"
    @click.stop
  >
    <div class="menu-item">
      <div class="input-group">
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
</style> 