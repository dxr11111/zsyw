<template>
  <div style="padding-bottom: 77px; height: 100%; background: #fff">
    <MyHeader
      :name="headName"
      left="arrow-left"
      @goBackEv="$emit('changeUpdate')"
    />

    <van-form @submit="onSubmit">
      <van-field
        readonly
        label="设备名称"
        v-model="currDeviceName"
        placeholder="请选择"
        is-link
        @focus="showDeviceName = true"
      ></van-field>
      <van-action-sheet
        v-model="showDeviceName"
        cancel-text="取消"
        :round="false"
        :actions="deviceNames"
        close-on-click-action
        @select="selectDeviceName"
      />
      <van-field
        readonly
        label="模块名称"
        v-model="currModuleName"
        placeholder="请选择"
        is-link
        @focus="showModuleName = true"
      ></van-field>
      <van-action-sheet
        v-model="showModuleName"
        cancel-text="取消"
        :round="false"
        :actions="moduleNames"
        close-on-click-action
        @select="selectModuleName"
      />
      <van-field
        readonly
        label="修改原因"
        v-model="currReason"
        placeholder="请选择"
        is-link
        @focus="showReason = true"
      ></van-field>
      <van-action-sheet
        v-model="showReason"
        cancel-text="取消"
        :round="false"
        :actions="reasonList"
        close-on-click-action
        @select="selectReason"
      />
      <van-field
        v-model="intro"
        label="修改说明"
        placeholder="请输入修改说明（必填）"
      />
      <div class="upload">
        <p>上传文件（至少一张图片）：</p>
        <van-uploader v-model="updateFile" multiple :max-count="10">
          <van-button icon="plus" type="default"></van-button>
        </van-uploader>
      </div>
      <div class="position">
        <p>连接位置：（请选择{{ selNubmer }}个连接位置）</p>
        <div class="content">
          <div
            class="position-item"
            v-for="(item, index) in connPosition"
            :key="index"
            :model="selectPos"
            @click="choosePos(item, index)"
          >
            {{ item.childName }}
            <div class="tag" v-if="item.childTag == '1'">跨缆</div>
          </div>
        </div>
      </div>
      <div class="btn">
        <van-button block type="info" native-type="submit">确认</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import {
  JndSpecLineRouteTerminalApi,
  JndUpdateerminalApi,
} from "@/http/button";
import url from "@/http/img";
import axios from "axios";
import { getItem } from "@/utils/public/sessionStorage";
import bus from "@/utils/public/eventBus";
export default {
  props: {
    currData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      headName: `修改连接位置(${this.currData.weizhiMiaoShu})`,
      deviceNames: [],
      moduleNames: [],
      connPositionSource: [],
      moduleNamesSource: [], // 设备名称备份数据
      showDeviceName: false,
      currDeviceName: "", // 当前选中的设备名称
      currDeviceId: "", // 当前选中的设备名称id
      showModuleName: false,
      currModuleName: "", // 当前选中的模块名称
      currModuleId: "", // 当前选中的模块名称id
      reasonList: [
        { name: "故障", value: "0" },
        { name: "异常占用", value: "1" },
      ],
      showReason: false,
      currReason: "故障", // 当前选择的原因
      intro: "", // 操作说明
      updateFile: [],
      currPos: "", // 连接位置
      selectPos: [],
      params: {},
      option: "",
      selNubmer: 0, // 可选连接位置数量
    };
  },
  created() {
    var arr = this.currData.weiZhiId.split("/");
    this.selNubmer = arr.length;
    console.log(arr);
    this.getSpeclineRoute();
  },
  computed: {
    // 展示的电缆
    connPosition() {
      let doms = document.getElementsByClassName("position-item")
      for (let i = 0; i < doms.length; i++) {
        doms[i].className = "position-item"
      }
      this.selectPos = [];
      let arr = [];
      // console.log('currModuleId', this.currModuleId);
      this.connPositionSource.forEach((e) => {
        // console.log(e.parentId);
        if (e.parentId == this.currModuleId) {
          arr.push(e);
        }
      });
      return arr;
    },
  },
  watch: {
    currDeviceId(newId, oldId) {
      this.moduleNames = [];
      this.moduleNamesSource.forEach((item) => {
        if (item.parentId == newId) {
          this.moduleNames.push({
            name: item.childName,
            id: item.childId,
            value: item.parentId,
          });
        }
      });
      if (this.moduleNames.length > 0) {
        this.currModuleName = this.moduleNames[0].name;
        this.currModuleId = this.moduleNames[0].id;
      } else {
        this.currModuleName = "";
        this.currModuleId = "";
      }
      // console.log('module', this.moduleNames);
    },
  },
  methods: {
    onSubmit() {
      if (this.currDeviceId == "") return this.$toast("请选择设备名称");
      if (this.currModuleId == "") return this.$toast("请选择模块名称");
      if (this.intro == "") return this.$toast("请输入修改说明");
      if (this.updateFile.length == 0) return this.$toast("至少上传一张图片");
      if (this.connPosition.length > 0) {
        if (this.selectPos.length == 0) return this.$toast("请选择连接位置");
        if (
          this.selectPos.length > 0 &&
          this.selectPos.length !== this.selNubmer
        )
          return this.$toast(
            `连接位置选择数量不对，请选择${this.selNubmer}个连接位置`
          );
      }
      let str = "";
      for (let i = 0; i < this.selectPos.length; i++) {
        const ele = this.selectPos[i];
        str += `${ele.childId}/`;
      }
      str = str.slice(0, str.length - 1);
      this.params = {
        id: Number(this.$route.query.id),
        dlbh: this.$route.query.circuitNo,
        qianShebeilxId: this.currData.shebeiLeiXingId, // 前设备类型id
        qianWeiZhiId: this.currData.weiZhiId, // 前连接位置id
        qianShebeiId: this.currData.shebeiId, // 前设备id
        qianMokuaiId: this.currData.mokuaiId, // 前模块id
        houShebeilxId: this.deviceNames.find(
          (e) => e.name == this.currDeviceName
        ).id, //	后设备类型ID
        houShebeiId: this.deviceNames.find((e) => e.name == this.currDeviceName)
          .value, //	后设备ID
        houDuanZiId: str, //	后端子ID（格式如：17/18）
        houMokuaiId: this.moduleNames.find((e) => e.name == this.currModuleName)
          .id, //	后模块ID
        caoZuoYuan: getItem("loginNo"), // 操作员
        gaixinYuanyin: this.reasonList.find((e) => e.name == this.currReason)
          .value, // 修改说明
        duankouMiaoshu: this.intro, //修改原因
      };
      console.log("接口参数", this.params);
      this.getFileId();
      // this.sendApi(this.params)
    },
    async getFileId() {
      let ids = [];
      this.updateFile.forEach((item, index) => {
        let formData = new FormData();
        formData.append("loginNo", getItem("loginNo"));
        formData.append("sheetId", Number(this.$route.query.id));
        formData.append("pictype", 3);
        formData.append("picName", `${Number(this.$route.query.id)}-${index}`);
        formData.append("file", item.file);
        // 发送图片id请求
        axios({
          method: "post",
          url: url,
          data: formData,
        })
          .then((res) => {
            // console.log('图片id结果', res)
            // 获取图片id
            ids.push(Number(res.data.id));
            this.params.tupianIDLiebiao = ids;
            // 判断如果是最后一次图片请求，则发送强制回单/回复 请求
            if (index === this.updateFile.length - 1) {
              // 发送强制回单/回复 请求
              this.sendApi(this.params);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    async sendApi(params) {
      let data = await JndUpdateerminalApi(JSON.stringify(params));
      console.log("data", data);
      data.operationSuccessFlag
        ? this.$toast.success(data.successMessage)
        : this.$toast.fail(data.errorMessage);
      if (data.operationSuccessFlag) {
        bus.$emit("updatePage", true);
      }
    },
    choosePos(item, index) {
      console.log(item);
      if (item.childTag == "1") {
        this.$toast("禁止选择跨缆端口");
      } else {
        let dom = document.getElementsByClassName("position-item")[index];
        console.log(dom.className.includes("active"));
        if (dom.className.includes("active")) {
          var curr = null;
          this.selectPos.forEach((e, i) => {
            if (e.childId == item.childId) {
              curr = i;
            }
          });
          this.selectPos.splice(curr, 1);
          dom.className = "position-item";
        } else {
          dom.className = "position-item active";
          this.selectPos.push(item);
        }
      }
      this.removal(this.selectPos);
    },
    removal(arr) {
      let newArr = [];
      for (let i = 0; i < arr.length; i++) {
        newArr.find((item) => item.name == arr[i].name)
          ? newArr
          : newArr.push(arr[i]);
      }
      return newArr;
    },
    selectDeviceName(e) {
      this.showDeviceName = false;
      this.currDeviceName = e.name;
      this.currDeviceId = e.id;
    },
    selectModuleName(e) {
      this.showModuleName = false;
      this.currModuleName = e.name;
      this.currModuleId = e.id;
    },
    selectReason(e) {
      this.showReason = false;
      this.currReason = e.name;
    },
    async getSpeclineRoute() {
      let data = await JndSpecLineRouteTerminalApi(
        JSON.stringify({
          shebeiLeiXingId: this.currData.shebeiLeiXingId,
          weiZhiId: this.currData.weiZhiId,
          weizhiMiaoShu: this.currData.weizhiMiaoShu,
        })
      );
      // console.log(data)
      this.deviceNames = data.list1.map((e) => ({
        name: e.childName,
        id: e.childId,
        value: e.parentId,
      }));
      this.currDeviceName = this.deviceNames[0].name;
      this.currDeviceId = this.deviceNames[0].id;
      this.moduleNamesSource = data.list2; // 设备名称备份数据
      this.connPositionSource = data.list3;
      console.log("list1", this.deviceNames);
      console.log("list2", this.moduleNamesSource);
      console.log("list3", this.connPositionSource);
    },
  },
};
</script>

<style scoped lang="less">
.btn {
  // background-color: #F8F7FC;
  // background-color: #fff;
  // height: 77px;
  margin-bottom: 15px;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
}
::v-deep .van-button--block {
  width: 86%;
  margin: auto;
  border-radius: 10px;
  margin-top: 20px;
}
::v-deep .van-field__label {
  color: #000;
}
.position {
  p {
    font-size: 14px;
    text-align: left;
    margin-left: 15px;
    margin-bottom: 8px;
  }
  .content {
    display: flex;
    justify-content: flex-start; /* 左对齐 */
    flex-wrap: wrap; /* 换行 */
    .active {
      color: #fff;
      background-color: #5a90fd;
    }
    .position-item {
      line-height: 40px;
      border: 1px solid #5a90fd;
      text-align: center;
      width: calc((100% - 45px) / 4);
      margin-right: 10px;
      margin-bottom: 10px;
      position: relative;
      &:nth-child(4n + 4) {
        margin-right: 0;
      }
      .tag {
        position: absolute;
        right: 3px;
        top: -10px;
        font-size: 10px;
        color: rgb(182, 25, 24);
      }
    }
  }
}
.upload {
  display: flex;
  justify-content: flex-start;
  padding: 15px;
  flex-direction: column;
  text-align: left;
  p {
    font-size: 14px;
    margin-bottom: 8px;
  }
  background-color: #fff;
  ::v-deep .van-button--normal {
    width: 80px;
    height: 80px;
  }
}
</style>