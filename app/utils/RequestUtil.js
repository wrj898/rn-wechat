import Utils from "./Utils";
import Api from "../api/Api";
import UserInfoUtil from "./UserInfoUtil";
import StorageUtil from "./StorageUtil";
import Toast from "@remobile/react-native-toast";

export default class RequestUtil {
    static request(url, method, params, token) {
        url = Api.BASE_URL + url;
        let header;
        if (!Utils.isEmpty(token)) {
            header = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + UserInfoUtil.userInfo.token,
        }
        } else {
            header = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        }
        fetch(url, {
            headers: header,
            method: method,
            body: JSON.stringify(params)
        })
            .then(res => res.json())
            .then(json => {
                console.log(json)
                if (!Utils.isEmpty(json)) {
                    return json
                } else {
                    Toast.showShortCenter("未知错误");
                }
            })
            .catch(e => {
                Toast.showShortCenter("网络请求出错: " + e);
            });
    }
}
