import base from './base'
import wepy from 'wepy'

/**
 * 权限服务类
 */
export default class auth extends base {
  /**
   * 一键登录
   */
  static async login() {
    console.log("login ....")
    const third_session = this.getConfig('third_session'); // 获取本地存储的third_session

    if (third_session != null && third_session != '') {

      console.log("检查服务器是否存在（过期)...")
      //检查服务器是否存在（过期)
      await this.checkLoginCode(third_session).then(res=>{
        if(res.code !== 0){
          console.log("过期 重新登录认证中...")
          this.doLogin()
        }else{
          console.log("未过期...")
        }
      }) 
    } else {
      console.log("未登录...")
      await this.doLogin();
    }
  }

  /**
   * 执行登录操作
   */
  static async doLogin() {
    const {code} = await wepy.login(); // 获取code
    const xy365_3rd_session = await this.session(code); //  通过code 请求服务器获取third_session
    await this.setConfig('third_session', xy365_3rd_session);
    await this.login();
  }

  /**
   * 获取会话
   */
  static async session(jsCode) {
    const url = `wx/login?login_code=${jsCode}`;
    return await this.get(url).then(res=>{
      if(res.code === 0){
        return res.data.xy365_3rd_session
      }
      console.log("换取session失败!");
    });
  }

  /**
   * 设置权限值
   */
  static getConfig(key) {
    return wepy.$instance.globalData.auth[key];
  }

  /**
   * 检查是否存在权限制
   */
  static hasConfig(key) {
    const value = this.getConfig(key);
    return value != null && value != '';
  }


  /**
   * 检查登录情况
   */
  static async checkLoginCode(third_session) {
    const url = `wx/check_session?third_session=${third_session}`;
    return await this.get(url);
  }

  /**
   * 读取权限值
   */
  static async setConfig(key, value) {
    await wepy.setStorage({key: key, data: value});
    wepy.$instance.globalData.auth[key] = value;
  }

  /**
   * 删除权限值
   */
  static async removeConfig(key) {
    console.info(`[auth] clear auth config [${key}]`);
    wepy.$instance.globalData.auth[key] = null;
    await wepy.removeStorage({key: key});
  }
}
