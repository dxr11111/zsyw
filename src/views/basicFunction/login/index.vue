<template>
  <div class="loginContainer">
    <!-- 服务器web页面 -->
    <!-- hbuilderx专用 -->
    <iframe
      id="frameWrapper"
      class="ossWeb"
      :src="ossWeb.webUrl"
      frameborder="0"
      scrolling="no"
      v-if="ossWeb.isShow"
    ></iframe>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from "vuex";
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
  },
  mounted() {
    const frame = document.getElementById("frameWrapper");
    frame.contentWindow.plus = window.plus;
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