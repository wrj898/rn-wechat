import React, { Component } from "react";
import CountEmitter from "../event/CountEmitter";
import { Image, StyleSheet, View, Text } from "react-native";

// 自定义tab，为了能在icon旁显示红点
class CustomTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabContactsCount: 0
    }
    this.listener = (data) => {
      // LogUtil.w('onTabChange: ' + JSON.stringify(data));
      this.setState({ tabContactsCount: data.count });
    }
    CountEmitter.addListener("onTabChange", this.listener);
  }

  componentWillUnmount() {
    CountEmitter.removeListener("onTabChange", this.listener);
  }

  render() {
    let dotView = null;
    if (this.state.tabContactsCount > 0) {
      dotView = (
        <View style={styles.dot}>
          <Text style={styles.dotText}>{"" + this.state.tabContactsCount}</Text>
        </View>
      );
    }
    let tabIcon = this.props.f
      ? require("../../imgs/ic_contact_sel~iphone.png")
      : require("../../imgs/ic_contact_nor~iphone.png");
    return (
      <View>
        <Image
          style={styles.tabBarIcon}
          source={tabIcon}
        />
        {dotView}
      </View>
    );
  }
}

// 首页底部四个Tab的配置
export default class TabNavConfigs {

  // 联系人Tab上的消息数
  static TAB_CONTACT_DOT_COUNT = 0;

  // 微信tab
  static TAB_WE_CHAT_CONF = {
    tabBarLabel: "消息",
    tabBarIcon: ({ focused, tintColor }) => {
      if (focused) {
        return (
          <Image
            style={styles.tabBarIcon}
            source={require("../../imgs/ic_msg_sel~iphone.png")}
          />
        );
      }
      return (
        <Image
          style={styles.tabBarIcon}
          source={require("../../imgs/ic_msg_nor~iphone.png")}
        />
      );
    }
  };
  //群组
  static TAB_FIND_CONF = {
    tabBarLabel: "群组",
    tabBarIcon: ({ focused, tintColor }) => {
      if (focused) {
        return (
            <Image
                style={styles.tabBarIcon}
                source={require("../../imgs/ic_group_sel~iphone.png")}
            />
        );
      }
      return (
          <Image
              style={styles.tabBarIcon}
              source={require("../../imgs/ic_group_nor~iphone.png")}
          />
      );
    }
  };
  // 联系人tab
  static TAB_CONTACTS_CONF = {
    tabBarLabel: "通讯录",
    tabBarIcon: ({ focused, tintColor }) => {
      return <CustomTab f={focused} />
    }
  };



  // 我
  static TAB_MINE_CONF = {
    tabBarLabel: "我",
    tabBarIcon: ({ focused, tintColor }) => {
      if (focused) {
        return (
          <Image
            style={styles.tabBarIcon}
            source={require("../../imgs/ic_me_sel~iphone.png")}
          />
        );
      }
      return (
        <Image
          style={styles.tabBarIcon}
          source={require("../../imgs/ic_me_nor~iphone.png")}
        />
      );
    }
  };
}

const styles = StyleSheet.create({
  tabBarIcon: {
    width: 24,
    height: 24
  },
  dot: {
    backgroundColor: "#FF0000",
    width: 15,
    height: 15,
    borderRadius: 90,
    position: "absolute",
    left: 22,
    justifyContent: "center",
    alignItems: "center"
  },
  dotText: {
    color: "#FFFFFF",
    fontSize: 10
  }
});
