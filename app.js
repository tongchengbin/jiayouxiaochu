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
    // 检测本地token有效性
    console.log("启用应用")
    this.checkTokenLife()
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  globalData: {
    navHeight: 0
  },
  checkTokenLife(){
    var token=wx.getStorageSync("token")
    var userinfo=wx.getStorageSync("userinfo")
    if(token && userinfo){
      api.postRequest('/api/frontend/wx/life/',{"token":token}).then(res=>{
        if(res.data.data==1){
          console.log("token有效")
        }else{
          console.log("token过期")
          wx.removeStorageSync("token")
          wx.removeStorageSync("userinfo")
        }
        
      })
    }else{
      console.log("无token")
      wx.removeStorageSync("token")
      wx.removeStorageSync("userinfo")
    }
  }
})