import api from '../../utils/request'
import AUTH from '../../utils/auth'
import {showTopTip} from '../../utils/util'
Page({
  data: {
   //判断小程序的API，回调，参数，组件等是否在当前版本可用。
   canIUse: wx.canIUse('button.open-type.getUserInfo'),
   islogin:false,
   userinfo:{},
   showPopup:false
  },
   
  onLoad: function(options) {
    console.log("onload")
   // 查看是否授权
    // 是否进入页面自动登录 
  },
  onShow:function(){
    let lastPage=wx.getStorageSync('lastPage')
    console.log("lastpage",lastPage)
    // 获取上一个页面
    AUTH.checkToken().then(isLogin=>{
      if(isLogin){
        this.setData({islogin: true,userinfo:wx.getStorageSync('userinfo')});
        if(lastPage){
          wx.removeStorageSync('lastPage')
          wx.navigateTo({ url: lastPage})}
        }else{
          this.setData({"islogin":false})
        }
      })
  },
  login(){
    // 手动登录
    // 清空缓存
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

  },
  myCollect(){
    if(this.data.islogin){
      wx.navigateTo({
        url: '/pages/favorites/favorites',
      })

    }else{
      showTopTip("请先登录!","Warning")
    }
    
  },
  bindGetUserInfo(e){
    // 授权回调
    this.setData({"showPopup":false})
    if(e.detail.userInfo){
      // 用户同意授权  直接调用服务器登录
      AUTH.login(isLogin=>{
        let autoLogin=wx.getStorageSync('autologin')
        if(isLogin && autoLogin){
          // 跳转上一页面
          let pages=getCurrentPages()
         // 获取上一个页面
          let lastPage=pages[pages.length-2]
          if(lastPage){
            lastPage.onLoad()
          }
          wx.removeStorageSync('auaologin')
        }
      })
    }else{
      // 用户拒绝授权
      this.setData({"showPopup":false})
    }
  },
 })