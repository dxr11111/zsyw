<template>
  <div class="monthInfo">
    <div style="width: 90%; margin: 0 auto">
      <table
        id="tabtitleM"
        class="imagetable"
        style="width: 100%; display: none"
      >
        <tr>
          <th id="zkjsjM"></th>
        </tr>
      </table>
      <table id="tabConM" class="imagetable" style="width: 100%; display: none">
        <tr>
          <th style="width: 22%">基站数</th>
          <td id="jzsM" style="width: 38%"></td>
          <th style="width: 20%">小区数</th>
          <td id="xqsM" style="width: 20%"></td>
        </tr>
        <tr>
          <th id="dzscspmM" colspan="4"></th>
        </tr>
        <tr>
          <th id="dzscxwgpmM" colspan="4"></th>
        </tr>
        <tr>
          <th id="dzlxwgpmM" colspan="4"></th>
        </tr>
        <tr>
          <th>断站数</th>
          <td id="dzsM" colspan="3"></td>
        </tr>
        <tr>
          <th>断站时长</th>
          <td id="dzscM"></td>
          <th>断站率</th>
          <td id="dzlM"></td>
        </tr>
        <tr>
          <th id="dxqscspmM" colspan="4"></th>
        </tr>
        <tr>
          <th id="dxqscxwgpmM" colspan="4"></th>
        </tr>
        <tr>
          <th id="dxqlxwgpmM" colspan="4"></th>
        </tr>
        <tr>
          <th>断小区数</th>
          <td id="dxqsM" colspan="3"></td>
        </tr>
        <tr>
          <th>断小区时长</th>
          <td id="dxqscM"></td>
          <th>断小区率</th>
          <td id="dxqlM"></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import $ from "jquery";
export default {
  name: "MonthReport",
  props: ["modeId", "khMonth", "loginNo", "titleActiveName"],
  computed: {
    ...mapState("ydNetworkAssess", ["monthInfo"]),
  },
  watch: {
    khMonth () {
      this.getMonthInfo();
    },
    modeId () {
      if (this.titleActiveName == "month") {
        this.getMonthInfo();
      }
    },
  },
  methods: {
    async getMonthInfo () {
      try {
        let zhishi = this.modeId;
        let khMonth = this.khMonth;
        let loginNo = this.loginNo;
        let postData = { zhishi, khMonth, loginNo };
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        await this.$store.dispatch(
          "ydNetworkAssess/getMonth",
          JSON.stringify(postData)
        );
        let result = this.monthInfo;
        console.log("月报数据", result);
        if (result.operationSuccessFlag) {
          //成功
          //数据
          $("#tabtitleM").hide();
          var duanzhan = result.duanzhan;
          $("#dzscspmM").text("断站时长市排名：" + duanzhan.rankTotal);
          $("#dzscxwgpmM").text("断站时长小网格排名：" + duanzhan.rankXwg);
          $("#dzlxwgpmM").text("断站率小网格排名：" + duanzhan.rankDuan);
          $("#jzsM").text(duanzhan.totalCount);
          $("#dzsM").text(duanzhan.count + "（" + duanzhan.ringRatio + "）");
          $("#dzscM").text(duanzhan.shichang);
          $("#dzlM").text(duanzhan.rate);

          var duanxiaoqu = result.duanxiaoqu;
          $("#xqsM").text(duanxiaoqu.totalCount);
          $("#dxqscspmM").text("断小区市排名：" + duanxiaoqu.rankTotal);
          $("#dxqscxwgpmM").text("断小区小网格排名：" + duanxiaoqu.rankXwg);
          $("#dxqlxwgpmM").text("断小区率小网格排名：" + duanxiaoqu.rankDuan);
          $("#dxqsM").text(
            duanxiaoqu.count + "（" + duanxiaoqu.ringRatio + "）"
          );
          $("#dxqscM").text(duanxiaoqu.shichang);
          $("#dxqlM").text(duanxiaoqu.rate);

          //显示内容
          $("#tabConM").show();
        } else {
          //失败
          $("#zkjsjM").text("ERROR-" + result.errorMessage);
          $("#tabtitleM").show();
          $("#tabConM").hide();
        }
      } catch (error) {
        console.log("月报请求数据失败", error);
      }
    },
  },
  created () { },
};
</script>

<style scoped lang="less">
</style>