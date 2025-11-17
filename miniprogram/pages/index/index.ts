// 首页 - 投资组合概览
Page({
  data: {
    // 投资组合概览数据
    portfolioOverview: {
      totalValue: 125000,
      todayChange: 2450,
      todayChangePercent: 2.0,
      totalReturn: 25000,
      totalReturnPercent: 25.0
    },
    // 资产配置
    assetAllocation: [
      { name: '股票', value: 75000, percentage: 60, color: '#0052D9' },
      { name: '债券', value: 30000, percentage: 24, color: '#00A870' },
      { name: '现金', value: 15000, percentage: 12, color: '#ED7B2F' },
      { name: '其他', value: 5000, percentage: 4, color: '#E34D59' }
    ],
    // 近期表现
    recentPerformance: [
      { date: '01-15', value: 122550, change: 1250 },
      { date: '01-14', value: 121300, change: -800 },
      { date: '01-13', value: 122100, change: 900 },
      { date: '01-12', value: 121200, change: 600 },
      { date: '01-11', value: 120600, change: 400 }
    ],
    // 持仓列表
    holdings: [
      { symbol: 'AAPL', name: '苹果公司', shares: 50, avgPrice: 150, currentPrice: 185, value: 9250, change: 1750 },
      { symbol: 'MSFT', name: '微软公司', shares: 30, avgPrice: 300, currentPrice: 380, value: 11400, change: 2400 },
      { symbol: 'TSLA', name: '特斯拉', shares: 20, avgPrice: 200, currentPrice: 220, value: 4400, change: 400 },
      { symbol: 'GOOGL', name: '谷歌', shares: 15, avgPrice: 120, currentPrice: 140, value: 2100, change: 300 }
    ]
  },

  onLoad() {
    console.log('投资组合概览页面加载');
  },

  onShow() {
    // 页面显示时刷新数据
    this.refreshPortfolioData();
  },

  // 刷新投资组合数据
  refreshPortfolioData() {
    // 这里可以添加从后端获取数据的逻辑
    console.log('刷新投资组合数据');
  },

  // 查看持仓详情
  onViewHoldingDetail(e: any) {
    const { index } = e.currentTarget.dataset;
    const holding = this.data.holdings[index];
    
    wx.showModal({
      title: `${holding.symbol} - ${holding.name}`,
      content: `持仓数量: ${holding.shares}股\n当前价值: $${holding.value.toLocaleString()}\n盈亏: $${holding.change.toLocaleString()}`,
      showCancel: false
    });
  },

  // 跳转到AI助手
  onGoToChatbot() {
    wx.switchTab({
      url: '/pages/chatbot/chatbot'
    });
  },

  // 体验AI助手 - 无需登录直接访问
  onTryAIAssistant() {
    // 聊天机器人页面在tabBar中，需要使用switchTab
    wx.switchTab({
      url: '/pages/chatbot/chatbot'
    });
  },

  // 跳转到投资组合详情
  onGoToPortfolio() {
    wx.switchTab({
      url: '/pages/portfolio/portfolio'
    });
  },

  // 添加新投资
  onAddInvestment() {
    wx.showModal({
      title: '添加投资',
      content: '此功能正在开发中，即将推出',
      showCancel: false
    });
  }
})
