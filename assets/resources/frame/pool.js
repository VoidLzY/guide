module.exports = {
    _dic: {},
    _load_list: [], // 加载中的状态
    _load_dic: {},  // 加载过的预制体路径进行储存
    createPool(name,num,type,link){
        this._dic[name] = new cc.NodePool(name);
        if(num > 0){
            let prefabName;
            if(link){
                prefabName = link
            }else{
                prefabName = name
            }
            // 队列信息
            let loadinfo = {
                name : name,
                prefabName: prefabName,
                num : num
            }
            this._load_list.push(loadinfo)
            if(!this._load_dic[name]){
                this._load_dic[name] = {
                    name : name,
                    prefab: prefabName,
                    num : num,
                    type: type
                }
            }else{
                console.error(`已有对应${name}池子 请勿重复添加`)
                return
            }
            he.load.getRes(prefabName,type,this.insertPool.bind(this))
        }
        return this._dic[name]
    },
    createPoolSync(name,num,type,link){
        if(num > 0){
            let prefabName;
            if(link){
                prefabName = link
            }else{
                prefabName = name
            }
            let prefab = he.load.get(prefabName,type)
            if(prefab){
                if(!this._load_dic[name]){
                    this._load_dic[name] = {
                        name : name,
                        prefab: prefabName,
                        num : num,
                        type: type
                    }
                }else{
                    console.error(`已有对应${name}池子 请勿重复添加`)
                    return
                }
                this._dic[name] = new cc.NodePool(name);
                for (let i = 0; i < num; i++) {
                    let item = cc.instantiate(prefab)
                    this._dic[name].put(item)
                }
                return this._dic[name]
            }
            return null
        }
        return null
    },
    // 获取对应池子
    getPool(name){
        return this._dic[name]
    },
    // 获得池子元素
    getElement(name){
        let element = this._dic[name].get()
        if(this._dic[name].size() == 1){
            let elementInfo = this._load_dic[name]
            for (let i = 0; i < elementInfo.num; i++) {
                let item = cc.instantiate(element)
                this._dic[elementInfo.name].put(item)
            }
        }
        if(!element){
            return null
        }
        return element
    },
    putElement(name,element){
        if(this._dic[name]){
            this._dic[name].put(element)
        }else{
            console.error(`没有池子${name}池子 你往哪放？`)
        }
    },
    // 插入池子的回调函数
    insertPool(err, res){
        // console.log(res,this._load_list)
        for(let i = this._load_list.length - 1;i >= 0;i-- ){
            // console.log(this._load_list[i].prefabName , res.load_url)
            // console.log(res,res.toString())
            if(this._load_list[i].prefabName == res.load_url){
                let info = this._load_list[i]
                this._load_list.splice(i,1)
                for (let i = 0; i < info.num; i++) {
                    let item = cc.instantiate(res)
                    this._dic[info.name].put(item)
                }
            }
        }
    },
}