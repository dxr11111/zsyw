export const getLocation = function () {
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
      timeout: 800,
    })

    // 地址逆解析
    var geocoder = new AMap.Geocoder({
      city: "", //城市设为北京，默认：“全国”
      radius: 1000 //范围，默认：500
    })
    function regeoCode() {
      var lnglat = [location.lng, location.lat]
      geocoder.getAddress(lnglat, function (status, result) {
        if (status === 'complete' && result.regeocode) {
          console.log('查询地址成功', result)
          location.address = result.regeocode.formattedAddress
          console.log('详细信息', location)
        } else {
          console.log('根据经纬度查询地址失败', result)
        }
      })
    }

    geolocation.getCurrentPosition(function (status, result) {
      console.log('定位状态和结果', status, result)
      if (status == 'complete') {
        console.log('定位成功', result)
        location.lat = result.position.lat
        location.lng = result.position.lng
        regeoCode()
      } else {
        console.log("定位失败:" + result.message)
      }
    })
  })
  return location
}

import vue from '@/main'
export const getLocationH5 = function () {
  let location = {}
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError,
      {
        enableHighAcuracy: true, // 指示浏览器获取高精度的位置，默认为false
        timeout: 5000, // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
        maximumAge: 3000 // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
      }
    )
  } else {
    vue.$toast('当前浏览器不支持地理定位')
  }
  // 获取定位成功，显示位置信息
  function showPosition(position) {
    console.log(position)
    location.lat = position.coords.latitude // 纬度
    location.lng = position.coords.longitude // 经度
  }
  // 获取定位失败，显示错误信息
  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        vue.$toast('用户拒绝对获取地理位置的请求')
        break
      case error.POSITION_UNAVAILABLE:
        vue.$toast('位置信息是不可用的')
        break
      case error.TIMEOUT:
        vue.$toast('请求用户地理位置超时')
        break
      case error.UNKNOWN_ERROR:
        vue.$toast('未知错误')
        break
    }
  }

  return location
}
