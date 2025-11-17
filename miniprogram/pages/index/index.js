// miniprogram/pages/index/index.js
const app = getApp()

Page({
  data: {
    // 当前选中的选项卡
    currentTab: 'login',
    
    // 选项卡列表
    tabsList: [
      { label: '登录', value: 'login' },
      { label: '注册', value: 'register' }
    ],
    
    // 登录表单数据
    loginForm: {
      phone: '',
      password: ''
    },
    
    // 注册表单数据
    registerForm: {
      phone: '',
      code: '',
      password: '',
      confirmPassword: ''
    },
    
    // 是否记住密码
    rememberMe: false,
    
    // 是否同意协议
    agreedToTerms: false,
    
    // 验证码倒计时
    codeCountdown: 0,
    
    // 登录加载状态
    loginLoading: false,
    
    // 注册加载状态
    registerLoading: false
  },

  onLoad() {
    console.log('登录注册页面加载')
    
    // 检查是否已登录
    this.checkLoginStatus()
    
    // 恢复记住的密码
    this.restoreRememberedPassword()
  },

  onShow() {
    console.log('登录注册页面显示')
  },

  // 检查登录状态
  checkLoginStatus() {
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      // 已登录，跳转到首页
      wx.switchTab({
        url: '/pages/chatbot/chatbot'
      })
    }
  },

  // 恢复记住的密码
  restoreRememberedPassword() {
    const remembered = wx.getStorageSync('rememberMe')
    if (remembered) {
      const savedPhone = wx.getStorageSync('savedPhone')
      const savedPassword = wx.getStorageSync('savedPassword')
      
      if (savedPhone && savedPassword) {
        this.setData({
          rememberMe: true,
          'loginForm.phone': savedPhone,
          'loginForm.password': savedPassword
        })
      }
    }
  },

  // Tab切换事件
  onTabChange(e) {
    this.setData({
      currentTab: e.detail.value
    })
  },

  // 切换到登录
  switchToLogin() {
    this.setData({
      currentTab: 'login'
    })
  },

  // 切换到注册
  switchToRegister() {
    this.setData({
      currentTab: 'register'
    })
  },

  // 登录表单输入处理
  onLoginPhoneChange(e) {
    this.setData({
      'loginForm.phone': e.detail
    })
  },

  onLoginPasswordChange(e) {
    this.setData({
      'loginForm.password': e.detail
    })
  },

  // 注册表单输入处理
  onRegisterPhoneChange(e) {
    this.setData({
      'registerForm.phone': e.detail
    })
  },

  onRegisterCodeChange(e) {
    this.setData({
      'registerForm.code': e.detail
    })
  },

  onRegisterPasswordChange(e) {
    this.setData({
      'registerForm.password': e.detail
    })
  },

  onRegisterConfirmPasswordChange(e) {
    this.setData({
      'registerForm.confirmPassword': e.detail
    })
  },

  // 记住密码切换
  onRememberChange(e) {
    this.setData({
      rememberMe: e.detail
    })
  },

  // 同意协议切换
  onAgreeTermsChange(e) {
    this.setData({
      agreedToTerms: e.detail
    })
  },

  // 发送验证码
  onSendCode() {
    const { phone } = this.data.registerForm
    
    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }

    // 开始倒计时
    this.startCodeCountdown()

    // 模拟发送验证码
    wx.showToast({
      title: '验证码已发送',
      icon: 'success'
    })

    // 这里应该调用后端API发送验证码
    console.log('发送验证码到手机:', phone)
  },

  // 开始验证码倒计时
  startCodeCountdown() {
    this.setData({
      codeCountdown: 60
    })

    const timer = setInterval(() => {
      this.setData({
        codeCountdown: this.data.codeCountdown - 1
      })

      if (this.data.codeCountdown <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  },

  // 登录
  onLogin() {
    const { phone, password } = this.data.loginForm

    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }

    if (!password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return
    }

    this.setData({
      loginLoading: true
    })

    // 模拟登录请求
    setTimeout(() => {
      this.setData({
        loginLoading: false
      })

      // 保存记住密码设置
      if (this.data.rememberMe) {
        wx.setStorageSync('rememberMe', true)
        wx.setStorageSync('savedPhone', phone)
        wx.setStorageSync('savedPassword', password)
      } else {
        wx.removeStorageSync('rememberMe')
        wx.removeStorageSync('savedPhone')
        wx.removeStorageSync('savedPassword')
      }

      // 调用全局登录方法
      app.login((success) => {
        if (success) {
          // 登录成功，跳转到首页
          wx.switchTab({
            url: '/miniprogram/pages/chatbot/chatbot'
          })
        }
      })
    }, 1000)
  },

  // 注册
  onRegister() {
    const { phone, code, password, confirmPassword } = this.data.registerForm

    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }

    if (!code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return
    }

    if (!password) {
      wx.showToast({
        title: '请设置密码',
        icon: 'none'
      })
      return
    }

    if (password !== confirmPassword) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none'
      })
      return
    }

    if (password.length < 6) {
      wx.showToast({
        title: '密码长度不能少于6位',
        icon: 'none'
      })
      return
    }

    this.setData({
      registerLoading: true
    })

    // 模拟注册请求
    setTimeout(() => {
      this.setData({
        registerLoading: false
      })

      // 注册成功，切换到登录页
      wx.showToast({
        title: '注册成功',
        icon: 'success'
      })

      this.setData({
        currentTab: 'login',
        'loginForm.phone': phone,
        'loginForm.password': password
      })
    }, 1000)
  },

  // 微信登录
  onWechatLogin() {
    wx.showToast({
      title: '微信登录功能开发中',
      icon: 'none'
    })
  },

  // 忘记密码
  onForgotPassword() {
    wx.showToast({
      title: '忘记密码功能开发中',
      icon: 'none'
    })
  },

  // 查看用户协议
  onViewTerms() {
    wx.showToast({
      title: '用户协议查看功能开发中',
      icon: 'none'
    })
  },

  // 查看隐私政策
  onViewPrivacy() {
    wx.showToast({
      title: '隐私政策查看功能开发中',
      icon: 'none'
    })
  },

  // 体验AI助手 - 无需登录直接访问
  onTryAIAssistant() {
    // 聊天机器人页面在tabBar中，需要使用switchTab
    wx.switchTab({
      url: '/pages/chatbot/chatbot'
    })
  }
})