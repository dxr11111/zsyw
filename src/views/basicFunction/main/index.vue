<template>
  <!-- 主页面 -->
  <div class="main" ref="main">
    <!-- <router-view /> -->
    <!-- 缓存路由 -->
    <keep-alive :exclude="exclude">
      <router-view v-if="refreshing" @logOut="logOut"></router-view>
    </keep-alive>
    <!-- <keep-alive :max="3">
      <router-view v-if="$route.meta.myKeepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.myKeepAlive" /> -->

    <!-- Home页需要使用plus获取设备信息 安卓要等main页面加载完才能触发plus ready，再跳转Home页之前显示加载提示 -->
    <!-- 加载提示 -->
    <MyLoading v-if="isLoading" />

    <!-- 公告展示-联通网络 -->
    <div class="uniNetNotice" v-if="projectFlag == 2 && noticeShow">
      <van-notice-bar mode="closeable" @close="closeNotice">{{
        noticeContents
      }}</van-notice-bar>
    </div>
    <!-- 底部tab栏 -->
    <div
      class="bottomTabbar"
      v-if="projectFlag == 1"
      :style="{ height: bottomHeight }"
    >
      <!-- 公告展示 -->
      <div class="notice" v-if="noticeShow">
        <van-notice-bar mode="closeable" @close="closeNotice">{{
          noticeContents
        }}</van-notice-bar>
      </div>
      <van-tabbar v-model="bottomTabActive" route @change="changeTabbar">
        <van-tabbar-item to="/main/home" @click="clickHome()">
          <span>首页</span>
          <template #icon="props">
            <img
              :src="
                props.active
                  ? require('@/views/basicFunction/main/images/refresh.png')
                  : require('@/views/basicFunction/main/images/shouye.png')
              "
            />
          </template>
        </van-tabbar-item>

        <van-tabbar-item to="/main/workBench" @click="clickWorkBench()">
          <span>工作台</span>
          <template #icon="props">
            <img
              :src="
                props.active
                  ? require('@/views/basicFunction/main/images/refresh.png')
                  : require('@/views/basicFunction/main/images/ziyuan.png')
              "
            />
          </template>
        </van-tabbar-item>
        <van-tabbar-item to="/main/my">
          <span>我的</span>
          <template #icon="props">
            <img
              :src="
                props.active
                  ? require('@/views/basicFunction/main/images/wodeAct.png')
                  : require('@/views/basicFunction/main/images/wode.png')
              "
            />
          </template>
        </van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
import { getItem, setItem } from "@/utils/public/sessionStorage";
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive";
import { reqQueryClientNotice, savePosition } from "@/http/index";
import { mapGetters } from "vuex";
import { judgeTaskSheetPermissions } from "@/utils/public/common";
import MyLoading from "@/components/myLoading";
import { unicomFunc, getProjectLocation } from "@/utils/public/unicomApp";
import { watchLocationHbuilder } from "@/utils/public/positionLoaction";
import $ from "jquery";

export default {
  name: "Main",
  mixins: [keepAliveMixin],
  components: { MyLoading },

  data() {
    return {
      timer: null, // 公告计时器
      positionTimer: null, // 位置信息计时器
      noticeShow: false, // 是否展示公告内容
      noticeContents: "",
      noticeInfoId: -1,

      bottomHeight: "13.33vw", // 50px
      bottomTabActive: 0,
      workBenchActive: false,
      HomeActive: false,
      refreshing: true,
      exclude: "",
      refreshHome: false,
      refreshWorkBench: false,

      isLoading: false, // 当页面还未进入Home页，保持加载状态
    };
  },
  computed: {
    projectFlag() {
      return this.$store.state.projectFlag;
    },
    ...mapGetters(["getLoginInfo"]),
  },
  watch: {
    "$route.path": {
      // 防止页面滚轴下拉互相影响
      handler(newVal) {
        if (this.$route?.meta?.parentPath == "/main") {
          document.querySelector(".main").scrollTop = 1;
          document.querySelector(".main").scrollTop = 0;
        }
      },
    },
    refreshWorkBench: {
      // 刷新工作台
      handler(newVal) {
        if (newVal) {
          this.refreshWorkBench = false;
          this.onReload();
        }
      },
    },
    refreshHome: {
      // 刷新首页
      handler(newVal) {
        if (newVal) {
          this.refreshHome = false;
          this.onReload();
        }
      },
    },
  },
  methods: {
    // 如果当前为web页面，则退回hbuilder
    logOut() {
      let currentLength = history.length;
      let originalLength = getItem("routerHistory");
      console.log("路由跳转的步数", originalLength, currentLength);
      this.$router.go(originalLength - currentLength - 1);
    },
    // 关闭公告栏
    closeNotice() {
      // 如果用户手工点击右上角关闭，则该公告ID内容当次登录不展示，
      this.noticeShow = false;
      this.bottomHeight = "13.33vw";
      this.$store.commit("home/changeLastNoticeId", this.noticeInfoId);
      // 如果用户退出后再登录，则继续展示公告内容
    },
    // 是否展示公告内容
    async showNotice() {
      let result = await reqQueryClientNotice(JSON.stringify({}));
      console.log("公告展示结果", result);
      this.apiResponse(result, ".main", () => {
        // 手动关闭公告后半小时定时查询不受影响，
        let noticeInfoId = result.clientNoticeInfo.id;
        if (!(noticeInfoId === this.$store.state.home.lastNoticeId)) {
          // 是新的公告ID时，将展示。
          this.noticeInfoId = noticeInfoId;
          let noticeInfoContent = result.clientNoticeInfo.contents;
          if (noticeInfoContent.length > 0) {
            // 显示公告内容
            this.noticeShow = true;
            this.bottomHeight = "21.33vw"; // 80px
            this.noticeContents = noticeInfoContent;
          } else {
            this.noticeShow = false;
            this.bottomHeight = "13.33vw";
          }
        } else {
          // 查询结果是关闭的公告ID时，不展示
          this.noticeShow = false;
          this.bottomHeight = "13.33vw";
        }
      });
    },

    // 切换底部标题栏
    changeTabbar() {
      if (this.bottomTabActive !== 1) this.workBenchActive = false;
      if (this.bottomTabActive !== 0) this.HomeActive = false;
    },
    // 点击工作台
    clickWorkBench() {
      if (this.workBenchActive) {
        // 通知工作台刷新页面
        this.refreshWorkBench = true;
      }
      this.workBenchActive = true;
    },
    // 点击首页
    clickHome() {
      if (this.HomeActive) {
        // 通知首页刷新页面
        this.refreshHome = true;
      }
      this.HomeActive = true;
    },
    //刷新
    onReload() {
      this.exclude = this.$route.name;
      this.refreshing = false;
      setTimeout(() => {
        this.refreshing = true;
        this.$nextTick(() => {
          this.exclude = "";
        });
      }, 200);
    },
    // 将hbuilderx跳转过来的登录参数存储
    async hbuilderxParams() {
      console.log("当前的路由对象", this.$route);
      if (this.$store.state.projectFlag == 1) {
        // 建维优
        // 区分一下是否为联通网络跳转，联通网络也携带query参数
        if (Object.values(this.$route.query).length > 0) {
          // this.isLoading = true;
          // 将登录信息和密码进行解码
          // 将hbuilderx跳转过来的参数存储
          let loginInfo = JSON.parse(
            decodeURIComponent(window.atob(this.$route.query.loginInfo))
          );
          let password = window.atob(this.$route.query.userPwd);

          // 存入用户登录信息
          this.$store.commit("GETLOGININFO", loginInfo);
          // 存入用户密码
          setItem("userPwd", password);
          // 手势登录需要用
          localStorage.setItem("userPwd", password);

          // 将web页面的ossWeb设置为true
          this.$store.commit("changeOssWeb", true);

          console.log("进入web页面");

          // window.plus
          if (window.plus) {
            // this.isLoading = false;
            // 重新获取plus设备信息赋给vuex内的clientId，mobileType
            // judgeDeviceType();
            // 获取公告内容
            this.getNotice();
            // 发送位置信息
            this.timingSendPosition();
            this.$router.push({ name: "Home" });
          } else {
            console.log("没有获取到window.plus");
            document.addEventListener(
              "plusready",
              () => {
                // this.isLoading = false;
                // 重新获取plus设备信息赋给vuex内的clientId，mobileType
                // judgeDeviceType();
                // 获取公告内容
                this.getNotice();
                // 发送位置信息
                this.timingSendPosition();
                this.$router.push({ name: "Home" });
              },
              false
            );
          }
          // 判断用户是否有任务权限和工单权限
          judgeTaskSheetPermissions(loginInfo.userIds);
        } else {
          // 获取公告内容
          this.getNotice();
          // 发送位置信息
          this.timingSendPosition();
          // 判断是否是第一次进入Main，是→进入Home 不是→说明是在其他页面刷新浏览器，则不强制进入Home
          if (this.$route.params.fromName == "Login") {
            this.$router.push({ name: "Home" });
          }
          // 判断用户是否有任务权限和工单权限
          judgeTaskSheetPermissions(this.getLoginInfo?.userIds);
        }
      } else {
        // 联通网络
        // 获取公告内容
        this.getNotice();
        // 发送位置信息 联通网络首页已添加定时上传定位功能
        // this.timingSendPosition();
        // 判断是否是第一次进入Main，是→进入Home 不是→说明是在其他页面刷新浏览器，则不强制进入Home
        if (this.$route.params.fromName == "Login") {
          this.$router.push({ name: "Home" });
        }
        // 判断用户是否有任务权限和工单权限
        judgeTaskSheetPermissions(this.getLoginInfo?.userIds);
      }
    },

    // 获取公告内容
    getNotice() {
      // 是否展示公告内容 30分钟请求一次 1800000
      this.timer && clearInterval(this.timer); // 判断定时器是否存在，若存在就关掉
      this.showNotice();
      this.timer = setInterval(this.showNotice, 1800000);
    },

    // 定时发送位置信息，不用区分联通网络，联通网络的定时位置功能写在首页
    timingSendPosition() {
      // 建维优 使用plus对象
      if (window.plus) {
        this.watchLocation();
      } else {
        // 防止app被后台杀死后，安卓用户点击app因页面没有加载完成plus还没有获取到而不走定时发送定位
        console.log("没有获取到window.plus,不支持当前地理位置信息获取");
        document.addEventListener("plusready", this.watchLocation, false);
      }
    },
    // 建维优监听定位
    watchLocation() {
      // 开启系统定位watchPosition，ios使用watchPosition可以使应用一直在后台运行
      // watchPosition调用定位可以设置间隔时间，但是间隔时间不准。所以先开启watchPosition，再一分钟调用一次后台请求
      // 监听定位
      watchLocationHbuilder()
        .then((result) => {
          console.log("plus开启监视定位");
          // 获取了第一次经纬度结果后再发送给后台
          // 1分钟请求一次 60000
          this.positionTimer && clearInterval(this.positionTimer); // 判断定时器是否存在，若存在就关掉
          this.sendLocation();
          this.positionTimer = setInterval(this.sendLocation, 60000);
        })
        .catch((error) => {
          console.log("检测到位置监听关闭，重新开始位置监听");
          watchLocationHbuilder().then((result) => {
            console.log("开启监视定位");
          });
        });
    },
    // 发送已有的位置信息给后台 → 监听定位
    async sendLocation() {
      console.log(
        "测试是否一分钟获取一次定位",
        new Date(+new Date() + 8 * 3600 * 1000)
          .toJSON()
          .substr(0, 19)
          .replace("T", " ")
      );

      let location = this.$store.state.h5Loaction;
      await savePosition(JSON.stringify(location));
      console.log("发送给后台监听定位信息", location);
    },
  },
  created() {
    // 判断是否从hbuilderx跳转过来
    this.hbuilderxParams();
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.positionTimer && clearInterval(this.positionTimer); // 判断定时器是否存在，若存在就关掉
  },
};
</script>

<style scoped lang="less">
.main {
  height: 100%;
  overflow-y: auto;

  .uniNetNotice,
  .notice {
    position: fixed;
    width: 100%;
    .van-notice-bar {
      height: 30px;
      background-color: @error-bg-color;
      color: red;
      /deep/.van-icon {
        bottom: 4px;
        left: 12px;
      }
    }
  }
  .uniNetNotice {
    bottom: 0;
  }
  .notice {
    bottom: 50px;
  }
}
</style>