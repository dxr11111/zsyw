<template>
  <!-- 任务回复弹出层 -->
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
      scrolling="no"
      src="https://apis.map.qq.com/tools/geolocation?key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp"
    >
    </iframe>
  </div>
</template>

<script>
import { mapState } from "vuex"
import { unicomFunc } from '@/utils/public/unicomApp'
import { GoSiteApi } from '@/http/button'
import { getLocationH5, getLocation } from "@/utils/public/positionLoaction"
export default {
  name: "Location",
  data() {
    return {
      show: true,
      message: "上站操作只能提交一次，系统将记录经纬度坐标和地址，请确认到达指定地点后再操作，操作成功之后将无法修改或重复提交",
      loc: {},
    }
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
      const _this = this
      return new Promise((resolve, reject) => {
        AMap.plugin(["AMap.Geolocation", "AMap.Geocoder"], function () {
          var geocoder = new AMap.Geocoder({
            // city: "", //城市设为北京，默认：“全国”
            radius: 1000 //范围，默认：500
          })
          var lnglat = [_this.loc.lng, _this.loc.lat]
          geocoder.getAddress(lnglat, function (status, result) {
            if (status === 'complete' && result.regeocode) {
              console.log('高德-查询地址成功', result.regeocode)
              resolve(result.regeocode.formattedAddress)
            } else {
              console.log('高德-根据经纬度查询地址失败', result)
              reject(result)
            }
          })
        })
      })
    },
    // 重置参数
    resetFinishTask() {
      this.$store.commit("button/changeLocalPopup", {
        code: '', // 判断是哪个操作
        isShow: false,
        id: -1
      })
    },
    // 确定
    confirmFn() {
      this.show = false
      this.$dialog.confirm({
        title: '提示',
        message: '确认上站操作嘛？',
        getContainer: '#app',
        className: 'confirmDialog',
      })
        .then(async () => {
          var code = unicomFunc()
          console.log('调用标识', code)
          if (code == 0) {

            // setTimeout(() => {
            //   getLocation().then(res => {
            //     vue.$toast(`高德-经度：${res.lng}; 纬度：${res.lat}`)
            //     console.log('高德-定位结果', res)
            //     this.loc = res
            //   }).catch(error => {
            //     vue.$toast('高德' + error)
            //     console.log('高德-定位错误信息', error)
            //   })
            // }, 3000)
            getLocationH5().then(res => {
              this.$toast(`h5-经度：${res.lng}; 纬度：${res.lat}`)
              console.log('h5-定位数据', res)
              if (res.lat) {
                this.loc = res
              }
            }).catch((error) => {
              console.log('h5-定位error+', error)
              this.$toast('h5' + error)
            })


          } else if (code == 1) {
            // console.log(11111111111111111111);
            getLngAndLat()
            this.loc = getlnglatCallBack()
          } else if (code == 2) {
            region.getLngAndLat()
            this.loc = getlnglatCallBack()
            // console.log(222222222222222);
          }
          function getlnglatCallBack(location) {
            //处理逻辑
            var arr = location.split(',')
            var info = {
              lng: arr[0],
              lat: arr[1]
            }
            // console.log('121212121212');
            return info
          }

          let data, params = {}
          // 上站操作
          if (this.loc.lat) {
            if (this.getLocalPopup.code == 'goSite') {
              params = {
                id: this.getLocalPopup.id,
                posX: this.loc.lng, // 经度
                posY: this.loc.lat, // 纬度
                address: this.loc.address || ''
              }
              console.log('参数', params)
              data = await GoSiteApi(JSON.stringify(params))
            }
            if (data.operationSuccessFlag) {
              this.$toast.success(data.successMessage)
              this.operationSuccessRefresh(true)
            } else {
              this.$toast.fail(data.errorMessage)
            }
          }
          this.resetFinishTask()
        })
        .catch(() => {
          // on cancel
        })
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