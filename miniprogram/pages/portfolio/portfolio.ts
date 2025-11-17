Page({
  data: {
    // 用户信息
    userInfo: {
      nickname: '',
      avatar: '',
      phone: ''
    },
    // 弹窗状态
    showAvatarPopup: false,
    showNicknamePopup: false,
    showPhonePopup: false,
    // 输入值
    nicknameInput: '',
    phoneInput: ''
  },

  onLoad() {
    console.log('个人资料设置页面加载');
    this.loadUserInfo();
  },

  // 加载用户信息
  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo,
        nicknameInput: userInfo.nickname || '',
        phoneInput: userInfo.phone || ''
      });
    }
  },

  // 头像点击
  onAvatarClick() {
    this.setData({
      showAvatarPopup: true
    });
  },

  // 昵称点击
  onNicknameClick() {
    this.setData({
      showNicknamePopup: true,
      nicknameInput: this.data.userInfo.nickname || ''
    });
  },

  // 手机号点击
  onPhoneClick() {
    this.setData({
      showPhonePopup: true,
      phoneInput: this.data.userInfo.phone || ''
    });
  },

  // 头像弹窗可见性变化
  onAvatarPopupVisibleChange(e: any) {
    const { visible } = e.detail;
    if (!visible) {
      this.setData({
        showAvatarPopup: false
      });
    }
  },

  // 昵称弹窗可见性变化
  onNicknamePopupVisibleChange(e: any) {
    const { visible } = e.detail;
    if (!visible) {
      this.setData({
        showNicknamePopup: false
      });
    }
  },

  // 手机号弹窗可见性变化
  onPhonePopupVisibleChange(e: any) {
    const { visible } = e.detail;
    if (!visible) {
      this.setData({
        showPhonePopup: false
      });
    }
  },

  // 昵称输入变化
  onNicknameInputChange(e: any) {
    this.setData({
      nicknameInput: e.detail.value
    });
  },

  // 手机号输入变化
  onPhoneInputChange(e: any) {
    this.setData({
      phoneInput: e.detail.value
    });
  },

  // 从相册选择头像
  onChooseFromAlbum() {
    this.chooseImage('album');
  },

  // 拍照
  onTakePhoto() {
    this.chooseImage('camera');
  },

  // 选择图片
  chooseImage(sourceType: 'album' | 'camera') {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: [sourceType],
      success: (res) => {
        if (res.tempFiles && res.tempFiles.length > 0) {
          const tempFilePath = res.tempFiles[0].tempFilePath;
          this.uploadAvatar(tempFilePath);
        }
      },
      fail: (error) => {
        console.error('选择图片失败:', error);
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        });
      }
    });
  },

  // 上传头像
  uploadAvatar(tempFilePath: string) {
    // 模拟上传过程，实际项目中应该调用后端API
    wx.showLoading({
      title: '上传中...'
    });

    // 模拟上传延迟
    setTimeout(() => {
      wx.hideLoading();
      
      // 更新头像显示
      const { userInfo } = this.data;
      userInfo.avatar = tempFilePath;
      
      this.setData({
        userInfo,
        showAvatarPopup: false
      });

      wx.showToast({
        title: '头像更新成功',
        icon: 'success'
      });
    }, 1000);
  },

  // 取消头像选择
  onCancelAvatar() {
    this.setData({
      showAvatarPopup: false
    });
  },

  // 取消昵称编辑
  onCancelNickname() {
    this.setData({
      showNicknamePopup: false
    });
  },

  // 确认昵称编辑
  onConfirmNickname() {
    const { nicknameInput, userInfo } = this.data;
    
    if (!nicknameInput.trim()) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      });
      return;
    }

    userInfo.nickname = nicknameInput.trim();
    
    this.setData({
      userInfo,
      showNicknamePopup: false
    });

    wx.showToast({
      title: '昵称更新成功',
      icon: 'success'
    });
  },

  // 取消手机号编辑
  onCancelPhone() {
    this.setData({
      showPhonePopup: false
    });
  },

  // 确认手机号编辑
  onConfirmPhone() {
    const { phoneInput, userInfo } = this.data;
    
    if (!phoneInput.trim()) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return;
    }

    // 简单的手机号格式验证
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phoneInput)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }

    userInfo.phone = phoneInput;
    
    this.setData({
      userInfo,
      showPhonePopup: false
    });

    wx.showToast({
      title: '手机号绑定成功',
      icon: 'success'
    });
  },

  // 保存修改
  onSave() {
    const { userInfo } = this.data;
    
    // 保存到本地存储
    wx.setStorageSync('userInfo', userInfo);
    
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });

    // 延迟返回上一页
    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  }
});