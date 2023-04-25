<template>
  <!-- 未使用 -->
  <div class="jzywgz">
    <!-- 基站运维感知 -->
    <MyHeader
      name="基站运维感知"
      @goBackEv="$router.go(-1)"
      left="arrow-left"
    />
    <iframe
      class="network_show"
      name="content_frame"
      :src="jzywUrl"
      frameborder="0"
      scrolling="no"
    ></iframe>
    <!-- <embed :src="jzywUrl" width="100%" height="100%" /> -->
  </div>
</template>

<script>
import { reqQueryUniToken } from "@/http/tools";
import { getItem } from "@/utils/public/sessionStorage";

export default {
  name: "Jzywgz",
  data() {
    return {
      jzywUrl: "",
    };
  },
  methods: {
    // 获取url
    async getUrl() {
      // 获取传参
      let userIds = getItem("loginInfo").userIds;
      let accountId = "";
      let appCode = "";
      let appKey = "";
      for (let item of userIds) {
        if (item.sysId == 104) {
          accountId = item.accountId;
          appCode = item.appCode;
          appKey = item.appKey;
          break;
        }
      }
      if (accountId == "") return _this.$toast("无权限操作");
      let url = process.env.VUE_APP_JZYW + "/#/index?title=1&token="; // http://202.106.86.115:7064/aiops
      let result = await reqQueryUniToken(
        JSON.stringify({ appCode, appKey, accountId })
      );
      console.log("基站运维感知结果", result);
      // 将账号传给后台 → 后台返回token → 将token传给url
      this.apiResponse(result, ".jzywgz", () => {
        let token = result.token;
        url += token;
        console.log("基站运维感知结果url", url);
        this.jzywUrl = url;
        // this.jzywUrl = "https://vant-contrib.gitee.io/vant/v2";
        // window.location.href = url;
      });
    },
  },
  created() {
    // 获取url
    this.getUrl();
  },
};
</script>

<style scoped lang="less">
.jzywgz {
  width: 100%;
  height: 100%;
  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>