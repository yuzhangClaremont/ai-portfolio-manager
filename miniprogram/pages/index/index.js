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
    
    // Try different path formats
    const paths = [
      '/pages/chat/chat',
      '/miniprogram/pages/chat/chat',
      '../chat/chat',
      'chat/chat'
    ]
    
    // Try the first path
    wx.navigateTo({
      url: paths[0],
      success: function(res) {
        console.log('Navigation successful', res)
      },
      fail: function(err) {
        console.error('Navigation failed with path:', paths[0], err)
        
        // Try tabBar navigation instead
        wx.switchTab({
          url: paths[0],
          success: function(res) {
            console.log('Tab switch successful', res)
          },
          fail: function(err) {
            console.error('Tab switch also failed', err)
            wx.showToast({
              title: 'Navigation failed. Please use bottom tab.',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  }
})