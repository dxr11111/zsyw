<template>
  <div>
    <GesturesPass :passWord="gestPass" :setOrCheck="false" />
  </div>
</template>

<script>
import { getItem } from "@/utils/public/sessionStorage";
import { Base64 } from "js-base64";
export default {
  name: "GestPassLogin",
  components: {
    GesturesPass: () => import("@/components/gesturesPass/index.vue"),
  },
  data() {
    return {
      loginNo: localStorage.getItem("loginNo"),
      loginType: JSON.parse(localStorage.getItem("loginType")) || [], // 所有账号的快捷登录设置
      gestPass: [],
    };
  },
  created() {
    if (this.loginType.length > 0) {
      this.loginType.forEach((e) => {
        if (e.loginNo == this.loginNo) {
          this.gestPass = e.gestPassword;
        }
      });
    }
  },
};
</script>

<style>
</style>