<template>
  <!-- 转派-选择分公司代维 -->
  <div class="selectDw">
    <MyHeader name="选择分公司代维" left="arrow-left" @goBackEv="goBackFn" />
    <div class="dwGroupList">
      <div
        class="dwGroup"
        v-for="(dw, index) in dwGroupList"
        :key="index"
        @click="clickDwGroup(dw)"
        :class="getStyle(dw)"
      >
        {{ dw.name }}
      </div>
    </div>
    <div class="bottom">
      <!-- 显示是否派发 -->
      <div class="showPaiFa">
        <div class="paiFa">
          <div class="grey"></div>
          <span>已派发</span>
        </div>
        <div class="unPaiFa">
          <div class="white"></div>
          <span>未派发</span>
        </div>
      </div>
      <div class="next">
        <van-button type="info" block round @click="nextStep"
          >下一步</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive";

export default {
  name: "IfmZhuanPaiSelectDw",
  mixins: [keepAliveMixin],

  data() {
    return {
      id: parseInt(this.$route.query.id),
      dwGroupList: JSON.parse(this.$route.query.dwGroupList),
      groupId: parseInt(this.$route.query.groupId) || -1,
      dwGroupId: -1,
      daiweiName: "",
    };
  },
  methods: {
    // 回退
    goBackFn() {
      // 判断分公司代维是第一个页面还是第二个页面
      if (this.$route.query?.step == 1) {
        // 第一个页面
        // 重置路由跳转步数
        this.$store.commit("changeRouteJumpStep", 0);
      } else {
        // 上一个页面为分公司
        // 改变路由跳转步数
        this.$store.commit("changeRouteJumpStep", -1);
      }
      this.$store.commit("removeThisPage", this.$options.name);
      this.$router.go(-1);
    },
    // 获取分公司样式
    getStyle(dw) {
      // 判断是否已派发
      if (dw.status == 1) {
        // 已派发
        // 判断是否选中
        if (dw.id == this.dwGroupId) {
          return "paifa active";
        } else {
          return "paifa";
        }
      } else {
        // 未派发
        // 判断是否选中
        if (dw.id == this.dwGroupId) {
          return "active";
        }
      }
    },
    // 下一步
    nextStep() {
      // 判断是否有选中分公司
      if (this.dwGroupId == -1) return this.$toast("请选择分公司代维");

      // 跳转到选择维护区域
      this.$router.push({
        name: "IfmZhuanPaiSelectQuYu",
        query: {
          id: this.id,
          dwGroupId: this.dwGroupId,
          daiweiName: this.daiweiName,
          groupId: this.groupId,
        },
      });
      // 改变路由跳转步数
      this.$store.commit("changeRouteJumpStep", 1);
    },
    // 选中代维分公司
    clickDwGroup(dw) {
      this.dwGroupId = dw.id;
      this.daiweiName = dw.name;
    },
  },
  created() {},
};
</script>

<style scoped lang="less">
.selectDw {
  background-color: @bg-color;
  min-height: 100%;
  .dwGroupList {
    padding-bottom: 100px;
    .dwGroup {
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
    .paifa {
      background-color: #e0e0e0;
      border-bottom: 1px solid #fff;
    }
  }

  .bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
    .showPaiFa {
      display: flex;
      justify-content: center;
      padding: 10px 16px;
      background-color: @bg-color;
      .paiFa {
        display: flex;
        .grey {
          background-color: #e0e0e0;
        }
      }
      .unPaiFa {
        display: flex;
        margin-left: 30px;
        .white {
          background-color: #fff;
        }
      }
      .grey,
      .white {
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
    }

    .next {
      padding: 10px 30px;
      background-color: #fff;
    }
  }
}
</style>