// let LOAD_PRO = cc.Enum({
//     Authorize:1001
//     // Loading: 1001,          //  加载中
//     // SaveUser: 1002,         //  储存用户数据
//     // AgainAuthorize:1003,    //  获取用户授权
// });
// export { LOAD_PRO }


module.exports = cc.Enum({
    NOT_READY:0,
    READY:1, // 授权状态
    GAMEING:2,     // 登录中

    Update:1000,
    Authorize:1001, // 授权状态
    Login:1002     // 登录中
})