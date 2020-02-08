//index.js
//获取应用实例
const app = getApp()
import api from '../../utils/request'
Page({
  data: {
    moreLoading:false,// 加载更多
    swiperItems: [],
    params:{"page":1},
    listdata:[],
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.getSwiper()
    this.getList()
    
  },
  getList:function(){
    this.setData({"moreLoading":true})
    api.wxRequest('/api/frontend/wx/index/', 'GET', this.data.params).then(res => {
      this.setData({ "listdata": this.data.listdata.concat(res.data.results) })
      this.setData({ "moreLoading": false })
    })
  },
  loadMore:function(){
    this.setData({ "params.page": this.data.params.page + 1 })
    this.getList()
  },
  getMenuData:function(e){
    console.log("请求主页数据")
  },
  onReachBottom() {
    this.loadMore()
  
  },
  toDetail(e){
    let id = e.currentTarget.dataset['id'];
  },
  getSwiper(){
    api.wxRequest('/api/frontend/wx/swiper/', 'GET', {}).then(res => {
      this.setData({ "swiperItems": res.data.data})
    })
  },
  swiperchange(){

  },
  onPullDownRefresh() {
    // 上拉刷新
    if (!this.loading) {
      this. fetchArticleList(1, true).then(() => {
        // 处理完成后，终止下拉刷新
        wx.stopPullDownRefresh()
      })
    }
  },
})
