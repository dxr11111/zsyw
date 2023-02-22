<template>
  <!-- 回复 -->
  <div class="finish">
    <!-- <keep-alive :include="includes">
      <router-view></router-view>
    </keep-alive> -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive";

export default {
  name: "IomNewFinish",
  mixins: [keepAliveMixin],

  data() {
    return {
      includes: ["IomNewReply"],
    };
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "ListDetail") {
      this.$destroy();
    }
    next();
  },
  beforeDestroy() {
    console.log("finish销毁");
  },
};
</script>

<style scoped lang="less">
.finish {
  height: 100%;
  background-color: #f8f7fc;
}
</style>