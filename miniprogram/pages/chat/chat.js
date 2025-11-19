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

    // Call AI response
    this.callAIAPI(userMessage.content)
  },

  // Call AI API
  async callAIAPI(userMessage) {
    try {
      // Get message history for context (last 10 messages)
      const recentMessages = this.data.messages.slice(-10);
      
      const response = await wx.request({
        url: 'http://localhost:8000/api/chat',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          message: userMessage,
          messageHistory: recentMessages
        }
      });

      console.log('AI Response:', response.data);

      if (response.data.success) {
        const aiMessage = {
          id: this.data.messageId++,
          type: 'ai',
          content: response.data.response,
          time: this.formatTime(new Date())
        };

        this.setData({
          messages: [...this.data.messages, aiMessage],
          isLoading: false,
          isTyping: false,
          scrollTop: 999999,
          toView: `msg-${aiMessage.id}`
        });
      } else {
        throw new Error(response.data.error || 'AI response failed');
      }

    } catch (error) {
      console.error('AI API Error:', error);
      
      // Fallback response
      const fallbackMessage = {
        id: this.data.messageId++,
        type: 'ai',
        content: '抱歉，我现在无法连接到AI服务。请检查网络连接或稍后再试。',
        time: this.formatTime(new Date())
      };

      this.setData({
        messages: [...this.data.messages, fallbackMessage],
        isLoading: false,
        isTyping: false,
        scrollTop: 999999,
        toView: `msg-${fallbackMessage.id}`
      });
    }
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