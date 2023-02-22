<template>
  <div class="fgsInfo">
    <div id="content" style="width: 90%; margin: 0 auto">
      <table
        id="tabtitle"
        class="imagetable"
        style="width: 100%; display: none"
      >
        <tr>
          <th id="riqi"></th>
        </tr>
      </table>
      <table id="tabCon" class="imagetable" style="width: 100%; display: none">
        <tbody id="tabBodyCon"></tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import $ from "jquery";
export default {
  name: "FgsReport",
  props: ["loginNo", "month", "weekIndex"],
  computed: {
    ...mapState("ydNetworkAssess", ["fgsInfo"]),
  },
  watch: {
    month() {
      // 判断month和weekIndex都有数据才发送请求
      if (this.month && this.weekIndex) this.getFgsInfo();
    },
    weekIndex() {
      if (this.month && this.weekIndex) this.getFgsInfo();
    },
  },
  methods: {
    async getFgsInfo() {
      try {
        // 请求分公司接口数据
        let loginNo = this.loginNo;
        let month = this.month;
        let weekIndex = this.weekIndex;
        let postData = { loginNo, month, weekIndex };
        // 滚动条回到顶部
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        await this.$store.dispatch(
          "ydNetworkAssess/getFGS",
          JSON.stringify(postData)
        );
        let result = this.fgsInfo;
        console.log("分公司数据", result);
        $("#tabBodyCon").empty(); //清空
        //数据
        this.apiResponse(result, ".fgsInfo", () => {
          //成功
          let week = result.week;
          $("#riqi").text("日期(" + week.weekStart + "至" + week.weekEnd + ")");
          let groupMovingKB = result.groupMovingKB; //基站看板List
          for (let i = 0; i < groupMovingKB.length; i++) {
            let $trTemp = $("<tr></tr>");
            $trTemp.append(
              '<th colspan="4">' + groupMovingKB[i].areaName + "</th>"
            );
            // 将创建的tr追加到tabBodyCon里
            $trTemp.appendTo("#tabBodyCon");
            //基站
            $trTemp = $("<tr></tr>");
            $trTemp.append(
              '<th>基站总数</th><td colspan="3">' +
                groupMovingKB[i].jizhan +
                "</td>"
            );
            $trTemp.appendTo("#tabBodyCon");

            $trTemp = $("<tr></tr>");
            $trTemp.append(
              '<th style="width:26%">断站个数</th><td style="width:24%">' +
                groupMovingKB[i].duanzhanNum +
                '</td><th style="width:26%">断站时长</th><td style="width:24%">' +
                groupMovingKB[i].duanzhanLength +
                "分钟</td>"
            );
            $trTemp.appendTo("#tabBodyCon");

            $trTemp = $("<tr></tr>");
            $trTemp.append(
              "<th>断站率</th><td>" +
                groupMovingKB[i].duanzhanRate +
                "</td><th>断站平均历时</th><td>" +
                groupMovingKB[i].duanzhanAverageLength +
                "分钟</td>"
            );
            $trTemp.appendTo("#tabBodyCon");

            $trTemp = $("<tr></tr>");
            $trTemp.append(
              '<th>断站超72小时故障个数</th><td colspan="3">' +
                groupMovingKB[i].duanzhan72Hours +
                "</td>"
            );
            $trTemp.appendTo("#tabBodyCon");
            //小区
            $trTemp = $("<tr></tr>");
            $trTemp.append(
              '<th>小区总数</th><td colspan="3">' +
                groupMovingKB[i].xiaoqu +
                "</td>"
            );
            $trTemp.appendTo("#tabBodyCon");

            $trTemp = $("<tr></tr>");
            $trTemp.append(
              "<th>断小区个数</th><td>" +
                groupMovingKB[i].duanxiaoquNum +
                "</td><th>断小区时长</th><td>" +
                groupMovingKB[i].duanxiaoquLength +
                "分钟</td>"
            );
            $trTemp.appendTo("#tabBodyCon");

            $trTemp = $("<tr></tr>");
            $trTemp.append(
              "<th>断小区率</th><td>" +
                groupMovingKB[i].duanxiaoquRate +
                "</td><th>断小区平均历时</th><td>" +
                groupMovingKB[i].duanxiaoquAverageLength +
                "分钟</td>"
            );
            $trTemp.appendTo("#tabBodyCon");

            $trTemp = $("<tr></tr>");
            $trTemp.append(
              '<th>断小区超72小时故障个数</th><td colspan="3">' +
                groupMovingKB[i].duanxiaoqu72Hours +
                "</td>"
            );
            $trTemp.appendTo("#tabBodyCon");

            $trTemp = $("<tr></tr>");
            $trTemp.append(
              '<th>总体断小区率</th><td colspan="3">' +
                groupMovingKB[i].totalRate +
                "</td>"
            );
            $trTemp.appendTo("#tabBodyCon");
          }
        });
        if (!result.operationSuccessFlag) {
          //失败
          $("#riqi").text("ERROR-" + result.errorMessage);
        }
        //显示表格
        $("#tabCon").show();
        $("#tabtitle").show();
      } catch (error) {
        console.log("分公司数据请求失败", error);
      }
    },
  },
};
</script>

<style scoped lang="less">
</style>