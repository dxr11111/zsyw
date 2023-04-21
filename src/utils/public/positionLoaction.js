/** 
* 获取经纬度和地址并返回信息
*/


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

// hbuilderx-h5获取经纬度信息
export const getLocationHbuilder = function () {
  return new Promise((resolve, reject) => {
    if (window.plus) {
      plus.geolocation.getCurrentPosition(
        function (p) {
          console.log(
            "Geolocation\n纬度:" +
            p.coords.latitude +
            "\n经度:" +
            p.coords.longitude +
            "\n海拔:" +
            p.coords.altitude
          );

          /* alert(
            "Geolocation\n纬度:" +
            p.coords.latitude +
            "\n经度:" +
            p.coords.longitude +
            "\n海拔:" +
            p.coords.altitude
          ); */
          let location = {}
          location.lat = p.coords.latitude
          location.lng = p.coords.longitude
          resolve(location)
        },
        function (e) {
          alert("Geolocation error: " + e.message);
          console.log("Geolocation error: " + e.message);
        }
      );
    } else {
      reject('不支持当前地理位置信息获取')
    }
  })

}
