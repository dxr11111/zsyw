<template>
  <div class="historyRecord">
    <MyHeader name="历史记录" left="arrow-left" @goBackEv="goBackFn" />

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="finishText"
        @load="onLoad"
        :immediate-check="false"
      >
        <!-- 列表内容 -->
        <div class="main" v-if="listInfo.length > 0">
          <div
            class="listInfo"
            v-for="(item, index) in listInfo"
            :key="index"
            @click="clickInfo(item.id)"
          >
            <div class="left">
              <!-- testType 结单测试=1 诊断测试=0 -->
              <div class="title" v-if="item.testType == 1">结</div>
              <div class="title" v-else>诊</div>
              <div class="content">
                <span class="mark">用户标识：{{ item.balkPhone }}</span>
                <span class="time">测试时间：{{ item.curtTime }}</span>
              </div>
            </div>
            <div class="right">
              <!-- testStatus 测试状态（0：未测试，1：已测试并成功，2：已测试并异常） -->
              <span class="status" v-if="item.testStatus == 0"
                >状态：测试中</span
              >
              <span class="status" v-else>状态：已测试</span>

              <span class="result" v-if="item.testStatus == 0">结果：无</span>

              <span
                class="result"
                v-if="item.testStatus == 1"
                style="color: #37b65d"
                >结果：成功</span
              >

              <span
                class="result"
                v-if="item.testStatus == 2"
                style="color: red"
                >结果：异常</span
              >
            </div>
          </div>
        </div>
        <!-- 显示暂无数据 -->
        <Empty v-else />

        <!-- 加载提示-空 -->
        <template #loading><div></div></template>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { reqCRISTestList } from "@/http/button";
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive";

export default {
  name: "HistoryRecord",
  mixins: [keepAliveMixin],

  data() {
    return {
      listInfo: [],
      page: 1,
      loading: false, // 是否正在上拉加载
      finished: false, // 是否加载完成
      finishText: "没有更多了",
      refreshing: false, // 是否正在下拉刷新
    };
  },
  methods: {
    // 回退
    goBackFn() {
      this.$router.go(-1);
    },
    // 点击信息跳转详情
    clickInfo(id) {
      this.$router.push({
        name: "RecordDetail",
        query: { id },
      });
    },
    // 获取历史记录
    async getHistoryRecord() {
      let id = parseInt(this.$route.query.id);
      let page = this.page;
      try {
        let result = await reqCRISTestList(JSON.stringify({ id, page }));
        // 加载状态结束
        this.loading = false;
        this.apiResponse(result, ".historyRecord", () => {
          // 成功
          this.listInfo.push(...result.testAdslNewList);

          // 判断数据是否全部请求完成
          if (this.page >= result.totalPage) {
            this.finished = true;
            this.finishText = "没有更多了";
          }
          // 判断有无数据
          if (result.testAdslNewList.length == 0) {
            // 无数据 → 会自动显示空状态 → 不显示finishText
            this.finished = true; // 关闭上拉加载
            this.finishText = "";
          }
        });
        if (!result.operationSuccessFlag) {
          this.finished = true; // 加载失败 关闭上拉加载
          if (this.listInfo.length > 0) {
            this.finishText = "没有更多了";
          } else {
            this.finishText = "";
          }
        }
      } catch (error) {
        this.loading = false; // 加载失败 关闭加载状态
        this.finished = true; // 加载失败 关闭上拉加载
        if (this.listInfo.length > 0) {
          this.finishText = "没有更多了";
        } else {
          this.finishText = "";
        }
        console.log("err", error);
      }
    },
    onLoad() {
      if (this.refreshing) {
        // 下拉刷新
        this.listInfo = [];
        this.page = 1;
        this.refreshing = false;
      } else {
        // 上拉加载
        this.page++;
      }
      this.getHistoryRecord();
    },
    onRefresh() {
      // 清空列表数据
      this.listInfo = [];
      this.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
  },
  created() {
    // 发送请求
    this.getHistoryRecord();
  },
};
</script>

<style scoped lang="less">
.historyRecord {
  height: 100%;
  background-color: #f8f7fc;
  .main {
    .listInfo {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      font-size: 14px;
      background-color: #fff;
      border-bottom: 1px solid #e0e0e0;
      .left {
        display: flex;
        .title {
          position: relative;
          top: 50%;
          transform: translateY(-50%);
          width: 30px;
          height: 30px;
          line-height: 30px;
          background: #1989fa;
          color: #fff;
          border-radius: 15px;
        }
        .content {
          display: flex;
          flex-direction: column;
          text-align: left;
          span {
            padding: 5px;
            white-space: nowrap;
          }
        }
      }
      .right {
        display: flex;
        flex-direction: column;
        text-align: right;
        span {
          padding: 5px;
        }
      }
    }
  }
}
</style>