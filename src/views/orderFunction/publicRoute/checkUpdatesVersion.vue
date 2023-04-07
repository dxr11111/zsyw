<template>
  <!-- 检查更新版本弹出层 -->
  <div class="checkUpdatesVersion">
    <van-popup v-model="show" :close-on-click-overlay="false">
      <!-- 需要更新 -->
      <div
        class="updateVersion"
        v-if="$store.state.checkUpdatesPop.isNeedUpdate"
      >
        <div class="title">发现新版本</div>
        <div class="version">
          版本号：{{ $store.state.checkUpdatesPop.version }}
        </div>
        <div class="content">
          {{ $store.state.checkUpdatesPop.content }}
        </div>
        <div class="buttonRegion">
          <van-button type="info">稍后更新</van-button>
          <van-button type="info">立即更新</van-button>
        </div>
      </div>
      <!-- 不需要更新 -->
      <!-- 内容为“您当前的版本是最新版”，点击确定，关闭提示框。 -->
      <div
        class="latestVersion"
        v-if="!$store.state.checkUpdatesPop.isNeedUpdate"
      >
        <div class="content">您当前的版本是最新版</div>
        <div class="buttonRegion">
          <van-button type="info" @click="closePop">确定</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "CheckUpdatesVersion",
  data() {
    return {
      show: true,
    };
  },
  methods: {
    // 关闭弹出层
    closePop() {
      this.$store.commit("changeCheckUpdatesPop", { popShow: false });
    },
  },
};
</script>

<style scoped lang="less">
.van-popup {
  width: 80%;
  .updateVersion {
    .title {
      padding: 12px;
    }
    .version {
      text-align: left;
      padding: 12px;
      border-top: 1px solid #e0e0e0;
      border-bottom: 1px solid #e0e0e0;
    }
    .content {
      text-align: left;
      white-space: pre-line;

      min-height: 50px;
      max-height: 300px;
      overflow-y: auto;
      padding: 12px;
    }
    .buttonRegion {
      margin: 10px;
      display: flex;
      justify-content: space-around;
      .van-button {
        flex: 1;
        height: 40px;
        margin: 0 10px;
        border-radius: 5px;
      }
    }
  }
  .latestVersion {
    .content {
      margin: 20px auto;
      font-size: 18px;
    }
  }
  .buttonRegion {
    margin: 10px;
    display: flex;
    justify-content: space-around;
    .van-button {
      flex: 1;
      height: 40px;
      margin: 0 10px;
      border-radius: 5px;
    }
  }
}
</style>