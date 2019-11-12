// pages/menuDetail/menuDetail.js
const app = getApp()
import api from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    interval: 2000,
    duration: 500,

    data:{},
    mid:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ "mid": options.mid})
    this.getDetail()
  },
  getDetail:function(){
    api.getRequest('/api/frontend/wx/getmenu/', { "mid": this.data.mid}).then(res=>{
      this.setData({"data":res.data})
      console.log(this.data.data)
    })
  },



// 分享
  onShareAppMessage: function (res) {
    return {
      title: this.data.name,
      path: '/page/menuDetail/menuDetail?mid='+this.data.mid
    }
  }
})