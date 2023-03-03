<template>
  <div>
    <MyHeader :name="headName" left="arrow-left" @goBackEv="$router.go(-1)" />
    <div class="upload">
      <p>工单最多允许上传10张照片</p>
      <van-uploader
        v-model="updateFile"
        multiple
        :max-count="10"
        :before-read="beforeRead"
        :after-read="afterRead"
      >
        <van-button icon="plus" type="default"></van-button>
      </van-uploader>
    </div>
    <van-button block type="info" @click="submit">提交</van-button>
  </div>
</template>

<script>
import { IdmUploadPhotoApi } from '@/http/button'
export default {
  name: 'JzdUploadphoto',
  data() {
    return {
      headName: `上传照片(${this.$route.query.id})`,
      updateFile: [],
      params: []
    }
  },
  methods: {
    beforeRead(file){
      return this.compressFile(file, false)
    },
    afterRead(info) {
      // 此时可以自行将文件上传至服务器
      console.log(info)
      // console.log(file.content.split(',')[1])
      this.params.push({
        photoFile: info.content.split(',')[1],
        photoSize: this.getfilesize(info.file.size),
        photoType: info.file.type.split('/')[1]
      })
    },
    getfilesize(size) {
      if (!size)
        return ""
      var num = 1024.00 //byte
      if (size < num)
        return size + "B"
      if (size < Math.pow(num, 2))
        return (size / num).toFixed(2) + "K" //kb
      if (size < Math.pow(num, 3))
        return (size / Math.pow(num, 2)).toFixed(2) + "M" //M
      if (size < Math.pow(num, 4))
        return (size / Math.pow(num, 3)).toFixed(2) + "G" //G
      return (size / Math.pow(num, 4)).toFixed(2) + "T" //T
    },
    async submit() {
      if (this.updateFile.length == 0) return this.$toast('请选择上传照片')
      var list = {
        id: Number(this.$route.query.id),
        idmPhotoList: this.params
      }
      console.log('参数', list)
      let data = await IdmUploadPhotoApi(JSON.stringify(list))
      if (data.operationSuccessFlag) {
        this.$toast.success(data.successMessage)
        this.$router.go(-1)
        // 刷新工单详情/工作台
        this.operationSuccessRefresh(true)
      } else {
        this.$toast.fail(data.errorMessage)
      }
    }
  },
}
</script>

<style scoped lang="less">
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
::v-deep .van-button--block {
  width: 90%;
  margin: 20px auto;
  border-radius: 8px;
}
</style>