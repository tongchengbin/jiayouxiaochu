// pages/menuDetail/menuDetail.js
const app = getApp()
import api from '../../utils/request'
import  AUTH from '../../utils/auth'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // user 
    showPopup:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // 
    comment:{
      "show":true,
      "content":""
    },
    indicatorDots: true,
    interval: 2000,
    duration: 500,
    user:{dianzhan:false,shoucang:""},
    data:{},
    mid:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let mid=options.mid;
    if(mid==undefined){
      mid=10
    }
    
    this.setData({ "mid": mid})
    // check session
    // is token
    AUTH.checkToken().then(isLogin=>{
      // 只在进入页面做一次处理即可
      this.setData({"isLogin":isLogin})
      
    })
    this.getDetail()
    
    
  },
  getDetail:function(){
    api.getRequest('/api/frontend/wx/getmenu/', { "mid": this.data.mid}).then(res=>{
      this.setData({"data":res.data})
      this.setData({"user.dianzhan":res.data.user.dianzhan,"shoucang":res.data.shoucang})
    })
  },
  dianZhan(){
    // 检测身份
    this.needLogin().then(isLogin=>{
     if(isLogin){
       let action_type =  this.user.dianzhan? 30:10
       api.postRequest('/api/frontend/wx/action/',{"id":this.data.mid,"action_type":action_type}).then(res=>{
         this.setData({"user.dianzhan":!this.user.dianzhan})
       })
     }else{
      // 开始登陆
      this.setData({"showPopup":true})
     }
    })},
  shouchang(){
    this.needLogin().then(isLogin=>{
      // islogin false 包括用户拒绝授权 和服务器登录失败
      if(isLogin){
        api.postRequest('/api/frontend/wx/action/',{"id":this.data.mid,"action_type":20}).then(res=>{
          this.setData({"data.user.shoucang":true})
        })
      }else{
      
      }


    })
  },
// 分享
  onShareAppMessage: function (res) {
    return {
      title: this.data.name,
      path: '/page/menuDetail/menuDetail?mid='+this.data.mid
    }
  },
  getItemInfo:function(){
    // 获取用户对item的操作信息
    api.getRequest('/api/frontend/wx/item/')
  },
  comment(){
    wx.navigateTo({
      url: '/pages/comment/comment?id='+this.data.mid,
    })
  },
  submitComment(){
    console.log(this.data.comment.content)
  },

  // login fun
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
  needLogin(){
    return new Promise((resolve,rejects)=>{
      let openid=wx.getStorageSync('openid')
      let token=wx.getStorageSync('token')
      let userinfo=wx.getStorageSync('userinfo')
      if(openid  && token && token.length>1 && userinfo){
        return resolve(true)
      }else{
          wx.getSetting({
            complete: (res) => {
              // settings results
              if(res.authSetting["scope.userInfo"]){
                // 用户已经授权了 配置
                 AUTH.login().then(e=>{
                   console.log(e)
                  return resolve(true)
                 })
              }else{
                // 弹出授权界面
                console.log("弹出授权界面")
                this.setData({"showPopup":true})
                return resolve(false)
              }
            },
          })
        }
    })
  }

  //
})