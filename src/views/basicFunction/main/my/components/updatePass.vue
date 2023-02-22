<template>
  <div style="height: 100%; background: #eee">
    <MyHeader :name="'修改密码'" left="arrow-left" @goBackEv="$router.go(-1)" />
    <div class="main">
      <div class="tip">
        该密码为统一安全平台系统的密码，修改后进入统一安全平台需使用新密码登录
      </div>
      <div class="content">
        <van-field
          v-model.trim="oldPass"
          name="原密码"
          placeholder="请输入原密码"
          :right-icon="oldPassStatus ? 'eye' : 'closed-eye'"
          :type="!oldPassStatus ? 'password' : 'text'"
          @click-right-icon="oldPassStatus = !oldPassStatus"
          clearable
        />
        <van-field
          v-model.trim="newPass"
          name="新密码"
          placeholder="请输入新密码"
          :right-icon="newPassStatus ? 'eye' : 'closed-eye'"
          :type="!newPassStatus ? 'password' : 'text'"
          @click-right-icon="newPassStatus = !newPassStatus"
          clearable
        />
        <van-field
          v-model.trim="confirmNewPass"
          name="新密码"
          placeholder="请重新输入新密码"
          :right-icon="conPassStatus ? 'eye' : 'closed-eye'"
          :type="!conPassStatus ? 'password' : 'text'"
          @click-right-icon="conPassStatus = !conPassStatus"
          clearable
        />
      </div>
      <div class="notic">
        【密码有效期90天;用户首次登录必须修改密码！不能与最近一次使用过的密码相同;密码首字母要求大写;密码长度为8-16个字符;必须包括1-10个字母;必须包含1-10个数字;必须包含1-10个标点符号;禁止包含的符号[%,+,&lt;,&gt;,/]】
      </div>
      <van-button block type="info" @click="updatePass">提交</van-button>
    </div>
  </div>
</template>

<script>
import { ChangePassApi } from '@/http/index'
export default {
  name: 'UpdatePass',
  data () {
    return {
      oldPass: '',
      oldPassStatus: false,
      newPass: '',
      newPassStatus: false,
      confirmNewPass: '',
      conPassStatus: false,
    }
  },
  methods: {
    sendToast () {
      this.$toast('新密码不符合要求，请按红色提示设置')
    },
    async updatePass () {
      // let reg = new RegExp(/^[A-Z](?=(?:\D*\d){1,10})(?=(?:\W\w){1,10})/)
      if (this.oldPass == '') return this.$toast('请输入原密码')
      if (this.newPass == '') return this.$toast('请输入新密码')
      if (this.confirmNewPass == '') return this.$toast('请输入确认新密码')
      if (this.oldPass == this.newPass) return this.$toast('新密码不能和原密码一致')
      if (this.newPass !== '') {
        let first = new RegExp(/^[A-Z]/)
        // 必须以大写字母开头
        if (!first.test(this.newPass.charAt(0))) return this.sendToast()
        // 密码长度
        var flag = Boolean(this.newPass.length >= 8 && this.newPass.length <= 16)
        if (!flag) return this.sendToast()
        // 密码中数字在1-10
        let num = this.newPass.replace(/[^0-9]/g, '')
        if (!Boolean(num.length >= 1 && num.length <= 10)) return this.sendToast()
        // 密码中字母在1-10，必须包含大小写，在这把首位截取掉了
        let word = this.newPass.slice(1).replace(/[^A-Za-z]/g, '')
        if (word.length == 1) {
          if (!(/^[a-z]/.test(word))) return this.sendToast()
        } else if (!Boolean(word.length > 1 && word.length <= 10)) {
          this.sendToast()
        }
        // 密码字符串数组
        let spec = this.newPass.split("")
        let arr = []
        spec.forEach(e => {
          // 禁止包含的字符
          if (e == '%' || e == '+' || e == '<' || e == '>' || e == '/') {
            this.sendToast()
          }
          // 这个条件输出的是数字和字母，如果不加!输出的是全部的
          if (!(/[^A-Za-z]/.test(e)) || !(/[^0-9]/.test(e))) {
            arr.push(e)
          }
        })
        console.log('非标点符号项', arr);
        // 筛选所有项和非标点项(只有数字和字母)不同项
        let others = spec.filter(item => {
          return arr.indexOf(item) == -1
        })
        console.log('标点符号项', others);
        // 包含的标点符号个数在1-10
        if (!Boolean(others.length >= 1 && others.length <= 10)) return this.sendToast()
      }
      if (this.newPass !== this.confirmNewPass) return this.$toast('两次输入新密码不一致，请重新输入')
      let params = {
        pwdType: 2,	// 密码类型
        oldCrPassword: this.oldPass,	// 原密码	
        newCrPassword: this.newPass,	//新密码	
      }
      let data = await ChangePassApi(JSON.stringify(params))
      data.operationSuccessFlag ? this.$toast.success(data.successMessage) : this.$toast.fail(data.errorMessage)
      this.$router.go(-1)
    }
  },
}
</script>

<style scoped lang="less">
.main {
  padding: 15px;
  background-color: #eee;
  .tip {
    text-align: start;
    color: #4981fe;
    font-weight: 500;
    margin-bottom: 15px;
  }
  .content {
    .van-cell {
      font-size: 16px;
      margin-bottom: 18px;
      border: 1px solid #ccc;
    }
    ::v-deep .van-icon {
      font-size: 5.27vw;
    }
  }
  .notic {
    color: #f43632;
    text-align: start;
    font-size: 13px;
  }
  ::v-deep .van-button--block {
    width: 94%;
    margin: auto;
    margin-top: 26px;
    background: #5b8fff;
  }
}
</style>