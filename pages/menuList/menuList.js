// pages/menuList.js
/*
如果有keyword 直接加载数据  显示key

如果没有keyword  显示历史搜索记录 和热门关键词

*/

const app = getApp()
import api from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count:null,
    listdata:[],
    showHistoryList:false,
    hotKey:[],
    listInfo:{
      maxPage:1,
    },
    loading:false,
    params: { "page": 1 ,'keyword':null,'food':""},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let key=options.keyword;
    if(key){
      this.setData({ "params.keyword": key})
      this.getList()
    }else{
      this.loadSearch()
    }
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
    if(this.data.listdata.length<this.data.count){
      this.setData({"params.page":this.data.params.page+1})
      this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getList: function () {
    this.setData({"loading":true})
    api.wxRequest('/api/frontend/wx/search_menu/', 'GET', this.data.params).then(res => {
      this.setData({ "loading": false })
      if (this.data.params.page ===1){
        this.setData({ "listdata": res.data.data.results,'count':res.data.data.count })
      }else{
        this.setData({ "listdata": this.data.listdata.concat(res.data.data.results), 'count': res.data.data.count })
      }
    })
  },

  onReachBottom() {
    console.log("onReachBottom", this.data.listdata.length, this.data.count)
    if (this.data.listdata.length < this.data.count) {
      this.setData({ "params.page": this.data.params.page + 1 })
      this.getList()
    }
    
  },
  updateValue(e) {
    let name = e.currentTarget.dataset.name;
    let nameMap = {}
    let val = e.detail && e.detail.value
    this.setData({"params.keyword":val})
  },
  insertKey(options){
    let name=options.currentTarget.dataset.name
    this.setData({ "params.keyword": name, "params.page": 1, "showHistoryList": false})
    this.getList()
  },
  searchSubmit(){
    this.setData({ "params.page": 1,"showHistoryList":false})
    this.getList()
  },
  loadSearch(){
    api.wxRequest('/api/frontend/wx/hot_key/', 'GET', {}).then(res => {
      this.setData({ "hotkey": res.data, "showHistoryList": true})
    })
  },
  // 输入框聚焦
  onfocus(e){
    api.wxRequest('/api/frontend/wx/hot_key/', 'GET', {}).then(res => {
      this.setData({ "hotkey": res.data })
      this.setData({ "showHistoryList": true })
    })
  }

})