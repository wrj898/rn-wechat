import React, {Component} from "react";
import CommonTitleBar from "../views/CommonTitleBar";
import Global from "../utils/Global";
import Utils from "../utils/Utils";
import LogUtil from "../utils/LogUtil";
import TimeUtils from "../utils/TimeUtil";
import ChatBottomBar from "../views/ChatBottomBar";
import MoreView from "../views/MoreView";
import LoadingView from "../views/LoadingView";
import CountEmitter from "../event/CountEmitter";
import Emoticons from "react-native-emoticons";
import JMessage from "jmessage-react-plugin";
import UserInfoUtil from "../utils/UserInfoUtil";
import ImageAdapter from "../views/ImageAdapter";
import io from "socket.io-client"
import Api from "../api/Api"
import RedPacketDialog from "../views/RedPacketDialog";

import {
    Dimensions,
    FlatList,
    Image,
    PixelRatio,
    StyleSheet,
    Text,
    View,
    Platform,
    Keyboard,
    BackHandler,
    ImageBackground, TouchableOpacity
} from "react-native";

const {width} = Dimensions.get("window");
const MSG_LINE_MAX_COUNT = 15;

export default class ChattingScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: null,
            showEmojiView: false,
            showMoreView: false,
            showProgress: false,
            isSessionStarted: false,
            conversation: null,
            messages: []
        };
        // 聊天人username或groupId
        this.chatContactId = this.props.navigation.state.params.chatContactId;
        // 聊天人昵称或群名称
        this.chatUsernick = this.props.navigation.state.params.name;
        // 聊天类型，'single' or 'group'
        this.chatType = this.props.navigation.state.params.type;
        // 聊天人头像
        this.chatWithAvatar = this.props.navigation.state.params.avatar;

        // 记录当前正在聊天的id(单个用户的username或群id)
        Global.currentChattingUsername = this.chatContactId;
        Global.currentChattingType = this.chatType;

        this.username = UserInfoUtil.userInfo.username;
        this.userId = UserInfoUtil.userInfo.id;
    }

    componentWillMount() {
        let url = Api.BASE_URL
        let token = UserInfoUtil.userInfo.token;
        let soc = io(url, {
            path: "/socket.io",
            query: {token: token}
        })
        soc.on("message", function (data) {
            console.log(data, "receive Socket message")
        })
        this.setState({
            socket: soc
        })
        console.log(soc)
        console.log(this.state.socket, "chatting socket")
        // android需要调用进入会话的api，进入会话后android不会有通知栏消息
        if (Platform.OS === "android") {
            let options = {
                type: this.chatType,
                appKey: Global.JIMAppKey
            };
            if (this.chatType === "group") {
                options.groupId = this.chatContactId;
            } else {
                options.username = this.chatContactId;
            }
            // LogUtil.d("enterConversation: " + JSON.stringify(options));
            // JMessage.enterConversation(
            //   options,
            //   conversation => {
            //     LogUtil.d("enter conversation: chat with " + this.chatUsernick);
            //   },
            //   error => {
            //     LogUtil.e("enter conversation error: " + JSON.stringify(error));
            //   }
            // );

            // 注册返回监听器
            this.backHandler = () => {
                if (this.state.showEmojiView) {
                    this.setState({showEmojiView: false});
                    return true;
                }
                if (this.state.showMoreView) {
                    this.setState({showMoreView: false});
                    return true;
                }
            };
            BackHandler.addEventListener("hardwareBackPress", this.backHandler);
        }

        this.keyboardDidShowListener = Keyboard.addListener(
            "keyboardDidShow",
            () => {
                // 键盘显示，则隐藏底部View
                this.updateView(false, false);
            }
        );

        // 加载聊天记录
        this.loadChattingMsgs();

        // 进入聊天界面后，通知会话列表刷新
        CountEmitter.emit("hasToken")
        CountEmitter.emit("notifyConversationListRefresh");

        // 应用收到新消息，会触发这里的监听器，从而刷新聊天消息列表
        CountEmitter.addListener(
            "notifyChattingRefresh",
            this.notifyChattingRefreshListener
        );
    }

    componentDidMount() {
        // this.refs.redPacketDialog.showModal();
    }

    notifyChattingRefreshListener = () => {
        // 刷新消息
        this.loadChattingMsgs();
    };

    // 加载聊天消息列表
    loadChattingMsgs() {
        let url = Api.BASE_URL + "/rooms/"
        fetch(url + this.chatContactId + "/messages?current=1&pageSize=20", {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + UserInfoUtil.userInfo.token
            },
            method: 'GET',
        })
            .then(res => res.json())
            .then(json => {
                // console.log(json)
                this.setState({messages: json.data.list}, function () {
                    // console.log(this.state.messages);
                    this.scroll();
                })
            })
        // let options = {
        //     type: this.chatType,
        //     appKey: Global.JIMAppKey,
        //     from: 0,
        //     limit: -1
        // };
        // if (this.chatType === "group") {
        //     options.groupId = this.chatContactId;
        // } else {
        //     options.username = this.chatContactId;
        // }
        // JMessage.getHistoryMessages(
        //   options,
        //   msgArr => {
        //     LogUtil.d("conversation msgs: ", msgArr);
        //     this.setState({ messages: msgArr }, () => {
        //       this.scroll();
        //     });
        //   },
        //   error => {
        //     LogUtil.w("load all chat msg error: " + JSON.stringify(error));
        //   }
        // );
    }

    render() {
        var moreView = [];
        if (this.state.showEmojiView) {
            moreView.push(
                <View key={"emoji-view-key"}>
                    <View
                        style={{
                            width: width,
                            height: 1 / PixelRatio.get(),
                            backgroundColor: Global.dividerColor
                        }}
                    />
                    <View style={{height: Global.emojiViewHeight}}>
                        {/* <EmojiView /> */}
                        <Emoticons
                            onEmoticonPress={this._onEmoticonPress}
                            onBackspacePress={this._onBackspacePress}
                            show={this.state.showEmojiView}
                            concise={false}
                            showHistoryBar={false}
                            showPlusBar={false}
                        />
                    </View>
                </View>
            );
        }
        if (this.state.showMoreView) {
            moreView.push(
                <View key={"more-view-key"}>
                    <View
                        style={{
                            width: width,
                            height: 1 / PixelRatio.get(),
                            backgroundColor: Global.dividerColor
                        }}
                    />
                    <View style={{height: Global.addViewHeight}}>
                        <MoreView navigator={this.props.navigation} setMoreView={() => {
                            this.setState({showMoreView: false})
                        }} groupId={this.chatContactId}/>
                    </View>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <CommonTitleBar title={this.chatUsernick} nav={this.props.navigation}/>
                {this.state.showProgress ? (
                    <LoadingView cancel={() => this.setState({showProgress: false})}/>
                ) : null}
                <View style={styles.content}>
                    <FlatList
                        ref="flatList"
                        data={this.state.messages}
                        renderItem={this.renderItem}
                        keyExtractor={this._keyExtractor}
                        extraData={this.state}
                        onScroll={this._onListScroll}
                    />
                </View>
                <View style={styles.divider}/>
                <View style={styles.bottomBar}>
                    <ChatBottomBar
                        ref="chatBottomBar"
                        updateView={this.updateView}
                        handleSendBtnClick={this.handleSendBtnClick}
                    />
                </View>
                {moreView}
                <View
                    style={{
                        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        position: "absolute",
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <RedPacketDialog
                        ref="redPacketDialog"
                        content={"hello"}
                    />
                </View>
            </View>
        );
    }

    _onListScroll = () => {
        // list滑动时，隐藏底部的View
        if (this.state.showEmojiView) {
            this.setState({showEmojiView: false});
        }
        if (this.state.showMoreView) {
            this.setState({showMoreView: false});
        }
    };

    _onEmoticonPress = data => {
        // 选择了某个emoji表情，将该表情追加到输入框中
        this.refs.chatBottomBar.appendMsg(data.code);
    };

    _onBackspacePress = () => {
    };

    // 发送按钮
    handleSendBtnClick = msg => {
        this.sendTextMessage(msg);
    };

    sendTextMessage(message) {
        let options = {
            type: this.chatType,
            appKey: Global.JIMAppKey,
            text: message,
            messageSendingOptions: JMessage.messageSendingOptions
        };
        if (this.chatType === "group") {
            options.groupId = this.chatContactId;
        } else {
            options.username = this.chatContactId;
        }
        // 发送文本消息
        JMessage.sendTextMessage(
            options,
            msg => {
                this.concatMessage(msg);
            },
            error => {
                LogUtil.e("send text msg error: " + JSON.stringify(error));
            }
        );
    }

    // image参数格式如下
    // {
    //   "size": 49381,
    //   "mime": "image/jpeg",
    //   "height": 580,
    //   "width": 580,
    //   "modificationDate": "1543192765000",
    //   "path": "file:///storage/emulated/0/Pictures/知乎/v2-812bcc48fe03024752a79f6e61d333e9.jpg"
    // }
    sendImageMessage(image) {
        if (image && image.path) {
            let options = {
                type: this.chatType,
                appKey: Global.JIMAppKey,
                path: image.path.replace("file://", ""),
                messageSendingOptions: JMessage.messageSendingOptions
            };
            if (this.chatType === "group") {
                options.groupId = this.chatContactId;
            } else {
                options.username = this.chatContactId;
            }
            // 发送图片消息
            JMessage.sendImageMessage(
                options,
                msg => {
                    this.concatMessage(msg);
                    // LogUtil.d("send image msg success: " + JSON.stringify(msg));
                },
                error => {
                    LogUtil.e("send image msg error: " + JSON.stringify(error));
                }
            );
        }
    }

    // 如果页面能滑动，将页面滑动到最底部
    scroll() {
        this.scrollTimeout = setTimeout(() => this.refs.flatList.scrollToEnd(), 1);
    }

    // 合并消息
    concatMessage(newMsg) {
        let msgArr = this.state.messages;
        msgArr.push(newMsg);
        this.setState({messages: msgArr}, () => {
            this.scroll();
        });
        // 发送完消息，还要通知会话列表更新
        CountEmitter.emit("notifyConversationListRefresh");
    }

    updateView = (emoji, more) => {
        this.setState(
            {
                showEmojiView: emoji,
                showMoreView: more
            },
            () => {
                if (emoji || more) {
                    Keyboard.dismiss();
                }
            }
        );
    };

    _keyExtractor = (item, index) => "list-item-" + index;

    shouldShowTime(item) {
        return false
        // 该方法判断当前消息是否需要显示时间
        if (this.chatType === "group") {
            return true;
        }
        let index = item.id;
        if (index == 1) {
            // 第一条消息，显示时间
            return true;
        }
        if (index > 1) {
            let messages = this.state.messages;
            if (!Utils.isEmpty(messages) && messages.length > 0) {
                let preMsg = messages[index - 2];
                let delta = (item.createTime - preMsg.createTime) / 1000;
                if (delta > 3 * 60) {
                    return true;
                }
            }
            return false;
        }
    }

    // 是否是我发出的消息
    isMyMsg(item) {
        return item.sender._id === this.userId;
    }

    renderItem = ({item}) => {
        // console.log(item, item.keys)
        let msgType = item.contentType;
        if (msgType == 0) {
            // 文本消息
            // console.log(item.sender._id)
            if (!this.isMyMsg(item)) {
                return this.renderReceivedTextMsg(item);
            } else {
                return this.renderSendTextMsg(item);
            }
        } else if (msgType == 3) {
            // 图片消息
            if (!this.isMyMsg(item)) {
                return this.renderReceivedImgMsg(item);
            } else {
                return this.renderSendImgMsg(item);
            }
        }
    };

    // 渲染接收的文本消息
    renderReceivedTextMsg(item) {
        let contactAvatar = require("../../images/avatar.png");
        if (this.chatType === "group") {
            // 群聊的头像为某个人的头像
            let thumb = Api.AVATAR_PREFIX + item.sender.avatar;
            console.log(thumb)
            if (thumb) {
                contactAvatar = thumb;
            }
        } else {
            // 单聊的头像
            if (!Utils.isEmpty(this.chatWithAvatar)) {
                contactAvatar = this.chatWithAvatar;
            }
        }
        return (
            <View style={{flexDirection: "column", alignItems: "center"}}>
                {this.shouldShowTime(item) ? (
                    <Text style={listItemStyle.time}>
                        {TimeUtils.formatChatTime(parseInt(item.createTime / 1000))}
                    </Text>
                ) : null}
                <View style={listItemStyle.container}>
                    {/* <Image style={listItemStyle.avatar} source={contactAvatar} /> */}
                    <ImageAdapter width={40} height={40} path={contactAvatar}/>
                    <View style={listItemStyle.msgContainer}>
                        <Text style={listItemStyle.msgText}>
                            {Utils.spliceStr(item.content, MSG_LINE_MAX_COUNT)}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    // 渲染发送出去的文本消息
    renderSendTextMsg(item) {
        let avatar = require("../../images/avatar.png");
        if (!Utils.isEmpty(UserInfoUtil.userInfo.avatar)) {
            avatar = UserInfoUtil.userInfo.avatar;
        }
        // 发送出去的消息
        return (
            <View style={{flexDirection: "column", alignItems: "center"}}>
                {this.shouldShowTime(item) ? (
                    <Text style={listItemStyle.time}>
                        {TimeUtils.formatChatTime(parseInt(item.createTime / 1000))}
                    </Text>
                ) : null}
                <View style={listItemStyle.containerSend}>
                    <View style={listItemStyle.msgContainerSend}>
                        <Text style={listItemStyle.msgText}>
                            {Utils.spliceStr(item.content, MSG_LINE_MAX_COUNT)}
                        </Text>
                    </View>
                    {/* <Image style={listItemStyle.avatar} source={avatar} /> */}
                    <ImageAdapter width={40} height={40} path={avatar}/>
                </View>
            </View>
        );
    }

    // 渲染接收的图片消息
    renderReceivedImgMsg(item) {
        let contactAvatar = require("../../images/avatar.png");
        let hasKeys = false
        if (item.keys.length > 0) {
            hasKeys = true
        }
        // console.log(hasKeys)
        if (this.chatType === "group") {
            // 群聊的头像为某个人的头像
            let thumb = Api.AVATAR_PREFIX + item.sender.avatar;
            if (thumb) {
                contactAvatar = thumb;
            }
        } else {
            // 单聊的头像
            if (!Utils.isEmpty(this.chatWithAvatar)) {
                contactAvatar = this.chatWithAvatar;
            }
        }
        return (
            <View style={{flexDirection: "column", alignItems: "center"}}>
                {this.shouldShowTime(item) ? (
                    <Text style={listItemStyle.time}>
                        {TimeUtils.formatChatTime(parseInt(item.createTime / 1000))}
                    </Text>
                ) : null}
                <View style={listItemStyle.container}>
                    <ImageAdapter width={40} height={40} path={contactAvatar} style={{borderRadius: 20}}/>
                    {/* <Image style={listItemStyle.avatar} source={contactAvatar} /> */}
                    <TouchableOpacity activeOpacity={0.6} onPress={() => this.openPacket(item)}>
                        <View style={{flexDirection: "column"}}>
                            <Text style={styles.nickname}>{item.sender.nickname}</Text>
                            <ImageBackground style={{width: 300, height: 100}}
                                             imageStyle={{marginLeft: -20}}
                                             resizeMode="contain"
                                             source={require('../../imgs/ic_receive_red_nor~iphone.png')}>
                                <View
                                    style={[

                                        {paddingLeft: 0, paddingRight: 0}
                                    ]}
                                >
                                    <View style={styles.redDesc}>
                                        <Text style={styles.redAmount}>{item.amount}
                                            {
                                                item.keys.length ? ` - ${item.keys[0]}` : null
                                            }
                                        </Text>
                                        <Text style={styles.chakan}>查看红包</Text>
                                        <Text style={styles.redType}>扫雷红包</Text>
                                    </View>

                                </View>
                            </ImageBackground>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // 渲染发送的图片消息
    renderSendImgMsg(item) {
        let avatar = require("../../images/avatar.png");
        if (!Utils.isEmpty(UserInfoUtil.userInfo.avatar)) {
            avatar = UserInfoUtil.userInfo.avatar;
        }
        return (
            <View style={{flexDirection: "column", alignItems: "center"}}>
                {this.shouldShowTime(item) ? (
                    <Text style={listItemStyle.time}>
                        {TimeUtils.formatChatTime(parseInt(item.createTime / 1000))}
                    </Text>
                ) : null}
                <View style={listItemStyle.containerSend}>
                    {/* <Image style={listItemStyle.avatar} source={contactAvatar} /> */}
                    <TouchableOpacity activeOpacity={0.6} onPress={() => this.openPacket(item)}>
                        <View style={{flexDirection: "column"}}>
                            {/*<Text style={styles.nickname}>{item.sender.nickname}</Text>*/}
                            <ImageBackground style={{width: 300, height: 100,marginRight: -20}}
                                             imageStyle={{marginRight: 0}}
                                             resizeMode="contain"
                                             source={require('../../imgs/ic_send_red_nor~iphone.png')}>
                                <View
                                    style={[

                                        {paddingLeft: 0, paddingRight: 0}
                                    ]}
                                >
                                    <View style={[styles.redDesc,{marginLeft:90}]}>
                                        <Text style={styles.redAmount}>{item.amount}
                                            {
                                                item.keys.length ? ` - ${item.keys[0]}` : null
                                            }
                                        </Text>
                                        <Text style={styles.chakan}>查看红包</Text>
                                        <Text style={styles.redType}>扫雷红包</Text>
                                    </View>

                                </View>
                            </ImageBackground>
                        </View>
                    </TouchableOpacity>
                    <ImageAdapter width={40} height={40} path={avatar} style={{borderRadius: 20}}/>
                </View>
            </View>
        );
    }

    openPacket(item){
        this.refs.redPacketDialog.showModal(item);
    }
    componentWillUnmount() {
        if (Platform.OS === "android") {
            JMessage.exitConversation();
            BackHandler.removeEventListener("hardwareBackPress", this.backHandler);
        }
        this.scrollTimeout && clearTimeout(this.scrollTimeout);
        CountEmitter.removeListener(
            "notifyChattingRefresh",
            this.notifyChattingRefreshListener
        );
        Global.currentChattingUsername = null;
        Global.currentChattingType = null;
        this.keyboardDidShowListener.remove();
    }
}

const listItemStyle = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        flexDirection: "row",
        padding: 5
    },
    avatar: {
        width: 40,
        height: 40
    },
    msgContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 3,
        paddingLeft: 8,
        paddingRight: 8,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 5
    },
    msgContainerSend: {
        backgroundColor: "#9FE658",
        borderRadius: 3,
        paddingLeft: 8,
        paddingRight: 8,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 5
    },
    msgText: {
        fontSize: 15,
        lineHeight: 24,
        maxWidth: width - 120
    },
    containerSend: {
        flex: 1,
        width: width,
        flexDirection: "row",
        padding: 5,
        justifyContent: "flex-end"
    },
    time: {
        backgroundColor: "#D4D4D4",
        paddingLeft: 6,
        paddingRight: 6,
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: 5,
        color: "#FFFFFF",
        marginTop: 10,
        fontSize: 11
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column"
    },
    content: {
        flex: 1,
        flexDirection: "column",
        alignItems: "flex-start",
        backgroundColor: Global.pageBackgroundColor
    },
    bottomBar: {
        height: 50
    },
    divider: {
        width: width,
        height: 1 / PixelRatio.get(),
        backgroundColor: Global.dividerColor
    },
    redDesc: {
        marginLeft: 80,
        marginBottom: 30
    },
    redAmount: {
        textAlign: "left",
        paddingTop: 15,
        fontSize: 20,
        color: "#FFFFFF",
    },
    chakan: {
        color: "#FFFFFF",
        fontSize: 18
    },
    redType: {
        paddingTop: 12,
        marginLeft: -55,
        textAlign: "left"
    },
    nickname: {
        marginLeft: 20
    }
});
