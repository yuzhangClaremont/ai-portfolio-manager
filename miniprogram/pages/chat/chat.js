// miniprogram/pages/chat/chat.js
Page({
  data: {
    messages: [],
    inputText: '',
    isLoading: false,
    isTyping: false,
    scrollTop: 0,
    toView: '',
    messageId: 0
  },

  onLoad() {
    console.log('Chat page loaded')
    this.setData({
      scrollTop: 999999
    })
  },

  onShow() {
    console.log('Chat page shown')
  },

  // Input change handler
  onInputChange(e) {
    this.setData({
      inputText: e.detail.value
    })
  },

  // Send message
  onSendMessage() {
    if (!this.data.inputText.trim() || this.data.isLoading) {
      return
    }

    const userMessage = {
      id: this.data.messageId++,
      type: 'user',
      content: this.data.inputText.trim(),
      time: this.formatTime(new Date())
    }

    // Add user message
    this.setData({
      messages: [...this.data.messages, userMessage],
      inputText: '',
      isLoading: true,
      isTyping: true,
      scrollTop: 999999,
      toView: `msg-${userMessage.id}`
    })

    // Simulate AI response
    this.simulateAIResponse(userMessage.content)
  },

  // Simulate AI response
  simulateAIResponse(userQuestion) {
    setTimeout(() => {
      const responses = [
        "That's an interesting question! Let me help you with that.",
        "I understand what you're asking. Here's what I think...",
        "Great question! Based on my analysis, I would suggest...",
        "Thanks for asking! I can help you with that by...",
        "Let me provide you with some insights on that topic."
      ]

      const aiMessage = {
        id: this.data.messageId++,
        type: 'ai',
        content: responses[Math.floor(Math.random() * responses.length)],
        time: this.formatTime(new Date())
      }

      this.setData({
        messages: [...this.data.messages, aiMessage],
        isLoading: false,
        isTyping: false,
        scrollTop: 999999,
        toView: `msg-${aiMessage.id}`
      })
    }, 1500)
  },

  // Quick question handler
  onQuickQuestion(e) {
    const question = e.currentTarget.dataset.question
    this.setData({
      inputText: question
    })
    this.onSendMessage()
  },

  // Format time
  formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  },

  // Scroll to bottom
  scrollToBottom() {
    this.setData({
      scrollTop: 999999
    })
  },

  // Handle keyboard height change
  onKeyboardHeightChange(e) {
    const { height } = e.detail
    if (height > 0) {
      setTimeout(() => {
        this.scrollToBottom()
      }, 100)
    }
  }
})