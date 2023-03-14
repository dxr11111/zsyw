<template>
  <div style="height: 100%; width: 100%">
    <MyHeader :name="'扫码'" left="arrow-left" @goBackEv="$emit('goBack')" />
    <!-- <qrcode-stream
      :key="_uid"
      :track="this.paintBoundingBox"
      @decode="onDecode"
      @init="onInit"
    /> -->

    <div class="qrcode">
      <div id="reader"></div>
    </div>
  </div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'
import { Html5Qrcode } from "html5-qrcode"
export default {
  components: { QrcodeStream },
  data() {
    return {
      html5QrCode: null
    }
  },
  created() {
    this.getCameras()
  },
  beforeDestroy() {
    if (this.html5QrCode) this.stop()
  },
  methods: {
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
  }
}
</script>
 
<style lang="less" scoped>
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
</style>