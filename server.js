const express = require("express")
const http = require("http")
const axios = require("axios")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

const server = http.createServer(app)

const { Server } = require("socket.io")
const io = new Server(server, {
  cors: {
    origin: "*",
  },
})

// In-memory message queue to batch send to Spring API
let messageQueue = []
const BATCH_SIZE = 10
const SYNC_INTERVAL = 10000 // 30 seconds

// Configure axios for Spring API
const springApi = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Function to send messages to Spring API
async function syncMessagesToDatabase() {
  if (messageQueue.length === 0) return

  try {
    const messagesToSync = [...messageQueue]
    messageQueue = [] // Clear the queue

    console.log(`Syncing ${messagesToSync.length} messages to database`)

    // Get the JWT token from the first message (assuming all messages have the same token)
    // In a real app, you'd handle this more securely
    const token = messagesToSync[0]?.token

    if (token) {
      await springApi.post("/messages/batch", messagesToSync, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log("Messages synced successfully")
    } else {
      console.error("No token available for API request")
      // Put messages back in queue
      messageQueue = [...messagesToSync, ...messageQueue]
    }
  } catch (error) {
    console.error("Error syncing messages:", error.message)
    // Put messages back in queue on error
    messageQueue = [...messageQueue]
  }
}

// Set up periodic sync
setInterval(syncMessagesToDatabase, SYNC_INTERVAL)

// Also sync when queue reaches batch size
function checkQueueAndSync() {
  if (messageQueue.length >= BATCH_SIZE) {
    syncMessagesToDatabase()
  }
}


io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  // Handle user joining a team chat
  socket.on("join_team", async (data) => {
    const { teamId, token, isFirstJoin } = data

    try {
      // Fetch last 10 messages for this team from Spring API
      const response = await springApi.get(`/messages/team/${teamId}?limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Send history to the client
      socket.emit("message_history", response.data)

      // Only notify others that user joined if this is their first time joining
      if (isFirstJoin) {
        socket.broadcast.emit("new_user", {
          user: data.user,
          teamId: data.teamId,
        })
        console.log(`User ${data.user} joined team ${teamId} for the first time`)
      } else {
        console.log(`User ${data.user} switched back to team ${teamId}`)
      }
    } catch (error) {
      console.error("Error fetching message history:", error.message)
      socket.emit("error", { message: "Failed to load message history" })
    }
  })

  // Handle new messages
  socket.on("send_message", (msg) => {
    // Add JWT token to message object for database sync
    const messageWithMeta = {
      ...msg,
      token: msg.token, // JWT token from client
      createdAt: new Date().toISOString(),
    }

    // Remove token before broadcasting to other clients
    const { token, ...messageToBroadcast } = messageWithMeta

    // Broadcast to other clients
    socket.broadcast.emit("recieve_message", messageToBroadcast)

    // Add to queue for database sync
    messageQueue.push(messageWithMeta)
    checkQueueAndSync()

    console.log("Message queued for sync:", msg.content, "to team:", msg.teamId)
  })

  socket.on("user_typing", (data) => {
    socket.broadcast.emit("user_typing", data)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

// API endpoint to manually trigger sync (for testing)
app.post("/sync", (req, res) => {
  syncMessagesToDatabase()
  res.json({ message: "Sync triggered", queueSize: messageQueue.length })
})

server.listen(3001, () => {
  console.log("Server is running on port 3001")
})
