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

    View
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
            openedAmount:0.00,
            bestIndex: -1,
            balance: 0.00
        };
        this.packet = this.props.navigation.state.params.packet
        console.log(this.packet, "detail construct")
    }

    calculateOpenedAmount(packet){
        let i
        let tmpAmount = 0
        let tmpIndex = -1
        let openedAmount = 0.00
        let list = packet.data.list
        let _packet = packet.data.packet

        for( i = 0; i < list.length; i++){
            openedAmount = openedAmount + list[i].amount
            if(_packet.count == list.length){
               if(i == 0){
                   tmpIndex = i
                   tmpAmount = list[i].amount
               }else{
                   if(list[i].amount> tmpAmount){
                       tmpAmount = list[i].amount
                       tmpIndex = i
                   }
               }
            }
        }
        this.setState({openedAmount:openedAmount,bestIndex:tmpIndex})
        // return tmpArr
       // console.log("caculate best")
    }

    refreshUserInfo() {
        console.log(UserInfoUtil.userInfo)
        this.setState({
            userInfo: UserInfoUtil.userInfo
        });
    }

    componentWillMount() {
        this.calculateOpenedAmount(this.packet)
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
        let senderAvatar = "../../images/avatar.png"
        if (!Utils.isEmpty(this.packet.data.packet.sender.avatar)) {
            senderAvatar = Api.AVATAR_PREFIX + this.packet.data.packet.sender.avatar
        }
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
                            path={senderAvatar}
                        />
                        <View style={styles.meInfoTextContainer}>
                            <Text style={styles.meInfoWeChatId}>
                                {this.packet.data.packet.sender.nickname}
                            </Text>
                        </View>
                        <View>
                            <Text>{this.packet.data.packet.amount}{
                                this.packet.data.packet.keys.length ? ` - ${this.packet.data.packet.keys[0]}` : null
                            }</Text>
                        </View>
                    </View>
                    <View style={{
                        width: width,
                        backgroundColor: "#FFFFFF",
                        fontSize: 18,
                        paddingLeft: 10,
                        paddingTop: 5,
                        paddingBottom: 10
                    }}>
                        <Text>已领取{this.packet.data.list.length}/{this.packet.data.packet.count}个,共{this.state.openedAmount.toFixed(2)}/{this.packet.data.packet.amount.toFixed(2)}</Text>
                    </View>
                    {this.packet.data.list.map((value, index) => {
                        let avatar = ""
                        let nickName = ""
                        if(!Utils.isEmpty(value.user.avatar) && !Utils.isEmpty(value.user.nickname)){
                            avatar = Api.AVATAR_PREFIX + value.user.avatar
                            nickName = value.user.nickname
                        }else{
                            avatar = Api.AVATAR_PREFIX + "jiesuan.png"
                            nickName = "免死"
                        }
                        //最佳
                        let best = false
                        if(this.state.bestIndex > -1 && index == this.state.bestIndex){
                            best = true
                        }
                        return (<PacketResultItem
                                key={index}
                                avatar={avatar}
                                nickname={nickName}
                                hit={value.isHit}
                                amount={value.amount}
                                best={best}
                                date={value.createdAt}
                            />
                        )
                    })}

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

