
module.exports = {
    assetDic: {},
    subList: ['spine', 'voice', 'font'],   // 子包加载
    loadCount: 0,
    currentCount: 0,
    // 读取 没有便加载 完成执行回调
    getRes(url, type, func) {
        if (!type) {
            type = cc.Prefab
        }

        let asset = cc.resources.get(url, type);
        console.log(asset)
        if (asset) {
            this.assetDic[url + '/' + String(type)] = asset
            asset.load_url = url
            if (func) {
                func(null, asset)
            }
        } else {
            this.loadCount += 1
            cc.resources.load(url, type, (err, res) => {
                this.assetDic[url + '/' + String(type)] = res
                this.currentCount += 1
                res.load_url = url
                if (err) {
                    he.error(err)
                }
                if (func) {
                    func(err, res)
                }
            });
        }
    },
    // 读取 return 存在内容
    get(url, type) {
        if (!type) {
            type = cc.Prefab
        }
        if (this.assetDic[url + '/' + String(type)]) {
            return this.assetDic[url + '/' + String(type)]
        }
        let asset = cc.resources.get(url, type);
        if (asset) {
            this.assetDic[url + '/' + String(type)] = asset
            asset.load_url = url
            return asset
        } else {
            return null
        }
    },
    // 强行加载 然后回调
    loadRes(url, type, func) {
        if (!url || !type) {
            return
        }
        this.loadCount += 1

        cc.resources.load(url, type, (err, res) => {
            this.assetDic[url + '/' + String(type)] = res
            this.currentCount += 1
            if (err) {
                he.error(err)
            }
            if (func) {
                func(err, res)
            }
        });
    },
    // 强制加载 列表
    loadResList(list, func) {
        for (let i = 0; i < list.length; i++) {
            if (list[i] && list[i].url && list[i].type) {
                this.loadRes(list[i].url, list[i].type, func)
            }
        }
    },
    // 检查整体有加载完成的内容没
    loadOver() {
        if (this.loadCount > 0 && this.currentCount > 0) {
            if (this.loadCount == this.currentCount) {
                return true
            }
        }
        return false
    },
    loadSub() {
        let self = this
        for (let i = 0; i < this.subList.length; i++) {
            this.loadCount += 1
            cc.loader.downloader.loadSubpackage(this.subList[i], function (err) {
                if (err) {
                    return console.error(err);
                }
                self.currentCount += 1
                console.log('load subpackage successfully.');
            });
        }
    },
    loadScene(name) {
        this.loadCount += 1
        cc.director.preloadScene(name, (error, asset) => {
            this.currentCount += 1
            console.log(`load scene_${name} successfully.`);

        })
    }
}