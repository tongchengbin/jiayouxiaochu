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
    userInfo:{},
    isLoginPopup:false,
    isLoading:false,
    comment:{
      "commentCount":-1,
      "dataList":[],
      "show":true,
      "content":""
    },
    showComment:'none',
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
    this.setData({ "mid": mid})  
  },
  onShow:function(){
    this.getDetail()
    this.getComment()
  },
  getDetail:function(){
    api.getRequest('/api/frontend/wx/getmenu/', { "mid": this.data.mid}).then(res=>{
      this.setData({"data":res.data})
      if(res.data.comment_cnt>0){
        var showComment='block'
      }else{
        var showComment='none'
      }
      this.setData({"user.dianzhan":res.data.user.dianzhan,
        "user.shoucang":res.data.user.shoucang,
        "showComment": showComment})
    })
  },
  getComment:function(){
    this.setData({"isLoading":true})
    api.getRequest('/api/frontend/wx/comment/',{"id":this.data.mid}).then(res=>{
        this.setData({
          "comment.dataList": res.data.data.results,
          "commentCount": res.data['data']['count'],
          "isLoading":false}
           )
    })
  },
  dianZhan(){
    AUTH.checkToken().then(isLogin=>{
      if (!isLogin) { this.setData({"isLoginPopup":true});return}
      let action_type =  this.data.user.dianzhan? 30:10
      api.postRequest('/api/frontend/wx/action/',{"id":this.data.mid,"action_type":action_type}
      ).then(res=>{
         this.setData({"user.dianzhan":action_type==30?false:true})
        wx.showToast({
          title: '成功',
        })
       })
    })},
  shouchang(){
    AUTH.checkToken().then(isLogin=>{
      if (!isLogin) { this.setData({ "isLoginPopup": true }); return }
      let action_type=this.data.user.shoucang?40:20
      api.postRequest('/api/frontend/wx/action/',{"id":this.data.mid,"action_type":action_type}).then(res=>{
        this.setData({"user.shoucang":action_type==40?false:true})
        wx.showToast({
          title: '成功',
        })
      })
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

  agreeGetUser: function (e) {
    let self = this;
    AUTH.checkAgreeGetUser(e, app, self, true);;

  },
  closeLoginPopup() {
    this.setData({ isLoginPopup: false });
  },
  openLoginPopup() {
    this.setData({ isLoginPopup: true });
  },
  //底部刷新
  onReachBottom: function () {
    // 只加载10条评论
  },
  // 评论点赞
  commentLike(e){
    console.log(e)
    var self=this;
    AUTH.checkToken(self).then(isLogin=>{
      if (!isLogin) { this.setData({ "isLoginPopup": true }); return }
    })
    var index=e.currentTarget.dataset.index;
    var cIndex = e.currentTarget.dataset.cindex
    let item;
    let okDataList=this.data.comment.dataList
    // 记录下item 的路径
    let path=""
    if(cIndex==undefined){
      path=`comment.dataList[${index}]`
      item = this.data.comment.dataList[index]      
    }else{
      path=`comment.dataList[${index}].chils[${cIndex}]`
      item = this.data.comment.dataList[index].chils[cIndex]
    }
    var data={
      "isLike": !item.is_like,
      "commentId":item.id
    }
    api.postRequest("/api/frontend/wx/comment_like/", data).then(res=>{
      item.is_like=!item.is_like
      item.like = item.is_like?item.like+1:item.like-1
      console.log(path,item)
      console.log(path)
      var obj={}
      obj[path]=item
      this.setData(obj)
      // this.setData({"comment.dataList[0]":item})
    })
  
  },
})