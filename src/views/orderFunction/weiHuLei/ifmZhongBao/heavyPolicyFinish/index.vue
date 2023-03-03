<template>
  <div style="background-color: rgb(248, 247, 252)">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="$router.go(-1)" />
    <div>
      <div class="panel">
        <div class="panel-item">
          <span>重保车次</span>
          <input type="number" oninput="value=value.replace(/[^\d]/g,'')" v-model="formData.zbZbcc" />
        </div>
        <div class="panel-item">
          <span>重保人次</span>
          <input type="number" oninput="value=value.replace(/[^\d]/g,'')" v-model="formData.zbZbrc" />
        </div>
        <div v-if="sheetType != 2">
          <div class="panel-item">
            <span>客户重保电路资料核实</span>
            <input
              type="text"
              v-model="formData.custInfo"
              placeholder="请输入资料核实（必填）"
            />
          </div>
          <div class="field">
            <div class="label">设备、线路是否预检预修</div>
            <div class="radio-box" :model="formData.isCheck">
              <span
                :class="formData.isCheck == 1 ? 'active' : ''"
                @click="formData.isCheck = 1"
                >是</span
              >
              <span
                :class="formData.isCheck == 0 ? 'active' : ''"
                @click="formData.isCheck = 0"
                >否</span
              >
            </div>
          </div>
          <div class="field">
            <div class="label">重保电路是否加入网管预警</div>
            <div class="radio-box" :model="formData.isHasWarning">
              <span
                :class="formData.isHasWarning == 1 ? 'active' : ''"
                @click="formData.isHasWarning = 1"
                >是</span
              >
              <span
                :class="formData.isHasWarning == 0 ? 'active' : ''"
                @click="formData.isHasWarning = 0"
                >否</span
              >
              <span
                :class="formData.isHasWarning == 2 ? 'active' : ''"
                @click="formData.isHasWarning = 2"
                >非网管</span
              >
            </div>
          </div>
          <div class="field">
            <div class="label">是否有告警</div>
            <div class="radio-box" :model="formData.hasWarning">
              <span
                :class="formData.hasWarning == 1 ? 'active' : ''"
                @click="formData.hasWarning = 1"
                >是</span
              >
              <span
                :class="formData.hasWarning == 0 ? 'active' : ''"
                @click="formData.hasWarning = 0"
                >否</span
              >
            </div>
          </div>
          <div class="field">
            <div class="label">是否重保电路</div>
            <div class="radio-box" :model="formData.impFlag">
              <span
                :class="formData.impFlag == 1 ? 'active' : ''"
                @click="formData.impFlag = 1"
                >是</span
              >
              <span
                :class="formData.impFlag == 0 ? 'active' : ''"
                @click="formData.impFlag = 0"
                >否</span
              >
            </div>
          </div>
          <div class="panel-item">
            <span>备品备件</span>
            <input
              type="text"
              v-model="formData.spareParts"
              placeholder="请输入备品备件（必填）"
            />
          </div>
          <div class="panel-item">
            <span>联系人</span>
            <input
              type="text"
              v-model="formData.linkName"
              placeholder="请输入联系人（必填）"
            />
          </div>
          <div class="panel-item">
            <span>联系人电话</span>
            <input
              type="text"
              v-model="formData.zblinkTel"
              placeholder="请输入联系人电话（必填）"
            />
          </div>
          <div class="panel-item">
            <span>落实情况备注</span>
            <input
              type="text"
              v-model="formData.impRemark"
              placeholder="请输入重保单落实情况备注（必填）"
            />
          </div>
        </div>
        <div class="panel-item" v-if="isOverTime == 1">
          <span>超时说明</span>
          <input
            type="text"
            v-model="formData.overTiemContent"
            placeholder="请输入超时原因（必填）"
          />
        </div>
      </div>
      <div class="upload">
        <p>上传文件(最多5张图片)</p>
        <van-uploader
          v-model="updateFile"
          multiple
          :max-count="5"
          :after-read="afterRead"
        >
          <van-button icon="plus" type="default"></van-button>
        </van-uploader>
      </div>
      <!-- <div class="update">
        <p>上传文件(最多5张图片)</p>
        <input type="file" name="" ref="chooseFile" @change="chooseFile" />
        <div class="button" @click="upload">+</div>
      </div> -->
      <div class="btn">
        <van-button type="info" block @click="submit">确定</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { BeforeFinishApi, IfmFinishApi } from "@/http/button";
import { getItem } from "@/utils/public/sessionStorage";
export default {
  name: "HeavyPolicyFinish",
  data() {
    return {
      headName: `回复(${this.$route.query.orderId})`,
      updateFile: [],
      loginNo: getItem("loginNo"), // 登录人
      formData: {
        zbZbcc: 0, // 重保车次
        zbZbrc: 0, // 重保人次
        custInfo: "", // 客户资料核实
        isCheck: null, // 是否预检预修
        isHasWarning: null, // 是否加入网管预警
        hasWarning: null, // 是否告警
        impFlag: null, // 是否重保电路
        spareParts: "", // 备品备件
        linkName: "", // 联系人
        zblinkTel: "", //	联系人电话
        impRemark: "", //	落实情况备注
        file: [], // 重保单的附件
        overTiemContent: "", // 超时原因
      },
      isOverTime: null, // 是否超时
      sheetType: null, // 工单类型
      base: "",
    };
  },
  created() {
    this.getBeforeFinish();
  },
  methods: {
    async submit() {
      if (this.formData.zbZbcc == '') return this.$toast("请输入重保车次");
      if (this.formData.zbZbrc == '') return this.$toast("请输入重保人次");
      if (this.sheetType != 2) {
        if (this.formData.custInfo == "")
          return this.$toast("请输入客户重保电路资料核实");
        if (this.formData.isCheck == null)
          return this.$toast("请选择设备、线路是否预检预修");
        if (this.formData.isHasWarning == null)
          return this.$toast("请选择重保电路是否加入网管预警");
        if (this.formData.hasWarning == null)
          return this.$toast("请选择是否有告警");
        if (this.formData.impFlag == null)
          return this.$toast("请选择是否重保电路");
        if (this.formData.spareParts == "")
          return this.$toast("请输入备品备件");
        if (this.formData.linkName == "") return this.$toast("请输入联系人");
        if (this.formData.zblinkTel == "")
          return this.$toast("请输入联系人电话");
        if (this.formData.impRemark == "")
          return this.$toast("请输入落实情况备注");
      }
      if (this.isOverTime == 1) {
        if (
          this.formData.overTiemContent == "" ||
          this.formData.overTiemContent == undefined
        ) {
          return this.$toast("请输入超时说明");
        }
      }
      // if (this.isOverTime == 1 && this.formData.overTiemContent == '') return this.$toast('请输入超时说明')
      // this.getFileId()
      this.formData.id = Number(this.$route.query.id);
      this.formData.file = this.updateFile.map((e) => e.content.split(",")[1]);
      // var list = []
      // console.log('222',this.base);
      // list.push(this.base)
      // this.formData.file = list
      this.formData.zbZbcc = Number(this.formData.zbZbcc)
      this.formData.zbZbrc = Number(this.formData.zbZbrc)
      console.log("参数", this.formData);
      let data = await IfmFinishApi(JSON.stringify(this.formData));
      if (data.operationSuccessFlag) {
        this.$toast.success(data.successMessage);
        // 直接跳到工作台
        this.$router.push("/main/workBench");
        this.$store.commit("removeThisPage", "ListDetail");
        // 刷新工单详情/工作台
        this.operationSuccessRefresh(true);
      } else {
        this.$toast.fail(data.errorMessage);
      }
    },
    // 用户回执-上传的图片
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file);
      console.log(file.content.split(",")[1]);
    },
    // chooseFile () {
    //   let fileData = this.$refs.chooseFile.files[0]
    //   console.log('文件', fileData)
    //   const promise = new Promise((resolve, rejected) => {
    //     var reader = new FileReader()
    //     reader.readAsDataURL(fileData)
    //     reader.onload = function (e) {
    //       resolve(e.target.result.split(',')[1])
    //     }
    //   })
    //   promise.then((e) => {
    //     console.log('success', e);
    //     this.base = e
    //   })
    // },
    // upload () {
    //   // this.refs['chooseFile'].click()
    // },
    async getBeforeFinish() {
      let data = await BeforeFinishApi(
        JSON.stringify({ id: Number(this.$route.query.id) })
      );
      console.log(data);
      this.formData = {
        zbZbcc: 0,
        zbZbrc: 0,
        custInfo: data.custInfo,
        impFlag: data.impFlag,
        impRemark: data.impRemark,
        isCheck: data.isCheck,
        isHasWarning: data.isHasWarning,
        hasWarning: null,
        linkName: data.linkName,
        spareParts: data.spareParts,
        zblinkTel: data.zblinkTel,
      };
      this.isOverTime = data.overTimeFlag;
      this.sheetType = data.sheetType;
    },
  },
};
</script>

<style scoped lang="less">
.panel {
  .panel-item {
    display: flex;
    padding: 8px 14px;
    justify-content: space-between;
    background: #fff;
    line-height: 30px;
    font-size: 14px;
    margin-bottom: 10px;
    text-align: start;
    span {
      width: 30%;
    }
    input {
      // width: 240px;
      flex: 1;
      height: 30px;
      margin-left: 3px;
      border: 1px solid #ccc;
      padding: 0 5px;
      font-size: 12px;
      color: gray;
    }
  }
  .field {
    display: flex;
    justify-content: space-between;
    padding: 8px 14px;
    background: #fff;
    line-height: 30px;
    font-size: 14px;
    margin-bottom: 10px;
    .label {
      color: #3b3b3b;
    }
    .radio-box {
      span {
        border: 1px solid #5a90fd;
        display: inline-block;
        width: 55px;
        text-align: center;
        color: #5a90fd;
      }
      .active {
        background-color: #5a90fd;
        color: #fff;
      }
    }
    .iconfont {
      margin-left: 15px;
      font-size: 20px;
    }
  }
}
.update {
  font-size: 14px;
  text-align: left;
  padding: 15px;
  background-color: #fff;
  // input {
  //   // display: none;
  // }
  .button {
    width: 80px;
    line-height: 80px;
    font-size: 50px;
    color: gray;
    border: 1px solid #eee;
    margin-top: 5px;
    text-align: center;
  }
}
.upload {
  display: flex;
  justify-content: flex-start;
  padding: 15px;
  flex-direction: column;
  text-align: left;
  background-color: #fff;
  margin-top: 10px;
  ::v-deep .van-button--normal {
    width: 80px;
    height: 80px;
  }
  p {
    margin-bottom: 8px;
    font-size: 3.73vw;
  }
}
.btn {
  background-color: rgb(248, 247, 252);
  height: 60px;
  width: 100%;
  .van-button--block {
    width: 90%;
    margin: auto;
    border-radius: 5px;
    margin-top: 20px;
  }
  .van-button--info {
    background-color: #5a90fd;
  }
}
</style>