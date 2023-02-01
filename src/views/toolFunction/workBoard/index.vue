<template>
  <div class="workBoard">
    <!-- 建设工单看板 -->
    <MyHeader :name="name" @goBackEv="goBack" left="arrow-left" />
    <div class="setting">
      <div class="workOrder">
        <van-button
          type="default"
          v-for="item in workOrderList"
          :key="item.id"
          @click="clickWorkOrder(item)"
          :class="workOrder == item.id ? '' : 'unActiveWorkOrder'"
          >{{ item.name }}</van-button
        >
      </div>
      <div class="bgPlate"></div>
      <div class="netTotal">
        <div class="title">
          <span>{{ netTotalTitle }}本月基站入网总数</span>
          <span>{{ date }}</span>
        </div>
        <div class="content">{{ orderNum }}</div>
      </div>
      <div class="transitOrder">
        <h3>在途工单</h3>
        <!--  <div class="mode">
          <span class="netZhishi">网络制式</span>
          <div class="zhishiRegion">
            <van-button
              type="default"
              v-for="item in netModeList"
              :key="item.id"
              @click="clickNetMode(item)"
              :class="netMode == item.id ? 'activeButton' : ''"
              >{{ item.name }}</van-button
            >
          </div>
        </div> -->
        <div class="menuList">
          <div class="menu">
            <span>网络制式</span>
            <div class="after" @click="showNetMode = true">
              <input
                type="text"
                readonly
                v-model="netModeName"
                placeholder="全部"
              />
            </div>
            <van-action-sheet
              v-model="showNetMode"
              cancel-text="取消"
              :round="false"
              :actions="netModeList"
              close-on-click-action
              @select="onSelectNetMode"
            />
          </div>
          <div class="menu">
            <span>需求来源</span>
            <div class="after" @click="showSource = true">
              <input
                type="text"
                readonly
                v-model="sourceName"
                placeholder="全部"
              />
            </div>
            <van-action-sheet
              v-model="showSource"
              cancel-text="取消"
              :round="false"
              :actions="sourceOption"
              close-on-click-action
              @select="onSelectSource"
            />
          </div>
        </div>
      </div>
    </div>
    <div id="mountNode"></div>
    <div class="personal">
      <h3>我的</h3>
      <div
        class="jizhan"
        v-for="(item, index) in jizhanCountList.length == 0
          ? defaultJizhanCountList
          : jizhanCountList"
        :key="index"
      >
        <div class="leftSide"></div>
        <div class="content">
          <div class="stepRegion">
            <span class="stepName">{{ item.stepName }}</span>
            <span class="orderNum">{{ item.orderNum }}</span>
          </div>
          <div class="rejectRegion">
            <span class="rejectName">驳回</span>
            <span class="rejectNum">{{ item.rejectOrderNum }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import G6 from "@antv/g6";
import { mapState } from "vuex";
import $ from "jquery";
import { getItem } from "@/utils/sessionStorage";
export default {
  name: "WorkBoard",
  data () {
    return {
      name: "建设工单看板",
      // loginNo: "huangyy2", // getItem("loginNo"), //qiwm1 huangyy2
      loginNo: getItem("loginNo"), // getItem("loginNo"), //qiwm1 huangyy2
      // 切换宏站 室分
      workOrder: 0,
      workOrderList: [
        { name: "宏站", id: 0 },
        { name: "室分", id: 1 },
      ],
      // 当前日期
      date: "",
      // 完工工单数
      orderNum: "",
      // 网络制式 // 全部为空字符串
      netMode: 0,
      netModeName: '',
      showNetMode: false,
      netModeList: [
        { name: "WCDMA", id: 1 },
        { name: "FDD", id: 2 },
        { name: "NB", id: 3 },
        { name: "TDD", id: 4 },
        { name: "5G", id: 5 },
      ],
      // 需求来源
      sourceId: "", // 全部为空字符串
      sourceName: '',
      showSource: false,
      sourceOption: [
        { name: "校园营销", value: "1" },
        { name: "路测", value: "2" },
        { name: "投诉", value: "3" },
        { name: "MR", value: "4" },
        { name: "交通干线", value: "5" },
        { name: "深度覆盖", value: "6" },
        { name: "市场需求", value: "7" },
        { name: "PF优化", value: "8" },
        { name: "三方测评", value: "9" },
        { name: "市政灯杆拆站", value: "10" },
        { name: "拆站重选", value: "11" },
        { name: "差小区处理", value: "12" },
        { name: "公司集团客户需求", value: "13" },
        { name: "副中心重点项目", value: "14" },
        { name: "新机场重点项目", value: "15" },
        { name: "冬奥会重点项目", value: "16" },
        { name: "其他", value: "17" },
        { name: "拆复建", value: "18" },
        { name: "市场支撑", value: "19" },
      ],
      // 基站数据
      jizhanCountList: [],
      // 默认基站数据
      defaultJizhanCountList: [
        {
          rejectOrderNum: "0",
          stepName: "--",
          orderNum: "0",
          type: "",
        },
        {
          rejectOrderNum: "0",
          stepName: "--",
          orderNum: "0",
          type: "",
        },
        {
          rejectOrderNum: "0",
          stepName: "--",
          orderNum: "0",
          type: "",
        },
        {
          rejectOrderNum: "0",
          stepName: "--",
          orderNum: "0",
          type: "",
        },
      ],
      orderNumList: [],
      // 流程图
      graphData: [],
    };
  },
  computed: {
    ...mapState("workBoard", ["jizhanInfo", "orderNumInfo"]),
    // 入网总数
    netTotalTitle () {
      return this.workOrderList[this.workOrder].name;
    },
  },
  methods: {
    // 回退
    goBack () {
      this.$router.go(-1);
    },
    // 宏站 室分
    clickWorkOrder (item) {
      this.workOrder = item.id;
      this.sourceId = "";
      this.sourceName = ''
      this.netMode = 0;
      this.netModeName = ''
      // 切换对应完工工单数
      this.getOrderNum();
      // 切换宏站和室分按钮；对应的需求来源要更换
      if (item.id == 0) {
        // 点击宏站
        this.sourceOption = [
          { name: "校园营销", value: "1" },
          { name: "路测", value: "2" },
          { name: "投诉", value: "3" },
          { name: "MR", value: "4" },
          { name: "交通干线", value: "5" },
          { name: "深度覆盖", value: "6" },
          { name: "市场需求", value: "7" },
          { name: "PF优化", value: "8" },
          { name: "三方测评", value: "9" },
          { name: "市政灯杆拆站", value: "10" },
          { name: "拆站重选", value: "11" },
          { name: "差小区处理", value: "12" },
          { name: "公司集团客户需求", value: "13" },
          { name: "副中心重点项目", value: "14" },
          { name: "新机场重点项目", value: "15" },
          { name: "冬奥会重点项目", value: "16" },
          { name: "其他", value: "17" },
          { name: "拆复建", value: "18" },
          { name: "市场支撑", value: "19" },
        ];
      } else if (item.id == 1) {
        // 点击室分
        this.sourceOption = [
          { name: "市场支撑", value: "0" },
          { name: "专项优化", value: "1" },
          { name: "普通投诉", value: "2" },
          { name: "升级投诉", value: "3" },
          { name: "微博", value: "4" },
          { name: "工信部", value: "5" },
          { name: "市政府热线转办", value: "6" },
          { name: "大客户移动业务障碍申报", value: "7" },
          { name: "公司集团客户部需求", value: "8" },
          { name: "市长热线", value: "9" },
          { name: "VIP投诉", value: "10" },
          { name: "网格需求", value: "11" },
          { name: "深度覆盖", value: "12" },
          { name: "校园专项", value: "13" },
          { name: "分公司集客部名单大客户", value: "14" },
          { name: "通信重保", value: "15" },
          { name: "专业市场支撑", value: "16" },
          { name: "其他", value: "17" },
          { name: "拆复建", value: "18" },
          { name: "副中心重点项目", value: "19" },
          { name: "新机场重点项目", value: "20" },
          { name: "冬奥会重点项目", value: "21" },
          { name: "电信需求", value: "22" },
        ];
      }
      // 更改流程图
      // 删除上一个canvas
      $("#mountNode").empty();
      this.drawGraph();
      // 发送请求
      this.getJizhanList();
    },
    // 网络制式
    /*   clickNetMode(item) {
      this.netMode = item.id;
      // 发送请求
      this.getJizhanList();
    }, */
    // 选择网络制式
    onSelectNetMode (item) {
      this.showNetMode = false
      this.netMode = item.id
      this.netModeName = item.name
      this.getJizhanList();
    },
    // 循环需求来源
    onSelectSource (item) {
      this.showSource = false
      this.sourceName = item.name
      this.sourceId = item.value
      this.getJizhanList();
    },
    addZero (num) {
      return num < 10 ? "0" + num : num;
    },
    // 获取当前日期
    getCurrentDate () {
      let date = new Date();
      this.date = `${date.getFullYear()}-${this.addZero(date.getMonth() + 1)}`;
    },
    async getOrderNum () {
      let orderType = (this.workOrder + 1).toString();
      let loginNo = this.loginNo;
      let postData = { orderType, loginNo };
      try {
        await this.$store.dispatch(
          "workBoard/getOrderNumInfo",
          JSON.stringify(postData)
        );
        let result = this.orderNumInfo;
        if (result.operationSuccessFlag) {
          this.orderNum = result.orderNum;
          this.date = result.time;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getJizhanList () {
      let loginNo = this.loginNo;
      let requirement = this.sourceId;
      let type = (this.workOrder + 1).toString();
      let netWork = this.netMode.toString();
      if (netWork == 0) netWork = "";
      let postData = { loginNo, requirement, type, netWork };
      try {
        await this.$store.dispatch(
          "workBoard/getJizhanInfo",
          JSON.stringify(postData)
        );
        let result = this.jizhanInfo;
        console.log("响应数据", result);
        if (result.operationSuccessFlag) {
          let consLinkCountList = result.consLinkCountList;
          let jizhanCountList = result.jizhanCountList;
          jizhanCountList.forEach((item) => {
            if (item.rejectOrderNum == "") {
              item.rejectOrderNum = "--";
            }
          });
          this.jizhanCountList = jizhanCountList;
          // 宏站数组长度11 室分数组长度12 多一个分布入网
          if (consLinkCountList.length == 11) {
            // 没有分布入网
            let stepNameList = [
              "基站设备方案制定",
              "传输设备方案制定",
              "接入光缆方案制定",
              "基站设备工程实施",
              "传输设备工程实施",
              "接入光缆工程实施",
              "无线数据配置及制作",
              "承载数据配置及制作",
              "前传光缆搭接",
              "开通入网",
              "交维交资",
            ];
            let orderNumList = [];
            stepNameList.forEach((name) => {
              consLinkCountList.forEach((item) => {
                if (name == item.stepName) {
                  orderNumList.push("\n" + item.orderNum);
                }
              });
            });

            this.orderNumList = orderNumList;
            // console.log(orderNumList);
            $("#mountNode").empty();
            this.drawGraph();
          } else if (consLinkCountList.length == 12) {
            // 有分布入网
            let stepNameList = [
              "基站设备方案制定",
              "传输设备方案制定",
              "接入光缆方案制定",
              "基站设备工程实施",
              "传输设备工程实施",
              "接入光缆工程实施",
              "无线数据配置及制作",
              "承载数据配置及制作",
              "前传光缆搭接",
              "开通入网",
              "分布入网",
              "交维交资",
            ];
            let orderNumList = [];
            stepNameList.forEach((name) => {
              consLinkCountList.forEach((item) => {
                if (name == item.stepName) {
                  orderNumList.push("\n" + item.orderNum);
                }
              });
            });

            this.orderNumList = orderNumList;
            // console.log(orderNumList);
            $("#mountNode").empty();
            this.drawGraph();
          }
        }
      } catch (error) {
        console.log("建设 基站数据获取失败", error);
        // 获取不到数据时设置orderNumList为空字符串
        // for (let i = 1; i < 13; i++) {
        //   this.orderNumList.push("");
        // }
      }
      // 模拟数据
      /* (this.jizhanCountList = [
        {
          rejectOrderNum: "0",
          stepName: "--",
          orderNum: "0",
          type: "",
        },
        {
          rejectOrderNum: "0",
          stepName: "--",
          orderNum: "0",
          type: "",
        },
        {
          rejectOrderNum: "0",
          stepName: "--",
          orderNum: "0",
          type: "",
        },
        {
          rejectOrderNum: "0",
          stepName: "--",
          orderNum: "0",
          type: "",
        },
      ]),
        (this.orderNumList = [
          "\n133",
          "\n1",
          "\n0",
          "\n0",
          "\n0",
          "\n0",
          "\n0",
          "\n0",
          "\n0",
          "\n0",
          "\n0",
          "\n",
        ]); */
    },
    drawGraph () {
      // 判断orderNumList内是否有数据
      if (this.orderNumList.length == 0) {
        for (let i = 1; i < 13; i++) {
          this.orderNumList.push("");
        }
      }
      let pgWidth = document.body.clientWidth;
      if (pgWidth > 640) pgWidth = 640;
      let nodeSpacing = 10; // 30
      let nodeHeight = 40;
      let fontSize = 12;
      let fillColor = "#95dcbe";
      let strokeColor = "#97a09a";
      if (pgWidth < 350) fontSize = 10;
      // 层节点
      let firstY = 40;
      let secondY = 130;
      let thirdY = 200;
      let fourthY = 300;
      let fifthY = 400;
      let sixthY = 480;
      let seventhY = 560;
      // 列节点
      let firstX = 0;
      let secondX = pgWidth / 3 + nodeSpacing / 2;
      let thirdX = pgWidth - (pgWidth / 3 - nodeSpacing);
      let fourthX = pgWidth / 2 - nodeSpacing;
      let fifthX = (pgWidth - pgWidth / 2) / 2;

      let publicNodes = [
        {
          id: "1",
          x: pgWidth / 2,
          y: firstY,
          type: "circle",
          label: "任务下达",
          size: 60,
          style: {
            fill: "#95dcbe",
            stroke: "#97a09a",
            lineWidth: 2,
          },
          labelCfg: {
            style: {
              fontSize: fontSize,
              fontWeight: 600,
            },
          },

          anchorPoints: [[0.5, 1]],
        },
        {
          id: "2",
          name: "基站设备方案制定" + this.orderNumList[0],
          x: firstX,
          y: secondY,
          anchorPoints: [
            [0.5, 0],
            [0.5, 1],
          ],
        },
        {
          id: "3",
          name: "传输设备方案制定" + this.orderNumList[1],
          x: secondX,
          y: secondY,
          anchorPoints: [
            [0.5, 0],
            [0.5, 1],
          ],
        },
        {
          id: "4",
          name: "接入光缆方案制定" + this.orderNumList[2],
          x: thirdX,
          y: secondY,
          anchorPoints: [
            [0.5, 0],
            [0.5, 1],
          ],
        },
        {
          id: "5",
          name: "基站设备工程实施" + this.orderNumList[3],
          x: firstX,
          y: thirdY,
          anchorPoints: [[0.5, 1]],
        },
        {
          id: "6",
          name: "传输设备工程实施" + this.orderNumList[4],
          x: secondX,
          y: thirdY,
          anchorPoints: [[0.5, 1]],
        },
        {
          id: "7",
          name: "接入光缆工程实施" + this.orderNumList[5],
          x: thirdX,
          y: thirdY,
          anchorPoints: [[0.5, 1]],
        },
        {
          id: "8",
          name: "无线数据配置及制作" + this.orderNumList[6],
          x: firstX,
          y: fourthY,
          type: "middle",
          anchorPoints: [
            [0.45, 0],
            [0.45, 1],
          ],
        },
        {
          id: "9",
          name: "承载数据配置及制作" + this.orderNumList[7],
          x: fourthX,
          y: fourthY,
          type: "big",
          anchorPoints: [
            [0.5, 0],
            [0.5, 1],
          ],
        },
        {
          id: "10",
          name: "前传光缆搭接" + this.orderNumList[8],
          x: fifthX,
          y: fifthY,
          type: "big",
          anchorPoints: [
            [0.5, 0],
            [0.5, 1],
          ],
        },
        {
          id: "11",
          name: "开通入网" + this.orderNumList[9],
          x: fifthX,
          y: sixthY,
          type: "big",
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
            name: "交维交资" + this.orderNumList[10],
            x: fifthX,
            y: seventhY,
            type: "big",
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
              fill: "#95dcbe",
              stroke: "#97a09a",
              lineWidth: 2,
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
            name: "分布入网" + this.orderNumList[10],
            x: fifthX,
            y: seventhY,
            type: "big",
            anchorPoints: [
              [0.5, 0],
              [0.5, 1],
            ],
          },
          {
            id: "13",
            name: "交维交资" + this.orderNumList[11],
            x: fifthX,
            y: 640,
            type: "big",
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
              lineWidth: 2,
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
      G6.registerNode(
        "sql",
        {
          drawShape (cfg, group) {
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
                  x: (pgWidth / 3 - nodeSpacing) / 2, // 53
                  y: nodeHeight / 2,
                  fill: "#333",
                  fontSize: fontSize,
                  textAlign: "center",
                  textBaseline: "middle",
                  fontWeight: 600,
                },
                name: "text-shape",
              });
            }
            return rect;
          },
        },
        "single-node"
      );
      G6.registerNode(
        "middle",
        {
          drawShape (cfg, group) {
            const rect = group.addShape("rect", {
              attrs: {
                // x: -60,
                // y: -25,
                width: pgWidth / 3,
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
                  x: pgWidth / 3 / 2, // 70
                  y: 20,
                  fill: "#333",
                  fontSize: fontSize,
                  textAlign: "center",
                  textBaseline: "middle",
                  fontWeight: 600,
                },
                name: "text-shape",
              });
            }
            return rect;
          },
        },
        "single-node"
      );
      G6.registerNode(
        "big",
        {
          drawShape (cfg, group) {
            const rect = group.addShape("rect", {
              attrs: {
                // x: -60,
                // y: -25,
                width: pgWidth / 2,
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
                  x: pgWidth / 4, // 100
                  y: 20,
                  fill: "#333",
                  fontSize: fontSize,
                  textAlign: "center",
                  textBaseline: "middle",
                  fontWeight: 600,
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
        height: 750,
        defaultNode: {
          type: "sql",
        },
        //边的样式配置
        defaultEdge: {
          type: "polyline",
          // 边样式配置
          style: {
            stroke: strokeColor, // 边描边颜色
          },
        },
        /*  modes: {
          default: [
            "drag-canvas",
            "zoom-canvas",
            "click-select",
            {
              type: "tooltip",
              formatText(model) {
                const cfg = model.conf;
                const text = [];
                if (cfg)
                  cfg.forEach((row) => {
                    text.push(row.label + ":" + row.value + "<br>");
                  });
                return text.join("\n");
              },
              offset: 30,
            },
          ],
        }, */
        fitView: true, // 开启画布自适应
      });
      //读取数据
      // 室分多一个分布入网的节点
      if (this.workOrder == 1) {
        this.graphData = dataSF;
      } else {
        this.graphData = dataHZ;
      }
      graph.data(this.graphData);
      // 渲染图
      graph.render();

      // 滚动轴置顶
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
  },

  created () {
    // 获取当前日期
    // this.getCurrentDate();
    // 获取后台建设数据 基站数据
    this.getJizhanList();
    // 获取后台时间，完工工单数
    this.getOrderNum();
  },
  mounted () {
    // 流程图
    this.drawGraph();

    // 滚动轴置顶
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  },
};
</script>

<style scoped lang="less">
@bgColor: #245bef;
.workBoard {
  // height: 2000px;
  background-color: #fff;
  .setting {
    position: relative;
    .workOrder {
      // text-align: left;
      .van-button {
        width: 50%;
        border: none;
        font-size: 18px;
      }
      .unActiveWorkOrder {
        background-color: #e0e0e0;
        // font-size: 18px;
        // border-bottom: 1px solid blue;
      }
    }
    .bgPlate {
      z-index: -1;
      position: absolute;
      width: 100%;
      height: 50px;
      background-color: #f4f4f4;
    }
    .netTotal {
      width: 80%;
      margin: 20px auto;
      height: 70px;
      margin-top: 10px;
      padding: 5px;
      line-height: 40px;
      color: #fff;
      background-color: @bgColor;
      border-radius: 10px;
      .title {
        display: flex;
        justify-content: space-between;
        padding: 0 5px;
        span {
          font-size: 12px;
        }
      }
      .content {
        text-align: left;
        padding-left: 5px;
        font-size: 20px;
      }
    }
    .transitOrder {
      width: 90%;
      margin: 0 auto;
      text-align: left;
      font-size: 14px;
      /*  .mode {
        display: flex;
        margin: 20px auto;
        .netZhishi {
          display: inline-block;
          width: 22%;
          margin-top: 5px;
        }
        .zhishiRegion {
          width: 78%;
          .van-button {
            height: 30px;
            margin: 5px;
            background-color: #f5f8ff;
            .van-button__text {
              font-size: 12px;
            }
          }
          .activeButton {
            background-color: @bgColor;
            color: #fff;
          }
        }
      } */
      .menuList {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-top: 10px;
        height: 100px;
        .menu {
          display: flex;
          line-height: 30px;
          .after::after {
            content: '▼';
            margin-left: -25px;
            color: gray;
          }
          input {
            width: 220px;
            height: 30px;
            color: gray;
            box-shadow: 0.3px 0.3px;
            margin-left: 20px;
            padding: 0 8px;
          }
          ::v-deep .van-dropdown-menu {
            width: 70%;
            margin-left: 10px;
            .van-dropdown-menu__bar {
              height: 30px;
            }
            .van-dropdown-item__option--active,
            .van-dropdown-menu__title--active,
            .van-icon-success:before {
              color: @bgColor;
            }
            .van-dropdown-menu__item {
              justify-content: left;
              &::after {
                position: absolute;
                top: 50%;
                right: 10px;
                margin-top: -5px;
                border: 3px solid;
                border-color: transparent transparent #dcdee0 #dcdee0;
                -webkit-transform: rotate(-45deg);
                transform: rotate(-45deg);
                opacity: 0.8;
                content: '';
              }
              .van-dropdown-menu__title::after {
                content: none;
              }
            }
          }
        }
      }
    }
  }
  .graph {
    margin-top: 10px;
  }
  .personal {
    width: 100%;
    background-color: #f8f7fc;
    margin-top: 10px;
    padding-bottom: 20px;
    h3 {
      text-align: left;
      margin-left: 20px;
      padding-top: 5px;
    }
    .jizhan {
      display: flex;
      height: 80px;
      margin: 20px;
      background-color: #fff;
      .leftSide {
        width: 5%;
        height: 100%;
        // background-color: #669cf6;
      }
      .content {
        width: 95%;
        display: flex;
        justify-content: space-between;
        margin: 10px 20px;
        .stepRegion,
        .rejectRegion {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          .orderNum,
          .rejectNum {
            font-size: 20px;
            font-weight: 500;
          }
          .rejectNum {
            color: #e47d75;
          }
        }
      }
    }
    .jizhan:nth-child(2) .leftSide {
      background-color: #669cf6;
    }
    .jizhan:nth-child(3) .leftSide {
      background-color: #7ee2be;
    }
    .jizhan:nth-child(4) .leftSide {
      background-color: #ec8152;
    }
    .jizhan:nth-child(5) .leftSide {
      background-color: #3b5af2;
    }
  }
}
</style>