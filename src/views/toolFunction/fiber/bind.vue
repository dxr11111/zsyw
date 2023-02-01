<template>
  <div class="toolFiberBind">
    <!-- 工具-绑定光纤尾码 -->
    <MyHeader name="绑定光纤尾码" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <!-- 用户号码 -->
      <van-field v-model="productNum" placeholder="请输入用户号码" label="用户号码" class="inputRegion" />
      <!-- 光纤尾码 -->
      <van-field
        v-model="fiberNo"
        label="光纤尾码"
        right-icon="scan"
        class="inputRegion"
        placeholder="请输入或扫描光纤尾码"
      />
      <!-- 上传图片 -->
      <div class="upload">
        <p>上传照片（最多5张照片）</p>
        <van-uploader v-model="imgList" multiple :max-count="5">
          <van-button icon="plus" type="default"></van-button>
        </van-uploader>
      </div>
    </div>
    <div class="buttonRegion">
      <van-button type="info" block @click="checkOut">确定</van-button>
    </div>
  </div>
</template>

<script>
import { reqIfmBindingFiber } from '@/http/tools'
import axios from 'axios'
import url from '@/http/img'
import { getItem } from '@/utils/sessionStorage'


export default {
  name: 'ToolfiberBind',
  data () {
    return {
      productNum: '', // 用户号码
      fiberNo: '', // 光纤尾码
      imgList: [], // 上传图片列表
      pictureIds: [], // 图片id

    }
  },
  methods: {
    // 回退
    goBackFn () {
      this.$router.go(-1)
    },
    // 校验
    checkOut () {
      if (this.productNum == '') return this.$toast('用户号码不能为空')
      if (this.fiberNo == '') return this.$toast('光纤尾码不能为空')
      this.getPicturesId()
    },
    // 提交图片 获取图片id
    getPicturesId () {
      // 清空上一次内容
      this.pictureIds = []
      // 判断如果用户上传图片则获取图片id否则直接提交处理过程
      if (this.imgList.length > 0) {
        // 循环图片列表
        this.imgList.forEach((item, index) => {
          // 上传 form-data格式 图片
          let formData = new FormData();
          formData.append("loginNo", getItem('loginNo'))
          formData.append("sheetId", '')
          formData.append("pictype", 3)
          formData.append("picName", `${index}`)
          formData.append("file", item.file)

          // 发送图片id请求
          axios({
            method: 'post',
            url: url,
            data: formData,
          }).then(res => {
            console.log('图片id结果', res)
            // 获取图片id
            this.pictureIds.push(parseInt(res.data.id))
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
    // 确定提交
    async onSubmit () {
      let productNum = this.productNum
      let fiberNo = this.fiberNo
      let pictureIds = this.pictureIds
      let result = await reqIfmBindingFiber(JSON.stringify({ productNum, fiberNo, pictureIds }))
      console.log('提交结果', result)

      this.apiResponse(result, 'toolFiber', () => { })
    },

  },


}
</script>

<style scoped lang="less">
.toolFiberBind {
  height: 100%;
  background-color: @bg-color;
  .main {
    .van-cell {
      /deep/.van-cell__title {
        flex: 1;
      }
      /deep/.van-cell__value {
        flex: 4;
        .van-icon-scan {
          font-size: 20px;
        }
      }
    }
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
    .upload {
      display: flex;
      justify-content: flex-start;
      padding: 16px;
      flex-direction: column;
      text-align: left;
      background-color: #fff;
      p {
        color: #646566;
        font-size: 14px;
        margin-bottom: 20px;
      }
    }
  }
  .buttonRegion {
    margin: 30px;
  }
}
</style>