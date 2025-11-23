// miniprogram/pages/chat/chat.js
// Debug version with extensive logging

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
    console.log('=== Chat page loaded ===')
    this.setData({
      scrollTop: 999999
    })
  },

  onInputChange(e) {
    console.log('Input changed:', e.detail.value)
    this.setData({
      inputText: e.detail.value
    })
  },

  // Send message with extensive debugging
  onSendMessage() {
    console.log('=== SEND MESSAGE CALLED ===')
    console.log('InputText:', this.data.inputText)
    console.log('IsLoading:', this.data.isLoading)
    
    if (!this.data.inputText.trim() || this.data.isLoading) {
      console.log('Send blocked - empty or loading')
      return
    }

    const userMessage = {
      id: this.data.messageId++,
      type: 'user',
      content: this.data.inputText.trim(),
      time: this.formatTime(new Date())
    }

    console.log('User message created:', userMessage)

    this.setData({
      messages: [...this.data.messages, userMessage],
      inputText: '',
      isLoading: true,
      isTyping: true,
      scrollTop: 999999,
      toView: `msg-${userMessage.id}`
    })

    console.log('UI updated, calling API...')
    this.callAIAPI(userMessage.content)
  },

  // Debug API call
  async callAIAPI(userMessage) {
    console.log('=== API CALL START ===')
    console.log('User message:', userMessage)
    
    const recentMessages = this.data.messages.slice(-10);
    console.log('Recent messages for context:', recentMessages)
    
    const requestData = {
      message: userMessage,
      messageHistory: recentMessages
    }
    console.log('Request data:', requestData)
    
    try {
      console.log('Making request to: http://localhost:8000/api/chat')
      
      const response = await wx.request({
        url: 'http://localhost:8000/api/chat',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: requestData,
        timeout: 10000  // 10 second timeout
      })

      console.log('=== API RESPONSE ===')
      console.log('Response object:', response)
      console.log('Response data:', response.data)
      console.log('Status code:', response.statusCode)

      if (response.data && response.data.success) {
        const aiMessage = {
          id: this.data.messageId++,
          type: 'ai',
          content: response.data.response,
          time: this.formatTime(new Date())
        }

        console.log('AI message created:', aiMessage)

        this.setData({
          messages: [...this.data.messages, aiMessage],
          isLoading: false,
          isTyping: false,
          scrollTop: 999999,
          toView: `msg-${aiMessage.id}`
        })
      } else {
        console.log('API returned failure:', response.data)
        throw new Error(response.data?.error || 'AI response failed')
      }

    } catch (error) {
      console.log('=== API ERROR ===')
      console.log('Error object:', error)
      console.log('Error message:', error.errMsg || error.message)
      console.log('Stack trace:', error.stack)
      
      const fallbackMessage = {
        id: this.data.messageId++,
        type: 'ai',
        content: `API Error: ${error.errMsg || error.message}`,
        time: this.formatTime(new Date())
      }

      this.setData({
        messages: [...this.data.messages, fallbackMessage],
        isLoading: false,
        isTyping: false,
        scrollTop: 999999,
        toView: `msg-${fallbackMessage.id}`
      })
    }
  },

  formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  },

  scrollToBottom() {
    this.setData({
      scrollTop: 999999
    })
  }
})