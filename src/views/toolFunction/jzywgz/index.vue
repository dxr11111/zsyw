<template>
  <div class="jzywgz">
    <!-- 基站运维感知 -->
    <MyHeader name="基站运维感知" @goBackEv="$router.go(-1)" left="arrow-left" />
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
      let appCode = "ZHYW"; // "ZHYW"; // "VIr4PknJcGc=";
      let appKey = "VIr4PknJcGc=";
      // let accountId = getItem("loginNo"); // 鉴权回来的loginNo
      let accountId = "130123199206274518"; // "yansh50"; // "130626199810200052";
      let url = "http://202.106.86.115:7064/aiops/#/index?token=";
      let result = await reqQueryUniToken(
        JSON.stringify({ appCode, appKey, accountId })
      );
      console.log("基站运维感知结果", result);
      // 将账号传给后台 → 后台返回token → 将token传给url
      if (result.operationSuccessFlag) {
        let token = result.token;
        url += token;
        console.log("基站运维感知结果url", url);
        this.jzywUrl = url;
        // this.jzywUrl = "https://vant-contrib.gitee.io/vant/v2";
        // window.location.href = url;
      }
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