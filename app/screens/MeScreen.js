import React, {Component} from "react";
import TitleBar from "../views/TitleBar";
import ListItem from "../views/ListItem";
import Global from "../utils/Global";
import Utils from "../utils/Utils";
import UserInfoUtil from "../utils/UserInfoUtil";
import CountEmitter from "../event/CountEmitter";
import TabConfig from "../configs/TabNavConfigs";
import ListItemDivider from "../views/ListItemDivider";
import ImageAdapter from "../views/ImageAdapter";
import Toast from "@remobile/react-native-toast";
import { NavigationActions, StackActions } from "react-navigation"
import StorageUtil from "../utils/StorageUtil"
import Api from "../api/Api"

import {
    Dimensions,
    Image,
    PixelRatio,
    ScrollView,
    StyleSheet,
    Text,
    Clipboard,
    TouchableHighlight,
    View, TouchableOpacity
} from "react-native";

const {width} = Dimensions.get("window");

export default class MeScreen extends Component {
    static navigationOptions = TabConfig.TAB_MINE_CONF;

    constructor(props) {
        super(props);
        this.state = {
            userInfo: UserInfoUtil.userInfo,
            avatar: UserInfoUtil.getUserAvatar(),
            inviteCode : UserInfoUtil.userInfo.inviteCode,
            balance:0.00
        };
    }

    refreshUserInfo() {
        console.log(UserInfoUtil.userInfo)
        this.setState({
            userInfo: UserInfoUtil.userInfo
        });
    }

    componentWillMount() {
        //查询余额
        let url = Api.USER_BALANCE
        fetch(url,{
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + UserInfoUtil.userInfo.token
            },
            method: 'GET',
        })
        .then(res => res.json())
        .then(json => {
            this.setState({balance:json.data},function(){
                console.log(this.state)
            })
            
        })
        CountEmitter.addListener(
            "notifyUserInfoUpdated",
            this.notifyUserInfoUpdatedListener
        );
    }

    componentWillUnmount() {
        CountEmitter.removeListener(
            "notifyUserInfoUpdated",
            this.notifyUserInfoUpdatedListener
        );
    }

    notifyUserInfoUpdatedListener = () => {
        this.refreshUserInfo();
    };

    async _setClipboardContent(){
        Clipboard.setString(this.state.inviteCode);
        Toast.showShortCenter("复制成功");
    }

    render() {
        return (
            <View style={styles.container}>
                <TitleBar nav={this.props.navigation}/>
                <View style={styles.divider}/>
                <ScrollView style={styles.content}>
                    <View style={{width: width, height: 20}}/>
                    {/*<TouchableHighlight*/}
                    {/*    underlayColor={Global.touchableHighlightColor}*/}
                    {/*    onPress={() => {*/}
                    {/*        this.turnOnPage("PersonInfo");*/}
                    {/*    }}*/}
                    {/*>*/}
                        <View style={styles.meInfoContainer}>
                            <ImageAdapter
                                width={60}
                                height={60}
                                path={UserInfoUtil.userInfo.avatar}
                            />
                            <View style={styles.meInfoTextContainer}>
                                <Text style={styles.meInfoNickName}>
                                    {this.state.userInfo.username}
                                </Text>
                                <Text style={styles.meInfoWeChatId}>
                                    {"昵称：" + this.state.userInfo.nick}
                                </Text>
                            </View>
                            {/*<Image*/}
                            {/*    style={styles.meInfoQRCode}*/}
                            {/*    source={require("../../images/ic_qr_code.png")}*/}
                            {/*/>*/}
                            <View>
                                <Text>   </Text>
                                <Text>金额: ¥ {this.state.balance} 元</Text>
                            </View>
                        </View>
                    {/*</TouchableHighlight>*/}
                    <View/>
                    <View style={{width: width, height: 20}}/>
                    <View>
                        <View style={inviteStyle.container}>
                            <View style={{flexDirection:"row"}}>
                            <Image style={inviteStyle.icon} source={require("../../imgs/ic_invite~iphone.png")}/>
                            <View style={inviteStyle.menuContainer}>
                                <Text style={inviteStyle.menuText}>邀请码</Text>
                            </View>
                            </View>
                            <TouchableOpacity activeOpacity={0.6} onPress={() => this._setClipboardContent()}>
                                <View style={{flexDirection:"row"}}>
                                    <Text  style={{marginRight:10,alignContent:"center",paddingTop:5}}>{this.state.inviteCode}</Text>
                                    <Text style={[inviteStyle.inviteButton,{}]}>
                                        复制
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{width: width, height: 20}}/>
                    <ListItem
                        icon={require("../../imgs/ic_recharge~iphone.png")}
                        text={"充值中心"}
                    />
                    <View style={{width: width, height: 20}}/>
                    <ListItem
                        icon={require("../../imgs/icon_bill_records~iphone.png")}
                        text={"账单记录"}
                    />
                    <ListItemDivider/>
                    <ListItem
                        icon={require("../../imgs/icon_help_center~iphone.png")}
                        text={"帮助中心"}
                    />
                    <View style={{width: width, height: 20}}/>
                    <ListItem
                        icon={require("../../imgs/ic_withdraw~iphone.png")}
                        text={"提现中心"}
                    />
                    <ListItemDivider/>
                    <ListItem
                        icon={require("../../imgs/rengong~iphone.png")}
                        text={"在线客服"}
                    />
                    <View style={{width: width, height: 20}}/>
                    <ListItem
                        icon={require("../../imgs/ic_app_version~iphone.png")}
                        text={"版本"}
                        showDivider={true}
                    />
                    <ListItemDivider/>
                    <ListItem
                        icon={require("../../imgs/ic_setting~iphone.png")}
                        text={"设置"}
                        showDivider={true}
                        handleClick={() => {
                            this.turnOnPage("Moment");
                        }}
                    />
                    <ListItemDivider/>
                    <View style={{width: width, height: 20}}/>
                    <ListItem
                        icon={require("../../imgs/ic_exit~iphone.png")}
                        text={"注销"}
                        showDivider={true}
                        handleClick={() => {
                            this.logout();
                        }}
                    />
                    <ListItemDivider/>
                </ScrollView>
                <View style={styles.divider}/>
            </View>
        );
    }

    turnOnPage(pageName, params) {
        if (Utils.isEmpty(params)) {
            this.props.navigation.navigate(pageName);
        } else {
            this.props.navigation.navigate(pageName, params);
        }
    }

    logout() {
        StorageUtil.set("hasLogin", { hasLogin: false });
        Toast.showShortCenter("注销成功");
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: "Splash" })]
        });
        this.props.navigation.dispatch(resetAction);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    divider: {
        width: width,
        height: 1 / PixelRatio.get(),
        backgroundColor: "#D3D3D3"
    },
    content: {
        flex: 1,
        width: width,
        flexDirection: "column",
        backgroundColor: Global.pageBackgroundColor
    },
    meInfoContainer: {
        width: width,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: "#FFFFFF",
        paddingTop: 10,
        paddingBottom: 10
    },
    meInfoAvatar: {
        width: 60,
        height: 60
    },
    meInfoTextContainer: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15
    },
    meInfoNickName: {
        color: "#000000",
        fontSize: 16
    },
    meInfoWeChatId: {
        color: "#999999",
        fontSize: 14,
        marginTop: 5
    },
    meInfoQRCode: {
        width: 25,
        height: 25
    }
});

const inviteStyle = StyleSheet.create({
    container: {
        justifyContent:"space-between",
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
    },
    icon: {
        width: 30,
        height: 30,
    },
    menuContainer: {
        paddingLeft: 15,
        paddingRight: 15,
    },
    menuText: {
        color: '#000000',
        fontSize: 16,
    },
    inviteButton: {
        paddingLeft:5,
        paddingRight:5,
        paddingTop:5,
        paddingBottom:5,
        color:"#f08532",
        borderStyle:"solid",
        textAlign:"center",
        borderWidth:1,
        borderColor:"#f08532",
        borderRadius: 5,
        backgroundColor: "#fff",
    }
});
