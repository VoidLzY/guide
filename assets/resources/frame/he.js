import load from "./load" // 资源加载
import pool from "./pool" // 对象池
import data from "./db"   // 数据表
import local from "./local" // 数据存储
import comFunc from "./func" // 通用函数
import big from "./big" // 大数
import voice from "./voice" // 声音
import enumCon from "./enum" // 枚举
import ad from "./ad" // 枚举
// ver 微信相关 若以后恰接其他平台估计会使用其他工具
import user from "./user"   // 用户相关
// import online from "./online"   // 联机
import device from "./device"   // 设备的一些接口
import share from "./share"

window.he = {
    user:user,
    load:load,
    pool:pool,
    big:big,
    db:data,
    local:local,
    func:comFunc,
    voice:voice,
    ad:ad,
    share:share,
    // online:online,
    enum:enumCon,
    device:device,
    check_init(){
        if(!window.game_main){
            cc.director.loadScene("Login")
            return true
        }
        return false
    },
    onShare(){
        if(window.wx){
            wx.showShareMenu({
                withShareTicket: true
            })
            wx.onShareAppMessage(() => {
                return {
                  title: '一起来拯救青青草原吧！',
                  imageUrl: 'https://mmocgame.qpic.cn/wechatgame/YhYcyvGHJCvnWwNRYqeMbQCqribslDp06LqLiacYbQEz43fG18WJuHRbicMNATF7KWt/0', // 图片 URL
                  imageUrlId: 'qlG4H2pMRuq3oLcgMOCE3A==',
                }
            })
        }
    },
    log(){
        var len=arguments.length;
        let func = console.log
        if(len === 1)
        {
            func(arguments[0]);
        }
        else if(len === 2)
        {
            func(arguments[0],arguments[1]);
        }
        else if(len === 3)
        {
            func(arguments[0],arguments[1],arguments[2]);
        }
        else if(len === 4)
        {
            func(arguments[0],arguments[1],arguments[2],arguments[3]);
        }
        else if(len === 5)
        {
            func(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);
        }
        else if(len === 6)
        {
            func(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);
        }
    },
    error(){
        let func = console.error
        var len=arguments.length;
        if(len === 1)
        {
            func(arguments[0]);
        }
        else if(len === 2)
        {
            func(arguments[0],arguments[1]);
        }
        else if(len === 3)
        {
            func(arguments[0],arguments[1],arguments[2]);
        }
        else if(len === 4)
        {
            func(arguments[0],arguments[1],arguments[2],arguments[3]);
        }
        else if(len === 5)
        {
            func(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);
        }
        else if(len === 6)
        {
            func(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);
        }
      
        
    },
    warn(){
        let func = console.warn
        var len=arguments.length;
        if(len === 1)
        {
            func(arguments[0]);
        }
        else if(len === 2)
        {
            func(arguments[0],arguments[1]);
        }
        else if(len === 3)
        {
            func(arguments[0],arguments[1],arguments[2]);
        }
        else if(len === 4)
        {
            func(arguments[0],arguments[1],arguments[2],arguments[3]);
        }
        else if(len === 5)
        {
            func(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);
        }
        else if(len === 6)
        {
            func(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);
        }
      
        
    }
}