<template>
  <div class="bgc" style="padding-bottom: 50px">
    <div>
      <div class="top">
        <div class="search" @click="$router.push('/search')">
          <van-icon
            style="margin-right: 8px"
            name="search"
            size="18"
            color="#000"
          />
          <span>多功能搜索栏（搜工具、搜工单）</span>
        </div>
      </div>
      <!-- 公告 -->
      <div class="notice" @click="$router.push('/messageCenter/messageList')">
        <div class="left">
          <span>消息</span>
          <span>公告</span>
        </div>
        <div class="center">
          <ul :class="{ anim: animate == true }" v-if="messageList.length > 0">
            <!-- <ul class="anim" v-if="messageList.length > 0"> -->
            <li v-for="(item, index) in messageList" :key="index">
              <span>●</span>
              <p>{{ item.title }}</p>
            </li>
          </ul>
          <div class="empty" v-else>暂无未读消息</div>
        </div>
        <div class="right">
          <van-icon name="arrow" size="18" color="#BCBEC4" />
        </div>
      </div>
      <!-- 个人工作台 -->
      <div class="work">
        <div class="panel">
          <div class="title">个人工作台</div>
          <div class="right" @click="goWorkBenchTask">
            详情
            <van-icon name="arrow" size="12" color="#BCBEC4" />
          </div>
        </div>
        <div
          class="work-item"
          v-for="(e, i) in list1"
          :key="i"
          @click="goTaskList(e)"
        >
          <p>{{ e.name }}</p>
          <div>{{ e.num }}</div>
        </div>
      </div>
      <!-- 功能区 -->
      <div class="function" v-if="toolsList.length > 0">
        <div class="panel">
          <div class="title">功能区</div>
          <!-- 目前只展示了工具，工单展示后，要传工单的参数 -->
          <div class="right" @click="goMore">
            更多
            <van-icon name="arrow" size="12" color="#BCBEC4" />
          </div>
        </div>
        <div class="func-item">
          <div
            class="box"
            v-for="(item, index) in toolsList"
            :key="index"
            @click="clickTool(item)"
          >
            <img :src="item.imgUrl" alt="" />
            <div>{{ item.name }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 每日学习 -->
    <van-popup
      v-model="everyDayStudyShow"
      class="everyDayStudyPop"
      :close-on-click-overlay="false"
    >
      <div class="title">每 日 学 习</div>
      <div class="content">{{ studyContents }}</div>
      <div class="bottom">
        <span v-if="everyDayStudyTime > 0">
          您需要阅读{{ everyDayStudyTime }}秒
        </span>
        <span v-else @click="closeEveryDayStudy">关闭</span>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getItem, setItem } from "@/utils/public/sessionStorage";
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive";
import {
  reqgetTools,
  reqgetTaskBoard,
  reqgetUnReadMessageNum,
  reqEveryDayStudy,
} from "@/http/index";
import { billList } from "@/utils/public/workIcons.js";
import { matchTools } from "@/utils/public/tools";
export default {
  name: "Home",
  mixins: [keepAliveMixin],
  data() {
    return {
      sysIds: [],
      ifmSysIds: getItem("loginInfo").ifmSysIds,
      workBenchList: [], // 工作台看板列表
      toolsList: [], // 根据权限获取的工具列表
      goSearch: false,
      list1: [], // 工作台
      list2: [], // 工作台
      messageList: [], // 消息列表
      timer: null,
      animate: false,
      isBack: true, // 控制功能区更多
      prevPath: "",
      everyDayStudyShow: false,
      everyDayStudyTime: 10,
      studyContents: "",
    };
  },
  created() {
    // 判断是否展示每日学习
    this.judgEveryDayStudy();

    getItem("loginInfo").userIds.forEach((e) => {
      this.sysIds.push(e.sysId);
    });
    // this.$forceUpdate()
    // console.log(this.prevPath);
    this.getTools();
    this.getTaskList();
    this.getMessageList();
    this.rollFunc();
  },
  //每次激活时
  activated() {
    // console.log('首页激活了', this.prevPath)
    // if (this.prevPath == '/login') {
    // let list = JSON.parse(localStorage.getItem('sortList'))
    // console.log('存储的功能区排序', list);
    // if (list?.length > 0) {
    //   this.toolsList = []
    //   let curr = list.find(e => getItem('loginInfo').loginNo == e.loginNo)
    //   if (curr) {
    //     this.toolsList = curr.sortList
    //   } else {
    //     this.getTools()
    //   }
    // } else {
    //   this.getTools()
    // }
    // }
    // 用户进行排序后执行
    if (this.prevPath == "/tool") {
      let list = JSON.parse(localStorage.getItem("sortList") || "[]");
      let curr = list.find((e) => getItem("loginInfo").loginNo == e.loginNo);
      // console.log('从管理功能区返回', curr, list?.length > 0 && curr);
      if (list?.length > 0 && curr) {
        this.toolsList = curr.sortList;
      }
    }
    // bus.$on('changeList', function (e) {
    //   console.log('用户排序了', e);
    //   let list = JSON.parse(localStorage.getItem('sortList'))
    //   let curr = list.find(e => getItem('loginInfo').loginNo == e.loginNo)
    //   if (list?.length > 0 && curr) {
    //     this.toolsList = curr.sortList
    //   }
    // }.bind(this));
  },
  methods: {
    // 判断是否展示每日学习
    async judgEveryDayStudy() {
      // 判断今日是否已经学习 → 查看是否有当日本地日期存储
      let currenDay = this.getDateTime();
      let currentLoginNo = getItem("loginNo");
      let storageDay = "";
      let storageLoginNo = "";
      if (localStorage.getItem("everyDayStudy")) {
        let everyDayStudy = JSON.parse(localStorage.getItem("everyDayStudy"));
        storageDay = everyDayStudy.time;
        storageLoginNo = everyDayStudy.loginNo;
      }
      if (!(currenDay == storageDay && currentLoginNo == storageLoginNo)) {
        // 未学习 → 发起请求
        let result = await reqEveryDayStudy(JSON.stringify({}));
        console.log("每日学习结果", result);
        // studyContents：学习内容
        // showTime 展示时间，-1或0不显示学习内容，>0则是需要根据时间显示学习内容（单位：秒）
        this.apiResponse(result, ".bgc", () => {
          this.everyDayStudyTime = result.showTime;
          this.studyContents = result.studyContents;
          if (this.everyDayStudyTime > 0) {
            this.everyDayStudyShow = true;
            this.countDownTimer();
          }
        });
      }
    },
    // 关闭每日学习
    closeEveryDayStudy() {
      // 用户自行点击关闭按钮，本地记录当天已学标识  存储格式：everyDayStudy:{日期,用户名}
      this.everyDayStudyShow = false;
      let time = this.getDateTime();
      localStorage.setItem(
        "everyDayStudy",
        JSON.stringify({
          time,
          loginNo: getItem("loginNo"),
        })
      );
    },
    // 倒计时
    countDownTimer() {
      this.timer = setInterval(() => {
        if (this.everyDayStudyTime > 0) {
          this.everyDayStudyTime -= 1;
        }
      }, 1000);
    },
    // 获取当日日期
    getDateTime() {
      let date = new Date();
      //获取年份
      var Y = date.getFullYear();
      //获取月份
      var M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      //获取当日日期
      var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let todayDate = Y + "-" + M + "-" + D;
      return todayDate;
    },

    // 点击工作台每个看板
    goTaskList(curr) {
      this.$router.push({ name: "WorkBench" });
      // 存储到session
      setItem("taskId", Number(curr.condition));
    },
    // 点击工作台详情跳转到工作台的任务页面
    goWorkBenchTask() {
      this.$router.push({ name: "WorkBench" });
    },
    // 点击功能区更多
    goMore() {
      // this.isBack = false
      this.$router.push({
        path: "/tool",
        query: {
          toolsList: this.toolsList,
        },
      });
    },
    // 点击工具跳转页面
    clickTool(i) {
      // console.log(i)
      matchTools(i);
    },
    // 获取首页任务看板
    async getTaskList() {
      let data = await reqgetTaskBoard(
        JSON.stringify({
          sysIds: this.sysIds,
          homeTaskType: "",
          ifmSysIds: this.ifmSysIds,
        })
      );
      console.log("任务看板", data);
      this.list1 = data.list1;
      this.list2 = data.list2;
    },
    // 对比功能区数据
    contArrChange(oldData, newData) {
      let oldDataRepetition = [].concat(oldData); //使用空数组合并，之后操作不改变原数组
      // let dataSourceRepetition = [].concat(newData);
      let someArr = []; //相同的
      for (let i = 0; i < newData.length; i++) {
        for (let j = 0; j < oldData.length; j++) {
          if (oldData[j].id === newData[i].id) {
            someArr.push(oldData[j]);
          }
        }
      }

      let deleteArr = []; //删除的
      for (let i = 0; i < someArr.length; i++) {
        for (let j = 0; j < oldDataRepetition.length; j++) {
          if (someArr[i].id === oldDataRepetition[j].id) {
            oldDataRepetition.splice(j, 1); //去重
          }
        }
      }
      deleteArr = oldDataRepetition;

      // let addArr = null; //增加的
      // for (let i = 0; i < someArr.length; i++) {
      //   for (let j = 0; j < dataSourceRepetition.length; j++) {
      //     if (someArr[i].id === dataSourceRepetition[j].id) {
      //       dataSourceRepetition.splice(j, 1); //去重
      //     }
      //   }
      // }
      // addArr = dataSourceRepetition;
      // oldData.push(...addArr);
      // console.log("新增加到后面", oldData);

      // 从原数组中删除不要的项
      deleteArr.forEach((e) => {
        oldData.forEach((item, index) => {
          if (item.id == e.id) {
            oldData.splice(index, 1);
          }
        });
      });

      return oldData;
    },
    // 根据权限获取工具列表
    async getTools() {
      let data = await reqgetTools(
        JSON.stringify({ sysIds: this.sysIds, ifmSysIds: this.ifmSysIds })
      );
      // console.log('获取工具',data)
      let newList = []; // 从接口获取的功能区数据
      data.toolsList.forEach((e) => newList.push(...e.toolsList));
      data.zyToolsList.forEach((e) => newList.push(...e.toolsList));
      data.jkToolsList.forEach((e) => newList.push(...e.toolsList));
      newList.forEach((e) => {
        billList.forEach((tool) => {
          if (tool.toolId == e.id) {
            e.imgUrl = tool.url;
          }
        });
      });
      let list = JSON.parse(localStorage.getItem("sortList") || "[]"); // 存储的排序数据
      console.log("存储的功能区排序", list);
      if (list?.length > 0) {
        this.toolsList = [];
        // 当前用户的排序列表
        let curr = list.find(
          (e) => getItem("loginInfo").loginNo == e.loginNo
        )?.sortList;
        if (curr?.length > 0) {
          // 如果之前有排序，就和接口获取的数据进行对比，看是否有删除
          this.toolsList = this.contArrChange(curr, newList);
        } else {
          this.toolsList = newList;
        }
      } else {
        this.toolsList = newList;
      }
      console.log("工具列表", this.toolsList);
    },
    async getMessageList() {
      let data = await reqgetUnReadMessageNum(
        JSON.stringify({ sysIds: this.sysIds })
      );
      // let data = await reqgetMessageList(JSON.stringify({isRead: 1, page: 1, sysIds: this.sysIds }))
      console.log("消息", data);
      this.messageList = data.data;
    },
    // 消息滚动显示
    rollFunc() {
      this.animate = true;
      this.timer = setInterval(() => {
        setTimeout(() => {
          // let first = this.messageList.shift()
          // this.messageList.push(first)
          this.messageList.push(this.messageList[0]);
          this.messageList.shift();
          this.animate = !this.animate;
        }, 800);
      }, 1000);
    },
  },
  beforeRouteEnter(to, form, next) {
    next((vm) => {
      console.log("首页form", form);
      vm.prevPath = form.path;
    });
  },
  destroyed() {
    this.timer = null;
  },
};
</script>

<style scoped lang="less">
.top {
  height: 200px;
  background-image: url("./images/bg.jpg");
  background-size: cover;
  padding-top: 35px;
  box-sizing: border-box;
  .search {
    width: 327px;
    height: 32px;
    background: #ffffff;
    border-radius: 4px;
    margin: auto;
    padding: 6px;
    font-size: 14px;
    box-sizing: border-box;
    text-align: start;
  }
}
.anim {
  transition: all 0.5s;
  margin-top: -22px;
}
.notice {
  display: flex;
  justify-content: space-between;
  background: #fff;
  margin: 15px;
  border-radius: 10px;
  padding: 12px;
  .left {
    width: 40px;
    font-weight: 700;
    font-size: 18px;
    span:nth-child(2) {
      color: #305bfd;
    }
  }
  .center {
    flex: 1;
    font-size: 12px;
    text-align: start;
    margin-left: 20px;
    height: 50px;
    overflow: hidden;
    ul li {
      display: flex;
      margin-top: 6px;
      color: #f04438;
      p {
        color: #777a87;
        margin-left: 8px;
      }
    }
    .empty {
      line-height: 50px;
      font-size: 16px;
      color: gray;
    }
  }
  .right {
    width: 26px;
    line-height: 26px;
    border-radius: 13px;
    background-color: #f6f8f9;
    margin: auto;
  }
}
.panel {
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
  .title {
    font-size: 18px;
    font-weight: 600;
  }
  .right {
    font-size: 12px;
    color: #777a87;
  }
}
.work {
  padding: 15px;
  background-color: #fff;
  margin-bottom: 15px;

  .work-item {
    display: inline-block;
    width: 29%;
    height: 82px;
    margin-right: 12px;
    background: linear-gradient(180deg, #f2f9ff 0%, #bed8ff 100%);
    box-shadow: inset 0px -1px 0px 0px rgba(255, 255, 255, 0.5);
    border-radius: 4px;
    p {
      color: #777a87;
      font-size: 14px;
      margin-top: 12px;
      margin-bottom: 5px;
    }
    div {
      font-size: 28px;
      font-weight: 700;
    }
  }
}
.function {
  padding: 15px;
  background-color: #fff;
  .func-item {
    margin-bottom: 30px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .box {
      width: 25%;
      margin-bottom: 15px;
      img {
        width: 36px;
        height: 36px;
      }
      div {
        font-size: 12px;
      }
    }
  }
}
.everyDayStudyPop {
  display: flex;
  flex-direction: column;
  width: 80%;
  height: 60%;
  border-radius: 8px;
  .title,
  .bottom {
    padding: 8px;
    color: #fff;
  }
  .title {
    height: 50px;
    line-height: 50px;
    background-image: url("./images/everyDayStudyTop.png");
    background-size: 100% 100%;
    font-size: 22px;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 500;
  }
  .content {
    flex: 1;
    overflow-y: auto;
    white-space: pre-line;
    text-align: left;
    padding: 10px;
    font-size: 15px;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
  }
  .bottom {
    width: 80%;
    margin: 10px auto;
    background: linear-gradient(90deg, #2764e6 0%, #3488fb 100%);
    span {
      display: inline-block;
      width: 100%;
    }
  }
}
</style>