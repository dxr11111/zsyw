<template>
  <div class="workbench" ref="workbench">
    <div class="static">
      <div class="head" ref="head" :style="{ height: headHeight }">
        <UniNetHeader
          name="北京掌上运维系统"
          left="arrow-left"
          bgColor="transparent"
          @goBackEv="goBack"
          v-if="$store.state.projectFlag == 2"
        />
        <div class="headText" :style="{ margin: headTextMargin }">
          <div class="left">
            <!-- 任务-显示用户名 -->
            <div class="userName" v-if="isTask == 1">
              <i class="iconfont icon-denglu"></i>
              {{ userName }}
            </div>
            <!-- 个性化-选择工单 -->
            <van-popover
              v-model="selectOrderShow"
              trigger="click"
              placement="bottom-start"
              :get-container="getContainer"
            >
              <div class="selectOrder">
                <div
                  class="orderCategory"
                  v-for="(item, index) in selectOrderActions"
                  :key="index"
                >
                  <template v-if="item.content.length > 0">
                    <div class="title">{{ item.title }}</div>
                    <div class="content">
                      <div
                        class="item"
                        :class="order.id === orderId ? 'active' : ''"
                        v-for="(order, orderIndex) in item.content"
                        :key="orderIndex"
                        @click.stop="selectOrder(order)"
                      >
                        {{ order.name }}
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <template #reference>
                <div class="customize" v-show="isTask == 0">
                  <span>{{ orderName || "选择工单" }}</span>
                  <i class="iconfont icon-xiajiantou"></i>
                </div>
              </template>
            </van-popover>
          </div>

          <!-- 选择工单或任务 -->
          <div class="menu">
            <span :class="isTask == 1 ? 'menuActive' : ''" @click="clickMenu(1)"
              >我的任务</span
            >
            <span
              class="workOrder"
              :class="isTask == 0 ? 'menuActive' : ''"
              @click="clickMenu(0)"
              >部门工单</span
            >
          </div>
          <!-- 筛选  → 部门工单选择建设中台时隐藏 -->
          <div class="iconRegion" v-show="!(orderId == 6 && isTask == 0)">
            <template v-if="badgeNum > 0">
              <van-badge :content="badgeNum">
                <i
                  @click="showFiltrate = true"
                  class="iconfont icon-jurassic_filtrate"
                ></i>
              </van-badge>
            </template>
            <template v-else>
              <i
                @click="showFiltrate = true"
                class="iconfont icon-jurassic_filtrate"
              ></i>
            </template>
          </div>
          <!-- 空占位 → 防止元素不对称 -->
          <div class="iconRegion" v-show="orderId == 6 && isTask == 0">
            <div style="width: 18px; height: 18px"></div>
          </div>
        </div>
      </div>
      <!-- 建设中台不显示 -->
      <template v-if="!(orderId == 6 && isTask == 0)">
        <!-- 部门任务/我的工单 -->
        <MyTask
          v-if="isTask == 1"
          @getBgHeight="getBgHeight"
          @getTaskType="getTaskType"
          :showDataSummary="showDataSummary"
          :selectSysId="selectSysId"
          ref="myTask"
        />
        <DepartmentOrder
          v-if="isTask == 0 && this.orderId !== -1"
          @getBgHeight="getBgHeight"
          @getTaskType="getTaskType"
          @changeGroup="changeGroup"
          :workOrderDetail="workOrderDetail"
          :showDataSummary="showDataSummary"
          ref="departmentOrder"
        />
      </template>
      <template v-else>
        <JsMiddlePlatform />
      </template>
    </div>

    <!-- 建设中台不显示 -->
    <template v-if="!(orderId == 6 && isTask == 0)">
      <!-- 单子列表 -->
      <div class="billList" :style="{ marginTop: tabOffsetTop + 'px' }">
        <div class="myTab">
          <van-tabs
            v-model="tabActive"
            swipeable
            @change="changeTabs"
            sticky
            :offset-top="tabOffsetTop"
          >
            <van-tab :title="tab.name" v-for="tab in tabList" :key="tab.id">
              <!-- <ContentList :name="tab.name" :taskType="tab.id" v-bind="$attrs" /> -->
              <div
                class="contentList"
                :style="{ marginTop: rapidCullHeight + 5 + 'px' }"
              >
                <!-- 下拉刷新 -->
                <van-pull-refresh
                  v-model="isRefresh"
                  @refresh="onRefresh"
                  loading-text="加..."
                  style="min-height: 100vh"
                >
                  <van-list
                    v-model="isLoading"
                    :finished="isFinished"
                    :finished-text="finishText"
                    @load="onLoad"
                    offset="1"
                    :immediate-check="false"
                  >
                    <ContentInfo
                      v-for="(contentInfo, index) in contentList"
                      :key="index"
                      :contentInfo="contentInfo"
                    />
                    <!-- 加载提示-空 -->
                    <template #loading><div></div></template>
                  </van-list>
                  <!-- 显示暂无数据 -->
                  <Empty v-show="isEmpty" />
                </van-pull-refresh>
              </div>
            </van-tab>
          </van-tabs>
        </div>
      </div>
      <!-- 快速筛选 -->
      <div
        class="rapidCull"
        :style="{ top: tabOffsetTop + tabHeight + 'px' }"
        ref="rapidCull"
      >
        <ul>
          <li
            :class="listSort.order == 1 ? 'sortActive' : ''"
            @click="clickSort(1)"
          >
            <span>受理时间</span>
            <i class="iconfont" :class="listSort.actions[0].arrows"></i>
          </li>
          <li
            :class="listSort.order == 3 ? 'sortActive' : ''"
            @click="clickSort(2)"
          >
            <span>截止时间</span>
            <i class="iconfont" :class="listSort.actions[1].arrows"></i>
          </li>
          <li :class="searchShow ? 'Active' : ''" @click="clickRapidCull">
            <i class="iconfont icon-sousuo"></i>
            <span>快速筛选</span>
            <!-- <i class="iconfont icon-xiajiantou"></i> -->
          </li>
        </ul>
      </div>
    </template>

    <!-- 快速筛选-搜索框弹出层 -->
    <transition name="search">
      <div
        class="searchRegion"
        :style="{ top: tabOffsetTop + tabHeight + rapidCullHeight + 'px' }"
        v-show="searchShow"
      >
        <div>
          <van-search
            v-model="queryInfo"
            shape="round"
            placeholder="请输入产品号码/受理单号/地址等信息"
            show-action
            background="#e0e0e0"
            @search="onSearch"
          >
            <template #action><span @click="onSearch">搜索</span></template>
          </van-search>
        </div>
      </div>
    </transition>

    <!-- 筛选 -->
    <van-popup
      v-model="showFiltrate"
      position="right"
      :style="{ width: '90%', height: '100%' }"
    >
      <Filtrate
        v-if="showFiltrate"
        :isTask="isTask"
        :selectSysId="selectSysId"
        :siftPara="siftPara"
        @getSiftPara="getSiftPara"
        :sysId="listPostData.sysId"
        :ifmSysId="listPostData.ifmSysId"
      />
    </van-popup>

    <!-- 电话图标 -->
    <!-- 只有“我的任务”，且sysId包括1或10（二者有1个即可），才显示电话图标。（部门工单，不显示电话图标) -->
    <PhoneIcon @iconMove="iconMove" v-if="judgePhoneIcon()" />
  </div>
</template>

<script>
import { reqBillListTab, reqgetOrderList, reqFastQuery } from "@/http/index";
import { getItem, removeItem, setItem } from "@/utils/public/sessionStorage";
import { getHasTaskListSysId } from "@/utils/public/common";
import ContentInfo from "@/components/contentInfo";
import Filtrate from "@/components/filtrate";
import MyTask from "./myTask.vue";
import DepartmentOrder from "./departmentOrder.vue";
import JsMiddlePlatform from "./jsMiddlePlatform";
import PhoneIcon from "@/components/selectCallNumber/phoneIcon.vue";
import { mapGetters, mapState } from "vuex";
import { throttle } from "@/utils/public/throttle";
import UniNetHeader from "@/components/myHeader/uniNet.vue";
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive";
import { cloudCall } from "@/utils/gdMethods/cloudCall";

export default {
  name: "WorkBench",
  components: {
    ContentInfo,
    Filtrate,
    MyTask,
    DepartmentOrder,
    JsMiddlePlatform,
    PhoneIcon,
    UniNetHeader,
  },
  mixins: [keepAliveMixin],

  data() {
    return {
      userName: localStorage.getItem("userName"),
      headHeight: "110px", // 头部背景高度 浏览器110px 手机 140px
      headTextMargin: "10px 12px 20px",
      refreshFlag: false, // 刷新标识

      showDataSummary: true,
      isTask: -1, // 判断选中任务还是工单 1:任务 0:工单
      // 列表tab
      tabList: [],
      taskType: -1, // tab栏id
      tabOffsetTop: 0, // tab栏吸顶高度
      tabHeight: 0, // tab栏高度
      rapidCullHeight: 0, // 快速筛选高度
      tabActive: 0, // tab栏激活
      // 下拉刷新
      page: 1, // 请求页数
      isRefresh: false,
      // 上拉加载
      isFinished: false,
      finishText: "没有更多了",
      isLoading: true, // 默认在加载状态
      contentList: [], // 列表内容
      // 空状态
      isEmpty: false,

      dataSummaryBgHeight: 40, //, div-dataSummaryBg高度 任务：40px 工单：30px
      firstDataSummaryBgHeight: 0, // 子组件传过来的高度

      // 请求传参
      listPostData: {
        ifmSysId: -1, // 1：故障单 3：预警单 4：支撑单 5：重保单 6:优化单 -1:无值
        groupId: -1, // 只有sysId是3,7,9有groupId,下拉菜单默认传登录输出的默认groupId;其他传-1
        sysId: -1, //1:IFM外包账号（公众类-智家工单）;2:IOM（公众类-智家工单）;3:IFM（维护类-在ifmSysIsd里找）;
        // 7:JNDD（局内-局内工单）,9:IDM（基站-基站工单）,10:IOMNew（公众类-智家工单）,11:ywjs（建设类-建设单）,
        // 12:tsxq（投诉类-投诉单）
      },
      siftPara: {},
      bigBoardSiftPara: {}, // 工单/任务看板跳转列表id筛选条件

      // 个性化-选择工单
      selectOrderActions: [],
      selectOrderShow: false,
      orderId: -1, //  4：局内 5：基站 6：建设   ifm维护类（31:故障单 33:预警单 34:支撑单 35:重保单 36:优化单 ）
      orderName: "",
      workOrderDetail: {}, // 选中的工单信息

      // 列表排序
      listSort: {
        sort: 2, // 1:正序↑ 2：倒序↓
        order: 1, // 1：受理时间 3：截止时间
        currentId: 1, // 当前点击的选项 1,3
        // 通过 actions 属性来定义菜单选项
        actions: [
          { id: 0, text: "受理时间", arrows: "icon-xiajiantou" },
          { id: 1, text: "截止时间", arrows: "icon-xiajiantou" },
        ],
      },
      searchShow: false, // 是否显示搜索
      queryInfo: "", // 搜索关键词

      // 筛选
      badgeNum: 0,
      selectSysId: -1, // 任务筛选的工单种类 --- 做回显
      showFiltrate: false,

      activeFlag: true, // 激活标志 → 首页跳转指定tab
    };
  },
  provide() {
    return { confirmEvent: this.confirmEvent };
  },
  computed: {
    ...mapGetters(["getLoginInfo"]),
    ...mapState("workOrder", ["currWorkGroupInfo"]),
    ...mapState("workBench", ["mainSrollTop"]),
  },
  watch: {
    "$store.state.operationSuccessFlag": {
      handler(newVal, oldVal) {
        if (newVal) {
          console.log("工作台刷新标识发生变化", newVal);
          // 按钮操作成功 → 重新调用接口
          // 判断路由是否在当前页 是 → 直接刷新 不是 → 存储标识在激活本路由时刷新
          if (this.$route.name == "WorkBench") {
            // 直接刷新
            // 防止之前有其他操作按钮累计的刷新标识
            if (!this.refreshFlag) {
              // 重置列表 → 获取列表结果
              this.resetListInfo();
              // 判断是任务还是工单 → 获取对应看板数
              if (this.isTask == 1) {
                // 重新获取任务列表
                this.$refs.myTask.getTaskNum();
              } else {
                // 重新获取工单列表
                this.$refs.departmentOrder.getOrderNum();
              }
              // 刷新完将操作状态复原
              this.operationSuccessRefresh(false);
            }
          } else {
            this.refreshFlag = true;
          }
        }
      },
    },
  },
  methods: {
    // 返回联通网络主页
    goBack() {
      this.$router.go(-1);
      this.$store.commit("removeThisPage", ["Main", "WorkBench"]);
    },
    // 选择我的任务 or 部门工单
    clickMenu(bool) {
      if (bool == 0) {
        // 工单 sysId不包含3,7,9 无法点击
        let sysIds = [];
        this.getLoginInfo?.userIds.forEach((item) => {
          sysIds.push(item.sysId);
        });

        // 交集
        let unite = sysIds.filter((item) => {
          return [3, 7, 9].indexOf(item) > -1;
        });
        if (unite.length > 0) {
          // sysIds内存在3,7,9，如果只有3且ifmSysIds无值，则没有工单
          if (unite.length == 1 && unite[0] == 3) {
            // 判断ifmSysIds
            if (this.getLoginInfo?.ifmSysIds.length == 0)
              return this.$toast("您没有部门工单的操作权限");
          }
        } else {
          return this.$toast("您没有部门工单的操作权限");
        }
      }
      // 将筛选个数清零
      this.badgeNum = 0;
      // 切换任务/工单
      this.isTask = bool;
      this.selectSysId = -1;
      this.siftPara = {};
      // 清空列表，重置参数
      this.page = 1;
      this.contentList = [];
      this.isFinished = false;
      this.isEmpty = false;
      // 重置tab栏索引
      this.tabActive = 0;
      // 滚轴置顶
      document.querySelector(".main").scrollTop = 0;
      // document.body.scrollTop = document.documentElement.scrollTop = 0
      if (bool) {
        // 任务 给一个初始的看板背景高度，防止数据未获取到看板没有高度
        this.tabOffsetTop = 40 + this.$refs.head.clientHeight;
        this.getTabList();
      } else {
        // 工单
        this.tabOffsetTop = 30 + this.$refs.head.clientHeight;
        // 获取工单信息
        this.getWorkOrder();
      }
    },
    // 重置列表请求参数
    resetListInfo() {
      // 重置参数，发送请求
      this.page = 1;
      this.contentList = [];
      this.isFinished = false;
      this.isEmpty = false;
      // document.body.scrollTop = document.documentElement.scrollTop = 0
      document.querySelector(".main").scrollTop = 0;

      // 判断是否是快速查询页面
      this.judgeFastQuery();
    },
    // 判断是否是快速查询页面
    judgeFastQuery() {
      if (this.tabList[0]?.name == "筛选结果") {
        // 请求快速查询接口
        this.getSearchResultList();
      } else {
        this.getListInfo();
      }
    },
    // 切换tab栏
    changeTabs(index, title) {
      // 切换tab栏取消未完成的请求
      this.$store.commit("CLEARCANCEL");

      // tab栏头部为快速筛选 → 点击其他索引 → 删除快速筛选选项
      if (this.tabList[0].name == "筛选结果") {
        this.queryInfo = "";
        this.tabList.shift();
        this.tabActive = index - 1;
        this.taskType = this.tabList[index - 1].id;
        // 恢复排序功能
        this.listSort.order = 1;
      } else {
        // 切换tab栏id
        this.taskType = this.tabList[index].id;
      }

      // 判断是否要关闭快速筛选搜索页面
      this.closeSearch();

      // 清空工单看板跳转的筛选条件
      this.bigBoardSiftPara = {};
      // 获取列表信息
      this.resetListInfo();
    },
    // 隐藏搜索页面并清空搜索条件
    closeSearch() {
      // 若快速筛选无筛选结果，切换tab栏则隐藏搜索页面并清空搜索条件
      if (this.searchShow) {
        this.searchShow = false;
        this.queryInfo = "";
      }
    },
    // 点击排序
    clickSort(value) {
      // 判断是否要关闭快速筛选搜索页面 → 点击排序则关闭快速筛选功能
      if (this.tabList[0].name == "筛选结果") {
        this.tabList.shift();
        // 恢复排序功能
        this.listSort.order = 1;
      }
      this.closeSearch();

      let listSort = this.listSort;
      // 点击同一项改变顺序
      if (listSort.currentId == value) {
        if (listSort.actions[value - 1].arrows == "icon-xiajiantou") {
          // 取反
          this.$set(
            this.listSort.actions[value - 1],
            "arrows",
            "icon-shangjiantou"
          );
          this.$set(this.listSort, "sort", 1);
        } else {
          this.$set(
            this.listSort.actions[value - 1],
            "arrows",
            "icon-xiajiantou"
          );
          this.$set(this.listSort, "sort", 2);
        }
      } else {
        if (value == 1) {
          // 点击受理时间
          this.$set(this.listSort, "order", 1);
        } else {
          // 点击截止时间
          this.$set(this.listSort, "order", 3);
        }
        this.$set(this.listSort, "currentId", value);
      }
      // 更新列表信息
      this.resetListInfo();

      /*       // 筛选结果禁用排序功能
            if (this.tabList[0].name == '筛选结果') {
              // this.$toast('筛选结果不可使用排序功能')
            } else {
      
            } */
    },
    // 点击快速筛选
    clickRapidCull() {
      this.searchShow = !this.searchShow;
    },
    // 快速筛选-搜索工单
    async onSearch() {
      if (this.queryInfo == "") return this.$toast("搜索内容不能为空");
      // 清空contentList
      this.contentList = [];
      this.page = 1;
      this.isEmpty = false;
      this.isFinished = false;
      // document.body.scrollTop = document.documentElement.scrollTop = 0
      document.querySelector(".main").scrollTop = 0;

      this.getSearchResultList();
    },
    // 请求筛选结果列表
    async getSearchResultList() {
      // 快速查询
      let keyWord = this.queryInfo;
      let sysIds = [];
      let page = this.page;
      let groupId = -1;

      if (this.isTask == 1) {
        // 任务 返回所有sysId
        this.getLoginInfo?.userIds.forEach((item) => {
          sysIds.push(item.sysId);
        });
      } else {
        // 工单
        sysIds = [this.listPostData.sysId];
        groupId = this.currWorkGroupInfo.groupId;
      }
      try {
        let postData = { keyWord, sysIds, page, groupId };
        let result = await reqFastQuery(JSON.stringify(postData));
        console.log("快速查询结果", result);

        this.apiResponse(result, ".workbench", () => {
          this.searchShow = false;
          // 有数据 → 在tab栏头部新增一个筛选结果
          if (this.tabList[0].name !== "筛选结果") {
            this.tabList.unshift({ id: -1, name: "筛选结果" });
            this.tabActive = 0;
            // 禁用排序功能
            this.listSort.order = -1;
          }
          this.handleListInfo(result);
        });
        if (!result.operationSuccessFlag) {
          // 更新加载失败信息
          this.listInfoLoadFail();
        }
      } catch (error) {
        this.listInfoLoadFail();
        console.log("err", error);
      }
    },
    // tab栏头部为快速筛选 → 删除快速筛选选项
    removeRapidCull() {
      if (this.tabList[0].name == "筛选结果") {
        this.queryInfo = "";
        this.tabList.shift();
        this.tabActive = 0;
        this.taskType = this.tabList[0].id;
      }
    },
    // 子组件切换工作组
    changeGroup() {
      // 清空右上角筛选内容
      this.siftPara = {};
      this.badgeNum = 0;
      // tab栏头部为快速筛选 → 删除快速筛选选项
      this.removeRapidCull();

      // 清空工单看板跳转的筛选条件
      this.bigBoardSiftPara = {};
      // 重置参数，发送请求
      this.resetListInfo();
    },
    // 个性化-选择工单
    selectOrder(order) {
      this.selectOrderShow = false;
      this.orderId = order.id;
      this.orderName = order.name;
      this.listPostData.sysId = order.sysId;
      this.listPostData.ifmSysId = -1;
      if (order.hasOwnProperty("ifmSysId")) {
        // 维护类
        this.listPostData.ifmSysId = order.ifmSysId;
      }
      this.siftPara = {};
      this.badgeNum = 0;
      // 给子组件传值
      this.workOrderDetail = order;
      console.log("给子组件工作组传值", this.workOrderDetail);

      // 切换默认工作组
      this.getGroupIdName(order);
      // 选择建设中台不需要请求
      if (order.id !== 6) {
        // 获取tab标题列表
        this.getTabList();
      }

      // 清空contentList
      this.page = 1;
      this.contentList = [];
      this.isFinished = false;
      this.isEmpty = false;
      document.querySelector(".main").scrollTop = 0;
      // 清空搜索条件
      this.queryInfo = "";
      // 清空工单看板跳转的筛选条件
      this.bigBoardSiftPara = {};
    },
    // 得到工单信息
    getWorkOrder() {
      /* 1.从登录后返回接口里的userIds找sysId(工单模块显示)，
    sysId为3的找登录返回的ifmSysIds（维护类）在工单模块显示，
    
      // 登录返回信息里获取userIds.sysId和ifmSysIds
      /* 1:IFM外包账号（公众类-智家工单）;2:IOM（公众类-智家工单）;3:IFM（维护类-在ifmSysIsd里找）;
        7:JNDD（局内-局内工单）,9:IDM（基站-基站工单）,10:IOMNew（公众类-智家工单）,11:ywjs（建设类-建设单）,
        12:tsxq（投诉类-投诉单） */
      // 登录返回信息里获取userIds.sysId和ifmSysIds
      let sysIds = [];
      this.getLoginInfo?.userIds.forEach((item) => {
        sysIds.push(item.sysId);
      });

      let ifmSysIds = this.getLoginInfo.ifmSysIds;
      // sysId对应的工单类 ,只保留3,7,9
      let workOrderInfo = [
        /* {
          id: 1,
          title: "公众类",
          name: "智家工单",
          value: "IFM外包账号",
          sysId: 1,
        },
        { id: 2, title: "公众类", name: "智家工单", value: "IOM", sysId: 2 },
        {
          id: 3,
          title: "公众类",
          name: "智家工单",
          value: "IOMNew",
          sysId: 10,
        }, */
        { id: 4, title: "开通类", name: "局内工单", value: "JNDD", sysId: 7 },
        { id: 5, title: "开通类", name: "基站开通单", value: "IDM", sysId: 9 },
        { id: 6, title: "建设类", name: "建设中台", value: "js", sysId: 11 },
        // { id: 6, title: "建设类", name: "建设项目单", value: "ywjs", sysId: 11 },
        // { id: 7, title: "投诉类", name: "投诉需求单", value: "tsxq", sysId: 12 },
      ];
      // ifm对应的工单类 sysId为3
      let ifmWorkOrder = [
        {
          id: 31,
          title: "维护类",
          name: "故障单",
          value: "IFM故障单",
          ifmSysId: 1,
          sysId: 3,
        },
        {
          id: 32,
          title: "维护类",
          name: "预警单",
          value: "IFM预警单",
          ifmSysId: 3,
          sysId: 3,
        },
        {
          id: 34,
          title: "维护类",
          name: "支撑单",
          value: "IFM支撑单",
          ifmSysId: 4,
          sysId: 3,
        },
        {
          id: 35,
          title: "维护类",
          name: "重保单",
          value: "IFM重保单",
          ifmSysId: 5,
          sysId: 3,
        },
        {
          id: 36,
          title: "维护类",
          name: "移网优化单",
          value: "IFM移网优化单",
          ifmSysId: 6,
          sysId: 3,
        },
      ];
      // 工单种类顺序：公众类 维护类 局内 基站 建设类 投诉类
      // 将sysId对应内容放入容器titleOrder
      let all = workOrderInfo.filter((info) => {
        return sysIds.includes(info.sysId);
      });

      // 将ifmSysId对应内容放入titleOrder
      if (ifmSysIds.length > 0) {
        // 有维护类工单
        ifmWorkOrder = ifmWorkOrder.filter((ifm) => {
          return ifmSysIds.includes(ifm.ifmSysId);
        });
        // 将维护类工单放入all
        all.push(...ifmWorkOrder);
        // console.log(all);
      }
      let titleOrder = [
        // { id: 1, title: "公众类", content: [] },
        { id: 2, title: "维护类", content: [] },
        { id: 3, title: "开通类", content: [] },
        { id: 4, title: "建设类", content: [] },
        // { id: 5, title: "建设类", content: [] },
        // { id: 6, title: "投诉类", content: [] },
      ];
      // 将工单依次存入对应content
      all.forEach((item) => {
        titleOrder.forEach((tt) => {
          if (item.title == tt.title) {
            tt.content.push(item);
          }
        });
      });
      // 将公众类统一成一个智家工单
      /*   if (titleOrder[0].content.length > 1) {
          let idList = []
          titleOrder[0].content.forEach((item) => {
            idList.push(item.sysId)
          })
          let content = [
            {
              id: 1,
              title: "公众类",
              name: "智家工单",
              value: "IOM",
              sysId: idList,
            },
          ]
          titleOrder[0].content = content
        } */
      this.selectOrderActions = titleOrder;

      // 判断如何获取对应工单
      this.judgeSelectOrder(ifmWorkOrder, workOrderInfo);
    },
    // 将工作组id和工作组名称存入vuex
    getGroupIdName(workOrderInfo) {
      let groupId = -1;
      let groupName = "";
      // 判断sysId与defaultSheetGroupList中的groupSysId是否相同
      this.getLoginInfo.defaultSheetGroupList.forEach((item) => {
        if (item.groupSysId == workOrderInfo.sysId) {
          // 获取工作组默认id
          groupId = item.groupId;
        }
      });

      // 根据默认id获取工作组默认名称
      if (groupId !== -1) {
        this.getLoginInfo.listSheetGroup.forEach((item) => {
          if (item.groupId === groupId) {
            groupName = item.groupName;
            // 存入vuex
            this.$store.commit("workOrder/updateCurrWorkGroupInfo", {
              groupId,
              groupName,
            });
          }
        });
      }
    },

    // 获取子组件传值
    // 获取子组件高度
    getBgHeight(height) {
      if (height > 0) this.firstDataSummaryBgHeight = height;
      this.dataSummaryBgHeight = height;
      let headHeight = this.$refs.head?.clientHeight;
      this.tabOffsetTop = this.dataSummaryBgHeight + headHeight;
    },
    // 获取子组件点击看板对应的taskType
    getTaskType(taskType, siftPara) {
      // 工单看板跳转列表携带条件
      if (siftPara) {
        // 记录一下本次列表跳转携带筛选条件 → 再次跳转需要删除上次跳转筛选条件
        this.bigBoardSiftPara = JSON.parse(siftPara);
      } else {
        // 点击看板的无需条件，直接跳转listId
        this.bigBoardSiftPara = {};
      }
      // 去掉快速筛选
      if (this.tabList[0].name == "筛选结果") {
        this.queryInfo = "";
        this.tabList.shift();
      }
      this.taskType = taskType;
      // 改变tab栏激活选项
      for (let index in this.tabList) {
        if (this.tabList[index].id == taskType) {
          this.resetListInfo();
          return (this.tabActive = Number(index));
        }
      }
    },

    // contentList下
    // 下拉刷新
    onRefresh() {
      this.isFinished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.isLoading = true;
      this.onLoad();
    },
    // 上拉加载
    async onLoad() {
      if (this.isRefresh) {
        console.log("触发下拉刷新");
        this.contentList = []; //清空列表数据
        this.page = 1;
        this.isRefresh = false;
        // 请求列表数据
        this.judgeFastQuery();
        // 请求看板数据
        // 判断是任务还是工单 → 获取对应看板数
        if (this.isTask == 1) {
          // 重新获取任务列表
          this.$refs.myTask.getTaskNum();
        } else {
          // 重新获取工单列表
          this.$refs.departmentOrder.getOrderNum();
        }
      } else {
        // contentList有数据在触发上拉加载
        if (this.contentList.length > 0) {
          console.log("触发上拉加载");
          // 改变page请求接口
          this.page++;
          // 请求数据
          this.judgeFastQuery();
        }
      }
    },

    // 获取tab标题列表
    async getTabList() {
      let sysIds = [];
      let ifmSysId = -1;
      let groupSysId = -1;
      if (this.isTask == 1) {
        // 任务 获取用户userIds里的hasTaskList=1时的sysId
        sysIds = getHasTaskListSysId(this.getLoginInfo?.userIds);
      } else {
        // 工单
        sysIds = [this.listPostData.sysId];
        ifmSysId = this.listPostData.ifmSysId;
        groupSysId = this.listPostData.sysId;
      }

      let postData = { sysIds, ifmSysId, groupSysId };
      let result = await reqBillListTab(JSON.stringify(postData));
      console.log("获取tab栏标题列表", result);
      this.apiResponse(result, ".workbench", () => {
        // 请求成功
        let listTabInfo = result;
        // 获取列表tab
        let listTabContent = [];
        if (this.isTask == 1) {
          listTabContent = listTabInfo.showTaskList;
        } else {
          // 工单内只有sysId是3,7,9的时候取showSheetList
          let sheet = [3, 7, 9];
          if (sheet.includes(this.listPostData.sysId)) {
            listTabContent = listTabInfo.showSheetList;
          } else {
            listTabContent = listTabInfo.showTaskList;
          }
        }
        // 根据列表值从小到大排序
        listTabContent.sort(this.sortId);
        this.tabList = listTabContent;
        this.taskType = listTabContent[0].id; // 获取默认第一个taskType
        this.tabActive = 0; // 定位到第一个tab
        // 获取列表内容
        this.getListInfo();
      });
    },
    // 根据id排序
    sortId(a, b) {
      return a.id - b.id;
    },
    // 获取列表内容
    async getListInfo() {
      let groupId = -1;
      let groupSysId = this.listPostData.sysId;
      let order = this.listSort.order;
      let page = this.page;
      let siftPara = this.siftPara;
      let sort = this.listSort.sort;
      let sysIds = [];
      let taskType = this.taskType;

      if (groupSysId == 1) {
        groupSysId = -1; // 公众类传-1，其他类按照sysId传
      }

      // 获取点击看板跳转到列表id的筛选条件,任务和工单都有
      siftPara = { ...this.bigBoardSiftPara, ...siftPara };

      // 区分工单/任务
      if (this.isTask == 1) {
        // 任务 获取用户userIds里的hasTaskList=1时的sysId
        sysIds = getHasTaskListSysId(this.getLoginInfo?.userIds);
        groupSysId = -1;
        // 筛选内选择工单则sysIds为选择的工单
        if (this.selectSysId > -1) {
          sysIds = [this.selectSysId];
        }
      } else {
        // 工单
        groupId = this.currWorkGroupInfo.groupId;
        sysIds = [this.listPostData.sysId];

        // 需要在筛选条件里加ifmSysId字段
        siftPara = { ...{ ifmSysId: this.listPostData.ifmSysId }, ...siftPara };
      }

      let postData = {
        groupId,
        groupSysId,
        order,
        page,
        siftPara,
        sort,
        sysIds,
        taskType,
      };
      try {
        let result = await reqgetOrderList(JSON.stringify(postData));
        console.log("获取列表结果", result);
        this.apiResponse(result, ".workbench", () => {
          // 请求成功
          this.handleListInfo(result);
        });
        // 请求失败
        if (!result.operationSuccessFlag) {
          // 更新加载失败信息
          this.listInfoLoadFail();
        }
      } catch (error) {
        this.listInfoLoadFail();
        console.log("err", error);
      }
    },

    // 列表加载失败
    listInfoLoadFail() {
      this.isLoading = false; // 加载失败 关闭加载状态
      this.isFinished = true; // 加载失败 关闭上拉加载
      if (this.contentList.length > 0) {
        this.isEmpty = false;
        this.finishText = "没有更多了";
      } else {
        this.isEmpty = true;
        this.finishText = "";
      }
    },

    // 处理列表内容
    handleListInfo(result) {
      this.isLoading = false; // 加载完成 关闭加载状态
      // 判断数据是否全部请求完成 isFinished
      if (this?.page >= result?.totalPage) {
        // console.log('关闭加载')
        this.isFinished = true;
        this.finishText = "没有更多了";
      }
      // 获取列表信息
      let rowInfos = result.rowInfos;

      if (rowInfos.length > 0) {
        // 有数据
        this.isEmpty = false;
        // 第一个数组 标题信息 ； 第二个数组 展开信息
        rowInfos.forEach((rowInfo, index) => {
          // 获取列表文本
          // 防止json.parse遇到特殊字符解析错误
          let content = rowInfo.colData;
          // let info = content.replace(/^\s*|\s*$/g, "");
          let info = content.replace(/^\s*|\s*$|[\r\n+]/g, "");
          info = JSON.parse(info);
          info[0].push(this.contentList.length + 1);
          // // 只取按钮前四项
          let buttonList = rowInfo.buttonList.slice(0, 4);
          let listInfo = {
            info,
            button: buttonList,
            ...rowInfo,
          };
          this.contentList.push(listInfo);
        });
      } else {
        this.listInfoLoadFail();
      }
    },

    // 获取tab栏吸顶高度 div-dataSummary高度
    getTabOffsetTop() {
      // this.dataSummaryBgHeight = (this.$refs.dataSummary.clientHeight - 76)
      // this.tabOffsetTop = this.$refs.static.clientHeight
      let headHeight = this.$refs.head.clientHeight;
      this.tabOffsetTop = this.dataSummaryBgHeight + headHeight;
    },
    // 获取列表传参内的筛选参数
    getSiftPara(siftPara, siftNum, sysIds) {
      // tab栏头部为快速筛选 → 删除快速筛选选项
      this.removeRapidCull();
      // 获取参数 重发列表请求
      this.showFiltrate = false;
      this.siftPara = siftPara;
      this.badgeNum = siftNum;
      if (sysIds) {
        this.selectSysId = sysIds;
        console.log("sysId", this.selectSysId);
      }
      console.log("筛选参数", this.siftPara, siftNum, sysIds);

      // 清空工单看板跳转的筛选条件
      this.bigBoardSiftPara = {};
      this.resetListInfo();
    },

    // 监听main滚动事件
    scrolling: throttle((self) => {
      let scrollTop = document.querySelector(".main").scrollTop;
      // let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 50) {
        // 缩小头部背景高度 → 传值给子组件隐藏dataSummaryBg → 将dataSummaryBg传给父组件
        // 放在原生内的 初始高度：110px 缩小高度：80px
        // 放在浏览器内的 初始高度：140px 缩小高度：110px
        if (localStorage.getItem("Addhead") == "true") {
          self.headHeight = "110px";
        } else {
          self.headHeight = "80px";
        }

        self.showDataSummary = false;
        self.$nextTick(() => {
          self.getBgHeight(0);
        });
      }
      if (scrollTop < 50) {
        if (localStorage.getItem("Addhead") == "true") {
          self.headHeight = "140px";
        } else {
          self.headHeight = "110px";
        }

        self.showDataSummary = true;
        self.$nextTick(() => {
          self.getBgHeight(self.firstDataSummaryBgHeight);
        });
      }
    }, 0),
    monitorMainScroll() {
      // 监听div滚动事件
      let self = this;
      this.$parent.$refs.main.addEventListener(
        "scroll",
        this.scrolling.bind(this, self)
      );
    },

    // 电话图标移动
    iconMove(status) {
      // 禁止页面滚轴滑动
      document.querySelector(".main").style.overflowY = status;
    },
    // 点击确认键
    async confirmEvent(res, dialFlagChecked) {
      console.log("确认键：", res);
      // 判断号码格式是否正确 请求云入户
      cloudCall(res, "手工拨号", dialFlagChecked);
    },

    // 判断是否显示电话图标
    judgePhoneIcon() {
      let arr = [1, 10];
      let sysIds = [];
      this.getLoginInfo?.userIds.forEach((item) => {
        sysIds.push(item.sysId);
      });
      // 获取交集
      let unite = arr.filter(function (val) {
        return sysIds.indexOf(val) > -1;
      });

      if (this.isTask == 1 && unite.length > 0) {
        return true;
      } else {
        false;
      }
    },
    // 获取选择工单起泡弹出框挂载点
    getContainer() {
      return document.querySelector(".workbench");
    },
    // 首页点击看板跳转到对应的任务tab
    async homeJump() {
      var id = getItem("taskId");
      if (id) {
        if (this.isTask == 0) {
          // 如果是工单，则跳转到任务页
          this.isTask = 1;
          let sysIds = [];
          let ifmSysId = -1;
          let groupSysId = -1;
          // 任务 返回所有sysId
          this.getLoginInfo?.userIds.forEach((item) => {
            sysIds.push(item.sysId);
          });
          let postData = { sysIds, ifmSysId, groupSysId };
          let result = await reqBillListTab(JSON.stringify(postData));
          console.log("获取tab栏标题列表", result);
          this.apiResponse(result, ".workbench", () => {
            // 请求成功
            let listTabInfo = result;
            // 获取列表tab
            let listTabContent = [];
            listTabContent = listTabInfo.showTaskList;
            // 根据列表值从小到大排序
            listTabContent.sort(this.sortId);
            this.tabList = listTabContent;
          });
        }

        this.$nextTick(() => {
          this.taskType = id;
          this.tabList.forEach((e, i) => {
            if (e.id == id) {
              setTimeout(() => {
                this.tabActive = i;
              }, 500);
            }
          });
          this.resetListInfo();
        });
        console.log(
          `首页参数跳转任务tab,id:${id},tabActive:${this.tabActive},taskType:${this.taskType} `
        );
        removeItem("taskId");
      }
    },
    // 判断是否为联通网络，是否从建设中台外部链接进入工作台，需要跳转到指定工单位置
    async uniNetWorkBench() {
      if (getItem("jsMiddlePlatformFlag")?.isLocation == true) {
        // 从外部网站进入定位到建设中台
        // 判断当前工作台是联通网络还是建维优
        if (getItem("jsMiddlePlatformFlag").projectFlag == 2) {
          // 联通网络
          this.headTextMargin = "0px 12px 20px"; // 改变头部样式
          this.$store.commit("changeProjectFlag", 2);
        }
        this.isTask = 0; // 防止获取任务看板数
        setItem("jsMiddlePlatformFlag", {
          isLocation: true,
          isCreate: true,
        });
        this.$nextTick(() => {
          this.clickMenu(0);
        });
      } else {
        // 判断当前工作台是联通网络还是建维优
        if (this.$store.state.projectFlag == 2) {
          // 联通网络
          this.headTextMargin = "0px 12px 20px"; // 改变头部样式
          this.isTask = 0;
          this.$nextTick(() => {
            this.clickMenu(0);
          });
        } else {
          // 默认选中我的任务
          this.isTask = 1;
          await this.getTabList();
          await this.homeJump();
          this.activeFlag = false;
        }
      }
    },
    // 判断是否为联通网络，是否从建设中台外部链接进入工作台，工单自动跳转到指定位置
    judgeSelectOrder(ifmWorkOrder, workOrderInfo) {
      // 如果本地没存储建设中台，则给一个默认的工单
      // 移动端外部链接返回工作台不走创建 → 无需重新定位
      if (
        getItem("jsMiddlePlatformFlag")?.isLocation &&
        getItem("jsMiddlePlatformFlag")?.isCreate
      ) {
        // pc端建设中台返回工作台
        // 联通网络/建维优 外部网址进入 → 保持在建设中台
        let order = {
          id: 6,
          name: "建设中台",
          sysId: 11,
          title: "建设类",
          value: "js",
        };
        this.selectOrder(order);
      } else {
        // 联通网络 → 需要跳转到指定工单位置
        if (this.$store.state.projectFlag == 2) {
          if (this.$route.query.sysId == 3) {
            // 匹配ifm工单内容
            for (let ifm of ifmWorkOrder) {
              if (ifm.id == this.$route.query.orderId) {
                this.selectOrder(ifm);
                break;
              }
            }
          } else {
            // 匹配其他单子
            for (let order of workOrderInfo) {
              if (order.id == this.$route.query.orderId) {
                this.selectOrder(order);
                break;
              }
            }
          }
        } else {
          // 建维优 → 默认获取工单信息
          for (let action of this.selectOrderActions) {
            if (action.content.length > 0) {
              this.selectOrder(action.content[0]);
              break;
            }
          }
        }
      }

      if (getItem("jsMiddlePlatformFlag")) {
        removeItem("jsMiddlePlatformFlag");
      }
    },
  },

  created() {
    // 获取头部尺寸
    if (localStorage.getItem("Addhead") == "true") {
      this.headHeight = "140px";
      this.headTextMargin = "40px 12px 20px";
    }

    // 判断是否为联通网络，是否从建设中台外部链接进入工作台，需要跳转到指定工单位置
    this.uniNetWorkBench();
  },
  mounted() {
    // 获取tab栏吸顶高度
    this.getTabOffsetTop();
    // 获取元素高度 van-tabs__wrap
    // this.tabHeight = document.querySelector('.van-sticky').clientHeight
    this.tabHeight = document.querySelector(".van-tabs__wrap")?.clientHeight;
    this.rapidCullHeight = this.$refs.rapidCull.clientHeight;

    // 监听main滚动
    this.monitorMainScroll();
  },

  activated() {
    // 首页跳转任务指定tab
    if (!this.activeFlag) {
      this.homeJump();
    }
    // 激活路由后判断是否要刷新接口
    if (this.refreshFlag) {
      // 重置列表 → 获取列表结果
      this.resetListInfo();
      document.querySelector(".main").scrollTop = 1;
      // 判断是任务还是工单 → 获取对应看板数
      if (this.isTask == 1) {
        // 重新获取任务列表
        this.$refs.myTask.getTaskNum();
      } else {
        // 重新获取工单列表
        this.$refs.departmentOrder.getOrderNum();
      }
      // 刷新完将操作状态复原
      this.operationSuccessRefresh(false);
      this.refreshFlag = false;
    } else {
      // 激活后滚轴恢复上一次位置
      let mainScrollTop = this.mainSrollTop;
      document.querySelector(".main").scrollTop = mainScrollTop;
    }
  },
  deactivated() {
    // this.$parent.$refs.main.removeEventListener('scroll', this.scrolling.bind(this, self))
  },
  beforeDestroy() {
    // this.$parent.$refs.main.removeEventListener('scroll', this.scrolling.bind(this, self))
    removeItem("mainSrollTop");
  },

  beforeRouteLeave(to, from, next) {
    let mainSrollTop = document.querySelector(".main").scrollTop; //获取滚动高度
    this.$store.commit("workBench/CHANGEMAINSCROLLTOP", mainSrollTop);
    next();
  },
};
</script>

<style scoped lang="less">
.workbench {
  min-height: 100%;
  background-color: @bg-color;
  font-family: PingFangSC-Regular, PingFang SC;
  .static {
    z-index: 100;
    position: fixed;
    top: 0;
    width: 100%;
    .head {
      overflow: hidden;
      width: 100%;
      // height: 188px;
      // height: 110px;
      // height: 80px;
      background-image: url("./images/headBg.png");
      // background-size: cover;
      background-size: 100% 100%;
      .headText {
        display: flex;
        justify-content: space-between;
        align-items: center;
        // margin: 10px 12px 20px;
        // margin: 40px 12px 20px;
        color: #fff;
        .left {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 30%;
          .userName {
            width: 100%;
            white-space: nowrap;
          }
          .van-popover__wrapper {
            .customize {
              .icon-xiajiantou {
                margin-left: 5px;
              }
            }
          }
          .selectOrder {
            width: 30%;
          }
        }

        .menu {
          display: flex;
          flex-direction: column;
          margin-right: 60px;
          color: #9bbae3;
          .workOrder {
            margin-top: 5px;
          }
          .menuActive {
            font-size: 20px;
            color: #fff;
          }
        }
        .iconRegion {
          margin: 0 10px;
          .iconfont {
            vertical-align: middle;
          }
          .icon-sousuo {
            margin-right: 10px;
            font-size: 20px;
          }
          .icon-jurassic_filtrate {
            font-size: 18px;
          }
        }
      }
    }
  }
  /deep/.van-popover__content {
    width: 80%;
    .selectOrder {
      padding: 10px 20px;
      .orderCategory {
        margin-top: 10px;
        .title {
          text-align: left;
          font-weight: 600;
        }
        .content {
          display: flex;
          flex-flow: wrap;
          font-size: 14px;
          justify-content: flex-start;
          .item {
            height: 20px;
            padding: 5px 10px;
            margin-top: 10px;
            margin-right: 20px;
            line-height: 20px;
            border-radius: 15px;
            background-color: #f1f2f3;
          }
          .active {
            background-color: #305bfd;
            color: #fff;
          }
        }
      }
    }
  }

  .billList {
    .myTab {
      .van-tabs {
        /deep/.van-tabs__wrap {
          // z-index: 1;
          // position: fixed;
          // width: 100%;
          // top: 226px;
        }
        /deep/.van-tabs__nav {
          // background-color: transparent;
          background-color: #f3f4f5;
          .van-tab--active {
            .van-tab__text {
              font-weight: 600;
              font-size: 18px;
            }
          }
          .van-tabs__line {
            width: 10px;
            bottom: 20px;
            z-index: 0;
          }
        }
        /deep/.van-tabs__content {
          .contentList {
            // margin-top: 40px;
            .van-list__finished-text {
              padding-bottom: 50px;
            }
          }
        }
      }
    }
  }
  .rapidCull {
    position: fixed;
    width: 100%;
    background-color: #fff;
    ul {
      display: flex;
      justify-content: space-between;
      .sortActive {
        color: @theme-color;
        .iconfont {
          color: @theme-color;
        }
      }
      li {
        flex: 1;
        padding: 10px 20px;
        color: #666666;
        font-size: 14px;
        &:not(:last-child)::after {
          content: "";
          position: absolute;
          width: 1px;
          height: 20px;
          margin-left: 24px;
          background-color: #e0e0e0;
        }
        .iconfont {
          margin-left: 5px;
          color: #bbbdc3;
          font-size: 14px;
          vertical-align: middle;
        }
        .icon-sousuo {
          margin-right: 5px;
        }
      }
      .Active {
        background-color: #e0e0e0;
      }
    }
  }
  .searchRegion {
    position: fixed;
    width: 100%;
    height: 50px;
    border-radius: 0 0 15px 15px;
    box-shadow: 0px 2px 10px 0px rgb(52 52 53 / 20%);
  }
  .search-leave-active,
  .search-enter-active {
    transition: all 0.5s ease;
    overflow-y: hidden;
  }

  .search-leave-active,
  .search-enter {
    height: 0px !important;
  }

  .search-leave,
  .search-enter-active {
    height: 50px;
  }
}
</style>