// AI金融助手页面 - 连接Coze金融AI代理
Page({
  data: {
    // 聊天消息列表
    messages: [],
    // 用户输入
    userInput: '',
    // 是否正在发送消息
    isSending: false,
    // 滚动位置
    scrollTop: 0,
    // 弹窗显示状态
    showSettingsPopup: false,
    showConfigPopup: false,
    // Coze AI代理配置
    cozeConfig: {
      apiKey: '', // 需要用户配置
      agentId: '', // 需要用户配置
      baseUrl: 'https://api.coze.com'
    }
  },

  onLoad() {
    console.log('AI金融助手页面加载');
    // 加载保存的配置
    this.loadCozeConfig();
  },

  // 加载Coze配置
  loadCozeConfig() {
    const cozeConfig = wx.getStorageSync('cozeConfig');
    if (cozeConfig) {
      this.setData({
        cozeConfig: cozeConfig
      });
    }
  },

  // 用户输入变化
  onInputChange(e: any) {
    this.setData({
      userInput: e.detail.value
    });
  },

  // 发送消息
  onSendMessage() {
    const { userInput, isSending } = this.data;
    
    if (!userInput.trim() || isSending) {
      return;
    }

    // 添加用户消息
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: userInput,
      timestamp: new Date().getTime()
    };

    this.setData({
      messages: [...this.data.messages, userMessage],
      userInput: '',
      isSending: true
    });

    // 滚动到底部
    this.scrollToBottom();

    // 调用Coze AI代理
    this.callCozeAI(userInput);
  },

  // 调用Coze AI代理
  async callCozeAI(userInput: string) {
    try {
      const { cozeConfig } = this.data;
      
      if (!cozeConfig.apiKey || !cozeConfig.agentId) {
        // 如果未配置，返回模拟响应
        this.handleMockResponse(userInput);
        return;
      }

      // 实际调用Coze API的逻辑
      // 这里需要实现与Coze API的集成
      const response = await this.callCozeAPI(userInput);
      
      // 添加AI回复
      const aiMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response,
        timestamp: new Date().getTime()
      };

      this.setData({
        messages: [...this.data.messages, aiMessage],
        isSending: false
      });

      this.scrollToBottom();

    } catch (error) {
      console.error('调用Coze AI失败:', error);
      
      // 添加错误消息
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: '抱歉，AI助手暂时无法响应。请检查您的网络连接或稍后重试。',
        timestamp: new Date().getTime()
      };

      this.setData({
        messages: [...this.data.messages, errorMessage],
        isSending: false
      });

      this.scrollToBottom();
    }
  },

  // 模拟响应（当未配置Coze时使用）
  handleMockResponse(userInput: string) {
    // 模拟AI响应
    let response = '';
    
    if (userInput.includes('投资组合') || userInput.includes('portfolio')) {
      response = '根据您的投资组合数据，目前总价值为$125,000，今日上涨$2,450（+2.0%）。建议关注科技股的表现，可以考虑适当调整资产配置。';
    } else if (userInput.includes('股票') || userInput.includes('AAPL') || userInput.includes('苹果')) {
      response = '苹果公司(AAPL)当前股价$185，您的持仓50股价值$9,250，盈利$1,750。建议关注其季度财报和产品发布动态。';
    } else if (userInput.includes('建议') || userInput.includes('推荐')) {
      response = '基于当前市场情况，建议：1) 保持多元化投资 2) 关注科技和新能源板块 3) 适当配置债券降低风险 4) 定期重新平衡投资组合。';
    } else if (userInput.includes('风险') || userInput.includes('安全')) {
      response = '您的投资组合风险适中。建议：1) 保持20-30%的现金储备 2) 分散投资到不同行业 3) 设置止损点 4) 定期评估投资策略。';
    } else {
      response = '我主要专注于投资组合分析和金融建议。您可以询问关于您的投资组合、股票分析、市场趋势或投资策略的问题。';
    }

    // 添加AI回复
    const aiMessage = {
      id: Date.now() + 1,
      type: 'assistant',
      content: response,
      timestamp: new Date().getTime()
    };

    this.setData({
      messages: [...this.data.messages, aiMessage],
      isSending: false
    });

    this.scrollToBottom();
  },

  // 调用Coze API（需要实际实现）
  async callCozeAPI(userInput: string): Promise<string> {
    // 这里需要实现实际的Coze API调用
    // 返回模拟响应作为占位符
    return '这是来自Coze AI代理的响应。请配置正确的API密钥和代理ID以使用真实服务。';
  },

  // 滚动到底部
  scrollToBottom() {
    setTimeout(() => {
      wx.pageScrollTo({
        scrollTop: 10000,
        duration: 300
      });
    }, 100);
  },

  // 配置Coze AI
  onConfigureCoze() {
    wx.navigateTo({
      url: '/pages/profile/profile?tab=settings'
    });
  },

  // 清空聊天记录
  onClearChat() {
    wx.showModal({
      title: '清空聊天记录',
      content: '确定要清空所有聊天记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            messages: []
          });
        }
      }
    });
  },

  // 时间格式化
  formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  },

  // 设置按钮点击
  onSettingsClick() {
    this.setData({
      showSettingsPopup: true
    });
  },

  // 关闭设置弹窗
  onCloseSettings() {
    this.setData({
      showSettingsPopup: false
    });
  },

  // 设置弹窗显示变化
  onSettingsPopupChange(e: any) {
    this.setData({
      showSettingsPopup: e.detail.visible
    });
  },

  // Coze配置点击
  onCozeConfigClick() {
    this.setData({
      showSettingsPopup: false,
      showConfigPopup: true
    });
  },

  // 关闭配置弹窗
  onCloseConfig() {
    this.setData({
      showConfigPopup: false
    });
  },

  // 配置弹窗显示变化
  onConfigPopupChange(e: any) {
    this.setData({
      showConfigPopup: e.detail.visible
    });
  },

  // API Key 变化
  onApiKeyChange(e: any) {
    const { cozeConfig } = this.data;
    this.setData({
      cozeConfig: {
        ...cozeConfig,
        apiKey: e.detail.value
      }
    });
  },

  // Agent ID 变化
  onAgentIdChange(e: any) {
    const { cozeConfig } = this.data;
    this.setData({
      cozeConfig: {
        ...cozeConfig,
        agentId: e.detail.value
      }
    });
  },

  // 保存配置
  onSaveConfig() {
    const { cozeConfig } = this.data;
    
    if (!cozeConfig.apiKey || !cozeConfig.agentId) {
      wx.showToast({
        title: '请填写完整的配置信息',
        icon: 'none'
      });
      return;
    }

    wx.setStorageSync('cozeConfig', cozeConfig);
    
    this.setData({
      showConfigPopup: false
    });

    wx.showToast({
      title: '配置保存成功',
      icon: 'success'
    });
  },

  // 清除聊天记录点击
  onClearChatClick() {
    this.onClearChat();
    this.setData({
      showSettingsPopup: false
    });
  },

  // 帮助点击
  onHelpClick() {
    this.setData({
      showSettingsPopup: false
    });
    
    wx.showModal({
      title: '使用说明',
      content: '1. 首先配置Coze API信息\n2. 输入问题与AI助手对话\n3. 支持投资组合分析、市场趋势解读等功能',
      showCancel: false
    });
  }
});