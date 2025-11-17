// miniprogram/pages/chatbot/chatbot.js
Page({

  /**
   * Page initial data
   */
  data: {
    messages: [],
    userInput: '',
    isSending: false,
    scrollTop: 0,
    currentTime: Date.now(),
    showSettingsPopup: false,
    showConfigPopup: false,
    cozeConfig: {
      apiKey: '',
      agentId: ''
    }
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    // 设置当前时间
    this.setData({
      currentTime: Date.now()
    });
  },

  /**
   * 格式化时间
   */
  formatTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  },

  /**
   * 输入框变化事件
   */
  onInputChange(e) {
    this.setData({
      userInput: e.detail.value
    });
  },

  /**
   * 发送消息
   */
  onSendMessage() {
    const { userInput, messages } = this.data;
    if (!userInput.trim() || this.data.isSending) return;

    // 添加用户消息
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: userInput.trim(),
      timestamp: Date.now(),
      loading: false
    };

    const newMessages = [...messages, userMessage];
    this.setData({
      messages: newMessages,
      userInput: '',
      isSending: true
    });

    // 滚动到底部
    this.scrollToBottom();

    // 模拟AI回复
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: '这是一个模拟的AI回复。在实际应用中，这里会调用Coze API获取真实的AI回复。',
        timestamp: Date.now(),
        loading: false
      };

      this.setData({
        messages: [...newMessages, aiMessage],
        isSending: false
      });

      this.scrollToBottom();
    }, 1000);
  },

  /**
   * 滚动到底部
   */
  scrollToBottom() {
    setTimeout(() => {
      this.setData({
        scrollTop: 99999
      });
    }, 100);
  },

  /**
   * 设置按钮点击
   */
  onSettingsClick() {
    this.setData({
      showSettingsPopup: true
    });
  },

  /**
   * 关闭设置弹窗
   */
  onCloseSettings() {
    this.setData({
      showSettingsPopup: false
    });
  },

  /**
   * 设置弹窗变化
   */
  onSettingsPopupChange(e) {
    this.setData({
      showSettingsPopup: e.detail.visible
    });
  },

  /**
   * Coze配置点击
   */
  onCozeConfigClick() {
    this.setData({
      showSettingsPopup: false,
      showConfigPopup: true
    });
  },

  /**
   * 关闭配置弹窗
   */
  onCloseConfig() {
    this.setData({
      showConfigPopup: false
    });
  },

  /**
   * 配置弹窗变化
   */
  onConfigPopupChange(e) {
    this.setData({
      showConfigPopup: e.detail.visible
    });
  },

  /**
   * API Key变化
   */
  onApiKeyChange(e) {
    this.setData({
      'cozeConfig.apiKey': e.detail.value
    });
  },

  /**
   * Agent ID变化
   */
  onAgentIdChange(e) {
    this.setData({
      'cozeConfig.agentId': e.detail.value
    });
  },

  /**
   * 保存配置
   */
  onSaveConfig() {
    const { apiKey, agentId } = this.data.cozeConfig;
    if (!apiKey || !agentId) {
      wx.showToast({
        title: '请填写完整配置',
        icon: 'none'
      });
      return;
    }

    // 保存配置到本地存储
    wx.setStorageSync('cozeConfig', this.data.cozeConfig);
    
    wx.showToast({
      title: '配置保存成功',
      icon: 'success'
    });

    this.setData({
      showConfigPopup: false
    });
  },

  /**
   * 清除聊天记录
   */
  onClearChatClick() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有聊天记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            messages: []
          });
          wx.showToast({
            title: '聊天记录已清除',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 使用说明
   */
  onHelpClick() {
    wx.showModal({
      title: '使用说明',
      content: '1. 首先配置Coze API信息\n2. 在输入框中输入您的问题\n3. AI助手会为您提供专业的金融建议',
      showCancel: false
    });
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {
    // 从本地存储加载配置
    const cozeConfig = wx.getStorageSync('cozeConfig') || { apiKey: '', agentId: '' };
    this.setData({
      cozeConfig,
      currentTime: Date.now()
    });
  }
})