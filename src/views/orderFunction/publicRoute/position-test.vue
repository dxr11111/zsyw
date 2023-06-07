<template>
  <div>
    <MyHeader :name="'测试'" left="arrow-left" @goBackEv="$router.go(-1)" />
    <div>
      <van-button @click="getLocationFn">点击获取高德定位</van-button>
      <h1>高德</h1>
      <p>经度：{{ location.lng }}</p>
      <p>纬度：{{ location.lat }}</p>
      <p>地址：{{ location.address }}</p>
      <br />
      <van-button @click="getLocationH5Fn">点击获取H5定位</van-button>
      <h1>h5</h1>
      <p>经度：{{ geoInfo.lng }}</p>
      <p>纬度：{{ geoInfo.lat }}</p>
      <p>地址：{{ geoInfo.address }}</p>
    </div>

    <!-- <iframe
      id="geoPage"
      width="0"
      height="0"
      frameborder="0"
      style="display: none"
      scrolling="yes"
      src="https://apis.map.qq.com/tools/geolocation?key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp"
    >
    </iframe>
    <div>
      <van-button @click="getTencent">点击获取腾讯定位</van-button>
      <h1>腾讯</h1>
      <p ref="lng">经度：{{ loc.lng }}</p>
      <p ref="lat">纬度：{{ loc.lat }}</p>
      <p ref="city">城市：{{ loc.city }}</p>
      <p ref="city">地址：{{ address }}</p>
    </div> -->
  </div>
</template>

<script>
import { getLocation, getLocationH5 } from "@/utils/public/positionLoaction";
export default {
  name: "Position",
  data() {
    return {
      // 高德定位信息
      location: {
        lng: "", // 经度
        lat: "", // 纬度
        address: "",
      },
      geoInfo: {}, // h5定位信息
      loc: {}, // 腾讯定位信息
      address: "",
    };
  },
  created() {
    // this.getTencent();
  },
  methods: {
    getTencent() {
      // 腾讯-定位
      const _this = this;
      window.addEventListener(
        "message",
        function (event) {
          // 接收位置信息
          if (event.data?.lat) {
            _this.loc = event.data;
            console.log("location", _this.loc);
            // _this.$refs.lat.innerText = _this.loc.lat
            // _this.$refs.lng.innerText = event.data.lat
            alert(`腾讯-经度：${_this.loc.lng}; 纬度：${_this.loc.lat}`);
            _this
              .updateAdress()
              .then((res) => {
                console.log(res);
                _this.address = res;
              })
              .catch();
          }
        },
        false
      );
      setTimeout(function () {
        if (!_this.loc) {
          console.log("定位超时");
        }
      }, 6000); // 6s为推荐值，业务调用方可根据自己的需求设置改时间，不建议太短
    },
    // 腾讯获取到经纬度，调用高德方法获取位置信息
    updateAdress() {
      const _this = this;
      return new Promise((resolve, reject) => {
        AMap.plugin(["AMap.Geolocation", "AMap.Geocoder"], function () {
          var geocoder = new AMap.Geocoder({
            // city: "", //城市设为北京，默认：“全国”
            radius: 1000, //范围，默认：500
          });
          var lnglat = [_this.loc.lng, _this.loc.lat];
          geocoder.getAddress(lnglat, function (status, result) {
            if (status === "complete" && result.regeocode) {
              console.log("高德-查询地址成功", result.regeocode);
              resolve(result.regeocode.formattedAddress);
            } else {
              console.log("高德-根据经纬度查询地址失败", result);
              reject(result);
            }
          });
        });
      });
    },
    // 获取高德定位
    getLocationFn() {
      getLocation()
        .then((res) => {
          this.$toast(`高德-经度：${res.lng}; 纬度：${res.lat}`);
          console.log("高德-定位结果", res);
          this.location = res;
        })
        .catch((error) => {
          this.$toast("高德" + error);
          console.log("高德-定位错误信息", error);
        });
    },
    // 获取h5定位
    getLocationH5Fn() {
      getLocationH5()
        .then((res) => {
          this.$toast(`h5-经度：${res.lng}; 纬度：${res.lat}`);
          console.log("h5-定位数据", res);
          this.geoInfo = res;
        })
        .catch((error) => {
          console.log("h5-定位error+", error);
          this.$toast("h5" + error);
        });
    },
  },
  destroyed() {
    window.removeEventListener("message");
  },
};
</script>

<style>
</style>