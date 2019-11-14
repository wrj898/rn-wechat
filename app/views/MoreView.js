import React, {Component} from 'react';
import Global from '../utils/Global';
import Utils from '../utils/Utils';
import {withNavigation} from 'react-navigation';
import ImagePicker from 'react-native-image-crop-picker';

import {Dimensions, Image, PixelRatio, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';

const {width} = Dimensions.get('window');

const icons = [
    require('../../imgs/ic_tab_reward~iphone.png'),
    require('../../imgs/ic_tab_join~iphone.png'),
    require('../../imgs/ic_tab_red~iphone.png'),
    require('../../imgs/ic_tab_recharge~iphone.png'),
    require('../../imgs/icon_plugin_rp~iphone.png'),
    require('../../imgs/ic_tab_rule~iphone.png'),
    require('../../imgs/ic_tab_help~iphone.png'),
    require('../../imgs/ic_tab_custom~iphone.png'),
];

const iconTexts = [
    "福利", "加盟", "红包", "充值",
    "玩法", "群规", "帮助", "客服"
];

class MoreView extends Component {
    constructor(props) {
        super(props);
    }

    handleClick() {
        let index = this.props.index;
        console.log(this.props, "moreView")
        switch (index) {
            case 0:
                this.props.navigation.navigate("Login");
                break;
            default:
        }
    }

    chooseImage() { // 从相册中选择图片发送
        ImagePicker.openPicker({
            cropping: false
        }).then(image => {
            if (this.props.sendImageMessage) {
                let path = image.path;
                if (!Utils.isEmpty(path)) {
                    let name = path.substring(path.lastIndexOf('/') + 1, path.length);
                    this.props.sendImageMessage(image);
                }
            }
        });
    }

    render() {
        var page = [];
        for (var i = 0; i < 2; i++) {
            var row = [];
            for (var j = 0; j < 4; j++) {
                row.push(
                    // <Cell
                    //   key={"row" + i + "col" + j}
                    //   icon={icons[i * 4 + j]}
                    //   text={iconTexts[i * 4 + j]}
                    //   index={i * 4 + j}
                    //   sendImageMessage={this.props.sendImageMessage}
                    // />
                    <TouchableOpacity style={styles.cellContainer} activeOpacity={0.6}
                                      onPress={() => this.handleClick()} key={"row" + i + "clo" + j}>
                        <View style={styles.cellContainer}>
                            <View style={styles.cellImgContainer}>
                                <Image style={styles.cellImage} source={icons[i * 4 + j]}/>
                            </View>
                            <Text numberOfLines={1} style={styles.cellText}>{iconTexts[i * 4 + j]}</Text>
                        </View>
                    </TouchableOpacity>
                );
            }
            page.push(
                <View key={"page" + i} style={styles.rowContainer}>{row}</View>
            );
        }
        return (
            <View style={styles.moreViewContainer}>
                {/* <TitleBar nav={this.props.navigation}/> */}
                {page}
            </View>
        );

    }
}

export default withNavigation(MoreView);

// class Cell extends Component {
//   render() {
//     return (
//       <TouchableOpacity style={styles.cellContainer} activeOpacity={0.6} onPress={() => this.handleClick()}>
//         <View style={styles.cellContainer}>
//           <View style={styles.cellImgContainer}>
//             <Image style={styles.cellImage} source={this.props.icon}/>
//           </View>
//           <Text numberOfLines={1} style={styles.cellText}>{this.props.text}</Text>
//         </View>
//       </TouchableOpacity>
//     );
//   }

//   handleClick() {
//     let index = this.props.index;
//     console.log(this.props,"moreView")
//     switch (index) {
//       case 0:
//         this.props.navigation.navigate("RedPacket", {

//         });
//         break;
//       default:
//     }
//   }

//   chooseImage() { // 从相册中选择图片发送
//     ImagePicker.openPicker({
//       cropping: false
//     }).then(image => {
//       if (this.props.sendImageMessage) {
//         let path = image.path;
//         if (!Utils.isEmpty(path)) {
//           let name = path.substring(path.lastIndexOf('/') + 1, path.length);
//           this.props.sendImageMessage(image);
//         }
//       }
//     });
//   }
// }

const styles = StyleSheet.create({
    moreViewContainer: {
        width: width,
        height: Global.addViewHeight,
        flexDirection: 'column',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#F4F4F4'
    },
    rowContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        height: Global.addViewHeight / 2 - 20,
    },
    cellContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
    },
    cellImgContainer: {
        width: 55,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FBFBFB',
        borderWidth: 1 / PixelRatio.get(),
        borderColor: '#DFDFDF',
        borderRadius: 10,
    },
    cellImage: {
        width: 40,
        height: 40,
    },
    cellText: {
        fontSize: 12,
        width: 55,
        textAlign: 'center'
    }
});
