<template>
  <div class="weekInfo">
    <div id="content" style="width: 90%; margin: 0 auto">
      <table
        id="tabtitleW"
        class="imagetable"
        style="width: 100%; display: none"
      >
        <tr>
          <th id="zkjsjW"></th>
        </tr>
      </table>
      <table id="tabConW" class="imagetable" style="width: 100%; display: none">
        <tr>
          <th style="width: 22%">基站数</th>
          <td id="jzsW" style="width: 38%"></td>
          <th style="width: 20%">小区数</th>
          <td id="xqsW" style="width: 20%"></td>
        </tr>
        <tr>
          <th id="dzscspmW" colspan="4"></th>
        </tr>
        <tr>
          <th id="dzscxwgpmW" colspan="4"></th>
        </tr>
        <tr>
          <th id="dzlxwgpmW" colspan="4"></th>
        </tr>
        <tr>
          <th>断站数</th>
          <td id="dzsW" colspan="3"></td>
        </tr>
        <tr>
          <th>断站时长</th>
          <td id="dzscW"></td>
          <th>断站率</th>
          <td id="dzlW"></td>
        </tr>
        <tr>
          <th id="dxqscspmW" colspan="4"></th>
        </tr>
        <tr>
          <th id="dxqscxwgpmW" colspan="4"></th>
        </tr>
        <tr>
          <th id="dxqlxwgpmW" colspan="4"></th>
        </tr>
        <tr>
          <th>断小区数</th>
          <td id="dxqsW" colspan="3"></td>
        </tr>
        <tr>
          <th>断小区时长</th>
          <td id="dxqscW"></td>
          <th>断小区率</th>
          <td id="dxqlW"></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import $ from "jquery";
export default {
  name: "WeekReport",
  props: ["modeId", "loginNo", "month", "weekIndex", "titleActiveName"],
  computed: {
    ...mapState("ydNetworkAssess", ["weekInfo"]),
  },
  watch: {
    month() {
      // 判断month和weekIndex都有数据才发送请求
      if (this.titleActiveName == "week") {
        if (this.month && this.weekIndex) this.getWeekInfo();
      }
    },
    weekIndex() {
      if (this.titleActiveName == "week") {
        if (this.month && this.weekIndex) this.getWeekInfo();
      }
    },
    modeId() {
      if (this.titleActiveName == "week") {
        this.getWeekInfo();
      }
    },
  },
  methods: {
    async getWeekInfo() {
      try {
        let zhishi = this.modeId;
        let loginNo = this.loginNo;
        let month = this.month;
        let weekIndex = this.weekIndex;
        let postData = { zhishi, loginNo, month, weekIndex };
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        await this.$store.dispatch(
          "ydNetworkAssess/getWeek",
          JSON.stringify(postData)
        );
        let result = this.weekInfo;
        console.log("周报数据", result);
        if (result.operationSuccessFlag) {
          //成功
          var week = result.week;
          $("#zkjsjW").text(
            "第" +
              weekIndex +
              "周(" +
              week.weekStart +
              "至" +
              week.weekEnd +
              ")"
          );
          var duanzhan = result.duanzhan;
          $("#dzscspmW").text("断站时长市排名：" + duanzhan.rankTotal);
          $("#dzscxwgpmW").text("断站时长小网格排名：" + duanzhan.rankXwg);
          $("#dzlxwgpmW").text("断站率小网格排名：" + duanzhan.rankDuan);
          $("#jzsW").text(duanzhan.totalCount);
          $("#dzsW").text(duanzhan.count + "（" + duanzhan.ringRatio + "）");
          $("#dzscW").text(duanzhan.shichang);
          $("#dzlW").text(duanzhan.rate);

          var duanxiaoqu = result.duanxiaoqu;
          $("#xqsW").text(duanxiaoqu.totalCount);
          $("#dxqscspmW").text("断小区市排名：" + duanxiaoqu.rankTotal);
          $("#dxqscxwgpmW").text("断小区小网格排名：" + duanxiaoqu.rankXwg);
          $("#dxqlxwgpmW").text("断小区率小网格排名：" + duanxiaoqu.rankDuan);
          $("#dxqsW").text(
            duanxiaoqu.count + "（" + duanxiaoqu.ringRatio + "）"
          );
          $("#dxqscW").text(duanxiaoqu.shichang);
          $("#dxqlW").text(duanxiaoqu.rate);

          //显示表格
          $("#tabConW").show();
          $("#tabtitleW").show();
        } else {
          //失败
          $("#zkjsjW").text("ERROR-" + result.errorMessage);
          $("#tabtitleW").show();
          $("#tabConW").hide();
        }
      } catch (error) {
        console.log("周报数据请求失败", error);
      }
    },
  },
  mounted() {},
  created() {},
};
</script>

<style scoped lang="less">
</style>