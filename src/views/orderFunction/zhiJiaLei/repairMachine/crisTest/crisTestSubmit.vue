<template>
  <div class="crisTestSubmit">
    <MyHeader
      :name="headName"
      left="arrow-left"
      @goBackEv="goBackFn"
      rightText="历史记录"
      @rightEv="historyRecord"
    />
    <div class="main">
      <van-form @submit="onSubmit">
        <!-- 用户标识类型 -->
        <div class="markType">
          <h5>用户标识类型</h5>
          <div class="buttonRegion">
            <van-button
              v-for="(button, index) in buttonList"
              :key="index"
              :class="activeButtonIndex === index ? 'activeButton' : ''"
              @click="clickButton(index)"
              native-type="button"
              >{{ button.name }}</van-button
            >
          </div>
        </div>

        <!-- 用户标识 -->
        <van-field
          v-model="markNum"
          label="用户标识"
          placeholder="请输入或扫描录入用户标识"
          right-icon="scan"
        />

        <!-- 申告下拉菜单 -->
        <div class="redress">
          <!-- 申告业务类型 -->
          <van-field
            readonly
            clickable
            name="businessType"
            :value="businessType"
            label="申告业务类型"
            placeholder="请选择申告业务类型"
            @click="businessTypeShow = true"
            is-link
            arrow-direction="down"
          />
          <van-action-sheet
            v-model="businessTypeShow"
            :actions="businessTypeActions"
            cancel-text="取消"
            close-on-click-action
            @select="businessTypeConfirm"
          />

          <!-- 故障申告类型 -->
          <van-field
            readonly
            clickable
            name="faultType"
            :value="faultType"
            label="故障申告类型"
            placeholder="请选择故障申告类型"
            @click="clickFaultType"
            is-link
            arrow-direction="down"
          />
          <van-action-sheet
            v-model="faultTypeShow"
            :actions="faultTypeActions"
            cancel-text="取消"
            close-on-click-action
            @select="faultTypeConfirm"
          />
          <!-- 申告出错代码 -->
          <van-field
            readonly
            clickable
            name="errorCode"
            :value="errorCode"
            label="申告出错代码"
            placeholder="请选择申告出错代码"
            @click="clickErrorCode"
            is-link
            arrow-direction="down"
            v-show="errorCodeFieldShow"
          />
          <van-action-sheet
            v-model="errorCodeShow"
            :actions="errorCodeActions"
            cancel-text="取消"
            close-on-click-action
            @select="errorCodeConfirm"
          />
        </div>

        <div style="margin: 30px">
          <van-button round block type="info" native-type="submit"
            >结单测试</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { reqCRISTestSubmit } from "@/http/button";
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive";

export default {
  name: "CrisTest",
  mixins: [keepAliveMixin],

  data() {
    return {
      headName: "CRIS测试",
      // 用户标识类型
      activeButtonIndex: 0,
      buttonList: [
        { name: "电话号码", value: "dn" },
        { name: "宽带编号", value: "bbcode" },
        { name: "宽带账号", value: "acnt" },
        { name: "IPTV业务账号", value: "iptvacnt" },
        { name: "IPTV机顶盒MAC", value: "iptvstbmac" },
      ],
      // 用户标识
      markNum: this.$route.query.balkPhone, // 默认为列表故障号码
      // 申告业务类型
      businessType: "",
      businessTypeValue: "", // 传参
      businessTypeShow: false,
      businessTypeActions: [
        { name: "语音业务", value: "voice" },
        { name: "数据业务", value: "data" },
        { name: "IPTV业务", value: "iptv" },
      ],
      // 故障申告类型
      faultType: "",
      faultTypeValue: "",
      faultTypeShow: false,
      faultTypeActions: [],
      // 申告出错代码（IPTV业务)
      errorCodeFieldShow: true,
      errorCode: "",
      errorCodeShow: false,
      errorCodeActions: [],
    };
  },
  methods: {
    // 回退
    goBackFn() {
      this.$router.go(-1);
    },
    // 历史记录
    historyRecord() {
      this.$router.push({
        name: "HistoryRecord",
        query: {
          id: this.$route.query.id,
        },
      });
    },
    // 点击标识按钮
    clickButton(index) {
      this.activeButtonIndex = index;
    },
    // 点击故障申告类型下拉菜单
    clickFaultType() {
      // 判断businessType是否有值
      if (this.businessType == "") {
        this.$toast("请选择申告业务类型");
      } else {
        this.faultTypeShow = true;
      }
    },
    // 点击申告出错代码下拉菜单
    clickErrorCode() {
      // 判断faultType是否有值
      if (this.faultType == "") {
        this.$toast("请选择故障申告类型");
      } else {
        this.errorCodeShow = true;
      }
    },
    // 确认申告业务类型
    businessTypeConfirm(action, index) {
      this.businessType = action.name;
      this.businessTypeValue = action.value;
      if (action.value == "voice") {
        this.faultTypeActions = [{ name: "语音故障", value: "yygz" }];
        this.faultType = "语音故障";
        this.faultTypeValue = "yygz";
        this.errorCodeFieldShow = false;
      } else if (action.value == "data") {
        this.faultTypeActions = [
          { name: "网页打不开", value: "wydbk" },
          { name: "上网速度慢", value: "swsdm" },
          { name: "上网常掉线", value: "swcdx" },
          { name: "网络应用类故障", value: "wllyy" },
          { name: "宽带并发超限", value: "kdsj" },
          { name: "无法上网", value: "wfsw" },
        ];
        this.faultType = "网页打不开";
        this.faultTypeValue = "wydbk";
        this.errorCodeFieldShow = false;
      } else if (action.value == "iptv") {
        this.faultTypeActions = [
          { name: "开机蓝屏/黑屏", value: "iptvkjlphp" },
          { name: "4k业务无法使用", value: "iptvno4k" },
        ];
        this.faultType = "开机蓝屏/黑屏";
        this.faultTypeValue = "iptvkjlphp";
        this.errorCodeFieldShow = true;
        this.errorCodeActions = [
          { name: "iptvwcc" },
          { name: "iptv10000" },
          { name: "iptv10001" },
          { name: "iptv10010" },
          { name: "iptv10071" },
          { name: "iptv40001" },
          { name: "iptv91001" },
          { name: "iptv91002" },
          { name: "iptv91003" },
          { name: "iptv91007" },
          { name: "iptv91008" },
        ];
        this.errorCode = "iptvwcc";
      }
    },
    // 确认故障申告类型
    faultTypeConfirm(action) {
      this.faultType = action.name;
      this.faultTypeValue = action.value;
      if (action.value == "wfsw") {
        this.errorCodeFieldShow = true;
        this.errorCodeActions = [
          { name: "691" },
          { name: "678" },
          { name: "619" },
          { name: "629" },
          { name: "769" },
          { name: "718" },
          { name: "wcc" },
        ];
        this.errorCode = "691";
      } else {
        this.errorCodeFieldShow = false;
      }
    },
    // 确认申告出错代码
    errorCodeConfirm(action) {
      this.errorCode = action.name;
    },
    // 点击结单测试发送请求
    async onSubmit() {
      // 表单校验
      if (this.businessType == "") return this.$toast("请选择申告业务类型");

      let id = parseInt(this.$route.query.id); // 工单唯一标识
      let balkPhone = this.markNum; // 用户标识
      let testType = 1; // 测试场景
      let subid_type = this.buttonList[this.activeButtonIndex].value; // 用户标识类型
      let service_type = this.businessTypeValue; // 申告业务类型
      let complaint_type = this.faultTypeValue; // 故障申告类型
      let complaint_faultcode = this.errorCode; // 申告出错代码
      let isSend = true; // 是否可以发送请求
      let postData = {
        id,
        balkPhone,
        testType,
        subid_type,
        service_type,
        complaint_type,
        complaint_faultcode,
      };
      // 不同的用户标识类型匹配的用户标识数字长度不一样
      switch (subid_type) {
        case "dn":
          // 电话号码
          if (balkPhone.length !== 8) {
            this.$toast("电话号码长度应该是8位");
            isSend = false;
          }
          break;
        case "bbcode":
          // 宽带编号
          if (balkPhone.length !== 11) {
            this.$toast("宽带编码长度应该是11位");
            isSend = false;
          }
          break;
        case "acnt":
          // 宽带账号
          if (balkPhone.length !== 12) {
            this.$toast("宽带账号长度应该是12位");
            isSend = false;
          }
          break;
        case "iptvstbmac":
          // IPTV机顶盒MAC
          if (!(balkPhone.length == 12 || balkPhone.length == 17)) {
            this.$toast("IPTV机顶盒MAC,12位（无分隔）或17位长度（用:或-分隔）");
            isSend = false;
          }
          break;
      }
      if (isSend) {
        let result = await reqCRISTestSubmit(JSON.stringify(postData));
        this.apiResponse(result, ".crisTestSubmit", () => {});
      }
    },
  },
};
</script>

<style scoped lang="less">
.crisTestSubmit {
  height: 100%;
  background-color: #f8f7fc;
  .main {
    .van-cell {
      /deep/.van-cell__value.van-field__value {
        .van-field__body {
          input {
            text-align: right;
          }
        }
      }
    }
    .markType {
      background-color: #fff;
      h5 {
        text-align: left;
        padding: 10px;
      }
      .buttonRegion {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        padding-bottom: 10px;
        border-bottom: 1px solid #f3f4f5;
        .van-button {
          height: 30px;
          margin: 5px 10px;
          padding: 0 20px;
          border-radius: 5px;
          background-color: #f1f2f6;
        }
        .activeButton {
          background-color: #1989fa;
          color: #fff;
        }
      }
    }
    .redress {
      margin-top: 10px;
    }
  }
}
</style>