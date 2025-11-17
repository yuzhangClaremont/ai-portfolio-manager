Component({
  data: {
    activeTab: 'index'
  },

  lifetimes: {
    attached() {
      // 获取当前页面路径，设置对应的tab
      const pages = getCurrentPages();
      if (pages.length > 0) {
        const currentPage = pages[pages.length - 1];
        const route = currentPage.route;
        
        let activeTab = 'index';
        if (route.includes('profile')) {
          activeTab = 'profile';
        }
        
        this.setData({
          activeTab
        });
      }
    }
  },

  methods: {
    switchTab(e: any) {
      const { value } = e.currentTarget.dataset;
      
      // 更新当前激活的tab
      this.setData({
        activeTab: value
      });

      // 根据tab值跳转到对应页面
      switch (value) {
        case 'index':
          wx.switchTab({
            url: '/pages/index/index'
          });
          break;
        case 'profile':
          wx.switchTab({
            url: '/pages/profile/profile'
          });
          break;
      }
    }
  }
})