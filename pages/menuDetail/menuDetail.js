// pages/menuDetail/menuDetail.js
const app = getApp()
import api from '../../utils/request'
import  AUTH from '../../utils/auth'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment:{
      "show":true,
      "content":""
    },
    indicatorDots: true,
    interval: 2000,
    duration: 500,
    data:{

    },
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
    // this.comment()
    let that = this
      AUTH.checkAuth().then(isLogin=>{
        console.log("AUTH.checkAuth----");
        that.setData({"isLogin":isLogin})
        this.getDetail()
      }) 
  },
  getDetail:function(){
    api.getRequest('/api/frontend/wx/getmenu/', { "mid": this.data.mid}).then(res=>{
      this.setData({"data":res.data})
    })
  },
  dianZhan(){
    // 检测身份
    let that=this
    AUTH.checkAuth().then(isLogin=>{
     if(isLogin){
       api.postRequest('/api/frontend/wx/action/',{"id":this.data.mid,"action_type":10}).then(res=>{
         this.setData({"data.user.dianzhan":true})
       })
     }else{
      wx.showModal({
        cancelColor: 'cancelColor',
      })
     }
    })},
  shouchang(){
    AUTH.checkAuth().then(isLogin=>{
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
  }
  
})