// pages/favorites/favorites.js
import api from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: { "page": 1 ,'keyword':null,'food':""},
    listdata:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 请求我的搜藏
    this.getList()
    console.log("load")
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
  getList: function (type) {
    if (type === 'refresh'){
      this.setData({"params.page":1})
    }
    api.wxRequest('/api/frontend/wx/favorites/', 'GET', this.data.params).then(res => {
      if (type ==='refresh'){
        this.setData({"listInfo.maxPage":res.data.num_pages})
        this.setData({ "listdata": res.data.data.results })
      }else{
        this.setData({"listInfo.maxPage":res.data.num_pages})
        this.setData({ "listdata": this.data.listdata.concat(res.data.data.results) })
      }
      console.log(this.data.listdata)
    })
  }
})