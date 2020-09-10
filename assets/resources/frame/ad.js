module.exports = {
  bannerId: 'adunit-ff73250902317a8b',
  videoId: 'adunit-0c2cd06cae40410e',
  videoExist: false,
  videoFunc: null,
  gameIconBool:false,   // 显示状态
  initAd() {
    if (window.wx) {
      this.ad_Video = wx.createRewardedVideoAd({ adUnitId: this.videoId })
      this.ad_Video.onLoad(() => {
        this.videoExist = true
      })
      this.ad_Video.onError(() => {
        this.videoExist = false
        this.loadVideo()
      })
      this.ad_Video.onClose(res => {
        if (res && res.isEnded || res === undefined) {
          if (this.videoFunc) {
            he.local.click("load_ad_get")
            this.videoFunc()
            this.loadVideo()
            this.videoFunc = null
          }
          // 正常播放结束，可以下发游戏奖励
          let userInfo = he.local.getJson('user')
          let task = userInfo.task
          for (let i = 0; i < task.length; i++) {
            if (task[i].type == 1) {
              task[i].num += 1
              break
            }
          }
          he.local.setJson('task', task, 'user')
        
            
        }
      })
      this.bannerShow(true)
    } else {
      console.warn("未在微信环境。所以不加载广告")
    }

  },
  loadVideo() {
    he.local.click("load_ad")
    this.ad_Video.load().then((res) => {
      he.local.click("load_ad_suc")
      he.log("视频广告加载成功")
      this.videoExist = true
    }).catch((error) => {
      this.videoExist = false
    })
  },
  videoShow(fuc) {
    if(!this.videoExist){
      this.loadVideo()
      return
    }
    if (window.wx) {
      this.videoFunc = fuc
      this.ad_Video.show()
      this.videoExist = false
    }
  },
  // 底部展示
  bannerShow(hide) {
    if (window.wx) {
      if (this.ad_Banner) {
        this.ad_Banner.show()
      } else {
        var phone = wx.getSystemInfoSync();
        var w = phone.screenWidth / 2;
        var h = phone.screenHeight;

        this.ad_Banner = wx.createBannerAd({
          adUnitId: this.bannerId,
          style: {
            left: 0,
            top: 0,
            adIntervals: 30,
            width: 300
          }
        })
        this.ad_Banner.onResize(res => {
          this.ad_Banner.style.left = w - this.ad_Banner.style.realWidth / 2 + 0.1;
          this.ad_Banner.style.top = h - this.ad_Banner.style.realHeight + 0.1;
        })
        this.ad_Banner.onError(err => {
          he.error(err);
        })
        // if (hide) {
        //   this.ad_Banner.show()
        // }
      }
    }
  },
  bannerHide() {
    if (this.ad_Banner) {
      this.ad_Banner.hide()
    }
  },
  // Ad加载
  gameIconInit(btnNode){
    let btnSize = cc.size(btnNode.width,btnNode.height);
    let frameSize = cc.view.getFrameSize();
    let winSize = cc.director.getWinSize();
    let worldPos = btnNode.convertToWorldSpaceAR(cc.Vec2.ZERO)
    //适配不同机型来创建微信授权按钮
    let left =( worldPos.x - btnSize.width/2) / winSize.width*frameSize.width
    let top = (winSize.height - worldPos.y - btnSize.height/2) / winSize.width*frameSize.width
    let width = btnSize.width/winSize.width*frameSize.width;
    let height = btnSize.height/winSize.height*frameSize.height;
    if(window.wx){
      this.iconAd = wx.createGameIcon({
        adUnitId: 'PBgAA1PRjYW2aVvU',
        count: 1,
        style: [{
          appNameHidden : false,
          color : '#ffffff',
          size: width,
          borderWidth : 1,
          borderColor: '#ffffff',
          left: left,
          top: top
        }]
      })
    }
  },
  // 显示
  gameIconShow(){
    this.gameIconBool = true
    if(this.iconAd){
      this.iconAd.load().then(() => {
        if(this.gameIconBool){
          this.iconAd.show()
        }
      }).catch((err) => {
          console.error(err)
      })
    }
  },
  gameIconHide(){
    this.gameIconBool = false
    if(this.iconAd){
      this.iconAd.hide()
    }
  }
}