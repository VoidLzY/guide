module.exports = {
    get(key,from){
        if(from){
            let fromJson = cc.sys.localStorage.getItem(from)
            if(fromJson){
                let Dict = JSON.parse(fromJson)
                if(Dict[key] != undefined){
                    return Dict[key]
                }
            }
            return null
        }
        return cc.sys.localStorage.getItem(key)
    },
    getJson(key,from){
        if(from){
            let fromJson = cc.sys.localStorage.getItem(from)
            let Dict = JSON.parse(fromJson)
            if(Dict[key] != undefined){
                return Dict[key]
            }
            return null
        }
        let data = cc.sys.localStorage.getItem(key)
        if(data){
            return JSON.parse(data)
        }
        return null
    },
    set(key,value,from){
        if(from){
            let fromJson = cc.sys.localStorage.getItem(from)
            let Dict = {}
            if(fromJson){
                Dict = JSON.parse(fromJson)
            }
            Dict[key] =  value
            cc.sys.localStorage.setItem(from,JSON.stringify(Dict))
        }else{
            cc.sys.localStorage.setItem(key,value)
        }
    },
    setJson(key,value,from){
        if(from){
            let fromJson = cc.sys.localStorage.getItem(from)
            let Dict = {}
            if(fromJson){
                Dict = JSON.parse(fromJson)
            }
            Dict[key] =  value
            cc.sys.localStorage.setItem(from,JSON.stringify(Dict))
        }else{
            cc.sys.localStorage.setItem(key,JSON.stringify(value))
        }
    },
    click(v){
        let count = this.get(v,'or')    // 操作记录
        if(count){
            count += 1
        }else{
            count = 1
        }
        this.set(v,count,'or')
    },
    saveclick(v){
        if(window.wx){
            let param = this.getJson('or')
            if(!param){
                return
            }
            
            wx.cloud.callFunction({
                name: 'saveOp',
                success: res => {
                    if(res && res.result){
                        let device = this.get("device","or")
                        if(!device){
                            this.set('device',res.result.device,"or")
                        }
                    }
                    // console.log(res,"asdasd")
                },
                fail: err => {
                },
                data: param
            })
        }
    }
}
