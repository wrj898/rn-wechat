import React, {Component} from 'react';
import Global from '../utils/Global';

import {Image, StyleSheet, Text, TouchableHighlight, View,} from 'react-native';

export default class PacketResultItem extends Component {
    render() {
        let date2 = new Date(this.props.date);
        let localeString = date2.toLocaleTimeString();
        return (
            <View>
                <View style={listItemStyles.container}>
                    <View style={{flexDirection: "row"}}>
                        <Image style={listItemStyles.icon} source={{uri : this.props.avatar}}/>
                        <View style={listItemStyles.menuContainer}>
                            <Text style={listItemStyles.menuText}>{this.props.nickname}</Text>
                            <Text style={listItemStyles.date}>{localeString}</Text>
                        </View>
                    </View>
                    <View  style={{flexDirection: "row"}}>
                        { this.props.hit ? <Image style={{width:30,marginRight:20}} resizeMode="contain" source={require("../../imgs/ic_bomb~iphone.png")}/>:null}
                        <View style={{flexDirection: "column"}}>
                            <Text style={{textAlign:"right"}}>{this.props.amount}</Text>
                            {this.props.best ?  <Image style={{width:80}} resizeMode="contain" source={require("../../imgs/ic_king~iphone.png")}/>:null}
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const listItemStyles = StyleSheet.create({
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
        width: 50,
        height: 50,
    },
    menuContainer: {
        paddingLeft: 15,
        paddingRight: 15,
    },
    menuText: {
        color: '#000000',
        fontSize: 16,
    },
    date:{
        paddingTop: 10
    }
});
