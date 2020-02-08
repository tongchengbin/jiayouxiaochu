// components/tips/tips.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: "success"
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    type:"",
    showTopTips: true,
    msg: '提示'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showDialog(msg) {
      wx.showModal({
        title: '提示',
        content: msg,
      })
    },
    showTopTip: function(msg,type) {
      let that = this;
      that.setData({
        type:type,
        showTopTips: false,
        msg: msg
      });
      setTimeout(function() {
        that.setData({
          showTopTips: true
        });
      }, 1500);
    }
  }
})