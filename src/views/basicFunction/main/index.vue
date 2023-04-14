<template>
  <!-- 主页面 -->
  <div class="main" ref="main">
    <!-- <router-view /> -->
    <!-- 缓存路由 -->
    <keep-alive :exclude="exclude">
      <router-view v-if="refreshing"></router-view>
    </keep-alive>
    <!-- <keep-alive :max="3">
      <router-view v-if="$route.meta.myKeepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.myKeepAlive" /> -->

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
import { setItem } from "@/utils/public/sessionStorage";
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive";
import { reqQueryClientNotice } from "@/http/index";
import { mapGetters } from "vuex";
import { judgeTaskSheetPermissions } from "@/utils/public/common";

export default {
  name: "Main",
  mixins: [keepAliveMixin],

  data() {
    return {
      timer: null,
      noticeShow: false, // 是否展示公告内容
      noticeContents: "",
      noticeInfoId: -1,

      bottomHeight: "50px",
      bottomTabActive: 0,
      workBenchActive: false,
      HomeActive: false,
      refreshing: true,
      exclude: "",
      refreshHome: false,
      refreshWorkBench: false,
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
    // 关闭公告栏
    closeNotice() {
      // 如果用户手工点击右上角关闭，则该公告ID内容当次登录不展示，
      this.noticeShow = false;
      this.bottomHeight = "50px";
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
            this.bottomHeight = "80px";
            this.noticeContents = noticeInfoContent;
          } else {
            this.noticeShow = false;
            this.bottomHeight = "50px";
          }
        } else {
          // 查询结果是关闭的公告ID时，不展示
          this.noticeShow = false;
          this.bottomHeight = "50px";
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
    hbuilderxParams() {
      console.log("当前的路由对象", this.$route);
      if (Object.values(this.$route.query).length > 0) {
        // 将登录信息和密码进行解码
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

        // 判断用户是否有任务权限和工单权限
        judgeTaskSheetPermissions(loginInfo.userIds);
      } else {
        // 判断用户是否有任务权限和工单权限
        judgeTaskSheetPermissions(this.getLoginInfo?.userIds);
      }
    },
  },
  created() {
    // 将hbuilderx跳转过来的参数存储
    this.hbuilderxParams();

    // 是否展示公告内容 30分钟请求一次 1800000
    this.timer && clearInterval(this.timer); // 判断定时器是否存在，若存在就关掉
    this.showNotice();
    this.timer = setInterval(this.showNotice, 1800000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style scoped lang="less">
.main {
  height: 100%;
  overflow-y: auto;

  .notice {
    position: fixed;
    bottom: 50px;
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
}
</style>