import api from '../../utils/request'
Page({
  data: {
   //判断小程序的API，回调，参数，组件等是否在当前版本可用。
   canIUse: wx.canIUse('button.open-type.getUserInfo'),
   islogin:false,
   userinfo:{},
  },
   
  onLoad: function() {
    
   var that = this;
   // 查看是否授权
   wx.getSetting({
    success: function(res) {
     if (res.authSetting['scope.userInfo']) {
       wx.getUserInfo({
         success: function(res) {
           let userinfo={
             "gender":res.userInfo.gender,
             "username":res.userInfo.nickName,
             "avatar":res.userInfo.avatarUrl
           }
           that.setData({"userinfo":userinfo})
           that.setData({"islogin":true})
           let local_userinfo=wx.getStorageSync('userinfo')
           if(!local_userinfo || !local_userinfo.token){
              wx.login({
                success: res => {
                  userinfo.code=code
                  api.wxRequest('/api/frontend/wx/updateUser/', 'POST', userinfo).then(res => {
                    wx.setStorageSync('userinfo',res.data)
                    })
                }
            });
            }
       }
      });
     } else {
      // 用户没有授权
      // 改变 isHide 的值，显示授权页面
      that.setData({
       isHide: true
      });
     }
    }
   });
  },
   
  bindGetUserInfo: function(e) {
   if (e.detail.userInfo) {
    //用户按了允许授权按钮
    var that = this;
    // 获取到用户的信息了，打印到控制台上看下
    console.log("用户的信息如下：");
    console.log(e.detail.userInfo);
    //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
    that.setData({
     isHide: false
    });
   } else {
    //用户按了拒绝按钮
    wx.showModal({
     title: '警告',
     content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
     showCancel: false,
     confirmText: '返回授权',
     success: function(res) {
      // 用户没有授权成功，不需要改变 isHide 的值
      if (res.confirm) {
       console.log('用户点击了“返回授权”');
      }
     }
    });
   }
  }
 })