<template>
  <div class="dayInfo">
    <div id="content" style="width: 90%; margin: 0 auto">
      <table id="tabjz" class="imagetable" style="width: 100%; display: none">
        <tr>
          <th style="width: 22%">基站数</th>
          <td id="jzs" style="width: 38%"></td>
          <th style="width: 20%">小区数</th>
          <td id="xqs" style="width: 20%"></td>
        </tr>
        <tr>
          <th id="dzscspm" colspan="4"></th>
        </tr>
        <tr>
          <th id="dzscxwgpm" colspan="4"></th>
        </tr>
        <tr>
          <th id="dzlxwgpm" colspan="4"></th>
        </tr>
        <tr>
          <th>断站数</th>
          <td id="dzs"></td>
          <th>月累计</th>
          <td id="dzsylj"></td>
        </tr>
        <tr>
          <th>断站时长</th>
          <td id="dzsc"></td>
          <th>月累计</th>
          <td id="dzscylj"></td>
        </tr>
        <tr>
          <th>断站率</th>
          <td id="dzl" colspan="3"></td>
        </tr>
      </table>
    </div>

    <div id="content" style="width: 90%; margin: 0 auto">
      <table id="tabxq" class="imagetable" style="width: 100%; display: none">
        <tr>
          <th id="dxqscspm" colspan="4"></th>
        </tr>
        <tr>
          <th id="dxqscxwgpm" colspan="4"></th>
        </tr>
        <tr>
          <th id="dxqlxwgpm" colspan="4"></th>
        </tr>
        <tr>
          <th style="width: 25%">断小区数</th>
          <td id="dxqs" style="width: 35%"></td>
          <th style="width: 20%">月累计</th>
          <td id="dxqsylj" style="width: 20%"></td>
        </tr>
        <tr>
          <th>断小区时长</th>
          <td id="dxqsc"></td>
          <th>月累计</th>
          <td id="dxqscylj"></td>
        </tr>
        <tr>
          <th>断小区率</th>
          <td id="dxql" colspan="3"></td>
        </tr>
      </table>
    </div>
    <br />
    <div class="htmleaf-container">
      <div class="htmleaf-content">
        <div style="width: 90%; margin: 0 auto">
          <div id="dzDxqData" style="width: 100%; height: 200px"></div>
        </div>
      </div>
    </div>
    <br />
    <div class="htmleaf-container">
      <div class="htmleaf-content">
        <div style="width: 90%; margin: 0 auto">
          <div id="dzData" style="width: 100%; height: 200px"></div>
        </div>
      </div>
    </div>
    <br />
    <div class="htmleaf-container">
      <div class="htmleaf-content">
        <div style="width: 90%; margin: 0 auto">
          <div id="dxqData" style="width: 100%; height: 200px"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import $ from "jquery";
import * as echarts from "echarts";
export default {
  name: "DayReport",
  props: ["modeId", "loginNo", "khDay", "titleActiveName", "reportShow"],
  computed: {
    ...mapState("ydNetworkAssess", ["dayInfo"]),
  },
  watch: {
    reportShow() {
      if (this.reportShow) this.getDayInfo();
    },
    khDay() {
      this.getDayInfo();
    },
    modeId() {
      if (this.titleActiveName == "day") {
        this.getDayInfo();
      }
    },
    titleActiveName(value) {
      if (value == "day") this.getDayInfo();
    },
  },
  methods: {
    // 获取当前日期
    getCurrentDay() {
      let y = new Date().getFullYear();
      let m = new Date().getMonth() + 1;
      let d = new Date().getDate();
      let khDay =
        y.toString() +
        "-" +
        this.addZero(m.toString()) +
        "-" +
        this.addZero(d.toString());
      return khDay;
    },
    addZero(num) {
      return num < 10 ? "0" + num : num;
    },
    async getDayInfo() {
      console.log("开始请求数据");

      try {
        let zhishi = this.modeId;
        let loginNo = this.loginNo;
        let khDay = this.khDay;
        if (khDay == "") {
          khDay = this.getCurrentDay();
        }
        // fileType 断站类型1:断站日报,11:小区日报
        let postData = { zhishi, khDay, loginNo, fileType: 1 };
        this.getDayDZ(postData);
        // 修改fileType发起第二次请求
        let postData2 = { zhishi, khDay, loginNo, fileType: 11 };
        this.getDayXQ(postData2);
      } catch (error) {
        console.log("日报数据请求失败");
      }
    },
    async getDayDZ(postData) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      await this.$store.dispatch(
        "ydNetworkAssess/getDay",
        JSON.stringify(postData)
      );
      $("#tabjz").show();
      let result = this.dayInfo;
      console.log("断站数据", result);
      if (result.operationSuccessFlag) {
        let khBean = result.ifmTDwKhBean;
        $("#dzscspm").text("断站时长市排名：" + khBean.rankTotal);
        $("#dzscxwgpm").text("断站时长小网格排名：" + khBean.rankXwg);
        $("#dzlxwgpm").text("断站率小网格排名：" + khBean.rankDuan);
        $("#jzs").text(khBean.totalCount);
        $("#dzs").text(khBean.count + "（" + khBean.ringRatio + "）");
        $("#dzsylj").text(khBean.monthCount);
        $("#dzsc").text(khBean.shichang);
        $("#dzscylj").text(khBean.monthShichang);
        $("#dzl").text(khBean.rate);
        $("#dzlylj").text(khBean.monthRate);
        //折线图数据
        let rateLists = result.ifmAssessRateBeanList;
        let labArr = new Array();
        let dataArr = new Array(); //日期
        let dataTotalRatio = new Array(); //断站率+断小区率/日
        let dataIndexPrice = new Array(); //当月至今累计断站率和断小区率/日
        let dataXiaoquShichangAvg = new Array(); //断小区平均时长
        let dataDuanzhanShichangAvg = new Array(); //断站平均时长
        let dataDzScPrice = new Array(); //断站平均时长达标率
        let dataDxqScPrice = new Array(); //断小区平均时长达标率
        for (let i in rateLists) {
          labArr.push(rateLists[i].date);
          dataArr.push(rateLists[i].rate);
          dataTotalRatio.push(rateLists[i].totalRatio);
          dataIndexPrice.push(rateLists[i].indexPrice);
          dataXiaoquShichangAvg.push(rateLists[i].xiaoquShichangAvg);
          dataDuanzhanShichangAvg.push(rateLists[i].duanzhanShichangAvg);
          dataDzScPrice.push(rateLists[i].dzScPrice);
          dataDxqScPrice.push(rateLists[i].dxqScPrice);
        }
        //断站断小区
        // let myDzDxqChart = echarts.init(document.getElementById("dzDxqData"));
        let myDzDxqChart = echarts.getInstanceByDom(
          document.getElementById("dzDxqData")
        );
        if (myDzDxqChart == null) {
          myDzDxqChart = echarts.init(document.getElementById("dzDxqData"));
        }
        //指定图表的配置项和数据
        let optionDzDxq = {
          grid: {
            x: 30,
            y: 60,
            x2: 10,
            y2: 25,
          },
          //x轴
          xAxis: {
            axisLabel: {
              interval: 0,
              rotate: 40,
            },
            data: labArr,
          },
          //y轴没有显式设置，根据值自动生成y轴
          yAxis: {
            name: "(%)",
            axisLabel: {
              interval: 0,
            },
          },
          legend: {
            data: ["断站率(日)", "累计断站率(月)", "达标率"],
          },
          //数据-data是最终要显示的数据
          series: [
            {
              name: "断站率(日)",
              type: "bar",
              //symbol: "none", 是否显示折点
              lineStyle: {
                color: "rgba(220,220,220,1)",
              },

              areaStyle: {
                color: "rgba(220,220,220,0.2)",
              },
              data: dataArr,
            },
            {
              name: "累计断站率(月)",
              type: "line",
              //symbol: "none", 是否显示折点
              lineStyle: {
                color: "rgba(48,92,253,1)",
              },

              /*
                            areaStyle:{
						    	normal:{
						          	color:"rgba(48,92,253,0.2)"
						        }
						    },*/
              data: dataTotalRatio,
            },
            {
              name: "达标率",
              type: "line",
              symbol: "none", //是否显示折点
              lineStyle: {
                color: "rgba(255,0,0,1)",
              },
              /*
                            areaStyle:{
						    	normal:{
						          	color:"rgba(220,220,220,0.2)"
						        }
						    },*/
              data: dataIndexPrice,
            },
          ],
        };
        //使用刚刚指定的配置项和数据项显示图表
        myDzDxqChart.setOption(optionDzDxq);

        //断站
        // let myDzChart = echarts.init(document.getElementById("dzData"));
        let myDzChart = echarts.getInstanceByDom(
          document.getElementById("dzData")
        );
        if (myDzChart == null) {
          myDzChart = echarts.init(document.getElementById("dzData"));
        }
        //指定图表的配置项和数据
        let optionDz = {
          grid: {
            x: 30,
            y: 60,
            x2: 10,
            y2: 25,
          },
          //x轴
          xAxis: {
            axisLabel: {
              interval: 0,
              rotate: 40,
            },
            data: labArr,
          },
          //y轴没有显式设置，根据值自动生成y轴
          yAxis: {
            name: "(%)",
            axisLabel: {
              interval: 0,
            },
          },
          legend: {
            data: ["断站平均时长", "达标率"],
          },
          //数据-data是最终要显示的数据
          series: [
            {
              name: "断站平均时长",
              type: "line",
              //symbol: "none", 是否显示折点
              lineStyle: {
                color: "rgba(48,92,253,1)",
              },

              /*
                            areaStyle:{
						    	normal:{
						          	color:"rgba(48,92,253,0.2)"
						        }
						    },*/
              data: dataDuanzhanShichangAvg,
            },
            {
              name: "达标率",
              type: "line",
              symbol: "none", //是否显示折点
              lineStyle: {
                color: "rgba(255,0,0,1)",
              },
              /*
                            areaStyle:{
						    	normal:{
						          	color:"rgba(220,220,220,0.2)"
						        }
						    },*/
              data: dataDzScPrice,
            },
          ],
        };
        //使用刚刚指定的配置项和数据项显示图表
        myDzChart.setOption(optionDz);

        //断小区
        // let myDxqChart = echarts.init(document.getElementById("dxqData"));
        let myDxqChart = echarts.getInstanceByDom(
          document.getElementById("dxqData")
        );
        if (myDxqChart == null) {
          myDxqChart = echarts.init(document.getElementById("dxqData"));
        }
        //指定图表的配置项和数据
        let optionDxq = {
          grid: {
            x: 30,
            y: 60,
            x2: 10,
            y2: 25,
          },
          //x轴
          xAxis: {
            axisLabel: {
              interval: 0,
              rotate: 40,
            },
            data: labArr,
          },
          //y轴没有显式设置，根据值自动生成y轴
          yAxis: {
            name: "(%)",
            axisLabel: {
              interval: 0,
            },
          },
          legend: {
            data: ["断小区平均时长", "达标率"],
          },
          //数据-data是最终要显示的数据
          series: [
            {
              name: "断小区平均时长",
              type: "line",
              //symbol: "none", 是否显示折点
              lineStyle: {
                color: "rgba(48,92,253,1)",
              },

              /*
                            areaStyle:{
						    	normal:{
						          	color:"rgba(48,92,253,0.2)"
						        }
						    },*/
              data: dataDuanzhanShichangAvg,
            },
            {
              name: "达标率",
              type: "line",
              symbol: "none", //是否显示折点
              lineStyle: {
                color: "rgba(255,0,0,1)",
              },
              /*
                            areaStyle:{
						    	normal:{
						          	color:"rgba(220,220,220,0.2)"
						        }
						    },*/
              data: dataDxqScPrice,
            },
          ],
        };
        //使用刚刚指定的配置项和数据项显示图表
        myDxqChart.setOption(optionDxq);
      }
    },
    async getDayXQ(postData2) {
      await this.$store.dispatch(
        "ydNetworkAssess/getDay",
        JSON.stringify(postData2)
      );
      $("#tabxq").show();
      let result = this.dayInfo;
      console.log("小区数据", result);
      if (result.operationSuccessFlag) {
        let khBean = result.ifmTDwKhBean;
        $("#xqs").text(khBean.totalCount);
        $("#dxqscspm").text("断小区市排名：" + khBean.rankTotal);
        $("#dxqscxwgpm").text("断小区小网格排名：" + khBean.rankXwg);
        $("#dxqlxwgpm").text("断小区率小网格排名：" + khBean.rankDuan);
        $("#dxqs").text(khBean.count + "（" + khBean.ringRatio + "）");
        $("#dxqsylj").text(khBean.monthCount);
        $("#dxqsc").text(khBean.shichang);
        $("#dxqscylj").text(khBean.monthShichang);
        $("#dxql").text(khBean.rate);
        $("#dxqlylj").text(khBean.monthRate);
      }
    },
  },
  mounted() {},
};
</script>

<style scoped lang="less">
</style>