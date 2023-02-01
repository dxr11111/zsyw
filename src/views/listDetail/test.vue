<template>
  <div>
    <!-- 此处是要截取的图片 -->
    <div id="imgDownload" ref="QRcodeSrcImg" @click="maskShow = false">
      <div class="box">
        <canvas id="QRCode"></canvas>
        <p class="text">扫描二维码</p>
      </div>
    </div>
    <!-- 此处是储存截取后的图片 -->
    <div class="photoShow" v-if="photoShow">
      <div id="photo">
        <p>长按图片保存</p>
        <img :src="photoUrl" id="img" alt="" />
        <!-- <span>长按图片保存和分享</span> -->
      </div>
    </div>
    <!-- 此处是保存到本地的方法 -->
    <div class="bottom" @click="imgDownload()">
      <div style="text-align: center">
        <p style="font-size: 1.4rem; margin-top: 10px; color: #a5a4a4">
          保存到本地
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import html2canvas from "html2canvas"
export default {
  data () {
    return {
      photoUrl: "",
      photoShow: false
    }
  },
  methods: {
    // 图片保存方法
    imgDownload () {
      console.log('2222222,保存图片')

      let _this = this;
      _this.photoShow = true;
      // 声明一个画布元素,存储需下载图片范围
      let canvas = document.createElement("canvas");
      // 获取需下载范围元素
      let img = this.$refs["QRcodeSrcImg"];
      // 图片高度
      var w = parseInt(window.getComputedStyle(img).width);
      // 图片宽度
      var h = parseInt(window.getComputedStyle(img).height);
      // 声明画布宽高
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      // console.log(w, h);
      // let context = canvas.getContext("2d");
      // context.scale(2, 2);
      // 利用 html2canvas 下载 canvas
      html2canvas(img, { canvas: canvas }).then(function (canvas) {
        _this.photoUrl = canvas.toDataURL()
      });
    }
  }
}
</script>
<style lang="less" scoped>
.photoShow {
  background: rgba(0, 0, 0, 0.616);
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  #photo {
    //保存图片容器大小
    width: 250px;
    img {
      display: block;
      width: 100%;
    }
  }
}
#imgDownload {
  width: 300px;
  height: 300px;
  background: red;
}
</style>