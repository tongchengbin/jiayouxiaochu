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
    "comment":{
      "id":null,
      "content":""
    },
    "moreLoading":false,
    // 当前评论item的路径
    "currentPath":null,
    // 当前评论的item
    "currentItem":null,
    "content":"",
    "showKeyboard":false,// 是否定位到输入框
    "currentPage":1,
    "more":true,
    "comList":[],
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
    this.setData({ "comment.id": id})
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
  comtentInput:function(e){
    this.setData({"comment.content": e.detail.value});
  },
  getComment:function(isMore){
    this.setData({ "moreLoading": true })
    api.getRequest('/api/frontend/wx/comment/',{"id":this.data.comment.id,"page":this.data.currentPage}).then(res=>{
      if(isMore){
        this.setData({ "comList": this.data.comList.concat(res.data.data.results), "cnt": res.data.data.count})
      }else{
        this.setData({ "comList": res.data.data.results, "cnt": res.data.data.count})
      }
      this.setData({ "moreLoading": false })
      if(res.data.data.next){
        this.setData({"more":true})
      }else{
        this.setData({"more":false})
      }

    })

  },
  submitComment(){
    let that = this;
    console.log(that)
    AUTH.checkToken().then(isLogin=>{
      that.setData({"isLogin":isLogin})
      let data=this.data.comment
      api.postRequest('/api/frontend/wx/comment/',data).then(res=>{
        wx.showToast({
          title:'成功',
          icon:'success',
          duration: 2000
         })
         this.setData({"comment.content":""})
         this.getComment()
      })

    }) 
  },
  onReachBottom() {
    // 加载更多
    if(this.data.more){
      this.setData({"currentPage":this.data.currentPage+1})
      this.getComment(true)
    }else{
      wx.showToast({
        title: '到底了',
        icon:"none"
      })
    }
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
    console.log(e)
    var self = this;
    AUTH.checkToken(self).then(isLogin => {
      if (!isLogin) { this.setData({ "isLoginPopup": true }); return }
    })
    var index = e.currentTarget.dataset.index;
    var cIndex = e.currentTarget.dataset.cindex
    let item;
    // 记录下item 的路径
    let path = ""
    if (cIndex == undefined) {
      path = `comList[${index}]`
      item = this.data.comList[index]
    } else {
      path = `comList[${index}].chils[${cIndex}]`
      item = this.data.comList[index].chils[cIndex]
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

  },
  // 评论输入值监听
  commentValue(e){
    console.log(e)
    var content=e.detail.value
    this.setData({"content":content})
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
    api.postRequest('/api/frontend/wx/comment/', { "content": content, "reply": reply, "id": this.data.comment.id}).then(res=>{
      wx.showToast({
        title: '提交成功'
      })
    })

  }
 
})