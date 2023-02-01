<template>
  <div class="box">
    <!-- <div class="perspective">
      <label class="tab" for="tab-three">选项卡三</label>

      <input type="radio" name="tabs" id="tab-three" />
      <div class="tabs">
        <label class="tab" for="tab-one">选项卡一</label>
        <label class="tab" for="tab-two">选项卡二</label>
      </div>
      <input type="radio" name="tabs" id="tab-one" />
      <input type="radio" name="tabs" id="tab-two" />

      <div class="cube">
        <div class="tab-content">
          <img src="./gongdan.png" alt="" />
        </div>
        <div class="tab-content">
          <img src="./task.png" alt="" />
        </div>
      </div>
    </div> -->

    <div style="margin-top: 30px">
      <p>当前经度：{{ lng }}</p>
      <p>当前纬度：{{ lat }}</p>
      <van-button type="primary" @click="getLongitudeLatitude">获取</van-button>
    </div>

    <div id="container"></div>
  </div>
</template>

<script>
import { location } from '@/utils/positionLoaction'
export default {
  data() {
    return {
      lat: '',
      lng: '',
      location: '',
      signAddress: ''
    }
  },
  mounted() {
    this.getLocation()
  },
  methods: {
    // 获取当前定位
    getLocation() {
      let _this = this
      var map = new AMap.Map('container', {
        resizeEnable: true
      })
      map.plugin('AMap.Geolocation', function () {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 10000,          //超过10秒后停止定位，默认：5s
          buttonPosition: 'RB',    //定位按钮的停靠位置
          buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
        })
        geolocation.getCurrentPosition(function (status, result) {
          console.log('定位状态和结果', status, result);
          if (status == 'complete') {
            console.log('定位成功', result)
            // _this.signAddress = result.formattedAddress
          } else {
            console.log("定位失败:" + result.message)
          }
        })
      })
    },
    getLongitudeLatitude() {
      //如果该对象存在，那么地理位置服务可用。
      if ('geolocation' in navigator) {
        /* 地理位置服务可用 */
        var options = {
          enableHighAccuracy: true, //布尔值，表示系统是否使用最高精度来表示结果，注意，这会导致较慢的响应时间或者增加电量消耗（比如对于支持gps的移动设备来说）。如果值为false ，设备会通过更快响应以及/或者使用更少的电量等方法来尽可能的节约资源。默认值fasle
          timeout: 5000, //它表明的是设备必须在多长时间（单位毫秒）内返回一个位置。默认直到获取到位置才会返回值。
          maximumAge: 0 //表明可以返回多长时间（即最长年龄，单位毫秒）内的可获取的缓存位置。如果设置为 0, 说明设备不能使用一个缓存位置，而且必须去获取一个真实的当前位置。默认0
        }
        function success(position) {
          //position.coords (只读) 返回一个定义了当前位置的Coordinates对象。
          //position.timestamp (只读) 返回一个时间戳DOMTimeStamp， 这个时间戳表示获取到的位置的时间。
          this.lat = position.coords.latitude //当前位置的纬度
          this.lng = position.coords.longitude //当前位置精度
        }
        function error(error) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert('用户拒绝对获取地理位置的请求')
              break
            case error.POSITION_UNAVAILABLE:
              alert('位置信息是不可用的')
              break
            case error.TIMEOUT:
              alert('请求用户地理位置超时')
              break
            case error.UNKNOWN_ERROR:
              alert('未知错误')
              break
          }
        }
        navigator.geolocation.getCurrentPosition(success, error, options)
      } else {
        /* 地理位置服务不可用 */
        console.log('无法获取您的位置，请检查定位是否开启或刷新重试')
      }
    },
  },
}
</script>

<style>
.perspective {
  /* perspective: 76em; */
  /* perspective-origin: 50% 50px; */
  width: 100%;
  margin: 0 auto;
  font-weight: 100;
  color: #fff;
  text-align: center;
}

input {
  display: none;
}
.tabs {
  display: flex;
  flex-direction: column;
  /* margin-left: 200px; */
  margin: 10px 126px;
  position: fixed;
  font-size: 14px;
  z-index: 11111;
}

.tab {
  /* position: absolute; */
  width: 80px;
  height: 30px;
  background: pink;
  /* right: 0; */
  line-height: 30px;
  font-weight: 300;
}

.tab:nth-child(1) {
  top: -5px;
  background: #33ccff;
}

.tab:nth-child(2) {
  top: 69px;
  background: #1b9aaa;
}

/* .tab:nth-child(3) {
        top: 143px;
        background: #669999;
      } */

.cube {
  position: relative;
  /* margin: 60px auto 0; */
  /* margin-left: 43px; */
  /* margin-top: 20px; */
  width: 100%;
  height: 100%;
  transform-origin: 0 100px;
  transform-style: preserve-3d;
  transition: transform 0.5s ease-in;
}
img {
  width: 100%;
}

.tab-content {
  width: 100%;
  height: 100%;
  position: absolute;
}

.tab-content h1 {
  font-size: 25px;
  margin: 75px 0 10px;
  font-weight: 300;
}

.tab-content p {
  font-size: 12px;
}

.tab-content:nth-child(2) {
  transform: translateZ(100px);
  background: #1b9aaa;
}

.tab-content:nth-child(1) {
  transform: rotateX(-270deg) translateY(-100px);
  transform-origin: top left;
  background: #33ccff;
}

/* .tab-content:nth-child(3) {
        transform: rotateX(-90deg) translateY(89px);
        transform-origin: bottom center;
        background: #669999;
      } */

#tab-one:checked ~ .cube {
  transform: rotateX(-90deg);
}

#tab-two:checked ~ .cube {
  transform: rotateX(0deg);
}

#tab-three:checked ~ .cube {
  transform: rotateX(90deg);
}
</style>