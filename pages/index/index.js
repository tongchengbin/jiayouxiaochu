//index.js
//获取应用实例
const app = getApp()
import api from '../../utils/request'
Page({
  data: {
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
    this.getList()
    
  },
  getList:function(){
    console.log(this.data)
    api.wxRequest('/api/frontend/wx/index/', 'GET', this.data.params).then(res => {
      this.setData({ "listdata": this.data.listdata.concat(res.data.results) })
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
    let mid = e.currentTarget.dataset['mid'];
    console.log(mid)
  }
})
