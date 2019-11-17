import React, { Component } from "react";
import Global from "../utils/Global";
import Utils from "../utils/Utils";
import {
  Button,
  Dimensions,
  Image,
  PixelRatio,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ImageBackground
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
const { width, height } = Dimensions.get("window");

const X_WIDTH = 375;
const X_HEIGHT = 812;

export default class CommonTitleBar extends Component {
  constructor(props) {
    super(props);
  }

  isIphoneX() {
    return (
      Platform.OS === "ios" &&
      ((height === X_HEIGHT && width === X_WIDTH) ||
        (height === X_WIDTH && width === X_HEIGHT))
    );
  }

  renderAndroid() {
    return (
      <ImageBackground style={{ width:width,height:50}}
                       source={require('../../imgs/bg_me~iphone.png')}>
        <View style={styles.container}>
          <StatusBar backgroundColor="#393A3E" barStyle="light-content" />
          <View style={styles.content}>
            <TouchableOpacity activeOpacity={0.5} onPress={this.handleBackClick}>
              <Image
                source={require("../../images/ic_back.png")}
                style={styles.backBtn}
              />
            </TouchableOpacity>
            <View style={styles.btnDivider} />
            <View style={styles.titleContainer}>
              <Text style={[styles.title,{textAlign:"center",marginLeft: 120,fontWeight:"bold"}]}>{this.props.title}</Text>
              {Utils.isEmpty(this.props.rightIcon) ? null : (
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => this.handleRightClick()}
                >
                  <Image style={styles.img} source={this.props.rightIcon} />
                </TouchableOpacity>
              )}
              {Utils.isEmpty(this.props.rightBtnText) ? null : (
                  <TouchableOpacity
                      activeOpacity={0.6}
                      onPress={() => this.props.handleRightClick()()}
                  >
                   <Text style={{marginLeft: 110,color:"#ffffff"}}>{this.props.rightBtnText}</Text>

                  </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }

  renderIOS() {
    let h = 20;
    if (this.isIphoneX()) {
      h = 35;
    }
    return (
      <View style={styles.container}>
        <View
          style={{ height: h, backgroundColor: Global.titleBackgroundColor }}
        />
        <View style={styles.content}>
          <TouchableOpacity activeOpacity={0.5} onPress={this.handleBackClick}>
            <Image
              source={require("../../images/ic_back.png")}
              style={styles.backBtn}
            />
          </TouchableOpacity>
          <View style={styles.btnDivider} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{this.props.title}</Text>
            {Utils.isEmpty(this.props.rightIcon) ? null : (
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => this.handleRightClick()}
              >
                <Image style={styles.img} source={this.props.rightIcon} />
              </TouchableOpacity>
            )}
            {Utils.isEmpty(this.props.rightBtnText) ? null : (
              <Button
                onPress={() => this.props.handleRightBtnClick()}
                title={this.props.rightBtnText}
                // color="#19AD17"
              />
            )}
          </View>
        </View>
      </View>
    );
  }

  render() {
    if (Platform.OS === "ios") {
      return this.renderIOS();
    }
    return this.renderAndroid();
  }

  handleRightClick() {
    if (!Utils.isEmpty(this.props.handleRightClick)) {
      this.props.handleRightClick();
    }
  }

  handleBackClick = () => {
    this.props.nav.goBack();
  };
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column"
  },
  content: {
    width: width,
    height: 50,
    justifyContent:"flex-start",
    // backgroundColor: Global.titleBackgroundColor,
    flexDirection: "row",
    alignItems: "center"
  },
  backBtn: {
    marginLeft: 8,
    marginRight: 8,
    width: 30,
    height: 30
  },
  btnDivider: {
    width: 1 / PixelRatio.get(),
    height: 30,
    marginTop: 10,
    marginBottom: 10,
    // backgroundColor: "#888888"
  },
  titleContainer: {
    justifyContent:"flex-start",
    // flex: 1,
    flexDirection: "row",
    // alignItems: "center",
    textAlign: "center",
    paddingLeft: 10,
    paddingRight: 10
  },
  title: {
    color: "#FFFFFF",
    fontSize: 20
    // flex: 1,
    // alignContent:"center"
  },
  img: {
    width: 30,
    height: 30,
    marginRight: 5
  }
});
