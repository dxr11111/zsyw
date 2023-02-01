<template>
  <!-- 签名 -->
  <div class="signature" @click="clickS">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <!-- 用户回执 -->
    <div class="userReceipt">
      <span class="logo"></span>
      <span>用户回执</span>
    </div>
    <!-- 画布 -->
    <div class="canvas">
      <canvas id="myCanvas"></canvas>
    </div>
    <div class="buttonRegion">
      <van-button round type="info" plain>清空</van-button>
      <van-button round type="info">确定</van-button>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'Signature',
  data () {
    return {
      headName: ' 签名',
      // 触摸事件参数
      touchPressed: false,
      ctx: null,
      strokeStyle: "#000000", //书写颜色
      lineWidth: 4, //线条宽度
      lastX: null, // 连线初始位置
      lastY: null,
      canvas: null, // 画布
    }
  },
  methods: {
    // 回退
    goBackFn () {
      this.$router.go(-1)
    },
    // 旋转屏幕后修改div尺寸
    setLandScape () {
      var width = document.documentElement.clientWidth;
      var height = document.documentElement.clientHeight;
      if (width < height) {
        // console.log(width + " " + height);
        $(".signature").width(height);
        $(".signature").height(width);
        $(".signature").css("top", (height - width) / 2);
        $(".signature").css("left", 0 - (height - width) / 2);
      }
    },
    // test
    clickS (e) {
      console.log(e.pageY, e.pageX)

    },
    // 初始化canvas
    initCanvas () {
      let canvas = document.getElementById("myCanvas");
      // 设置画布宽高
      canvas.width = document.documentElement.clientHeight
      canvas.height = 260
      this.canvas = canvas
      this.ctx = canvas.getContext("2d")
      // this.ctx.scale(-1, 1); //左右镜像翻转

      // 移动前
      this.canvas.addEventListener(
        "touchstart",
        (event) => {
          if (event.targetTouches.length == 1) {
            event.preventDefault(); // 阻止浏览器默认事件，重要
            let touch = event.targetTouches[0];
            this.touchPressed = true;
            console.log('touch.pageX', touch.pageY)
            // let a = this.canvas.offsetTop + this.canvas.height
            console.log('touch.pageY', touch.pageX)
            // this.canvas.offsetTop  header组件的高度
            // console.log('this.canvas.offsetTop', this.canvas.offsetTop)
            // console.log('this.canvas.offsetLeft', this.canvas.offsetLeft)
            this.draw(
              // touch.pageX - this.canvas.offsetLeft,
              // touch.pageY - this.canvas.offsetTop,
              242,
              touch.pageX,
              false
            );
          }
        },
        false
      );
      // 移动中
      this.canvas.addEventListener(
        "touchmove",
        (event) => {
          if (event.targetTouches.length == 1) {
            event.preventDefault(); // 阻止浏览器默认事件，重要
            let touch = event.targetTouches[0];
            if (this.touchPressed) {
              this.draw(
                242,
                touch.pageX,
                true
              );
            }
          }
        },
        false
      );
      // 移动结束
      this.canvas.addEventListener(
        "touchend",
        (event) => {
          if (event.targetTouches.length == 1) {
            event.preventDefault(); // 阻止浏览器默认事件，防止手写的时候拖动屏幕，重要
            this.touchPressed = false;
          }
        },
        false
      );
    },
    // 画图
    draw (x, y, isDown) {
      let ctx = this.ctx;
      if (isDown) {
        ctx.beginPath();
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.lineJoin = "round";
        ctx.moveTo(this.lastX, this.lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
      }
      this.lastX = x;
      this.lastY = y;
    },
  },
  mounted () {
    this.setLandScape(); // 旋转屏幕
    this.initCanvas(); // 初始化canvas
    let ctx = this.ctx;
    ctx.beginPath();
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = this.lineWidth;
    ctx.lineJoin = "round";
    ctx.moveTo(582, 272)
    ctx.lineTo(642, 248)
    ctx.closePath();
    ctx.stroke();
  }

}
</script>

<style scoped lang="less">
// viewport 处于纵向，即高度大于等于宽度。
@media screen and (orientation: portrait) {
  .signature {
    position: absolute;
    transform: rotate(90deg);
    transform-origin: center;
    overflow: auto;
  }
}
.signature {
  background-color: #fff;
  .userReceipt {
    z-index: 1;
    position: fixed;
    top: 15px;
    right: 10px;
    display: flex;
    height: 30px;
    color: #fff;
    span {
    }
    .logo {
      width: 20px;
      height: 20px;
      border-radius: 20px;
      background: #98fb98;
      display: inline-block;
      margin-right: 10px;
      &::before,
      &::after {
        content: '';
        width: 3px; // 对钩粗细
        border-radius: 10px; // 对钩边缘圆角
        background: #228b22;
        position: absolute;
      }

      &::after {
        height: 14px;
        top: 3px;
        left: 10px;
        transform: rotate(45deg); // 旋转角度
        -ms-transform: rotate(45deg); // ie浏览器
      }
      &::before {
        height: 7px;
        top: 9px;
        left: 4px;
        transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);
      }
    }
  }
  .buttonRegion {
    display: flex;
    justify-content: space-around;
    position: fixed;
    bottom: 30px;
    width: 100%;
    .van-button {
      width: 40%;
    }
  }
}
</style>