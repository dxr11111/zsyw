<template>
  <!-- 我的任务 -->
  <div class="myTask">
    <div
      class="dataSummaryBg"
      :style="{
        height: dataSummaryBgHeight + 'px',
        display: dataSummaryBgDisplay,
      }"
    >
      <!-- 今日数据汇总 -->
      <div class="dataSummary" ref="dataSummary">
        <div class="numList numList1">
          <ul>
            <li
              v-for="(up, index) in upSum"
              :key="'up' + index"
              @click="taskFn(up)"
            >
              <span class="num">{{ up.sum }}</span>
              <span class="name">{{ up.name }}</span>
            </li>
          </ul>
        </div>
        <div class="cutOffRule"></div>
        <div class="numList numList2">
          <ul>
            <li
              v-for="(down, index) in downSum"
              :key="'down' + index"
              @click="taskFn(down)"
            >
              <span class="num">{{ down.sum }}</span>
              <span class="name">{{ down.name }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { reqTaskSum } from "@/http";
import { getHasTaskListSysId } from "@/utils/public/common";
export default {
  name: "MyTask",
  props: ["showDataSummary", "selectSysId"],
  data() {
    return {
      dataSummaryBgHeight: "", // div-dataSummaryBg高度
      upSum: [],
      downSum: [],
      dataSummaryBgDisplay: "block", // dataSummaryBg是否显示
    };
  },
  computed: {
    ...mapGetters(["getLoginInfo"]),
  },
  watch: {
    showDataSummary(value) {
      if (value) this.dataSummaryBgDisplay = "block";
      else this.dataSummaryBgDisplay = "none";
    },
    // 任务页面点击筛选需要重新调用任务看板,sysId为筛选选中的值
    selectSysId(value) {
      this.getTaskNum(value);
    },
  },
  methods: {
    // 获取任务看板数
    async getTaskNum(sysId) {
      let sysIds = [];
      if (sysId) {
        if (sysId == -1) {
          sysIds = getHasTaskListSysId(this.getLoginInfo?.userIds);
        } else sysIds.push(sysId);
      } else {
        sysIds = getHasTaskListSysId(this.getLoginInfo?.userIds);
      }
      let postData = { sysIds };
      let result = await reqTaskSum(JSON.stringify(postData));
      console.log("获取任务看板数", result);
      this.apiResponse(result, ".myTask", () => {
        this.upSum = result.upSum;
        this.downSum = result.downSum;
        this.$nextTick(() => {
          // 将组件高度传给父组件
          let height = this.$refs.dataSummary?.clientHeight;
          if (height > 0) {
            this.dataSummaryBgHeight =
              this.$refs.dataSummary?.clientHeight - 30;
          } else {
            this.dataSummaryBgHeight = 116; // 防止获取不到高度
          }
          this.$emit("getBgHeight", this.dataSummaryBgHeight);
        });
      });
    },
    // 点击看板内容
    taskFn(item) {
      // 获取点击条件 specProdType=14,overTime=1,specProdTypeNotIn=14|15|29
      let condition = item.condition;
      let arr = condition.split(",");
      let siftPara = {};
      // 将condition转成对象格式
      arr.forEach((item) => {
        let key = item.split("=")[0];
        let value = item.split("=")[1];
        siftPara[key] = value;
      });
      // 拿到看板对应id
      let taskType = item.id;
      // 传给父组件
      this.$emit("getTaskType", taskType, JSON.stringify(siftPara));
    },
  },

  created() {
    // 获取任务看板数
    this.getTaskNum();
  },
  mounted() {},
};
</script>

<style scoped lang="less">
.myTask {
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
      .numList {
        padding: 10px;
        ul {
          display: flex;
          // justify-content: space-around;
          overflow-x: auto;
          li {
            display: flex;
            flex-direction: column;
            margin: 0px 5px;
            flex: 0 0 23%;
            .num {
              font-weight: 600;
            }
            .name {
              font-size: 14px;
              color: #777a87;
              word-break: break-all;
            }
          }
        }
      }
      .cutOffRule {
        width: 95%;
        margin: 10px auto 0;
        color: #fff;
        border-bottom: 3px solid;
        border-image: linear-gradient(297deg, #1ad547 0%, #e81818 100%) 2 2 2 2;
      }
    }
  }
}
</style>