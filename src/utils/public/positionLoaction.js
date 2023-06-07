/** 
* 获取经纬度和地址并返回信息
*/
import vue from '@/main';

// 高德-收费
export const getLocation = function () {
  return new Promise((resolve, reject) => {
    let location = {
      lng: '', // 经度
      lat: '', // 纬度
      address: ''
    }
    AMap.plugin(["AMap.Geolocation", "AMap.Geocoder"], function () {
      var geolocation = new AMap.Geolocation({
        // 是否使用高精度定位，默认：true
        enableHighAccuracy: true,
        // 设置定位超时时间，默认：无穷大
        timeout: 10000,
      })

      // 地址逆解析
      var geocoder = new AMap.Geocoder({
        city: "", // 城市设为北京，默认：“全国”
        radius: 1000 // 范围，默认：500
      })
      function regeoCode() {
        return new Promise((resolve, reject) => {
          var lnglat = [location.lng, location.lat]
          geocoder.getAddress(lnglat, function (status, result) {
            if (status === 'complete' && result.regeocode) {
              console.log('高德-查询地址成功', result)
              location.address = result.regeocode.formattedAddress
              console.log('高德-详细信息', location)
              resolve(location)
            } else {
              console.log('高德-根据经纬度查询地址失败', result)
              reject(result)
            }
          })
        })
      }

      geolocation.getCurrentPosition(function (status, result) {
        console.log('高德-定位状态和结果', status, result.position)
        if (status == 'complete') {
          console.log('高德-定位成功', result)
          location.lat = result.position.lat
          location.lng = result.position.lng
          regeoCode().then(res => {
            resolve(res)
          }).catch(error => {
            reject(error)
          })
        } else {
          console.log("高德-定位失败:" + result.message)
          reject(result.message)
        }
      })
    })
  })
}

// h5定位
export const getLocationH5 = function () {
  return new Promise((resolve, reject) => {
    if (window.navigator.geolocation) {
      console.log('navigator', navigator)
      console.log('navigator.geolocation', navigator.geolocation)
      let location = {}
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position)
        location.lat = position.coords.latitude // 纬度
        location.lng = position.coords.longitude // 经度
        resolve(location)
      }, function (error) {
        var errorMessage = ''
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '用户拒绝对获取地理位置的请求'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = '位置信息是不可用的'
            break
          case error.TIMEOUT:
            errorMessage = '请求用户地理位置超时'
            break
          case error.UNKNOWN_ERROR:
            errorMessage = '未知错误'
            break
        }
        reject(errorMessage)
      }, {
        enableHighAcuracy: true, // 指示浏览器获取高精度的位置，默认为false
        timeout: 5000, // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
        maximumAge: 3000 // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
      })
    } else {
      reject('你的浏览器不支持当前地理位置信息获取')
    }
  })
}

// H5原生的位置定位
export const getLocationH5Test = function () {
  return new Promise((resolve, reject) => {
    function geoShowPosition(position) {
      console.log('position', position)
      if (position) {
        const location = { lat: position.coords.latitude, lng: position.coords.longitude };
        resolve(location);
      } else {
        reject();
      }
    }

    function geoShowError(error) {
      console.log(`getPosError:${error.code},${navigator.geolocation},${error.message}`);
      reject();
    }
    navigator.geolocation.getCurrentPosition(geoShowPosition, geoShowError);
  });
}

// hbuilderx-h5监听经纬度信息
export const watchLocationHbuilder = function () {
  return new Promise((resolve, reject) => {
    var watchId = plus.geolocation.watchPosition(
      function (p) {
        vue.$store.commit('changeWatchPositionFlag', true) // 开启位置监听
        let address = (p?.address?.city || "") + (p?.address?.district || "") + (p?.address?.street || "") + (p?.address?.streetNum || "") + (p?.address?.poiName || "")
        /*  console.log(
           "Geolocation\n纬度:" +
           p.coords.latitude +
           "\n经度:" +
           p.coords.longitude +
           "\n完整地址描述信息:" +
           p.addresses +
           "\n地址信息:" +
           address
 
         ); */
        // 安卓获取不到address，使用高德api将经纬度转为地址信息(逆向地理编码)
        if (plus.os.name === "Android") {
          AMap.plugin('AMap.Geocoder', function () {
            var geocoder = new AMap.Geocoder({
              radius: 30 // 以给定坐标为中心点，单位：米, 范围0- 3000
            });
            var lnglat = [p.coords.longitude, p.coords.latitude];//这里是需要转化的经纬度

            geocoder.getAddress(lnglat, function (status, result) {
              if (status === 'complete' && result.info === 'OK') {
                // result为对应的地理位置详细信息
                address = result.regeocode.formattedAddress
              }
            });
          })
        }


        let location = {}
        location.longitude = p.coords.longitude; // 经度
        location.latitude = p.coords.latitude; // 纬度
        location.address = address
        // 将WGS-84坐标系坐标系转换为GCJ-02坐标系（高德）
        let gps = [p.coords.longitude, p.coords.latitude]; // 需要转换的gps类型的坐标
        //参数说明:需要转换的坐标，需要转换的坐标类型，转换成功后的回调函数
        AMap.convertFrom(gps, "gps", function (status, result) {
          if (result.info === "ok") {
            location.longitude = result.locations[0].lng; // 经度
            location.latitude = result.locations[0].lat; // 纬度
            console.log("GCJ-02坐标系", location.longitude, location.latitude, new Date(+new Date() + 8 * 3600 * 1000)
              .toJSON()
              .substr(0, 19)
              .replace("T", " "));
            resolve(location)
            // 将位置信息放在vuex内，供其他需要定位的功能获取
            vue.$store.commit('changeH5Location', location)
          }
        });
      }, function (e) {
        reject("监听位置变化信息失败： " + e.message);
        plus.geolocation.clearWatch(watchId); // 关闭监听设备位置信息
        vue.$store.commit('changeWatchPositionFlag', false)

      }, { 'enableHighAccuracy': true, 'maximumAge': 60000 });
    // iOS端不支持设置maximumAge这个参数，定位回调是由系统根据设备移动方向及速度等因素自动触发的
  })

}

// hbuilderx-h5获取经纬度信息
export const getLocationHbuilder = function () {
  return new Promise((resolve, reject) => {
    plus.geolocation.getCurrentPosition(
      function (p) {
        let address = (p?.address?.city || "") + (p?.address?.district || "") + (p?.address?.street || "") + (p?.address?.streetNum || "") + (p?.address?.poiName || "")
        console.log(
          "Geolocation\n纬度:" +
          p.coords.latitude +
          "\n经度:" +
          p.coords.longitude +
          "\n完整地址描述信息:" +
          p.addresses +
          "\n地址信息:" +
          address

        );
        let location = {}
        location.longitude = p.coords.longitude; // 经度
        location.latitude = p.coords.latitude; // 纬度
        location.address = address
        // 将WGS-84坐标系坐标系转换为GCJ-02坐标系（高德）
        let gps = [p.coords.longitude, p.coords.latitude]; // 需要转换的gps类型的坐标
        //参数说明:需要转换的坐标，需要转换的坐标类型，转换成功后的回调函数
        AMap.convertFrom(gps, "gps", function (status, result) {
          if (result.info === "ok") {
            location.longitude = result.locations[0].lng; // 经度
            location.latitude = result.locations[0].lat; // 纬度
            console.log("GCJ-02坐标系", location.longitude, location.latitude);
            resolve(location)
            // 将位置信息放在vuex内，供其他需要定位的功能获取
            vue.$store.commit('changeH5Location', location)
          }
        });
      },
      function (e) {
        reject("获取位置信息失败：" + e.message);
        console.log("获取位置信息失败：" + e.message);
      }, {
    }
    );
  })

}
