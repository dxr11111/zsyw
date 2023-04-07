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
        <van-cell is-link @click="showMess = true">
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
  </div>
</template>

<script>
import { getItem, removeItem } from "@/utils/public/sessionStorage";
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive";
import { version } from "@/utils/public/uniformConfig";

import {
  GetPushStatusApi,
  SendFeedBackApi,
  LogoutApi,
  GetPhoneNumberApi,
  reqCheckVersion,
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
    this.getPhoneNumber();
    console.log("登录类型信息", localStorage.getItem("loginTypeCode"));
    console.log("登录人信息", this.loginNo, this.userName);
  },
  methods: {
    // 点击检查更新
    async checkUpdates() {
      let curtVersion = "1.1.1";
      // 比较当前版本和后台返回的版本
      const flag = this.compareVersion(version, curtVersion);
      if (flag) {
        // 当前版本大
        // curtVersion<=手机当前版本，则表示最新版无需更新，这时弹个提示框，内容为“您当前的版本是最新版”，点击确定，关闭提示框。
        this.$store.commit("changeCheckUpdatesPop", {
          popShow: true,
          isNeedUpdate: false,
        });
      } else {
        // 后台返回版本大
        // curtVersion>手机当前版本，则表示有新版本可更新，需要展示content内容，并且再次判断minVersion:
        // 1.如果minVersion<=手机当前版本，则表示符合最低版本要求，content内容下显示2个按钮，分别是“稍后更新” 和 “立即更新”；
        // 2.如果minVersion>手机当前版本，则表示不符合最低版本要求，content内容下只显示1个按钮，是 “立即更新”。
        this.$store.commit("changeCheckUpdatesPop", {
          popShow: true,
          isNeedUpdate: true,
          version: "1.0.1",
          content:
            "1、修改工单操作后闪退问题\n2、优化手势登录问题\n3、修改使用老云入户问题\n4、登录页“更多”增加综合监控，资源核查入口\n5、更新版本时，可以到每次的更新内容说明\n6、增加非公客工单的故障单工单、任务处理模块，允许IFM系统用户登录并操作\n7、装机外线环节增加沃家产品设备回填功能\n8、设备领用，增加对沃家产品设备的领用\n9、领用记录，增加对沃家产品设备的记录查询\n10、转让记录，新增转让记录功能，审核转记录\n11、新增装机和修机的设备评价功能\n",
        });
      }

      return;
      let result = await reqCheckVersion(JSON.stringify({}));
      this.apiResponse(result, "#app", () => {
        // 成功
        // curtVersion<=手机当前版本，则表示最新版无需更新，这时弹个提示框，内容为“您当前的版本是最新版”，点击确定，关闭提示框。
      });
    },
    // 比较版本 当前版本，后台返回版本
    compareVersion(curV, reqV) {
      var arr1 = curV.toString().split(".");
      var arr2 = reqV.toString().split("."); //将两个版本号拆成数字

      var minL = Math.min(arr1.length, arr2.length);
      var pos = 0; //当前比较位
      var diff = 0; //当前为位比较是否相等
      var flag = false; //逐个比较如果当前位相等则继续比较下一位

      while (pos < minL) {
        diff = parseInt(arr1[pos]) - parseInt(arr2[pos]);
        if (diff == 0) {
          pos++;
          continue;
        } else if (diff > 0) {
          flag = true;
          break;
        } else {
          flag = false;
          break;
        }
      }
      return flag;
    },

    // 退出登录
    async logout() {
      await LogoutApi(JSON.stringify({}));
      // console.log(data);
      // 退出账号时，清空当前账号的密码及快捷标识
      this.loginTypeCode.forEach((e) => {
        if (e.loginNo == this.loginNo) {
          e.typeCode = 0;
        }
      });
      this.getPassData.forEach((e) => {
        if (e.loginNo == this.loginNo) {
          e.gestPassword = [];
        }
      });
      localStorage.setItem("loginTypeCode", JSON.stringify(this.loginTypeCode));
      localStorage.setItem("gestPassword", JSON.stringify(this.getPassData));
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
  .custom-title {
    vertical-align: middle;
  }
}
img {
  width: 24px;
  height: 24px;
}
</style>