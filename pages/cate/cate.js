// pages/cate.js
const app = getApp()
import api from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 默认显示菜单
    showMenu:true,
    food_cate:[],
    menu_cate:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMenuCate()
    this.getFoodCate()

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
  getFoodCate: function () {
    api.wxRequest('/api/frontend/wx/get_food_cate/', 'GET', {}).then(res => {
      this.setData({ "food_cate": res.data })
    })
  },
  getMenuCate: function () {
    api.wxRequest('/api/frontend/wx/get_menu_cate/', 'GET', {}).then(res => {
      this.setData({ "menu_cate": res.data })
    })
  },
  changeCate:function(){
    this.setData({"showMenu":!this.data.showMenu})
  },
  toSearch(options){
    let name = options.currentTarget.dataset.name
    wx.navigateTo('../menuList/menuList?keyword='+name)
  }
})