module.exports = {
    // 用户数据工作流程
    // 用户需要先登录。

    // 判断是否授权。
    // 已授权 =》 通过本地存档账号 =》 加载获取已储存的游戏数据 =》 加载游戏组件
    //        =》 本地没有存档 =》 请求创建存档 =》 加载游戏组件
    // 未授权 =》 显示授权按钮 =》 授权后继续已授权操作

    Login(){
        if(window.wx){
            wx.login({
                success (res) {
                  if (res.code) {
                    //         //发起网络请求
                    // console.log('登录成功' + res.code)
                    wx.getUserInfo({
                      success: res =>{
                        wx.cloud.callFunction({
                          name: 'login',
                          success: res => {
                            // console.log(res,"fuck")
                            cc.director.emit("LoginListen",he.enum.Login,res)
                          },
                          fail: err => {
                            cc.director.emit("LoginListen",he.enum.Login,false)
                          },
                          data: res
                        })
                      },
                      fail: err => {
                        cc.director.emit("LoginListen",he.enum.Login,false)
                      }
                    })
                    
                  } else {
                    cc.director.emit("LoginListen",he.enum.Login,false)
                  }
                },
                fail:(error =>{
                  cc.director.emit("LoginListen",he.enum.Login,false)
                })
            })
        }else{
          he.error("没有在微信环境下")
        }
        
    },
    
    // 用户信息过期，授权用户信息，并进行储存
    getAuthorize(){
      if(window.wx){
        wx.getSetting({
          success(res) {
            if(!res.authSetting['scope.userInfo']) {
              wx.authorize({
                scope: 'scope.userInfo',
                success () {
                  cc.director.emit("LoginListen",he.enum.Authorize,false)
                },
                fail(){
                  cc.director.emit("LoginListen",he.enum.Authorize,true)
                }
              })
            }else{
              cc.director.emit("LoginListen",he.enum.Authorize,false)
            }
          },
          fail:(error =>{
            cc.director.emit("LoginListen",he.enum.Authorize,true)
          })
        })
      }
    },

    updateManager() {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        cc.director.emit("LoginListen",he.enum.Update,res.hasUpdate)
      })
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }else{
              cc.director.emit("LoginListen",he.enum.Update,false)
            }
          },
          fail: res => {
            cc.director.emit("LoginListen",he.enum.Update,false)
          }
        })
      })
      updateManager.onUpdateFailed(function () {
        cc.director.emit("LoginListen",he.enum.Update,false)
      })
      
    },
}