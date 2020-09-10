
module.exports = {
    room:null,
    gameId:null,
    openId:"测试玩家",

    mockOpenId(){

        let str = Date.now().toString(36);

        for (let i = 0; i < 7; i++) {
            str += Math.ceil(Math.random() * (10 ** 4)).toString(36);
        }

        return str;
    },

    isInited(){
        return !!MGOBE.Player && !!MGOBE.Player.id;
    },
    initSDK(gameId,secretKey,url,cacertNativeUrl,callback){
        if (this.isInited()) {
            return callback && callback({ code: MGOBE.ErrCode.EC_OK });
        }
        he.log("开始初始化SDK")
        const defaultGameInfo = {
            gameId: gameId,
            // openId:
            secretKey:secretKey
        }
        if(window.wx){
            defaultGameInfo.openId = he.local.getJson('openid','userInfo')
            
        }else{
            defaultGameInfo.openId =  this.mockOpenId()
        }

        this.openId = defaultGameInfo.openId
        he.log(`玩家openId${defaultGameInfo.openId}`)
        const defaultConfig = {
            url: url,// 替换为控制台上的“域名”
            cacertNativeUrl:cacertNativeUrl,
            isAutoRequestFrame:true,
            reconnectMaxTimes: 5,
            reconnectInterval: 1000,
            resendInterval: 1000,
            resendTimeout: 10000,
        }
        // MGOBE.DebuggerLog.enable = true;
        MGOBE.DebuggerLog.enable = false;

        if (cc.sys.isNative) {
            MGOBE.DebuggerLog.enable = false;
        }

        MGOBE.Listener.init(defaultGameInfo, defaultConfig, event => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                he.log("初始化SDK 创建房间成功")
                this.room = new MGOBE.Room();
                this.gameId = defaultGameInfo.gameId;
    
                MGOBE.Listener.add(this.room);
                // // 设置默认广播
                //setBroadcastCallbacks(this.room, null, {});
            }
            else
            {
                he.log(`初始化SDK 创建房间失败 ${event.code}`)
            }
            callback && callback({ code: event.code });
        });
    },
    cancelMatchPlayers(callback) {
        let cancelPlayerMatchPara = {
            matchType:MGOBE.types.MatchType.PLAYER_COMPLEX
        }
        this.room.cancelPlayerMatch(cancelPlayerMatchPara, event => {
            if(this.timer)
            {
                clearInterval(this.timer);
                this.timer = null
            }
            
            callback && callback(event.code)
        })
        
    },
    leaveRoom(callback) {
        this.room.leaveRoom({}, (event) => {
            he.log(`随机离开房间：${event.code}`);
          
            callback && callback(  event.code )
            
        })
    },
    matchPlayers(matchCode,callback) {
        this.timer = setInterval(() => he.log(`正在随机匹配，请稍等。`), 1000);
        he.log(`正在随机匹配，匹配Code：${matchCode}。请稍等，默认超时时间为 10 秒。`);

        // 注意：这里没有使用匹配属性，如果匹配规则中有设置匹配属性，这里需要做调整

        let userInfo = he.local.getJson('userInfo')
        let nickName = this.openId

        if(userInfo){  
            let userData = userInfo  
            nickName = userData.nickName    
        }


        const playerInfo = {
            name: nickName,
            customPlayerStatus: 0,
            customProfile: "",
            matchAttributes: [{
                name: "skill1",
                value: 99,
            }]
        };

        const matchPlayersPara = {
            matchCode,
            playerInfo,
        };

        this.room.initRoom();
        this.room.matchPlayers(matchPlayersPara, event => {
            if(this.timer)
            {
                clearInterval(this.timer);
                this.timer = null
            }

             // 已经在房间内
             if (event.code === MGOBE.ErrCode.EC_ROOM_PLAYER_ALREADY_IN_ROOM) {
                // TODO  暂时先离开房间，重新匹配
                he.log("玩家在房间里 暂时离开房间 重新进入")
                this.room.leaveRoom({}, (event) => {
                    he.log(`随机离开房间：${event.code}`);
                    if (event.code == MGOBE.ErrCode.EC_OK) {
                        this.matchPlayers(matchCode,callback);
                    }
                    else
                    {
                        callback && callback(  event.code )
                    }
                })
                return
            }
            
            if (event.code === MGOBE.ErrCode.EC_OK) {
                he.log(`随机匹配成功，房间ID：${event.data.roomInfo.id}`);
                callback && callback(event.code );
            } else {
                he.log(`随机匹配失败，错误码：${event.code}`);
                callback && callback(event.code )
            }
        });
    },
    createRoom(callback) {
        this.room.initRoom();

        let userInfo = he.local.getJson('userInfo')
        let nickName = this.openId
        let avatarUrl = ``
        if(userInfo){  
            let userData = userInfo  
            nickName = userData.nickName    
            avatarUrl = userInfo.avatarUrl
        }


        const playerInfo = {
            name: nickName,
            customPlayerStatus: 0,
            customProfile: avatarUrl,
        };

        const createRoomPara = {
            roomName: nickName + "的房间",
            roomType: "create",
            maxPlayers: 4,
            isPrivate: true,
            customProperties:"",
            playerInfo:playerInfo,
        };

        this.room.createRoom(createRoomPara, event => {
             // 已经在房间内
             if (event.code === MGOBE.ErrCode.EC_ROOM_PLAYER_ALREADY_IN_ROOM) {
                // TODO  暂时先离开房间，重新匹配
                he.log("玩家在房间里 暂时离开房间 重新进入")
                this.room.leaveRoom({}, (event) => {
                    he.log(`随机离开房间：${event.code}`);
                    if (event.code == MGOBE.ErrCode.EC_OK) {
                        this.createRoom(callback);
                    }
                    else
                    {
                        callback && callback( event.code )
                    }
                })
                return
            }
            
            if (event.code === MGOBE.ErrCode.EC_OK) {
                he.log(`创建房间成功，房间ID：${event.data.roomInfo.id}`);
                callback && callback(event.code);
            } else {
                he.log(`创建房间失败，错误码：${event.code}`);
                callback && callback(event.code )
            }
        });
    },
    getPlayerInfoParams() {
        let userInfo = he.local.getJson('userInfo')
        let nickName = this.openId
        let avatarUrl2 = ""
        if(userInfo){  
            let userData = userInfo  
            nickName = userData.nickName   
            avatarUrl2 = userData.avatarUrl  
        }

        const playerInfo = {
            name: nickName,
            customPlayerStatus: 0,
            customProfile: avatarUrl2,
        };

        return playerInfo
    },
    changeRoomForbin(isForbidJoin) {
        if(!this.room)
        {
            return
        }

        let param = {
            isForbidJoin:isForbidJoin
        }
        this.room.changeRoom(param)
    },
    
    joinRoom(roomId,callback) {
        this.room.initRoom({ id: roomId });
        let playerInfo = this.getPlayerInfoParams()
        const joinRoomPara = {
            playerInfo:playerInfo,
        }
        this.room.joinRoom(joinRoomPara, event => {
             // 已经在房间内
             if (event.code === MGOBE.ErrCode.EC_ROOM_PLAYER_ALREADY_IN_ROOM) {
                // TODO  暂时先离开房间，重新匹配
                he.log("玩家在房间里 暂时离开房间 重新进入")
                this.room.leaveRoom({}, (event) => {
                    he.log(`随机离开房间：${event.code}`);
                    if (event.code == MGOBE.ErrCode.EC_OK) {
                        this.joinRoom(roomId,callback);
                    }
                    else
                    {
                        callback && callback( event.code )
                    }
                })
                return
            }
            
            if (event.code === MGOBE.ErrCode.EC_OK) {
                he.log(`加入房间成功，房间ID：${event.data.roomInfo.id}`);
                callback && callback(event.code);
            } else {
                he.log(`加入房间失败，错误码：${event.code}`);
                callback && callback(event.code )
            }
        });
    },
    levelRoom( callback) {
        if(!this.isInRoom())
        {
            callback && callback( MGOBE.ErrCode.EC_OK )
            return
        }
        
            this.room.leaveRoom({}, (event) => {
                he.log(`随机离开房间：${event.code}`);
                callback && callback( event.code )
            })
    },
    setBroadcastCallbacks( context, broadcastCallbacks) {

        if (!this.room) {
            return;
        }
    
        // 默认回调函数
        const generateDefaultCallback = (tag) => (event) => he.log("defaultCallbacks",tag,event);
    
        const defaultCallbacks = {
            onJoinRoom:  generateDefaultCallback("onJoinRoom"),
            onLeaveRoom: generateDefaultCallback("onLeaveRoom"),
            onChangeRoom:  generateDefaultCallback("onChangeRoom"),
            onDismissRoom:  generateDefaultCallback("onDismissRoom"),
            onStartFrameSync: generateDefaultCallback("onStartFrameSync"),
            onStopFrameSync: generateDefaultCallback("onStopFrameSync"),
            onRecvFrame: generateDefaultCallback("onRecvFrame"),
            onChangeCustomPlayerStatus: generateDefaultCallback("onChangeCustomPlayerStatus"),
            onRemovePlayer: generateDefaultCallback("onRemovePlayer"),
            onRecvFromClient: generateDefaultCallback("onRecvFromClient"),
            onRecvFromGameSvr: generateDefaultCallback("onRecvFromGameSvr"),
            onAutoRequestFrameError: generateDefaultCallback("onAutoRequestFrameError"),
        };
    
        // 给 room 实例设置广播回调函数
        Object.keys(defaultCallbacks).forEach((key) => {
            const callback = broadcastCallbacks && broadcastCallbacks[key] ? broadcastCallbacks[key].bind(context) : defaultCallbacks[key];
            this.room[key] = callback;
        });
    },
    getPlayer(playerId) {
        if(!this.room)
        {
            return
        }
        let player = this.room.roomInfo.playerList.find(p => p.id === playerId)
        he.log("===player",player)
        return  player
    },
    isInRoom() {
        if(!this.room)
        {
            return false
        }

        return this.getPlayer(MGOBE.Player.id) !== undefined
    },
    getPlayerList() {
        if(!this.room)
        {
            return []
        }

       return this.room.roomInfo.playerList
    },
    changeCustomPlayerStatus(number,callback) {
        if(!this.room)
        {
            he.log("房间还没初始化")
            return
        }

        let ChangeCustomPlayerStatusPara = {
            customPlayerStatus: number
        }

        this.room.changeCustomPlayerStatus(ChangeCustomPlayerStatusPara,event => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                he.log(`发送自定义玩家状态消息成功`);
            } else {
                he.log(`发送自定义玩家状态消息失败，错误码：${event.code}`);
            }

            callback && callback(event.code)
        });

    },
    startFrame() {
        // 只有房主才能调用开始帧同步
        if (this.room.roomInfo.owner !== MGOBE.Player.id) {
            return;
        }

        this.room.startFrameSync({}, event => {
            if (event.code != MGOBE.ErrCode.EC_OK) {
                he.log(`房主开始帧同步失败${event.code}`);
                return;
            }
            he.log("房主开始帧同步");
        });
    },
    isRoomOwner(){
        return this.judgeIsRoomOwner(MGOBE.Player.id)
    },
    judgeIsRoomOwner(playerId){
        if(!this.room)
        {
            return false
        }

        return this.room.roomInfo.owner === playerId
    },
    getRoomID() {
        if(!this.room)
        {
            return "1"
        }
        return this.room.roomInfo.id
    },
    sendToGameSrc(cmd,params) {
        let sendToClientPara = {
            data: {
                cmd,
                params
            },
        }

        this.room.sendToGameSvr(sendToClientPara, event => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                he.log(`发送房间消息成功`);
            } else {
                he.log(`发送房间消息失败，错误码：${event.code}`);
            }
        });
    },
    getRoomId() {
        if(!this.room)
        {
            return
        }
        return this.room.roomInfo.id
    }
    // export function initSDK(gameId: string, secretKey: string, url: string, cacertNativeUrl: string, callback?: (event: { code: MGOBE.ErrCode }) => any): void {
    //     // 如果已经初始化，直接回调成功
    //     const defaultGameInfo: MGOBE.types.GameInfoPara = {
    //         gameId: configs.gameId,
    //         openId: configs.openId,
    //         secretKey: configs.secretKey,
    //     };
    
    //     const defaultConfig: MGOBE.types.ConfigPara = {
    //         url: configs.url,
    //         isAutoRequestFrame: true,
    //         cacertNativeUrl: "",
    //     };
    
    //     Object.assign(defaultGameInfo, { gameId, secretKey });
    //     Object.assign(defaultConfig, { url, cacertNativeUrl });
    

    
    //     // 初始化
    //     MGOBE.Listener.init(defaultGameInfo, defaultConfig, event => {
    //         if (event.code === MGOBE.ErrCode.EC_OK) {
    //             global.room = new MGOBE.Room();
    //             global.gameId = defaultGameInfo.gameId;
    
    //             MGOBE.Listener.add(global.room);
    //             // 设置默认广播
    //             setBroadcastCallbacks(global.room, null, {});
    //         }
    
    //         callback && callback({ code: event.code });
    //     });
    // }
}