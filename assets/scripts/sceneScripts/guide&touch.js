

cc.Class({
    extends: cc.Component,

    properties: {
        touchNode: cc.Node,
        parent:cc.Node,
        pos: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.touchNodeInit()
    },

    // update (dt) {},

    touchNodeInit() {
        let touchServer = this.touchNode.getComponent('touch')
        touchServer.init(this.parent, this.node, this.pos,(() => {
            console.log('拖动成功')
        }), (() => {
            console.log('拖动失败或取消')
        }))

    },
});
