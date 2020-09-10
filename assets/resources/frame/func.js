import str from "./func/str"
import math from "./func/math"
// 因为不允许 index 所以写出来
module.exports = {
    str:str,
    math:math,
    copy(content){
        return JSON.parse(JSON.stringify(content))
    },
    arrEquip(A,B){
        if(A.sort().toString() == B.sort().toString()){
            return true
        }else{
            return false
        }
    },
    isRepeat(arr){
        let  hash = {};
        for(let i in arr) {
            if(hash[arr[i]]) {
                return true;
    　　     }
            hash[arr[i]] = true;
        }
        return false;
    },
    isArrinArrayRepeat(parent,child){
        // 数组 在不在 数组集合中
        if(parent.length){
            for(let i = 0; i < parent.length;i++){
                // 如果有一个不存在 就 return false
                for(let j = 0; j < child.length;j++){
                    if(parent[i].indexOf(child[j]) < 0){
                        return false
                    }
                }
            }
            return true
        }
        return false
        
    },
    // 
    createRegion(texture) {
        let skeletonTexture = new sp.SkeletonTexture()
        skeletonTexture.setRealTexture(texture)
        let page = new sp.spine.TextureAtlasPage()
        page.name = texture.name
        page.uWrap = sp.spine.TextureWrap.ClampToEdge
        page.vWrap = sp.spine.TextureWrap.ClampToEdge
        page.texture = skeletonTexture
        page.texture.setWraps(page.uWrap, page.vWrap)
        page.width = texture.width
        page.height = texture.height
        
        let region = new sp.spine.TextureAtlasRegion()
        region.page = page
        region.width = texture.width
        region.height = texture.height
        region.originalWidth = texture.width
        region.originalHeight = texture.height
        
        region.rotate = false
        region.u = 0
        region.v = 0
        region.u2 = 1
        region.v2 = 1
        region.texture = skeletonTexture
        return region
    },
    // target 参数为 node
    getActionPasue(target){
        let actionManager = cc.director.getActionManager()
        var element = actionManager._hashTargets[target._id];
        if (element)
            return element.paused
        return false
    },
    // 补零
    prefixInteger(num, n) {
        if(String(num).length > n){
            return num
        }
        return (Array(n).join(0) + num).slice(-n);
    },
    // 连线所有点的面积
    DotToSize(list){
        let count = 0
        for(let i = 0; i < list.length;i++){
            let res = 0
            // if(!i){
            //     res = (list[i].x - list[list.length - 1].x) * (list[i].y + list[list.length - 1].y)
            // }else{
            //     res = (list[i].x - list[i - 1].x) * (list[i].y + list[i - 1].y)
            // he.log(list[i][0] , list[list.length - 1][0],list[i][1] , list[list.length - 1][1])
            // }
            if(!i){
                res = (list[i][0] - list[list.length - 1][0]) * (list[i][1] + list[list.length - 1][1])
            }else{
                res = (list[i][0] - list[i - 1][0]) * (list[i][1] + list[i - 1][1])
            }
            count += res
        }
        return Math.abs(count/2)
    },
    refreshItemList(itemList,dataList,newfunc,refreshFunc)
    {
        for(let i = 0 ; i < dataList.length; i++){
            let item = itemList[i]
            if(item === undefined)
            {
                item = newfunc(i)
                itemList.push(item)
            }
            if(item)
            {
                item.node.active = true
                refreshFunc(item,i,dataList[i])
            }
        }

        for(let i = dataList.length; i < itemList.length; i++){
            let item = itemList[i]
            if(item)
            {
                item.node.active = false
            } 
        }
    },
    share(param){
        if(window.wx){
            wx.showShareMenu({
                withShareTicket: true
            })

            if(param){
                wx.shareAppMessage({
                    title:  param.title,
                    imageUrlId: param.imageUrlId,
                    imageUrl: param.imageUrl,
                    query:param.query
                })
            }else{
                wx.shareAppMessage({
                    title:  '一起来拯救青青草原吧！',
                    imageUrlId: 'qlG4H2pMRuq3oLcgMOCE3A==',
                    imageUrl: 'https://mmocgame.qpic.cn/wechatgame/YhYcyvGHJCvnWwNRYqeMbQCqribslDp06LqLiacYbQEz43fG18WJuHRbicMNATF7KWt/0'
                })
            }
           
        }
    },
}