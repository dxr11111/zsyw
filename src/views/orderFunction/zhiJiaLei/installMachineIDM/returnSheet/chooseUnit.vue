<template>
  <!-- 选择单元 -->
  <div class="chooseUnit">
    <MyHeader name="选择单元" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <div
        class="row"
        v-for="(item, index) in unitList"
        :key="index"
        @click="clickUnitInfo(item, index)"
        :style="
          index === unitInfoIndex ? 'background-color:blue;color:#fff' : ''
        "
      >
        <div class="num">{{ index + 1 }}</div>
        <div class="content">{{ item.unitName }}</div>
      </div>
    </div>
    <div class="bottom">
      <van-button round block type="info" @click="onSubmit">下一步</van-button>
    </div>
  </div>
</template>

<script>
import { reqIomNewQueryUitInfo } from "@/http/button";
import { mapState } from "vuex";
// import { keepAliveMixin } from '@/utils/mixins/routerKeepAlive'

export default {
  name: "ChooseUnit",
  // mixins: [keepAliveMixin],

  data() {
    return {
      unitList: [],
      unitInfoIndex: -1, // 选中的单元信息所有
      unitName: "", // 选中单元名称
    };
  },
  computed: {
    ...mapState("returnSheet", ["chooseUnit"]),
  },

  methods: {
    // 回退
    goBackFn() {
      // 清除vuex
      this.$store.commit("returnSheet/changeChooseUnit", {
        unitList: [],
        unitInfoIndex: -1,
        unitName: "",
      });
      this.$router.go(-1);
      // 改变路由跳转步数
      this.$store.commit("changeRouteJumpStep", 1);
    },
    // 获取单元列表
    async getUnitList() {
      let postData = { ...this.$route.query }; // 楼宇编号，楼名称，调用接口标识
      let result = await reqIomNewQueryUitInfo(JSON.stringify(postData));
      console.log("获取单元列表", result);
      this.apiResponse(result, ".chooseUnit", () => {
        this.unitList = result.unitList;
      });
    },
    // 选中信息
    clickUnitInfo(item, index) {
      this.unitInfoIndex = index;
      this.unitName = item.unitName;
    },
    // 下一步
    onSubmit() {
      if (this.unitInfoIndex === -1) {
        return this.$toast("请选择单元");
      }
      // 将选中内容存储到vuex
      this.$store.commit("returnSheet/changeChooseUnit", {
        unitList: this.unitList,
        unitInfoIndex: this.unitInfoIndex,
        unitName: this.unitName,
      });
      // 跳转到楼层页面
      this.$router.push({
        name: "ChooseFloor",
        query: {
          id: this.$route.query.id,
          fldcbriefname: this.$route.query.fldcbriefname,
          fldcname: this.$route.query.fldcname,
          buildType: "2",
          unitName: this.unitName,
        },
      });
      // 改变路由跳转步数
      this.$store.commit("changeRouteJumpStep", 1);
    },
  },
  created() {
    if (this.chooseUnit.unitInfoIndex !== -1) {
      this.unitInfoIndex = this.chooseUnit.unitInfoIndex;
      this.unitList = this.chooseUnit.unitList;
      this.unitName = this.chooseUnit.unitName;
    } else {
      // 获取单元列表
      this.getUnitList();
    }
  },
};
</script>

<style scoped lang="less">
@theme-color: #1989fa;
.chooseUnit {
  height: 100%;
  background-color: #fff;
  .main {
    padding-bottom: 65px;
    .row {
      display: flex;
      margin: 10px 0;
      padding: 5px;
      background: #f3f4f5;
      .num {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 30px;
        height: 30px;
        margin-right: 10px;
        background: @theme-color;
        border-radius: 15px;
        color: #fff;
      }
      .content {
        display: flex;
        align-items: center;
      }
    }
  }
  .bottom {
    position: fixed;
    bottom: 0px;
    width: 100%;
    padding: 10px 0;
    background-color: #fff;
  }
}
</style>