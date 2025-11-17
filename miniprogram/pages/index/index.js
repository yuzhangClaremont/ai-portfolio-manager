// miniprogram/pages/index/index.js
Page({
  data: {
    
  },

  onLoad() {
    console.log('Welcome page loaded')
  },

  onShow() {
    console.log('Welcome page shown')
  },

  // Navigate to chat page
  navigateToChat() {
    console.log('Navigate to chat clicked')
    wx.switchTab({
      url: '/miniprogram/pages/chat/chat',
      success: function(res) {
        console.log('Navigation successful', res)
      },
      fail: function(err) {
        console.error('Navigation failed', err)
        wx.showToast({
          title: 'Navigation failed. Please use bottom tab.',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})