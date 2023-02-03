<template>
  <!-- 部门工单 -->
  <div class="departmentOrder">
    <div
      class="dataSummaryBg"
      :style="{
        height: dataSummaryBgHeight + 'px',
        display: dataSummaryBgDisplay,
      }"
    >
      <!-- 今日数据汇总 -->
      <div class="dataSummary" ref="dataSummary">
        <!-- 选择工作组 -->
        <div class="workGroup" @click="clickSelectGroup">
          <span class="name">{{ groupName }}</span>
          <i class="iconfont icon-xiajiantou"></i>
        </div>

        <van-popup
          v-model="selectGroupShow"
          round
          position="bottom"
          get-container="body"
          @click-overlay="cancelGroup"
        >
          <van-picker
            show-toolbar
            :columns="groupNameColumns"
            :default-index="groupNameDefaultIndex"
            @confirm="confirmGroup"
            @cancel="cancelGroup"
          />
        </van-popup>

        <!-- 第一排 -->
        <div class="boardList">
          <ul v-for="(list1, listIndex) in cutBoardList1" :key="listIndex">
            <li
              v-for="(item, index) in list1.sheetSumInfoList"
              :key="index"
              @click="boardListMore(list1, item, listIndex, 1)"
            >
              <span>{{ item.name }}</span>
              <span>{{ item.num }}</span>
            </li>
          </ul>
        </div>
        <!-- 第二排 -->
        <div class="boardList">
          <ul v-for="(list2, listIndex) in cutBoardList2" :key="listIndex">
            <li
              v-for="(item, index) in list2.sheetSumInfoList"
              :key="index"
              @click="boardListMore(list2, item, listIndex, 2)"
            >
              <span>{{ item.name }}</span>
              <span>{{ item.num }}</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 放大版看板数量 -->
      <van-popup v-model="bigBoardShow">
        <ul class="bigBoard">
          <template v-if="JSON.stringify(bigBoard) !== '{}'">
            <li class="title">
              <span class="name">
                <!-- {{ bigBoard.sheetSumInfoList[0].name }}
                ：
                {{ bigBoard.sheetSumInfoList[0].num }} -->
              </span>
              <span class="close" @click="bigBoardShow = false">×</span>
            </li>
          </template>
          <li
            v-for="item in bigBoard.sheetSumInfoList"
            :key="item.id"
            @click="clickBigBoard(item)"
          >
            <span style="flex: 3">{{ item.name }}</span>
            <div class="right">
              <span style="flex: 1" class="num">{{ item.num }}</span>
              <van-icon name="arrow" class="arrow" />
            </div>
          </li>
        </ul>
      </van-popup>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { reqSheetReportSum, reqChangeDefaultGroup } from "@/http";

export default {
  name: "DepartmentOrder",
  props: ["workOrderDetail", "showDataSummary"],
  data() {
    return {
      dataSummaryBgHeight: "", // div-dataSummaryBg高度
      boardList1: [],
      boardList2: [],
      cutBoardList1: [], // 只取sheetSumInfoList前四项
      cutBoardList2: [],
      groupName: "", // 当前选中的工作组名称
      groupId: -1, // 当前选中的工作组
      currentGroupList: [], // 当前工作组列表-不同工单工作组不一致
      groupNameColumns: [],
      groupNameDefaultIndex: -1,
      groupNameLastIndex: -1,
      selectGroupShow: false,
      // 放大的看板
      bigBoardShow: false,
      bigBoard: {},
      // cutBigBoard: {}, // 截取sheetSumInfoList首位

      dataSummaryBgDisplay: "block", // dataSummaryBg是否显示
    };
  },
  computed: {
    ...mapGetters(["getLoginInfo"]),
    ...mapState("workOrder", ["currWorkGroupInfo"]),
  },
  watch: {
    // 父组件选中工单
    workOrderDetail(value) {
      // 更新默认工作组
      this.getGroupVaue();
      // 请求工单看板
      this.getOrderNum();
    },
    showDataSummary(value) {
      if (value) this.dataSummaryBgDisplay = "block";
      else this.dataSummaryBgDisplay = "none";
    },
  },
  methods: {
    // 点击工单看板显示全部
    boardListMore(list, item, index, listRow) {
      /*     if (item.name == '......') {
            // 将此看板完全显示
            if (listRow == 2) {
              this.$set(this.cutBoardList2[index], 'sheetSumInfoList', this.boardList2[index].sheetSumInfoList)
            } else if (listRow == 1) {
              this.$set(this.cutBoardList1[index], 'sheetSumInfoList', this.boardList1[index].sheetSumInfoList)
    
            }
            // 将组件高度传给父组件
            this.getBgHeight()
          } else {
            // 展示放大版看板
            this.showBigBoard(listRow, index)
          } */
      // 如果一个看板只有一条数据，则直接跳转到对应列表id，无需展示放大看板
      if (list.sheetSumInfoList.length == 1) {
        let taskType = list.listId;
        this.$emit("getTaskType", taskType);
      } else {
        // 展示放大版看板
        this.showBigBoard(listRow, index);
      }
    },

    // 点击放大看板跳转列表id
    clickBigBoard(item) {
      this.bigBoardShow = false;
      // 获取点击条件 specProdType=14,overTime=1,specProdTypeNotIn=14|15|29
      let condition = item.condition;
      let arr = condition.split(",");
      let siftPara = {};
      arr.forEach((item) => {
        let key = item.split("=")[0];
        let value = item.split("=")[1];
        siftPara[key] = value;
      });
      let taskType = this.bigBoard.listId;
      this.$emit("getTaskType", taskType, JSON.stringify(siftPara));
    },

    // 点击查看放大版看板数
    showBigBoard(row, index) {
      this.bigBoardShow = true;
      if (row == 1) {
        this.bigBoard = this.boardList1[index];
      } else {
        this.bigBoard = this.boardList2[index];
      }
      // this.cutBigBoard = this.bigBoard.sheetSumInfoList.slice(1)
    },
    // 从登录返回的listSheetGroup内获取下拉菜单
    getGroupVaue() {
      this.currentGroupList = [];
      this.groupNameColumns = [];
      // 获取下拉菜单内容
      this.getLoginInfo.listSheetGroup.forEach((item, index) => {
        // 根据groupSysId获取工单对应工作组内容
        if (item.groupSysId == this.workOrderDetail.sysId) {
          this.currentGroupList.push(item);
          this.groupNameColumns.push(item.groupName);
        }
      });
      // 获取默认头部名称
      this.groupName = this.currWorkGroupInfo.groupName;
      this.groupId = this.currWorkGroupInfo.groupId;
      // 获取默认工作组id
      for (let index in this.currentGroupList) {
        index = Number(index);
        if (
          this.currentGroupList[index].groupId == this.currWorkGroupInfo.groupId
        ) {
          this.groupNameDefaultIndex = index;
          this.groupNameLastIndex = index;
          return;
        }
      }
    },
    // 点击打开选择工作组弹出层
    clickSelectGroup() {
      this.selectGroupShow = true;
    },
    // 确认工作组
    async confirmGroup(value, index) {
      this.groupName = value;
      // 不同工单工作组列表有差别
      // this.groupId = this.getLoginInfo.listSheetGroup[index].groupId
      this.groupId = this.currentGroupList[index].groupId;
      this.groupNameLastIndex = index;
      // 将选择的工作组存入vuex
      this.$store.commit("workOrder/updateCurrWorkGroupInfo", {
        groupId: this.groupId,
        groupName: this.groupName,
      });
      this.selectGroupShow = false;
      // 调用改变工作组接口
      let sysId = this.workOrderDetail.sysId;
      let result = await reqChangeDefaultGroup(
        JSON.stringify({ sysId, groupId: this.groupId })
      );
      console.log("改变工作组", result);

      // 获取工单看板数
      this.getOrderNum();
      // 获取工单列表信息
      this.$emit("changeGroup");
    },
    // 取消工作组
    cancelGroup() {
      this.selectGroupShow = false;
      // 取消后恢复上一次确认位置
      this.groupNameColumns = [];
      setTimeout(() => {
        this.getLoginInfo.listSheetGroup.forEach((item, index) => {
          if (item.groupSysId == this.workOrderDetail.sysId) {
            this.groupNameColumns.push(item.groupName);
          }
        });
      });

      this.groupNameDefaultIndex = this.groupNameLastIndex;
    },

    // 获取工单看板数
    async getOrderNum() {
      let ifmSysId = this.workOrderDetail.ifmSysId || -1; // 只有sysId=3时用，1：故障单 3：预警单4：支撑单5：重保单6:优化单
      let groupId = this.currWorkGroupInfo.groupId;
      let sysId = this.workOrderDetail.sysId;
      let type = "";

      //  舍弃curtSysIds
      /*  if (Object.keys(this.workOrderDetail).length > 0) {
        curtSysIds.push(this.workOrderDetail.sysId)
      } else {
        // 改成了新页面，目前是工作台，默认会有一个值，这个不确定估计会舍弃
        this.getLoginInfo?.userIds.forEach((item) => {
          curtSysIds.push(item.sysId)
        })
      } */
      let postData = { ifmSysId, groupId, sysId, type };
      let result = await reqSheetReportSum(JSON.stringify(postData));
      console.log("获取工单看板数", result);
      this.apiResponse(result, ".departmentOrder", () => {
        if (result.operationSuccessFlag) {
          // 请求成功
          this.boardList1 = result.list1;
          this.boardList2 = result.list2;
          this.cutBoardList1 = JSON.parse(JSON.stringify(this.boardList1));
          this.cutBoardList2 = JSON.parse(JSON.stringify(this.boardList2));

          // 处理boardList内sheetSumInfoList只显示前四项
          this.cutBoardList1.forEach((list1, index) => {
            if (list1.sheetSumInfoList.length > 4) {
              list1.sheetSumInfoList = list1.sheetSumInfoList.slice(0, 4);
              list1.sheetSumInfoList.push({
                name: "......",
              });
            }
          });
          this.cutBoardList2.forEach((list2, index) => {
            if (list2.sheetSumInfoList.length > 4) {
              list2.sheetSumInfoList = list2.sheetSumInfoList.slice(0, 4);
              list2.sheetSumInfoList.push({
                name: "......",
              });
            }
          });
        }
        // 将组件高度传给父组件
        this.getBgHeight();
      });
    },
    // 将组件高度传给父组件
    getBgHeight() {
      this.$nextTick(() => {
        // 将组件高度传给父组件
        this.dataSummaryBgHeight = this.$refs.dataSummary.clientHeight - 30;
        this.$emit("getBgHeight", this.dataSummaryBgHeight);
      });
    },
  },
  mounted() {
    // 将组件高度传给父组件
    // this.dataSummaryBgHeight = (this.$refs.dataSummary.clientHeight - 76)
    // this.$emit('getBgHeight', this.dataSummaryBgHeight)
  },
  created() {
    // 获取工单看板数
    this.getOrderNum();
    // 从登录返回的listSheetGroup内获取下拉菜单
    this.getGroupVaue();
  },
};
</script>

<style scoped lang="less">
.departmentOrder {
  .dataSummaryBg {
    position: relative;
    background-color: #f3f4f5;
    .dataSummary {
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      // margin: -76px auto 10px;
      padding: 8px;
      border-radius: 8px;
      box-shadow: 0px 2px 6px 0px rgba(103, 106, 118, 0.2);
      background: #fff;
      .workGroup {
        margin-bottom: 10px;
        font-weight: 600;
        text-align: left;
        font-size: 18px;
        .iconfont {
          margin-left: 5px;
        }
      }
      // .numList {
      //   ul {
      //     display: flex;
      //     justify-content: space-between;
      //     padding: 16px;
      //     li {
      //       display: flex;
      //       flex-direction: column;
      //       font-size: 14px;
      //       .num {
      //         font-size: 20px;
      //         font-family: Bebas;
      //         font-weight: 600;
      //       }
      //       .grey {
      //         color: #777a87;
      //       }
      //     }
      //   }
      // }
      .boardList {
        display: flex;
        justify-content: space-between;
        overflow-x: auto;
        text-align: left;
        &::-webkit-scrollbar {
          /*隐藏滚轮*/
          display: none;
        }
        &:last-child {
          margin-top: 10px;
        }
        ul {
          // box-sizing: border-box;
          flex-shrink: 0;
          width: 27%;
          margin-right: 10px;
          border-radius: 10px;
          padding: 7px;
          background-color: #ebefff;
          li {
            display: flex;
            justify-content: space-between;
            font-weight: 400;
            color: #777a87;
            font-size: 12px;
            margin-top: 2px;
            .value {
              color: #305bfd;
            }
          }
          li {
            &:first-child {
              margin-bottom: 5px;
              font-size: 14px;
              font-weight: 600;
              color: #1b1c21;
              font-family: PingFangSC-Medium, PingFang SC;
            }
          }
        }
      }
    }
    .van-popup--center {
      width: 90%;
      border-radius: 10px;
      // background-color: #ebefff;
      .bigBoard {
        padding-bottom: 20px;
        font-family: PingFang SC;
        .title {
          position: relative;
          display: flex;
          justify-content: center;
          font-size: 20px;
          color: #fff;
          align-items: center;
          height: 40px; //64px
          padding: 0;
          background-image: url("./images/orderBoardPopBg.png");
          background-size: cover;
          .close {
            position: absolute;
            right: 0;
            font-size: 25px;
            margin-right: 20px;
          }
        }
        li {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #e0e0e0;
          .num {
            color: #4269fd;
            margin-right: 5px;
          }
          .arrow {
            color: #bbbdc3;
          }
        }
      }
    }
  }
}
</style>