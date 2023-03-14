<template>
  <div class="changeDevDispatch">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <!-- 录入新设备 -->
      <div class="top">
        <div class="enter" @click="enterNewDev">[录入新设备]</div>
      </div>
      <template v-if="devList.length > 0">
        <div class="listInfo" v-for="(item, index) in devList" :key="index">
          <div class="left">
            <!-- 终端型号 -->
            <div class="title" v-if="item.resType == 1">ONU</div>
            <div class="title" v-if="item.resType == 4">IPTV</div>
            <div class="title" v-if="item.resType == 6">沃家产品</div>
            <div class="content">
              <span>厂{{ "\u3000\u3000" }}家：{{ item.supplierName }}</span>
              <span>终端串码：{{ item.sn }}</span>
              <span>终端MAC：{{ item.mac }}</span>
              <span>终端型号：{{ item.resModelName }}</span>
            </div>
          </div>
          <div class="right">
            <van-button type="danger" @click="changeDev(item)">{{
              item.canChange === 1 ? "更换" : "更换中"
            }}</van-button>
            <van-button
              type="danger"
              @click="changeRecord(item.devSeq)"
              v-if="item.hasChange"
              >换机记录</van-button
            >
          </div>
        </div>
      </template>
      <template v-else>
        <Empty />
      </template>
    </div>
    <!-- 录入新设备弹出层 -->
    <van-popup v-model="showEnter">
      <div class="enterNewDev">
        <!-- 终端型号按钮 -->
        <div class="selectRegion">
          <van-button
            plain
            type="info"
            v-for="(item, index) in selectType"
            :key="index"
            @click="clickType(item)"
            :class="item.value == resType ? 'activeButton' : ''"
            >{{ item.name }}</van-button
          >
        </div>
        <!-- 扫描或录入区域 -->
        <!-- 录入新设备  可输入 -->
        <div class="scanRegion">
          <van-field
            v-model="ysSN"
            label="应收终端串码"
            right-icon="scan"
            placeholder="扫描或录入应收终端串码"
            v-if="isChange == false"
          />
          <van-field
            v-model="ysMAC"
            label="应收MAC地址"
            right-icon="scan"
            placeholder="扫描或录入应收MAC地址"
            v-if="isChange == false"
          />
          <!-- 更换 不可输入 -->
          <van-field
            v-model="changeSn"
            label="应收终端串码"
            right-icon="scan"
            placeholder="扫描或录入应收终端串码"
            v-if="isChange == true"
            readonly
          />
          <van-field
            v-model="changeMAC"
            label="应收MAC地址"
            right-icon="scan"
            placeholder="扫描或录入应收MAC地址"
            v-if="isChange == true"
            readonly
          />

          <van-field
            v-model="ssSN"
            label="实收终端串码"
            right-icon="scan"
            placeholder="扫描或录入实收终端串码"
          />
          <van-field
            v-model="ssMAC"
            label="实收MAC地址"
            right-icon="scan"
            placeholder="扫描或录入实收MAC地址"
          />
          <van-field
            v-model="newSN"
            label="新占用终端串码"
            right-icon="scan"
            placeholder="扫描或录入新占用终端串码"
          />
          <van-field
            v-model="newMAC"
            label="新占用MAC地址"
            right-icon="scan"
            placeholder="扫描或录入新占用MAC地址"
          />
        </div>
        <!-- 确认 取消 -->
        <div class="buttonRegion">
          <van-button type="info" @click="showEnter = false">取消</van-button>
          <van-button type="info" @click="confirmDev">确认</van-button>
        </div>
      </div>
    </van-popup>
    <!-- 确认新旧设备数据弹出层 -->
    <van-popup v-model="showNewOldData">
      <div class="newOldData">
        <h3>确认新旧设备数据</h3>
        <table>
          <tr>
            <th></th>
            <th>新</th>
            <th>旧</th>
          </tr>
          <tr>
            <td>ONU型号</td>
            <td>{{ newMsg.sheBeiXingHao }}</td>
            <td>{{ oldMsg.sheBeiXingHao }}</td>
          </tr>
          <tr>
            <td>数据口数</td>
            <td>{{ newMsg.shuJuKou }}</td>
            <td>{{ oldMsg.shuJuKou }}</td>
          </tr>
          <tr>
            <td>语音口数</td>
            <td>{{ newMsg.yuYinKou }}</td>
            <td>{{ oldMsg.yuYinKou }}</td>
          </tr>
          <tr>
            <td>接入方式</td>
            <td>{{ newMsg.jieRuFangShi }}</td>
            <td>{{ oldMsg.jieRuFangShi }}</td>
          </tr>
          <tr>
            <td>厂家</td>
            <td>{{ newMsg.changJia }}</td>
            <td>{{ oldMsg.changJia }}</td>
          </tr>
          <tr>
            <td>上联方式</td>
            <td>{{ newMsg.shangLianFangShi }}</td>
            <td>{{ oldMsg.shangLianFangShi }}</td>
          </tr>
          <tr>
            <td>OLT上联</td>
            <td>{{ newMsg.oltShangLian }}</td>
            <td>{{ oldMsg.oltShangLian }}</td>
          </tr>
          <tr>
            <td>款型</td>
            <td>{{ newMsg.kuanXing }}</td>
            <td>{{ oldMsg.kuanXing }}</td>
          </tr>
          <tr>
            <td>支持千兆</td>
            <td>{{ newMsg.qianZhao }}</td>
            <td>{{ oldMsg.qianZhao }}</td>
          </tr>
          <tr>
            <td>路由标识</td>
            <td>{{ newMsg.luYou }}</td>
            <td>{{ oldMsg.luYou }}</td>
          </tr>
          <tr>
            <td>软件版本</td>
            <td>{{ newMsg.banBen }}</td>
            <td>{{ oldMsg.banBen }}</td>
          </tr>
          <tr>
            <td>已开通语音口数</td>
            <td>{{ newMsg.yuYinKaiTong }}</td>
            <td>{{ oldMsg.yuYinKaiTong }}</td>
          </tr>
        </table>
        <!-- 确认 取消 -->
        <div class="buttonRegion">
          <van-button type="info" @click="showNewOldData = false"
            >取消</van-button
          >
          <van-button type="info" @click="newOldDataConfirm">确认</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  reqChangeDevDispatch,
  reqDevZy,
  reqDevSubmit,
  reqQueryChangeDevStage,
} from "@/http/button";
import { mapGetters } from "vuex";
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive";

export default {
  name: "ChangeDevDispatch",
  mixins: [keepAliveMixin],

  data() {
    return {
      headName: `更换设备(${this.$route.query.orderNum})`,
      devList: [], // 设备列表
      showEnter: false, // 录入新设备/更换弹出层
      isChange: true, // 确认点击的是更换还是录入新设备
      // 更换时点击的设备终端串码和mac地址
      changeSn: "",
      changeMAC: "",
      // 点击的更换设备
      devSeq: -1,
      changeSheetNo: "",
      // 弹出层终端型号
      selectType: [
        { name: "ONU", value: 1 },
        { name: "IPTV", value: 4 },
        { name: "沃家产品", value: 6 },
      ],
      // 录入新设备及更换 弹出框内容
      resType: 1, // 按钮-终端类型 1：ONU  4：IPTV  6：沃家产品
      ysSN: "", // 应收终端串码
      ysMAC: "", // 应收MAC地址
      ssSN: "", // 实收终端串码
      ssMAC: "", // 实收MAC地址
      newSN: "", // 新占用终端串码
      newMAC: "", // 新占用MAC地址
      // 确认新旧设备数据-换机查询资源
      newMsg: {},
      oldMsg: {},
      changJing: "", // 换机场景错误提示
      tiShi: "", // 提示信息
      showNewOldData: false, // 确认新旧设备数据弹出层
      // 换机查询资源响应回来有用的数据
      sheetType: 0, // 0：掌上运维起换机单  1：沃易售起换机单
    };
  },
  computed: {
    ...mapGetters(["getLoginInfo"]),
  },
  watch: {
    showEnter(value) {
      // 录入设备弹出层关闭时
      if (!value) {
        // 清空输入框内容
        this.ysSN = "";
        this.ysMAC = "";
        this.ssSN = "";
        this.ssMAC = "";
        this.newSN = "";
        this.newMAC = "";
      }
    },
  },
  methods: {
    // 回退
    goBackFn() {
      this.$router.go(-1);
      // 销毁换机路由
      this.$store.commit("removeThisPage", this.$options.name);
    },
    // 换机前查询
    async getChangeDevDispatch() {
      let id = parseInt(this.$route.query.id);
      try {
        let result = await reqChangeDevDispatch(JSON.stringify({ id }));
        console.log("换机前查询结果", result);
        this.apiResponse(result, ".changeDevDispatch", () => {
          // 设备列表
          this.devList = result.onuIptvList;
          // 将空值替换成--
          this.devList.forEach((dev) => {
            Object.keys(dev).forEach((key) => {
              if (dev[key] === "") {
                dev[key] = "--";
              }
            });
          });
        });
      } catch (error) {
        console.log("err", error);
      }
    },
    // 点击换机记录
    changeRecord(devSeq) {
      // 跳转到换机记录界面
      this.$router.push({
        name: "ChangeDevHis",
        query: {
          devSeq,
          orderNum: this.$route.query.orderNum,
          id: this.$route.query.id,
        },
      });
    },
    // 点击录入新设备
    enterNewDev() {
      // 重置按钮-终端类型
      this.resType = 1;
      // 确认点击是新设备
      this.isChange = false;
      this.showEnter = true;
    },
    // 点击更换
    async changeDev(item) {
      // 更换中无法点击
      if (item.canChange === 1) {
        // 更换
        // 先清空输入框内容
        this.ssSN = "";
        this.ssMAC = "";
        this.newSN = "";
        this.newMAC = "";

        // 记录更换的设备信息
        this.resType = item.resType;
        this.changeSn = item.sn;
        this.changeMAC = item.mac;
        this.devSeq = item.devSeq;
        this.changeSheetNo = item.sheetNo;
        // 标识当前弹框点击的是更换按钮
        this.isChange = true;
        this.showEnter = true;
      } else {
        // 更换中-查询对应的设备换机进度
        let changeSheetNo = item.sheetNo;
        let result = await reqQueryChangeDevStage(
          JSON.stringify({ changeSheetNo })
        );
        console.log("查询对应设备的换机进度", result);
        this.apiResponse(result, ".changeDevDispatch", () => {
          if (result.remark.length > 0) {
            this.$dialog
              .alert({
                title: "提示",
                message: result.remark,
                getContainer: ".changeDevDispatch",
                className: "confirmDialog",
              })
              .then(() => {
                // on close
              });
          }
        });
      }
    },
    // 点击弹出框里的终端类型
    clickType(item) {
      // 只有录入新设备时才可点击切换终端型号
      if (!this.isChange) this.resType = item.value;
    },
    // 确认录入新设备/更换
    async confirmDev() {
      // 判断点击的是更换还是录入新设备
      if (this.isChange) {
        // 更换
        this.ysSN = this.changeSn;
        this.ysMAC = this.changeMAC;
      }

      // 判断输入框值是否填写正确
      if (this.newSN.trim() === "" && this.newMAC.trim() === "") {
        return this.$toast("新占用终端串码和MAC地址不能同时为空!");
      }
      if (
        (this.ysSN === "" && this.ysMAC === "") ||
        (this.ssSN === "" && this.ssMAC === "")
      ) {
        return this.$toast("应收串码和MAC与实收串码和MAC不能同时为空");
      }
      if (this.newSN === this.ssSN || this.newSN === this.ysSN) {
        if (this.newSN !== "") {
          return this.$toast("新占用的串码不能与应收或实收的串码相同");
        }
      }
      if (this.newMAC === this.ssMAC || this.newMAC === this.ysMAC) {
        // 都为空的不算
        if (this.newMAC !== "") {
          return this.$toast("新占用的MAC不能与应收或实收的MAC相同");
        }
      }
      // 验证是否填写中文
      let str =
        this.ysSN +
        this.ysMAC +
        this.ssSN +
        this.ssMAC +
        this.newSN +
        this.newMAC;
      let regular = new RegExp("[\\u4E00-\\u9FFF]+", "g");
      if (regular.test(str)) {
        return this.$toast(
          "MAC地址或终端串码格式不正确，请重新扫码或手动填写!"
        );
      }
      // 关闭录入新设备/更换弹出层
      this.showEnter = false;
      // 拿到录入新设备/更换信息
      let onuIptvChangeInfoItem = {
        resType: this.resType,
        seq: "",
        oldSeq: "",
        ysSN: this.ysSN.trim(),
        ysMAC: this.ysMAC.trim(),
        ssSN: this.ssSN.trim(),
        ssMAC: this.ssMAC.trim(),
        newSN: this.newSN.trim(),
        newMAC: this.newMAC.trim(),
      };
      // ONU点击确认调用接口换机查询资源-弹出框显示确认新设备数据（点击确认再调用接口换机提交）
      if (this.resType === 1) {
        // onu
        // 判断点击的是更换还是录入新设备
        if (this.isChange) {
          // 更换
          onuIptvChangeInfoItem.oldSeq = this.devSeq;
          // ysSN和ysMAC要取换机前查询的值
          /*  onuIptvChangeInfoItem = {
            ...onuIptvChangeInfoItem,
            ysSN: this.changeSn,
            ysMAC: this.changeMAC,
          }; */
        }
        try {
          let result = await reqDevZy(
            JSON.stringify({ onuIptvChangeInfoItem })
          );
          console.log("确认新旧设备数据", result);
          this.apiResponse(result, ".changeDevDispatch", () => {
            // 获取devSeq
            this.devSeq = result.devSeq;
            // 得到新旧设备数据
            this.newMsg = result.newMsg;
            this.oldMsg = result.oldMsg;
            // 显示新旧设备弹出框
            this.showNewOldData = true;
            this.changJing = result.changJing;
            // changJing当值为-1时，提示换机场景错误，无法换机，确定按钮失效，显示提示信息（为-1时无法点击确认按钮，页面显示提示信息）
            if (result.changJing === -1) {
              // 显示提示信息
              this.tiShi = result.tiShi;
              // 确认按钮失效
            }
            // sheetType为1时弹出框'请到沃易售起草换机单'
            if (result.sheetType === 1) {
              this.$toast("请到沃易售起草换机单");
            }
          });
        } catch (error) {
          console.log("err", error);
        }
      } else {
        // iptv和沃家产品点击确认直接调用换机提交
        this.newOldDataConfirm();
      }
    },
    // onu确认新旧设备数据-点击确认换机提交/iptv，沃家产品直接提交
    async newOldDataConfirm() {
      // 当changJing值为-1时，确定按钮失效
      if (this.changJing === "-1") {
        return this.$toast("无法确认提交");
      }
      this.showNewOldData = false; // 关闭弹出层
      let id = parseInt(this.$route.query.id);
      let changeType = this.resType.toString(); // 当前resType的值
      let oldMsg = this.oldMsg; // onu时传
      let newMsg = this.newMsg; // onu时传
      let changeSheetNo = ""; // 点击录入新设备传空
      let devSeq = ""; // 录入设备或更换时onu换机前查询资源获取devSeq提交时用到；iptv或沃家产品传空
      let sheetType = this.sheetType;
      // iptv时传
      let onuIptvChangeInfoItem = {
        resType: this.resType,
        seq: "",
        oldSeq: "",
        ysSN: this.ysSN,
        ysMAC: this.ysMAC,
        ssSN: this.ssSN,
        ssMAC: this.ssMAC,
        newSN: this.newSN,
        newMAC: this.newMAC,
      };
      let changJing = this.changJing; // iptv和沃家产品穿空
      let ysMAC = this.ysMAC;
      let ysSN = this.ysSN;
      // 判断点击的是更换还是录入新设备
      if (this.isChange) {
        // 更换-传换机前查询里选中的值
        onuIptvChangeInfoItem.oldSeq = this.devSeq;
        devSeq = this.devSeq;
        changeSheetNo = this.changeSheetNo;
        // ysSN和ysMAC要取换机前查询的值
        onuIptvChangeInfoItem = {
          ...onuIptvChangeInfoItem,
          ysSN: this.changeSn,
          ysMAC: this.changeMAC,
        };
      }

      let postData = {};
      if (this.resType == 1) {
        // onu
        postData = {
          id,
          changeType,
          oldMsg,
          newMsg,
          changeSheetNo,
          devSeq: this.devSeq,
          sheetType,
          changJing,
          ysMAC,
          ysSN,
        };
      } else {
        // iptv/沃家产品 需要传onuIptvChangeInfoItem
        postData = {
          id,
          changeType,
          changeSheetNo,
          devSeq,
          sheetType,
          onuIptvChangeInfoItem,
          changJing: "",
          ysMAC,
          ysSN,
        };
      }
      try {
        let result = await reqDevSubmit(JSON.stringify(postData));
        console.log("换机提交结果", result);
        this.apiResponse(result, ".changeDevDispatch", () => {
          // 提交成功 → 再次调用换机前查询接口
          this.getChangeDevDispatch();
        });
      } catch (error) {
        console.log("err", error);
      }
    },
  },
  created() {
    // 换机前查询
    this.getChangeDevDispatch();
  },
};
</script>

<style scoped lang="less">
.changeDevDispatch {
  height: 100%;
  background-color: #f8f7fc;
  .main {
    .top {
      display: flex;
      justify-content: flex-end;
      padding: 10px;
      background-color: #fff;
      border-bottom: 1px solid #e0e0e0;
      .enter {
        color: red;
      }
    }
    .listInfo {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      font-size: 14px;
      background-color: #fff;
      border-bottom: 1px solid #e0e0e0;
      .left {
        display: flex;
        .title {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          // line-height: 40px;
          background: #1989fa;
          color: #fff;
          border-radius: 20px;
          margin-right: 10px;
          font-size: 12px;
        }
        .content {
          display: flex;
          flex-direction: column;
          align-self: center;
          text-align: left;
          font-size: 12px;
          span {
            white-space: nowrap;
          }
        }
      }
      .right {
        display: flex;
        flex-direction: column;
        text-align: right;
        .van-button {
          width: 90px;
          height: 40px;
          margin-bottom: 5px;
        }
      }
    }
  }
  .van-popup {
    .enterNewDev {
      .selectRegion {
        display: flex;
        justify-content: center;
        padding: 10px;
        .van-button {
          width: 100px;
        }
        .activeButton {
          background-color: #1989fa;
          color: #fff;
        }
      }
      .scanRegion {
        /deep/.van-cell__title.van-field__label {
          padding: 5px 0;
          width: 100px;
          white-space: nowrap;
        }
        /deep/.van-cell__value.van-field__value {
          width: 200px;
          input {
            padding: 5px;
            font-size: 12px;
            border: 1px solid #e0e0e0;
          }
          .van-icon {
            font-size: 25px;
          }
        }
      }
      .buttonRegion {
        display: flex;
        justify-content: space-around;
        padding: 10px;
        .van-button {
          width: 40%;
        }
      }
    }
  }
  .van-popup {
    .newOldData {
      width: 300px;
      h3 {
        padding: 10px;
      }
      table {
        width: 100%;
        font-size: 12px;
        border: 1px solid #e0e0e0;
        border-collapse: separate;
        border-spacing: 0px;
        tr {
          th,
          td {
            width: 100px;
            border: 1px solid #e0e0e0;
          }
          td {
            padding: 10px 5px;
          }
        }
      }
      .buttonRegion {
        display: flex;
        justify-content: space-around;
        padding: 10px;
        margin-top: 20px;
        .van-button {
          width: 40%;
        }
      }
    }
  }
}
</style>