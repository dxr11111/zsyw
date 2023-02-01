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
