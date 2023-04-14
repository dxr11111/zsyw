<template>
  <div class="ywkh">
    <div class="static" ref="static">
      <MyHeader :name="name" left="arrow-left" @goBackEv="$router.go(-1)" />
      <div class="setting">
        <van-tabs
          v-model="titleActiveName"
          type="card"
          v-if="reportShow === true"
          @change="changeTab"
        >
          <van-tab title="日报" name="day"></van-tab>
          <van-tab title="周报" name="week"></van-tab>
          <van-tab title="月报" name="month"></van-tab>
        </van-tabs>
        <!-- 日报 周报 月报下的时间 -->
        <div class="dateMode" v-if="reportShow === true">
          <div class="date">
            <span>时间</span>
            <Ymd v-if="titleActiveName == 'day'" @getKhDay="getKhDay" />
            <YmWeekIndex
              v-if="titleActiveName == 'week'"
              @getDate="getymDate"
              @getWeek="getWeek"
            />
            <Ym v-if="titleActiveName == 'month'" @getKhMonth="getKhMonth" />
          </div>
          <div class="mode">
            <van-button
              type="default"
              v-for="item in modeList"
              :key="item.modeId"
              @click="clickMode(item)"
              :class="modeId == item.modeId ? 'activeButton' : ''"
              >{{ item.name }}</van-button
            >
          </div>
        </div>
        <div class="fgsDate" v-if="reportShow === false">
          <span>时间</span>
          <YmWeekIndex
            @getDate="getymDate"
            @getWeek="getWeek"
            :dateWidth="30"
          />
        </div>
      </div>
    </div>
    <div :style="{ marginTop: marginTop }">
      <DayReport
        ref="dayReport"
        v-if="titleActiveName == 'day' && reportShow === true"
        :modeId="modeId"
        :loginNo="loginNo"
        :khDay="khDay"
      />
      <WeekReport
        ref="weekReport"
        v-if="titleActiveName == 'week' && reportShow === true"
        :modeId="modeId"
        :loginNo="loginNo"
        :month="month"
        :weekIndex="weekIndex"
      />
      <MonthReport
        ref="monthReport"
        v-if="titleActiveName == 'month' && reportShow === true"
        :modeId="modeId"
        :loginNo="loginNo"
        :khMonth="khMonth"
      />
      <FgsReport
        ref="fgsReport"
        v-if="reportShow === false"
        :loginNo="loginNo"
        :month="month"
        :weekIndex="weekIndex"
      />
    </div>
  </div>
</template>
  
<script>
import { mapState } from "vuex";
import YmWeekIndex from "@/components/ymWeekIndex";
import Ymd from "@/components/ymd";
import Ym from "@/components/ym";
import DayReport from "./components/dayReport";
import WeekReport from "./components/weekReport";
import MonthReport from "./components/monthReport";
import FgsReport from "./components/fgsReport";
export default {
  name: "YdNetworkAssess",
  components: {
    YmWeekIndex,
    Ymd,
    Ym,
    DayReport,
    WeekReport,
    MonthReport,
    FgsReport,
  },
  data() {
    return {
      name: "移网考核看板",
      marginTop: "160px",
      // 分公司：yuanchen; 小网格：zouky; 代维：cuibaoguo
      // loginNo: "hesq32", //生产 130123199206274518 fuxing1
      loginNo: "", //生产 130123199206274518 fuxing1
      // 是否展示日报 周报 月报
      reportShow: null,
      titleActiveName: "day",
      // 制式
      modeId: 3,
      modeList: [
        { name: "3G4G", modeId: 3 },
        { name: "5G", modeId: 7 },
      ],
      // 选择的日期
      month: "", // yyyy-mm 2021-11
      weekIndex: "", // 每月第几周
      khDay: "", // yyyy-mm-dd 2021-10-17
      khMonth: "", // yyyy-mm

      firstLoad: true, // 首次加载标识
    };
  },
  computed: {
    ...mapState("ydNetworkAssess", ["settingInfo", "fgsInfo"]),
  },
  watch: {},
  methods: {
    // 根据当前所在的报表判断该发送的请求
    judgeRequest() {
      if (this.reportShow) {
        switch (this.titleActiveName) {
          case "day":
            this.$refs.dayReport?.getDayInfo();
            break;
          case "week":
            this.$refs.weekReport?.getWeekInfo();
            break;
          case "month":
            this.$refs.monthReport?.getMonthInfo();
            break;
        }
      } else {
        // 分公司
        this.$refs.fgsReport?.getFgsInfo();
      }
    },
    // 切换日报/周报/月报
    changeTab(name, title) {
      this.firstLoad = true;
    },
    // 点击制式
    clickMode(item) {
      this.modeId = item.modeId;
      // 根据当前所在的报表判断该发送的请求
      this.$nextTick(() => {
        this.judgeRequest();
      });
    },
    // 得到YmWeekIndex子组件日期
    getymDate(value) {
      this.month = value;
      // 周报/分公司报表第一次加载时，在getymDate和getWeek内会同时获取请求，此时屏蔽掉getymDate内的请求
      if (!this.firstLoad) {
        // 根据当前所在的报表判断该发送的请求
        this.$nextTick(() => {
          this.judgeRequest();
        });
      } else {
        this.firstLoad = false;
      }
    },
    // 得到YmWeekIndex子组件第几周
    getWeek(value) {
      this.weekIndex = value;
      // 根据当前所在的报表判断该发送的请求
      this.$nextTick(() => {
        this.judgeRequest();
      });
    },
    // 得到日报日期
    getKhDay(value) {
      this.khDay = value;
      // 根据当前所在的报表判断该发送的请求
      this.$nextTick(() => {
        this.judgeRequest();
      });
    },
    // 得到月报日期(value) {
    getKhMonth(value) {
      this.khMonth = value;
      // 根据当前所在的报表判断该发送的请求
      this.$nextTick(() => {
        this.judgeRequest();
      });
    },

    // 获取用户权限
    async getSettingInfo() {
      try {
        await this.$store.dispatch(
          "ydNetworkAssess/getSettingInfo",
          this.loginNo
        );
        let userAuth = this.settingInfo.userAuth;
        // 测试 userAuth为1
        // let userAuth = 1;
        if (userAuth == 1 || userAuth == 2) {
          // 展示分公司/小网格
          this.reportShow = false;
        } else if (userAuth == 3) {
          //展示日报 周报 月报
          this.reportShow = true;
        }
        // 获取顶部static元素高度
        this.$nextTick(() => {
          this.marginTop = this.$refs.static.clientHeight + 10 + "px";
        });
      } catch (error) {
        console.log("err", error);
      }
    },
  },
  created() {
    // let userIds = getItem('loginInfo').userIds
    let userIds = this.$store.getters.getLoginInfo.userIds;
    userIds.forEach((e) => {
      if (e.sysId == 3) {
        this.loginNo = e.accountId;
      }
    });
    this.getSettingInfo();
  },
  mounted() {},
};
</script>

<style scoped lang="less">
@bgColor: #245bef;
@borderColor: #ebedf0;
::v-deep .van-tabs--card > .van-tabs__wrap {
  height: 36px !important;
}
.ywkh {
  width: 100%;
  // height: 2000px;
  min-height: 650px;
  background-color: #fff;
  .static {
    z-index: 1000;
    position: fixed;
    top: 0;
    width: 100%;
    max-width: 640px;
    background-color: #fff;
    .setting {
      // height: 100px;
      box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 8%);
      ::v-deep .van-tabs__wrap {
        width: 95%;
        margin: 0 auto;
        padding-top: 3.3333vw;
        .van-tabs__nav--card {
          margin: 0;
          height: 36px;
          border: 1px solid @borderColor;
          border-radius: 5px;
          .van-tab {
            border-right: 1px solid @borderColor;
            // border-right: 0;
            /* &:nth-child(1)::after,
            &:nth-child(2)::after {
              content: "";
              position: absolute;
              left: 14px;
              bottom: 5px;
              right: 0px;
              top: 5px;
              border-right: 1px solid @borderColor;
            } */
          }
          .van-tab.van-tab--active {
            background-color: @bgColor;
          }
        }
        .van-tab .van-tab__text {
          color: #000;
        }
        .van-tab--active .van-tab__text {
          color: #fff;
        }
      }
      .dateMode {
        display: flex;
        justify-content: space-between;
        width: 95%;
        margin: 0 auto;
        height: 50px;
        .date {
          display: flex;
          width: 65%;
          span {
            display: inline-block;
            width: 18%;
            line-height: 53px;
            font-size: 14px;
          }
          .van-cell {
            padding: 0;
          }
        }
        .mode {
          height: 50px;
          .van-button {
            height: 30px;
            margin-top: 13px;
          }
          .van-button--default {
            color: #000;
            border-radius: 5px;
            border: 1px solid @borderColor;
            &:first-child {
              border-radius: 5px 0 0 5px;
            }
            &:last-child {
              border-radius: 0 5px 5px 0;
            }
          }
          .activeButton {
            background-color: @bgColor;
            color: #fff;
          }
        }
      }
      .fgsDate {
        display: flex;
        width: 95%;
        margin: 0 auto;
        span {
          line-height: 50px;
        }
      }
    }
  }
  ::v-deep .dayInfo,
  ::v-deep .weekInfo,
  ::v-deep .monthInfo,
  ::v-deep .fgsInfo {
    // margin-top: 160px;
    table.imagetable {
      font-family: verdana, arial, sans-serif;
      font-size: 11px;
      color: #333333;
      border: 1px solid #999999;
      border-collapse: collapse;
    }
    table.imagetable th,
    table.imagetable td {
      padding: 8px;
      border: 1px solid #999999;
    }
    table.imagetable th {
      background: #f7faff;
    }
    table.imagetable td {
      background: #ffffff;
      text-align: left;
    }
  }
  ::v-deep .fgsInfo {
    margin-top: 100px;
  }
}
</style>