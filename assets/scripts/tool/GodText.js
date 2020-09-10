
cc.Class({
    extends: cc.Component,

    properties: {
        text: {
            default: '',
            notify() {
                this._updateContent();
            }
        }
    },

    start() {
        if(game_main.data.pass_id==90005||game_main.data.pass_id==90006||game_main.data.pass_id==90008){
            this.node.getChildByName('bg').active=true
        }else{
            this.node.getChildByName('bg').active=false
        }

        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            this.node._touchListener.setSwallowTouches(false);
            //隐藏文本提示
            if (this.node.active) {
                this.node.active = false;
                game_main.data.pause=false
                this.node.emit('click');
                return;
            }
        });
    },

    _updateContent() {
        this.node.active = true;
        if (!this.label) {
            this.label = this.node.getComponentInChildren(cc.Label);
        }
        this.label.string = this.text;
    }
});
