// pages/comment/comment.js
const app = getApp()
import api from '../../utils/request'
import  AUTH from '../../utils/auth'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "comment":{
      "id":null,
      "content":""
    },
    "currentPage":1,
    "more":false,
    comList:[]

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
    this.getComment()

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
    api.getRequest('/api/frontend/wx/comment/',{"id":this.data.comment.id,"page":this.data.currentPage}).then(res=>{
      if(isMore){
        this.setData({"comList":this.data.comList.concat(res.data.data.results)})
      }else{
        this.setData({"comList":res.data.data.results})
      }
      
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
    AUTH.checkAuth().then(isLogin=>{
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
  }
})