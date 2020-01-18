/*
 * 
 * WordPres版微信小程序
 * author: jianbo
 * organization: 守望轩  www.watch-life.net
 * github:    https://github.com/iamxjb/winxin-app-watch-life.net
 * 技术支持微信号：iamxjb
 * 开源协议：MIT
 *  *Copyright (c) 2017 https://www.watch-life.net All rights reserved.
 * 
 */
import {showTopTip} from 'util'
let host="https://api.tongchengbin.com";
  // let host="http://127.0.0.1:9000"
function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        //成功
        resolve(res)
      }
      obj.fail = function (res) {
        //失败
        reject(res)
      }
      fn(obj)
    })
  }
}
//无论promise对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};


/**
 * 微信请求get方法
 * url
 * data 以对象的格式传入
 */
function getRequest(url, data) {
  let token=wx.getStorageSync('token')
  var getRequest = wxPromisify(wx.request)
  var header={
    'Content-Type':'application/json'
  }
  if(token){
    header.token=token
  }
  return new Promise((resolve,reject)=>{
    getRequest({
      url: host+url,
      method: 'GET',
      data: data,
      header
    }).then(res=>{
      if(res.data.status==4003 || res.data.status==403 ){
        wx.showToast({title: '认证过期',mask:true,icon:"none"})
        wx.removeStorageSync('token')
        wx.removeStorageSync('openid')
        wx.removeStorageSync('userinfo')
        wx.switchTab({url: '/pages/my/my'})
        resolve(res)
      }
      return resolve(res)
    })


  })
}

/**
 * 微信请求post方法封装
 * url
 * data 以对象的格式传入
 */
function postRequest(url, data) {
  console.debug("==POST===")
  var postRequest = wxPromisify(wx.request)
  let token=wx.getStorageSync('token')
  var header={
    'Content-Type':'application/json'
  }
  if(token){
    header.token=token
  }
  return postRequest({
    url: host + url,
    method: 'POST',
    data: data,
    header
  }).then(res=>{
    if(res.status==500){
      showTopTip("网络异常,请稍后再试!",'Error')
    }
    console.log(res.data.status,"status")
    if(res.data.status==4003 || res.data.status==403){
      showTopTip("认证过期","Error")
      wx.removeStorageSync('token')
      wx.removeStorageSync('openid')
      wx.removeStorageSync('userinfo')
      wx.switchTab({
        url: '/pages/my/my',
      })
    }
    return res
  })
}





/**
 * 微信请求post方法封装
 * url
 * data 以对象的格式传入
 */
function wxRequest(url, method,data) {
  var postRequest = wxPromisify(wx.request)
  var local_userinfo=wx.getStorageSync('userinfo')
  var header={
    'Content-Type':'application/json'
  }
  if(local_userinfo && local_userinfo.token){
    // header.token=local_userinfo.token
  }
  return postRequest({
    url: host + url,
    method: method,
    data: data,
    header
  }).then(res=>{
    if(res.data.status==4003){
      wx.setStorageSync('userinfo',{})
      console.log("token过期")
      wx.navigateTo({url: '/pages/my/my'})
    }
    return res
  })
}

module.exports = {
  postRequest: postRequest,
  getRequest: getRequest,
  wxRequest:wxRequest
}