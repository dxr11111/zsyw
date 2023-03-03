<template>
  <div>
    <div class="top">
      <div class="title">
        <van-icon name="arrow-left" />
        <div>个人中心</div>
        <van-icon name="search" />
      </div>
      <div class="avatar">{{ userName[0] }}</div>
      <div class="info">
        <div class="username">{{ userName }}</div>
        <div class="count">登录账号：{{ loginNo }}</div>
        <div class="count" v-if="mobileNumber?.length > 0">
          手机号：{{ mobileNumber }}
        </div>
      </div>
    </div>
    <div>
      <van-cell
        :value="quickLoginType"
        is-link
        @click="$router.push('/quickLogin')"
      >
        <template #title>
          <img src="./images/quick-login.png" alt="" />
          <span class="custom-title">快捷登录</span>
        </template>
      </van-cell>
      <van-cell is-link>
        <template #title>
          <img src="./images/message.png" alt="" />
          <span class="custom-title">消息推送</span>
        </template>
        <template #right-icon>
          <van-switch @click="setPushStatus" v-model="checked" size="20px" />
        </template>
      </van-cell>
      <van-cell is-link>
        <template #title>
          <img src="./images/update-version.png" alt="" />
          <span class="custom-title">检查客户端版本</span>
        </template>
      </van-cell>
      <van-cell is-link @click="$router.push('/myPermission')">
        <template #title>
          <img src="./images/my-authority.png" alt="" />
          <span class="custom-title">我的权限</span>
        </template>
      </van-cell>
      <van-cell is-link @click="$router.push('/updatePass')">
        <template #title>
          <img src="./images/update-password.png" alt="" />
          <span class="custom-title">修改密码</span>
        </template>
      </van-cell>
      <!-- <van-cell is-link @click="$router.push('/updatePhone')">
        <template #title>
          <img src="./images/update-phoneNumber.png" alt="" />
          <span class="custom-title">修改手机号</span>
        </template>
      </van-cell> -->
      <van-cell is-link @click="showMess = true">
        <template #title>
          <img src="./images/feedback.png" alt="" />
          <span class="custom-title">意见反馈</span>
        </template>
      </van-cell>
      <van-cell is-link :value="`V ${curtVersion}`">
        <template #title>
          <img src="./images/software-version.png" alt="" />
          <span class="custom-title">软件版本</span>
        </template>
      </van-cell>
      <van-cell is-link @click="logout">
        <template #title>
          <img src="./images/logout.png" alt="" />
          <span class="custom-title">退出</span>
        </template>
      </van-cell>
    </div>

    <!-- 意见反馈 -->
    <van-popup round v-model="showMess">
      <div class="mess-title">意见反馈</div>
      <van-field
        class="mess-input"
        rows="1"
        autosize
        v-model="contents"
        type="textarea"
        label="意见内容："
        placeholder="请输入意见内容"
      />
      <van-button block type="info" @click="contentBalk">确认</van-button>
    </van-popup>
  </div>
</template>

<script>
import { getItem, removeItem, setItem } from "@/utils/public/sessionStorage";
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive";
import {
  GetPushStatusApi,
  SendFeedBackApi,
  CheckVersionApi,
  LogoutApi,
  GetPhoneNumberApi,
} from "@/http/index";
export default {
  name: "My",
  mixins: [keepAliveMixin],
  data() {
    return {
      checked: null,
      userName: "", // 登录人姓名
      loginNo: "", // 登录账号
      usersList: null, // 所有用户信息
      showMess: false,
      contents: "", // 意见反馈
      curtVersion: "", // 当前版本
      quickLoginType: "",
      mobileNumber: "", // 手机号
      loginTypeCode: JSON.parse(localStorage.getItem("loginTypeCode") || "[]"), // 所有账号的快捷登录设置
      getPassData: JSON.parse(localStorage.getItem("gestPassword") || "[]"), // 获取存储所有用户的手势密码
    };
  },
  computed: {
    // 当前登录人的信息
    userInfo() {
      let curr = {};
      this.usersList.forEach((e) => {
        if (e.accountId == this.loginNo) {
          curr = e;
        }
      });
      return curr;
    },
  },
  created() {
    this.checkVersion();
    this.getPhoneNumber();
    console.log("登录类型信息", localStorage.getItem("loginTypeCode"));
    console.log("登录人信息", this.loginNo, this.userName);
  },
  methods: {
    // 退出登录
    async logout() {
      await LogoutApi(JSON.stringify({}));
      // console.log(data);
      // 退出账号时，清空当前账号的密码及快捷标识
      this.loginTypeCode.forEach(e => {
        if (e.loginNo == this.loginNo) {
          e.typeCode = 0
        }
      })
      this.getPassData.forEach((e) => {
        if (e.loginNo == this.loginNo) {
          e.gestPassword = []
        }
      })
      localStorage.setItem("loginTypeCode", JSON.stringify(this.loginTypeCode))
      localStorage.setItem("gestPassword", JSON.stringify(this.getPassData))
      // 从这里退出需要移除账号，避免进入手势登录页
      localStorage.removeItem("loginNo", this.loginNo);
      removeItem("loginInfo");
      // removeItem('loginNo')
      removeItem("userPwd");

      this.$router.push("/login");
      // 清空路由缓存
      this.$store.commit("changeKeepPages", "index");
    },
    async getPhoneNumber() {
      let data = await GetPhoneNumberApi(JSON.stringify({}));
      console.log("手机号", data);
      this.mobileNumber = data.mobileNumber;
    },
    // 消息推送
    async setPushStatus() {
      let param = this.checked ? 0 : 1;
      let data = await GetPushStatusApi(JSON.stringify({ status: param }));
      data.operationSuccessFlag
        ? this.$toast.success(data.successMessage)
        : this.$toast.fail(data.errorMessage);
    },
    // 意见反馈
    async contentBalk() {
      if (this.contents == "") return this.$toast("请输入意见反馈内容");
      let params = {
        contents: this.contents, // 内容
        mobileName: "", // 手机名称
        mobileSysName: this.userInfo.appName, // 手机系统版本名称
      };
      let data = await SendFeedBackApi(JSON.stringify(params));
      data.operationSuccessFlag
        ? this.$toast.success(data.successMessage)
        : this.$toast.fail(data.errorMessage);
      this.showMess = false;
    },
    // 检查版本
    async checkVersion() {
      let data = await CheckVersionApi(JSON.stringify({}));
      console.log("版本", data);
      // data.operationSuccessFlag ? this.$toast.success(data.successMessage) : this.$toast.fail(data.errorMessage)
      this.curtVersion = data.curtVersion;
    },
  },
  activated() {
    console.log(this.$router);
    console.log(this.$route);
    this.checked = getItem("loginInfo").pushStatus == 0 ? true : false;
    this.userName = getItem("loginInfo").userName; // 登录人姓名
    this.loginNo = getItem("loginInfo").loginNo; // 登录账号
    this.usersList = getItem("loginInfo").userIds; // 所有用户信息
    var list = JSON.parse(localStorage.getItem("loginTypeCode") || "[]");
    var type = 0;
    var value = "";
    if (list?.length > 0) {
      list.forEach((e) => {
        if (e.loginNo == this.loginNo) {
          type = e.typeCode;
        }
      });
    }
    if (type == 1) {
      value = "已启用手势登录";
    } else if (type == 2) {
      value = "已启用指纹登录";
    } else {
      value = "未启用";
    }
    this.quickLoginType = value;
  },
};
</script>

<style scoped lang="less">
.top {
  height: 283px;
  background-image: url("@/assets/images/common/my-top.png");
  background-size: cover;
  background-position: center;
  .title {
    display: flex;
    justify-content: space-between;
    color: #fff;
    padding: 13px;
    padding-top: 40px;
    box-sizing: border-box;
    margin-bottom: 20px;
    div {
      font-size: 17px;
      font-weight: 500;
    }
  }
  .avatar {
    width: 64px;
    line-height: 64px;
    border-radius: 32px;
    // border: 3px solid rgba(255, 255, 255, 0.2);
    background: #ffffff;
    font-size: 32px;
    font-weight: bold;
    color: #03449a;
    margin: auto;
    margin-bottom: 8px;
  }
  .info {
    color: #fff;
    font-size: 14px;
    margin: auto;
    .username {
      font-size: 16px;
      font-weight: 500;
      margin-top: 5px;
    }
    .count {
      margin-top: 3px;
    }
  }
}
::v-deep .van-cell {
  line-height: 30px;
  &::after {
    border: none;
  }
}
.mess-title {
  font-size: 18px;
  font-weight: 600;
  margin: 10px auto;
}
.mess-input {
  margin-bottom: 8px;
  ::v-deep.van-field__label {
    width: 5.2em;
  }
}
::v-deep .van-button--block {
  width: 80%;
  margin: auto;
  border-radius: 15px;
}
::v-deep .van-popup {
  width: 80%;
  padding: 12px;
}
::v-deep .van-cell__title {
  text-align: left;
}
img {
  width: 24px;
  height: 24px;
}
</style>