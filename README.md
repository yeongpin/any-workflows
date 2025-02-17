# 🔄 Any-Workflows

A Vue 3 based visual workflow editor that supports various node types and connection methods.

## ✨ Features

- 🔲 Node Types:
  - 🟢 Start Node
  - 🔷 Process Node
  - 🔴 End Node
  - 🖼️ Image Node
  - 🎥 Video Node
  - 🔗 URL Node

- 🛠️ Node Operations:
  - 🖱️ Drag & Drop
  - 🔍 Canvas Zoom
  - 🔌 Node Connections
  - ✏️ Node Editing
  - 🗑️ Node Deletion

- 🎯 Additional Features:
  - 📑 Multi-tab Workspace
  - 📋 Node List Management
  - 🔔 Notification System
  - 💾 Workflow Import/Export
  - 📸 Canvas Screenshot

## 🚀 Installation

```
npm install
npm run dev
npm run server
```

## 📖 Usage

1. Adding Nodes:
   - Click node buttons in the toolbar
   - Or right-click canvas to select node type

2. Connecting Nodes:
   - Click connect button in node list
   - Or drag from port to port directly

3. Editing Nodes:
   - Double click node to open edit menu
   - Or click edit button in node list

## 🔌 Port Configuration

- 🟢 Start Node: Output port only
- 🔴 End Node: Input port only
- 🔷 Other Nodes: Both input and output ports

## 💻 Code Examples

Adding a new node:
```javascript
const addNode = (type, position) => {
  const node = {
    id: generateId(),
    type: `${type}Node`,
    position: position,
    title: `${type} Node`,
    content: ''
  }
  nodes.value.push(node)
}
```

Connecting nodes:
```javascript
const connectNodes = (sourceNode, targetNode) => {
  const connection = {
    id: generateId(),
    sourceNode: sourceNode.id,
    targetNode: targetNode.id,
    sourcePort: 'output',
    targetPort: 'input'
  }
  connections.value.push(connection)
}
```

## 🗺️ Roadmap

- [ ] Support more node types
- [ ] Add node grouping
- [ ] Node search and filtering
- [ ] Add workflow execution
- [ ] Workflow templates

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

MIT License

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for details.
