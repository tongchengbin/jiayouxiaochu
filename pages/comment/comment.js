// pages/comment/comment.js
const app = getApp()
import api from '../../utils/request'
import  AUTH from '../../utils/auth'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "cnt":0,// 总评论数
    "showInput":false,
    "isLoginPopup":false,
    "page":1,
    "comments": [],
    "comment":{
      "id":null,
      "content":""
    },
    "currentPath":null,
    // 当前评论的item
    "currentItem":null,
    "content":"",
    "showKeyboard":false,// 是否定位到输入框
    "placeholder":"请留下您的评论"

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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getComment()

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
  agreeGetUser: function (e) {
    let self = this;
    AUTH.checkAgreeGetUser(e, app, self, true);;

  },
  closeLoginPopup() {
    this.setData({ isLoginPopup: false });
  },
  // 上面是授权
  comtentInput:function(e){
    this.setData({"comment.content": e.detail.value});
  },
  getComment: function () {
    this.setData({"loading":true})
    api.getRequest('/api/frontend/wx/comment/', { "id": this.data.id,"page":this.data.page }).then(res => {
      this.setData({ "loading": false })
      if(this.data.page==1){
        // 首次加载
        
        this.setData({
          "comments": res.data.data.results,
          "cnt": res.data['data']['count']
        })
      }else{
        var comments = this.data.comments.concat(res.data.data.results)
        this.setData({
          "comments": comments,
          "cnt": res.data['data']['count']
        })
      }
    })
  },
  loadMore() {
    // 加载更多
    if(this.data.loading){
      return
    }
    if(this.data.comments.length<this.data.cnt){
      this.setData({"page":this.data.page+1})
      this.getComment()
    }else{
      console.log("到底了")
    }
  },
  // 显示输入框
  showInput:function(e){
    // 个人号无法审核评论功能
    wx.showModal({
      title: 'APP',
      content: 'APP正在加班开发中.....',
    })
    return
    AUTH.checkToken(self).then(isLogin => {
      if (isLogin) {
        this.setData({ "showInput": true })
      } else {
        this.setData({ "isLoginPopup": true })
      }
    })
  },
  // 隐藏评论输入
  hiddenComment() {
    this.setData({ "showDialogComment": false })
  },
  // 评论值监听
  changeInputComment: function (e) {
    this.setData({ "content": e.detail.value })
  },
  // 点击评论
  inReply(e){
    var self = this;
    AUTH.checkToken(self).then(isLogin => {
      if (!isLogin) { this.setData({ "isLoginPopup": true }); return }
    })
    var index = e.currentTarget.dataset.index;
    var cIndex = e.currentTarget.dataset.cindex
    let item;
    // 记录下item 的路径
    let path = ""
    if(index== undefined){
      path =''
      item=null;
      this.setData({ "placeholder": '请留下您的评论!' })
    }
    else if (cIndex == undefined) {
      path = `comList[${index}]`
      item = this.data.comList[index]
      this.setData({ "placeholder": `回复${item.username}:` })
    } else {
      path = `comList[${index}].chils[${cIndex}]`
      item = this.data.comList[index].chils[cIndex]
      this.setData({ "placeholder": `回复${item.username}:` })
    }
    this.setData({"showKeyboard":true,"currentPath":path,"currentItem":item})
  },
  exitInput: function () {
    console.log("市区焦点")
    this.setData({"showKeyboard":false})
  },
  // 评论点赞
  commentLike(e) {
    var self = this;
    AUTH.checkToken(self).then(isLogin => {
      if (isLogin){
        var index = e.currentTarget.dataset.index;
        var cIndex = e.currentTarget.dataset.cindex
        console.log(index,cIndex)
        let item;
        // 记录下item 的路径
        let path = ""
        if (cIndex == undefined) {
          path = `comments[${index}]`
          item = this.data.comments[index]
        } else {
          path = `comments[${index}].chils[${cIndex}]`
          item = this.data.comments[index].chils[cIndex]
        }
        var data = {
          "isLike": !item.is_like,
          "commentId": item.id
        }
        api.postRequest("/api/frontend/wx/comment_like/", data).then(res => {
          item.is_like = !item.is_like
          item.like = item.is_like ? item.like + 1 : item.like - 1
          var obj = {}
          obj[path] = item
          this.setData(obj)
          // this.setData({"comment.dataList[0]":item})
        })
      }else{
        this.setData({ "isLoginPopup": true })
        return;
      }
    })
  },
  // 提交评论
  submitComment(){
    var self = this;
    AUTH.checkToken(self).then(isLogin => {
      if (!isLogin) { this.setData({ "isLoginPopup": true }); return }
    })
    let path = this.data.currentPath;
    let item = this.data.currentItem;
    var content=this.data.content;
    var reply=item?item.id:null
    api.postRequest('/api/frontend/wx/comment/', { "content": content, "reply": reply, "id": this.data.id}).then(res=>{
      if(res.data.status==0){
        this.setData({"content":""})
        wx.showToast({title: '提交成功'})
      }else{
        wx.showToast({ title: res.data.msg,icon:'none'})
      } 
    })

  }
 
})