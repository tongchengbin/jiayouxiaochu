import api from '../../utils/request'
import AUTH from '../../utils/auth'
Page({
  data: {
   //判断小程序的API，回调，参数，组件等是否在当前版本可用。
   canIUse: wx.canIUse('button.open-type.getUserInfo'),
   islogin:false,
   userinfo:{},
   showPopup:false
  },
   
  onLoad: function() {
   var that = this;
   // 查看是否授权
   AUTH.checkToken().then(isLogin=>{
     if(isLogin){
      that.setData({islogin: true,userinfo:wx.getStorageSync('userinfo')});
     }else{
      wx.getSetting({
        complete: (res) => {
          // settings results
          if(res.authSetting["scope.userInfo"]){
            console.log("已授权")
            // 用户已经授权了 配置
             AUTH.login().then(e=>{
              that.setData({islogin: true});
             })
          }else{
            // 弹出授权界面
            console.log("弹出授权界面")
            this.setData({"showPopup":true})
          }
        },
        fail:(err=>{
          console.log("err",err)
        })
      })
     }
   })
  },
   
  bindGetUserInfo(e){
    // 授权回调
    if(e.detail.userInfo){
      // 用户同意授权  直接调用服务器登录
      AUTH.login(isLogin=>{
        this.setData({"showPopup":false})
      })
    }else{
      // 用户拒绝授权
      this.setData({"showPopup":false})
    }
  },
 })