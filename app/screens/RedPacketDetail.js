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
import {NavigationActions, StackActions} from "react-navigation"
import StorageUtil from "../utils/StorageUtil"
import Api from "../api/Api"

import {
    Dimensions,
    Image,
    PixelRatio,
    ScrollView,
    StyleSheet,
    Text,
    ImageBackground,
    Clipboard,
    TouchableHighlight,
    View, TouchableOpacity
} from "react-native";
import CommonTitleBar from "../views/CommonTitleBar";
import PacketResultItem from "../views/PacketResultItem";

const {width} = Dimensions.get("window");

export default class RedPacketDetailScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userInfo: UserInfoUtil.userInfo,
            avatar: UserInfoUtil.getUserAvatar(),
            // inviteCode : UserInfoUtil.userInfo.inviteCode,
            balance: 0.00
        };
        this.packet = this.props.navigation.state.params.packet
    }

    refreshUserInfo() {
        console.log(UserInfoUtil.userInfo)
        this.setState({
            userInfo: UserInfoUtil.userInfo
        });
    }

    componentWillMount() {
        console.log(this.packet)
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

    render() {
        return (
            <View style={styles.container}>
                <CommonTitleBar
                    title={"红包详情"}
                    nav={this.props.navigation}
                    rightBtnText="账单详情"
                    handleRightClick={() =>
                        this.props.navigation.navigate("PublishMoment")
                    }
                />

                <ScrollView style={styles.content}>
                    <Image resizeMode="contain" style={{width: width, position: 'absolute', top: -36, left: 0}}
                           source={require("../../imgs/ic_red_title~iphone.png")}/>
                    <View style={styles.meInfoContainer}>
                        <ImageAdapter
                            width={60}
                            height={60}
                            path={require("../../images/avatar.png")}
                        />
                        <View style={styles.meInfoTextContainer}>
                            <Text style={styles.meInfoWeChatId}>
                                帅气的青蛙
                            </Text>
                        </View>
                        <View>
                            <Text>5.00-[8]</Text>
                        </View>
                    </View>
                    <View style={{width:width,backgroundColor:"#FFFFFF",fontSize:18,paddingLeft:10,paddingTop:5,paddingBottom:10}}>
                        <Text>已领取7/7个,共5.00/5.00金币</Text>
                    </View>
                    {this.packet.data.list.map((value,index) => {
                       let avatar = Api.AVATAR_PREFIX + value.user.avatar
                        return( <PacketResultItem
                            avatar={require("../../images/avatar.png")}
                            nickname={value.user.nickname}
                            hit={true}
                            best={true}
                            date={"02:15:53"}
                        />
                        )})}

                    <ListItemDivider/>
                </ScrollView>
                <View style={styles.divider}/>
            </View>
        );
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
        flexDirection: "column",
        alignItems: "center",
        paddingLeft: 15,
        paddingRight: 15,
        // backgroundColor: "#FFFFFF",
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
        color: "#000000",
        fontSize: 20,
        marginTop: 5
    },
    meInfoQRCode: {
        width: 25,
        height: 25
    }
});

