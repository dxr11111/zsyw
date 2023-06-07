import vue from '@/main'
import { getLocationHbuilder, watchLocationHbuilder } from './positionLoaction'

// 接入联通网络应用组件方法 --- 0调用本地；1调用ios，2调用Android
export const unicomFunc = function () {
  var flag = -1
  if (vue.$store.state.projectFlag == 1) {
    // 本地
    flag = 0
  } else {
    // 联通网络
    const UA = window.navigator.userAgent.toLowerCase()
    // console.log('UA', UA);
    const isIos = (UA && /iphone|ipad|ipod|ios/.test(UA)) || false
    console.log('是否是ios', isIos)
    if (isIos) {
      flag = 1
    } else {
      flag = 2
    }
  }
  return flag
}

// 根据不同项目获取经纬度 paramCode:联通网络传1
// 目前建维优没有使用getLocationHbuilder，定时发送位置使用了watchLocationHbuilder，其他功能直接从vuex里面取位置信息
export const getProjectLocation = function () {
  let code = unicomFunc()

  return new Promise((resolve, reject) => {
    if (code == 0) {
      // 调用hbuilderx获取定位
      getLocationHbuilder()
        .then(async (result) => {
          console.log("hbuilderx-获取定位数据", result);
          // 提交经纬度给后台
          resolve(result)
        })
        .catch((error) => {
          console.log("hbuilderx-获取定位error+", error);
          reject(error)
        });

    } else {
      // 联通网络 → 高德地图能力相关
      if (code == 1) {
        // ios
        // 返回定位
        function getGaodeAddress(datCas) {
          console.log('ios定位信息', datCas);
          let location = {
            longitude: datCas.longitude,
            latitude: datCas.latitude,
            address: datCas.address
          }
          // 提交经纬度给后台
          resolve(location)
        }
        // 获取定位
        vue.$toast('准备调用ios联通网络定位')
        // console.log('准备调用ios联通网络定位')
        window.openGaodeAddress();
        setTimeout(() => {
          vue.$toast('成功调用ios联通网络定位')
        }, 2000)


      } else if (code == 2) {
        // android
        // 返回定位
        function getGaodeAddress(res) {
          vue.$toast('获取到的android定位信息', res)
          var resultJSON = JSON.parse(res);
          let location = {
            longitude: resultJSON.longitude,
            latitude: resultJSON.latitude,
            address: resultJSON.address
          }
          // 提交经纬度给后台
          resolve(location)
        }
        // 获取定位
        // console.log('准备调用安卓联通网络定位')
        vue.$toast('准备调用安卓联通网络定位')
        window.region.openGaodeAddress()

        setTimeout(() => {
          vue.$toast('成功调用安卓联通网络定位')
        }, 2000)


      }

      // android ios通用 → 获取高德定位信息
      // 系统定位会上传实时位置信息供后台一分钟请求一次，因此联通网络定位也需至少一分钟调用一次
      /* window.WebViewJavascriptBridge.callHandler('getLocationInfo', '', function (res) {
        console.log('联通网络定位信息', res)
        let location = {
          longitude: res.longitude,
          latitude: res.latitude,
          address: res.address
        }
        // 提交经纬度给后台
        resolve(location)
      }) */


      /* function getlnglatCallBack(location) {
        // 获取经纬度
        let arr = location.split(",");
        let info = {
          lat: arr[0], // 纬度
          lng: arr[1], // 经度
        };
        return info;
      }
      // 联通网络
      if (code == 1) {
        // ios
        const location = getLngAndLat();
        let result = getlnglatCallBack(location);
        console.log('联通网络ios调取定位结果', result)
        // 提交经纬度给后台
        resolve(result)

      } else if (code == 2) {
        // android
        const location = region.getLngAndLat();
        let result = getlnglatCallBack(location);
        console.log('联通网络android调取定位结果', result)
        // 提交经纬度给后台
        resolve(result)
      } */

    }
  })
}
// hbuilder获取监听定位 watchLocationHbuilder

// 根据不同项目跳转第三方app
// pname:安卓包名； action：ios的Scheme； extra：安卓携带的参数
export const skipThirdApp = function (pname, action, extra) {
  let code = unicomFunc()
  if (code == 0) {
    // 建维优 调用hbuilderx
    // 检测app是否安装
    if (window.plus) {
      if (plus.runtime.isApplicationExist({ pname, action })) {
        console.log("应用已安装");
        // 判断平台调用app
        if (plus.os.name == 'Android') {
          plus.runtime.launchApplication(
            {
              pname,
              extra,
            },
            function (e) {
              console.log('Open system default browser failed: ' + e.message);
            }
          );
        } else if (plus.os.name == 'iOS') {
          plus.runtime.launchApplication({ action }, function (e) {
            console.log('Open system default browser failed: ' + e.message);
          });
        }
      } else {
        console.log("应用未安装");
        vue.$toast('应用未安装')
      }
    } else {
      vue.$toast('当前是浏览器环境，无法监测app是否安装')
    }

  } else {
    // 调用联通网络
    if (code == 1) {
      // ios
      window.location.href = "zzhc://"
    } else if (code == 2) {
      // android
      window.location.href = "zzhc://"

    }

  }
}

// 根据不同项目调用高德地图或百度地图
export const skipMap = function (pname, action, androidUrl, iosUrl, unicomUrl) {
  let code = unicomFunc()
  if (code == 0) {
    // 建维优 调用hbuilderx
    // 检测app是否安装
    if (window.plus) {
      // 配置白名单 由于iOS的限制，iOS系统在9之后的版本中，如果开发者的app希望调起高德地图，必须在自己app的设置中配置白名单。
      if (
        plus.runtime.isApplicationExist({
          pname,
          action,
        })
      ) {
        console.log("应用已安装");
        // 判断平台调用app
        if (plus.os.name == "Android") {
          window.location.href = androidUrl;
        } else if (plus.os.name == "iOS") {
          window.location.href = iosUrl;
        }
      } else {
        console.log("应用未安装");
        vue.$toast("应用未安装");
      }
    } else {
      vue.$toast("当前是浏览器环境，无法监测app是否安装");
    }

  } else {
    // 调用联通网络内部方法
    //  android和ios通用
    window.location.href = unicomUrl
  }
}

// 扫码
export const codeScanView = function () {
  function getQRCodeScanUrl(qrUrl) {
    //处理逻辑
    return qrUrl
  }
  let result = null
  var code = unicomFunc()
  if (code == 0) {
    // vue扫码逻辑
    result = 'local'
  } else if (code == 1) {
    openQRCodeScanView()
    result = getQRCodeScanUrl()
  } else {
    region.openQRCodeScanView()
    result = getQRCodeScanUrl()
  }
  return result
}