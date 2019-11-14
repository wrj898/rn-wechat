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

const { width } = Dimensions.get("window");

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      verifyCode: "",
      password: "",
      confirmPwd: "",
      inviteCode: "",
      count:60,
      liked:true,
      showProgress: false
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <CommonTitleBar nav={this.props.navigation} title={"注册"} />
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
              <Image source={require("../../imgs/ic_phone~iphone.png")}
                     style={{width:25}}
                     resizeMode="contain"
              />
              <TextInput
                  placeholder = "请输入手机号"
                  style={styles.textInput}
                  onChangeText={text => {
                  this.setState({ username: text });
                }}
                style={styles.textInput}
                underlineColorAndroid="transparent"
              />
              <TouchableOpacity activeOpacity={0.6}
                                onPress={() => this.getVerifyCode()}
              >
                <View style={styles.verifyBtn}>

                  <Text style={{color:"#ffffff",padding:5}}>
                    {
                      this.state.liked
                          ? '获取验证码'
                          : `${this.state.count} 秒后重发`
                    }
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.pwdDivider} />

            <View style={styles.pwdContainer}>
              <Image source={require("../../imgs/ic_auth~iphone.png")}
                     style={{width:25}}
                     resizeMode="contain"
              />
              <TextInput
                  placeholder = "请输入验证码"
                  style={styles.textInput}
                  onChangeText={text => {
                    this.setState({ verifyCode: text });
                  }}
                  style={styles.textInput}
                  underlineColorAndroid="transparent"
              />
            </View>
            <View style={styles.pwdDivider} />

            <View style={styles.pwdContainer}>
              <Image source={require("../../imgs/ic_pwd~iphone.png")}
                     style={{width:25}}
                     resizeMode="contain"
              />
              <TextInput
                  placeholder = "请输入密码"
                  style={styles.textInput}
                  secureTextEntry={true}
                  onChangeText={text => {
                    this.setState({ password: text });
                  }}
                  style={styles.textInput}
                  underlineColorAndroid="transparent"
              />
            </View>
            <View style={styles.pwdDivider} />

            <View style={styles.pwdContainer}>
              <Image source={require("../../imgs/ic_pwd~iphone.png")}
                     style={{width:25}}
                     resizeMode="contain"
              />
              <TextInput
                  placeholder = "确认密码"
                  style={styles.textInput}
                  secureTextEntry={true}
                  onChangeText={text => {
                    this.setState({ confirmPwd: text });
                  }}
                  style={styles.textInput}
                  underlineColorAndroid="transparent"
              />
            </View>
            <View style={styles.pwdDivider} />

            <View style={styles.pwdContainer}>
              <Image source={require("../../imgs/ic_recommend~iphone.png")}
                     style={{width:25}}
                     resizeMode="contain"
              />
              <TextInput
                  placeholder = "邀请码"
                  style={styles.textInput}
                  onChangeText={text => {
                    this.setState({ inviteCode: text });
                  }}
                  style={styles.textInput}
                  underlineColorAndroid="transparent"
              />
            </View>
            <View style={styles.pwdDivider} />


            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.register()}
            >
            <ImageBackground style={styles.loginBtnBg}
                             imageStyle={{ borderRadius: 15}}
                             source={require('../../imgs/bg_me~iphone.png')}>
              <View style={styles.loginBtn}>
                <Text style={{ color: "#FFFFFF", fontSize: 16 }}>注册</Text>
              </View>
            </ImageBackground>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    );
  }

  isContainChinese(str) {
    var reg = /[\u4e00-\u9fa5]/g;
    if (reg.test(str)) {
      return true;
    }
    return false;
  }

  getVerifyCode() {
    if (this.state.username === '') {
      Toast.showShortCenter("请先输入手机号");
      return
    } else if (!(/^1[34578]\d{9}$/.test(this.state.username))) {
      Toast.showShortCenter("手机号格式不正确")
      return
    } else {
      // this.setState({
      //   noGetMessageDisplay: 'block'
      // })
      const {liked} = this.state;
      if (!liked) {
        return;
      }
      console.log("点击获取验证码")
      fetch(Api.VERIFY_CODE,{
        method: "POST",
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          "phone":this.state.username
        })
      })
        .then(res => res.json())
        .then(json => {
            if(!Utils.isEmpty(json)){
                if(json.status == 200){

                }else{
                  this.setState({ showProgress: false });
                  Toast.showShortCenter("获取验证码失败");
                }
            }else{
              this.setState({showProgress:false})
            }
        })
      this.countDown();

    }
  }


  countDown() {
    const {count} = this.state;
    if (count === 1) {
      this.setState({
        count: 60,
        liked: true,
      });
    } else {
      this.setState({
        count: count - 1,
        liked: false,
      });
      setTimeout(this.countDown.bind(this), 1000);
    }
  }

  register(){
    var username = this.state.username;
    var password = this.state.password;
    var confirmPwd = this.state.confirmPwd;
    var verifyCode = this.state.verifyCode;
    var inviteCode = this.state.inviteCode;
    if (Utils.isEmpty(verifyCode)){
      Toast.showShortCenter("手机验证码不能为空");
    }
    if (Utils.isEmpty(inviteCode)){
      Toast.showShortCenter("邀请码能为空");
    }
    if (
      Utils.isEmpty(username) ||
      Utils.isEmpty(password) ||
      Utils.isEmpty(confirmPwd)
    ) {
      Toast.showShortCenter("手机号或密码不能为空！");
      return;
    }
    if (this.isContainChinese(username)) {
      Toast.showShortCenter("用户名不能包含中文！");
      return;
    }
    if (username.length > 15 || username.length < 4) {
      Toast.showShortCenter("用户名长度为[4, 15]！");
      return;
    }
    if (password.length < 6) {
      Toast.showShortCenter("密码至少需要6个字符！");
      return;
    }
    if (password !== confirmPwd) {
      Toast.showShortCenter("两次输入的密码不一致！");
      return;
    }
    this.setState({ showProgress: true });
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
        "password":password
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

  // 注册极光IM
  registerToJIM(username, password) {
    JMessage.register(
      {
        username: username,
        password: password
      },
      () => {
        Toast.showShortCenter("注册成功");
        StorageUtil.set("username", { username: username });
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
