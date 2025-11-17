Page({
  data: {
    // 用户信息
    userInfo: null as any,
    // 是否已登录
    isLoggedIn: false,
    // 用户保存的试衣图片
    savedImages: [
      {
        id: 1,
        url: 'https://via.placeholder.com/200x300/0052D9/FFFFFF?text=试衣效果1',
        title: '夏日连衣裙试穿',
        createTime: '2024-01-15'
      },
      {
        id: 2,
        url: 'https://via.placeholder.com/200x300/0052D9/FFFFFF?text=试衣效果2',
        title: '商务西装搭配',
        createTime: '2024-01-14'
      },
      {
        id: 3,
        url: 'https://via.placeholder.com/200x300/0052D9/FFFFFF?text=试衣效果3',
        title: '休闲运动装',
        createTime: '2024-01-13'
      }
    ]
  },

  onLoad() {
    console.log('个人中心页面加载');
    this.checkLoginStatus();
  },

  onShow() {
    // 每次页面显示时检查登录状态
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus() {
    // 模拟检查登录状态，实际项目中应该从本地存储或后端获取
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo,
        isLoggedIn: true
      });
    } else {
      this.setData({
        userInfo: null,
        isLoggedIn: false
      });
    }
  },

  // 登录
  onLogin() {
    // 模拟登录过程，实际项目中应该调用微信登录API
    wx.showModal({
      title: '登录',
      content: '是否使用微信一键登录？',
      success: (res) => {
        if (res.confirm) {
          this.performLogin();
        }
      }
    });
  },

  // 执行登录
  performLogin() {
    // 模拟登录成功
    const mockUserInfo = {
      id: 1,
      nickname: 'AI试衣用户',
      avatar: 'https://via.placeholder.com/100x100/0052D9/FFFFFF?text=用户',
      phone: '138****8888'
    };

    // 保存用户信息到本地存储
    wx.setStorageSync('userInfo', mockUserInfo);
    
    this.setData({
      userInfo: mockUserInfo,
      isLoggedIn: true
    });

    wx.showToast({
      title: '登录成功',
      icon: 'success'
    });
  },

  // 登出
  onLogout() {
    wx.showModal({
      title: '确认登出',
      content: '确定要退出当前账号吗？',
      success: (res) => {
        if (res.confirm) {
          this.performLogout();
        }
      }
    });
  },

  // 执行登出
  performLogout() {
    // 清除本地存储的用户信息
    wx.removeStorageSync('userInfo');
    
    this.setData({
      userInfo: null,
      isLoggedIn: false
    });

    wx.showToast({
      title: '已登出',
      icon: 'success'
    });
  },

  // 编辑个人资料
  onEditProfile() {
    wx.navigateTo({
      url: '/pages/profile-setting/profile-setting'
    });
  },

  // 查看试衣详情
  onViewImageDetail(e: any) {
    const { index } = e.currentTarget.dataset;
    const image = this.data.savedImages[index];
    
    wx.previewImage({
      urls: [image.url],
      current: image.url
    });
  },

  // 删除试衣图片
  onDeleteImage(e: any) {
    const { index } = e.currentTarget.dataset;
    const { savedImages } = this.data;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这张试衣图片吗？',
      success: (res) => {
        if (res.confirm) {
          savedImages.splice(index, 1);
          this.setData({
            savedImages
          });
          
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  }
});