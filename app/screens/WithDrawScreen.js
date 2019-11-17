import React, { Component } from "react";
import Toast from "@remobile/react-native-toast";
import CommonTitleBar from "../views/CommonTitleBar";
import LoadingView from "../views/LoadingView";
import StorageUtil from "../utils/StorageUtil";
import Utils from "../utils/Utils";
import Api from "../api/Api";
import JMessage from "jmessage-react-plugin";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ImageBackground
} from "react-native";
import UserInfoUtil from "../utils/UserInfoUtil";

const { width } = Dimensions.get("window");

export default class WithDrawScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardNo: "",
            name: "",
            bank: "",
            phone: "",
            amount: "",
            liked:true,
            showProgress: false
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <CommonTitleBar nav={this.props.navigation} title={"提现中心"} />
                <View style={styles.content}>
                    {this.state.showProgress ? (
                        <LoadingView
                            cancel={() => this.setState({ showProgress: false })}
                        />
                    ) : null}
                    {/*<Image*/}
                    {/*  source={require("../../images/ic_launcher.png")}*/}
                    {/*  style={{ width: 100, height: 100, marginTop: 100 }}*/}
                    {/*/>*/}
                    <View style={styles.pwdView}>
                        <View style={styles.pwdContainer}>
                            <Image source={require("../../imgs/icon_cz_record~iphone.png")}
                                   style={{width:25}}
                                   resizeMode="contain"
                            />
                            <TextInput
                                placeholder = "请输入银行卡号"
                                style={styles.textInput}
                                onChangeText={text => {
                                    this.setState({ cardNo: text });
                                }}
                                style={styles.textInput}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                        <View style={styles.pwdDivider} />

                        <View style={styles.pwdContainer}>
                            <Image source={require("../../imgs/ic_me_nor~iphone.png")}
                                   style={{width:25}}
                                   resizeMode="contain"
                            />
                            <TextInput
                                placeholder = "请输入姓名"
                                style={styles.textInput}
                                onChangeText={text => {
                                    this.setState({ name: text });
                                }}
                                style={styles.textInput}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                        <View style={styles.pwdDivider} />

                        <View style={styles.pwdContainer}>
                            <Image source={require("../../imgs/icon_item_xjwj~iphone.png")}
                                   style={{width:25}}
                                   resizeMode="contain"
                            />
                            <TextInput
                                placeholder = "请输入开户行"
                                style={styles.textInput}
                                onChangeText={text => {
                                    this.setState({ bank: text });
                                }}
                                style={styles.textInput}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                        <View style={styles.pwdDivider} />

                        <View style={styles.pwdContainer}>
                            <Image source={require("../../imgs/ic_phone~iphone.png")}
                                   style={{width:25}}
                                   resizeMode="contain"
                            />
                            <TextInput
                                placeholder = "请输入手机号码"
                                style={styles.textInput}
                                onChangeText={text => {
                                    this.setState({ phone: text });
                                }}
                                style={styles.textInput}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                        <View style={styles.pwdDivider} />
                        <View style={styles.pwdContainer}>
                            <Text style={{color:"#000000",fontsize:16}}>余额1000.00可提现</Text>
                        </View>

                        <View style={styles.pwdContainer}>
                            <Image source={require("../../imgs/ic_tab_money~iphone.png")}
                                   style={{width:25}}
                                   resizeMode="contain"
                            />
                            <TextInput
                                placeholder = "请输入提现金额"
                                style={styles.textInput}
                                onChangeText={text => {
                                    this.setState({ amount: text });
                                }}
                                style={styles.textInput}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                        <View style={styles.pwdDivider} />

                        <TouchableOpacity
                            activeOpacity={0.6}
                            onPress={() => this.withdraw()}
                        >
                            <ImageBackground style={styles.loginBtnBg}
                                             imageStyle={{ borderRadius: 15}}
                                             source={require('../../imgs/bg_me~iphone.png')}>
                                <View style={styles.loginBtn}>
                                    <Text style={{ color: "#FFFFFF", fontSize: 16 }}>确认提现</Text>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        );
    }


    withdraw(){
        let cardNo = this.state.cardNo;
        let name = this.state.name;
        let bank = this.state.bank;
        let phone = this.state.phone;
        let amount = this.state.amount;
        if(
            Utils.isEmpty(cardNo) ||
            Utils.isEmpty(name) ||
            Utils.isEmpty(bank) ||
            Utils.isEmpty(phone)
        ) {
            Toast.showShortCenter("提现信息不能为空");
            return;
        }
        if ( amount > UserInfoUtil.userInfo.balance) {
            Toast.showShortCenter("提款金额超出余额");
            return;
        }
        this.setState({ showProgress: true });
        //请求服务器注册接口
        let url = Api.WITHDRAW;
        let token = UserInfoUtil.userInfo.token
        // let formData = new FormData();
        // formData.append("username", username);
        // formData.append("password", password);
        // formData.append("verifyCode",verifyCode)
        // formData.append("inviteCode",inviteCode)

        fetch(url, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                "cardNo": cardNo,
                "name": name,
                "bank": bank,
                "phone":phone,
                "amount":amount

            })
        })
            .then(res => res.json())
            .then(json => {
                console.log(json);
                if (!Utils.isEmpty(json)) {
                    if (json.status === 200) {
                        Toast.showShortCenter("提现成功等待审核后");
                    } else {
                        this.setState({ showProgress: false });
                        Toast.showShortCenter(json.message);
                    }
                } else {
                    this.setState({ showProgress: false });
                }
            })
            .catch(e => {
                Toast.showShortCenter("网络请求出错" + e);
                this.setState({ showProgress: false });
            });
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    verifyBtn:{
        backgroundColor:"#f08532",
        borderRadius:10
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    }
});
