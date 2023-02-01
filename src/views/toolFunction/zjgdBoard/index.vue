<template>
  <div style="padding-bottom: 12px">
    <MyHeader
      :name="'智家工单看板'"
      left="arrow-left"
      @goBackEv="$router.go(-1)"
    />
    <table>
      <tr>
        <th>今日抢单数</th>
        <td>{{ grabToday }}</td>
      </tr>
      <tr>
        <th>本周抢单数</th>
        <td>{{ grabWeek }}</td>
      </tr>
      <tr>
        <th>本月抢单数</th>
        <td>{{ grabMonth }}</td>
      </tr>
    </table>
    <!-- 15天内抢单数 -->
    <div class="chart" id="grad"></div>
    <!-- 未完成 -->
    <div class="chart" id="unFinish"></div>
    <!-- 已完成 -->
    <div class="chart" id="finish"></div>
  </div>
</template>

<script>
import { ZhiJiaKanBanApi } from "@/http/tools";
import * as echarts from "echarts";
export default {
  name: "ZjgdBoard",
  data() {
    return {
      grabToday: null,
      grabWeek: null,
      grabMonth: null,
      grabDate: [], // 15日内抢单
      unFinishData: [], // 未完成
      finishData: [], // 已完成
    };
  },
  mounted() {
    this.getKanBanList();
    setTimeout(() => {
      this.grabNumEcharts();
      this.unFinishEcharts();
      this.finishEcharts();
    }, 1000);
  },
  created() {},
  methods: {
    finishEcharts() {
      let myChart = echarts.init(document.getElementById("finish"));
      let option = {
        title: {
          text: "近15天竣工统计",
          left: "center",
          top: "12px",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          y: "bottom",
        }, // 不同系列的标志
        grid: {
          left: "3%",
          bottom: "9%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            name: "日",
            data: this.finishData[0],
            axisLabel: {
              interval: 0, // 数据全部展示
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "数量",
          },
        ],
        series: [
          {
            name: "修机",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: this.formateNum(this.finishData[2]),
          },
          {
            name: "装机",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: this.formateNum(this.finishData[1]),
          },
        ],
      };
      myChart.setOption(option);
    },
    unFinishEcharts() {
      let myChart = echarts.init(document.getElementById("unFinish"));
      let option = {
        title: {
          text: "未竣工统计",
          left: "center",
          top: "12px",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          y: "bottom",
        }, // 不同系列的标志
        grid: {
          left: "3%",
          right: "4%",
          bottom: "9%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.unFinishData[0],
            axisLabel: {
              interval: 0, // 数据全部展示
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "修机",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: this.formateNum(this.unFinishData[2]),
          },
          {
            name: "装机",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: this.formateNum(this.unFinishData[1]),
          },
        ],
      };
      myChart.setOption(option);
    },
    grabNumEcharts() {
      let myChart = echarts.init(document.getElementById("grad"));
      let option = {
        title: {
          text: "近15天内抢单统计",
          left: "center",
          top: "12px",
        },
        grid: {
          bottom: "0",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          name: "日",
          data: this.grabDate[0],
          axisLabel: {
            interval: 0, // 数据全部展示
            // rotate: -50, // 数据倾斜展示
          },
        },
        yAxis: {
          type: "value",
          name: "数量",
        },
        series: [
          {
            data: this.formateNum(this.grabDate[1]),
            type: "line",
          },
        ],
      };
      myChart.setOption(option);
    },
    formateNum(arr) {
      let newArr = [];
      if (arr.length > 0) {
        arr.forEach((e) => {
          e == null ? newArr.push(0) : newArr.push(Number(e));
        });
      }
      return newArr;
    },
    async getKanBanList() {
      let data = await ZhiJiaKanBanApi(JSON.stringify({}));
      console.log("智家工单看板返回数据", data);
      this.grabToday = data.grabToday;
      this.grabWeek = data.grabWeek;
      this.grabMonth = data.grabMonth;
      this.grabDate = data.grabNum;
      this.unFinishData = data.unFinish;
      this.finishData = data.finish;
    },
  },
};
</script>

<style scoped lang="less">
table {
  width: 100%;
  font-size: 12px;
  color: #333333;
  border: 1px solid #999999;
  border-collapse: collapse;
  th,
  td {
    padding: 8px;
    border: 1px solid #999999;
  }
  th {
    background: #f7faff;
  }
  td {
    background: #ffffff;
    text-align: left;
  }
}
.chart {
  width: 100%;
  height: 300px;
  margin-bottom: 12px;
  border-top: 1px solid #eee;
}
</style>
