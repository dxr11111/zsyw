<template>
  <div style="height: 100%; background: #f8f7fc">
    <div v-if="!isStart">
      <MyHeader
        :name="'终端设备'"
        left="arrow-left"
        @goBackEv="$router.go(-1)"
      />
      <van-tabs type="card" @click="onClick">
        <van-tab title="领设备">
          <div class="pannel">
            <div class="field">
              <div class="label">设备类型</div>
              <div class="radio-box">
                <span
                  :class="deviceType == '1' ? 'active' : ''"
                  @click="deviceType = '1'"
                  >ONU</span
                >
                <span
                  :class="deviceType == '4' ? 'active' : ''"
                  @click="deviceType = '4'"
                  >IPTV</span
                >
                <span
                  :class="deviceType == '6' ? 'active' : ''"
                  @click="deviceType = '6'"
                  >沃家产品</span
                >
              </div>
            </div>
            <div class="panel-item">
              <span>MAC地址</span>
              <input
                type="text"
                placeholder="请输入或扫描MAC地址"
                v-model="mac"
              />
              <van-icon name="scan" size="26" @click="getScanCode(1)" />
            </div>
            <div class="panel-item">
              <span>{{ deviceType == "1" ? "SN" : "终端串号" }}</span>
              <input
                type="text"
                :placeholder="`请输入或扫描${
                  deviceType == '1' ? 'SN' : '终端串号'
                }`"
                v-model="sn"
              />
              <van-icon name="scan" size="26" @click="getScanCode(2)" />
            </div>
          </div>
          <div class="btn">
            <van-button type="info" block @click="submit">确定</van-button>
          </div>
        </van-tab>
        <van-tab title="领用记录">
          <van-field
            name="选择日期"
            label="选择日期："
            placeholder="请选择查询时间"
            @click="showTime = true"
          >
            <template #input>
              <input type="text" readonly v-model="timeKey" />
              <van-button type="info" size="small" @click.stop="searchReq"
                >查询</van-button
              >
            </template>
          </van-field>
          <van-popup
            v-model="showTime"
            position="bottom"
            :style="{ height: '40%' }"
          >
            <van-datetime-picker
              type="date"
              v-model="currDate"
              :min-date="minDate"
              :max-date="maxDate"
              :columns-order="['year', 'month', 'day']"
              :formatter="formatter"
              @confirm="chooseTime"
              @cancel="showTime = false"
            />
          </van-popup>
          <div class="result" v-if="resultList.length > 0">
            <div
              class="result-item"
              v-for="(item, index) in resultList"
              :key="index"
            >
              <div class="index">{{ index + 1 }}</div>
              <div class="info">
                <div>申请单号：{{ item.code }}</div>
                <div>申请时间：{{ item.applyDate }}</div>
                <div>终端状态：{{ item.sts }}</div>
                <div>终端串码：{{ item.sn }}</div>
                <div>MAC地址：{{ item.mac }}</div>
                <div>通过审批时间：{{ item.examData }}</div>
              </div>
              <div class="type">{{ formalType(item.resourceTypeId) }}</div>
            </div>
          </div>
          <Empty v-else />
        </van-tab>
        <van-tab title="转让申请">
          <div class="transfer" v-if="instList.length > 0">
            <div
              class="transfer-item"
              v-for="(item, index) in instList"
              :key="index"
            >
              <div>姓名：{{ item.userName }}</div>
              <div>身份证号：{{ item.userCode }}</div>
              <div>终端串码：{{ item.sn }}</div>
              <div>MAC地址：{{ item.mac }}</div>
              <div>申请时间：{{ item.applyDate }}</div>
              <div class="opt">
                <van-button type="info" @click="applyBtn('1', item)"
                  >同意</van-button
                >
                <van-button type="info" @click="applyBtn('2', item)"
                  >拒绝</van-button
                >
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <ScanView v-else @goBack="getScanResult" />
  </div>
</template>

<script>
import { formatDate } from "@/utils/public/common";
import {
  ApplyInstApi,
  ReqRecordApi,
  InstChangeApi,
  InstChangeResultApi,
} from "@/http/tools";
import { getItem } from "@/utils/public/sessionStorage";
import { codeScanView } from "@/utils/public/unicomApp";
import ScanView from "@/components/scanView/index.vue";
export default {
  name: "TerminalDevice",
  components: { ScanView },
  data() {
    return {
      userInfo: getItem("loginInfo"),
      sn: "", // 终端串号
      mac: "", // MAC地址
      deviceType: "1", // 设备类型
      timeKey: formatDate(new Date()),
      minDate: new Date(2020, 6, 3),
      maxDate: new Date(2100, 12, 1),
      currDate: new Date(),
      showTime: false,
      resultList: [], // 查询结果
      instList: [], // 转让数据
      isStart: false,
      currIndex: -1,
    };
  },
  created() {},
  methods: {
    // 切换tab栏
    onClick(name, title) {
      if (title == "转让申请") {
        // 点击转让申请时获取
        if (this.instList.length == 0) this.getInstList();
      }
    },
    getScanResult(result) {
      console.log("接收扫码结果", result);
      if (result) {
        this.currIndex == 1 ? (this.mac = result) : (this.sn = result);
      }
      this.isStart = false;
    },
    // 扫码--测试未完成
    getScanCode(type) {
      var result = codeScanView();
      if (result == "local") {
        this.isStart = true;
        this.currIndex = type;
      } else {
        type == 1 ? (this.mac = result) : (this.sn = result);
      }
    },
    applyBtn(type, obj) {
      this.$dialog
        .confirm({
          title: "提示",
          message: `您确认${type == 2 ? "拒绝" : ""}转让嘛？`,
          confirmButtonColor: "#1989fa",
        })
        .then(async () => {
          let params = {
            ...obj,
            result: type, //	转让结果
            applyUserCode: obj.userCode, //	申请人身份证号
            applyUserName: obj.userName, //	申请人姓名
            userName: this.userInfo.userName,
            userCode: this.userInfo.loginNo,
          };
          let data = await InstChangeResultApi(JSON.stringify(params));
          // console.log(data)
          data.operationSuccessFlag
            ? this.$toast.success(data.successMessage)
            : this.$toast.fail(data.errorMessage);
        })
        .catch();
    },
    async getInstList() {
      let data = await InstChangeApi(JSON.stringify(""));
      this.instList = data.result;
    },
    async searchReq() {
      if (this.timeKey == null) return this.$toast("请选择查询时间");
      let data = await ReqRecordApi(
        JSON.stringify({ applyDate: this.timeKey })
      );
      console.log(data);
      this.resultList = data.result;
    },
    formalType(key, value) {
      if (key == "6") {
        value = "沃家产品";
      } else if (key == "4") {
        value = "IPTV";
      } else {
        value = "ONU";
      }
      return value;
    },
    chooseTime(value) {
      this.timeKey = formatDate(value);
      this.showTime = false;
    },
    formatter(type, val) {
      if (type === "year") {
        return val + "年";
      }
      if (type === "month") {
        return val + "月";
      }
      if (type === "day") {
        return val + "日";
      }
      return val;
    },
    async submit() {
      if (this.sn == "" && this.mac == "")
        return this.$toast("MAC地址和终端串号不能同时为空");
      let params = {
        sn: this.sn, //	终端串号
        mac: this.mac, //	MAC地址
        resourceTypeId: this.deviceType, //	设备类型
      };
      let data = await ApplyInstApi(JSON.stringify(params));
      console.log(data);
      data.operationSuccessFlag
        ? this.$toast.success(data.successMessage)
        : this.$toast.fail(data.errorMessage);
      this.sn = "";
      this.mac = "";
    },
  },
};
</script>

<style scoped lang="less">
::v-deep .van-tabs__nav--card {
  border: 1px solid #5a90fd;
}
::v-deep .van-tabs--card > .van-tabs__wrap {
  margin-top: 15px;
}
::v-deep .van-tabs__nav--card .van-tab.van-tab--active {
  background-color: #5a90fd;
  color: #fff;
}
::v-deep .van-tabs__nav--card .van-tab {
  border-right: 1px solid #5a90fd;
}
::v-deep .van-tabs__nav--card .van-tab {
  color: #5a90fd;
}
::v-deep .van-tabs__content {
  padding-top: 15px;
}
::v-deep .van-field__control--custom {
  justify-content: space-between;
}
::v-deep .van-field__label {
  color: #000;
}
.pannel {
  .panel-item {
    display: flex;
    padding: 8px 14px;
    justify-content: space-between;
    background: #fff;
    line-height: 36px;
    font-size: 14px;
    margin-bottom: 15px;
    span {
      width: 60px;
      text-align: start;
    }
    input {
      width: 220px;
      height: 34px;
      // margin-left: 3px;
      border: 1px solid #ccc;
      padding: 0 5px;
      font-size: 14px;
      color: gray;
    }
    .van-icon {
      margin-top: 3px;
    }
  }
  .field {
    display: flex;
    justify-content: space-between;
    padding: 8px 14px;
    background: #fff;
    line-height: 30px;
    font-size: 14px;
    margin-bottom: 15px;
    .label {
      color: #3b3b3b;
    }
    .radio-box {
      span {
        border: 1px solid #5a90fd;
        display: inline-block;
        width: 80px;
        text-align: center;
        color: #5a90fd;
      }
      .active {
        background-color: #5a90fd;
        color: #fff;
      }
    }
    .time {
      color: gray;
      width: 276px;
      border: 1px solid #ccc;
      display: flex;
      justify-content: space-between;
      input {
        margin-left: 8px;
      }
      span {
        margin-right: 10px;
      }
    }
  }
}
.result {
  .result-item {
    display: flex;
    justify-content: space-between;
    padding: 15px 10px;
    font-size: 16px;
    border-bottom: 1px solid #ccc;
    background-color: #fff;
    .index {
      width: 42px;
      line-height: 42px;
      background: #5a90fd;
      border-radius: 21px;
      margin-top: 20px;
      color: #fff;
      margin: auto;
    }
    .info {
      flex: 1;
      text-align: start;
      margin-left: 10px;
      font-size: 14px;
    }
    .type {
      width: 66px;
      color: red;
    }
  }
}
.transfer {
  .transfer-item {
    font-size: 14px;
    text-align: start;
    border-bottom: 1px solid #ccc;
    padding: 10px;
    div {
      margin-bottom: 8px;
    }
    .opt {
      text-align: right;
      .van-button {
        height: 8.73vw;
        margin-left: 15px;
        width: 68px;
      }
    }
  }
}
::v-deep .van-button--block {
  width: 90%;
  margin: auto;
  border-radius: 8px;
  margin-top: 30px;
}
::v-deep .van-button--info {
  background-color: #5a90fd;
}
</style>