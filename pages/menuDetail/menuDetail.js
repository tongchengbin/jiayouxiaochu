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
    showInput:false,
    show_hidden_food_list:false,
    hidden_food_list:[],
    showDialogComment:false,
    comments:[],
    commentCount:0,
    indicatorDots: true,
    interval: 2000,
    duration: 500,
    user:{dianzhan:false,shoucang:false},
    data:{},
    id:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id=options.id;
    if(id==undefined){
      id=10
    }
    this.setData({ "id": id})  
  },
  onShow:function(){
    this.getDetail()
  },
  getDetail:function(){
    wx.showLoading({
      title: '加载中',
    })
    api.getRequest('/api/frontend/wx/getmenu/', { "id": this.data.id}).then(res=>{
      wx.hideLoading()
      var hidden_food_list = res.data.data['food_list'].splice(5)
      this.setData({ "data": res.data.data, "commentCount": res.data.data.comment_cnt, hidden_food_list})
      this.setData({
        "user.dianzhan":res.data.data.user.like,
        "user.shoucang":res.data.data.user.star})
    })
  },
  dianZhan(){
    AUTH.checkToken().then(isLogin=>{
      if (!isLogin) { this.setData({"isLoginPopup":true});return}
      let action_type =  this.data.user.dianzhan? 30:10
      api.postRequest('/api/frontend/wx/action/',{"id":this.data.id,"action_type":action_type}
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
      api.postRequest('/api/frontend/wx/action/',{"id":this.data.id,"action_type":action_type}).then(res=>{
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
      path: '/page/menuDetail/menuDetail?id='+this.data.id
    }
  },
  getItemInfo:function(){
    // 获取用户对item的操作信息
    api.getRequest('/api/frontend/wx/item/')
  },
  comment(){
    wx.navigateTo({
      url: '/pages/comment/comment?id='+this.data.id,
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
    var self=this;
    AUTH.checkToken(self).then(isLogin=>{
      if (isLogin) {
        console.log("未登录")
        var index = e.currentTarget.dataset.index;
        var cIndex = e.currentTarget.dataset.cindex
        let item;
        let path = ""
        let okDataList = this.data.data.comments
        // 记录下item 的路径
        if (cIndex == undefined) {
          path = `data.comments[${index}]`
          item = this.data.data.comments[index]
        } else {
          path = `data.scomments[${index}].chils[${cIndex}]`
          item = this.data.data.comments[index].chils[cIndex]
        }
        var data = {
          "isLike": !item.is_like,
          "commentId": item.id
        }
        api.postRequest("/api/frontend/wx/comment_like/", data).then(res => {
          item.is_like = !item.is_like
          item.like = item.is_like ? item.like + 1 : item.like - 1
          console.log(path, item)
          console.log(path)
          var obj = {}
          obj[path] = item
          this.setData(obj)
          // this.setData({"comment.dataList[0]":item})
        })
        }else{
          this.setData({ "isLoginPopup": true });
          return 
        }
    })
    
  
  },
  showHiddenFood:function(e){
    
    console.log("ok")
    this.setData({"show_hidden_food_list":!this.data.show_hidden_food_list})
  },
  showComment:function(e){
    wx.navigateTo({
      url: `/pages/comment/comment?id=${this.data.id}`,
    })
  },
  
  // 提交评论
  submitComment:function() {
    var self = this;
    AUTH.checkToken(self).then(isLogin => {
      if (!isLogin) { this.setData({ "isLoginPopup": true }); return }
    })
    let path = this.data.currentPath;
    let item = this.data.currentItem;
    var content = this.data.commentValue;
    var reply = item ? item.id : null
    api.postRequest('/api/frontend/wx/comment/', { "content": content, "reply": reply, "id": this.data.id }).then(res => {
      if (res.data.status == 0) {
        wx.showToast({
          title: '提交成功'
        })
        this.setData({"commentValue":""})
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
      }

    })

  }
})