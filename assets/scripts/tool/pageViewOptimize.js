/**
 * 20/9/11 林懿
 * 使用姿势:
 * 1、创建一个pageView后把pageView组件删了，根据需求调整content和item，添加touch节点，大小覆盖整个pageviews
 * 2、继承该脚本后，必须绑定itemWidth
 * 3、使用时调用init 、pageInit，或根据需求使用相应脚本
 */

cc.Class({
    extends: cc.Component,

    properties: {
        touchNode: cc.Node,
        content: cc.Node,
        itemWidth: {
            default: 0,
            visible: true,
            displayName: 'item的宽度'
        },
        moveTime: {
            default: 0.3,
            visible: true,
            displayName: '滑动的时间'
        },
        isCycle: {
            default: true,
            visible: true,
            displayName: '是否循环，能从队尾回到对首'
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        // this.init()
        // this.pageInit(this.itemInit, [0, 1])
        // this.touchListen()
    },

    // update (dt) {},

    init(index) {
        if (index) {
            this.pageIndex = index
        } else {
            this.pageIndex = 0
        }
        this.isMoveing = false
        if (this.itemWidth) {
            this.originX = -(1.5 * this.itemWidth)
            this.content.x = this.originX
        } else {
            console.log('未绑定itemWidth')
        }
    },
    //index之后的page下标
    indexNext() {
        let num = this.pageIndex + 1
        let nextIndex = -1
        if (num > (this.pageGrp.length - 1)) {
            if (this.isCycle) {
                nextIndex = 0
                return nextIndex
            } else {
                return nextIndex
            }
        } else {
            nextIndex = num
            return nextIndex
        }
    },
    //index之前的page下标
    indexPre() {
        let num = this.pageIndex - 1
        let preIndex = -1
        if (num < 0) {
            if (this.isCycle) {
                preIndex = (this.pageGrp.length - 1)
                return preIndex
            } else {
                return preIndex
            }
        } else {
            preIndex = num
            return preIndex
        }
    },

    itemInit(index, info) {
        this.content.children[index].getChildByName('lab').getComponent(cc.Label).string = `${info}`
    },

    pageInit(itemFunc, pageGrp) {
        if (itemFunc) {
            this.itemFunc = itemFunc
        }
        if (pageGrp) {
            this.pageGrp = pageGrp
        }
        if (this.pageGrp && this.pageGrp.length != 0) {
            let next = this.indexNext()
            if (next != -1) {
                this.itemFunc(2, this.pageGrp[next])
            }
            let pre = this.indexPre()
            if (pre != -1) {
                this.itemFunc(0, this.pageGrp[pre])
            }
            this.itemFunc(1, this.pageGrp[this.pageIndex])
        } else {
            console.log('传入数据有误')
        }

    },

    touchListen() {
        this.touchNode.on(cc.Node.EventType.TOUCH_START, this.touchStartServer, this)
        this.touchNode.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveServer, this)
        this.touchNode.on(cc.Node.EventType.TOUCH_END, this.touchEndServer, this)
        this.touchNode.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancelServer, this)
    },

    closeTouchListen() {
        this.touchNode.targetOff(this)
    },

    touchStartServer(event) {
        let location = event.getLocation();// 获取节点坐标
        this.firstX = location.x;
        this.firstY = location.y;
    },

    touchMoveServer(event) {
        let location = event.getLocation();// 获取节点坐标
        // let xDur = location.x - this.firstX
        // console.log(xDur)
        // this.content.x += xDur
        let delta = event.touch.getDelta(); //getDelta: 获取当前光标与上一光标的偏移量
        this.content.x += delta.x; //因为是偏移量，所以这里用的是+
    },

    touchEndServer(event) {
        let touchPoint = event.getLocation();
        let endX = this.firstX - touchPoint.x;
        let endY = this.firstY - touchPoint.y;

        if (endX > 0) {
            //向左函数
            console.log('left');
            this.leftMove()
        } else {
            //向右函数
            console.log('right');
            this.rightMove()
        }
    },
    touchCancelServer(event) {
        let touchPoint = event.getLocation();
        let endX = this.firstX - touchPoint.x;
        let endY = this.firstY - touchPoint.y;

        if (endX > 0) {
            //向左函数
            console.log('left');
            this.leftMove()
        } else {
            //向右函数
            console.log('right');
            this.rightMove()
        }
    },

    rightMove() {
        if (this.isMoveing) {
            console.log('正在移动')
            return
        }
        let nowIndex = this.indexPre()
        if (nowIndex == -1) {
            console.log('不能循环滚动')
            cc.tween(this.content)
                .to(0.1, { x: this.originX })
                .call(() => {
                    this.isMoveing = false
                })
                .start()
            return
        } else {
            this.isMoveing = true
            this.pageIndex = nowIndex
            cc.tween(this.content)
                .to(this.moveTime, { x: (this.originX + this.itemWidth) })
                .call(() => {
                    this.content.x = this.originX
                    this.itemFunc(0, this.pageGrp[this.indexPre()])
                    this.itemFunc(1, this.pageGrp[this.pageIndex])
                    this.itemFunc(2, this.pageGrp[this.indexNext()])
                    this.isMoveing = false
                })
                .start()
        }
    },

    leftMove() {
        if (this.isMoveing) {
            console.log('正在移动')
            return
        }
        let nowIndex = this.indexNext()
        this.isMoveing = true
        if (nowIndex == -1) {
            console.log('不能循环滚动')
            cc.tween(this.content)
                .to(0.1, { x: this.originX })
                .call(() => {
                    this.isMoveing = false
                })
                .start()
            return
        } else {
            this.pageIndex = nowIndex
            cc.tween(this.content)
                .to(this.moveTime, { x: (this.originX - this.itemWidth) })
                .call(() => {
                    this.content.x = this.originX
                    this.itemFunc(0, this.pageGrp[this.indexPre()])
                    this.itemFunc(1, this.pageGrp[this.pageIndex])
                    this.itemFunc(2, this.pageGrp[this.indexNext()])
                    this.isMoveing = false
                })
                .start()
        }
    },




});
