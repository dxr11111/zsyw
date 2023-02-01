<template>
  <div>
    <!-- 点击更多 -->
    <van-overlay :show="moreListShow" @click="$emit('changeMoreShow')">
      <div class="wrapper">
        <div class="moreList" v-if="moreListShow">
          <ul @click.stop>
            <li @click="scanEv">
              <img src="@/assets/imgs/scan.png" alt="" />
              <span>扫码下载</span>
            </li>
            <li @click="installEv">
              <img src="@/assets/imgs/install.png" alt="" />
              <span>下载安装</span>
            </li>
            <li v-if="isChangeNo" @click="switchEv">
              <img src="@/assets/imgs/switch.png" alt="" />
              <span>切换账号</span>
            </li>
            <li @click="resetEv">
              <img src="@/assets/imgs/reset.png" alt="" />
              <span>密码重置</span>
            </li>
          </ul>
          <van-button @click="$emit('changeMoreShow')">取消</van-button>
        </div>
      </div>
    </van-overlay>
    <!-- 点击密码重置 -->
    <van-overlay :show="pwdResetShow" @click="pwdResetShow = false">
      <div class="pwdWrapper">
        <div class="pwdReset" @click.stop>
          <h4>密码重置</h4>
          <van-field
            v-model="resetLoginNo"
            label="账号"
            placeholder="请输入系统账号"
          />
          <van-field
            v-model="resetMobile"
            label="手机号"
            placeholder="请输入对应账号的手机号码"
          />
          <p>
            账号和手机号与后台系统登记信息一致时，将发送密码到手机号，请注意查收新密码，并使用新密码登录系统，原密码作废。
          </p>
          <div class="button">
            <van-button type="info" @click="cancelPwdReset">取消</van-button>
            <van-button type="info" @click="submitPwdReset">提交</van-button>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { getItem, removeItem } from "@/utils/sessionStorage"
export default {
  props: {
    // 是否是主登录页
    isLogin: {
      type: Boolean,
      default: true
    },
    isLoginInfo: {
      type: Boolean,
      default: false
    },
    // isChangeNo: {
    //   type: Boolean,
    //   default: false
    // },
    moreListShow: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      // moreListShow: false,
      pwdResetShow: false,
      isChangeNo: false, // 是否显示切换账号
      // 密码重置
      resetLoginNo: "",
      resetMobile: "",
    }
  },
  created () {
    if (!this.isLogin) {
      this.isChangeNo = true
    }
    // if (localStorage.getItem("loginNo") && this.isLogin) {
    //   this.isChangeNo = true
    // }
    if (this.isLoginInfo) {
      this.isChangeNo = true
    }
  },
  methods: {
    // 点击扫码下载
    scanEv () {
      this.$router.push("/qrcode")
    },
    // 点击下载安装
    installEv () { },
    // 点击切换账号
    async switchEv () {
      // 关闭更多界面
      this.$emit('changeMoreShow')
      // 调用退出登录接口
      await this.$store.dispatch("getLoginOut")
      // 清空本地登录信息
      removeItem("loginInfo")
      this.isChangeNo = false
      // 切换账号/退出登录时要清除本地存储的userInfo,页面显示上一次登录名从本地存储loginNo获取
      // if (getItem("loginNo")) {
      //   this.loginNo = getItem("loginNo")
      // }

      if (!this.isLogin) {
        // this.$router.push('/login')
        this.$router.push('/passLogin')
      } else {
        this.$parent.changeIsLogin()
      }
    },
    // 点击密码重置
    resetEv () {
      this.pwdResetShow = true
    },
    //取消密码重置
    cancelPwdReset () {
      this.pwdResetShow = false
      this.resetLoginNo = ""
      this.resetMobile = ""
    },
    // 提交密码重置
    async submitPwdReset () {
      if (this.resetLoginNo == "" || this.resetMobile == "") {
        this.$toast("账号或手机号不能为空")
      } else {
        //调用接口
        let loginNo = this.resetLoginNo
        let mobile = this.resetMobile
        // let loginNo = "yangyp";
        // let mobile = "18600099891";
        let postData = { loginNo, mobile }
        try {
          let result = await this.$store.dispatch(
            "getpwdReset",
            JSON.stringify(postData)
          )
          if (result.operationSuccessFlag) {
            // 接口返回成功
            this.$toast(result.successMessage)
            this.pwdResetShow = false
          } else {
            // 接口返回失败
            this.$toast(result.errorMessage)
          }
        } catch (error) {
          console.log("err", error)
        }
      }
    },
  },
}
</script>

<style scoped lang="less">
::v-deep .van-overlay {
  z-index: 99;
}
.wrapper {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 100%;
  .moreList {
    // z-index: 2;
    width: 100%;
    background-color: #efefef;
    border-radius: 20px 20px 0 0;
    ul {
      display: flex;
      justify-content: space-around;
      li {
        display: flex;
        flex-direction: column;
        padding: 20px 0;
        img {
          width: 48px;
          margin: 0 auto;
        }
        span {
          padding: 10px 0;
        }
      }
    }
    .van-button--normal {
      width: 100%;
      background-color: #efefef;
      border-top: 1px solid #000;
    }
  }
}
.pwdWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  .pwdReset {
    width: 90%;
    padding: 10px;
    // height: 200px;
    background-color: #fff;
    h4 {
      color: #97a6da;
    }
    /deep/.van-field__value {
      border: 1px solid;
    }
    p {
      color: #a19ed4;
      padding: 10px 0;
    }
    .button {
      .van-button--normal {
        height: 40px;
        margin: 0 5px;
      }
    }
  }
}
</style>