<template>
  <div class="forcedReceipt">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <van-form @submit="checkForm">
        <!-- 外包材料 -->
        <van-field
          label="外包材料"
          v-model="materialsInfo"
          is-link
          arrow-direction="down"
          placeholder="请编辑外包材料"
          readonly
          @click="editMaterials"
          class="textRight"
        />
        <!-- 选择的外包材料内容 -->
        <div class="materialsContent" v-show="materialsInfo.length > 0">
          {{ materialsInfo }}
        </div>

        <!-- 修复结果 -->
        <van-field
          label="修复结果"
          :value="repairResult"
          @click="repairResultShow = true"
          is-link
          arrow-direction="down"
          placeholder="请选择"
          class="textRight borderTop"
          readonly
        />
        <van-action-sheet
          v-model="repairResultShow"
          :actions="repairResultActions"
          cancel-text="取消"
          close-on-click-action
          @select="selectRepairResult"
        />

        <!-- 1022产品：极寒天气，无法施工 -->
        <div class="borderTop checkBox">
          <van-checkbox
            v-model="coldWeatherChecked"
            v-if="balkSubSortId == 1022"
            >极寒天气，无法施工</van-checkbox
          >
        </div>

        <!-- 修复方式 -->
        <div class="repairWay selectButton borderTop">
          <span class="title">修复方式</span>
          <div class="button">
            <van-button
              :type="repairWay === '电话联系' ? 'info' : ''"
              @click="clickRepairWay(true)"
              native-type="button"
              >电话联系</van-button
            >
            <van-button
              :type="repairWay === '上门' ? 'info' : ''"
              @click="clickRepairWay(false)"
              native-type="button"
              >上门</van-button
            >
          </div>
        </div>

        <!-- 修复方式为上门时显示 -->
        <div class="hide" v-show="repairWay === '上门'">
          <div class="crisRecord" v-if="crisRecord == 1">
            已将CRIS最近一次测试结果自动填充，可手工修改
          </div>
          <!-- 光功率 -->
          <van-field
            v-model="dBm"
            type="number"
            center
            label="光功率"
            placeholder="请输入光功率"
            class="rateInput borderTop"
          >
            <template #button>
              <van-button size="small" class="dBmUnit" disabled>dBm</van-button>
            </template>
          </van-field>

          <!-- 速率 -->
          <div class="rate selectButton borderTop">
            <span class="title">速率</span>
            <div class="button">
              <van-button
                :type="rate === '合格' ? 'info' : ''"
                @click="clickRate(true)"
                native-type="button"
                >合格</van-button
              >
              <van-button
                :type="rate === '不合格' ? 'info' : ''"
                @click="clickRate(false)"
                native-type="button"
                >不合格</van-button
              >
            </div>
          </div>

          <!-- wifi测速 -->
          <div class="wifiSpeed selectButton borderTop">
            <span class="title">wifi测速</span>
            <div class="button">
              <van-button
                :type="wifiSpeed === '已测速' ? 'info' : ''"
                @click="clickWifiSpeed(true)"
                native-type="button"
                >已测速</van-button
              >
              <van-button
                :type="wifiSpeed === '未测速' ? 'info' : ''"
                @click="clickWifiSpeed(false)"
                native-type="button"
                >未测速</van-button
              >
            </div>
          </div>

          <!-- wifi测速的速率 -->
          <van-field
            type="number"
            v-show="wifiSpeed === '已测速'"
            v-model="wifiRate"
            center
            label="速率"
            placeholder="请输入速率"
            class="rateInput borderTop"
          >
            <template #button>
              <van-button size="small" class="rateUnit" disabled
                >Mbps</van-button
              >
            </template>
          </van-field>

          <!-- 是否完成五必查规定动作 -->
          <div class="fiveCheck selectButton borderTop">
            <span class="title">是否完成五必查规定动作</span>
            <div class="button">
              <van-button
                :type="fiveCheck === '是' ? 'info' : ''"
                @click="clickFiveCheck(true)"
                native-type="button"
                >是</van-button
              >
              <van-button
                :type="fiveCheck === '否' ? 'info' : ''"
                @click="clickFiveCheck(false)"
                native-type="button"
                >否</van-button
              >
            </div>
          </div>
        </div>

        <div style="margin: 30px">
          <van-button round block type="info" native-type="submit"
            >确定</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { getItem, removeItem } from "@/utils/public/sessionStorage";
import { reqConstraintFinish } from "@/http/button";
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive";

export default {
  name: "ForcedReceipt",
  mixins: [keepAliveMixin],
  data() {
    return {
      headName: `强制回单(${this.$route.query.orderNum})`,
      materialsInfo: "", // 选择的外包材料内容-展示
      repairResult: "", // 修复结果
      repairResultShow: false,
      repairResultActions: [{ name: "用户满意" }, { name: "无法修复" }],
      repairWay: "电话联系", // 修复方式：电话联系；上门
      dBm: "", // 光功率
      rate: "", // 速率：合格；不合格
      wifiSpeed: "", // wifi测速：已测速；未测速
      wifiRate: "", //wifi测速的速率
      fiveCheck: "", // 是否完成五必查规定动作

      crisRecord: -1, // CRIS是否有记录  1：有记录 2：没有记录

      coldWeatherChecked: false, // 极寒天气，无法施工 1:选中 空:未选中
      balkSubSortId: -1, // 产品标识
    };
  },
  methods: {
    // 回退
    goBackFn() {
      this.$router.go(-1);
      this.$store.commit("removeThisPage", this.$options.name);
    },
    // 选择修复结果
    selectRepairResult(action) {
      this.repairResult = action.name;
    },
    // 选择修复方式
    clickRepairWay(bool) {
      if (bool) this.repairWay = "电话联系";
      else this.repairWay = "上门";
    },
    // 选择速率
    clickRate(bool) {
      if (bool) this.rate = "合格";
      else this.rate = "不合格";
    },
    // wifi测速
    clickWifiSpeed(bool) {
      if (bool) this.wifiSpeed = "已测速";
      else this.wifiSpeed = "未测速";
    },
    // 是否完成五必查规定动作
    clickFiveCheck(bool) {
      if (bool) this.fiveCheck = "是";
      else this.fiveCheck = "否";
    },
    // 编辑外包材料
    editMaterials() {
      this.$router.push({
        name: "Materials",
        query: {
          orderNum: this.$route.query.orderNum,
        },
      });
    },
    // 获取外包材料-显示页面
    getMaterialInfo() {
      if (getItem("saveMaterialInfo")) {
        let MaterialInfo = getItem("saveMaterialInfo");
        let MaterialValues = Object.values(MaterialInfo);
        let MaterialNames = [
          "二芯室内线:米",
          "铁芯电话线(黑皮):米",
          "网线-五类线:米",
          "室内光皮线:米",
          "室外光皮线:米",
          "光纤尾纤:套",
          "冷接插头:个",
          "热熔插头:个",
          "水晶头:个",
          "光跳线:条",
        ];
        let str = "";
        MaterialValues.forEach((value, index) => {
          if (value !== "") {
            let name = MaterialNames[index].split(":")[0];
            let va = value;
            let unit = MaterialNames[index].split(":")[1];
            str += `[${name}:${va}${unit}]`;
          }
        });
        this.materialsInfo = str;
      }
    },
    // 端到端强制回单前查询
    async getConstraintFinish() {
      try {
        let result = await reqConstraintFinish(
          JSON.stringify({ id: parseInt(this.$route.query.id) })
        );
        this.apiResponse(result, ".forcedReceipt", () => {
          this.balkSubSortId = result.balkSubSortId;
          this.crisRecord = result.type; // cris是否有记录 1：有记录 2：没有记录
          if (result.type == 1) {
            this.dBm = result.resultDesc3; // 光功率
          }
          // testStatus2;//进阶测试ID（测速）1：合格  2：不合格，0：默认
        });

        console.log("强制回单前查询", result);
      } catch (error) {
        console.log("err", error);
      }
    },
    // 表单校验
    checkForm() {
      if (this.materialsInfo == "") return this.$toast("请编辑外包材料");
      if (this.repairResult == "") return this.$toast("请选择修复结果");

      this.skipSign(); // 跳转到签名路由
    },
    // 跳转到签名路由
    skipSign() {
      let id = parseInt(this.$route.query.id);
      let useMaterial = 0; // 是否使用了外包材料（0：未使用，1：使用）
      let materialInfoItems = [getItem("saveMaterialInfo")];
      let repairType = this.repairWay; // 修复方式:电话联系;上门
      let netSpeed = this.rate; // 速率：合格；不合格
      let lightPower = this.dBm; // 光功率 eg：”12dBm”
      let wifiTest = this.wifiSpeed; // WIFI测速 eg：”已测速,,23 Mbps”
      let isFinishMustAction = this.fiveCheck; // 是否完成五必查规定动作:是否
      let repairResult = this.repairResult; // 修复结果:用户满意;无法修复
      let coldWeather = this.coldWeatherChecked ? "1" : ""; // 极寒天气，无法施工
      // 无用 按照手机端请求参数设置
      let config = {
        balkContent: "",
        balkType: 0,
        buwei: -1,
        fCDateTime: "",
        fCSpeed: "",
        fCType: "",
        finishGoWhere: -1,
        ifmDeviceEvaluateList: [],
        leibie: -1,
        needFiberNo: -1,
        newOnuIptvItems: [],
        noBindingReason: -1,
        overTiemContent: "",
        overTimeReason: "",
        reason: -1,
        remark: "",
        wifiQuality: 0,
        wifiType: 0,
      };
      if (this.materialsInfo.length > 0) useMaterial = 1;
      if (lightPower.length > 0) lightPower = lightPower + "dBm";
      if (wifiTest === "已测速") wifiTest = `已测速,,${this.wifiRate} Mbps`;
      let postData = {
        id,
        useMaterial,
        materialInfoItems,
        repairType,
        netSpeed,
        lightPower,
        wifiTest,
        isFinishMustAction,
        repairResult,
        coldWeather,
        ...config,
      };
      postData = JSON.stringify(postData);

      this.$router.push({
        name: "Signature",
        // 将接口参数传到签名页面
        query: {
          id: parseInt(this.$route.query.id),
          orderNum: this.$route.query.orderNum,
          postData,
        },
      });
    },
  },
  created() {
    // 端到端强制回单前查询
    this.getConstraintFinish();
  },
  activated() {
    // 获取外包材料
    this.getMaterialInfo();
  },
  beforeDestroy() {
    removeItem("saveMaterialInfo"); // 销毁
  },
};
</script>

<style scoped lang="less">
.forcedReceipt {
  height: 100%;
  background-color: @bg-color;
  .main {
    .materialsContent {
      padding: 10px;
      text-align: left;
      background-color: #fff;
      color: #969799;
    }
    .borderTop {
      border-top: 1px solid #e0e0e0;
    }
    .textRight {
      /deep/.van-cell__value.van-field__value {
        input {
          text-align: right;
        }
      }
    }
    .selectButton {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 45px;
      padding: 0 10px 0 16px;
      background-color: #fff;
      .title {
        display: flex;
        align-items: center;
        color: #646566;
        font-size: 14px;
      }
      .button {
        .van-button {
          width: 90px;
          height: 35px;
        }
      }
    }
    .checkBox {
      padding: 10px;
      background: #fff;
    }
    .hide {
      .crisRecord {
        padding: 10px;
        background: #d4f085;
        color: red;
        font-size: 14px;
      }
      .dBmUnit,
      .rateUnit {
        border: none;
        opacity: 1;
      }
      .rateInput {
        /deep/.van-cell__value.van-field__value {
          input {
            border: 1px solid #e0e0e0;
            text-indent: 10px;
          }
        }
      }
    }
  }
}
</style>