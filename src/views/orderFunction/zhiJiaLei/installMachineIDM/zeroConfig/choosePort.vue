<template>
  <!-- 选择端口 -->
  <div class="choosePort">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <div class="voice">
        <div class="title">
          <span>语音</span>
          <div></div>
        </div>
        <div class="slot">
          <!-- 槽位 -->
          <van-field
            label="槽位"
            :value="voiceList.slotPosition"
            @click="voiceList.slotPositionShow = true"
            is-link
            arrow-direction="down"
            readonly
            class="textRight borderBottom"
          />
          <van-action-sheet
            v-model="voiceList.slotPositionShow"
            :actions="voiceList.slotPositionActions"
            cancel-text="取消"
            close-on-click-action
            @select="selectVoiceSlotPosition"
          />
        </div>
        <div class="port">
          <!-- 端口 -->
          <van-field
            label="端口"
            :value="voiceList.port"
            @click="voiceList.portShow = true"
            is-link
            arrow-direction="down"
            readonly
            class="textRight borderBottom"
          />
          <van-action-sheet
            v-model="voiceList.portShow"
            :actions="voiceList.portActions"
            cancel-text="取消"
            close-on-click-action
            @select="selectVoicePort"
          />
        </div>
      </div>
      <div class="data">
        <div class="title">
          <span>数据</span>
          <div></div>
        </div>
        <div class="slot">
          <!-- 槽位 -->
          <van-field
            label="槽位"
            :value="dataList.slotPosition"
            @click="dataList.slotPositionShow = true"
            is-link
            arrow-direction="down"
            readonly
            class="textRight"
          />
          <van-action-sheet
            v-model="dataList.slotPositionShow"
            :actions="dataList.slotPositionActions"
            cancel-text="取消"
            close-on-click-action
            @select="selectDataSlotPosition"
          />
        </div>
        <div class="port">
          <!-- 端口 -->
          <van-field
            label="端口"
            :value="dataList.port"
            @click="dataList.portShow = true"
            is-link
            arrow-direction="down"
            readonly
            class="textRight"
          />
          <van-action-sheet
            v-model="dataList.portShow"
            :actions="dataList.portActions"
            cancel-text="取消"
            close-on-click-action
            @select="selectDataPort"
          />
        </div>
      </div>
    </div>
    <!-- 提交 -->
    <div style="margin: 30px">
      <van-button round block type="info" @click="submitPort">提交 </van-button>
    </div>
  </div>
</template>

<script>
import { reqIomNewZeroConfigFttb } from "@/http/button";
export default {
  name: "ChoosePort",
  data() {
    return {
      headName: `选择端口(${this.$route.query.orderNum})`,
      // 语音
      voiceList: {
        slotPosition: "",
        slotPositionShow: false,
        slotPositionActions: [],
        port: "",
        portShow: false,
        portActions: [],
      },
      // 数据
      dataList: {
        slotPosition: "",
        slotPositionShow: false,
        slotPositionActions: [],
        port: "",
        portShow: false,
        portActions: [],
      },
    };
  },
  methods: {
    // 回退
    goBackFn() {
      this.$router.go(-1);
    },
    // 选中语音槽位
    selectVoiceSlotPosition(action) {
      this.voiceList.slotPosition = action.name;
    },
    // 选中语音端口
    selectVoicePort(action) {
      this.voiceList.port = action.name;
    },
    // 选中数据槽位
    selectDataSlotPosition(action) {
      this.dataList.slotPosition = action.name;
    },
    // 选中数据端口
    selectDataPort(action) {
      this.dataList.port = action.name;
    },
    // 获取数据口，语音口
    getVoiceData() {
      let dataFttbPortList = JSON.parse(this.$route.query.dataFttbPortList);
      let voiceFttbPortList = JSON.parse(this.$route.query.voiceFttbPortList);
      // 获取语音槽位
      this.voiceList.slotPosition = voiceFttbPortList[0]?.slot;
      this.voiceList.slotPositionActions = [
        { name: this.voiceList.slotPosition },
      ];
      // 获取语音端口
      this.voiceList.port = voiceFttbPortList[0]?.portList[0]?.port;
      voiceFttbPortList[0]?.portList.forEach((item) => {
        let obj = {};
        obj.name = item.port;
        this.voiceList.portActions.push(obj);
      });

      // 获取数据槽位
      this.dataList.slotPosition = dataFttbPortList[0]?.slot;
      this.dataList.slotPositionActions = [
        { name: this.dataList.slotPosition },
      ];
      // 获取数据端口
      this.dataList.port = dataFttbPortList[0]?.portList[0]?.port;
      dataFttbPortList[0]?.portList.forEach((item) => {
        let obj = {};
        obj.name = item.port;
        this.dataList.portActions.push(obj);
      });
    },
    // fttb-提交
    async submitPort() {
      let id = parseInt(this.$route.query.id);
      let accessMode = this.$route.query.accessMode;
      let macInfo = this.$route.query.macInfo;
      let snInfo = this.$route.query.snInfo;
      let voiceSlot = this.voiceList.slotPosition; // 语音槽位
      let dataSlot = this.dataList.slotPosition; // 数据槽位
      let voicePort = this.voiceList.port; // 语音端口
      let dataPort = this.dataList.port; // 数据端口
      let postData = {
        id,
        accessMode,
        macInfo,
        snInfo,
        voiceSlot,
        dataSlot,
        voicePort,
        dataPort,
      };
      let result = await reqIomNewZeroConfigFttb(JSON.stringify(postData));
      console.log("fttb提交结果", result);
      this.apiResponse(result, ".choosePort", () => {});
    },
  },
  created() {
    // 获取数据口，语音口
    this.getVoiceData();
  },
};
</script>

<style scoped lang="less">
.choosePort {
  height: 100%;
  background-color: #f8f7fc;
  /deep/.errorDialog {
    .van-dialog__content {
      .van-dialog__message {
        text-align: left;
      }
    }
    .van-dialog__footer {
      padding: 10px;
      .van-button__content {
        width: 100px;
        margin: 0 auto;
        border-radius: 10px;
        background-color: #1989fa;
        color: #fff;
      }
    }
  }
  .main {
    background: #fff;
    .voice,
    .data {
      .title {
        display: flex;
        padding: 10px;
        text-align: left;
        div {
          flex: 1;
          border-top: 1px solid #000;
          margin-top: 10px;
          margin-left: 15px;
        }
      }
      .textRight {
        /deep/.van-cell__value.van-field__value {
          input {
            text-align: right;
          }
        }
      }
    }
  }
}
</style>