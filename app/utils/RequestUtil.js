import Utils from "./Utils";
import Api from "../api/Api";
import UserInfoUtil from "./UserInfoUtil";
import StorageUtil from "./StorageUtil";
import Toast from "@remobile/react-native-toast";

export default class RequestUtil {
    async fetchRequest(url, method, params) {
        url = Api.BASE_URL + url;
        let header = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + UserInfoUtil.userInfo.token,
        }

        let res = await  fetch(url, {
            headers: header,
            method: method,
            body: JSON.stringify(params)
        })
        let data = res.json()
        return data
    }
}
