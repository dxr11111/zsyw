<template>
  <div id="app">
    <keep-alive :include="keepPages">
      <router-view v-if="refreshing"></router-view>
    </keep-alive>

    <!-- 装机单回复-强制回单posCodeSign弹出层 -->
    <IomNewFinishPosCode
      v-if="$store.state.button.iomNewFinishPosCode.posCodePopShow"
    />
    <!-- 装机单修改客户电话弹出层 -->
    <EditCustPhone v-if="$store.state.button.editCustPhone.editCustPhoneShow" />
    <!-- 任务回复finishTask弹出层 -->
    <FinishTask v-if="$store.state.button.finishTask.popShow" />
    <!-- 获取经纬度弹出层 -->
    <Location v-if="$store.state.button.getLocalPopup.isShow" />
    <!-- 我已到达-随销单生成提示 -->
    <ArriveTips v-if="$store.state.button.arriveTipsShow" />
    <!-- 检查更新弹出层 -->
    <CheckUpdatesVersion v-if="$store.state.checkUpdatesPop.popShow" />

    <!-- 路由过渡 -->
    <!--  <transition :name="transitionName" v-if="isTransition">
      <router-view class="child-view" :key="$route.name"></router-view>
    </transition> -->

    <!-- 加载提示 -->
    <MyLoading v-if="isLoading" />
  </div>
</template>

<script>
import MyLoading from "@/components/myLoading";
import IomNewFinishPosCode from "@/views/orderFunction/zhiJiaLei/installMachineIDM/finish/components/iomNewFinishPosCode.vue";
import EditCustPhone from "@/views/orderFunction/zhiJiaLei/installMachineIDM/editCustPhone";
import FinishTask from "@/views/orderFunction/publicOrder/finishTask.vue";
import Location from "@/views/orderFunction/publicOrder/getLocation.vue";
import ArriveTips from "@/views/orderFunction/publicOrder/arriveTips.vue";
import CheckUpdatesVersion from "@/views/orderFunction/publicRoute/checkUpdatesVersion.vue";
import { mapState } from "vuex";
import judgeProject from "@/utils/public/judgeProject";
import { judgeDeviceType } from "@/utils/public/judgeDeviceType";
import { setItem } from "@/utils/public/sessionStorage";
import myNJS from "@/utils/public/myNJS";

export default {
  name: "App",
  components: {
    MyLoading,
    IomNewFinishPosCode,
    EditCustPhone,
    FinishTask,
    Location,
    ArriveTips,
    CheckUpdatesVersion,
  },
  data() {
    return {
      // 路由过渡
      // transitionName: '',
      // isTransition: false,
      refreshing: true, // 控制路由刷新
      g_wakelock: null, // 控制系统休眠状态
      p: null, // 音频播放对象
    };
  },
  computed: {
    ...mapState(["isLoading"]),
    keepPages() {
      return this.$store.state.keepPages;
    },
  },

  watch: {
    // 监视路由变化
    $route: {
      handler(val) {
        // 判断当前项目是建维优还是联通网络
        judgeProject();
        // 判断当前设备信息，判断是否增加头部高度
        // this.judgeAddHead();
        judgeDeviceType();
      },
    },
    // 路由过渡
    // #region
    /*     $route (to, from) {
          if (to.meta.index > from.meta.index) {
            this.transitionName = 'slide-left'
            console.log(from.name, to.name, 'slide-left')
          } else if (to.meta.index < from.meta.index) {
            this.transitionName = 'slide-right'
            console.log(from.name, to.name, 'slide-right')
          } else {
            this.transitionName = ''
          }
        },
        '$route.name': {
          handler (value) {
            if (value == 'Login' || value == 'Welcome') {
              // 欢迎页到登录页的路由要做过渡
              this.isTransition = true
            } else {
              this.isTransition = false
            }
    
          }
        } */
    //#endregion
  },
  provide() {
    return {
      reload: this.onReload,
    };
  },

  methods: {
    //刷新单个路由
    onReload(removeName) {
      this.$store.commit("removeThisPage", removeName);
      this.refreshing = false;
      this.$nextTick(() => {
        this.refreshing = true;
      });
    },
    // 判断移动端还是pc端
    isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      if (flag) {
        // 判断移动端机型
        var u = navigator.userAgent;
        var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        let system = null;
        if (isAndroid) {
          this.$store.commit("changeClientId", 9);
          this.$store.commit("changeMobileType", 1);

          // 获取系统版本
          let m1 = navigator.userAgent.match(/Android.*?(?=;)/);
          if (m1 && m1.length > 0) {
            system = m1[0];
          }
        } else {
          this.$store.commit("changeClientId", 10);
          this.$store.commit("changeMobileType", 2);

          // ios 获取系统版本
          let m1 = navigator.userAgent.match(/iPhone OS .*?(?= )/);
          if (m1 && m1.length > 0) {
            system = m1[0];
          }
        }
        console.log("手机系统版本", system);
      } else {
        // pc端
        this.$store.commit("changeClientId", 11);
        this.$store.commit("changeMobileType", 3);
      }
    },
    // H5 plus事件处理
    dedecmsok() {
      judgeDeviceType(); // 获取版本信息，判断是否增加头部

      /* // 使android手机锁屏或切换应用后app一直在后台运行
      if (plus.os.name === "Android") {
        function changeWakeLock() {
          if (document.visibilityState == "visible") {
            if (this.p) {
              this.p.close(); // 关闭音频播放对象
            }

            console.log(
              "欢迎回来",
              new Date(+new Date() + 8 * 3600 * 1000)
                .toJSON()
                .substr(0, 19)
                .replace("T", " ")
            );
            this.releaseWakeLock();
            // 调用通知点击
            myNJS.aOSReceive();
          }
          if (document.visibilityState == "hidden") {
            // 播放一段提示语音
            this.p = plus.audio.createPlayer({
              src: "http://demo.dcloud.net.cn/test/audio/apple.mp3",
              autoplay: true,
              backgroundControl: true,
              loop: true,
            });
            this.p.play(
              function () {
                console.log("Audio play success!");
              },
              function (e) {
                console.log("Audio play failed: " + e.message);
              }
            );

            console.log(
              "不要走！",
              new Date(+new Date() + 8 * 3600 * 1000)
                .toJSON()
                .substr(0, 19)
                .replace("T", " ")
            );
            // 主动后台运行
            var main = plus.android.runtimeMainActivity();
            main.moveTaskToBack(false);
            this.wakeLock();
          }
        }
        document.addEventListener(
          "visibilitychange",
          changeWakeLock.bind(this)
        );
      } */
    },

    // 判断是否要增加头部高度
    /*  judgeAddHead() {
      // 判断当前所在的项目是建维优还是联通网络
      if (this.$store.state.projectFlag == 1) {
        // 建维优
        // 判断当前是ios/android/web
        if (this.$store.state.clientId == 11) {
          // web端
          this.$store.commit("changeAddHead", false);
        } else {
          // 移动端
          this.$store.commit("changeAddHead", true);
        }
      } else {
        // 联通网络
        this.$store.commit("changeAddHead", false);
      }
    }, */

    //允许程序后台运行，以持续获取GPS位置
    wakeLock() {
      //Android
      var g_wakelock = this.g_wakelock;
      var main = plus.android.runtimeMainActivity();
      var Context = plus.android.importClass("android.content.Context");
      var PowerManager = plus.android.importClass("android.os.PowerManager");
      var pm = main.getSystemService(Context.POWER_SERVICE);
      g_wakelock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "ANY_NAME");
      g_wakelock.acquire();
    },
    //结束程序后台运行
    releaseWakeLock() {
      var g_wakelock = this.g_wakelock;
      if (g_wakelock != null && g_wakelock.isHeld()) {
        g_wakelock.release();
        g_wakelock = null;
      }
    },
  },
  created() {
    // 获取历史记录长度，时网页版退出到hbuilderx
    setItem("routerHistory", history.length);
  },
  mounted() {
    // android点击手机物理返回键/手势右滑禁止退出应用
    //最近vue做个项目，发现按手机的返回键应用直接退出了，而不是返回上一页，为此特
    //意解决了这一问题，具体代码如下：
    let that = this;
    document.addEventListener("plusready", function () {
      var webview = plus.webview.currentWebview();
      plus.key.addEventListener("backbutton", function () {
        webview.canBack(function (e) {
          if (e.canBack) {
            // 直接返回上一个页面，会导致缓存页面未被销毁
            // window.history.go(-1);
            // webview.back();

            that.$router.go(-1);
            // 判断当前路由是不是缓存路由，删除路由缓存
            that.$store.commit("removeThisPage", that.$route.name);
          } else {
            //webview.close(); //hide,quit
            //plus.runtime.quit();
            //首页返回键处理
            //处理逻辑：1秒内，连续两次按返回键，则退出应用；
            var first = null;
            plus.key.addEventListener(
              "backbutton",
              function () {
                //首次按键，提示‘再按一次退出应用’
                if (!first) {
                  first = new Date().getTime();
                  Toast({ message: "再按一次退出应用" });
                  setTimeout(function () {
                    first = null;
                  }, 1000);
                } else {
                  if (new Date().getTime() - first < 1500) {
                    plus.runtime.quit();
                  }
                }
              },
              false
            );
          }
        });
      });
    });

    // 浏览器判断移动端还是pc端
    // this.isMobile();

    // hbuilderx判断设备机型
    if (window.plus) {
      this.dedecmsok();
    } else {
      console.log("没有获取到window.plus");
      document.addEventListener("plusready", this.dedecmsok, false);
    }
  },
};
</script>

<style scoped lang="less">
@finishAlertColor: #4472c4;
#app {
  height: 100%;
  height: 100%;
  background-color: @bg-color;
  // 防止任务看板滚动条错乱
  ::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
  }
  // 回单页面
  /deep/.alertQRCodeInfo {
    .van-dialog__header {
      padding: 10px 0;
      border-bottom: 1px solid @finishAlertColor;
    }
    .van-dialog__content {
      .van-dialog__message {
        padding: 30px;
        text-align: left;
        font-size: 16px;
      }
    }
    .van-dialog__footer {
      padding: 10px;
      .van-button__content {
        width: 100px;
        margin: 0 auto;
        border-radius: 10px;
        background-color: @finishAlertColor;
        color: #fff;
      }
    }
  }

  /* 动画效果 */
  /*   .child-view {
    position: absolute;
    width: 100%;
    transition: all 0.8s cubic-bezier(0.55, 0, 0.1, 1);
  }
  .slide-right-enter-active,
  .slide-right-leave-active,
  .slide-left-enter-active,
  .slide-left-leave-active {
    will-change: transform;
    transition: all 500ms;
    position: absolute;
  }

  .slide-right-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  .slide-right-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .slide-left-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .slide-left-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  } */
}
</style>
