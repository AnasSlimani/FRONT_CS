"use client"

import { useState, useEffect, useRef } from "react"
import { jwtDecode } from "jwt-decode"
import { Send, Paperclip, Smile, User, Users, X, Menu, Phone, Video, MoreVertical, Search } from "lucide-react"
import SockJS from "sockjs-client"
import { Stomp } from "@stomp/stompjs"
import api from "@/app/api/axios"

export default function Chat() {
  const [user, setUser] = useState(null)
  const [chatRooms, setChatRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stompClient, setStompClient] = useState(null)
  const [connected, setConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState({})
  const [showSidebar, setShowSidebar] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const messagesEndRef = useRef(null)
  const messageInputRef = useRef(null)

  // Get current user from token
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUser({
          id: decoded.id,
          username: decoded.sub,
        })
      } catch (error) {
        console.error("Error decoding token:", error)
        setError("Authentication error. Please login again.")
      }
    } else {
      setError("You are not logged in. Please login to use the chat.")
    }
  }, [])

  // Connect to WebSocket when user is loaded
  useEffect(() => {
    if (!user) return

    // Connect to WebSocket
    const socket = new SockJS("http://localhost:8080/api/ws")
    const client = Stomp.over(socket)

    // Disable console logging from STOMP
    client.debug = null

    client.connect(
      {},
      () => {
        setStompClient(client)
        setConnected(true)

        // Subscribe to personal queue
        client.subscribe(`/user/${user.id}/queue/messages`, onMessageReceived)

        // Send join message
        client.send(
          "/app/chat.addUser",
          {},
          JSON.stringify({
            senderId: user.id,
            senderName: user.username,
            type: "JOIN",
          }),
        )
      },
      onError,
    )

    return () => {
      if (client) {
        client.disconnect()
      }
    }
  }, [user])

  // Load chat rooms when user is loaded
  useEffect(() => {
    if (!user) return

    const fetchChatRooms = async () => {
      try {
        const response = await api.get(`/chat/rooms?userId=${user.id}`)
        setChatRooms(response.data)

        // Select first room if available
        if (response.data.length > 0 && !selectedRoom) {
          setSelectedRoom(response.data[0])
        }
      } catch (error) {
        console.error("Error fetching chat rooms:", error)
        setError("Failed to load chat rooms")
      } finally {
        setLoading(false)
      }
    }

    fetchChatRooms()
  }, [user])

  // Load messages when room is selected
  useEffect(() => {
    if (!selectedRoom) return

    const fetchMessages = async () => {
      try {
        const response = await api.get(`/chat/messages/room/${selectedRoom.id}?page=0&size=50`)
        setMessages(response.data.reverse()) // Reverse to show newest at the bottom

        // Subscribe to room messages
        if (stompClient && connected) {
          stompClient.subscribe(`/topic/chat/${selectedRoom.id}`, onMessageReceived)
          stompClient.subscribe(`/topic/status/${selectedRoom.id}`, onStatusReceived)

          // Mark messages as read
          api.post(`/chat/messages/read?roomId=${selectedRoom.id}&userId=${user.id}`)
        }
      } catch (error) {
        console.error("Error fetching messages:", error)
      }
    }

    fetchMessages()

    // Unsubscribe when changing rooms
    return () => {
      if (stompClient && connected) {
        try {
          stompClient.unsubscribe(`/topic/chat/${selectedRoom.id}`)
          stompClient.unsubscribe(`/topic/status/${selectedRoom.id}`)
        } catch (error) {
          console.error("Error unsubscribing:", error)
        }
      }
    }
  }, [selectedRoom, stompClient, connected])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle WebSocket errors
  const onError = (error) => {
    console.error("WebSocket connection error:", error)
    setConnected(false)

    // Try to reconnect after 5 seconds
    setTimeout(() => {
      if (user && !connected) {
        const socket = new SockJS("http://localhost:8080/api/ws")
        const client = Stomp.over(socket)
        client.debug = null

        client.connect(
          {},
          () => {
            setStompClient(client)
            setConnected(true)

            // Resubscribe to personal queue
            client.subscribe(`/user/${user.id}/queue/messages`, onMessageReceived)

            // Resubscribe to current room if any
            if (selectedRoom) {
              client.subscribe(`/topic/chat/${selectedRoom.id}`, onMessageReceived)
              client.subscribe(`/topic/status/${selectedRoom.id}`, onStatusReceived)
            }

            // Send join message
            client.send(
              "/app/chat.addUser",
              {},
              JSON.stringify({
                senderId: user.id,
                senderName: user.username,
                type: "JOIN",
              }),
            )
          },
          onError,
        )
      }
    }, 5000)
  }

  // Handle incoming messages
  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body)

    if (message.type === "CHAT") {
      setMessages((prevMessages) => [...prevMessages, message])

      // Mark message as read if it's in the current room
      if (selectedRoom && message.chatRoomId === selectedRoom.id && message.senderId !== user.id) {
        api.post(`/chat/messages/read?roomId=${message.chatRoomId}&userId=${user.id}`)
      }

      // Update chat room list with latest message
      setChatRooms((prevRooms) => {
        return prevRooms.map((room) => {
          if (room.id === message.chatRoomId) {
            return {
              ...room,
              lastMessageContent: message.content,
              lastMessageTime: message.timestamp,
              unreadCount: selectedRoom && selectedRoom.id === room.id ? 0 : room.unreadCount + 1,
            }
          }
          return room
        })
      })
    }
  }

  // Handle status updates (online/offline)
  const onStatusReceived = (payload) => {
    const status = JSON.parse(payload.body)

    if (status.type === "JOIN") {
      setOnlineUsers((prev) => ({
        ...prev,
        [status.senderId]: true,
      }))
    } else if (status.type === "LEAVE") {
      setOnlineUsers((prev) => ({
        ...prev,
        [status.senderId]: false,
      }))
    }
  }

  // Send a new message
  const sendMessage = (e) => {
    e.preventDefault()

    if (!newMessage.trim() || !stompClient || !connected || !selectedRoom) return

    const chatMessage = {
      senderId: user.id,
      senderName: user.username,
      content: newMessage,
      chatRoomId: selectedRoom.id,
      timestamp: new Date().toISOString(),
    }

    stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage))
    setNewMessage("")

    // Focus back on input
    messageInputRef.current?.focus()
  }

  // Send typing notification
  const sendTypingNotification = () => {
    if (!stompClient || !connected || !selectedRoom) return

    stompClient.send(
      `/app/chat.typing/${selectedRoom.id}`,
      {},
      JSON.stringify({
        senderId: user.id,
        senderName: user.username,
        chatRoomId: selectedRoom.id,
      }),
    )
  }

  // Select a chat room
  const selectRoom = (room) => {
    setSelectedRoom(room)

    // Mark messages as read
    if (user) {
      api.post(`/chat/messages/read?roomId=${room.id}&userId=${user.id}`)

      // Update unread count
      setChatRooms((prevRooms) => {
        return prevRooms.map((r) => {
          if (r.id === room.id) {
            return {
              ...r,
              unreadCount: 0,
            }
          }
          return r
        })
      })
    }
  }

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return ""

    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Format date for message groups
  const formatDate = (timestamp) => {
    if (!timestamp) return ""

    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  // Get chat room name
  const getRoomName = (room) => {
    if (!room) return ""

    if (room.type === "DIRECT") {
      // For direct messages, show the other user's name
      return room.user1Id === user?.id ? room.user2Name : room.user1Name
    } else {
      return room.name
    }
  }

  // Filter chat rooms by search query
  const filteredRooms = chatRooms.filter((room) => {
    const roomName = getRoomName(room).toLowerCase()
    return roomName.includes(searchQuery.toLowerCase())
  })

  // Sort chat rooms by last message time
  const sortedRooms = [...filteredRooms].sort((a, b) => {
    const timeA = a.lastMessageTime ? new Date(a.lastMessageTime) : new Date(0)
    const timeB = b.lastMessageTime ? new Date(b.lastMessageTime) : new Date(0)
    return timeB - timeA // Sort by most recent first
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-400 font-medium">Loading chat...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center max-w-md p-6 bg-gray-800 rounded-xl shadow-lg">
          <X className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="mt-4 text-xl font-bold text-white">Error</h2>
          <p className="mt-2 text-gray-400">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            onClick={() => (window.location.href = "/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Chat Sidebar */}
      <div
        className={`${showSidebar ? "w-80" : "w-0"} bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300 overflow-hidden`}
      >
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Messages</h2>
            <button className="p-1 rounded-full hover:bg-gray-700" onClick={() => setShowSidebar(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sortedRooms.length > 0 ? (
            sortedRooms.map((room) => (
              <div
                key={room.id}
                className={`p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-750 transition-colors ${
                  selectedRoom?.id === room.id ? "bg-gray-700" : ""
                }`}
                onClick={() => selectRoom(room)}
              >
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                      {room.type === "TEAM" ? <Users size={20} /> : getRoomName(room).substring(0, 2).toUpperCase()}
                    </div>
                    {onlineUsers[room.user1Id === user?.id ? room.user2Id : room.user1Id] && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    )}
                  </div>
                  <div className="ml-3 flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium truncate">{getRoomName(room)}</h3>
                      {room.lastMessageTime && (
                        <span className="text-xs text-gray-400">{formatTime(room.lastMessageTime)}</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-400 truncate">{room.lastMessageContent || "No messages yet"}</p>
                      {room.unreadCount > 0 && (
                        <span className="ml-2 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {room.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-gray-600 mb-3" />
              <p className="text-gray-400">No conversations yet</p>
              <p className="text-sm text-gray-500 mt-1">Start a new chat to begin messaging</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Main Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
              <div className="flex items-center">
                {!showSidebar && (
                  <button className="mr-3 p-1 rounded-full hover:bg-gray-700" onClick={() => setShowSidebar(true)}>
                    <Menu size={20} />
                  </button>
                )}
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold mr-3">
                  {selectedRoom.type === "TEAM" ? (
                    <Users size={18} />
                  ) : (
                    getRoomName(selectedRoom).substring(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{getRoomName(selectedRoom)}</h3>
                  <p className="text-xs text-gray-400">
                    {selectedRoom.type === "DIRECT"
                      ? onlineUsers[selectedRoom.user1Id === user?.id ? selectedRoom.user2Id : selectedRoom.user1Id]
                        ? "Online"
                        : "Offline"
                      : `${selectedRoom.participants?.length || 0} members`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="p-2 rounded-full hover:bg-gray-700">
                  <Phone size={18} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-700">
                  <Video size={18} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-700">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-850">
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message, index) => {
                    const isCurrentUser = message.senderId === user?.id
                    const showDate =
                      index === 0 || formatDate(messages[index - 1]?.timestamp) !== formatDate(message.timestamp)

                    return (
                      <div key={message.id || index}>
                        {showDate && (
                          <div className="text-center my-4">
                            <span className="bg-gray-700 text-gray-400 text-xs px-3 py-1 rounded-full">
                              {formatDate(message.timestamp)}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[75%] ${isCurrentUser ? "order-2" : "order-1"}`}>
                            {!isCurrentUser && (
                              <div className="flex items-center mb-1">
                                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-2">
                                  {message.senderName?.substring(0, 2).toUpperCase() || "U"}
                                </div>
                                <span className="text-sm text-gray-400">{message.senderName}</span>
                              </div>
                            )}
                            <div
                              className={`rounded-lg px-4 py-2 ${
                                isCurrentUser ? "bg-emerald-600 text-white" : "bg-gray-700 text-white"
                              }`}
                            >
                              <p>{message.content}</p>
                            </div>
                            <div className={`text-xs text-gray-400 mt-1 ${isCurrentUser ? "text-right" : "text-left"}`}>
                              {formatTime(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
                      <Send className="h-8 w-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-300">No messages yet</h3>
                    <p className="text-gray-500 mt-1">Send a message to start the conversation</p>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="bg-gray-800 border-t border-gray-700 p-4">
              <form onSubmit={sendMessage} className="flex items-center">
                <button type="button" className="p-2 rounded-full hover:bg-gray-700 text-gray-400">
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-3 mx-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={sendTypingNotification}
                  ref={messageInputRef}
                />
                <button type="button" className="p-2 rounded-full hover:bg-gray-700 text-gray-400 mr-2">
                  <Smile size={20} />
                </button>
                <button
                  type="submit"
                  className="p-3 rounded-full bg-emerald-600 hover:bg-emerald-700 transition-colors"
                  disabled={!newMessage.trim()}
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-850">
            <div className="text-center max-w-md p-8">
              <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-6">
                <User className="h-10 w-10 text-gray-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-300 mb-2">Welcome to Chat</h2>
              <p className="text-gray-400 mb-6">Select a conversation or start a new one to begin messaging</p>
              {!showSidebar && (
                <button
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  onClick={() => setShowSidebar(true)}
                >
                  View Conversations
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
