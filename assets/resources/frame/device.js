
// 因为不允许 index 所以写出来
module.exports = {
    vibrateShort(){
        if(window.wx){
            wx.vibrateShort()
        }
    },
    vibrateLong(){
        if(window.wx){
            wx.vibrateLong()
        }
    }
}