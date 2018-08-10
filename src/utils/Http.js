import wepy from 'wepy';

// HTTP工具类
const baseUrl = wepy.$instance.globalData.baseUrl;

export default class http {
  


  static async request (method, url, data, loading = true) {
    const param = {
      url: baseUrl + url,
      method: method,
      data: data
    };
    if (loading) {
      // Tips.loading();
    }
    return await wepy.request(param).then(res=>res.data);

  }

  static get (url, data, loading = true) {
    return this.request('GET', url, data, loading);
  }

  static put (url, data, loading = true) {
    return this.request('PUT', url, data, loading);
  }

  static post (url, data, loading = true) {
    return this.request('POST', url, data, loading);
  }

  static patch (url, data, loading = true) {
    return this.request('PATCH', url, data, loading);
  }

  static delete (url, data, loading = true) {
    return this.request('DELETE', url, data, loading);
  }
}
