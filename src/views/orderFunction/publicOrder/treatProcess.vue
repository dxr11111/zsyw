<template>
  <div class="treatProcess">
    <!-- 公共按钮：故障单，预警单，支撑单，优化单，重保单，修机单，新装机单 -->
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <!-- 优化单显示 -->
      <div
        class="yhdTitle"
        v-if="this.$route.query.sysId == 3 && this.flowNode == 6"
      >
        添加{{ this.$route.query.orderNum }}移动优化单处理过程
      </div>
      <van-form ref="form" @submit="checkForm">
        <!-- 处理过程 -->
        <van-field
          v-model="process"
          name="process"
          placeholder="请填写处理过程"
          type="textarea"
          autocomplete="off"
        />
        <!-- 优化单不显示 -->
        <template v-if="flowNode !== '6'">
          <!-- 请填写备注信息 -->
          <van-field
            v-model="remark"
            name="remark"
            placeholder="请填写备注信息"
            type="textarea"
            autocomplete="off"
          />

          <!-- 上传图片 支撑单（sysId=3，flowNode=4）无需上传照片 -->
          <div class="upload" v-if="flowNode !== '4'">
            <p>上传照片（最多5张照片）</p>
            <van-uploader
              v-model="imgList"
              multiple
              :max-count="5"
              :after-read="afterRead"
            >
              <van-button icon="plus" type="default"></van-button>
            </van-uploader>
          </div>
        </template>

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
import { reqTreatProcess } from "@/http/button";
import { getItem } from "@/utils/public/sessionStorage";
import { removeWatermark } from "@/utils/public/waterMark";
import { uploadImg } from "@/utils/public/uploadImg";

export default {
  name: "TreatProcess",
  data() {
    return {
      headName: `处理过程(${this.$route.query.orderNum})`,
      process: "",
      remark: "",
      imgList: [], // 上传图片列表
      pictureIds: [], // 上传图片列表id-int型
      loginNo: getItem("loginNo"), // 登录人
      sheetId: parseInt(this.$route.query.id), // 工单号
      flowNode: this.$route.query.flowNode, // 工单环节
    };
  },
  computed: {},
  methods: {
    // 回退
    goBackFn() {
      this.$router.go(-1);
    },
    // 表单校验
    checkForm() {
      if (this.process == "") return this.$toast("请填写处理过程");
      if (this.flowNode !== "6" && this.remark == "")
        return this.$toast("请填写备注信息");
      // 获取图片id
      this.getPicturesId();
    },
    // 提交图片 获取图片id
    getPicturesId() {
      uploadImg(this.imgList, this.loginNo, this.sheetId).then((pictureIds) => {
        console.log("获取的图片id结果", pictureIds);
        this.pictureIds = pictureIds;
        // 发送处理过程请求
        this.onSubmit();
      });
    },
    // 提交表单信息
    async onSubmit() {
      // 提交图片 获取图片id

      let id = parseInt(this.sheetId); // 工单唯一标识
      let intro = this.process; // 处理过程
      let remark = this.remark; // 备注
      let pictureIds = this.pictureIds; // 图片ID
      let postData = { id, intro, remark, pictureIds };
      // 重保单（sysId=3，flowNode=5） 不上传pictureIds 上传file
      if (this.$route.query.sysId == 3 && this.flowNode == 5) {
        // 上传图片列表id-string型
        let file = [];
        pictureIds.forEach((id) => {
          let fileId = id.toString();
          file.push(fileId);
        });
        postData = { id, intro, remark, file };
      }
      try {
        let result = await reqTreatProcess(JSON.stringify(postData));
        console.log("编辑处理过程结果", result);
        this.apiResponse(result, ".treatProcess", () => {
          this.$router.go(-1);
          // 只调用接口按钮操作成功 刷新工单详情/工作台
          this.operationSuccessRefresh(true);
        });
      } catch (error) {
        console.log("err", error);
      }
    },

    // 图片读取完成
    async afterRead(file) {
      console.log("图片file", file);
    },
  },
  created() {
    removeWatermark();
  },
};
</script>

<style scoped lang="less">
.treatProcess {
  height: 100%;
  background-color: #f8f7fc;
  .main {
    .yhdTitle {
      background: #fff;
      text-align: left;
      padding: 10px 16px;
    }
    .van-form {
      .van-cell {
        height: 100px;
        margin-bottom: 10px;
      }
      .upload {
        display: flex;
        justify-content: flex-start;
        padding: 20px;
        flex-direction: column;
        text-align: left;
        background-color: #fff;
        p {
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>