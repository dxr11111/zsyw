<template>
  <!-- 签名 -->
  <div class="container">
    <!-- 画布区域 -->
    <div class="canvas-box" ref="canvasRef" v-show="!userReceiptShow">
      <canvas ref="canvasMapRef"></canvas>
    </div>
    <div class="signature" ref="signature">
      <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
      <!-- 用户回执 -->
      <div class="userReceipt" @click="userReceiptShow = true">
        <span class="logo"></span>
        <span>用户回执</span>
      </div>
      <!-- 用户回执弹出框 -->
      <van-popup v-model="userReceiptShow" class="userReceiptPop">
        <h3>用户回执</h3>
        <!-- 满意度 -->
        <div class="selectButton">
          <span class="title">满意度</span>
          <div class="button">
            <van-button
              :type="satisfied === 1 ? 'info' : ''"
              @click="clickSatisfied(true)"
              >满意</van-button
            >
            <van-button
              :type="satisfied === 2 ? 'info' : ''"
              @click="clickSatisfied(false)"
              >不满意</van-button
            >
          </div>
        </div>

        <!-- 上传用户现场照片 -->
        <div class="selectButton">
          <span class="title">上传用户现场照片</span>
          <div class="button">
            <van-button
              :type="isBuildImage === 0 ? 'info' : ''"
              @click="clickIsBuildImage(true)"
              >同意</van-button
            >
            <van-button
              :type="isBuildImage === 1 ? 'info' : ''"
              @click="clickIsBuildImage(false)"
              >拒绝</van-button
            >
          </div>
        </div>

        <!-- 同意上传用户现场照片 -->
        <div class="agreeBuildImage" v-show="isBuildImage == 0">
          <p>三张照片要求</p>
          <p>1、光猫安装照片</p>
          <p>2、隐形光纤走线照片/明线走线照片</p>
          <p>2、路由器安装照片或其他</p>
          <!-- 上传图片 -->
          <van-uploader
            :after-read="afterRead"
            v-model="buildImageList"
            multiple
            max-count="3"
          >
            <van-button icon="plus"></van-button>
          </van-uploader>
        </div>
        <!-- 拒绝上传用户现场照片 -->
        <div class="refuseBuildImage" v-show="isBuildImage == 1">
          <p>
            《用户确认说明》<br />
            1、该工单已按入户服务规范要求处理完毕，现场清理完毕，用户认可。<br />
            2、用户出于隐私考虑，禁止装维人员拍摄室内照片。
          </p>
        </div>
        <!-- 取消 确定 -->
        <div class="userReceiptPopButton">
          <van-button type="info" @click="userReceiptShow = false"
            >取消</van-button
          >
          <van-button type="info" @click="confirmUserReceipt">确定</van-button>
        </div>
      </van-popup>

      <span class="tips" v-show="!tipsShow">请您在此处签字</span>

      <div class="buttonRegion">
        <van-button round type="info" plain @click="clearCanvasHandle"
          >清空</van-button
        >
        <van-button round type="info" @click="makeCanvasHandle"
          >确定</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";
import SignaturePad from "signature_pad";
import { rotateBase64Img } from "@/utils/common";
import { reqifmFinish } from "@/http/button";
import url from "@/http/img";
import { getItem } from "@/utils/sessionStorage";
export default {
  name: "Signature",
  data() {
    return {
      loginNo: getItem("loginNo"), // 登录人
      sheetId: this.$route.query.id, // 工单号
      headName: `签名(${this.$route.query.orderNum})`,
      canvasNode: null,
      previewImage: null,
      userReceiptShow: false, // 用户回执弹出框
      satisfied: 1, // 满意度 1：满意；2：不满意
      isBuildImage: 1, // 是否上传施工照片 0：上传；1：不上传
      buildImageList: [], // 上传用户现场照片
      cfgCustPhotoIds: [], // 上传用户现场照片id
      pictureId: -1, // 签名图片id
      fromName: "", // 前一个页面名称
      isMustUploadPhoto: this.$route.query.isMustUploadPhoto, // 回单是否必须上传现场照片 1：必须，2：不必须
    };
  },
  computed: {
    tipsShow() {
      // 是否显示提示
      return this.canvasNode?._data.length || false;
    },
  },
  methods: {
    // 回退
    goBackFn() {
      this.$router.go(-1);
    },
    // 旋转屏幕后修改div尺寸
    setLandScape() {
      var width = document.documentElement.clientWidth;
      var height = document.documentElement.clientHeight;
      if (width < height) {
        // console.log(width + " " + height);
        $(".signature").width(height);
        $(".signature").height(width);
        $(".signature").css("top", (height - width) / 2);
        $(".signature").css("left", 0 - (height - width) / 2);
      }
    },
    // 初始化画布
    initalHandle() {
      const _canvasBox = this.$refs.canvasRef;
      const _canvas = this.$refs.canvasMapRef;
      if (!_canvasBox || !_canvas) {
        return false;
      }

      // _canvas.width = _canvasBox.clientWidth
      // _canvas.height = _canvasBox.clientHeight

      _canvas.width = _canvasBox.clientWidth;
      _canvas.height = _canvasBox.clientHeight;

      this.clearCanvasHandle();
      this.canvasNode = new SignaturePad(_canvas, {
        minWidth: 2,
        maxWidth: 2,
        penColor: "rgb(0, 0, 0)",
      });
    },
    // 清空画布
    clearCanvasHandle() {
      if (this.canvasNode) {
        this.canvasNode.clear();
        this.previewImage = null;
      }
    },
    // 点击确定-得到画布图案 => 得到图片id => 提交
    async makeCanvasHandle() {
      const canvasNode = this.canvasNode;
      // 重新初始化画布
      if (!canvasNode) {
        this.initalHandle();
      }

      // 是否签字
      if (canvasNode.isEmpty()) {
        this.$toast("您还没有签名");
        return false;
      }

      // 图像旋转二次处理
      // 获取屏幕宽高
      const _boxWidth = window.innerWidth;
      const _boxHeight = window.innerHeight;
      const _signImg = canvasNode.toDataURL("image/png", 0.6);
      if (_boxWidth < _boxHeight) {
        rotateBase64Img(_signImg, -90, (imgUrlRes) => {
          this.previewImage = imgUrlRes;
          this.getPictureId();
        });
      } else {
        this.previewImage = _signImg;
        this.getPictureId();
      }
    },
    // 提交强制回单/回复 请求
    async onSubmit() {
      let satisfied = this.satisfied; // 满意度
      let isBuildImage = this.isBuildImage; // 是否上传施工照片
      let pictureId = this.pictureId; // 签字图片id
      let cfgCustPhotoIds = this.cfgCustPhotoIds; // 外线回单用户现场图片id-回复
      let postData = this.$route.params.postData; // 强制回单页面传过来的请求参数
      postData = {
        ...postData,
        satisfied,
        isBuildImage,
        pictureId,
        cfgCustPhotoIds,
      };

      try {
        let result = await reqifmFinish(JSON.stringify(postData));
        console.log("提交结果", result);
        if (result.operationSuccessFlag) {
          // 成功
          if (result?.successMessage.length > 0)
            this.$toast(result.successMessage);
        } else {
          // 失败
          if (result?.errorMessage.length > 0) {
            // 当messageModul = 1 时，页面出现弹窗窗口，需用户点击确定关闭提示框
            if (result.messageModul == 1) {
              this.$refs.signature.style.zIndex = "200";
              this.$dialog
                .alert({
                  title: "提示",
                  message: result.errorMessage,
                  getContainer: ".signature",
                })
                .then(() => {
                  // on close
                  this.$refs.signature.style.zIndex = "0";
                });
            } else if (result.messageModul == 0) {
              this.$toast(result.errorMessage);
            }
          }
          if (result.errorCode === 20) {
            // 请填写超时原因-跳转到前一个页面
            this.$router.push({
              name: this.fromName, // 前一个页面 回复/强制回单
              params: { overTimeShow: true },
            });
          }
        }
      } catch (error) {
        console.log("err", error);
      }
    },
    // 保存画布图案到本地
    saveImg() {
      let a = document.createElement("a");
      a.href = this.previewImage;
      a.download = "sign";
      a.click(); //保存
    },
    // 获取签名图片id
    async getPictureId() {
      // 发送请求前判断 回单是否必须上传现场照片
      if (this.fromName === "RepairMachineFinish") {
        // 必须上传现场照片且未上传照片-提示上传照片
        if (this.isBuildImage === 0 && this.buildImageList.length !== 3) {
          return this.$toast("请上传用户现场照片");
        }
        // template里判断 无法点击 上传用户现场照片-拒绝
      }

      // 签名base64 => formdata
      const [imageBlob, imageType] = this.base64ToBlob(this.previewImage); // 获取处理好的Blob 和文件类型
      const formData = new FormData();
      formData.append("file", imageBlob); // 添加到表单
      // formData.append('file', imageBlob, `${Date.now()}.${imageType}`); // 添加到表单，传入文件名

      formData.append("loginNo", this.loginNo);
      formData.append("sheetId", this.sheetId);
      formData.append("pictype", 3);
      formData.append("picName", "sign");

      // 地址不同
      // let url = 'img/saveImage'
      // if (process.env === 'production') url = 'http://132.91.203.143:7010/img/saveImage'

      // 发送图片id请求
      axios({
        method: "post",
        url: url,
        data: formData,
      })
        .then((res) => {
          console.log("图片id结果", res);
          // 获取签名图片id
          this.pictureId = parseInt(res.data.id);

          // 获取用户回执照片图片id
          if (this.isBuildImage === 0) {
            // 有上传照片
            this.buildImageList.forEach((item, index) => {
              // 上传 form-data格式 图片
              let formData = new FormData();
              formData.append("loginNo", this.loginNo);
              formData.append("sheetId", this.sheetId);
              formData.append("pictype", 3);
              formData.append("picName", `${this.sheetId}-${index}`);
              formData.append("file", item.file);

              // 地址不同
              // let url = 'img/saveImage'
              // if (process.env === 'production') url = 'http://132.91.203.143:7010/img/saveImage'

              // 发送图片id请求
              axios({
                method: "post",
                url: url,
                data: formData,
              })
                .then((res) => {
                  console.log("图片id结果", res);
                  // 获取图片id
                  this.cfgCustPhotoIds.push(parseInt(res.data.id));
                  // 判断如果是最后一次图片请求，则发送强制回单/回复 请求
                  if (index === this.buildImageList.length - 1) {
                    // 发送强制回单/回复 请求
                    this.onSubmit();
                    console.log("最后一次图片id", index);
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            });
          } else {
            // 未上传照片
            // 发送强制回单/回复 请求
            this.onSubmit();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 点击用户回执-满意度
    clickSatisfied(bool) {
      if (bool) this.satisfied = 1;
      else this.satisfied = 2;
    },
    // 点击用户回执-上传用户现场照片
    clickIsBuildImage(bool) {
      // 判断isMustUploadPhoto=1无法点击拒绝
      if (bool) {
        this.isBuildImage = 0;
      } else {
        // 判断是否可以点击拒绝-不上传照片
        if (this.isMustUploadPhoto === 1) {
          return this.$toast("必须上传用户现场照片");
        }
        this.isBuildImage = 1;
      }
    },
    // 用户回执-上传的图片
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file);
    },
    // 确认用户回执部分
    confirmUserReceipt() {
      // 选择同意上传用户现场照片时必须上传3张照片
      if (this.isBuildImage === 0) {
        if (this.buildImageList.length === 3) {
          this.userReceiptShow = false;
        } else {
          this.$toast("必须上传三张照片");
        }
      } else {
        this.userReceiptShow = false;
      }
    },
    // base64 => blob
    base64ToBlob(base64Data) {
      const dataArr = base64Data.split(","); // 根据,来分隔

      const imageType = dataArr[0].match(/:(.*?);/)[1]; // 获取文件类型。使用正则捕获 image/jpeg

      const textData = window.atob(dataArr[1]); // 使用atob() 将base64 转为文本文件
      const arrayBuffer = new ArrayBuffer(textData.length); // 创建一个二进制数据缓冲区，可以理解为一个数组
      const uint8Array = new Uint8Array(arrayBuffer); // 创建一个类型化数组对象，可以理解为上面的数组的成员，给这个对象赋值就会放到上面的数组中。
      for (let i = 0; i < textData.length; i++) {
        uint8Array[i] = textData.charCodeAt(i); // 将文本文件转为UTF-16的ASCII, 放到类型化数组对象中
      }

      return [new Blob([arrayBuffer], { type: imageType }), imageType.slice(6)]; // 返回两个值，一个Blob对象，一个图片格式（如jpeg）
    },
  },
  created() {
    // 判断isMustUploadPhoto=1
    if (this.isMustUploadPhoto === 1) {
      // 必须上传现场照片
      this.isBuildImage = 0;
    }
  },
  mounted() {
    this.setLandScape(); // 旋转屏幕
    this.initalHandle(); // 初始化画布
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.fromName = from.name;
    });
  },
};
</script>

<style scoped lang="less">
// viewport 处于纵向，即高度大于等于宽度。
@media screen and (orientation: portrait) {
  .signature {
    position: absolute;
    transform: rotate(90deg);
    transform-origin: center;
    overflow: auto;
  }
}
.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .canvas-box {
    z-index: 100;
    position: absolute;
    top: 50%;
    left: 80px;
    transform: translateY(-50%);
    height: 100%;
    width: 250px;
    #canvas-map {
      width: 100%;
      height: 100%;
    }
  }
  .signature {
    background-color: #fff;
    .tips {
      display: inline-block;
      margin-top: 125px;
      color: red;
    }
    .userReceipt {
      z-index: 100;
      position: fixed;
      top: 15px;
      right: 10px;
      display: flex;
      height: 30px;
      color: #fff;
      span {
      }
      .logo {
        width: 20px;
        height: 20px;
        border-radius: 20px;
        background: #98fb98;
        display: inline-block;
        margin-right: 10px;
        &::before,
        &::after {
          content: "";
          width: 3px; // 对钩粗细
          border-radius: 10px; // 对钩边缘圆角
          background: #228b22;
          position: absolute;
        }

        &::after {
          height: 14px;
          top: 3px;
          left: 10px;
          transform: rotate(45deg); // 旋转角度
          -ms-transform: rotate(45deg); // ie浏览器
        }
        &::before {
          height: 7px;
          top: 9px;
          left: 4px;
          transform: rotate(-45deg);
          -ms-transform: rotate(-45deg);
        }
      }
    }
    .userReceiptPop {
      width: 400px;
      height: 340px;
      padding: 10px;
      border-radius: 10px;
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
            border-radius: 10px;
          }
        }
      }
      .agreeBuildImage {
        text-align: left;
        color: red;
        .van-uploader {
          margin-top: 10px;
          .van-button {
            width: 80px;
            height: 80px;
            border: 3px dashed #b7b7b7;
            .van-icon {
              font-size: 30px;
              color: #b7b7b7;
            }
          }
        }
      }
      .refuseBuildImage {
        p {
          margin-top: 20px;
          text-align: left;
          color: red;
        }
      }
      .userReceiptPopButton {
        display: flex;
        justify-content: space-around;
        position: absolute;
        width: 100%;
        bottom: 10px;
        .van-button {
          border-radius: 10px;
        }
      }
    }
    .buttonRegion {
      display: flex;
      justify-content: space-around;
      position: fixed;
      bottom: 30px;
      width: 100%;
      .van-button {
        width: 40%;
      }
    }
    /deep/.van-dialog {
      .van-dialog__content {
        .van-dialog__message {
          text-align: left;
          font-size: 16px;
        }
      }
      .van-dialog__footer {
        padding: 10px;
        .van-button__content {
          width: 100px; // 80px
          margin: 0 auto;
          border-radius: 10px;
        }

        .van-dialog__confirm {
          color: #1989fa;
        }
        .van-button::before {
          background-color: transparent !important;
        }
      }
    }
  }
}
</style>