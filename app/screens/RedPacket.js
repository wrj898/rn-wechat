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
import UserInfoUtil from "../utils/UserInfoUtil";

const {width} = Dimensions.get("window");

export default class RedPacketScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayTips: false,
            liked: true,
            amount: 0,
            roomId: "",
            roomType: 0,
            packetCount: 0,
            keys: [],
            showProgress: false,
            packetLimitEditable: false,
        };
        this.groupId = this.props.navigation.state.params.groupId;
        this.roomType = this.props.navigation.state.params.roomType;
        this.packetLimit = this.props.navigation.state.params.packetLimit;
        this.packetMax = this.props.navigation.state.params.packetMax;
        this.packetMin = this.props.navigation.state.params.packetMin;

    }


    checkAmount(text) {
        this.setState({amount: Number(text)})
        console.log(this.state.amount,"发包金额")
        if ((text < this.packetMin || text > this.packetMax) && text > 0) {
            this.setState({displayTips: true})
        } else {
            this.setState({displayTips: false})
        }
    }

    checkPackets(text) {

    }

    componentWillMount() {
        if (this.roomType === 3) {
            this.setState({packetCount:this.packetLimit})
        }
    }

    setKeys(text) {

        let a = this.state.keys
        a[0] = Number(text)
        this.setState({keys: a})

    }


    render() {
        return (
            <View style={styles.container}>
                <CommonTitleBar nav={this.props.navigation} title={"扫雷红包"}/>
                {this.state.showProgress ? (
                    <LoadingView cancel={() => this.setState({showProgress: false})}/>
                ) : null}
                <View>
                    <Text style={styles.headerAmount}>{this.state.amount}</Text>
                    {this.state.displayTips &&
                    <Text style={styles.tips}>红包金额范围为{this.packetMin.toString()}-{this.packetMax.toString()}</Text>
                    }
                </View>
                <View style={inviteStyle.container}>
                    <View style={{flexDirection: "row", flex: 2}}>
                        <View style={inviteStyle.menuContainer}>
                            <Text style={inviteStyle.menuText}>金额</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: "center", flex: 8}}>
                        <View style={{flex: 32}}>
                            <TextInput placeholder={this.packetMin.toFixed(2).toString() + `-` +this.packetMax.toFixed(2).toString()}
                                       style={{textAlign: "right", alignItems: "center", paddingRight: 10}}
                                       onChangeText={(text) => {
                                           this.checkAmount(text)
                                       }}
                            />
                        </View>
                        <View style={{flex: 2}}>
                            <Text style={[inviteStyle.menuText, {}]}>
                                元
                            </Text>
                        </View>
                    </View>
                </View>
                <ListItemDivider/>
                <View style={inviteStyle.container}>
                    <View style={{flexDirection: "row", flex: 4}}>
                        <View style={inviteStyle.menuContainer}>
                            <Text style={inviteStyle.menuText}>红包个数</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: "center", flex: 6}}>
                        <View style={{flex: 24}}>
                            <TextInput placeholder={"500-200"} style={{textAlign: "right", paddingRight: 10}}
                                       onChangeText={(text) => {
                                           console.log(text)
                                           this.setState({packetCount: Number(text)})
                                       }}
                                       editable={this.state.packetLimitEditable}
                                       value={this.state.packetLimitEditable ? null : this.packetLimit.toString()}
                            />
                        </View>
                        <View style={{flex: 2}}>
                            <Text style={[inviteStyle.menuText, {}]}>
                                个
                            </Text>
                        </View>
                    </View>
                </View>
                <Text style={styles.centerTips}>红包发布范围:2.00-20.00</Text>
                <View style={inviteStyle.container}>
                    <View style={{flexDirection: "row", flex: 2}}>
                        <View style={inviteStyle.menuContainer}>
                            <Text style={inviteStyle.menuText}>雷数</Text>
                        </View>
                    </View>
                    <View style={{justifyContent: "space-between", flex: 8}}>
                        <View>
                            <TextInput placeholder={"雷数"} style={{textAlign: "right"}}
                                       onChangeText={(text) => {
                                           this.setKeys(text)
                                       }}
                            />
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


    sendRedPacket() {
        this.setState({showProgress: true});
        //请求服务器注册接口
        let url = Api.ROOMS + this.groupId + "/packet";

        fetch(url, {
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + UserInfoUtil.userInfo.token
            },
            body: JSON.stringify({
                "amount": this.state.amount,
                "count": this.state.packetCount,
                "keys": this.state.keys
            })
        })
            .then(res => res.json())
            .then(json => {
                console.log(json,"send packet result");
                if (!Utils.isEmpty(json)) {
                    if (json.status === 200) {
                        this.setState({showProgress: false});
                        Toast.showShortCenter("发包成功");
                        this.props.navigation.goBack()
                    } else {
                        this.setState({showProgress: false});
                        Toast.showShortCenter(json.message);
                    }
                } else {
                    this.setState({showProgress: false});
                }
            })
            // .catch(e => {
            //     Toast.showShortCenter("网络请求出错" + e);
            //     this.setState({showProgress: false});
            // });
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
        alignItems: "center"
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

