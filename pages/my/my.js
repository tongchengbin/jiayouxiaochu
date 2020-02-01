import api from '../../utils/request'
import AUTH from '../../utils/auth'
import {showTopTip} from '../../utils/util'
let app=getApp()
Page({
  data: {
   //判断小程序的API，回调，参数，组件等是否在当前版本可用。
   canIUse: wx.canIUse('button.open-type.getUserInfo'),
   islogin:false,
   userInfo:{},
   showPopup:false
  },
   
  onLoad: function(options) {
   // 查看是否授权
    // 是否进入页面自动登录 
  },
  onShow:function(){
    // 获取上一个页面
    AUTH.checkToken().then(isLogin=>{
      if(isLogin){
        this.setData({ islogin: true, userInfo:wx.getStorageSync('userinfo')});
        }else{
        this.setData({ "islogin": false,'userInfo':{'avatar':'/images/icon/b1.png'}})
        }
      })
  },
  logout(){
    wx.removeStorageSync('token')
    wx.removeStorageSync('openid')
    wx.removeStorageSync('userinfo')
    this.setData({ "islogin": false, 'userInfo': { 'avatar': '/images/icon/b1.png' } })
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
  agreeGetUser: function (e) {
    let self = this;
    AUTH.checkAgreeGetUser(e, app, self, true);;
  },
 })