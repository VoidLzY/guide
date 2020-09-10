// 分享函数
module.exports = {
    res_func:null,

    // 分享监听
    onShare(){
      if(window.wx){
          wx.showShareMenu({
              withShareTicket: true
          })
          wx.onShareAppMessage(() => {
              let shareInfo = this.getShareInfo()
              return {
                title: shareInfo.text,
                imageUrl: shareInfo.image, // 图片 URL
                imageUrlId: shareInfo.imageId,
              }
          })
      }
    },
    // 获取分享信息
    getShareInfo(id){
      if(id){
        let res =  he.db.getData("Share",id)
        if(!res){
          this.error("分享表都填错了,害搁着按nm呢")
        }
        return res 
      }
      let share_list = he.db.getDataListByArgs("Share",{ random: true })
      let share_res = parseInt(share_list.length * Math.random())
      return share_list[share_res]
    },
    // 分享
    share(param){
      if(!window.wx){
        he.error("不在微信环境，无法分享")
        return
      }
      let shareInfo
      
      if (param) {
        if(param.query){
          shareInfo.query = param.query
        }
        if(param.random){
          param = this.getShareInfo()
        }
        if(param.id){
          param = this.getShareInfo(param.id)
        }
        shareInfo = {
          title: param.text,
          imageUrlId: param.imageId,
          imageUrl: param.image,
        }
      }else{
        let randomInfo = this.getShareInfo()
        shareInfo = {
          title: randomInfo.text,
          imageUrlId: randomInfo.imageId,
          imageUrl: randomInfo.image,
        }
      }
      wx.shareAppMessage(shareInfo)
    }
}