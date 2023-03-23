<template>
  <div class="container">
    <MyHeader
      :name="setOrCheck ? '设置手势密码' : '手势登录'"
      left="arrow-left"
      @goBackEv="setOrCheck ? $emit('goBack') : $router.go(-1)"
    />
    <div class="pattern-lock">
      <div :class="setOrCheck ? 'pattern' : 'login-size'" ref="showPattern">
        <canvas id="canvasShow" />
      </div>
      <!-- 手势解锁登录页头像和用户名 -->
      <div class="login-info" v-if="!setOrCheck">
        <div class="avatar">
          <van-icon name="manager" size="62" style="line-height: 80px" />
        </div>
        <div class="username">{{ userName }}</div>
      </div>
      <div class="tips">
        <div class="input-tips">
          <p>{{ setAgain ? "请再次绘制解锁图案" : "请绘制解锁图案" }}</p>
          <div
            class="guide"
            :style="{ display: tooEasy || !isFit ? 'block' : 'none' }"
          >
            <p class="guide-tips">
              {{
                isFit
                  ? "至少连接4个点,请重新绘制"
                  : "两次绘制图案不一致,请重新绘制"
              }}
            </p>
          </div>
        </div>
      </div>
      <div class="draw-pattern" ref="drawPattern">
        <canvas id="canvas" />
      </div>
      <!-- 手势解锁登录页更多 -->
      <div class="more" v-if="!setOrCheck" @click="moreListShow = true">
        更多
      </div>
      <More
        v-if="moreListShow"
        :moreListShow="moreListShow"
        :isLogin="false"
        @changeMoreShow="moreListShow = false"
      />
    </div>
  </div>
</template>
<script>
import { getItem } from "@/utils/public/sessionStorage";
export default {
  props: {
    // 设置或验证手势密码页面设置true或者false
    setOrCheck: {
      type: Boolean,
      default: true,
    },
    // 密码
    passWord: {
      type: Array,
      default: [],
    },
    // 手势登录用户名
    // username: {
    //   type: String,
    //   default: '管理员'
    // }
  },
  components: {
    More: () => import("@/components/loginMore/index.vue"),
  },
  data() {
    return {
      // isLoginInfo: false,
      userName: getItem("loginNo") || "",
      moreListShow: false, // 控制更多组件

      pointerArr: [], // 绘制路径
      startX: 0,
      startY: 0, // 线条起始点
      puts: [], // 经过的九个点的数组
      currentPointer: null, // 当前点是否已经连接
      // pwd: [],// 密码
      confirmPwd: [], // 确认密码
      unlockFlag: false, // 是否解锁的标志
      isMouseDown: false,
      arr: [], // 九个点的坐标数组
      canvas: null, // 下方画布
      ctx: null,
      width: null,
      height: null,
      canvasShow: null, // 上方画布
      ctxshow: null,
      widthShow: null,
      heightShow: null,

      patternPassWord: [],
      // setOrCheck: true,// 设置或验证手势密码页面设置true获取false
      tooEasy: false, // 至少连接4个点
      setAgain: false, //  再次设置手势
      isFit: true, // 第二次设置手势是否与第一次一致
    };
  },
  created() {
    // this.setOrCheck = this.passWord.length > 0 ? true : false
    // if (getItem("loginInfo")?.loginNo) {
    //   this.isLoginInfo = true
    // }
  },
  mounted() {
    let _this = this;
    this.$nextTick(function () {
      // 初始化界面
      _this.initDidMounted();
      _this.init(true);
      _this.initEvent();
    });
  },
  methods: {
    initDidMounted() {
      this.canvas = document.getElementById("canvas"); // 绘制手势画布
      this.ctx = this.canvas.getContext("2d"); // 得到画布的上下文对象
      this.canvas.width = this.$refs.drawPattern.clientWidth;
      this.canvas.height = this.$refs.drawPattern.clientHeight;
      this.width = this.canvas.width;
      this.height = this.canvas.height; // 画布的宽高

      this.canvasShow = document.getElementById("canvasShow"); // 手势展示的画布
      this.ctxshow = this.canvasShow.getContext("2d");
      this.canvasShow.width = this.$refs.showPattern.clientWidth;
      this.canvasShow.height = this.$refs.showPattern.clientHeight;
      this.widthShow = this.canvasShow.width;
      this.heightShow = this.canvasShow.height; // 画布的宽高

      console.log(this.canvas.offsetTop, this.width, this.height);
      // 九宫格中9个点的坐标对象
      const lockCicle = {
        x: 0, // x坐标
        y: 0, // y坐标
        showX: 0, // 手势展示的点坐标
        showY: 0,
        color: "#999999",
        state: "1", // 当前点状态,是否已经被链接过
        stateShow: "1", // 手势展示的点状态
      };
      const offset = (this.width - this.height) / 2; // 计算偏移量
      this.arr = []; // 九个点的坐标数组
      // 计算九个点坐标
      for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 3; j++) {
          const lockCicle = {};
          if (offset > 0) {
            // 横屏
            lockCicle.x = (this.height / 4) * j + Math.abs(offset);
            lockCicle.y = (this.height / 4) * i - this.height / 5;
            lockCicle.state = 0;
            lockCicle.stateShow = 0;
          } else {
            // 竖屏
            lockCicle.x = (this.width / 4) * j;
            lockCicle.y =
              (this.width / 4) * i + Math.abs(offset) - this.height / 5;
            lockCicle.state = 0;
            lockCicle.stateShow = 0;
          }
          lockCicle.showX = (this.heightShow / 4) * j;
          lockCicle.showY = (this.heightShow / 4) * i;
          this.arr.push(lockCicle);
        }
      }
      // // 初始化界面
      // function init () {
      //   this.ctx.clearRect(0, 0, this.width, this.height); // 清空画布
      //   this.ctxshow.clearRect(0, 0, this.widthShow, this.heightShow);
      //   this.pointerArr = []; // 清除绘制路径
      //   for (let i = 0; i < this.arr.length; i++) {
      //     this.arr[i].state = 0; // 清除绘制状态
      //     this.arr[i].stateShow = 0;
      //     this.drawInitPointer(i);
      //   }
      // }
      // 初始化界面
      // init();
      // *****
      // 绘制九宫格解锁界面
      // *****
      // function drawPointer (i) {
      //   this.ctx.save();
      //   this.ctxshow.save();
      //   const radius = this.width / 12;
      //   let _fillStyle = "#ccc";
      //   let _strokeStyle = "#ccc";
      //   let _strokeStyleShow = "#ccc";
      //   if (this.arr[i].state == 1) {   // 不同状态显示不同颜色
      //     _strokeStyle = "#0286fa";
      //     _fillStyle = "#0286fa";
      //   }
      //   if (this.arr[i].stateShow == 1) {
      //     _strokeStyleShow = "#0286fa";
      //   }
      //   // 绘制原点
      //   this.ctx.beginPath();  // 起始一条路径
      //   this.ctx.fillStyle = _fillStyle;   // 填充颜色
      //   this.ctx.arc(this.arr[i].x, this.arr[i].y, 6, 0, Math.PI * 2, false);    // 创建曲线 false顺时针
      //   this.ctx.fill();
      //   this.ctx.closePath();   // 创建从当前点回到起始点的路径
      //   // 绘制手势展示的原点
      //   this.ctxshow.beginPath();
      //   this.ctxshow.fillStyle = _strokeStyleShow;
      //   this.ctxshow.arc(this.arr[i].showX, this.arr[i].showY, 4, 0, Math.PI * 2, false);
      //   this.ctxshow.fill();
      //   this.ctxshow.closePath();
      //   // 绘制圆圈
      //   this.ctx.beginPath();
      //   this.ctx.strokeStyle = _strokeStyle;
      //   this.ctx.lineWidth = 0.3;
      //   this.ctx.arc(arr[i].x, arr[i].y, radius, 0, Math.PI * 2, false);
      //   this.ctx.stroke();
      //   this.ctx.closePath();
      //   this.ctx.restore();   // 返回之前保存过的路径状态和属性
      // }
    },

    // 初始化界面
    init(flag) {
      // flag：true表示需要格式化展示用的九宫格路径，false表示不需要
      this.ctx.clearRect(0, 0, this.width, this.height); // 清空画布
      if (flag) {
        this.ctxshow.clearRect(0, 0, this.widthShow, this.heightShow);
      }
      this.pointerArr = []; // 清除绘制路径
      for (let i = 0; i < this.arr.length; i++) {
        this.arr[i].state = 0; // 清除绘制状态
        if (flag) {
          this.arr[i].stateShow = 0;
        }
        this.drawPointer(i, flag);
      }
    },

    drawPointer(i, flag) {
      const radius = this.width / 12;
      let _fillStyle = "#ccc";
      let _strokeStyle = "#ccc";
      let _strokeStyleShow = "#ccc";
      // 不同状态显示不同颜色
      if (this.arr[i].state == 1) {
        _strokeStyle = "#0286fa";
        _fillStyle = "#0286fa";
      }
      if (this.arr[i].stateShow == 1) {
        _strokeStyleShow = "#0286fa";
      }
      // 绘制原点
      this.ctx.save();
      this.ctx.beginPath(); // 起始一条路径
      this.ctx.fillStyle = _fillStyle; // 填充颜色
      this.ctx.arc(this.arr[i].x, this.arr[i].y, 6, 0, Math.PI * 2, false); // 创建曲线 false顺时针
      this.ctx.fill();
      this.ctx.closePath(); // 创建从当前点回到起始点的路径
      // 绘制圆圈
      this.ctx.beginPath();
      this.ctx.strokeStyle = _strokeStyle;
      this.ctx.lineWidth = 0.3;
      this.ctx.arc(this.arr[i].x, this.arr[i].y, radius, 0, Math.PI * 2, false);
      this.ctx.stroke();
      this.ctx.closePath();
      this.ctx.restore(); // 返回之前保存过的路径状态和属性
      if (flag) {
        // 绘制手势展示的原点
        this.ctxshow.save();
        this.ctxshow.beginPath();
        this.ctxshow.fillStyle = _strokeStyleShow;
        this.ctxshow.arc(
          this.arr[i].showX,
          this.arr[i].showY,
          4,
          0,
          Math.PI * 2,
          false
        );
        this.ctxshow.fill();
        this.ctxshow.closePath();
      }
    },

    // 绘制连接线的方法，将坐标数组中的点绘制在canvas画布中
    drawLinePointer(x, y, flag) {
      // 绘制点到点的线
      this.ctx.clearRect(0, 0, this.width, this.height); // 清空画布
      this.ctx.save(); // 保存当前环境的状态
      this.ctx.beginPath();
      this.ctx.strokeStyle = "#0286fa";
      this.ctx.lineWidth = 6;
      // 设置或返回线条的结束端点样式
      this.ctx.lineCap = "round";
      // 相交时的拐角类型
      this.ctx.lineJoin = "round";
      for (var i = 0; i < this.pointerArr.length; i++) {
        if (i == 0) {
          this.ctx.moveTo(this.pointerArr[i].x, this.pointerArr[i].y);
        } else {
          this.ctx.lineTo(this.pointerArr[i].x, this.pointerArr[i].y);
        }
      }
      this.ctx.stroke();
      this.ctx.closePath();
      this.ctx.restore();
      // 保存经过的点
      for (var i = 0; i < this.arr.length; i++) {
        this.drawPointer(i, true); // 绘制圆圈和原点
        // isPointInPath判断点(x, y)是否在路径中，有则返回true，否则返回false；同时判断该点是否已经经过
        if (
          this.ctx.isPointInPath(x, y) &&
          this.currentPointer != i &&
          this.puts.indexOf(i + 1) < 0
        ) {
          this.pointerArr.push({
            x: this.arr[i].x,
            y: this.arr[i].y,
          });
          this.currentPointer = i;
          this.puts.push(i + 1); // 保存该坐标点到路径数组中
          this.startX = this.arr[i].x;
          this.startY = this.arr[i].y;
          this.arr[i].state = 1;
          if (!this.setAgain) {
            // 第二次设置手势，小九宫格不再做相应改变
            this.arr[i].stateShow = 1;
          }
        }
      }
      // 绘制点到当前鼠标坐标的线
      if (flag) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.globalCompositeOperation = "destination-over"; // 在源图像上方显示目标图像
        this.ctx.strokeStyle = "#e2e0e0";
        this.ctx.lineWidth = 6;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(this.x, this.y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.restore();
      }
    },

    // 绘制密码事件
    initEvent() {
      // 阻止浏览器左右滑行为
      // let startX = null;
      // let startY = null;
      let _this = this;
      // 开始触摸
      this.canvas.addEventListener("touchstart", function (e) {
        _this.isMouseDown = true;
        const x1 = e.targetTouches[0].pageX;
        const y1 = e.targetTouches[0].pageY - _this.canvas.offsetTop;
        _this.drawLinePointer(x1, y1, false);

        // startX = e.targetTouches[0].pageX
        // startY = e.targetTouches[0].pageY
      });
      // 手指滑动九宫格
      this.canvas.addEventListener(
        "touchmove",
        function (e) {
          if (_this.isMouseDown) {
            const x1 = e.targetTouches[0].pageX;
            const y1 = e.targetTouches[0].pageY - _this.canvas.offsetTop;
            _this.drawLinePointer(x1, y1, true);
          }

          // var moveX = e.targetTouches[0].pageX
          // var moveY = e.targetTouches[0].pageY
          // if (Math.abs(moveX - startX) > Math.abs(moveY - startY)) {
          //   e.preventDefault()
          // }
        }
        // ,{ passive: false }
      );
      // 触摸结束
      this.canvas.addEventListener("touchend", function (e) {
        _this.drawLinePointer(0, 0, false);
        _this.isMouseDown = false;
        _this.pointerArr = [];
        // 设置手势密码页面
        if (_this.setOrCheck) {
          if (_this.puts.length >= 4) {
            _this.tooEasy = false;
            if (_this.setAgain) {
              // 第二次设置手势
              if (
                JSON.stringify(_this.puts) ==
                JSON.stringify(_this.patternPassWord)
              ) {
                _this.setAgain = false;
                _this.isFit = true;
                _this.$toast("手势密码设置成功");
                // 设置成功之后返回到上一页
                _this.$emit("goBack", _this.puts);
              } else {
                // _this.$toast("两次绘制图案不一致，请重新绘制")
                _this.setAgain = false;
                _this.isFit = false;
                // 两次绘制不一致，延时两秒后重新绘制
                setTimeout(() => {
                  {
                    _this.isFit = true;
                  }
                }, 3000);
              }
              console.log(
                _this.puts,
                _this.patternPassWord,
                JSON.stringify(_this.puts) ==
                  JSON.stringify(_this.patternPassWord),
                "第二次设置手势"
              );
              _this.init(true);
            } else {
              // 第一次设置手势
              _this.setAgain = true;
              _this.patternPassWord = _this.puts;
              _this.init(false);
            }
            console.log(`你的图案密码是: [   ${_this.puts.join(" > ")}   ]`);
            _this.init(false);
          } else if (_this.puts.length >= 1) {
            // _this.$toast('至少连接四个点，请重新绘制')
            _this.tooEasy = true;
            if (_this.setAgain) {
              _this.init(false);
            } else {
              _this.init(true);
            }
          }
        } else {
          // 验证手势页面
          if (_this.puts.length >= 4) {
            _this.tooEasy = false;
            if (JSON.stringify(_this.puts) == JSON.stringify(_this.passWord)) {
              _this.$toast("密码解锁成功");
              // _this.$router.push("/main")
              _this.login();
            } else {
              _this.$toast("密码错误, 请重新输入");
            }
            console.log(
              "你输入的密码：",
              JSON.stringify(_this.puts),
              "实际密码：",
              JSON.stringify(_this.passWord)
            );
            _this.init(true);
          } else if (this.puts.length >= 1) {
            // this.$toast('至少连接四个点，请重新绘制')
            _this.tooEasy = true;
            _this.init(true);
          }
        }
        _this.puts = [];
      });
    },
    async login() {
      let postData = {
        loginNo: localStorage.getItem("loginNo"),
        password: localStorage.getItem("userPwd"),
        userToken: "",
        tokenId: "",
      };
      let result = await this.$store.dispatch(
        "getLoginInfo",
        JSON.stringify(postData)
      );
      console.log("登录结果", result);
      this.apiResponse(result, ".container", () => {
        this.$router.push("/main");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  // 阻止浏览器上下左右滑动行为
  touch-action: none;
  // touch-action: pan-y;

  width: 100%;
  height: 100%;
  background: #ffffff;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  min-height: 1%;
  overflow-x: hidden;
  overflow-y: hidden;
  .pattern-lock {
    width: 100%;
    height: 100%;
    // padding-top: 100px;
    .pattern {
      width: 110px;
      height: 110px;
      margin: 0 auto;
    }
    // 登录页面上方画布大小
    .login-size {
      width: 70px;
      height: 70px;
      margin: 0 auto;
    }
    // 登录页用户信息
    .login-info {
      .avatar {
        width: 80px;
        height: 80px;
        line-height: 80px;
        margin: auto;
        font-size: 32px;
        color: #fff;
        border-radius: 40px;
        background: #85b3cf;
      }
      .username {
        font-size: 18px;
        margin: 8px 0;
      }
    }
    .tips {
      width: 100%;
      .input-tips {
        font-size: 16px;
        text-align: center;
        .guide {
          height: 28px;
          line-height: 28px;
          // margin-top: 12px;
          .guide-tips {
            font-size: 12px;
            color: #e91919;
            &.hide {
              display: none;
            }
          }
        }
      }
    }
    // 下方画布
    .draw-pattern {
      width: 100%;
      height: 430px;
    }
    // 登录页更多
    .more {
      position: fixed;
      bottom: 15%;
      left: 0;
      right: 0;
    }
  }
}
</style>