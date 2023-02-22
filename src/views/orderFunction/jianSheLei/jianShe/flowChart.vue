<template>
  <div class="flowChart">
    <MyHeader name="任务进度" left="arrow-left" @goBackEv="goBackFn" />
    <div id="mountNode"></div>
  </div>
</template>

<script>
import { reqYwjsTaskSchedule } from "@/http/button";
import { getItem } from "@/utils/public/sessionStorage";
import G6 from "@antv/g6";
import $ from "jquery";
export default {
  name: "FlowChart",
  data() {
    return {
      colorList: [], // 节点对应背景颜色
    };
  },
  methods: {
    // 回退
    goBackFn() {
      this.$router.go(-1);
    },
    // 获取任务进度
    async getTaskSchedule() {
      let orderType = getItem("currYwjsOrderType");
      let siteName = "";
      let uniqueIdentification = this.$route.query.uniqueIdentification;
      let phySiteId = "";
      let taskId = this.$route.query.taskId;
      let postData = {
        orderType,
        siteName,
        uniqueIdentification,
        phySiteId,
        taskId,
      };
      let result = await reqYwjsTaskSchedule(JSON.stringify(postData));
      console.log("获取任务进度结果", result);
      this.apiResponse(result, ".flowChart", () => {
        // 获取进度节点对应颜色-stepStatus为1变蓝，为0变绿
        // if (orderType == '1') {}
        // 选择宏站-13个节点
        result.scheduleList.forEach((item) => {
          if (item.stepStatus == "0") {
            this.colorList.push("green");
          } else if (item.stepStatus == "1") {
            this.colorList.push("blue");
          } else {
            this.colorList.push("sql");
          }
        });

        $("#mountNode").empty();
        this.drawGraph();
        // 选择室分-14个节点（多一个分布入网）
      });
    },
    // 画图
    drawGraph() {
      let pgWidth = document.body.clientWidth;
      if (pgWidth > 640) pgWidth = 640;
      let nodeSpacing = 20;
      let nodeHeight = 40;
      let fontSize = 12;
      let fillColor = "#fff"; // 填充颜色 #95dcbe
      let strokeColor = "#97a09a"; // 边框颜色
      if (pgWidth < 350) fontSize = 10;
      let publicNodes = [
        {
          id: "1",
          x: pgWidth / 2,
          y: 50,
          type: "circle",
          label: "任务下达",
          size: 50,
          style: {
            fill: "#09c990", // 节点标签颜色
            stroke: "#97a09a",
          },
          labelCfg: {
            style: {
              fill: "#fff", // 节点标签文字颜色
              fontWeight: 600,
            },
          },

          anchorPoints: [[0.5, 1]],
        },
        {
          id: "2",
          name: "基站设备方案制定",
          x: 0,
          y: 130,
          type: this.colorList[1],
          anchorPoints: [
            [0.5, 0],
            [0.5, 1],
          ],
        },
        {
          id: "3",
          name: "传输设备方案制定",
          x: pgWidth / 3 + nodeSpacing / 2,
          y: 130,
          type: this.colorList[2],
          anchorPoints: [
            [0.5, 0],
            [0.5, 1],
          ],
        },
        {
          id: "4",
          name: "接入光缆方案制定",
          x: pgWidth - (pgWidth / 3 - nodeSpacing),
          y: 130,
          type: this.colorList[3],
          anchorPoints: [
            [0.5, 0],
            [0.5, 1],
          ],
        },
        {
          id: "5",
          name: "基站设备工程实施",
          x: 0,
          y: 200,
          type: this.colorList[4],
          anchorPoints: [[0.5, 1]],
        },
        {
          id: "6",
          name: "传输设备工程实施",
          x: pgWidth / 3 + nodeSpacing / 2,
          y: 200,
          type: this.colorList[5],
          anchorPoints: [
            [0.5, 1],
            [0.5, 1],
          ],
        },
        {
          id: "7",
          name: "接入光缆工程实施",
          x: pgWidth - (pgWidth / 3 - nodeSpacing),
          y: 200,
          type: this.colorList[6],
          anchorPoints: [
            [0.5, 1],
            [0.5, 1],
          ],
        },
        {
          id: "8",
          name: "无线数据配置及\n制作",
          x: 0,
          y: 300,
          type: this.colorList[7],
          anchorPoints: [
            [0.5, 0],
            [0.5, 1],
          ],
        },
        {
          id: "9",
          name: "承载数据配置及\n制作",
          x: pgWidth / 2 + nodeSpacing / 2,
          y: 300,
          type: this.colorList[8],
          anchorPoints: [
            [0.5, 0],
            [0.5, 1],
          ],
        },
        {
          id: "10",
          name: "前传光缆搭接",
          x: pgWidth / 3 + nodeSpacing / 2,
          y: 400,
          type: this.colorList[9],
          anchorPoints: [
            [0.5, 0],
            [0.5, 1],
          ],
        },
        {
          id: "11",
          name: "开通入网",
          x: pgWidth / 3 + nodeSpacing / 2,
          y: 480,
          type: this.colorList[10],
          anchorPoints: [
            [0.5, 0],
            [0.5, 1],
          ],
        },
      ];
      let publicEges = [
        {
          source: "1", //起点id
          target: "2", //目标点id
        },
        {
          source: "1",
          target: "3",
        },
        {
          source: "1",
          target: "4",
        },
        {
          source: "2",
          target: "5",
        },
        {
          source: "3",
          target: "6",
        },
        {
          source: "4",
          target: "7",
        },
        {
          source: "5",
          target: "8",
        },
        {
          source: "6",
          target: "9",
        },
        {
          source: "7",
          target: "9",
        },
        {
          source: "8",
          target: "10",
        },
        {
          source: "9",
          target: "10",
        },
        {
          source: "10",
          target: "11",
        },
        {
          source: "11",
          target: "12",
        },
        {
          source: "12",
          target: "13",
        },
      ];
      let dataHZ = {
        //节点
        nodes: [
          ...publicNodes,
          {
            id: "12",
            name: "交维交资",
            x: pgWidth / 3 + nodeSpacing / 2,
            y: 560,
            type: this.colorList[11],
            anchorPoints: [
              [0.5, 0],
              [0.5, 1],
            ],
          },
          {
            id: "13",
            label: "归档/作废",
            x: pgWidth / 2,
            y: 670,
            type: "circle",
            size: 60,
            style: {
              fill: "#fff",
              stroke: "#97a09a",
            },
            labelCfg: {
              style: {
                fontWeight: 600,
              },
            },
            anchorPoints: [[0.5, 0]],
          },
        ],
        //边
        edges: publicEges,
      };
      let dataSF = {
        //节点
        nodes: [
          ...publicNodes,
          {
            id: "12",
            name: "分布入网",
            x: pgWidth / 3 + nodeSpacing / 2,
            y: 560,
            type: this.colorList[11],
            anchorPoints: [
              [0.5, 0],
              [0.5, 1],
            ],
          },
          {
            id: "13",
            name: "交维交资",
            x: pgWidth / 3 + nodeSpacing / 2,
            y: 640,
            type: this.colorList[12],
            anchorPoints: [
              [0.5, 0],
              [0.5, 1],
            ],
          },
          {
            id: "14",
            label: "归档/作废",
            x: pgWidth / 2,
            y: 750,
            type: "circle",
            size: 60,
            style: {
              fill: "#95dcbe",
              stroke: "#97a09a",
            },
            labelCfg: {
              style: {
                fontWeight: 600,
              },
            },
            anchorPoints: [[0.5, 0]],
          },
        ],
        //边
        edges: [
          ...publicEges,
          {
            source: "13",
            target: "14",
          },
        ],
      };
      // 默认矩形大小

      // 默认样式
      G6.registerNode(
        "sql",
        {
          drawShape(cfg, group) {
            const rect = group.addShape("rect", {
              attrs: {
                // x: -60,
                // y: -25,
                width: pgWidth / 3 - nodeSpacing, //120
                height: nodeHeight,
                radius: 10,
                stroke: strokeColor,
                fill: fillColor,
                lineWidth: 2,
              },
              name: "rect-shape",
            });
            if (cfg.name) {
              const name = cfg.name;
              group.addShape("text", {
                attrs: {
                  text: name,
                  x: (pgWidth / 3 - nodeSpacing) / 2,
                  y: nodeHeight / 2,
                  fill: "#333",
                  fontSize: fontSize,
                  textAlign: "center",
                  textBaseline: "middle",
                  fontWeight: "600",
                },
                name: "text-shape",
              });
            }
            return rect;
          },
        },
        "single-node"
      );
      // 变绿样式
      G6.registerNode(
        "green",
        {
          drawShape(cfg, group) {
            const rect = group.addShape("rect", {
              attrs: {
                width: pgWidth / 3 - nodeSpacing, //120
                height: nodeHeight,
                radius: 10,
                stroke: strokeColor,
                fill: "#00dc85",
                lineWidth: 2,
              },
              name: "rect-shape",
            });
            if (cfg.name) {
              const name = cfg.name;
              group.addShape("text", {
                attrs: {
                  text: name,
                  x: (pgWidth / 3 - nodeSpacing) / 2,
                  y: nodeHeight / 2,
                  fill: "#fff",
                  fontSize: fontSize,
                  textAlign: "center",
                  textBaseline: "middle",
                  fontWeight: "600",
                },
                name: "text-shape",
              });
            }
            return rect;
          },
        },
        "single-node"
      );
      // 变蓝样式
      G6.registerNode(
        "blue",
        {
          drawShape(cfg, group) {
            const rect = group.addShape("rect", {
              attrs: {
                width: pgWidth / 3 - nodeSpacing, //120
                height: nodeHeight,
                radius: 10,
                stroke: strokeColor,
                fill: "#559dff",
                lineWidth: 2,
              },
              name: "rect-shape",
            });
            if (cfg.name) {
              const name = cfg.name;
              group.addShape("text", {
                attrs: {
                  text: name,
                  x: (pgWidth / 3 - nodeSpacing) / 2,
                  y: nodeHeight / 2,
                  fill: "#fff",
                  fontSize: fontSize,
                  textAlign: "center",
                  textBaseline: "middle",
                  fontWeight: "600",
                },
                name: "text-shape",
              });
            }
            return rect;
          },
        },
        "single-node"
      );

      let graph = new G6.Graph({
        container: "mountNode", // 指定挂载点
        // 画布宽高
        width: pgWidth,
        height: 800,
        defaultNode: {
          type: "sql",
        },
        //边的样式配置
        defaultEdge: {
          type: "polyline",
          // 边样式配置
          style: {
            stroke: "000", // 连接线颜色
            lineWidth: 2,
          },
        },

        // fitView: true, // 开启画布自适应
      });
      //读取数据
      // 室分多一个分布入网的节点
      if (getItem("currYwjsOrderType") == "1") {
        this.graphData = dataHZ;
      } else {
        this.graphData = dataSF;
      }
      graph.data(this.graphData);
      // 渲染图
      graph.render();
    },
  },
  created() {
    // 获取任务进度
    this.getTaskSchedule();
  },
  mounted() {
    // 流程图
    this.drawGraph();
  },
};
</script>

<style scoped lang="less">
</style>