import React, {Component} from "react";
import Toast from "@remobile/react-native-toast";
import CommonTitleBar from "../views/CommonTitleBar";
import LoadingView from "../views/LoadingView";
import StorageUtil from "../utils/StorageUtil";
import Utils from "../utils/Utils";
import Api from "../api/Api";
import JMessage from "jmessage-react-plugin";
import ListItemDivider from "../views/ListItemDivider";
import {
    Dimensions,
    Image, ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const {width} = Dimensions.get("window");

export default class RedPacketScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayTips: false,
            liked: true,
            showProgress: false
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <CommonTitleBar nav={this.props.navigation} title={"扫雷红包"}/>
                <View>
                    <Text style={styles.headerAmount}>100</Text>
                    <Text style={styles.tips}>红包金额不能小于1.00</Text>
                </View>
                <View style={inviteStyle.container}>
                    <View style={{flexDirection: "row"}}>
                        <View style={inviteStyle.menuContainer}>
                            <Text style={inviteStyle.menuText}>金额</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row',alignItems:"center"}}>
                        <View>
                            <TextInput placeholder={"1.00-2000.00"} style={{textAlign: "right",alignItems:"center",paddingRight:10}}/>
                        </View>
                        <View>
                            <Text style={[inviteStyle.menuText, {}]}>
                                元
                            </Text>
                        </View>
                    </View>
                </View>
                <ListItemDivider/>
                <View style={inviteStyle.container}>
                    <View style={{flexDirection: "row"}}>
                        <View style={inviteStyle.menuContainer}>
                            <Text style={inviteStyle.menuText}>红包个数</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row',alignItems:"center"}}>
                        <View>
                            <TextInput placeholder={"500-200"} textAlign={'center'} style={{textAlign: "right",paddingRight:10}}/>
                        </View>
                        <View>
                            <Text style={[inviteStyle.menuText, {}]}>
                                个
                            </Text>
                        </View>
                    </View>
                </View>
                <Text style={styles.centerTips}>红包发布范围:2.00-20.00</Text>
                <View style={inviteStyle.container}>
                    <View style={{flexDirection: "row"}}>
                        <View style={inviteStyle.menuContainer}>
                            <Text style={inviteStyle.menuText}>雷数</Text>
                        </View>
                    </View>
                    <View style={{justifyContent: "space-between"}}>
                        <View>
                            <TextInput placeholder={"雷数"} style={{textAlign:"right"}}/>
                        </View>
                        <View>
                            <Text style={{}}>{this.state.inviteCode}</Text>
                        </View>
                    </View>
                </View>
                <Text style={styles.centerTips}>雷数范围:0-9</Text>
                <TouchableOpacity activeOpacity={0.6} onPress={() => this.sendRedPacket()}>
                    <View style={styles.sendPacketBtn}>
                        <Text style={{color: "#FFFFFF", fontSize: 16}}>塞入红包</Text>
                    </View>
                    <Text style={styles.bottomTips}>未领取的红包，将于5分钟后发起退款</Text>
                </TouchableOpacity>

            </View>
        );
    }


    register() {
        this.setState({showProgress: true});
        //请求服务器注册接口
        var registerUrl = Api.REGISTER_URL;
        // let formData = new FormData();
        // formData.append("username", username);
        // formData.append("password", password);
        // formData.append("verifyCode",verifyCode)
        // formData.append("inviteCode",inviteCode)

        fetch(registerUrl, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "phone": username,
                "code": verifyCode,
                "registerCode": inviteCode,
                "password": password
            })
        })
            .then(res => res.json())
            .then(json => {
                console.log(json);
                if (!Utils.isEmpty(json)) {
                    if (json.status === 200) {
                        // this.registerToJIM(username, password);
                        //注册成功
                        Toast.showShortCenter("注册成功");
                    } else {
                        this.setState({showProgress: false});
                        Toast.showShortCenter(json.message);
                    }
                } else {
                    this.setState({showProgress: false});
                }
            })
            .catch(e => {
                Toast.showShortCenter("网络请求出错" + e);
                this.setState({showProgress: false});
            });
    }

    // 注册极光IM
    registerToJIM(username, password) {
        JMessage.register(
            {
                username: username,
                password: password
            },
            () => {
                Toast.showShortCenter("注册成功");
                StorageUtil.set("username", {username: username});
                // 关闭当前页面
                this.props.navigation.goBack();
                // 跳转到登录界面
                this.props.navigation.navigate("Login");
            },
            e => {
                Toast.showShortCenter("注册失败：" + e);
            }
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fcfcfc",
        flexDirection: "column"
    },
    content: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center"
    },
    pwdView: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        marginTop: 50
    },
    textInput: {
        flex: 1
    },
    pwdContainer: {
        flexDirection: "row",
        height: 50,
        alignItems: "center",
        marginLeft: 40,
        marginRight: 40
    },
    pwdDivider: {
        width: width,
        height: 1,
        backgroundColor: "#e5e6e5"
    },
    loginBtnBg: {
        width: width - 40,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    loginBtn: {
        height: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    verifyBtn: {
        backgroundColor: "#f08532",
        borderRadius: 10
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    headerAmount: {
        // flex:1,
        width: width,
        paddingTop: 20,
        paddingBottom: 20,
        fontSize: 32,
        justifyContent: "center",
        textAlign: "center"
    },
    tips: {
        width: width,
        fontSize: 16,
        paddingBottom: 20,
        color: "#FF3C3D",
        justifyContent: "center",
        textAlign: "center"
    },
    sendPacketBtn: {
        width: width - 40,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 50,
        height: 50,
        borderRadius: 3,
        backgroundColor: "#dc6262",
        justifyContent: "center",
        alignItems: "center"
    },
    bottomTips: {
        width: width,
        fontSize: 12,
        paddingTop: 5,
        paddingBottom: 20,
        // color: "#FF3C3D",
        justifyContent: "center",
        textAlign: "center"
    },
    centerTips: {
        paddingLeft: 30,
        paddingTop: 5
    }
});

const inviteStyle = StyleSheet.create({
    container: {
        justifyContent: "space-between",
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
        alignItems:"center"
    },
    inviteButton: {
        color: "#f08532",
        borderStyle: "solid",
        textAlign: "center",
        borderWidth: 1,
        borderColor: "#f08532",
        borderRadius: 5,
        backgroundColor: "#fff",
    }
});

