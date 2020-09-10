module.exports = {
    DEFAULT_MUSIC:0.5,
    DEFAULT_EFFECT:0.5,
    checkSetting(){
        let setting = he.local.getJson("setting")
        if(!setting){
            setting = {
                music : he.voice.DEFAULT_MUSIC, 
                effect : he.voice.DEFAULT_EFFECT,
                bgm: 'voice/game'
            }
            he.local.setJson('setting',setting)
        }
        this.defaultSetting()
    },
    defaultSetting(){
        let setting = he.local.getJson('setting')
        setting.music = this.DEFAULT_MUSIC
        setting.effect = this.DEFAULT_EFFECT
        cc.audioEngine.setMusicVolume(this.DEFAULT_MUSIC)
        cc.audioEngine.setEffectsVolume(this.DEFAULT_EFFECT)
    },
    playMusic(url){
        if(!url){
            url = he.local.get('bgm','setting')
        }
        let clip = he.load.get(url,cc.AudioClip)
        if(clip){
            cc.audioEngine.playMusic(clip, true);
        }else{
            cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
                cc.audioEngine.playMusic(clip, true);
            });
        }
    },
    stopMusic(url){
        cc.audioEngine.stopMusic();
    },
    playEffect(url,pre){
        if(!url){
            he.log("未设置音效路径")
            return null
        }
        if(pre){
            url = 'voice/' + url
        }
        let clip = he.load.get(url,cc.AudioClip)
        if(clip){
            return cc.audioEngine.playEffect(clip, false);
        }else{
            cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
                cc.audioEngine.playEffect(clip, false);
            });
        }
        return null
    }
}