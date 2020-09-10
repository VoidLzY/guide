
let async = require('./asyen');

cc.Class({
    extends: cc.Component,
    properties: {
        PREFAB: cc.Prefab, //预制件
        parent: cc.Node,   //预制件实例化后所在的父节点
        zIndex: 0,
        // tasks: [cc.String],
    },

    onLoad() {
        if (!CC_EDITOR) {
            this.loadPrefab();
            // cc.director.on('drag')
        }
    },

    start() {
        console.log(he.db.getTable('Guide'))
        this.getTask();
        this.runTask2(1)
    },

    loadPrefab() {
        try {
            let node = cc.instantiate(this.PREFAB);
            node.zIndex = this.zIndex;
            node.position = cc.v2(0, 0);
            //不持久化到编辑器
            node._objFlags = cc.Object.Flags.DontSave;
            node.parent = this.parent || this.node;
            this._godGuide = node.getComponent('GodGuide');
        }
        catch (error) {
            cc.error(this.PREFAB);
            cc.error(error);
        }
    },

    getTask() {
        this.taskGrp = [
            { args: "Canvas/btn1", cmd: "finger", config: null, delayTime: 1, description: "点击按钮1", ends: null, id: 1, taskId: 1, text: "点击选择炮塔座", textPos: null },
            { args: "Canvas/btn2", cmd: "finger", config: null, delayTime: 0, description: "点击按钮2", ends: null, id: 1, taskId: 1, text: "点击选择炮塔座", textPos: null },
            { args: "Canvas/btn3", cmd: "finger", config: null, delayTime: 0, description: "点击按钮3", ends: null, id: 1, taskId: 1, text: "点击选择炮塔座", textPos: null },
            { args: "Canvas/btn1", cmd: "finger", config: null, delayTime: 0, description: "点击按钮1", ends: null, id: 1, taskId: 1, text: "点击选择炮塔座", textPos: null },
            {args: "Canvas/parent/touchNode", cmd: "drag", delayTime: null, description: "拖拽", ends: "Canvas/pos", id: 4, taskId: 1, text: "拖拽", textPos: null}
        ]
    },

    runTask2(num, num2) {
        let grp = []
        let task = {
            name: '一个测试',
            debug: true,
            autorun: false,
            steps: []
        }
        for (let i = 0; i < this.taskGrp.length; i++) {
            if (this.taskGrp[i].taskId == num) {
                grp.push(this.taskGet(this.taskGrp[i]))
            }
        }
        console.log(grp)
        task.steps = grp
        // console.log(grp)
        this._godGuide.setTask(task);
        this._godGuide.run();
    },

    runTask(num, num2) {
        async.eachSeries(['task1'], (taskFile, cb) => {
            let task = require(taskFile);
            let guide = he.db.getTable('Guide') || null
            console.log(guide)
            let grp = []
            for (let i = 0; i < guide.length; i++) {
                if (guide[i].taskId == num) {
                    grp.push(this.taskGet(guide[i]))
                }
            }
            if (num2) {
                for (let j = 0; j < guide.length; j++) {
                    if (guide[j].taskId == num2) {
                        grp.push(this.taskGet(guide[j]))
                    }
                }
            }
            // console.log(grp)
            task.steps = grp
            // console.log(grp)
            this._godGuide.setTask(task);
            this._godGuide.run(cb);
        }, () => {
            cc.log('任务全部完成');
            // cc.director.off()
        });
    },




    taskGet(info) {
        let task = { "desc": "点击", "config": info.config }
        let som
        switch (info.cmd) {
            case 'text':
                som = { "command": { 'cmd': "text", "args": `${info.args}`, 'pos': `${info.textPos}` } }
                Object.assign(task, som)
                break
            case 'finger':
                som = { "command": { 'cmd': "finger", "args": `${info.args}`, 'text': `${info.text}`, 'pos': `${info.textPos}` } }
                Object.assign(task, som)
                break
            case 'drag':
                som = { "command": { 'cmd': "drag", "args": `${info.args}`, "ends": `${info.ends}`, "text": info.text, 'pos': `${info.textPos}` } }
                Object.assign(task, som)
                break
        }
        if (info.delayTime) {
            let time = { "delayTime": info.delayTime }
            Object.assign(task, time)
        }
        // console.log(task)
        return task
    },






});