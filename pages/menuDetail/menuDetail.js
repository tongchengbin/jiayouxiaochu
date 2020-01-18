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
    user:{dianzhan:false,shoucang:false},
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
    console.log(getCurrentPages())
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
      this.setData({"user.dianzhan":res.data.user.dianzhan,"user.shoucang":res.data.user.shoucang})
    })
  },
  dianZhan(){
    AUTH.checkToken().then(isLogin=>{
     if(isLogin){
       let action_type =  this.data.user.dianzhan? 30:10
       console.log(action_type)
       api.postRequest('/api/frontend/wx/action/',{"id":this.data.mid,"action_type":action_type}).then(res=>{
         this.setData({"user.dianzhan":action_type==30?false:true})
       })
     }else{
       wx.switchTab({
         url: '/pages/my/my',
       })
     }
    })},
  shouchang(){
    AUTH.checkToken().then(isLogin=>{
     if(isLogin){
      let action_type=this.data.user.shoucang?40:20
      api.postRequest('/api/frontend/wx/action/',{"id":this.data.mid,"action_type":action_type}).then(res=>{
        this.setData({"user.shoucang":action_type==40?false:true})
      })
     }else{
       wx.switchTab({
         url: '/pages/my/my',
       })

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
      console.log("同意授权")
      // 用户同意授权  直接调用服务器登录
      AUTH.login(isLogin=>{
        this.setData({"showPopup":false})
      })
    }else{
      // 用户拒绝授权
      console.log("拒絕授權")
      this.setData({"showPopup":false})
    }
  }
})