//app.js
import api from 'utils/request'
import AUTH from 'utils/auth'
App({
  onLaunch: function () {
    // 状态栏
    wx.getSystemInfo({
      success: res => {
        console.log(res)
        this.globalData.navHeight = res.statusBarHeight;
      },
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  globalData: {
    navHeight: 0
  },
  
})