<template>
  <div class="loading">
    <van-overlay :show="show" @click="show = false">
      <div class="wrapper" @click.stop>
        <!-- 常规加载提示 -->
        <!-- 加载标识超过规定时间显示取消按钮 -->
        <div class="block">
          <van-loading size="36px" vertical>加载中...</van-loading>
          <van-button type="info" @click="cancelRequest" v-show="isShowCancel"
            >取消请求</van-button
          >
        </div>
        <!-- 提交零配置查询端口时要显示动态图片 -->
        <!--  <div class="zeroConfig">
          <img
            src="../../assets/images/common/3910ad4451aa929b8b5af154076c92cc.gif"
            alt=""
          />
        </div> -->
      </div>
    </van-overlay>
  </div>
</template>

<script>
export default {
  name: "MyLoading",
  data() {
    return {
      show: true,
      isShowCancel: false,
    };
  },
  computed: {},
  methods: {
    // 取消请求
    cancelRequest() {
      this.$store.commit("CLEARCANCEL");
    },
  },
  created() {},
  mounted() {
    // 延时显示取消按钮的请求
    setTimeout(() => {
      this.isShowCancel = true;
    }, 15000);
  },
  beforeDestroy() {
    this.isShowCancel = false;
  },
};
</script>

<style scoped lang="less">
.loading {
  // z-index: 100;
  // position: fixed;
  // width: 110px;
  // padding: 15px 8px;
  // border-radius: 10px;
  // background-color: #4b4b4b;
  // left: 33%;
  // top: 50%;
  // transform: translateY(-50%);
  .van-overlay {
    z-index: 3000;
    background-color: rgba(0, 0, 0, 0.3);
    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      .block {
        width: 110px;
        padding: 15px 8px;
        border-radius: 10px;
        background-color: #4b4b4b;
        .van-button {
          margin-top: 10px;
          height: 36px;
          border-radius: 8px;
        }
        .van-button--normal {
          padding: 0 8px;
        }
      }
    }
  }
}
</style>
