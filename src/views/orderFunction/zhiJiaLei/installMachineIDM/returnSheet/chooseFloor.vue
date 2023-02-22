<template>
  <!-- 选择楼层 -->
  <div class="chooseFloor">
    <MyHeader name="选择楼层" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <div
        class="row"
        v-for="(item, index) in floorList"
        :key="index"
        @click="clickFloorInfo(item, index)"
        :style="
          index === floorInfoIndex ? 'background-color:blue;color:#fff' : ''
        "
      >
        <div class="num">{{ index + 1 }}</div>
        <div class="content">{{ item.floorName }}</div>
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
  name: "ChooseFloor",
  // mixins: [keepAliveMixin],

  data() {
    return {
      floorList: [],
      floorInfoIndex: -1, // 选中的楼层索引
      floorName: "", // 选中的楼层名称
    };
  },
  computed: {
    ...mapState("returnSheet", ["chooseFloor"]),
  },
  methods: {
    // 回退
    goBackFn() {
      // 清除vuex
      this.$store.commit("returnSheet/changeChooseFloor", {
        floorList: [],
        floorInfoIndex: -1, // 选中的楼层索引
        floorName: "", // 选中的楼层名称
      });
      this.$router.go(-1);
      // 改变路由跳转步数
      this.$store.commit("changeRouteJumpStep", 1);
    },
    // 获取楼层列表
    async getFloorList() {
      let postData = { ...this.$route.query }; // 楼宇编号，楼名称，调用接口标识，单元名称
      let result = await reqIomNewQueryUitInfo(JSON.stringify(postData));
      console.log("获取楼层列表", result);
      this.apiResponse(result, ".chooseFloor", () => {
        this.floorList = result.floorList;
      });
    },
    // 选中信息
    clickFloorInfo(item, index) {
      this.floorInfoIndex = index;
      this.floorName = item.floorName;
    },
    // 下一步
    onSubmit() {
      if (this.roomInfoIndex === -1) {
        return this.$toast("请选择楼层");
      }
      // 将选中内容存储到vuex
      this.$store.commit("returnSheet/changeChooseFloor", {
        floorList: this.floorList,
        floorInfoIndex: this.floorInfoIndex, // 选中的楼层索引
        floorName: this.floorName, // 选中的楼层名称
      });
      // 跳转到房间页面
      this.$router.push({
        name: "ChooseRoom",
        query: {
          id: this.$route.query.id,
          fldcbriefname: this.$route.query.fldcbriefname,
          fldcname: this.$route.query.fldcname,
          buildType: "3",
          unitName: this.$route.query.unitName,
          floorName: this.floorName,
        },
      });
      // 改变路由跳转步数
      this.$store.commit("changeRouteJumpStep", 1);
    },
  },
  created() {
    if (this.chooseFloor.floorInfoIndex !== -1) {
      this.floorInfoIndex = this.chooseFloor.floorInfoIndex;
      this.floorList = this.chooseFloor.floorList;
      this.floorName = this.chooseFloor.floorName;
    } else {
      // 获取楼层列表
      this.getFloorList();
    }
  },
};
</script>

<style scoped lang="less">
@theme-color: #1989fa;
.chooseFloor {
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