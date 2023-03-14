<template>
  <!-- 我已到达-随销单生成提示 -->
  <div class="arriveTips">
    <van-popup v-model="arriveTipsShow" :close-on-click-overlay="false">
      <div class="title">操作成功</div>
      <div class="main">
        <div>
          <i class="iconfont icon-icon_duihao-mian"></i>
          <p>我已到达操作成功</p>
        </div>
        <div>
          <i class="iconfont icon-icon_duihao-mian"></i>
          <p>
            该用户具备营销机会，已在掌上运维生成随销单，请主动与用户联系并回填随销单信息
          </p>
        </div>
      </div>
      <div class="button">
        <van-button type="info" @click="closePop">确认</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "ArriveTips",
  data() {
    return {};
  },
  computed: {
    ...mapState("button", ["arriveTipsShow"]),
  },
  methods: {
    closePop() {
      this.$store.commit("button/changeArriveTipsShow", false);
    },
  },
};
</script>

<style scoped lang="less">
.arriveTips {
  .van-popup {
    width: 80%;
    padding: 10px;
    .title {
      padding: 10px;
      font-size: 18px;
      font-weight: 600;
      border-bottom: 1px solid #e0e0e0;
    }
    .main {
      div {
        display: flex;
        align-items: center;
        p {
          padding: 10px;
          text-align: left;
          font-weight: 500;
        }
        .iconfont {
          font-size: 20px;
          color: rgb(6, 192, 6);
        }
      }
    }
    .button {
      .van-button {
        width: 40%;
      }
    }
  }
}
</style>