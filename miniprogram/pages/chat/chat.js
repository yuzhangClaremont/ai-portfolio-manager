// miniprogram/pages/chat/chat.js
// AI Chat Page for WeChat Mini-program
// Integrates with Python LangChain LangGraph backend and DeepSeek LLM

Page({
  // Page data - manages chat state
  data: {
    messages: [],          // Array of chat messages (user + AI)
    inputText: '',          // Current text in input field
    isLoading: false,       // Loading state during API call
    isTyping: false,        // Shows "AI is typing" indicator
    scrollTop: 0,           // Scroll position for auto-scroll
    toView: '',             // Element ID to scroll to
    messageId: 0            // Unique ID counter for messages
  },

  // Lifecycle: Page loads - initialize chat
  onLoad() {
    console.log('Chat page loaded')
    // Auto-scroll to bottom on page load
    this.setData({
      scrollTop: 999999
    })
  },

  // Lifecycle: Page becomes visible - log for debugging
  onShow() {
    console.log('Chat page shown')
  },

  /**
   * Handle input field changes
   * @param {Object} e - Event object from input field
   * Updates inputText in real-time as user types
   */
  onInputChange(e) {
    this.setData({
      inputText: e.detail.value
    })
  },

  /**
   * Send message handler - triggered by send button or Enter key (bindconfirm)
   * Creates user message, adds to chat, calls AI API
   */
  onSendMessage() {
    // Validation: Don't send empty messages or during loading
    if (!this.data.inputText.trim() || this.data.isLoading) {
      return
    }

    // Create user message object with unique ID
    const userMessage = {
      id: this.data.messageId++,  // Increment ID for uniqueness
      type: 'user',               // Message type for styling
      content: this.data.inputText.trim(),  // Cleaned message text
      time: this.formatTime(new Date())      // Current timestamp
    }

    // Update UI: Add user message, clear input, show loading
    this.setData({
      messages: [...this.data.messages, userMessage],  // Add to message history
      inputText: '',              // Clear input field
      isLoading: true,            // Show loading spinner
      isTyping: true,             // Show typing indicator
      scrollTop: 999999,          // Auto-scroll to bottom
      toView: `msg-${userMessage.id}`  // Scroll to new message
    })

    // Call AI API for response
    this.callAIAPI(userMessage.content)
  },

  /**
   * Call AI backend service
   * @param {string} userMessage - The user's message content
   * Makes HTTP request to Python LangChain backend
   */
  async callAIAPI(userMessage) {
    try {
      // Get recent message history for context (last 10 messages)
      const recentMessages = this.data.messages.slice(-10);
      
      // Make HTTP POST request to Python FastAPI backend
      const response = await wx.request({
        url: 'http://localhost:8000/api/chat',  // Python backend endpoint
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          message: userMessage,           // Current user message
          messageHistory: recentMessages  // Conversation context
        }
      });

      console.log('AI Response:', response.data);

      // Check if AI response was successful
      if (response.data.success) {
        // Create AI message object
        const aiMessage = {
          id: this.data.messageId++,     // Unique ID
          type: 'ai',                    // AI message type
          content: response.data.response,  // AI generated response
          time: this.formatTime(new Date())   // Timestamp
        };

        // Update UI: Add AI response, remove loading state
        this.setData({
          messages: [...this.data.messages, aiMessage],
          isLoading: false,      // Hide loading spinner
          isTyping: false,       // Hide typing indicator
          scrollTop: 999999,      // Auto-scroll to bottom
          toView: `msg-${aiMessage.id}`  // Scroll to AI message
        });
      } else {
        // Handle API success but processing failure
        throw new Error(response.data.error || 'AI response failed');
      }

    } catch (error) {
      console.error('AI API Error:', error);
      
      // Fallback: Show user-friendly error message
      const fallbackMessage = {
        id: this.data.messageId++,     // Unique ID
        type: 'ai',                    // AI message type
        content: '抱歉，我现在无法连接到AI服务。请检查网络连接或稍后再试。',  // Error message
        time: this.formatTime(new Date())   // Timestamp
      };

      // Update UI with error message, remove loading state
      this.setData({
        messages: [...this.data.messages, fallbackMessage],
        isLoading: false,      // Hide loading
        isTyping: false,       // Hide typing
        scrollTop: 999999,      // Auto-scroll
        toView: `msg-${fallbackMessage.id}`  // Scroll to error message
      });
    }
  },

  /**
   * Handle quick question clicks (if implemented)
   * @param {Object} e - Event object from quick question button
   * Pre-fills input with question and sends automatically
   */
  onQuickQuestion(e) {
    const question = e.currentTarget.dataset.question
    this.setData({
      inputText: question  // Pre-fill input
    })
    this.onSendMessage()  // Auto-send
  },

  /**
   * Format time for display
   * @param {Date} date - Date object to format
   * @returns {string} Formatted time string (HH:MM)
   */
  formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  },

  /**
   * Manually scroll chat to bottom
   * Used for programmatic scrolling
   */
  scrollToBottom() {
    this.setData({
      scrollTop: 999999  // Large value ensures bottom scroll
    })
  },

  /**
   * Handle keyboard height changes (mobile keyboard)
   * @param {Object} e - Keyboard height change event
   * Adjusts scroll position when keyboard appears/disappears
   */
  onKeyboardHeightChange(e) {
    const { height } = e.detail
    if (height > 0) {
      // Keyboard is open - scroll to bottom after brief delay
      setTimeout(() => {
        this.scrollToBottom()
      }, 100)
    }
  }
})