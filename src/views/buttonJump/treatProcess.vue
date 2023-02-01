<template>
  <div class="treatProcess">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <!-- 优化单显示 -->
      <div
        class="yhdTitle"
        v-if="this.$route.query.sysId == 3 && this.flowNode == 6"
      >
        添加{{ this.$route.query.orderNum }}移动优化单处理过程
      </div>
      <van-form ref="form" @submit="getPicturesId">
        <!-- 处理过程 -->
        <van-field
          v-model="process"
          name="process"
          placeholder="请填写处理过程"
          type="textarea"
          :rules="[{ required: true }]"
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
            :rules="[{ required: true }]"
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
import { reqTreatProcess } from '@/http/button';
import url from '@/http/img'
// import { reqgetImgId } from '@/http/index'
import { getItem } from '@/utils/sessionStorage'
import { removeWatermark } from '@/utils/waterMark'
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  name: 'TreatProcess',
  data () {
    return {
      headName: `处理过程(${this.$route.query.orderNum})`,
      process: '',
      remark: '',
      imgList: [], // 上传图片列表
      pictureIds: [], // 上传图片列表id-int型
      file: [], // 上传图片列表id-string型
      loginNo: getItem('loginNo'), // 登录人
      sheetId: parseInt(this.$route.query.id), // 工单号
      flowNode: this.$route.query.flowNode, // 工单环节
    }
  },
  computed: {

  },
  methods: {
    // 回退
    goBackFn () {
      this.$router.go(-1)
    },
    // 提交图片 获取图片id
    getPicturesId () {
      // 判断如果用户上传图片则获取图片id否则直接提交处理过程
      if (this.imgList.length > 0) {
        // 循环图片列表
        this.imgList.forEach((item, index) => {
          // 上传 form-data格式 图片
          let formData = new FormData();
          formData.append("loginNo", this.loginNo)
          formData.append("sheetId", this.sheetId)
          formData.append("pictype", 3)
          formData.append("picName", `${this.sheetId}-${index}`)
          formData.append("file", item.file)

          // 地址不同
          // let url = 'img/saveImage'
          // if (process.env === 'production') url = 'http://132.91.203.143:7010/img/saveImage'

          // 发送图片id请求
          axios({
            method: 'post',
            url: url,
            data: formData,
          }).then(res => {
            console.log('图片id结果', res)
            // 获取图片id
            this.pictureIds.push(parseInt(res.data.id))
            this.file.push(res.data.id)
            // 判断如果是最后一次图片请求，则请求处理过程接口
            if (index === this.imgList.length - 1) {
              // 发送处理过程请求
              this.onSubmit()
            }

          }).catch((err) => {
            console.log(err);
          })
        })
      } else {
        this.onSubmit()

      }

    },
    // 提交表单信息
    async onSubmit () {
      // 提交图片 获取图片id

      let id = parseInt(this.sheetId) // 工单唯一标识
      let intro = this.process // 处理过程
      let remark = this.remark // 备注
      let pictureIds = this.pictureIds // 图片ID
      let file = this.file // 重保单的附件
      let postData = { id, intro, remark, pictureIds }
      // 重保单（sysId=3，flowNode=5） 不上传pictureIds 上传file
      if (this.$route.query.sysId == 3 && this.flowNode == 5) {
        postData = { id, intro, remark, file }
      }
      try {
        let result = await reqTreatProcess(JSON.stringify(postData))
        console.log('编辑处理过程结果', result)
        if (result.operationSuccessFlag) {
          // 成功
          this.$toast(result.successMessage)
          this.$router.go(-1)
          // 只调用接口按钮操作成功 刷新工单详情/工作台
          this.operationSuccessRefresh(true)

        } else {
          // 失败
          this.$toast(result.errorMessage)
        }

      } catch (error) {
        console.log('err', error)

      }

    },

    // 图片读取完成
    async afterRead (file) {
      // console.log('file', file)
    },
  },
  created () {
    removeWatermark();
  },
}
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