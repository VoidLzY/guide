module.exports = {
    // 做这一步很傻，其实es的 `${变量}` 就可以替代这个功能
    // var template1="我是{0}，今年{1}了";
    // he.func.str.format("loogn",22);

    // var template2="我是{name}，今年{age}了";
    // he.func.str.format(template2,{name:"loogn",age:22});
    format(result,args) {
        if (arguments.length > 1) {
            if (arguments.length == 2 && typeof (args) == "object") {
                for (var key in args) {
                    if(args[key]!=undefined){

                        var reg = new RegExp("({" + key + "})", "g");
                        result = result.replace(reg, args[key]);
                    }
                }
            }
            else {
                for (var i = 0; i < arguments.length; i++) {
                    if(!i){
                        result =arguments[i]
                        continue
                    }
                    if (arguments[i] != undefined) {
                        var reg= new RegExp("({)" + (i-1) + "(})", "g");
                        result = result.replace(reg, arguments[i]);
                    }
                }
            }
        }else{
            cc.log('请补充字符串')
        }
        return result;
    },
    format4Arr(result,list){
        if(list.length){
            for(let i = 0;i < list.length;i++){
                if(result.indexOf("{"+i+"}") >= 0){
                    result = result.replace("{"+i+"}", list[i]);
                }
            }
        }

        return result
    },
    setColor(str,color){
        return `<color=${ color }>${ str }</c>`
    }
}