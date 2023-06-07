<template>
  <!-- 上站弹出层 -->
  <div class="location">
    <van-popup v-model="show">
      <p class="tips">提示</p>
      <p class="message">{{ message }}</p>
      <div class="bottomButton">
        <van-button class="confirm" @click="confirmFn" block>确认</van-button>
      </div>
    </van-popup>
    <iframe
      id="geoPage"
      width="0"
      height="0"
      frameborder="0"
      style="display: none"
      scrolling="yes"
      src="https://apis.map.qq.com/tools/geolocation?key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp"
    >
    </iframe>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { unicomFunc, getProjectLocation } from "@/utils/public/unicomApp";
import { GoSiteApi } from "@/http/button";
import {
  getLocationH5,
  getLocation,
  getLocationHbuilder,
} from "@/utils/public/positionLoaction";
export default {
  name: "Location",
  data() {
    return {
      show: true,
      message:
        "上站操作只能提交一次，系统将记录经纬度坐标和地址，请确认到达指定地点后再操作，操作成功之后将无法修改或重复提交",
      loc: {},
    };
  },
  computed: {
    ...mapState("button", ["getLocalPopup"]),
  },
  created() {
    // const _this = this
    // window.addEventListener('message', function (event) {
    //   console.log('location', event.data);
    //   // 接收位置信息
    //   if (event.data?.lat) {
    //     _this.loc = {
    //       lng: event.data.lng,
    //       lat: event.data.lat,
    //     }
    //     console.log('腾讯定位信息', _this.loc)
    //     // alert(`腾讯-经度：${_this.loc.lng}; 纬度：${_this.loc.lat}`)
    //     _this.updateAdress().then(res => {
    //       console.log(res)
    //       _this.loc.address = res
    //     }).catch()
    //   }
    // }, false)
    // setTimeout(function () {
    //   if (!_this.loc) {
    //     console.log('定位超时')
    //   }
    // }, 6000) // 6s为推荐值，业务调用方可根据自己的需求设置改时间，不建议太短
  },
  methods: {
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
    // 重置参数
    resetFinishTask() {
      this.$store.commit("button/changeLocalPopup", {
        code: "", // 判断是哪个操作
        isShow: false,
        id: -1,
      });
    },
    // 确定
    confirmFn() {
      this.show = false;
      this.$dialog
        .confirm({
          title: "提示",
          message: "确认上站操作嘛？",
          getContainer: "#app",
          className: "confirmDialog",
        })
        .then(async () => {
          // 提交经纬度给后台
          this.loc = this.$store.state.h5Loaction;
          if (this.loc.longitude) {
            this.$toast(`经度：${result.longitude}; 纬度：${result.latitude}`);
            this.sendLocation();
            this.resetFinishTask();
          } else {
            this.$toast("提交经纬度失败！");
            this.resetFinishTask();
          }

          /* // 根据不同环境获取经纬度信息发送给后台
          getProjectLocation()
            .then((result) => {
              this.loc = result;
              // 将获取到的位置信息发送给后台
              this.$toast(`hbuilderx-经度：${result.lng}; 纬度：${result.lat}`);
              this.sendLocation();
              this.resetFinishTask();
            })
            .catch((error) => {
              this.$toast(error);
              this.resetFinishTask();
            }); */

          /* var code = unicomFunc();
          console.log("调用标识", code);
          if (code == 0) {
            // 调用hbuilderx定位
            getLocationHbuilder()
              .then((res) => {
                this.$toast(`hbuilderx-经度：${res.lng}; 纬度：${res.lat}`);
                console.log("hbuilderx-定位数据", res);
                if (res.lat) {
                  this.loc = res;
                }
                // 将获取到的位置信息发送给后台
                this.sendLocation();
                this.resetFinishTask();
              })
              .catch((error) => {
                console.log("hbuilderx-定位error+", error);
                this.$toast("hbuilderx" + error);
                this.resetFinishTask();
              });
          } else {
            function getlnglatCallBack(location) {
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
              this.loc = getlnglatCallBack(location);
            } else if (code == 2) {
              // android
              const location = region.getLngAndLat();
              this.loc = getlnglatCallBack(location);
            }
          } */
        })
        .catch(() => {
          // on cancel
        });
    },
    // 将获取到的位置信息发送给后台
    async sendLocation() {
      if (this.getLocalPopup.code == "goSite") {
        let params = {};
        params = {
          id: this.getLocalPopup.id,
          posX: this.loc.lng, // 经度
          posY: this.loc.lat, // 纬度
          address: this.loc.address,
        };
        console.log("上站发送的定位参数", params);
        let result = await GoSiteApi(JSON.stringify(params));
        this.apiResponse(result, "#app", () => {
          this.operationSuccessRefresh(true);
        });
      }
    },
  },
  // destroyed() {
  //   window.removeEventListener('message')
  // }
};
</script>

<style scoped lang="less">
.location {
  .van-popup {
    width: 90%;
    border-radius: 10px;
    .tips {
      padding-top: 20px;
      font-size: 18px;
      font-weight: 600;
    }
    .message {
      padding: 10px 16px;
      text-align: left;
      font-size: 16px;
    }
    .bottomButton {
      border-top: 1px solid #e0e0e0;
      height: 50px;
      .van-button {
        height: 100%;
        color: @theme-color;
        font-size: 16px;
      }
    }
  }
}
</style>