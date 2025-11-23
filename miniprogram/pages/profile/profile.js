Page({
  data: {
    mode: 'login',
    email: '',
    password: '',
    confirmPassword: '',
    isLoading: false
  },
  onEmailInput(e) {
    this.setData({ email: e.detail.value })
  },
  onPasswordInput(e) {
    this.setData({ password: e.detail.value })
  },
  onConfirmPasswordInput(e) {
    this.setData({ confirmPassword: e.detail.value })
  },
  onSwitchMode() {
    const next = this.data.mode === 'login' ? 'register' : 'login'
    this.setData({ mode: next, password: '', confirmPassword: '' })
  },
  onSubmit() {
    if (this.data.isLoading) return
    const email = this.data.email.trim()
    const password = this.data.password
    const confirmPassword = this.data.confirmPassword
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!emailOk) {
      wx.showToast({ title: '邮箱格式不正确', icon: 'none' })
      return
    }
    if (!password || password.length < 6) {
      wx.showToast({ title: '密码至少6位', icon: 'none' })
      return
    }
    if (this.data.mode === 'register' && password !== confirmPassword) {
      wx.showToast({ title: '两次密码不一致', icon: 'none' })
      return
    }
    const baseUrl = 'http://localhost:8000'
    const url = this.data.mode === 'login' ? `${baseUrl}/api/auth/login` : `${baseUrl}/api/auth/register`
    this.setData({ isLoading: true })
    wx.request({
      url,
      method: 'POST',
      header: { 'content-type': 'application/json' },
      data: { email, password },
      timeout: 60000,
      success: (res) => {
        if (res.statusCode === 200 && res.data && res.data.success) {
          const app = getApp()
          if (app && app.globalData) {
            app.globalData.userInfo = { email }
          }
          wx.setStorageSync('userEmail', email)
          wx.showToast({ title: this.data.mode === 'login' ? '登录成功' : '注册成功', icon: 'success' })
        } else {
          const msg = (res.data && (res.data.message || res.data.response)) || '操作失败'
          wx.showToast({ title: msg, icon: 'none' })
        }
      },
      fail: (err) => {
        wx.showToast({ title: err.errMsg || '网络错误', icon: 'none' })
      },
      complete: () => {
        this.setData({ isLoading: false })
      }
    })
  }
})