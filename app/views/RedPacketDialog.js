import React, {Component} from 'react';
import ImageSequence from 'react-native-image-sequence';
import Sound from 'react-native-sound'
import Api from '../api/Api'
import UserInfoUtil from "../utils/UserInfoUtil";
import Toast from "@remobile/react-native-toast"
import {
    Image,
    Button,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity
} from 'react-native';
import ImageAdapter from "./ImageAdapter";

const {width, height} = Dimensions.get('window');

export default class RedPacketDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar:"",
            packetId:"",
            nickName:"",
            item:null,
            show: false,
            showDetail: false,
            openAnimation:false,
        }
    }

    render() {
        const images = [
            require('../../imgs/ic_open1~iphone.png'),
            require('../../imgs/ic_open2~iphone.png'),
            require('../../imgs/ic_open3~iphone.png'),
            require('../../imgs/ic_open4~iphone.png'),
            require('../../imgs/ic_open5~iphone.png'),
            require('../../imgs/ic_open6~iphone.png'),
        ];
        const centerIndex = Math.round(images.length / 2);
        return (
            <Modal transparent={true}
                   visible={this.state.show}
                   onRequestClose={() => this.closeModal()}>
                <View style={{backgroundColor: 'rgba(0, 0, 0, 0.5)', height: height}}>
                    <ImageBackground
                        style={{width: width - 50, height: 500, alignItems: "center", marginTop: 100, marginLeft: 25}}
                        source={require("../../imgs/ic_red_packet_bg2~iphone.png")}
                    >
                        <View style={styles.container}>
                            <TouchableOpacity activeOpacity={0.6} onPress={() => this.closeModal()}>
                                <Image
                                    style={[styles.closeModal, {width: 20, height: 20}]}
                                    source={require("../../imgs/ic_red_packet_exit~iphone.png")}
                                    onPress={() => {
                                        this.closeModal()
                                    }}
                                />
                            </TouchableOpacity>
                            <View style={styles.dialogContainer}>
                                <ImageAdapter width={75} height={75} path={this.state.avatar}/>
                                <View style={styles.textContainer}>
                                    <Text style={styles.titleText}>{this.state.nickName}</Text>

                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.titleTips}>发了一个红包，金额随机</Text>

                                </View>
                                <View style={[styles.textContainer, {
                                    marginTop: 10,
                                    marginBottom: 10,
                                    paddingLeft: 10,
                                    paddingRight: 10
                                }]}>
                                    <Text style={styles.titleText}>{this.state.showDetail ? '红包已抢完' : '恭喜发财大吉大利'}</Text>
                                </View>
                                <View style={styles.textContainer}>
                                    {!this.state.openAnimation && !this.state.showDetail ? <TouchableOpacity activeOpacity={0.6} onPress={() => this.playSound()}>
                                        {/*<View style={styles.btnContainer}>*/}
                                        <Image source={require("../../imgs/ic_red_packet_open~iphone.png")}
                                               style={{width: 120, height: 120}}
                                        />
                                        {/*</View>*/}

                                    </TouchableOpacity>:null}
                                    { this.state.openAnimation && !this.state.showDetail ? <ImageSequence
                                        images={images}
                                        startFrameIndex={centerIndex}
                                        framesPerSecond={20}
                                        style={{width: 120, height: 120}} />: null}

                                </View>
                                {this.state.showDetail ? (
                                    <View style={[styles.textContainer, {

                                        marginBottom: 10,
                                        paddingLeft: 10,
                                        paddingRight: 10
                                    }]}>
                                        <Text style={styles.titleText}>看看别人的手气</Text>
                                    </View>
                                ) : null}
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            </Modal>
        );
    }

    closeModal() {
        this.setState({showDetail:false,})
        this.setState({show: false,openAnimation:false});
    }

    showModal(item) {
        const avatar = Api.AVATAR_PREFIX + item.sender.avatar
        console.log(item)
        this.setState({
            avatar:avatar,
            nickName:item.sender.nickname,
            packetId:item.content,
            show: true
        });
    }

    playSound(){
        Sound.setCategory('Playback');
        let whoosh = new Sound('coin.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                // console.log('failed to load the sound', error);
                return;
            }
            // loaded successfully
            // console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());

            // Play the sound with an onEnd callback
            whoosh.play((success) => {
                if (success) {
                    // console.log('successfully finished playing');
                } else {
                    // console.log('playback failed due to audio decoding errors');
                }
            });
        });
        //打开动画
        this.setState({openAnimation:true})
        //打开红包请求
        let url = Api.ROOMS + this.state.packetId + '/packet'
        let token = UserInfoUtil.userInfo.token
        // console.log(this.state.packetId)
        fetch(url,{
            method:"GET",
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(json => {
                console.log(json,"RedDialog open packet")
                if(json.status == 200){
                    if (json.data == "nil"){
                        // this.closeModal()
                        this.setState({showDetail:true,openAnimation:false})
                        Toast.showShortCenter("红包已领完,手慢了~")
                        return
                    }
                    if(json.data.me.amount> 0){
                       this.closeModal()
                        this.props.navigation.navigate("RedPacketDetail",{
                            packet : json
                        })
                    }else{
                        Toast.showShortCenter("红包已领完,手慢了~")
                    }
                }
            })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width - 50,
        flexDirection: 'column',
        // justifyContent: 'center',
        // alignItems: 'center',

        // backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    dialogContainer: {
        // backgroundColor: '#FFFFFF',
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
        width: width - 50,
        borderRadius: 5,
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
    },
    titleText: {
        marginTop: 10,
        fontSize: 20,
        color: '#ffd49d',
    },
    titleTips: {
        marginTop: -20,
        fontSize: 12,
        color: '#ffd49d'
    },
    contentText: {
        fontSize: 16,
        color: '#000000',
    },
    btnContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeModal: {
        marginLeft: 20,
        marginTop: 20
    }
})
