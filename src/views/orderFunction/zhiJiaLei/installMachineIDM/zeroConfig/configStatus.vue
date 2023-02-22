<template>
  <!-- 显示配置过程状态 -->
  <div class="configStatus">
    <div class="header" ref="header">
      <MyHeader
        left="arrow-left"
        right="replay"
        @goBackEv="goBackFn"
        @rightEv="refreshFn"
      />
      <!-- 零配置工单号 + MAC地址 -->
      <div class="headName" :style="{ marginTop: headTextMargin }">
        <p>零配置({{ $route.query.orderNum }})</p>
        <p v-if="zeroConfigQueryMac">({{ zeroConfigQueryMac }})</p>
      </div>
      <!-- 环节 状态 标头 -->
      <div class="thead">
        <div class="link">环节</div>
        <div class="status">状态</div>
      </div>
    </div>
    <div
      class="main"
      v-if="bottomStage !== 2"
      :style="{ paddingTop: mainPadding }"
    >
      <div class="row" v-for="(item, index) in infoList" :key="index">
        <div class="link">
          <div class="typeName">
            <span>{{ item.zeroconfigTypeName }}</span>
          </div>
          <div class="linkRegion">
            <!-- 图标 -->
            <van-icon
              name="orders-o"
              v-if="item.failDealDesc"
              @click="clickIcon(item)"
            />
            <!-- 文字 -->
            <div class="stageContent">
              <!-- 零配置环节名称 -->
              <p class="stageName">{{ item.zeroconfigStageName }}</p>
              <!-- 零配置备注 -->
              <p
                class="result"
                v-if="
                  item.zeroconfigStatus === 6 ||
                  item.zeroconfigStatus === 10 ||
                  item.zeroconfigStatus === 11 ||
                  item.zeroconfigStatus === 13 ||
                  item.zeroconfigStatus === 15
                "
              >
                {{ item.zeroconfigResult }}
              </p>
            </div>
          </div>
        </div>
        <div class="status">
          <!-- 显示按钮 zeroconfigStatus=6 -->
          <template
            v-if="
              item.zeroconfigStatus === 6 ||
              item.zeroconfigStatus === 10 ||
              item.zeroconfigStatus === 11 ||
              item.zeroconfigStatus === 13 ||
              item.zeroconfigStatus === 15
            "
          >
            <van-button
              type="info"
              v-for="(btn, index) in item.buttonKeys"
              :key="index"
              @click="clickbuttonKey(btn, item)"
              >{{ btn.name }}</van-button
            >
          </template>
          <!-- 显示文字 -->
          <div v-else class="text">
            <template
              v-if="item.zeroconfigStatus == 1 || item.zeroconfigStatus == 2"
            >
              <span class="logo">
                <i class="iconfont icon-xiangyou"></i>
              </span>

              <span class="statusName"
                >&nbsp;{{ item.zeroconfigStatusName }}&nbsp;</span
              >
              <span class="lastTime">{{ item.lastTimeStr }}</span>
            </template>
            <template v-else-if="item.zeroconfigStatus == 5">
              <span class="logo">
                <i class="iconfont icon-icon_duihao-mian"></i>
              </span>
              <span class="statusName"
                >&nbsp;{{ item.zeroconfigStatusName }}&nbsp;</span
              >
            </template>
          </div>
        </div>
      </div>
    </div>
    <!-- 页面底部按钮 -->
    <template v-if="bottomStage === -1 || bottomStage === 4">
      <!-- 清除数据成功，请重新零配置 -->
      <p v-if="bottomStage === 4" class="clearDataSuccess">
        <i class="iconfont icon-icon_duihao-mian"></i>清除数据成功，请重新零配置
      </p>
      <div class="bottom">
        <!-- 显示自动刷新 -->
        <div class="refresh">
          <van-radio-group v-model="isAutoRefresh">
            <van-radio name="1" shape="square" @click="clickIsRefresh('1')"
              >自动刷新({{ refreshCounDown }})</van-radio
            >
          </van-radio-group>
        </div>
        <div class="afresh">
          <van-button type="info" @click="resetZeroConfig"
            >重新零配置</van-button
          >
        </div>
      </div>
    </template>

    <!-- 显示零配置成功 -->
    <template v-if="bottomStage === 0">
      <div class="bottom">
        <div class="configSuccess">
          <p><i class="iconfont icon-icon_duihao-mian"></i>零配置成功</p>
          <van-button type="info" @click="resetZeroConfig"
            >重新零配置</van-button
          >
        </div>
      </div>
    </template>
    <!-- 显示拆机成功 -->
    <template v-if="bottomStage === 3">
      <div class="teardowmSuccess">
        <div class="success">
          <p><i class="iconfont icon-icon_duihao-mian"></i>拆机成功</p>
          <van-button type="info" @click="resetZeroConfig"
            >重新零配置</van-button
          >
        </div>
        <!--         <div class="refresh">
          <van-radio-group v-model="isAutoRefresh">
            <van-radio name="1" shape="square" @click="clickIsRefresh('1')"
              >自动刷新({{ refreshCounDown }})</van-radio
            >
          </van-radio-group>
        </div> -->
      </div>
    </template>

    <!-- 环节执行失败弹出层 -->
    <van-popup
      v-model="linkFailShow"
      get-container=".configStatus"
      class="linkFailPop"
    >
      <div class="title">
        <div class="failLogo">
          <van-icon name="close" />
        </div>
        <div class="failText">
          <p>执行失败</p>
          <p>{{ linkFailPopText.zeroconfigStageName }}，如何处理？</p>
        </div>
      </div>
      <div class="content">
        <p>
          {{ linkFailPopText.failDealDesc }}{{ linkFailPopText.phoneNumber }}
        </p>
      </div>
      <div class="footer" @click="linkFailShow = false">
        <p>我知道了</p>
      </div>
    </van-popup>
    <!-- 点击状态下的按钮 弹出层 -->
    <template>
      <!-- 继续施工弹出层 -->
      <van-popup
        v-model="continueWork.popShow"
        get-container=".configStatus"
        class="continueWorkPop"
      >
        <div class="title">
          <p>继续施工</p>
        </div>
        <div class="content">
          <!-- 原因 -->
          <van-field
            label="原因"
            :value="continueWork.backResonInfo"
            @click="continueWork.reasonShow = true"
            is-link
            arrow-direction="down"
            readonly
            class="reason"
          />
          <van-action-sheet
            v-model="continueWork.reasonShow"
            :actions="continueWork.reasonActions"
            cancel-text="取消"
            close-on-click-action
            get-container=".configStatus"
            @select="selectContinueWorkReason"
          />
          <!-- 描述 -->
          <van-field
            label="描述"
            v-model="continueWork.receiptDesc"
            placeholder="请输入描述"
            class="desc"
          />
        </div>
        <div class="buttonRegion">
          <van-button type="info" @click="cancelContinueWork">取消</van-button>
          <van-button type="info" @click="submitContinueWork">确定</van-button>
        </div>
      </van-popup>
      <!-- 点击确认新装-身份确认弹出层 -->
      <van-popup
        v-model="newInstall.popShow"
        get-container=".configStatus"
        class="newInstallPop"
      >
        <div class="title">
          <p>身份确认</p>
        </div>
        <div class="warning">
          <p>
            警告：清除业务数据会将该设备上所有的资源数据清理，请确认该设备没有承载用户信息，清理后将无法恢复！请谨慎操作。（设备数据清理后，可当作新设备继续使用）
          </p>
        </div>
        <div class="tips">
          <p>请输入掌上运维登录账号，请输入掌上运维登录密码</p>
        </div>
        <van-cell-group>
          <van-field v-model="newInstall.username" placeholder="请输入账号" />
          <van-field
            v-model="newInstall.password"
            placeholder="请输入密码"
            type="password"
          />
        </van-cell-group>
        <div class="buttonRegion">
          <van-button type="info" @click="newInstall.popShow = false"
            >取消</van-button
          >
          <van-button type="info" @click="confirmNewInstall">确认</van-button>
        </div>
      </van-popup>
      <!-- 驳回弹出层 -->
      <van-popup
        v-model="reject.popShow"
        get-container=".configStatus"
        class="rejectPop"
      >
        <van-field
          v-model="reject.intro"
          autosize
          type="textarea"
          placeholder="请输入驳回说明"
        />
        <van-button type="info" block @click="submitReject"
          >提交驳回</van-button
        >
      </van-popup>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getItem } from "@/utils/public/sessionStorage";
import {
  reqIomNewZeroConfigQueryProgress,
  reqIomNewZeroConfigGoOnWroking,
  reqIomNewLpRetry,
  reqIomNewZeroConfigAgain,
  reqIomNewZeroConfigTurnPerson,
  reqIomNewDeleteData,
  reqIomNewZeroConfigReject,
  reqIomNewAddInstall,
  reqIomNewChangePhyNo,
} from "@/http/button";
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive";

export default {
  name: "ConfigStatus",
  mixins: [keepAliveMixin],

  data() {
    return {
      headName: `零配置(${this.$route.query.orderNum})`,
      headTextMargin: "",
      mainPadding: "87px",
      zeroConfigQueryMac: "", // 零配置前查询mac地址
      bottomStage: -1, // 底部环节 0：零配置成功 2：清空列表 3：拆机成功
      isAutoRefresh: "1", // 自动刷新
      oldRadio: "0", // 上一次选中的值
      infoList: {}, // 零配置进度信息
      refreshCounDown: 10, // 刷新10秒倒计时
      timer: null, // 计时器
      linkFailShow: false, // 环节点击图标弹出层
      linkFailPopText: {
        zeroconfigStageName: "",
        failDealDesc: "",
        phoneNumber: "",
      },
      // 点击状态下的按钮弹出层
      // 当前点击按钮的列表信息
      currentInfo: {},
      // 继续施工
      continueWork: {
        popShow: false,
        backResonInfo: "其他", // 原因
        backResonId: "0", // 原因编码
        receiptDesc: "", // 描述
        reasonShow: false,
        reasonActions: [
          {
            name: "其他",
          },
        ],
      },
      // 确认新装-身份确认
      newInstall: {
        popShow: false,
        username: "",
        password: "",
      },
      // 驳回-提交
      reject: {
        popShow: false,
        intro: "",
      },
    };
  },
  computed: {
    ...mapState("zeroConfig", ["zeroConfigQueryInfo"]),
  },
  methods: {
    // 回退
    goBackFn() {
      this.$router.go(-1);
    },
    // 点击自动刷新
    clickIsRefresh(val) {
      if (val === this.oldRadio) {
        // 取消选中
        this.isAutoRefresh = "0";
        this.oldRadio = "0";
        // 关闭自动刷新
        this.refreshCounDown = 10;
      } else {
        this.oldRadio = val;
        // 设置自动刷新
        clearInterval(this.timer); // 清除定时器
        this.countDownTimer();
      }
    },
    // 刷新 → 零配置进度查询
    async refreshFn() {
      // 零配置查询进度
      let result = await reqIomNewZeroConfigQueryProgress(
        JSON.stringify({ id: parseInt(this.$route.query.id) })
      );
      console.log("零配置查询进度", result);
      this.refreshCounDown = 10; // 重置刷新秒数
      this.apiResponse(result, ".configStatus", () => {
        // 获取mac地址
        this.zeroConfigQueryMac = result.mac;
        // 更新页面
        this.processInfoList(result.zeroConfigInfoList);
        // 更新底部配置
        this.getBottomStage(result.zeroConfigInfoList);
      });
    },
    // 倒计时
    countDownTimer() {
      this.timer = setInterval(() => {
        if (this.refreshCounDown > 0 && this.isAutoRefresh === "1") {
          this.refreshCounDown -= 1;
          console.log(this.refreshCounDown);
          if (this.refreshCounDown === 0) {
            // 开启刷新 → 零配置进度查询
            this.refreshFn();
          }
        }
      }, 1000);
    },
    // 获取零配置进度信息
    getZeroConfigInfoList() {
      let infoList = this.zeroConfigQueryInfo.zeroConfigInfoList;
      // 获取mac地址
      this.zeroConfigQueryMac = this.zeroConfigQueryInfo.mac;
      // 处理获取的信息
      this.processInfoList(infoList);
    },
    // 处理获取的零配置进度信息
    processInfoList(infoList) {
      // 判断 zeroconfigStage 将值为 0,1,2,3的集合过滤掉
      let arr = [0, 1, 2, 3];
      infoList = infoList.filter((element) => {
        if (!arr.includes(element.zeroconfigStage)) {
          return element;
        }
      });
      // 将zeroconfigStatus=6的 按钮英文替换成中文
      let buttonList = [
        { name: "继续施工", key: "goOnWorking" },
        { name: "重新零配置", key: "changeDev" },
        { name: "退单", key: "returnIP" },
        { name: "驳回", key: "reject" },
        { name: "退单", key: "return" },
        { name: "光猫入网重试", key: "netinAgain" },
        { name: "重试", key: "again" },
        { name: "转人工", key: "turnPerson" },
        { name: "确认新装", key: "newInstall" },
        { name: "加装", key: "addInstall" },
        { name: "确认已断电", key: "confirm" },
        { name: "更改物理号", key: "changePhyNo" },
      ];
      infoList.forEach((item) => {
        if (
          item.zeroconfigStatus === 6 ||
          item.zeroconfigStatus === 10 ||
          item.zeroconfigStatus === 11 ||
          item.zeroconfigStatus === 13 ||
          item.zeroconfigStatus === 15
        ) {
          // 新增中文
          let newButtonKeys = [];
          item.buttonKeys.forEach((btnKey) => {
            buttonList.forEach((btnItem) => {
              if (btnItem.key === btnKey) {
                newButtonKeys.push(btnItem);
              }
            });
          });
          if (newButtonKeys.length > 0) {
            item.buttonKeys = newButtonKeys; // buttonKeys重新赋值
          }
        }
      });
      this.infoList = infoList;
    },
    // 点击重新零配置
    resetZeroConfig() {
      // 弹出提示
      this.$dialog
        .confirm({
          message: "当前零配置未完成，重新零配置将注销原有数据，是否继续？",
          confirmButtonText: "继续",
          className: "myDialog",
          getContainer: ".configStatus",
        })
        .then(() => {
          // on confirm
          // 跳转到零配置页面
          this.$router.push({
            name: "NotConfig",
            query: {
              orderNum: this.$route.query.orderNum,
              id: this.$route.query.id,
            },
          });
          // this.$router.go(-1)
        })
        .catch(() => {
          // on cancel
        });
    },
    // 点击环节内的图标
    clickIcon(item) {
      this.linkFailShow = true;
      this.linkFailPopText.zeroconfigStageName = item.zeroconfigStageName;
      this.linkFailPopText.failDealDesc = item.failDealDesc;
      this.linkFailPopText.phoneNumber = item.phoneNumber;
    },
    // 点击状态下的按钮
    async clickbuttonKey(btn, info) {
      let id = parseInt(this.$route.query.id);
      let sheetNo = info.sheetNo;
      let taskNo = info.taskNo;
      let zeroconfigStage = info.zeroconfigStage;
      let zeroconfigStageName = info.zeroconfigStageName;
      switch (btn.key) {
        case "goOnWorking":
          // 继续施工
          // 跳出弹出框continueWorkPop
          this.continueWork.popShow = true;
          this.currentInfo = info;
          break;
        case "changeDev":
          // 重新零配置
          this.resetZeroConfig();
          break;
        case "returnIP":
          // 退单
          this.$dialog
            .confirm({
              message: `${info.zeroconfigStageName}环节，是否确定退单`,
              className: "myDialog",
              getContainer: ".configStatus",
            })
            .then(() => {
              // on confirm
              // returnIp的退单原因为 "此宽带地址暂不支持办理宽带固定IP产品"
              // 跳转到零配置页面
              this.$router.push({
                name: "ReturnSheet",
                query: {
                  orderNum: this.$route.query.orderNum,
                  id,
                  buttonKey: "returnIP",
                },
              });
            })
            .catch(() => {
              // on cancel
            });
          break;
        case "reject":
          // 驳回
          // 显示驳回弹出框
          this.reject.popShow = true;
          // 获取当前按钮的info
          this.currentInfo = info;
          break;
        case "return":
          // 退单
          this.$dialog
            .confirm({
              message: `${info.zeroconfigStageName}环节，是否确定退单`,
              className: "myDialog",
              getContainer: ".configStatus",
            })
            .then(() => {
              // on confirm
              // 跳转到零配置页面
              this.$router.push({
                name: "ReturnSheet",
                query: {
                  orderNum: this.$route.query.orderNum,
                  id,
                  buttonKey: "return",
                },
              });
            })
            .catch(() => {
              // on cancel
            });
          break;
        case "netinAgain":
          // 光猫入网重试
          let lpRetry = await reqIomNewLpRetry(JSON.stringify({ id }));
          console.log("光猫入网重试结果", lpRetry);
          if (lpRetry.operationSuccessFlag) {
            this.$toast(lpRetry.successMessage);
          } else {
            this.$toast({
              message: lpRetry.errorMessage,
            });
          }

          break;
        case "again":
          // 重试
          this.$dialog
            .confirm({
              message: "分配设备端口资源环节，是否确定重试？",
              className: "myDialog",
              getContainer: ".configStatus",
            })
            .then(async () => {
              // 发送请求
              let again = await reqIomNewZeroConfigAgain(
                JSON.stringify({
                  id,
                  sheetNo,
                  taskNo,
                  zeroconfigStage,
                  zeroconfigStageName,
                })
              );
              console.log("重试结果", again);
              if (again.operationSuccessFlag) {
                this.$toast(again.successMessage);
              } else {
                this.$toast({
                  message: again.errorMessage,
                });
              }
            })
            .catch(() => {
              // cancel
            });

          break;
        case "turnPerson":
          // 转人工
          this.$dialog
            .confirm({
              message: "分配设备端口资源环节，是否确定转人工？",
              className: "myDialog",
              getContainer: ".configStatus",
            })
            .then(async () => {
              // 发送请求
              let turnPerson = await reqIomNewZeroConfigTurnPerson(
                JSON.stringify({
                  id,
                  sheetNo,
                  taskNo,
                  zeroconfigStage,
                  zeroconfigStageName,
                })
              );
              console.log("重试结果", turnPerson);
              if (turnPerson.operationSuccessFlag) {
                this.$toast(turnPerson.successMessage);
              } else {
                this.$toast({
                  message: turnPerson.errorMessage,
                });
              }
            })
            .catch(() => {
              // cancel
            });
          break;
        case "newInstall":
          // 确认新装
          this.$dialog
            .confirm({
              title: "确认新装",
              message: "零配置备注\n请再次确认以上用户及设备信息无人使用。",
              className: "myDialog",
              getContainer: ".configStatus",
            })
            .then(() => {
              this.$dialog
                .confirm({
                  title: "确认清除",
                  message: "当前设备将被初始化，确认清除该设备上的数据？",
                  className: "myDialog",
                  getContainer: ".configStatus",
                })
                .then(() => {
                  // 显示身份确认弹出框
                  this.newInstall.popShow = true;
                  // 获取当前按钮的info
                  this.currentInfo = info;
                });
            })
            .catch(() => {
              // cancel
            });
          break;
        case "addInstall":
          // 加装
          this.$dialog
            .confirm({
              title: "加装",
              message: info.zeroconfigResult,
              className: "myDialog",
              getContainer: ".configStatus",
            })
            .then(async () => {
              // 发送加装的接口
              let baseNo = info.baseNo;
              let addInstallResult = await reqIomNewAddInstall(
                JSON.stringify({ id, baseNo, zeroconfigStageName })
              );
              console.log("确认新装-清除数据结果", addInstallResult);
              if (addInstallResult.operationSuccessFlag) {
                this.$toast(addInstallResult.successMessage);
              } else {
                this.$toast({
                  message: addInstallResult.errorMessage,
                });
              }
            })
            .catch(() => {
              // cancel
            });
          break;
        case "confirm":
          // 确认已断电
          this.$dialog
            .confirm({
              title: "确认已断电",
              message:
                "新装设备入网超过30分钟，需拆除重新入网，清除设备前请把ONU设备断电，确认已断电？",
              className: "myDialog",
              getContainer: ".configStatus",
            })
            .then(async () => {
              // 发送清除业务数据的接口
              let confirmResult = await reqIomNewDeleteData(
                JSON.stringify({ id, sheetNo, taskNo, zeroconfigStageName })
              );
              console.log("确认新装-清除数据结果", confirmResult);
              if (confirmResult.operationSuccessFlag) {
                this.$toast(confirmResult.successMessage);
              } else {
                this.$toast({
                  message: confirmResult.errorMessage,
                });
              }
            })
            .catch(() => {
              // cancel
            });
          break;
        case "changePhyNo":
          // 更改物理号
          this.$dialog
            .confirm({
              message: `${info.zeroconfigStageName}环节，是否确定更改物理号`,
              className: "myDialog",
              getContainer: ".configStatus",
            })
            .then(async () => {
              // 发送更改物理号的接口
              let changePhyNoResult = await reqIomNewChangePhyNo(
                JSON.stringify({ id, sheetNo, zeroconfigStageName })
              );
              console.log("更改物理号结果", changePhyNoResult);
              if (changePhyNoResult.operationSuccessFlag) {
                this.$toast(changePhyNoResult.successMessage);
              } else {
                this.$toast({
                  message: changePhyNoResult.errorMessage,
                });
              }
            })
            .catch(() => {
              // cancel
            });
          break;
      }
    },
    // 选择继续施工原因
    selectContinueWorkReason(action) {
      this.continueWork.backResonInfo = action.name;
    },
    // 取消继续施工提交
    cancelContinueWork() {
      this.continueWork.popShow = false;
      this.continueWork.receiptDesc = "";
    },
    // 提交继续施工接口
    async submitContinueWork() {
      let id = parseInt(this.$route.query.id);
      let sheetNo = this.currentInfo.sheetNo;
      let taskNo = this.currentInfo.taskNo;
      let zeroconfigStage = this.currentInfo.zeroconfigStage;
      let zeroconfigStageName = this.currentInfo.zeroconfigStageName;
      let backResonId = this.continueWork.backResonId;
      let backResonInfo = this.continueWork.backResonInfo;
      let receiptDesc = this.continueWork.receiptDesc;
      if (receiptDesc.length === 0) {
        return this.$toast("请输入描述");
      }
      // 提交接口
      let postData = {
        id,
        sheetNo,
        taskNo,
        zeroconfigStage,
        zeroconfigStageName,
        backResonId,
        backResonInfo,
        receiptDesc,
      };
      let result = await reqIomNewZeroConfigGoOnWroking(
        JSON.stringify(postData)
      );
      console.log("继续施工接口结果", result);
      if (result.operationSuccessFlag) {
        this.$toast(result.successMessage);
      } else {
        this.$toast({
          message: result.errorMessage,
        });
      }
    },
    // 确认新装-身份验证
    async confirmNewInstall() {
      if (this.newInstall.username === "") {
        return this.$toast("请输入账号");
      } else if (this.newInstall.password === "") {
        return this.$toast("请输入密码");
      }
      // 判断账号密码是否正确
      let loginNo = getItem("loginNo");
      let userPwd = getItem("userPwd");
      if (
        this.newInstall.username !== loginNo ||
        this.newInstall.password !== userPwd
      ) {
        return this.$toast("账号或密码错误，请重试");
      }
      // 发送请求
      // 关闭弹出层
      this.newInstall.popShow = false;
      let id = parseInt(this.$route.query.id);
      let sheetNo = this.currentInfo.sheetNo;
      let taskNo = this.currentInfo.taskNo;
      let zeroconfigStageName = this.currentInfo.zeroconfigStageName;
      let result = await reqIomNewDeleteData(
        JSON.stringify({ id, sheetNo, taskNo, zeroconfigStageName })
      );
      console.log("确认新装-清除数据结果", result);
      if (result.operationSuccessFlag) {
        this.$toast(result.successMessage);
      } else {
        this.$toast({
          message: result.errorMessage,
        });
      }
    },
    // 驳回-提交驳回
    async submitReject() {
      // 关闭弹出层
      this.reject.popShow = false;
      // 发送请求
      let id = parseInt(this.$route.query.id);
      let sheetNo = this.currentInfo.sheetNo;
      let intro = this.reject.intro;
      let zeroconfigStageName = this.currentInfo.zeroconfigStageName;
      let result = await reqIomNewZeroConfigReject(
        JSON.stringify({ id, sheetNo, intro, zeroconfigStageName })
      );
      console.log("驳回-提交驳回结果", result);
      if (result.operationSuccessFlag) {
        this.$toast(result.successMessage);
      } else {
        this.$toast({
          message: result.errorMessage,
        });
      }
    },
    // 判断底部配置页面
    getBottomStage(infoList) {
      infoList.forEach((item) => {
        if (item.zeroconfigStage === 0) {
          // 零配置成功
          this.isAutoRefresh = "0";
          return (this.bottomStage = 0);
        }
        if (item.zeroconfigStage === 4) {
          // 清除数据成功，请重新零配置
          return (this.bottomStage = 4);
        }
        if (item.zeroconfigStage === 3) {
          return (this.bottomStage = 3);
        }
      });
    },
  },
  created() {
    // 获取头部尺寸
    if (localStorage.getItem("Addhead") == "true") {
      this.headTextMargin = "30px";
    }
    // 获取零配置进度信息
    this.getZeroConfigInfoList();
    // 判断底部配置页面
    this.getBottomStage(this.zeroConfigQueryInfo.zeroConfigInfoList);
  },
  mounted() {
    // 获取固定顶部位置高度
    if (this.$refs.header.clientHeight > 0) {
      this.mainPadding = this.$refs.header.clientHeight + "px";
    }
  },
  beforeDestroy() {
    // 清除定时器
    clearInterval(this.timer);
  },
  beforeRouteLeave(to, from, next) {
    // 离开页面时 → 关闭刷新倒计时
    clearInterval(this.timer); // 清除定时器
    next();
  },
  activated() {
    // 开启倒计时
    if (this.isAutoRefresh == "1") {
      this.countDownTimer();
    }
  },
};
</script>

<style scoped lang="less">
@theme-color: #1989fa;
.configStatus {
  .header {
    z-index: 1;
    position: fixed;
    width: 100%;
    .headName {
      z-index: 100;
      position: fixed;
      width: 70%;
      height: 48px;
      left: 50%;
      transform: translateX(-50%);
      top: 0px;
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .thead {
      display: flex;
      background-color: #f3f4f5;
      border-bottom: 1px solid #e0e0e0;
      .link,
      .status {
        padding: 10px 0;
      }
      .link {
        width: 65%;
        border-right: 1px solid #e0e0e0;
      }
      .status {
        width: 35%;
      }
    }
  }

  .main {
    padding-top: 119px; //87px;
    padding-bottom: 92px;
    .row {
      display: flex;
      // align-items: center;
      font-size: 14px;
      border-bottom: 1px solid #e0e0e0;
      .link {
        display: flex;
        // align-items: center;
        width: 65%;
        .typeName {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .linkRegion {
          flex: 3;
          display: flex;
          align-items: center;
          padding: 10px 5px;
          border-left: 1px solid #e0e0e0;
          border-right: 1px solid #e0e0e0;
          .van-icon {
            margin: 5px;
            font-size: 20px;
          }
          .stageContent {
            text-align: left;
            .result {
              color: red;
              font-size: 13px;
            }
          }
        }
      }
      .status {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        width: 35%;
        .text {
          display: flex;
          align-items: center;
          .statusName {
            font-size: 16px;
            font-weight: 500;
          }
          .lastTime {
            color: grey;
          }
          .iconfont {
            color: rgb(6, 192, 6);
          }
        }
        .van-button {
          width: 100px;
          height: 30px;
          margin: 5px 0;
          padding: 0;
          border-radius: 10px;
          font-size: 13px;
          &:first-child {
            margin-bottom: 5px;
          }
        }
      }
    }
    table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #e0e0e0;
      th,
      td {
        padding: 10px 5px;
        border: 1px solid #e0e0e0;
        .van-button {
          width: 100%;
          height: 40px;
          border-radius: 10px;
          &:first-child {
            margin-bottom: 10px;
          }
        }
      }
      td {
        font-size: 14px;
        .statusName {
          font-size: 16px;
          font-weight: 500;
        }
        .lastTime {
          color: grey;
        }
      }
      .stageTd {
        display: flex;
        align-items: center;
        .van-icon {
          margin: 5px;
          font-size: 20px;
        }
        .stageContent {
          text-align: left;
          .result {
            color: red;
            font-size: 13px;
          }
        }
      }
    }
  }
  .clearDataSuccess {
    position: fixed;
    bottom: 46px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 45px;
    background-color: #eaf17f;
    .iconfont {
      color: rgb(6, 192, 6);
    }
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 45px;
    background-color: #fff;
    .refresh {
      padding: 10px;
    }
    .afresh {
      width: 150px;
      .van-button {
        width: 100%;
        border-radius: 10px;
      }
    }
    .configSuccess {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      background-color: #eaf17f;
      p {
        position: relative;
        left: 50%;
        transform: translateX(-50%);
      }
      .van-button {
        position: absolute;
        right: 0;
        height: 30px;
        border-radius: 10px;
      }
      .iconfont {
        color: rgb(6, 192, 6);
      }
    }
  }
  .teardowmSuccess {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    .success {
      display: flex;
      align-items: center;
      width: 100%;
      height: 45px;
      background-color: #eaf17f;
      p {
        position: relative;
        left: 50%;
        transform: translateX(-50%);
      }
      .van-button {
        position: absolute;
        right: 0;
        height: 30px;
        border-radius: 10px;
      }
      .iconfont {
        color: rgb(6, 192, 6);
      }
    }
    .refresh {
      display: flex;
      align-items: center;
      padding-left: 20px;
      height: 40px;
    }
  }
  /deep/.myDialog {
    .van-dialog__header {
      color: @theme-color;
    }
    .van-dialog__content {
      .van-dialog__message {
        text-align: left;
        font-size: 16px;
      }
    }
    .van-dialog__footer {
      .van-dialog__confirm {
        color: @theme-color;
      }
    }
  }
  .linkFailPop {
    width: 80%;
    border-radius: 10px;
    .title {
      display: flex;
      padding: 10px 20px;
      align-items: center;
      .failLogo {
        padding-right: 10px;
        .van-icon {
          font-size: 30px;
          color: red;
        }
      }
      .failText {
        text-align: left;
      }
    }
    .content {
      padding: 20px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
      border-top: 1px solid #e0e0e0;
    }
    .footer {
      padding: 10px;
    }
  }
  .continueWorkPop {
    width: 70%;
    border-radius: 10px;
    padding: 10px;
    .title {
      padding: 10px;
      color: blue;
    }
    .content {
      .reason,
      .desc {
        /deep/.van-cell__title.van-field__label {
          flex: 1;
        }
        /deep/.van-cell__value.van-field__value {
          flex: 3;
          border: 1px solid #e0e0e0;
          input {
            text-indent: 10px;
          }
        }
      }
      .desc {
        /deep/.van-cell__title.van-field__label {
          flex: 0.9;
        }
      }
      .reason {
        /deep/.van-cell__value.van-field__value {
          border-right: none;
        }
        /deep/.van-icon-arrow-down.van-cell__right-icon {
          border: 1px solid #e0e0e0;
          border-left: none;
          margin-left: 0;
        }
      }
    }
    .buttonRegion {
      display: flex;
      justify-content: space-around;
      padding-top: 10px;
      .van-button {
        width: 30%;
        height: 40px;
        border-radius: 10px;
      }
    }
  }
  .newInstallPop {
    width: 85%;
    padding: 10px;
    border-radius: 10px;
    .title {
      font-size: 18px;
      color: @theme-color;
    }
    .warning {
      padding: 10px 0;
      color: red;
      text-align: left;
      font-size: 18px;
    }
    .tips {
      text-align: left;
      color: @theme-color;
      padding: 20px 0;
      font-size: 14px;
    }
    .van-cell {
      margin: 10px 0;
      border: 1px solid;
      border-radius: 10px;
    }
    .buttonRegion {
      .van-button {
        width: 40%;
        border-radius: 10px;
        margin: 10px 15px;
      }
    }
  }
  .rejectPop {
    width: 70%;
    padding: 10px;
    border-radius: 10px;
    .van-field {
      border: 1px solid #e0e0e0;
      border-radius: 10px;
    }
    .van-button {
      margin-top: 10px;
      border-radius: 10px;
    }
  }
}
</style>