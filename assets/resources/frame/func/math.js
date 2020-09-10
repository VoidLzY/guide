module.exports = {
    belike(a,b){
        let c = Math.abs((a - b) * 10)
        if(c > 1){
            return false
        }else{
            return true
        }
    },
    // 加
    add(a,b){
        let base = new he.big(a)
        base = base.plus(b)
        return base.toString()
    },
    // 减
    sub(a,b){
        let base = new he.big(a)
        base = base.minus(b)
        return base.toString()
    },
    // 乘
    mul(a,b){
        let base = new he.big(a)
        base = base.times(b)
        return base.toString()
    },
    // 除
    div(a,b){
        let base = new he.big(a)
        base = base.div(b)
        return base.toString()
    },

    // 等
    eq(a,b){
        let base = new he.big(a)
        return base.eq(b)
    },
    // 大于
    gt(a,b){
        let base = new he.big(a)
        return base.gt(b)
    },
    // 大于等
    gte(a,b){
        let base = new he.big(a)
        return base.gte(b)
    },
    // 小于
    lt(a,b){
        let base = new he.big(a)
        return base.lt(b)
    },
    // 小于等
    lte(a,b){
        let base = new he.big(a)
        return base.lte(b)
    },
}