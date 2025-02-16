require('dotenv').config()
const express = require('express')
const app = express()

// 中間件
app.use(express.json())

// CORS設置
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  next()
})

// API路由
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something broke!' })
})

const PORT = process.env.VITE_SERVER_PORT || 3001
const HOST = process.env.VITE_SERVER_HOST || 'localhost'

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`)
}) 