<template>
  <div class="auditGq">
    <!-- 审核挂起 -->
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div v-if="prodYdCompZkAudit.length > 0">
      <div class="main" v-for="(item, index) in prodYdCompZkAudit" :key="index">
        <van-cell-group>
          <van-cell title="操作人姓名" :value="item.reservationUserName" />
          <van-cell title="操作部门名称" :value="item.reservationDeptName" />
          <van-cell title="预约时间" :value="item.reservationTime" />
          <van-cell title="预约操作时间" :value="item.reservationOperTime" />
          <van-cell title="预约备注" :value="item.reservationRemark" />
          <van-cell title="预约类型" :value="item.reservationType" />
          <van-cell class="fileName" title="证据下载">
            <template>
              <span @click="downloadFile(item)">{{
                item.attachmentInfo?.fileName
              }}</span>
            </template>
          </van-cell>
        </van-cell-group>
        <van-field
          v-model="item.auditInfo"
          label="审核说明"
          placeholder="请输入审核说明"
          class="inputRegion"
        />
        <div class="field">
          <div class="label">审核确认</div>
          <div class="radio-box" :model="item.auditStatus">
            <span
              :class="item.auditStatus === 1 ? 'active' : ''"
              @click="item.auditStatus = 1"
              >通过</span
            >
            <span
              :class="item.auditStatus === 2 ? 'active' : ''"
              @click="item.auditStatus = 2"
              >驳回</span
            >
          </div>
        </div>
        <!-- <div class="selectButton">
        <span class="title">审核确认</span>
        <div class="button">
          <van-button
            :type="item.auditStatus === 1 ? 'info' : ''"
            @click="clickAuditStatus(true)"
            native-type="button"
            >通过</van-button
          >
          <van-button
            :type="item.auditStatus === 2 ? 'info' : ''"
            @click="clickAuditStatus(false)"
            native-type="button"
            >驳回</van-button
          >
        </div>
      </div> -->
        <div class="submitButton">
          <van-button type="info" block round @click="onSubmit(item)"
            >确定</van-button
          >
        </div>
      </div>
    </div>
    <Empty v-else />
    <van-popup v-model="isShow" :style="{ width: '100%', height: '100%' }">
      <img
        v-if="showImg"
        :src="'data:image/png;base64,' + url"
        alt=""
        @click="isShow = false"
      />
      <div v-if="showTxt" @click="isShow = false">{{ url }}</div>
    </van-popup>
    <!-- <iframe :src="url" frameborder="0"></iframe> -->
    <!-- <iframe ref="iframe"></iframe> -->
  </div>
</template>

<script>
import {
  reqIfmComplaintProdQuery,
  reqIfmAuditYdProdInfo,
  reqDownloadFile,
} from "@/http/button"
import { Base64 } from "js-base64"
export default {
  name: "AuditGq",
  data() {
    return {
      headName: `审核挂起(${this.$route.query.orderId})`,
      prodYdCompZkAudit: [{}], // 审核预约挂起信息
      // 提交参数
      // auditInfo: '', // 审核说明
      // auditStatus: -1, // 审核确认 1：审核通过,2:驳回
      url: "",
      // src: '',
      isShow: false,
      showImg: false,
      showTxt: false,
    }
  },
  methods: {
    goBackFn() {
      this.$router.go(-1)
    },
    // 审核前查询
    async getQueryInfo() {
      let id = parseInt(this.$route.query.id)
      let type = 1 // 审核挂起
      let queryOverTimeType = -1 // 用不到
      let result = await reqIfmComplaintProdQuery(
        JSON.stringify({ id, type, queryOverTimeType })
      )
      console.log("审核挂起查询", result)
      if (result.operationSuccessFlag) {
        // 获取审核预约挂起信息
        // this.prodYdCompZkAudit = result.prodYdCompZkAudit
        var arr = result.prodYdCompZkAudit
        arr.forEach((e) => {
          e.auditInfo = ""
          e.auditStatus = null
        })
        this.prodYdCompZkAudit = arr
      }
    },
    // // 选中是否审核确认
    // clickAuditStatus (bool) {
    //   if (bool) {
    //     this.auditStatus = 1
    //   } else {
    //     this.auditStatus = 2
    //   }
    // },
    // 提交
    async onSubmit(item) {
      if (this.auditInfo == "") return this.$toast("请输入审核说明")
      if (this.auditStatus == -1) return this.$toast("请选择审核确认")
      let id = parseInt(this.$route.query.id)
      let type = 1 // 审核挂起
      let auditStatus = item.auditStatus
      let auditInfo = item.auditInfo
      delete item.auditStatus
      delete item.auditInfo
      // let prodYdCompZkAudit = prodYdCompZkAudit[0]
      let prodYdCompZkAudit = item
      let sheetOverTimeInfo = {} // 用不到
      let auditOverTimeType = -1 // 用不到
      let postData = {
        id,
        type,
        auditStatus,
        auditInfo,
        prodYdCompZkAudit,
        sheetOverTimeInfo,
        auditOverTimeType,
      }
      let result = await reqIfmAuditYdProdInfo(JSON.stringify(postData))
      if (result.operationSuccessFlag) {
        this.$toast(result.successMessage)
        this.$router.go(-1)
        // 通知上个页面刷新
        this.$store.commit("OPERATEBUTTON", true)
      } else {
        this.$toast(result.errorMessage)
      }
    },
    // 下载证据
    async downloadFile(item) {
      let sysId = item.attachmentInfo.sysId
      let fileId = item.attachmentInfo.fileId
      let flowNode = this.$route.query.flowNode
      let result = await reqDownloadFile(JSON.stringify({ sysId, fileId, flowNode }))
      console.log('下载证据', result)
      if (result.operationSuccessFlag) {
        var imgs = ['jpg', 'gif', 'png']
        // var text = ['txt', 'doc', 'docx', 'pdf', 'xls', 'xlsx', 'ppt']
        var type = item.attachmentInfo?.fileName.split('.')[1]
        if (imgs.includes(type)) {
          this.isShow = true
          this.showImg = true
          this.url = result.file
        } else if (text.includes(type)) {
          this.showTxt = true
          this.url = Base64.decode(result.file)
        }
        // this.showTxt = true
        // this.url = result.file
        // this.url = Base64.decode(result.file)
        // console.log('解码', this.url)

      //   let name = item.attachmentInfo?.fileName
      //   const reg = /\"(.*?)\"/
      //   // console.log(name)
      //   var str = new Blob([result.file], {
      //     type: mimeString
      //   })
      //   let url = window.URL.createObjectURL(str,)
      //   // let url = window.URL.createObjectURL(new Blob([result.file],))
      //   let link = document.createElement('a')
      //   link.style.display = 'none'
      //   link.href = url
      //   link.setAttribute('download', name)//对文件进行命名
      //   document.body.appendChild(link)
      //   link.click()
      //   document.body.removeChild(link) //下载完成移除元素
      //   window.URL.revokeObjectURL(url) //释放掉blob对象
      } else {
        this.$toast(result.errorMessage)
      }
      // this.apiResponse(result, '.auditGq', () => { })
    },

    // 下载证据
    // async downloadFile(item) {
    //   let sysId = item.attachmentInfo.sysId
    //   let fileId = item.attachmentInfo.fileId
    //   let flowNode = this.$route.query.flowNode
    //   let result = await reqDownloadFile(
    //     JSON.stringify({ sysId, fileId, flowNode })
    //   )
    //   console.log("下载证据", result)
    //   if (result.operationSuccessFlag) {
    //     var arr = item.attachmentInfo?.fileName.split(".")
    //     var type = arr[arr.length - 1]
    //     console.log('文件类型', type)
    //     let base64Url = this.getBase64Type(type) + result.file
    //     console.log("完整的base64", base64Url)
    //     this.downloadFileFn(base64Url, item.attachmentInfo?.fileName)
    //   } else {
    //     this.$toast(result.errorMessage)
    //   }
    //   // this.apiResponse(result, '.auditGq', () => { })
    // },
    //根据文件后缀 获取base64前缀不同 拼接完整的base64
    getBase64Type(type) {
      switch (type) {
        case "txt":
          return "data:text/plain;base64,"
        case "doc":
          return "data:application/msword;base64,"
        case "docx":
          return "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,"
        case "xls":
          return "data:application/vnd.ms-excel;base64,"
        case "xlsx":
          return "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,"
        case "pdf":
          return "data:application/pdf;base64,"
        case "pptx":
          return "data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,"
        case "ppt":
          return "data:application/vnd.ms-powerpoint;base64,"
        case "png":
          return "data:image/png;base64,"
        case "jpg",
          "jpeg":
          return "data:image/jpeg;base64,"
        case "gif":
          return "data:image/gif;base64,"
        case "svg":
          return "data:image/svg+xml;base64,"
        case "ico":
          return "data:image/x-icon;base64,"
        case "bmp":
          return "data:image/bmp;base64,"
      }
    },
    //将完整的base64码转换为blob
    base6toBlob(dataurl) {
      var arr = dataurl.split(","),
        mimeString = arr[0].match(/:(.*?);/)[1],
        str = atob(arr[1]),
        u8 = new Uint8Array(str.length)
      for (let i = 0; i < str.length; i++) {
        u8[i] = str.charCodeAt(i)
      }
      return new Blob([u8], { type: mimeString })
    },
    downloadFileFn(base64, fileName) {
      console.log("完整的base64", base64)
      console.log("下载后的文件名", fileName)
      var myBlob = this.base6toBlob(base64)
      var myUrl = URL.createObjectURL(myBlob)
      console.log("返回数据的blob链接", myUrl)
      // 使用a标签进行下载
      let link = document.createElement("a")
      link.style.display = "none"
      link.href = myUrl
      link.setAttribute("download", fileName) //对文件进行命名
      document.body.appendChild(link)
      link.click()

      // this.$refs.iframe.src = myUrl.substring(5)
      // console.log(this.$refs.iframe.src);

      // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      //   window.navigator.msSaveOrOpenBlob(base64, fileName)
      // } else {
      //   // 打开之后，无法退出问题
      //   window.open(myUrl, 'newpage') // _parent
      //   setTimeout(() => {
      //     var np = window.open('', 'newpage') // _parent
      //     console.log('close');
      //     np.close()
      //   }, 300) 
      // }

      document.body.removeChild(link) //下载完成移除元素
      window.URL.revokeObjectURL(myUrl) //释放掉blob对象
    },
  },
  created() {
    // 审核前查询
    this.getQueryInfo()
  },
};
</script>

<style scoped lang="less">
img {
  width: 100%;
  // height: 100%;
  object-fit: cover;
}

.field {
  display: flex;
  justify-content: space-between;
  padding: 8px 14px;
  background: #fff;
  line-height: 30px;
  font-size: 14px;
  .label {
    color: #3b3b3b;
  }
  .radio-box {
    span {
      border-right: 1px solid #fff;
      display: inline-block;
      width: 50px;
      text-align: center;
      background-color: #eee;
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
.auditGq {
  .main {
    background-color: #fff;
    margin: 10px;
    border: 1px solid rgb(121, 177, 251);
    .van-cell-group {
      .van-cell {
        border-bottom: 1px solid #e0e0e0;
        .van-cell__title {
          text-align: left;
        }
      }
      .fileName {
        .van-cell__value {
          span {
            color: rgb(145, 98, 245);
          }
        }
      }
    }
    // .selectButton {
    //   display: flex;
    //   justify-content: space-between;
    //   align-items: center;
    //   height: 45px;
    //   padding: 0 10px 0 16px;
    //   background-color: #fff;
    //   .title {
    //     display: flex;
    //     align-items: center;
    //     color: #646566;
    //     font-size: 14px;
    //   }
    //   .button {
    //     .van-button {
    //       width: 50px;
    //       height: 35px;
    //       padding: 5px;
    //       font-size: 13px;
    //     }
    //   }
    // }
    .inputRegion {
      /deep/.van-cell__title {
        span {
          display: inline-block;
          margin-top: 5px;
        }
      }
      /deep/.van-cell__value {
        input {
          padding: 5px;
          border: 1px solid #e0e0e0;
        }
      }
    }
    .submitButton {
      padding: 30px;
    }
  }
}
</style>