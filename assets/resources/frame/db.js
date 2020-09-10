module.exports = {
    _dict: {},
    _name_dict: {},
    // 后期需要优化的点。
    // 此处是数据全部加载。
    // 理想的处理方式是。只有用到的时候才进行加载 内存 > 储存 > 网络获取

    init() {
        he.load.getRes('data/game_data', cc.JsonAsset, this.sortJson.bind(this))
    },
    sortJson(err, asset) {
        for (let key in asset.json) {
            this._dict[key] = asset.json[key]
        }
        // Tabel Name
        this._name_dict = {
            'sheep': 'Sheep',
        }
        // 
    },
    getTable(tName) {
        this.init()
        console.log(this._dict)
        if (this._dict[tName]) {
            return this._dict[tName]
        }
        let newTname = null
        for (let key in this._name_dict) {
            if (key == tName) {
                newTname = this._name_dict[key]
                break
            }
        }
        if (newTname)
            return this._dict[newTname]
        return null
    },
    getData(tName, id) {
        let table = this.getTable(tName)
        if (table) {
            for (let i = 0; i < table.length; i++) {
                if (table[i].id == id) {
                    return table[i]
                }
            }
            he.error("没有数据" + tName + ",数据id:" + id)
            return null
        } else {
            he.error("没有对应表" + tName)
            return null
        }
    },
    getDataByIndex(tName, index) {
        let table = this.getTable(tName)
        if (table) {
            if (table[index]) {
                return table[index]
            }
            he.error("没有数据" + tName + ",数据index:" + index)
            return null
        } else {
            he.error("没有对应表" + tName)
            return null
        }
    },
    getDataByArgs(tName, arg) {
        let table = this.getTable(tName)
        if (table) {
            for (let i = 0; i < table.length; i++) {
                let add = true
                for (let key in arg) {
                    if (table[i][key] != arg[key]) {
                        add = false
                    }
                }
                if (add) {
                    return table[i]
                }
            }
            return null
        } else {
            he.error("没有对应表" + tName)
            return null
        }
    },
    getDataListByArgs(tName, arg) {
        let table = this.getTable(tName)
        if (table) {
            let list = []
            for (let i = 0; i < table.length; i++) {
                let add = true
                for (let key in arg) {
                    if (table[i][key] != arg[key]) {
                        add = false
                    }
                }
                if (add) {
                    list.push(table[i])
                }
            }
            if (list.length) {
                return list
            } else {
                return null
            }
        } else {
            he.error("没有对应表" + tName)
            return null
        }
    }
}