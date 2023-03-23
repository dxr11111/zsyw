<template>
  <div class="login">
    <div class="welcome">
      <!-- <h3>您好,</h3>
      <h3>欢迎来到OSS统一门户</h3> -->
      <div class="radius"></div>
    </div>
    <div class="content">
      <div class="userLogin">
        <!-- 用户头像登录名 -->
        <div class="loginPortrait" v-if="isLoginInfo">
          <div class="circle">{{ userName[0] }}</div>
          <span>{{ userName }}</span>
        </div>
        <van-form @submit="onSubmit">
          <van-field
            v-if="!isLoginInfo"
            v-model="loginNo"
            name="用户名"
            placeholder="请输入用户名"
            autoComplete="off"
            clearable
          />
          <van-field
            v-model="password"
            name="密码"
            placeholder="请输入密码"
            :right-icon="passwordStatus ? 'eye' : 'closed-eye'"
            :type="!passwordStatus ? 'password' : 'text'"
            @click-right-icon="passwordStatus = !passwordStatus"
            clearable
            autocomplete="off"
          />
          <div class="loginButton">
            <van-button round block type="info" native-type="submit"
              >登录</van-button
            >
          </div>
        </van-form>
        <div class="more" @click="moreFn">更多</div>
      </div>
    </div>
    <!-- 底部logo 文字 -->
    <div class="bottomContainer">
      <div class="bottom">
        <div class="logo"></div>
        <div class="version">版本号：V1.0.0</div>
      </div>
    </div>

    <More
      v-if="moreListShow"
      :moreListShow="moreListShow"
      :isLogin="true"
      :isLoginInfo="isLoginInfo"
      @changeMoreShow="moreListShow = false"
      @clearLoginNo="clearLoginNo"
    />
  </div>
</template>

<script>
import { getItem, removeItem, setItem } from "@/utils/public/sessionStorage";
import { mapGetters } from "vuex";
export default {
  name: "PassLogin",
  components: {
    More: () => import("@/components/loginMore/index.vue"),
  },
  data() {
    return {
      passwordStatus: false,
      isLoginInfo: false, // 当前是否有登录信息
      // lastLoginNo: "", // 切换账号后显示的上一个登录人
      userName: localStorage.getItem("userName") || "", // 圆形头像下的字
      loginNo: "",
      password: "",
      moreListShow: false,
      pwdResetShow: false,
      // 密码重置
      resetLoginNo: "",
      resetMobile: "",
    };
  },
  computed: {
    ...mapGetters(["getLoginInfo"]),
  },
  methods: {
    // 清空用户填入的用户名及密码
    clearLoginNo() {
      this.loginNo = "";
      this.password = "";
    },
    moreFn() {
      this.moreListShow = true;
    },
    changeIsLogin() {
      this.isLoginInfo = false;
      // console.log('切换账号了', this.isLoginInfo);
    },
    checkLoginInfo() {
      // 查看用户登录信息
      if (this.getLoginInfo?.loginNo) {
        this.isLoginInfo = true;
        this.loginNo = this.getLoginInfo.loginNo;
        this.userName = this.getLoginInfo.userName;
      }
    },
    // 点击登录
    async onSubmit(values) {
      if (this.loginNo == "" && this.password == "") {
        this.$toast("请输入账号和密码");
      } else if (this.loginNo == "") {
        this.$toast("请输入账号");
      } else if (this.password == "") {
        this.$toast("请输入密码");
      } else {
        // 本地有登录信息时，用户只需输入密码
        // 登录成功后将登录名存储起来
        // this.lastLoginNo = this.loginNo
        // 发送登录请求
        let postData = {
          loginNo: this.loginNo,
          password: this.password,
          userToken: "",
          tokenId: "",
        };
        console.log("postData", postData);
        let result = await this.$store.dispatch(
          "getLoginInfo",
          JSON.stringify(postData)
        );
        console.log("登录结果", result);
        this.apiResponse(result, ".login", () => {
          // 登录成功
          // 存入用户密码
          setItem("userPwd", this.password);
          localStorage.setItem("userPwd", this.password);
          localStorage.setItem("loginNo", this.loginNo);
          localStorage.setItem("account", this.loginNo);
          localStorage.setItem("userName", result.userName);
          this.$router.push("/main");
        });
      }
    },
  },
  mounted() {},
  created() {
    if (this.userName) {
      this.loginNo = localStorage.getItem("account") || getItem("loginNo");
      this.isLoginInfo = true;
    }
    // 密码登录还是手势登录，未跳转
    // let getPassData = JSON.parse(localStorage.getItem('gestPassword') || '[]')
    // let loginNo = localStorage.getItem('loginNo')
    // console.log(loginNo, getPassData);
    // if (getPassData.length > 0 && loginNo) {
    //   getPassData.forEach(e => {
    //     if (e.loginNo == loginNo && e.gestPassword?.length > 0) {
    //       console.log(5555555555);
    //       return this.$router.push('/gestPassLogin')
    //     }
    //   })
    // }
    // 查看本地存储是否有用户登录信息，有则在更多显示切换账号
    this.checkLoginInfo();
  },
};
</script>

<style scoped lang="less">
@import "@/assets/css/mixin.less";
@fontFamily: "PingFangSC-Medium, PingFang SC";
@font-Size: 15px;
::v-deep .van-overlay {
  z-index: 99;
}
.login {
  height: 100%;
  min-height: 650px;
  position: relative;
  background-color: #fefefe;
  font-family: @fontFamily;
  font-size: @font-Size;
  .welcome {
    box-sizing: border-box;
    width: 100%;
    height: 32%;
    position: relative;
    background-image: url("./images/login-bg.jpg");
    background-size: cover;
    .radius {
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 25px;
      background-color: #fff;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
      z-index: 9;
    }
  }
  .content {
    width: 100%;
    height: 32%;
    background-color: #fefefe;
    .userLogin {
      height: 223px;
      margin: 0 auto;
      .loginPortrait {
        transform: translateY(-64%);
        z-index: 9;
        position: relative;
        .circle {
          width: 60px;
          height: 60px;
          margin: 0 auto;
          line-height: 60px;
          background-color: #fff;
          border-radius: 30px;
          border: 2px solid #fff;
          color: #144088;
          font-weight: 500;
          font-size: 40px;
        }
        span {
          display: inline-block;
          padding-top: 10px;
          font-weight: 600;
          font-size: 18px;
        }
      }
      .van-form {
        margin-left: 38px;
      }
      .van-cell {
        width: 300px;
        height: 48px;
        padding: 14px 0;
        margin-top: 2px;
        box-shadow: 0px 1px 0px 0px rgba(27, 32, 53, 0.15);
        /deep/.van-field__control {
          color: #1b2035;
          font-size: 15px;
        }
        &::after {
          content: "";
          width: 24px;
        }
      }
      /* .pwdHide {
        position: absolute;
        right: 38px;
        top: 66px;
      } */
      .loginButton {
        width: 299px;
        height: 44px;
        margin-top: 30px;
        .van-button--info {
          background: linear-gradient(97deg, #144088 0%, #2b57ee 100%);
          border-radius: 22px;
          font-size: 15px;
        }
      }
      .more {
        width: 40px;
        height: 40px;
        margin: 0 auto;
        line-height: 40px;
        font-size: 15px;
        color: #1b2035;
      }
    }
  }
  /* prettier-ignore */
  .bottomContainer{
    height: 32%;
    .bottom {
      position: absolute;
      bottom: 52PX;
      left: 50%;
      transform: translateX(-50%);
      /* prettier-ignore */
      .logo {
      // position: absolute;
      // left: 101px;
      // bottom: 89PX;
      width: 174PX;
      height: 105PX;
      background-image: url("@/assets/images/common/loginLogo.png");
      background-size: cover;
    }
      /* prettier-ignore */
      .version {
      // position: absolute;
      // left: 137px;
      // bottom: 52PX;
      // width: 102px;
      // height: 21px;
      // line-height: 21px;
      margin-top: 16px;
      font-size: 14PX;
      // text-align: center;
      color: #1b2035;
    }
    }
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
}
</style>