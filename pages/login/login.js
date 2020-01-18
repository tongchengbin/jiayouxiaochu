// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
 login:function(){
    wx.removeStorageSync('token')
    wx.removeStorageSync('openid')
    wx.removeStorageSync('userinfo')
    wx.getSetting({
      complete: (res) => {
        // settings results
        if(res.authSetting["scope.userInfo"]){
          console.log("已授权")
          // 用户已经授权了 配置
           AUTH.login().then(islogin=>{
             console.log("islogin ",islogin)
            if(islogin){
              this.setData({islogin: true,userinfo:wx.getStorageSync('userinfo')});
            }else{
              console.log("服务器登录失败")
            }
           })
        }else{
          // 弹出授权界面
          this.setData({"showPopup":true})
        }
      },
      fail:(err=>{
        console.log("err",err)
      })
    })


 }
})