<template>
  <div class="uniNetLogin">
    <UniNetHeader name="北京掌上运维系统" />
    <!-- 正在鉴权 → 等待页面 / 鉴权失败 → 错误页面 -->
    <van-empty
      :description="showText"
      :style="{ transform: 'translateY(60%)' }"
    />
  </div>
</template>

<script>
import { reqUniNetLogin } from "@/http";
import { setItem } from "@/utils/public/sessionStorage";
import UniNetHeader from "@/components/myHeader/uniNet.vue";
export default {
  name: "UniNetLogin",
  components: { UniNetHeader },
  data() {
    return {
      accessToken: "",
      showText: "正在进行权限验证，请稍等...", // 权限验证失败，+ 后台返回的错误messsage
    };
  },
  methods: {
    // 获取accessToken
    async getAccessToken() {
      // test
      // 跳转home页
      this.$router.push({
        name: "UniNetLoginHome",
      });
      return;

      let url = window.location.hash;
      console.log("完整url", url);

      url = url.split("?")[1];
      let searchParams = new URLSearchParams(url);
      if (searchParams.has("access_token")) {
        this.accessToken = searchParams.get("access_token");
      }

      console.log("accessToken：", this.accessToken);
      if (this.accessToken == "") {
        return (this.showText = "权限验证失败，未获取到access_token");
      }
      // 鉴权
      try {
        let result = await reqUniNetLogin(
          JSON.stringify({ accessToken: this.accessToken })
        );
        console.log("鉴权结果", result);
        this.apiResponse(result, ".uniNetLogin", () => {
          console.log("鉴权成功");

          // 跳转home页
          this.$router.push({
            name: "UniNetLoginHome",
          });
          // 获取鉴权账号 guzi1
          // 获取登录信息 loginInfo
          this.$store.commit("GETLOGININFO", result);
        });
        if (!result.operationSuccessFlag) {
          // 鉴权失败
          console.log("鉴权失败");
          this.showText = "权限验证失败，" + result.errorMessage;
        }
      } catch (error) {
        console.log("响应失败", error);
        this.showText = "权限响应失败";
      }
    },
  },
  created() {
    // 获取accessToken
    this.getAccessToken();
  },
};
</script>

<style>
</style>