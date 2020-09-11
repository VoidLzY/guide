/**
 * scrollview的drawCall优化
 */

cc.Class({
    extends: cc.Component,

    properties: {
        scroll: cc.ScrollView,
        content: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
    openListen() {
        this.scroll.node.on('scrolling', this.checkScrollDrawCall, this)
    },

    closeListen() {
        this.scroll.node.off('scrolling', this.checkScrollDrawCall, this)
    },

    //获取scroll的rect信息
    scrollInit() {
        let svLeftBottomPoint = this.scroll.node.parent.convertToWorldSpaceAR(
            cc.v2(
                this.scroll.node.x - this.scroll.node.anchorX * this.scroll.node.width,
                this.scroll.node.y - this.scroll.node.anchorY * this.scroll.node.height
            )
        );

        // 求出 ScrollView 可视区域在世界坐标系中的矩形（碰撞盒）
        this.svBBoxRect = cc.rect(
            svLeftBottomPoint.x,
            svLeftBottomPoint.y,
            this.scroll.node.width,
            this.scroll.node.height
        );
    },
    //检测
    checkScrollDrawCall() {
        if (this.content.childrenCount == 0) {
            return;
        }
        // 上文提及到的碰撞检测代码
        // 遍历 ScrollView Content 内容节点的子节点
        this.content.children.forEach((childNode) => {

            // 对每个子节点的包围盒做和 ScrollView 可视区域包围盒做碰撞判断
            // 如果相交了，那么就显示，否则就隐藏
            if (childNode.getBoundingBoxToWorld().intersects(this.svBBoxRect)) {
                if (childNode.opacity != 255) {
                    childNode.opacity = 255;
                    // childNode.emit("on_enter_scroll_view");
                }
            } else {
                if (childNode.opacity != 0) {
                    childNode.opacity = 0;
                    // childNode.emit("on_exit_scroll_view");
                }
            }
        });
    },

});
