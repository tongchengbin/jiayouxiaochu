// pages/catelist/catelist.js
const app = getApp()
import api from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "listData":[],
    activeIndex: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getList(){
    api.wxRequest('/api/frontend/wx/cate_list/', 'GET', {}).then(res => {
      this.setData({ "listData": res.data })
    })

  },
  selectMenu: function (e) {
    var index = e.currentTarget.dataset.index
    console.log(index)
    this.setData({
      activeIndex: index,
      toView: 'a' + index,

    })
  },
  toSearch(e){
    let name=e.currentTarget.dataset.name
    wx.navigateTo({
      url: '/pages/menuList/menuList?keyword='+name,
    })
  }
})