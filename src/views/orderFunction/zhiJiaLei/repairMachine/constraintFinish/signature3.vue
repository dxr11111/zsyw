<template>
  <!-- 签名 -->
  <div class="recruit-canvas">
    <!-- 头部 -->
    <div class="head">
      <MyHeader name="签名" left="arrow-left" />
      <!-- 用户回执 -->
      <div class="userReceipt">
        <span class="logo"></span>
        <span>用户回执</span>
      </div>
    </div>

    <!-- 画布区域 -->
    <div class="canvas-box" ref="canvasRef">
      <canvas ref="canvasMapRef"></canvas>
    </div>

    <!-- 按钮区域 -->
    <div class="btn-box">
      <span class="del-btn" @click="clearCanvasHandle">清除</span>
      <span class="sure-btn" @click="makeCanvasHandle">确认</span>
      <span class="sure-btn" @click="saveImg">保存</span>
    </div>
  </div>
</template>

<script>
import SignaturePad from "signature_pad";
import { rotateBase64Img } from "@/utils/public/common";

export default {
  name: "Signature",
  data() {
    return {
      canvasNode: null,
      previewImage: null,
    };
  },
  mounted() {
    this.initalHandle();
    window.addEventListener("resize", this.initalHandle, false);
  },
  methods: {
    initalHandle() {
      const _canvasBox = this.$refs.canvasRef;
      const _canvas = this.$refs.canvasMapRef;
      if (!_canvasBox || !_canvas) {
        return false;
      }

      // _canvas.width = _canvasBox.clientWidth
      // _canvas.height = _canvasBox.clientHeight

      _canvas.width = _canvasBox.clientWidth;
      _canvas.height = _canvasBox.clientHeight;

      this.clearCanvasHandle();
      this.canvasNode = new SignaturePad(_canvas, {
        minWidth: 2,
        maxWidth: 2,
        penColor: "rgb(0, 0, 0)",
      });
    },

    clearCanvasHandle() {
      if (this.canvasNode) {
        this.canvasNode.clear();
        this.previewImage = null;
      }
    },

    makeCanvasHandle() {
      const canvasNode = this.canvasNode;
      // 重新初始化画布
      if (!canvasNode) {
        this.initalHandle();
      }

      // 是否签字
      if (canvasNode.isEmpty()) {
        this.$toast("您还没有签名");
        return false;
      }

      // 图像旋转二次处理
      // 获取屏幕宽高
      const _boxWidth = window.innerWidth;
      const _boxHeight = window.innerHeight;
      const _signImg = canvasNode.toDataURL("image/png", 0.6);
      if (_boxWidth < _boxHeight) {
        rotateBase64Img(_signImg, -90, (imgUrlRes) => {
          this.previewImage = imgUrlRes;
        });
      } else {
        this.previewImage = _signImg;
      }
      // this.previewImage = _signImg

      // upload ajax
      // do something here
    },
    // test
    saveImg() {
      let a = document.createElement("a");
      a.href = this.previewImage;
      a.download = "sign";
      a.click(); //保存
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.initalHandle, false);
  },
};
</script>

<style lang='less' scoped>
.recruit-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .canvas-box,
  .btn-box,
  .head {
    position: absolute;
    top: 50%;
    z-index: 100;
  }
  .canvas-box {
    left: 40px;
    height: 80vh;
    width: 70vw;
    overflow: hidden;
    border: 1px dashed #d4d4d4;
    transform: translateY(-50%);
    background-color: #fff;
    #canvas-map {
      width: 100%;
      height: 100%;
    }
  }
  .btn-box {
    left: -43%;
    z-index: 1000;
    text-align: center;
    transform: rotate(90deg);
    .del-btn,
    .sure-btn {
      display: inline-block;
      width: 100px;
      height: 24px;
      margin: 0 10px;
      line-height: 24px;
      border-radius: 6px;
      background-color: red;
    }
  }
  .head {
    z-index: 1000;
    top: 394px;
    width: 844px;
    left: -57px;
    right: 0;
    height: 50px;
    transform: rotate(90deg);
    transform-origin: center;
    overflow: auto;
  }
}
</style>