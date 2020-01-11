import api from 'request'
function checkSession(){
  // 检测session
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        return resolve(true)
      },
      fail() {
        return resolve(false)
      }
    })
  })
}

function loginOut(){
  // 登出  清空token openid
  wx.removeStorageSync('token')
  wx.removeStorageSync('openid')
}


async function checkSetting(){
  // 检测授权配置
    return new Promise((resolve,reject) =>{
      wx.getSetting({
        complete: (res) => {
          // settings results
          if(res.authSetting["scope.userInfo"]){
            console.log("已授权")
            return resolve(true)
          }else{
            console.log("需要授权")
          }
          console.log(res) 
        },
      })
    })
}


async function checkUserInfo(){
  // 检测用户信息
  // 查看本地是否有userinfo
  let userInfo=wx.getStorageSync('userinfo')
  if(userInfo && userInfo.userName){
    return userInfo
  }else{
    // 获取用户信息
    return new Promise((resolve,reject)=>{
      wx.getUserInfo({
        complete: (res) => {
          let data={
            "username":res.userInfo.nickName,
            "gender":res.userInfo.gender,
            "avatar":res.userInfo.avatarUrl
          }
          wx.setStorageSync('userinfo', data)
          return resolve(true)
        },
      })
    })
  }
}


function checkLogin(){
  // 检查登录 保证有token 和 openid
  let openid=wx.getStorageSync('openid')
  let token=wx.getStorageSync('token')
  let userinfo=wx.getStorageSync('userinfo')
  if(token && openid && userinfo){
    return true
  }else{
    // 此时  userinfo 已存在
    return new Promise((resolve,reject)=>{
      wx.login({
        complete: (res) => {
          let data=userinfo
          data["code"]=res.code
          return new Promise((res2,rej2)=>{
            api.postRequest('/api/frontend/wx/updateUser/', data).then(res => {
              
              let token=res.data.token
              let openid=res.data.openid
              wx.setStorageSync('token',token)
              console.log("set token",token)
              wx.setStorageSync('openid', openid)
              res2(true)

              })
          }).then(() => {
            resolve(true)
          })
        },
        fail:(err)=>{
          console.log("get coder fail")
          reject(false)
        }
      })
    })
  }
}

async function checkAuth(){
  // 检测身份 同时登录
  /*
  1: 检测session 是否有效
  2：检测检测是否授权
  3：检测本地是否有tokne 和openid
  4:wx.login  拿到code
  5:服务器拿token  完成认证
  */
  const Session=await checkSession()
  if(!Session){
    await loginOut()
  }
  // 2
  const settings=await checkSetting()
  console.log(settings,"settings")
  if(!settings){
    return false
  }
  // 检测userinfo
  const userinfo=await checkUserInfo()
  console.log("userinfo",userinfo)
  if(!userinfo){
    return false
  }
  const isLogin=await checkLogin()
  console.log("is login",isLogin)
  return isLogin
}


module.exports = {
  checkAuth:checkAuth,
  loginOut: loginOut,
}