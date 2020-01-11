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
    listdata:[],
    showHistoryList:false,
    hotKey:[],
    listInfo:{
      maxPage:1,
    },
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
    api.wxRequest('/api/frontend/wx/search_menu/', 'GET', this.data.params).then(res => {
      if (type ==='refresh'){
        this.setData({"listInfo.maxPage":res.data.num_pages})
        this.setData({ "listdata": res.data.results })
      }else{
        this.setData({"listInfo.maxPage":res.data.num_pages})
        this.setData({ "listdata": this.data.listdata.concat(res.data.results) })
      }
      
    })
  },
  loadMore: function () {
    if(this.data.params.page>=this.data.listInfo.maxPage){
      return 
    }
    this.setData({ "params.page": this.data.params.page + 1 })
    this.getList()
  },
  onReachBottom() {
    this.loadMore()
  },
  updateValue(e) {
    let name = e.currentTarget.dataset.name;
    let nameMap = {}
    let val = e.detail && e.detail.value
    this.setData({"params.keyword":val})
  },
  startInput(){
    api.wxRequest('/api/frontend/wx/hot_key/', 'GET', {}).then(res => {
      this.setData({"hotkey":res.data})
      this.setData({ "showHistoryList": true })
    })
  },
  outInput(){
    this.setData({ "showHistoryList": false })
  },
  insertKey(options){
    let name=options.currentTarget.dataset.name
    this.setData({"params.keyword":name})
    console.log(this.data)
    this.outInput()
    this.getList('refresh') 
  },
  searchSubmit(){
    this.getList('refresh')
  },
  loadSearch(){
    api.wxRequest('/api/frontend/wx/hot_key/', 'GET', {}).then(res => {
      this.setData({"hotkey":res.data})
      this.setData({ "showHistoryList": true })
    })

  }
})