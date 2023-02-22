<template>
  <div class="posSubmit">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <!-- tab标签栏 -->
      <van-tabs v-model="activeIndex" sticky offset-top="48px">
        <van-tab :title="posTitle">
          <div
            class="posList"
            :style="{ paddingBottom: bottomHeight }"
            v-if="posDuanKouList.length > 0"
          >
            <div
              class="item"
              v-for="(item, index) in posDuanKouList"
              :key="index"
              @click="clickPos(item, index)"
              :style="
                index === posDuanKouIndex ? 'background-color:#f3f4f5;' : ''
              "
            >
              <div class="portNum">端口号：{{ item.duankouHao }}</div>
              <div
                class="status"
                style="color: #7ae946"
                v-if="item.zhuangTai === 0"
              >
                空闲
              </div>
              <div
                class="status"
                style="color: red"
                v-if="item.zhuangTai === 1"
              >
                占用
              </div>
            </div>
          </div>
          <!-- 显示暂无数据 -->
          <Empty v-else />
        </van-tab>
        <van-tab :title="guangFenTitle">
          <div
            class="opsList"
            :style="{ paddingBottom: bottomHeight }"
            v-if="guangFenList.length > 0"
          >
            <div
              class="item"
              @click="clickGuangFen(item, index)"
              v-for="(item, index) in guangFenList"
              :key="index"
            >
              <div class="title">
                <p style="color: #000">光分编号：</p>
                <p>位置描述：</p>
                <p>最大端口数：</p>
              </div>
              <div class="value">
                <p style="color: #000">{{ item.guangFenBianHao }}</p>
                <p>{{ item.guangFenWeizhi }}</p>
                <p>{{ item.guangFenDuanKouShu }}</p>
              </div>
              <div
                class="selectPort"
                v-if="guangFenDuanKouHao && index === opsPopIndex"
              >
                <p>已选</p>
                <p>光分端口号:{{ guangFenDuanKouHao }}</p>
              </div>
            </div>
          </div>
          <!-- 显示暂无数据 -->
          <Empty v-else />
        </van-tab>
        <van-tab :title="fttbTitle">
          <div
            class="fttbList"
            :style="{ paddingBottom: bottomHeight }"
            v-if="fttblist.length > 0"
          >
            <div class="item" v-for="(item, index) in fttblist" :key="index">
              <p>MAC地址：{{ item.mac }}</p>
              <p>端口总数：{{ item.duankouZongShu }}</p>
              <p>语音端口总数：{{ item.yuyinDuanZongShu }}</p>
              <p>语音端口占用数：{{ item.yuyinDuanZhanYongShu }}</p>
              <p>数据端口总数：{{ item.shujuDuanZongShu }}</p>
              <p>数据端口占用数：{{ item.shujuDuanZhanYongShu }}</p>
              <p>设备位置：{{ item.shebeiWeiZhi }}</p>
            </div>
          </div>
          <!-- 显示暂无数据 -->
          <Empty v-else />
        </van-tab>
      </van-tabs>
      <!-- 光分信息弹出框 -->
      <van-popup v-model="opsInfoShow" class="opsInfo">
        <h3>{{ guangFenPopTitle }}</h3>
        <div
          class="item"
          v-for="(item, index) in guangFenInfo"
          :key="index"
          @click="clickGuangFenPop(item, index)"
          :style="index === guangFenInfoIndex ? 'background-color:#f3f4f5' : ''"
        >
          <div class="content">
            <p>光分端口：{{ item.guangFenDuanKouHao }}</p>
            <p>上联POS编号：{{ item.posBianhao }}</p>
            <p>上联POS端口：{{ item.posDuanKouHao }}</p>
          </div>
          <div
            class="status"
            style="color: #7ae946"
            v-if="item.zhuangTai === 0"
          >
            空闲
          </div>
          <div class="status" style="color: blue" v-if="item.zhuangTai === 1">
            预占
          </div>
          <div class="status" v-if="item.zhuangTai === 2">异常</div>
        </div>

        <div class="buttonRegion">
          <van-button type="info" @click="opsInfoShow = false">取消</van-button>
          <van-button type="info" @click="confirmGuangFen">确认</van-button>
        </div>
      </van-popup>
    </div>

    <div class="bottom" ref="bottom">
      <div class="showInfo">
        <div class="onu row">
          <div class="title col">
            <p style="color: blue">ONU</p>
            <p style="color: red; font-size: 12px">(必选)</p>
          </div>
          <div class="round col">
            <p style="background-color: blue"></p>
          </div>
          <div class="mac col">
            <p style="color: blue">MAC:{{ $route.query.mac }}</p>
          </div>
        </div>
        <div class="ops row">
          <div class="title col">
            <p>光分</p>
            <p style="color: #7ae946; font-size: 12px">(选填)</p>
          </div>
          <div class="round col">
            <p style="background-color: blue" v-if="guangFenBianHao"></p>
            <p v-else></p>
          </div>
          <div class="mac col" style="color: blue">
            <p v-show="guangFenBianHao">编号:{{ guangFenBianHao }}</p>
            <p v-show="guangFenDuanKouHao">端口:{{ guangFenDuanKouHao }}</p>
          </div>
        </div>
        <div class="pos row">
          <div class="title col">
            <p style="color: blue">POS</p>
            <p style="color: red; font-size: 12px">(必选)</p>
          </div>
          <div class="round col">
            <p style="background-color: blue"></p>
          </div>
          <div class="mac col" style="color: blue">
            <p v-show="posBianHao">编号:{{ posBianHao }}</p>
            <p v-show="posDuanKou">端口:{{ posDuanKou }}</p>
          </div>
        </div>
      </div>
      <!-- 提交 -->
      <div class="submit">
        <!-- 选中信息才可提交 -->
        <van-button
          block
          style="background-color: #1989fa; color: #fff"
          v-if="posDuanKou"
          @click="onSubmit"
          >提交</van-button
        >
        <van-button block style="background-color: grey; color: #fff" v-else
          >提交</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { reqIomPosInfoUpdate } from "@/http/button";
export default {
  name: "PosSubmit",
  data() {
    return {
      headName: `POS绑定(${this.$route.query.orderNum})`,
      activeIndex: 0,
      posBianHao: "", // pos编号
      posDuanKou: "", // pos端口
      posDuanKouID: "", // pos端口id
      guangFenID: "", // 光分id
      guangFenDuanKouID: "", // 光分端口id
      guangFenBianHao: "", // 光分编号
      guangFenDuanKouHao: "", // 光分端口
      guangFenDuanKouShu: "", // 光分端口总数
      guangFenWeizhi: "", // 光分位置描述
      // pos信息
      posDuanKouList: [],
      guangFenList: [],
      fttblist: [],
      posDuanKouIndex: -1, // 选中的pos端口索引
      opsInfoShow: false, // 光分信息弹出框
      opsPopIndex: -1, // 弹出框对应的光分信息
      // 点击弹出的光分信息
      guangFenInfo: [],
      guangFenPopTitle: "", // 标题
      guangFenInfoIndex: -1, // 选中的弹出框内的光分信息
      // 底部div高度
      bottomHeight: "",
    };
  },
  computed: {
    // pos端口标题
    posTitle() {
      return `POS端口(${this.posDuanKouList.length})`;
    },
    // 光分信息标题
    guangFenTitle() {
      return `光分信息(${this.guangFenList.length})`;
    },
    // fttb信息标题
    fttbTitle() {
      return `FTTB信息(${this.fttblist.length})`;
    },
  },
  methods: {
    // 回退
    goBackFn() {
      this.$router.go(-1);
    },
    // 获取pos信息
    getPosInfo() {
      let posInfo = JSON.parse(this.$route.query.posInfo);
      this.posDuanKouList = posInfo.posDuanKouList;
      this.guangFenList = posInfo.guangFenList;
      this.fttblist = posInfo.fttblist;
    },
    // 选中pos端口
    clickPos(item, index) {
      if (item.zhuangTai === 1) {
        return this.$toast("只能选择空闲或正向分配端口");
      }
      // 选中空闲状态
      this.posDuanKouIndex = index;
      // 获取选中pos端口
      this.posDuanKou = item.duankouHao;
      this.posDuanKouID = item.duanKouID;
      // 将光分选中的信息清空
      this.guangFenBianHao = "";
      this.guangFenDuanKouHao = "";
      this.guangFenID = "";
      this.guangFenDuanKouID = "";
    },
    // 选中光分信息给弹出框的内容
    clickGuangFen(item, index) {
      this.opsInfoShow = true;
      // 记录弹框对应的内容下标
      this.opsPopIndex = index;
      this.guangFenInfo = item.guangFenDuanKouList;
      this.guangFenDuanKouShu = item.guangFenDuanKouShu;
      this.guangFenWeizhi = item.guangFenWeizhi;
      this.guangFenPopTitle = this.guangFenInfo[0].guangFenBianHao;
    },
    // 弹出框选中光分信息
    clickGuangFenPop(item, index) {
      // 判断选中状态是否异常
      if (item.zhuangTai === 2) {
        return this.$toast("光分端口状态异常，不能选择");
      }
      this.guangFenInfoIndex = index;
    },
    // 弹出框确认光分信息
    confirmGuangFen() {
      // 未选中光分信息无法确认
      if (this.guangFenInfoIndex === -1) {
        return this.$toast("请选择一个设备");
      }
      // 关闭弹出框
      this.opsInfoShow = false;
      // 获取选择的编号，端口
      this.guangFenBianHao =
        this.guangFenInfo[this.guangFenInfoIndex].guangFenBianHao;
      this.guangFenDuanKouHao =
        this.guangFenInfo[this.guangFenInfoIndex].guangFenDuanKouHao;
      this.posDuanKou = this.guangFenInfo[this.guangFenInfoIndex].posDuanKouHao;
      this.posDuanKouID =
        this.guangFenInfo[this.guangFenInfoIndex].posDuanKouID;
      this.guangFenID = this.guangFenInfo[this.guangFenInfoIndex].guangFenID;
      this.guangFenDuanKouID =
        this.guangFenInfo[this.guangFenInfoIndex].guangFenDuanKouID;
    },
    // 提交信息
    async onSubmit() {
      let posInfo = JSON.parse(this.$route.query.posInfo);
      // 传参
      let id = parseInt(this.$route.query.id);
      let posBianHao = this.posBianHao;
      let posShebeiId = posInfo.posShebeiId;
      let posDuanKou = this.posDuanKou;
      let posDuanKouID = this.posDuanKouID;
      let onuId = this.$route.query.onuId;
      let guangFenBianHao = this.guangFenBianHao;
      let guangFenDuanKouShu = this.guangFenDuanKouShu; // 手工
      let guangFenWeizhi = this.guangFenWeizhi; // 手工
      let guangFenID = this.guangFenID;
      let userCreateGuangFen = 0; // 未手工填写光分信息
      let guangFenDuanKou = this.guangFenDuanKouHao;
      let guangFenDuanKouID = this.guangFenDuanKouID;
      let postData = {
        id,
        posBianHao,
        posShebeiId,
        posDuanKou,
        posDuanKouID,
        onuId,
        guangFenBianHao,
        guangFenWeizhi,
        guangFenDuanKouShu,
        guangFenID,
        userCreateGuangFen,
        guangFenDuanKou,
        guangFenDuanKouID,
      };
      let result = await reqIomPosInfoUpdate(JSON.stringify(postData));
      console.log("pos绑定提交结果", result);
      this.apiResponse(result, ".posSubmit", () => {
        this.$router.push({ name: "PosBindMain" });
      });
    },
  },
  created() {
    // 默认选中的pos编号
    this.posBianHao = this.$route.query.posBianHao;
    // 获取pos信息
    this.getPosInfo();
  },
  mounted() {
    // 获取底部div高度
    this.bottomHeight = this.$refs.bottom.clientHeight + "px";
  },
};
</script>

<style scoped lang="less">
.posSubmit {
  .main {
    .van-tabs {
      /deep/.van-tabs__wrap {
        .van-tabs__line {
          background-color: #1989fa;
        }
      }
    }
    .posList {
      .item {
        padding: 10px;
        background: #fff;
        display: flex;
        justify-content: space-between;
      }
    }
    .opsList {
      .item {
        display: flex;
        padding: 10px;
        background-color: #fff;
        text-align: left;
        border-bottom: 1px solid #e0e0e0;
        color: grey;
        font-size: 14px;
        .selectPort {
          margin-left: 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: #7ae946;
        }
        p {
          height: 30px;
          line-height: 30px;
        }
      }
    }
    .fttbList {
      .item {
        background-color: #fff;
        text-align: left;
        margin-top: 10px;
        p {
          padding: 5px 10px;
        }
      }
    }
    .opsInfo {
      width: 90%;
      border-radius: 10px;
      h3 {
        padding: 10px;
      }
      .item {
        display: flex;
        justify-content: space-between;
        padding: 5px;
        text-align: left;
        border-bottom: 1px solid #e0e0e0;
        .content {
          p {
            padding: 5px 0;
          }
        }
        .status {
          display: flex;
          align-items: center;
        }
      }
      .buttonRegion {
        height: 60px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .van-button {
          width: 40%;
          border-radius: 10px;
        }
      }
    }
  }
  .bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    background: #fff;
    .showInfo {
      .row {
        display: flex;
        &:last-child .round p::after {
          content: none;
        }
        .col {
          width: 50px;
          height: 40px;
          padding: 10px;
        }
        .round {
          width: 20px;
          p {
            width: 10px;
            height: 10px;
            margin-top: 10px;
            background: grey;
            border-radius: 10px;
            &::after {
              content: "";
              position: absolute;
              border-left: 2px solid #e0e0e0;
              height: 50px;
              margin-top: 10px;
              left: 84px;
            }
          }
        }
        .mac {
          width: 200px;
          text-align: left;
        }
      }
    }
    .submit {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f8f7fc;
      height: 60px;
      .van-button {
        width: 90%;
        border-radius: 10px;
      }
    }
  }
}
</style>