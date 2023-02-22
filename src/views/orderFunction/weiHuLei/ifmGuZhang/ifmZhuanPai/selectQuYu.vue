<template>
  <!-- 转派-选择维护区域 -->
  <div class="selectQuYu">
    <MyHeader name="选择维护区域" left="arrow-left" @goBackEv="goBackFn" />
    <div class="quYuList">
      <div
        class="quYu"
        v-for="(quyu, index) in quYuList"
        :key="index"
        @click="clickQuYu(quyu)"
        :class="quyu.id == quYuId ? 'active' : ''"
      >
        {{ quyu.name }}
      </div>
    </div>
    <div class="next">
      <van-button type="info" block round @click="nextStep">下一步</van-button>
    </div>
  </div>
</template>

<script>
import { reqIfmReDiagnoseQueryOther } from "@/http/button";
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive";

export default {
  name: "IfmZhuanPaiSelectQuYu",
  mixins: [keepAliveMixin],

  data() {
    return {
      id: parseInt(this.$route.query.id),
      dwGroupId: parseInt(this.$route.query.dwGroupId) || -1,
      daiweiName: this.$route.query.daiweiName,
      groupId: parseInt(this.$route.query.groupId) || -1,
      quYuList: [],
      quYuId: -1,
      quYuName: "",
    };
  },
  methods: {
    // 回退
    goBackFn() {
      this.$store.commit("removeThisPage", this.$options.name);
      this.$router.go(-1);
      // 改变路由跳转步数
      this.$store.commit("changeRouteJumpStep", -1);
    },
    // 选择区域
    clickQuYu(quyu) {
      this.quYuId = quyu.id;
      this.quYuName = quyu.name;
    },
    // 下一步
    async nextStep() {
      // 判断是否有选中分公司
      if (this.quYuId == -1) return this.$toast("请选择维护区域");
      // 再次调用接口
      let postData = {
        id: this.id,
        dwGroupId: this.dwGroupId,
        requestType: 3,
        groupId: this.groupId,
        quYuId: this.quYuId,
      };
      let result = await reqIfmReDiagnoseQueryOther(JSON.stringify(postData));
      console.log("获取维护人结果", result);

      // 跳转到选择维护人
      this.apiResponse(result, ".selectQuYu", () => {
        if (result.diagnoseCfgRepairManList.length > 0) {
          this.$router.push({
            name: "IfmZhuanPaiSelectMan",
            query: {
              id: this.id,
              daiweiId: this.dwGroupId,
              daiweiName: this.daiweiName,
              quYuId: this.quYuId,
              quYuName: this.quYuName,
              diagnoseCfgRepairManList: JSON.stringify(
                result.diagnoseCfgRepairManList
              ),
            },
          });
          // 改变路由跳转步数
          this.$store.commit("changeRouteJumpStep", 1);
        } else {
          this.$toast("未查询到对应维护人");
        }
      });
    },
    // 获取维护区域
    async getQuYu() {
      let postData = {
        id: this.id,
        dwGroupId: this.dwGroupId,
        requestType: 2,
        groupId: this.groupId,
        quYuId: -1,
      };
      let result = await reqIfmReDiagnoseQueryOther(JSON.stringify(postData));
      console.log("获取维护区域结果", result);
      this.apiResponse(result, ".selectQuYu", () => {
        // 返回的quYuList，展示在页面上
        if (result.quYuList.length > 0) {
          this.quYuList = result.quYuList;
        } else {
          this.$toast("未查询到对应维护区域");
          this.$router.go(-1);
          // 改变路由跳转步数
          this.$store.commit("changeRouteJumpStep", -1);
        }
      });
    },
  },
  created() {
    // 获取维护区域
    this.getQuYu();
  },
};
</script>

<style scoped lang="less">
.selectQuYu {
  background-color: @bg-color;
  min-height: 100%;
  .quYuList {
    padding-bottom: 65px;
    .quYu {
      padding: 16px;
      text-align: left;
      font-size: 18px;
      border-bottom: 1px solid #e0e0e0;
      background-color: #fff;
    }
    .active {
      background-color: @theme-color;
      color: #fff;
    }
  }

  .next {
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 10px 30px;
    background-color: #fff;
  }
}
</style>