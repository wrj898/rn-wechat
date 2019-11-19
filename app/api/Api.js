
export default class Api {
  static BASE_URL = 'http://api.packet.imusheng.net/api';
  static WS_URL = 'http://api.packet.imusheng.net';
  static AVATAR_PREFIX = 'http://static.duoduo111.cn/';
  // static BASE_URL = 'http://192.168.1.107:6001/api';



  // 登录
  static LOGIN_URL = Api.BASE_URL + '/login';

  //获取验证码

  static VERIFY_CODE = Api.BASE_URL + '/code'

  // 注册
  static REGISTER_URL = Api.BASE_URL + '/register';

  static ROOMS = Api.BASE_URL + '/rooms/';
  // 提现

  static WITHDRAW = Api.BASE_URL + '/orders/withdraw'

  //用户余额

  static USER_BALANCE = Api.BASE_URL + '/users/balance'

  static PUBLISH_MOMENT_URL = Api.BASE_URL + '/moments/publish';

  // 朋友圈
  static MOMENTS_URL = Api.BASE_URL + '/moments/list';

  // 朋友圈点赞
  static MOMENT_FAVOR_URL = Api.BASE_URL + '/moments/favor';

  // 朋友圈评论
  static MOMENT_REPLY_URL = Api.BASE_URL + '/moments/reply';

  // 朋友列表
  static FRIENDS_LIST = Api.BASE_URL + '/friends';

  // 搜索
  static SEARCH_URL = Api.BASE_URL + '/user/searchUser';

  // 修改头像
  static MODIFY_AVATAR_URL = Api.BASE_URL + '/user/updateAvatar';

  // 修改昵称
  static MODIFY_NICK_URL = Api.BASE_URL + '/user/updateNick';

  // 搜索添加好友
  static ADD_FRIEND_SEARCH_URL = Api.BASE_URL + '/addSearch';

  // Android应用内升级
  static ANDROID_UPGRADE_URL = Api.BASE_URL + '/upgrade/check';
}
