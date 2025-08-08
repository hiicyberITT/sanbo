'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, X, Minimize2, User, Bot, Phone, Mail, Clock, Star } from 'lucide-react'

interface ChatMessage {
  id: string
  sender: 'user' | 'support' | 'bot'
  message: string
  timestamp: Date
  isRead?: boolean
}

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      message: 'Xin chào! Tôi là trợ lý ảo của CryptoTrade. Tôi có thể giúp gì cho bạn hôm nay? 😊',
      timestamp: new Date(),
      isRead: true
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOnline, setIsOnline] = useState(true)
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickReplies = [
    { text: 'Phí giao dịch là bao nhiêu?', icon: '💰' },
    { text: 'Làm sao để nạp tiền?', icon: '💳' },
    { text: 'Tôi quên mật khẩu', icon: '🔐' },
    { text: 'Liên hệ nhân viên hỗ trợ', icon: '👨‍💼' },
    { text: 'Hướng dẫn KYC', icon: '📋' },
    { text: 'Bảo mật tài khoản', icon: '🛡️' }
  ]

  const botResponses: { [key: string]: string } = {
    'phí': 'Phí giao dịch spot của chúng tôi là 0.1% cho cả maker và taker. Phí rút tiền: BTC 0.0005, ETH 0.005, USDT 5. Phí nạp tiền qua ngân hàng hoàn toàn miễn phí! 💸',
    'nạp': 'Bạn có thể nạp tiền qua: \n1️⃣ Chuyển khoản ngân hàng (miễn phí)\n2️⃣ Nạp cryptocurrency\n3️⃣ Thẻ tín dụng/ghi nợ\n\nVào mục "Ví" → "Nạp tiền" để bắt đầu nhé! 🏦',
    'mật khẩu': 'Để đặt lại mật khẩu:\n1️⃣ Click "Quên mật khẩu" ở trang đăng nhập\n2️⃣ Nhập email đã đăng ký\n3️⃣ Kiểm tra email và làm theo hướng dẫn\n\nNếu không nhận được email, hãy kiểm tra thư mục spam nhé! 📧',
    'hỗ trợ': 'Tôi đang kết nối bạn với nhân viên hỗ trợ chuyên nghiệp. Vui lòng chờ trong giây lát... 👨‍💼\n\nThời gian chờ trung bình: 2-3 phút',
    'kyc': 'Quy trình KYC (Xác thực danh tính):\n1️⃣ Tải lên CMND/CCCD mặt trước và sau\n2️⃣ Chụp ảnh selfie cầm giấy tờ\n3️⃣ Điền thông tin cá nhân\n\nThời gian duyệt: 1-24 giờ. KYC giúp tăng giới hạn giao dịch lên 100x! 🚀',
    'bảo mật': 'Để bảo vệ tài khoản:\n🔐 Bật xác thực 2FA\n📱 Sử dụng mật khẩu mạnh\n🚫 Không chia sẻ thông tin đăng nhập\n📧 Kiểm tra email thường xuyên\n\nVào "Cài đặt" → "Bảo mật" để thiết lập!',
    'default': 'Tôi không hiểu rõ câu hỏi của bạn. Bạn có thể:\n• Chọn câu hỏi gợi ý bên dưới\n• Liên hệ nhân viên hỗ trợ để được giúp đỡ chi tiết hơn\n• Gọi hotline: 1900 1234 (24/7) 📞'
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: message.trim(),
      timestamp: new Date(),
      isRead: true
    }

    setMessages(prev => [...prev, newMessage])
    setMessage('')
    setIsTyping(true)
    setShowQuickReplies(false)

    // Simulate bot response
    setTimeout(() => {
      const lowerMessage = message.toLowerCase()
      let response = botResponses.default
      let sender: 'bot' | 'support' = 'bot'

      for (const [key, value] of Object.entries(botResponses)) {
        if (key !== 'default' && lowerMessage.includes(key)) {
          response = value
          if (key === 'hỗ trợ') {
            sender = 'support'
          }
          break
        }
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender,
        message: response,
        timestamp: new Date(),
        isRead: isOpen
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)

      if (!isOpen) {
        setUnreadCount(prev => prev + 1)
      }
    }, 1500 + Math.random() * 2000)
  }

  const handleQuickReply = (reply: string) => {
    setMessage(reply)
    setTimeout(() => handleSendMessage(), 100)
  }

  const handleOpen = () => {
    setIsOpen(true)
    setUnreadCount(0)
    // Mark all messages as read
    setMessages(prev => prev.map(msg => ({ ...msg, isRead: true })))
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0)
    }
  }, [isOpen])

  // Simulate online status
  useEffect(() => {
    const interval = setInterval(() => {
      setIsOnline(Math.random() > 0.1) // 90% online
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleOpen}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-2xl relative group transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="w-7 h-7 text-white" />
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </Button>
        
        {/* Tooltip */}
        <div className="absolute bottom-20 right-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Hỗ trợ trực tuyến 24/7
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 bg-[#0F172A] border-[#1E293B] shadow-2xl transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-[500px]'
      }`}>
        <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">Hỗ trợ CryptoTrade</CardTitle>
                <div className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className="opacity-90">
                    {isOnline ? 'Đang online • Phản hồi ngay' : 'Offline • Sẽ phản hồi sớm'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-8 h-8 p-0 hover:bg-white/20 text-white"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="w-8 h-8 p-0 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[436px]">
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-gray-50 to-white dark:from-[#0B1426] dark:to-[#0F172A]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender !== 'user' && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.sender === 'bot' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'
                    }`}>
                      {msg.sender === 'bot' ? (
                        <Bot className="w-4 h-4 text-white" />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                  )}
                  <div className="max-w-xs">
                    <div
                      className={`p-3 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-md'
                          : 'bg-white dark:bg-[#1E293B] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-[#334155] rounded-bl-md shadow-sm'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.message}</div>
                    </div>
                    <div className={`text-xs text-gray-500 mt-1 ${
                      msg.sender === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white dark:bg-[#1E293B] p-3 rounded-2xl rounded-bl-md border border-gray-200 dark:border-[#334155] shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {showQuickReplies && messages.length <= 2 && (
              <div className="p-4 border-t border-gray-200 dark:border-[#1E293B] bg-gray-50 dark:bg-[#0B1426]">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 font-medium">Câu hỏi thường gặp:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickReplies.map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickReply(reply.text)}
                      className="justify-start text-xs h-auto p-2 border-gray-300 dark:border-[#334155] text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1E293B] whitespace-normal text-left"
                    >
                      <span className="mr-2">{reply.icon}</span>
                      <span className="truncate">{reply.text}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-[#1E293B] bg-white dark:bg-[#0F172A]">
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập tin nhắn của bạn..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="bg-gray-50 dark:bg-[#1E293B] border-gray-300 dark:border-[#334155] text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Contact Options */}
              <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-gray-200 dark:border-[#1E293B]">
                <Button variant="ghost" size="sm" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                  <Phone className="w-3 h-3 mr-1" />
                  1900 1234
                </Button>
                <Button variant="ghost" size="sm" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                  <Mail className="w-3 h-3 mr-1" />
                  Email
                </Button>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  24/7
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
