

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
    /**
     * @param {*} oldParent 拖动节点本身父节点
     * @param {*} newParent touchstart后
     * @param {*} target 拖动位置节点
     * @param {*} success 拖动完成后的回调
     * @param {*} lose 拖动失败后的回调
     */
    init(oldParent, newParent, target, success, lose) {
        if (newParent) this.newParent = newParent
        if (oldParent) this.oldParent = oldParent
        if (target) this.target = target
        if (success) this.success = success
        if (lose) this.lose = lose
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStartServer, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveServer, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEndServer, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancelServer, this)
    },

    touchStartServer(touchEvent) {
        this.startPos = this.node.position
        let initPos = touchEvent.getLocation()
        this.node.position = this.node.parent.convertToNodeSpaceAR(initPos)
    },

    touchMoveServer(touchEvent) {
        let location = touchEvent.getLocation();
        //修改节点位置，注意要使用父节点进行对触摸点进行坐标转换
        this.node.position = this.node.parent.convertToNodeSpaceAR(location);
    },

    touchEndServer(touchEvent) {
        if (!this.target) {
            return;
        }
        //获取target节点在父容器的包围盒，返回一个矩形对象
        let rect
        rect = this.target.getBoundingBox();
        //使用target容器转换触摸坐标
        let location = touchEvent.getLocation();
        let point = this.target.parent.convertToNodeSpaceAR(location);
        //if (cc.rectContainsPoint(rect, targetPoint)) {
        //Creator2.0使用rect的成员contains方法
        if (rect.contains(point)) {
            //在目标矩形内，修改节点坐标  
            if (this.success) {
                this.success()
                // this.cancelLisen()
            }
            else {
                //判断是否需要修改父节点，即完成拖动，无其他操作
                if (this.newParent) {
                    this.node.parent = this.newParent
                }

                return
            }
            return;
        } else {
            //不在矩形中，还原节点位置    
            this.node.parent = this.oldParent
            this.node.position = this.startPos;
            if (this.lose) this.lose()
        }
    },

    touchCancelServer(touchEvent) {
        this.node.parent = this.oldParent
        this.node.position = this.startPos;
        if (this.lose) this.lose()
    },


    cancelLisen() {
        this.node.targetOff(this)
    },
});
