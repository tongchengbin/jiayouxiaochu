// pages/favorites/favorites.js
import api from '../../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasMore: 1,
    params: { "page": 1, 'keyword': null, 'food': "" },
    listdata: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 请求我的搜藏
    this.getList()
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
    if (!this.data.hasMore) {
      console.log("到底了")
      return false
    }
    this.setData({ "params.page": this.data.params.page + 1 })
    this.getList()

  },
  onPullDownRefresh() {
    // 上拉刷新
    api.getRequest('/api/frontend/wx/favorites/', { "page": this.data.params.page }).then(res => {
      this.setData({ "hasMore": res.data.data.next ? true : false })
      this.setData({ "listdata": res.data.data.results })
      wx.stopPullDownRefresh()
      console.log(this.data.hasMore)
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getList: function (type) {
    if (type === 'refresh') {
      this.setData({ "params.page": 1 })
    }
    api.getRequest('/api/frontend/wx/history/', { "page": this.data.params.page }).then(res => {
      if (type === 'refresh') {
        this.setData({ "hasMore": res.data.data.next ? true : false })
        this.setData({ "listdata": res.data.data.results })

      } else {
        this.setData({ "hasMore": res.data.data.next ? true : false })
        this.setData({ "listdata": this.data.listdata.concat(res.data.data.results) })
      }
      console.log(this.data.hasMore)
    })
  }
})