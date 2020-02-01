var api = require('../../../utils/request.js');



var app = getApp();

Page({
  data: {
    array: ['请选择反馈类型','功能需求', '界面优化', '紧急漏洞', '客户服务','联系开发者'],
    index: 0,
    typeName: "请选择反馈类型",
    content:"",
    concat:null


  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: parseInt(e.detail.value),
      typeName: this.data.array[parseInt(e.detail.value)]
    })
  },
  onLoad: function (options) {
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },
  setInput(e){
    var val=e.detail.value;
    this.setData({"content":val})
    if(val.length>500){
      wx.showToast({
        title: '字数超过限制',
        icon:'none'
      })

    }
  },
  setConcat(e){
    var val=e.detail.value;
    this.setData({"concat":val})
  },
  submit(){
    let that = this
    var data={
      'concat':this.data.concat,
      "content":this.data.content,
      "typeName":this.data.typeName
    }
    api.postRequest('/api/frontend/wx/feedback/',data).then(res=>{
      wx.showToast({
        title: '提交成功',
      })
      that.setData({ "content": '', "concat": null })
      that.onLoad()
    })
    

  }
})