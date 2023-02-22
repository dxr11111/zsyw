<template>
  <div class="toolPosBind">
    <!-- 工具-pos绑定查询列表页 -->
    <MyHeader name="工单竣工pos绑定" left="arrow-left" @goBackEv="goBackFn" />
    <div class="static" ref="static">
      <!-- 搜索区域 -->
      <div class="searchRegion">
        <van-search
          v-model="queryInfo"
          shape="round"
          placeholder="请输入产品号码，工单号，姓名，地址......"
          show-action
          background="#1989fa"
        >
          <template #action><span @click="onSearch">搜索</span></template>
        </van-search>
      </div>
      <!-- 选择是否绑定 -->
      <div class="bindStatus">
        <van-button
          :class="bandingStatus == 0 ? 'activeButton' : ''"
          @click="changeBindStatus(0)"
          >未绑定</van-button
        >
        <van-button
          :class="bandingStatus == 1 ? 'activeButton' : ''"
          @click="changeBindStatus(1)"
          >已绑定</van-button
        >
      </div>
    </div>

    <!-- 列表内容 -->
    <div class="postList" :style="{ marginTop: mainMarginTop }">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          :finished-text="finishText"
          @load="onLoad"
          :immediate-check="false"
        >
          <template v-if="postList.length > 0">
            <div
              class="listItem"
              v-for="(item, index) in postList"
              :key="index"
              @click="skipPosDev(item)"
            >
              <div class="num">{{ index + 1 }}</div>
              <div class="content">
                <div class="time">
                  {{ bandingStatus == 0 ? "竣工时间：" : "绑定时间："
                  }}{{ item.createDate }}
                </div>
                <div class="title">
                  <span>{{ item.abstractInfo[0] }}</span>
                  <span>{{ item.abstractInfo[1] }}</span>
                </div>
                <div class="address">
                  <span>{{ item.abstractInfo[2] }}</span>
                </div>
              </div>
            </div>
          </template>
          <!-- 空状态 -->
          <Empty v-else />
          <!-- 加载提示-空 -->
          <template #loading><div></div></template>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { reqToolPosList } from "@/http/tools";
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive";

export default {
  name: "ToolPosBind",
  mixins: [keepAliveMixin],

  data() {
    return {
      queryInfo: "", // 搜索条件
      bandingStatus: 0, // 0：未绑定，1已绑定
      page: 1, // 页码
      postList: [],
      mainMarginTop: "",
      // 下拉列表
      loading: false,
      finished: false,
      finishText: "没有更多了",
      refreshing: false,
    };
  },
  methods: {
    // 回退
    goBackFn() {
      this.$router.go(-1);
      this.$store.commit("removeThisPage", this.$options.name);
    },
    // 点击搜索
    onSearch() {
      this.postList = [];
      this.page = 1;
      this.getposList();
    },
    // 点击是否绑定
    changeBindStatus(bool) {
      this.bandingStatus = bool;
      // 重置参数，重发请求
      this.postList = [];
      this.page = 1;
      this.getposList();
    },
    // 获取pos列表内容
    async getposList() {
      let queryInfo = this.queryInfo;
      let page = this.page;
      let bandingStatus = this.bandingStatus;
      try {
        let result = await reqToolPosList(
          JSON.stringify({ queryInfo, page, bandingStatus })
        );
        console.log("pos列表信息", result);
        // 请求完之后关闭加载状态
        this.loading = false;
        this.apiResponse(result, ".toolPosBind", () => {
          // 判断列表是否全部加载完成
          if (this.page >= result.totalPage) {
            this.finished = true;
            this.finishText = "没有更多了";
          }
          // 判断有无数据
          if (result.waitPosInfoList.length == 0) {
            // 无数据 → 会自动显示空状态 → 不显示finishText
            this.finished = true; // 关闭上拉加载
            this.finishText = "";
          }
          // 处理waitPosInfoList
          let postList = [];
          result.waitPosInfoList.forEach((posInfo) => {
            let obj = {};
            obj.id = posInfo.id;
            obj.createDate = posInfo.createDate;
            obj.orderId = posInfo.orderId;
            obj.sheetFrom = posInfo.sheetFrom; // 判断sysid是2还是10
            // 获取abstractInfo下的列表信息
            let abstractInfo = JSON.parse(posInfo.abstractInfo);
            obj.abstractInfo = abstractInfo[0];
            postList.push(obj);
          });
          this.postList = [...this.postList, ...postList];
        });
        if (!result.operationSuccessFlag) {
          this.finished = true; // 加载失败 关闭上拉加载
          if (this.postList.length > 0) {
            this.finishText = "没有更多了";
          } else {
            this.finishText = "";
          }
        }
      } catch (error) {
        this.loading = false; // 加载失败 关闭加载状态
        this.finished = true; // 加载失败 关闭上拉加载
        if (this.postList.length > 0) {
          this.finishText = "没有更多了";
        } else {
          this.finishText = "";
        }
        console.log("err", error);
      }
    },
    // 跳转到pos绑定设备页面
    skipPosDev(item) {
      this.$router.push({
        name: "ToolPosBindDev",
        query: {
          orderId: item.orderId,
          id: item.id,
          sheetFrom: item.sheetFrom,
        },
      });
    },
    // 加载列表
    onLoad() {
      if (this.refreshing) {
        // 选择下拉刷新
        this.postList = [];
        this.page = 1;
        this.refreshing = false;
      } else {
        // 上拉加载数据
        this.page++;
      }
      // 请求数据
      this.getposList();
    },
    onRefresh() {
      // 清空列表数据
      this.postList = [];
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
  },
  created() {
    // 获取pos列表内容
    this.getposList();
  },
  mounted() {
    // 获取postList元素margin-top
    this.mainMarginTop = this.$refs.static.clientHeight + "px";
  },
};
</script>

<style scoped lang="less">
.toolPosBind {
  height: 100%;
  background-color: @bg-color;
  .static {
    z-index: 1;
    position: fixed;
    width: 100%;
    .searchRegion {
      .van-search {
        /deep/.van-field__control {
          font-size: 12px;
        }
        .van-search__action {
          color: #fff;
          font-size: 16px;
          background-color: transparent;
        }
      }
    }
    .bindStatus {
      display: flex;
      .van-button {
        width: 50%;
        font-size: 12px;
      }
      .van-button::before {
        background-color: transparent !important;
      }
      .activeButton {
        color: @theme-color;
      }
    }
  }
  .postList {
    .listItem {
      display: flex;
      align-items: center;
      padding: 10px;
      margin-bottom: 10px;
      background-color: #fff;
      .num {
        width: 24px;
        height: 24px;
        line-height: 24px;
        background: @theme-color;
        border-radius: 12px;
        color: #fff;
      }
      .content {
        flex: 1;
        margin-left: 10px;
        text-align: left;
        font-size: 14px;
        .time {
          color: @theme-color;
        }
        .title {
          display: flex;
          justify-content: space-between;
          margin: 8px 0 5px 0;
        }
        .address {
          color: #afacac;
        }
      }
    }
  }
}
</style>