<template>
  <div style="height: 100%; width: 100%">
    <MyHeader :name="'扫码'" left="arrow-left" @goBackEv="$emit('goBack')" />
    <!-- vue-qrcode-reader -->
    <!-- <qrcode-stream
      :key="_uid"
      :track="this.paintBoundingBox"
      @decode="onDecode"
      @init="onInit"
    /> -->

    <!-- html5-qrcode -->
    <div class="qrcode">
      <div id="reader"></div>
    </div>

    <!-- zxing/library -->
    <!-- <div class="page-scan">
      <div class="scan-box">
        <video ref="video" id="video" class="scan-video" autoplay></video>
        <div class="qr-scanner">
          <div class="box">
            <div class="line"></div>
            <div class="angle"></div>
          </div>
        </div>
        <div class="scan-tip">{{ scanTextData.tipMsg }}</div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'
import { Html5Qrcode } from "html5-qrcode"
import { BrowserMultiFormatReader } from '@zxing/library'
export default {
  components: { QrcodeStream },
  data() {
    return {
      html5QrCode: null, // html5-qrcode

      // zxing/library
      scanTextData: {
        codeReader: null,
        tipMsg: "识别二维码",
        // 这个，就是当前调用的摄像头的索引，为什么是6，我会在后面说的 华为手机是鸿蒙系统有8个摄像头
        num: 5,
        // 这个就是扫描到的摄像头的数量
        videoLength: ""
      },
      hasBind: false
    }
  },
  // html5-qrcode
  created() {
    this.getCameras()
  },
  // html5-qrcode
  beforeDestroy() {
    if (this.html5QrCode) this.stop()
  },

  // zxing/library
  // mounted() {
  //   this.scanTextData.codeReader = new BrowserMultiFormatReader()
  //   this.openScan() // 打开摄像头
  // },

  methods: {
    // zxing/library
    async openScan() {
      this.scanTextData.codeReader
        .getVideoInputDevices()
        .then(videoInputDevices => {
          // 默认获取第一个摄像头设备id
          let firstDeviceId = videoInputDevices[0].deviceId
          console.log(
            "手机摄像头的数量",
            videoInputDevices.length,
            videoInputDevices
          )
          // 获取第一个摄像头设备的名称
          const videoInputDeviceslablestr = JSON.stringify(
            videoInputDevices[0].label
          )
          if (videoInputDevices.length > 1) {
            // 华为手机有6个摄像头，前三个是前置，后三个是后置，第6个摄像头最清晰
            if (videoInputDevices.length > 5) {
              firstDeviceId = videoInputDevices[5].deviceId
            } else {
              // 判断是否后置摄像头
              if (videoInputDeviceslablestr.indexOf("back") > -1) {
                firstDeviceId = videoInputDevices[0].deviceId
              } else {
                firstDeviceId = videoInputDevices[1].deviceId
              }
            }
          }
          this.decodeFromInputVideoFunc(firstDeviceId)
        })
        .catch(err => {
          console.error(err)
        })
    },
    decodeFromInputVideoFunc(firstDeviceId) {
      this.scanTextData.codeReader.reset()
      this.scanTextData.codeReader.decodeFromInputVideoDeviceContinuously(
        firstDeviceId,
        "video",
        (result, err) => {
          if (result && result.text) {
            this.handleResult(result.text)
          }
          if (err && !err) {
            console.log(err)
            this.$toast.fail(err)
          }
        }
      )
    },
    async handleResult(scanResult) {
      console.log(scanResult)
      // TODO 逻辑处理或直接返回扫码结果
      this.$emit("goBack", scanResult)
    },

    // html5-qrcode
    getCameras() {
      Html5Qrcode.getCameras()
        .then((devices) => {
          if (devices && devices.length) {
            this.html5QrCode = new Html5Qrcode(/** element id */"reader")
            console.log('开始扫码')
            this.start()
          }
        })
        .catch((err) => {
          // handle err
          // this.html5QrCode = new Html5Qrcode("reader")
          console.log('错误信息', err.name, err.message)
          console.log(err, typeof err)
          if (typeof err == 'string') {
            this.$toast(err)
          } else {
            if (err.name == 'NotAllowedError') return this.$toast("您需要授予相机访问权限")
            if (err.name == 'NotFoundError') return this.$toast('这个设备上没有摄像头')
            if (err.name == 'NotSupportedError') return this.$toast('摄像头访问只支持在安全的上下文中，如https或localhost')
            if (err.name == 'NotReadableError') return this.$toast('相机被占用')
            if (err.name == 'OverconstrainedError') return this.$toast('安装摄像头不合适')
            if (err.name == 'StreamApiNotSupportedError') return this.$toast('此浏览器不支持流API')
          }
        })
    },
    start() {
      this.html5QrCode
        .start(
          // environment后置摄像头 user前置摄像头
          { facingMode: "environment" },
          {
            fps: 2, // 可选，每秒帧扫描二维码
            qrbox: { width: 250, height: 250 }, // 可选，如果你想要有界框UI
            // aspectRatio: 1.777778 // 可选，视频馈送需要的纵横比，(4:3--1.333334, 16:9--1.777778, 1:1--1.0)传递错误的纵横比会导致视频不显示
          },
          (decodedText, decodedResult) => {
            // do something when code is read
            console.log('decodedText', decodedText)
            console.log('decodedResult', decodedResult)
            this.$emit("goBack", decodedText)
          }
        )
        .catch((err) => {
          console.log('扫码错误信息', err)
          this.$toast(err)
        })
    },
    stop() {
      this.html5QrCode.stop().then((ignore) => {
        // QR Code scanning is stopped.
        console.log("QR Code scanning stopped.")
      })
        .catch((err) => {
          // Stop failed, handle it.
          console.log("Unable to stop scanning.")
        })
    },


    // vue-qrcode-reader
    onDecode(result) {
      console.log(result)
      this.$emit('goBack', result)
    },
    async onInit(promise) {
      try {
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          // this.$toast("ERROR: you need to grant camera access permission")
          this.$toast("您需要授予摄像机访问权限")
        } else if (error.name === 'NotFoundError') {
          // this.$toast("ERROR: no camera on this device")
          this.$toast("这个设备上没有摄像头")
        } else if (error.name === 'NotSupportedError') {
          // this.$toast("ERROR: secure context required (HTTPS, localhost)")
          this.$toast("需要安全上下文(HTTPS, localhost)")
        } else if (error.name === 'NotReadableError') {
          // this.$toast("ERROR: is the camera already in use?")
          this.$toast("摄像机已经在使用了吗?")
        } else if (error.name === 'OverconstrainedError') {
          // this.$toast("ERROR: installed cameras are not suitable")
          this.$toast("安装的摄像头不合适")
        } else if (error.name === 'StreamApiNotSupportedError') {
          // this.$toast("ERROR: Stream API is not supported in this browser")
          this.$toast("此浏览器不支持流API")
        } else if (error.name === 'InsecureContextError') {
          // this.$toast(`ERROR: Camera access is only permitted in secure context. 
          // Use HTTPS or localhost rather than HTTP.`)
          this.$toast(`摄像头只能在安全环境下使用。使用HTTPS或本地主机，而不是HTTP`)
        } else {
          this.$toast(`ERROR: Camera error (${error.name})`)
        }
      }
    },
    paintBoundingBox(detectedCodes, ctx) {
      for (const detectedCode of detectedCodes) {
        const { boundingBox: { x, y, width, height } } = detectedCode
        ctx.lineWidth = 2
        ctx.strokeStyle = '#007bff'
        ctx.strokeRect(x, y, width, height)
      }
    }
  },

  // zxing/library
  // destroyed() {
  //   this.scanTextData.codeReader.reset() // 重置摄像头
  // }
}
</script>
 
<style lang="less" scoped>
// html5-qrcode
.qrcode {
  position: relative;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.1);
}
#reader {
  top: 12%;
  left: 0;
  // transform: translateY(-45%);
}

// 下面均是 zxing/library
.scan-box {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100vw;
  background-image: linear-gradient(
      0deg,
      transparent 24%,
      rgba(32, 255, 77, 0.1) 25%,
      rgba(32, 255, 77, 0.1) 26%,
      transparent 27%,
      transparent 74%,
      rgba(32, 255, 77, 0.1) 75%,
      rgba(32, 255, 77, 0.1) 76%,
      transparent 77%,
      transparent
    ),
    linear-gradient(
      90deg,
      transparent 24%,
      rgba(32, 255, 77, 0.1) 25%,
      rgba(32, 255, 77, 0.1) 26%,
      transparent 27%,
      transparent 74%,
      rgba(32, 255, 77, 0.1) 75%,
      rgba(32, 255, 77, 0.1) 76%,
      transparent 77%,
      transparent
    );
  background-size: 3rem 3rem;
  background-position: -1rem -1rem;
}

.scan-video {
  height: 100vh;
  width: 100vw;
  object-fit: cover;
}

.qr-scanner .box {
  width: 213px;
  height: 213px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  border: 0.1rem solid rgba(0, 255, 51, 0.2);
  /* background: url('http://resource.beige.world/imgs/gongconghao.png') no-repeat center center; */
}

.qr-scanner .line {
  height: calc(100% - 2px);
  width: 100%;
  background: linear-gradient(180deg, rgba(0, 255, 51, 0) 43%, #00ff33 211%);
  border-bottom: 3px solid #00ff33;
  transform: translateY(-100%);
  animation: radar-beam 2s infinite alternate;
  animation-timing-function: cubic-bezier(0.53, 0, 0.43, 0.99);
  animation-delay: 1.4s;
}

.qr-scanner .box:after,
.qr-scanner .box:before,
.qr-scanner .angle:after,
.qr-scanner .angle:before {
  content: "";
  display: block;
  position: absolute;
  width: 3vw;
  height: 3vw;
  border: 0.2rem solid transparent;
}

.qr-scanner .box:after,
.qr-scanner .box:before {
  top: 0;
  border-top-color: #00ff33;
}

.qr-scanner .angle:after,
.qr-scanner .angle:before {
  bottom: 0;
  border-bottom-color: #00ff33;
}

.qr-scanner .box:before,
.qr-scanner .angle:before {
  left: 0;
  border-left-color: #00ff33;
}

.qr-scanner .box:after,
.qr-scanner .angle:after {
  right: 0;
  border-right-color: #00ff33;
}

@keyframes radar-beam {
  0% {
    transform: translateY(-100%);
  }

  100% {
    transform: translateY(0);
  }
}

.scan-tip {
  width: 100vw;
  text-align: center;
  margin-bottom: 5vh;
  color: white;
  font-size: 5vw;
  position: absolute;
  bottom: 50px;
  left: 0;
  color: #fff;
}

.page-scan {
  overflow-y: hidden;
}
</style>