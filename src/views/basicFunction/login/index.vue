<template>
  <div class="loginContainer">
    <!-- 服务器web页面 -->
    <!-- hbuilderx专用 -->
    <!-- 如果采用v-if的方式显示iframe，则监听不到消息 -->
    <!--  <iframe
      id="frameWrapper"
      name="frameWrapper"
      class="ossWeb"
      :src="ossWeb.webUrl"
      frameborder="0"
      scrolling="auto"
      v-show="ossWeb.isShow"
    ></iframe>
    <router-view v-show="!ossWeb.isShow"></router-view> -->
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { removeItem } from "@/utils/public/sessionStorage";
export default {
  name: "Login",
  data() {
    return {
      loginType: JSON.parse(localStorage.getItem("loginType")) || [], // 所有账号的快捷登录设置
    };
  },
  computed: {
    // hbuilderx专用
    ...mapState(["ossWeb"]),
  },

  methods: {
    // 判断进入手势登录页面还是账号密码登录页面
    judgeLoginType() {
      let loginNo = localStorage.getItem("loginNo");
      let code = 0;
      if (loginNo) {
        this.loginType.forEach((e) => {
          if (e.loginNo == loginNo) {
            code = e.typeCode;
          }
        });
        console.log("登录类型", code);
        if (code == 0) {
          // 进入账号密码登录页
          this.$router.push({ name: "PassLogin" });
        } else if (code == 1) {
          // 进入手势密码登录页
          this.$router.push({ name: "GestPassLogin" });
        } else if (code == 2) {
          // 进入指纹登录页
        }
      } else {
        // 进入账号密码登录页
        this.$router.push({ name: "PassLogin" });
      }
    },
    // 监听web页面
    listenIframe() {
      const that = this;
      window.addEventListener("message", function (event) {
        if (event.origin !== "http://132.91.203.144:7002") {
          return;
        }
        console.log("子元素传来消息", event.data);

        if (event.data.flag == 1) {
          // 传递给web页面plus对象
          // console.log("传递给web页面plus对象", plus);
          window.frameWrapper.postMessage({ plus: JSON.stringify(plus) }, "*");
        } else if (event.data.flag == 2) {
          // 告诉父页面关闭web页面
          console.log("web页面点击退出登录", event);
          // 清除登录信息
          // 退出账号时，清空当前账号的手势密码及快捷标识
          localStorage.removeItem("loginType");
          // 从这里退出需要移除账号，避免进入手势登录页
          localStorage.removeItem("loginNo");
          removeItem("loginInfo");
          removeItem("userPwd");

          // 刷新登录页
          that.$router.go(0);
          /* // 清空公告id
          that.$store.commit("home/changeLastNoticeId", -1);
          // 关闭web页面
          that.$store.commit("changeOssWeb", {
            isShow: false,
            webUrl: "",
          });
          // 回到hbuilderx登录页 → 清空密码
          that.judgeLoginType(); */
        } else if (event.data.flag == 3) {
          // 设置手势密码
          console.log("保存设置手势密码", event.data.loginType);
          localStorage.setItem("loginType", event.data.loginType);
        }
      });
    },
  },
  mounted() {
    // 监听web页
    // this.listenIframe();
  },
  created() {
    // 判断进入手势登录页面还是账号密码登录页面
    this.judgeLoginType();
  },
};
</script>

<style scoped lang="less">
.loginContainer {
  height: 100%;
  .ossWeb {
    width: 100%;
    height: 100%;
  }
}
</style>