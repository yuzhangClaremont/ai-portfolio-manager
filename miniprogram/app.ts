// app.ts
App({
  globalData: {
    userInfo: null,
    token: null,
    // 投资组合数据
    portfolioData: null,
    // Coze AI代理配置
    cozeConfig: {
      apiKey: '', // 需要用户配置
      agentId: '', // 需要用户配置
      baseUrl: 'https://api.coze.com'
    }
  },
  
  onLaunch() {
    console.log('AI投资组合管理小程序启动');
    
    // 检查登录状态
    this.checkLoginStatus();
    
    // 检查更新
    this.checkUpdate();
    
    // 初始化投资组合数据
    this.initPortfolioData();
  },
  
  onShow() {
    console.log('小程序显示');
  },
  
  onHide() {
    console.log('小程序隐藏');
  },
  
  // 检查登录状态
  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo');
    const token = wx.getStorageSync('token');
    
    if (userInfo && token) {
      this.globalData.userInfo = userInfo;
      this.globalData.token = token;
      console.log('用户已登录:', userInfo.nickname);
    } else {
      console.log('用户未登录');
    }
  },
  
  // 检查更新
  checkUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          console.log('发现新版本');
        }
      });
      
      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: (res) => {
            if (res.confirm) {
              updateManager.applyUpdate();
            }
          }
        });
      });
      
      updateManager.onUpdateFailed(() => {
        wx.showToast({
          title: '更新失败',
          icon: 'none'
        });
      });
    }
  },
  
  // 登录方法
  login(callback?: Function) {
    wx.login({
      success: (res) => {
        if (res.code) {
          // 这里应该调用后端API进行登录
          console.log('登录code:', res.code);
          
          // 模拟登录成功
          const mockUserInfo = {
            id: 1,
            nickname: 'AI试衣用户',
            avatar: 'https://via.placeholder.com/100x100/0052D9/FFFFFF?text=用户',
            phone: '138****8888'
          };
          
          const mockToken = 'mock_token_' + Date.now();
          
          // 保存到全局数据和本地存储
          this.globalData.userInfo = mockUserInfo;
          this.globalData.token = mockToken;
          wx.setStorageSync('userInfo', mockUserInfo);
          wx.setStorageSync('token', mockToken);
          
          if (callback) {
            callback(true);
          }
          
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          });
        } else {
          console.log('登录失败:', res.errMsg);
          if (callback) {
            callback(false);
          }
        }
      },
      fail: (err) => {
        console.error('登录失败:', err);
        if (callback) {
          callback(false);
        }
      }
    });
  },
  
  // 登出方法
  logout() {
    this.globalData.userInfo = null;
    this.globalData.token = null;
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('token');
    
    console.log('用户已登出');
    wx.showToast({
      title: '已登出',
      icon: 'success'
    });
  },
  
  // 公共路由方法 - 无需登录即可访问
  navigateToPublicPage(url: string) {
    wx.navigateTo({
      url: url
    });
  },
  
  // 检查是否需要登录的路由方法
  navigateToPage(url: string, requireLogin: boolean = false) {
    if (requireLogin && !this.globalData.token) {
      // 需要登录但未登录，跳转到登录页面
      wx.navigateTo({
        url: '/pages/index/index'
      });
      return;
    }
    
    // 直接跳转
    wx.navigateTo({
      url: url
    });
  }
})