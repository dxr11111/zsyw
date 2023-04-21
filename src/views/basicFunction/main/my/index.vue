<template>
  <div class="bgc">
    <div>
      <div class="topWrap">
        <div class="top">
          <div class="title">
            <!-- <van-icon name="arrow-left" /> -->
            <div>个人中心</div>
            <!-- <van-icon name="search" /> -->
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
        <!--    <van-cell is-link>
        <template #title>
          <img src="./images/update-version.png" alt="" />
          <span class="custom-title">检查客户端版本</span>
        </template>
      </van-cell> -->
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
        <van-cell is-link @click="feedBackFn()">
          <template #title>
            <img src="./images/feedback.png" alt="" />
            <span class="custom-title">意见反馈</span>
          </template>
        </van-cell>
        <van-cell is-link :value="curtVersion" @click="checkUpdates">
          <template #title>
            <img src="./images/software-version.png" alt="" />
            <span class="custom-title">检查更新</span>
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
          rows="4"
          autosize
          v-model="contents"
          type="textarea"
          label="意见内容："
          placeholder="请输入意见内容（至少10个字）"
        />
        <p class="describe">
          如果您对APP的使用有任何意见或建议，可以通过该渠道进行反馈，将由专人对反馈内容进行梳理，并上报至相关部门
        </p>
        <van-button block type="info" @click="contentBalk">确认</van-button>
      </van-popup>
    </div>
  </div>
</template>

<script>
import { getItem, removeItem } from "@/utils/public/sessionStorage";
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive";
import { version } from "@/utils/public/uniformConfig";
import { checkUpdates } from "@/utils/public/checkUpdatesVersion";
import {
  GetPushStatusApi,
  SendFeedBackApi,
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
      curtVersion: "V" + version, // 当前版本
      quickLoginType: "",
      mobileNumber: "", // 手机号
      loginType: JSON.parse(localStorage.getItem("loginType")) || [], // 所有账号的快捷登录设置
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
    this.getPhoneNumber();
  },
  methods: {
    // 点击意见反馈
    feedBackFn() {
      this.showMess = true;
      this.contents = "";
    },

    // 点击检查更新
    checkUpdates() {
      checkUpdates();
    },

    // 退出登录
    async logout() {
      await LogoutApi(JSON.stringify({}));
      // console.log(data);
      // 退出账号时，清空当前账号的手势密码及快捷标识
      localStorage.removeItem("loginType");
      // 从这里退出需要移除账号，避免进入手势登录页
      localStorage.removeItem("loginNo");
      removeItem("loginInfo");
      // removeItem('loginNo')
      removeItem("userPwd");

      this.$router.push("/login");
      // 清空路由缓存
      this.$store.commit("changeKeepPages", "index");
      // 清空公告id
      this.$store.commit("home/changeLastNoticeId", -1);
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
      if (this.contents.length < 10)
        return this.$toast("请输入意见反馈内容至少10个字");

      let params = {
        contents: this.contents, // 内容
        mobileName: plus.device.model || "", // 手机名称
        // mobileSysName: this.userInfo.appName, // 手机系统版本名称
        mobileSysName: plus.os.version || "", // 手机系统版本名称
      };
      console.log("意见反馈参数", params);

      let result = await SendFeedBackApi(JSON.stringify(params));
      this.apiResponse(result, "#app", () => {
        this.showMess = false;
      });
    },
  },
  activated() {
    console.log(this.$router);
    console.log(this.$route);
    this.checked = getItem("loginInfo").pushStatus == 0 ? true : false;
    this.userName = getItem("loginInfo").userName; // 登录人姓名
    this.loginNo = getItem("loginInfo").loginNo; // 登录账号
    this.usersList = getItem("loginInfo").userIds; // 所有用户信息
    var list = JSON.parse(localStorage.getItem("loginType")) || [];
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
.topWrap {
  height: 283px;
  .top {
    z-index: 100;
    position: fixed;
    top: 0;
    width: 100%;
    height: 283px;
    background-image: url("@/assets/images/common/my-top.png");
    background-size: cover;
    background-position: center;
    .title {
      display: flex;
      justify-content: center;
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
  padding: 0px;
  margin-bottom: 12px;
  font-size: 14px;
  /deep/.van-cell__title {
    flex: 1;
    margin-right: 0;
  }
  /deep/.van-cell__value {
    flex: 3;
    padding: 0 4px;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
  }
}
.describe {
  margin-bottom: 10px;
  font-size: 12px;
  text-align: left;
  color: red;
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
  .custom-title {
    vertical-align: middle;
  }
}
img {
  width: 24px;
  height: 24px;
}
</style>