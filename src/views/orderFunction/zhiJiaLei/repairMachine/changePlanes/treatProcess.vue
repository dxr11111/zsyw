<template>
  <div class="treatProcess">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <div class="row" v-for="(item, index) in processList" :key="index">
        <span class="round"></span>
        <span>{{ item }}</span>
      </div>
    </div>
    <!-- 显示暂无数据 -->
    <Empty v-if="processList.length == 0" />
  </div>
</template>

<script>
import { reqChangeDevProc } from "@/http/button";
export default {
  name: "ChanegDevTreatProcess",
  data() {
    return {
      headName: `换机处理过程(${this.$route.query.orderNum})`,
      processList: [],
    };
  },
  methods: {
    // 回退
    goBackFn() {
      this.$router.go(-1);
    },
    // 处理过程
    async getProcess() {
      try {
        let result = await reqChangeDevProc(
          JSON.stringify({ changeSheetNo: this.$route.query.changeSheetNo })
        );
        console.log("处理过程结果", result);
        this.apiResponse(result, ".treatProcess", () => {
          this.processList = result.proc;
        });
      } catch (error) {
        console.log("err", error);
      }
    },
  },
  created() {
    this.getProcess();
  },
};
</script>

<style scoped lang="less">
.treatProcess {
  min-height: 100%;
  background-color: @bg-color;
  .main {
    margin-top: 48px;
    .row {
      display: flex;
      padding: 10px;
      height: 40px;
      text-align: left;
      &:last-child .round::after {
        content: none;
      }
      .round {
        position: relative;
        display: inline-block;
        width: 8px;
        height: 8px;
        margin-right: 5px;
        margin-top: 5px;
        border-radius: 4px;
        background-color: aquamarine;
        &::after {
          content: "";
          position: absolute;
          border-left: 2px solid #e0e0e0;
          height: 54px;
          top: 8px;
          left: 3px;
        }
      }
    }
  }
}
</style>