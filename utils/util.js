const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
async function showTopTip(msg,type){
  let pages=getCurrentPages()
  console.log(pages[pages.length-1])
  pages[pages.length-1].selectComponent("#tips").showTopTip(msg,type)
  
}
module.exports = {
  showTopTip:showTopTip,
  formatTime: formatTime
}

