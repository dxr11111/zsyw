<template>
  <div class="content">
    <div v-if="currShowPage == 'index'">
      <!-- <div class="sort">
        <h3 class="title">排序</h3>
        <ul>
          <li
            v-for="item in sortList.list"
            @click="clickSortBtn(item)"
            :class="{ sortActive: sortList.currentId === item.id }"
            :key="item.id"
          >
            <span class="span-top-down"
              >{{ item.name }}
              <span class="icon">
                <i class="iconfont icon-arrowup" v-if="item.status === 2"></i>
                <i class="iconfont icon-arrowdown" v-if="item.status === 1"></i>
              </span>
            </span>
          </li>
        </ul>
      </div> -->
      <div class="filtrate">
        <h3 class="title">筛选</h3>
        <!-- 任务工单筛选 -->
        <div class="panel" v-if="isTask == 1">
          <div class="label">任务种类</div>
          <div class="opts">
            <div
              class="opt"
              :class="item.id == code ? 'active' : ''"
              v-for="(item, index) in taskTypeList"
              :key="index"
              @click="chooseTask(item)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <div
          :class="isClickWorkTypeDom ? 'panel' : 'field'"
          v-if="showWorkType"
        >
          <div class="label">{{ workTypeLabel }}</div>
          <!-- 点击dom式 -->
          <div class="opts" v-if="isClickWorkTypeDom">
            <div
              class="opt"
              :class="item.id == workType ? 'active' : ''"
              @click="chooseWorkType(item)"
              v-for="(item, index) in workTypeList"
              :key="index"
            >
              {{ item.name }}
            </div>
          </div>
          <!-- 选项式 -->
          <template v-else>
            <div
              class="position"
              style="flex: 1"
              @click="showWorkTypeChoice = true"
            >
              <input
                readonly
                style="width: 100%; flex: none"
                type="text"
                v-model="workTypeName"
                :placeholder="`请选择${workTypeLabel}`"
              />
              <span class="jiantou">▼</span>
            </div>
            <van-action-sheet
              v-model="showWorkTypeChoice"
              :round="false"
              :actions="workTypeList"
              close-on-click-action
              lock-scroll
              cancel-text="取消"
              @select="onSelectWorkType"
            />
          </template>
        </div>
        <div class="field" v-if="showBusiDom">
          <div class="label">监控指标</div>
          <div class="position" style="flex: 1" @click="showBusi = true">
            <input
              style="width: 100%; flex: none"
              readonly
              type="text"
              v-model="busiName"
              placeholder="请选择监控指标"
            />
            <span class="jiantou">▼</span>
          </div>
          <van-action-sheet
            v-model="showBusi"
            :round="false"
            :actions="busiNameList"
            close-on-click-action
            lock-scroll
            cancel-text="取消"
            @select="onSelectBusi"
          />
        </div>
        <div
          :class="isClickActionDom ? 'panel' : 'field'"
          v-if="showActionType"
        >
          <div class="label">
            <!-- {{ olderId == 1 ? '产品类型' : '施工动作' }} -->
            {{ actionTypeLabel }}
          </div>
          <!-- 点击选项式 -->
          <div class="opts" v-if="isClickActionDom">
            <div
              class="opt"
              :class="item.id == actionType ? 'active' : ''"
              v-for="(item, index) in actionTypeList"
              :key="index"
              @click="chooseActionType(item)"
            >
              {{ item.name }}
            </div>
          </div>
          <!-- 下拉框选择式 -->
          <template v-else>
            <div
              class="position"
              style="flex: 1"
              @click="showActionChoice = true"
            >
              <input
                type="text"
                readonly
                style="width: 100%; flex: none"
                v-model="actionType"
                :placeholder="`请选择${actionTypeLabel}`"
              />
              <span class="jiantou">▼</span>
            </div>
            <van-action-sheet
              v-model="showActionChoice"
              :round="false"
              :actions="actionTypeList"
              close-on-click-action
              lock-scroll
              cancel-text="取消"
              @select="onSelectActionType"
            />
          </template>
        </div>
        <div class="field" v-if="showAcceptTime">
          <!-- 重保单是制表时间，其余是受理时间 -->
          <div class="label">
            {{ ifmSysId == 5 && isTask == 0 ? "制表时间" : "受理时间" }}
          </div>
          <div class="position" style="flex: 1" @click="showTime = true">
            <input
              readonly
              style="width: 100%"
              type="text"
              v-model="acceptTime"
              placeholder="请选择时间"
            />
            <span class="jiantou">▼</span>
          </div>
          <van-popup
            v-model="showTime"
            position="bottom"
            :style="{ height: '40%' }"
          >
            <van-datetime-picker
              type="date"
              v-model="currDate"
              :min-date="minDate"
              :max-date="maxDate"
              :columns-order="['year', 'month', 'day']"
              :formatter="formatter"
              @confirm="chooseTime"
              @cancel="showTime = false"
            />
          </van-popup>
        </div>
        <div class="panel" v-if="showSvip">
          <div class="label">客户等级</div>
          <div class="opts">
            <div
              class="opt"
              :class="item.id == svip ? 'active' : ''"
              v-for="(item, index) in svipList"
              :key="index"
              @click="chooseSvip(item)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <!-- 目前只有修机单有 -->
        <div v-if="showService">
          <div class="panel">
            <div class="label">测速不达标</div>
            <div class="opts">
              <div
                class="opt"
                :class="item.id == speedError ? 'active' : ''"
                v-for="(item, index) in speedList"
                :key="index"
                @click="speedError = item.id"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
          <div class="panel">
            <div class="label">夜间服务</div>
            <div class="opts">
              <div
                class="opt"
                :class="item.id == nightService ? 'active' : ''"
                v-for="(item, index) in nightList"
                :key="index"
                @click="nightService = item.id"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
        <!-- 局内（工单类型） | 装机（环节标识） -->
        <div
          :class="isClickFlowNodeDom ? 'panel' : 'field'"
          v-if="showFlowNode"
        >
          <div class="label">{{ flowNodeLabel }}</div>
          <!-- 点击式 -->
          <template v-if="isClickFlowNodeDom">
            <div class="opts">
              <div
                class="opt"
                :class="item.name == currItem ? 'active' : ''"
                @click="chooseFlowNode(item)"
                v-for="(item, index) in flowNodeList"
                :key="index"
              >
                {{ item.name }}
              </div>
            </div>
            <div style="font-size: 16px; font-weight: normal">
              {{ currItem == "全部" ? "" : `已选择${currItem}：` }}
              <span v-for="(item, index) in selectedList" :key="index"
                >{{ item.name }}&nbsp;
              </span>
            </div>
          </template>
          <!-- 选项式 -->
          <template v-else>
            <div
              class="position"
              style="flex: 1"
              @click="showFlowNodeChoice = true"
            >
              <input
                readonly
                style="width: 100%; flex: none"
                type="text"
                v-model="flowNodeName"
                :placeholder="`请选择${flowNodeLabel}`"
              />
              <span class="jiantou">▼</span>
            </div>
            <van-action-sheet
              v-model="showFlowNodeChoice"
              :round="false"
              :actions="flowNodeList"
              close-on-click-action
              lock-scroll
              cancel-text="取消"
              @select="onSelectFlowNode"
            />
          </template>
        </div>
        <div class="field" v-if="showAcceptTitle">
          <div class="label">综合查询</div>
          <input
            type="text"
            v-model="acceptTitle"
            :placeholder="acceptTitlePlace"
          />
        </div>
        <div class="field" v-if="showBalkNo">
          <div class="label">{{ balkNoLabel }}</div>
          <input
            type="text"
            v-model="balkNo"
            :placeholder="`请输入${balkNoLabel}`"
          />
        </div>
        <!-- 局内的接单时间 -->
        <div class="time-box" v-if="sysId == 7">
          <div class="label">接单时间</div>
          <div class="right">
            <!-- 开始时间 -->
            <div class="position" @click="showStartTime = true">
              <input
                readonly
                class="time"
                type="text"
                v-model="jnddStartAcceptTime"
                placeholder="请选择接单开始时间"
              />
              <span class="jiantou">▼</span>
            </div>
            <van-popup
              v-model="showStartTime"
              position="bottom"
              :style="{ height: '40%' }"
            >
              <van-datetime-picker
                type="datetime"
                v-model="currDate"
                :min-date="minDate"
                :max-date="maxDate"
                :columns-order="['year', 'month', 'day', 'hour', 'minute']"
                :formatter="formatterAll"
                @confirm="chooseStartTime"
                @cancel="showStartTime = false"
              />
            </van-popup>
            <!-- 截止时间 -->
            <div class="position" @click="showEndTime = true">
              <input
                readonly
                class="time"
                type="text"
                v-model="jnddEndAcceptTime"
                placeholder="请选择接单截止时间"
              />
              <span class="jiantou">▼</span>
            </div>
            <van-popup
              v-model="showEndTime"
              position="bottom"
              :style="{ height: '40%' }"
            >
              <van-datetime-picker
                type="datetime"
                v-model="currDate"
                :min-date="minDate"
                :max-date="maxDate"
                :columns-order="['year', 'month', 'day', 'hour', 'minute']"
                :formatter="formatterAll"
                @confirm="chooseEndTime"
                @cancel="showEndTime = false"
              />
            </van-popup>
          </div>
        </div>
        <div class="field" v-if="showSheetNo">
          <div class="label">工单号</div>
          <input type="text" v-model="sheetNo" placeholder="请输入工单号" />
        </div>
        <div class="field" v-if="showProNum">
          <div class="label">流程标识</div>
          <div class="position" style="flex: 1" @click="showChoice = true">
            <input
              readonly
              style="width: 100%; flex: none"
              type="text"
              v-model="productNumName"
              placeholder="请选择流程标识"
            />
            <span class="jiantou">▼</span>
          </div>
          <van-action-sheet
            v-model="showChoice"
            :round="false"
            :actions="productNumList"
            close-on-click-action
            lock-scroll
            cancel-text="取消"
            @select="onSelectProNum"
          />
        </div>
        <!-- 类别 -->
        <div class="field" v-if="showSpecProdType">
          <div class="label">
            {{ ifmCode == 4 && isTask == 0 ? "专业" : "类别" }}
          </div>
          <!-- 支撑单 -->
          <template v-if="ifmCode == 4 && isTask == 0">
            <div style="flex: 1" class="position" @click="showSpecProd = true">
              <input
                readonly
                style="width: 100%; flex: none"
                type="text"
                v-model="specProdTypeName"
                placeholder="请选择专业"
              />
              <span class="jiantou">▼</span>
            </div>
            <van-action-sheet
              v-model="showSpecProd"
              :round="false"
              :actions="specProdTypeList"
              close-on-click-action
              lock-scroll
              cancel-text="取消"
              @select="onSelectSpecProd"
            />
          </template>
          <!-- 故障单或者筛选任务下的ifm 支持多选 -->
          <template v-if="ifmCode == 1 || isTask == 1">
            <div class="opts">
              <div
                class="opt"
                :class="item.name == currItem ? 'active' : ''"
                v-for="(item, index) in specProdTypeList"
                :key="index"
                @click="chooseSpecProd(item)"
              >
                {{ item.name }}
              </div>
            </div>
          </template>
          <!-- 重保单 -->
          <div class="opts" v-if="ifmCode == 5 && isTask == 0">
            <div
              class="opt"
              :class="item.id == specProdType ? 'active' : ''"
              v-for="(item, index) in specProdTypeList"
              :key="index"
              @click="chooseSpecProd(item)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <!-- 故障单选择的类别或者任务下的ifm -->
        <template v-if="(code == 3 && ifmCode == 1) || isTask == 1">
          <div
            style="font-size: 14px; text-align: left"
            v-if="selectedList.length > 0"
          >
            {{ currItem == "全部" ? "" : `已选择${currItem}：` }}
            <span v-for="(item, index) in selectedList" :key="index"
              >{{ item.name }}&nbsp;
            </span>
          </div>
        </template>
      </div>
      <div class="btns">
        <van-button color="gray" @click="resetFiltrate">重置</van-button>
        <van-button type="info" @click="confirm">确定</van-button>
      </div>
    </div>

    <OptionDetail
      v-if="currShowPage == 'optDetail'"
      :list="optsList"
      :topObj="optsTitle"
      :selectedList="selectedList"
      @clickCancel="clickCancel"
      @rejectSeleted="rejectSeleted"
    />
  </div>
</template>

<script>
import { formatDate, formatTime } from "@/utils/public/common";
import {
  sysIdType,
  specProdTypeList,
  publicSpecialList,
  jzdProStateList,
  jndProList,
  jndTypeList,
  jzdProCodeList,
  typeList,
  MonitIndList,
} from "@/utils/gdMethods/index";
import { getItem } from "@/utils/public/sessionStorage";
export default {
  props: {
    sysId: Number,
    ifmSysId: Number,
    isTask: Number, // 1是任务，0是工单
    siftPara: Object, // 筛选条件
    selectSysId: Number, // 任务的工单种类
  },
  components: {
    OptionDetail: () => import("./optionDetail"),
  },
  mounted() {
    // 部分手机顶部会被设备遮挡，所以加高一点
    if (this.$store.state.addHead) {
      document.getElementsByClassName("filtrate")[0].style.marginTop = "40px";
    }
  },
  created() {
    // 任务工单权限
    if (this.isTask == 1) {
      this.code = this.selectSysId == -1 ? "" : this.selectSysId;
      let sysIds = [];
      getItem("loginInfo").userIds.forEach((e) => {
        if (e.hasTaskList == 1 && e.sysId < 11) {
          sysIds.push(e.sysId);
        }
      });
      let arr = [{ id: "", name: "全部" }];
      for (let i = 0; i < sysIdType.length; i++) {
        const e = sysIdType[i];
        sysIds.forEach((item) => {
          if (e.id == item) return arr.push(e);
        });
      }
      console.log("任务筛选种类", arr);
      this.taskTypeList = arr;
      // 这三种情况不需要加载下面的筛选项
      /*  if (this.code !== 9 && this.code !== 3 && this.code !== 7) {
        this.updateSysId();
        this.echoData();
      } */
    } /* else {
      this.updateSysId();
    } */

    // 将选择的对应任务种类的筛选项显示出来
    this.updateSysId();
    // 显示上次关闭前的筛选数据
    if (Object.keys(this.siftPara).length !== 0) {
      this.echoData();
    }
  },
  data() {
    return {
      code: this.sysId, // 工单类型
      ifmCode: this.ifmSysId, // IFM工单类型
      taskTypeList: [], // 任务的工单权限
      // order: 1, // 排序条件
      // sort: 2, // 顺序
      // // 排序
      // sortList: {
      //   currentId: 1,
      //   list: [
      //     {
      //       id: 1,
      //       name: "受理时间",
      //       status: 1, // 1上 2下 0无
      //     },
      //     {
      //       id: 3,
      //       name: "截止时间",
      //       status: 0,
      //     },
      //     {
      //       id: 4,
      //       name: "派发时间",
      //       status: 0,
      //     }
      //   ],
      // },

      showTime: false, // 选择时间组件显示隐藏
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(2100, 12, 1),
      currDate: new Date(),

      showWorkType: false, // 控制dom
      workTypeLabel: "工单类型", // 展示的label名
      isClickWorkTypeDom: true, // 布局是点击还是出现选项，默认是点击式
      showWorkTypeChoice: false, // 控制选项式的选项
      workTypeName: "", // 选项式展示的name
      workType: "", // 传参
      workTypeList: [],

      showActionType: false, // 控制dom
      actionTypeLabel: "施工动作", // 展示的label名
      isClickActionDom: true, // 布局是点击还是出现选项，默认是点击式
      showActionChoice: false, // 控制选项
      // actionTypeName: '', // 显示值
      actionType: "", // 传参
      actionTypeList: [],

      showSvip: false,
      svipList: [
        { id: "", name: "全部" },
        { id: 1, name: "SVIP" },
        { id: 2, name: "SSVIP" },
      ], // 客户等级
      svip: "",

      showAcceptTime: false,
      acceptTime: null, // 受理时间  重保单叫制单时间

      showService: false,
      speedList: [
        { id: "", name: "全部" },
        { id: 1, name: "是" },
      ],
      speedError: "", // 测速不达标
      nightList: [
        { id: "", name: "全部" },
        { id: 1, name: "是" },
      ],
      nightService: "", // 夜间服务

      showFlowNode: false,
      isClickFlowNodeDom: true, // 布局是点击还是出现选项，默认是点击式
      flowNodeLabel: "",
      showFlowNodeChoice: false,
      flowNodeName: "", // 下拉式选择展示的name
      flowNodeList: [], // 环节标识
      flowNode: "", // 传参

      showAcceptTitle: false,
      acceptTitlePlace: "", // 提示信息
      acceptTitle: "", // 综合查询

      showBalkNo: false,
      balkNoLabel: "受理单号",
      balkNo: "", // 受理单号 局内单叫调单号

      showSheetNo: false,
      sheetNo: "", // 工单号

      showStartTime: false,
      jnddStartAcceptTime: null, // 接单开始时间，年月日时分秒
      showEndTime: false,
      jnddEndAcceptTime: null, // 接单截止时间，年月日时分秒

      showProNum: false,
      showChoice: false,
      productNumList: [], // 流程标识
      productNumName: "", // 流程标识名称
      productNum: "", // 流程标识--传参

      showSpecProdType: false,
      showSpecProd: false, // 控制选项
      specProdTypeList: [], // 类别
      specProdTypeName: "",
      specProdType: "", // 传参

      currShowPage: "index",
      optsList: [], // 跳转页面选项的详情数据
      optsTitle: {}, // 跳转页面选项的标题
      currItem: "全部", // 当前页选择项
      selectedList: [], // 多选时传已选择的数据

      showBusiDom: false,
      showBusi: false, // 控制选项
      busiNameList: [], // 监控指标
      busiName: "", // 传参
    };
  },
  methods: {
    updateSysId() {
      switch (this.code) {
        // 新装机单
        case 10:
          this.isClickActionDom = true; // 恢复成按钮点击式
          this.actionTypeLabel = "施工动作";

          // this.sortList.list.splice(2, 1, { id: 2, name: "预约时间", status: 0 })
          this.showAcceptTime = true;
          this.showActionType = true;
          this.showSvip = true;
          // this.showWorkType = true
          // 工单类型
          // this.workTypeList = [{ id: '', name: '全部' }, { id: '1', name: '正常单' }, { id: '2', name: '注销单' }]
          // 施工动作
          this.actionTypeList = [
            { id: "", name: "全部" },
            { id: "1", name: "装" },
            { id: "3", name: "移" },
            { id: "5", name: "变更" },
            { id: "7", name: "移机复装" },
          ];
          break;
        // 修机单
        case 1:
          this.isClickActionDom = true; // 恢复成按钮点击式

          // this.sortList.list.splice(2, 1, { id: 2, name: "预约时间", status: 0 })
          this.showService = true;
          this.showActionType = true;
          this.actionTypeLabel = "产品类型";
          this.showSvip = true;
          // 默认选择全部这项，如果筛选过要回显
          this.speedError = this.siftPara.speedError
            ? this.siftPara.speedError
            : "";
          this.nightService = this.siftPara.nightService
            ? this.siftPara.nightService
            : "";
          // 产品类型
          this.actionTypeList = [
            { id: "", name: "全部" },
            { id: "1026", name: "端到端评测" },
            { id: "1001", name: "ADSL/ISDN/PSTN/模拟专线" },
          ];
          break;
        // 装机单
        case 2:
          this.showAcceptTime = true;
          this.showSvip = true;
          this.showWorkType = true;
          this.showFlowNode = true;
          this.flowNodeLabel = "环节标识";
          // 工单类型
          this.workTypeList = [
            { id: "", name: "全部" },
            { id: "0", name: "正常单" },
            { id: "1", name: "注销单" },
            { id: "99", name: "延伸服务" },
          ];
          // 环节标识 -- 公众|专线
          this.flowNodeList = [
            { name: "全部" },
            { name: "公众" },
            { name: "专线" },
          ];
          this.showActionType = this.workType == "9" ? false : true;
          // this.showActionType = true
          // 施工动作
          this.actionTypeList = [
            { id: "", name: "全部" },
            { id: "0", name: "装" },
            { id: "1", name: "拆" },
            { id: "2", name: "改" },
            { id: "6", name: "移" },
          ];
          break;
        // IFM工单
        case 3:
          this.showAcceptTime = true;
          // 优化单
          if (this.ifmCode == 6) {
            this.showBusiDom = true;
            this.showAcceptTitle = true;
            this.showWorkType = true;
            this.workTypeLabel = "制式";
            this.acceptTitlePlace = "标题/厂家...";
            // 制式
            this.workTypeList = [
              { id: "", name: "全部" },
              { id: "2", name: "3G" },
              { id: "4", name: "4G" },
              { id: "5", name: "5G" },
            ];
            if (this.workType == "") {
              // 监控指标 -- 默认展示全部的
              MonitIndList.forEach((e) => {
                this.busiNameList.push(...e.children);
              });
            } else {
              // 回显效果
              this.busiNameList = MonitIndList.find(
                (e) => e.id == this.workType
              ).children;
            }
          } else {
            this.showBalkNo = true;
            this.showSheetNo = true;
            this.showAcceptTitle = true;
            // 故障单
            if (this.ifmCode == 1) {
              this.acceptTitlePlace = "标题/申告电话/类别/号码...";
              this.showSpecProdType = true;
              // 类别 -- 支持多选
              this.specProdTypeList = [
                { name: "全部" },
                { name: "专业" },
                { name: "产品" },
              ];
            }
            // 预警单
            if (this.ifmCode == 3) {
              this.acceptTitlePlace = "标题/联系人/电话/正反向...";
            }
            // 支撑单
            if (this.ifmCode == 4) {
              this.acceptTitlePlace = "标题/申告电话/类别...";
              this.showSpecProdType = true;
              this.specProdTypeList = typeList;
            }
            // 重保单
            if (this.ifmCode == 5) {
              // this.sortList.list.find(e => e.id == 1).name = '制表时间'
              this.showSpecProdType = true;
              this.balkNoLabel = "重保单号";
              this.acceptTitlePlace = "标题/集团重保编号/客户名称...";
              // 类别
              this.specProdTypeList = [
                { id: "", name: "全部" },
                { id: "1", name: "固网" },
                { id: "2", name: "移动" },
              ];
            }
            // 在任务下面点筛选内的ifm工单
            if (this.isTask == 1) {
              this.balkNoLabel = "受理单号";
              // 包含故障单和预警单内容
              this.acceptTitlePlace =
                "标题/申告电话/类别/号码/联系人/电话/正反向...";
              this.showSpecProdType = true;
              // 类别 -- 支持多选
              this.specProdTypeList = [
                { name: "全部" },
                { name: "专业" },
                { name: "产品" },
              ];
            }
          }
          break;
        // 局内
        case 7:
          this.showBalkNo = true;
          this.balkNoLabel = "调单号";
          this.showWorkType = true;
          this.workTypeLabel = "工程项目";
          this.isClickWorkTypeDom = false;
          this.showFlowNode = true;
          this.flowNodeLabel = "工单类型";
          // 工程项目
          this.workTypeList = jndProList;
          this.isClickFlowNodeDom = false;
          // 工单类型
          this.flowNodeList = jndTypeList;
          break;
        // 基站
        case 9:
          this.showAcceptTitle = true;
          this.acceptTitlePlace = "信源编号/站点名称/主题...";
          this.showProNum = true;
          this.showActionType = true;
          this.actionTypeLabel = "流程状态";
          this.isClickActionDom = false;
          // 流程标识
          this.productNumList = jzdProCodeList;
          // 流程状态
          this.actionTypeList = jzdProStateList;
          break;
        case "":
          break;
        default:
          break;
      }
    },
    // 回显数据
    echoData() {
      console.log("显示上次关闭前的筛选数据", this.siftPara);

      var obj = this.siftPara;
      if (obj.workType) {
        // 局内
        if (this.sysId == 7) {
          jndProList.forEach((e) => {
            if (obj.workType == e.id) {
              this.workType = obj.workType;
              this.workTypeName = e.name;
            }
          });
        } else {
          // 目前只有局内是下拉选择式，如果后面有，需要再加条件判断，这块需重新调整
          this.workType = obj.workType;
        }
        // 优化单
        if (this.ifmCode == 6) {
          this.busiNameList = MonitIndList.find(
            (e) => e.id == obj.workType
          ).children;
          // console.log('优化单制式', this.busiNameList)
        }
      }
      this.actionType = obj.actionType || "";
      this.svip = obj.svip || "";
      this.acceptTime = obj.acceptTime || "";
      // this.speedError = obj.speedError ? obj.speedError : -1
      // this.nightService = obj.nightService ? obj.nightService : -1
      this.acceptTitle = obj.acceptTitle || "";
      if (this.sysId == 3 && this.ifmSysId == 6) {
        this.acceptTitle = obj.vendor || "";
      }
      this.balkNo = obj.balkNo || "";
      this.sheetNo = obj.sheetNo || "";
      this.busiName = obj.busiName || "";
      // 基站 -- 流程标识
      if (obj.productNum) {
        jzdProCodeList.forEach((e) => {
          if (e.value == obj.productNum) {
            this.productNum = obj.productNum;
            this.productNumName = e.name;
          }
        });
      }
      if (obj.flowNode) {
        // 装机单 -- 环节标识
        if (this.sysId == 2) {
          for (let i = 0; i < publicSpecialList.length; i++) {
            const ele = publicSpecialList[i];
            ele.children.forEach((e) => {
              if (e.id == obj.flowNode) {
                this.currItem = ele.name;
                this.selectedList.push(e);
                this.flowNode = obj.flowNode;
              }
            });
          }
        }
        // 局内 -- 工单类型（选择式）
        if (this.sysId == 7) {
          jndTypeList.forEach((e) => {
            if (e.id == obj.flowNode) {
              this.flowNodeName = e.name;
              this.flowNode = obj.flowNode;
            }
          });
        }
      }
      // 类别
      if (obj.specProdType) {
        // 故障单
        if (this.ifmCode == 1 || this.isTask == 1) {
          this.specProdType = obj.specProdType;
          let arr = obj.specProdType.split(",");
          for (let i = 0; i < specProdTypeList.length; i++) {
            const ele = specProdTypeList[i];
            ele.children.forEach((e) => {
              arr.forEach((item) => {
                if (item == e.id) {
                  this.selectedList.push(e);
                  this.currItem = ele.name;
                }
              });
            });
          }
        }
        // 重保单
        if (this.ifmCode == 5) {
          this.specProdType = obj.specProdType;
        }
        // 支撑单
        if (this.ifmCode == 4) {
          for (let i = 0; i < typeList.length; i++) {
            const ele = typeList[i];
            if (ele.value == obj.specProdType) {
              this.specProdType = obj.specProdType;
              this.specProdTypeName = ele.name;
            }
          }
        }
      }

      // 局内的接单时间
      this.jnddStartAcceptTime = obj.jnddStartAcceptTime
        ? obj.jnddStartAcceptTime
        : "";
      this.jnddEndAcceptTime = obj.jnddEndAcceptTime
        ? obj.jnddEndAcceptTime
        : "";
    },
    // 任务的筛选
    chooseTask(item) {
      // 切换选项要清空之前所选内容
      if (this.code !== item.id) {
        this.resetShowParams();
        this.resetParams();
      }
      this.code = item.id;
      // 将选择的对应任务种类的筛选项显示出来
      this.updateSysId();
      /* if (item.id !== 9 && item.id !== 3 && item.id !== 7) {
        return this.updateSysId();
      } */
    },
    // 排序
    // clickSortBtn (item) {
    //   let oldId = this.sortList.currentId
    //   let oldItem = this.sortList.list[oldId]
    //   if (item.id == oldId) {
    //     oldItem.status = oldItem.status === 1 ? 2 : 1
    //   } else {
    //     let newItem = item
    //     oldItem.status = 0
    //     newItem.status = 1
    //     this.sortList.currentId = item.id
    //   }
    //   // console.log(this.sortList);
    //   let currItem = this.sortList.list.find(e => e.id == this.sortList.currentId)
    //   console.log(currItem);
    //   this.order = currItem.id
    //   this.sort = currItem.status
    // },
    // 选择框式选择
    onSelectWorkType(item) {
      // 局内
      if (this.sysId == 7) {
        this.showWorkTypeChoice = false;
        this.workTypeName = item.name;
        this.workType = item.id;
      }
    },
    // 选择框式选择
    onSelectFlowNode(item) {
      // 局内
      if (this.sysId == 7) {
        this.showFlowNodeChoice = false;
        this.flowNode = item.id;
        this.flowNodeName = item.name;
      }
    },
    chooseFlowNode(item) {
      // 装机单 选择环节标识
      if (this.code == 2) {
        // console.log('2222222', this.currItem);
        if (this.currItem !== item.name) {
          this.selectedList = [];
        }
        this.currItem = item.name;
        if (item.name !== "全部") {
          this.currShowPage = "optDetail";
          this.optsList = publicSpecialList.find(
            (e) => e.name == item.name
          ).children;
          this.optsTitle = { title: item.name, type: "单选" };
        }
      }
    },
    // 取消选择
    clickCancel() {
      this.currShowPage = "index";
    },
    // 接收选项子组件的数据
    rejectSeleted(data) {
      this.currShowPage = "index";
      if (this.optsTitle.type == "单选") {
        // 装机单环节标识的单选
        if (this.sysId == 2) {
          this.flowNode = data[0].id;
          this.selectedList = data;
        }
      } else {
        // 故障单类别的多选
        if (this.ifmCode == 1 || this.isTask == 1) {
          // this.specProdType = ''
          // this.selectedList = []
          this.selectedList = data;
          let ids = data.map((e) => e.id);
          // console.log(ids);
          this.specProdType = ids.join();
          // console.log('故障单类别参数', this.specProdType);
        }
      }
    },
    // 选择类别
    chooseSpecProd(item) {
      // 故障单
      if (this.ifmCode == 1 || this.isTask == 1) {
        if (this.currItem !== item.name) {
          this.selectedList = [];
          this.specProdType = "";
        }
        this.currItem = item.name;
        if (item.name !== "全部") {
          this.currShowPage = "optDetail";
          this.optsList = specProdTypeList.find(
            (e) => e.name == item.name
          ).children;
          this.optsTitle = { title: item.name, type: "多选" };
          console.log("故障单对应的类别数据", this.optsList);
        } else {
          this.selectedList = [];
          this.specProdType = "";
        }
      }

      // 重保单
      if (this.ifmCode == 5) {
        this.specProdType = item.id;
      }
    },
    // 选择类别 -- 支撑单
    onSelectSpecProd(item) {
      this.showSpecProd = false;
      this.specProdTypeName = item.name;
      this.specProdType = item.value;
    },
    // 施工动作
    chooseActionType(item) {
      // this.clickDom('actType', index, 'active')
      this.actionType = item.id;
    },
    chooseWorkType(item) {
      console.log("workType", item);
      this.workType = item.id;

      // 装机单 工单类型
      if (this.code == 2) {
        if (item.id == "99") {
          this.showActionType = false;
          this.actionTypeList = [];
          console.log("action");
        } else {
          this.showActionType = true;
          // 施工动作
          this.actionTypeList = [
            { id: "", name: "全部" },
            { id: "0", name: "装" },
            { id: "1", name: "拆" },
            { id: "2", name: "改" },
            { id: "6", name: "移" },
          ];
        }
      }

      // 优化单监控指标逻辑
      if (this.ifmCode == 6) {
        // 切换制式的时候要清空下面选择的监控指标
        this.busiName = "";
        if (!item.id) {
          this.busiNameList = [];
          MonitIndList.forEach((e) => {
            this.busiNameList.push(...e.children);
          });
          console.log("全部", this.busiNameList);
        } else {
          this.busiNameList = MonitIndList.find(
            (e) => e.id == item.id
          ).children;
        }
      }
    },
    // 选择客户等级
    chooseSvip(item) {
      // this.clickDom('svip', index, 'active')
      this.svip = item.id;
    },
    // 选择流程状态(基站)
    onSelectActionType(item) {
      this.showActionChoice = false;
      this.actionType = item.name;
    },
    // 选择流程标识
    onSelectProNum(item) {
      this.showChoice = false;
      this.productNumName = item.name;
      this.productNum = item.value;
    },
    // 优化单 选择监控指标
    onSelectBusi(item) {
      this.showBusi = false;
      this.busiName = item.name;
    },
    // 局内 选择截止时间
    chooseEndTime(value) {
      this.jnddEndAcceptTime = formatTime(value);
      this.showEndTime = false;
    },
    // 局内 选择开始时间
    chooseStartTime(value) {
      this.jnddStartAcceptTime = formatTime(value);
      this.showStartTime = false;
    },
    // 选择受理时间
    chooseTime(value) {
      this.acceptTime = formatDate(value);
      // console.log(this.acceptTime)
      this.showTime = false;
    },
    confirm() {
      let siftPara = {};
      // 局内
      if (this.code == 7) {
        siftPara = {
          balkNo: this.balkNo,
          jnddStartAcceptTime: this.jnddStartAcceptTime,
          jnddEndAcceptTime: this.jnddEndAcceptTime,
          flowNode: Number(this.flowNode),
          workType: Number(this.workType),
        };
        console.log("局内工单筛选参数", siftPara);
      }

      // 新装机单
      if (this.code == 10) {
        siftPara = {
          svip: this.svip,
          acceptTime: this.acceptTime,
          workType: this.workType,
          actionType: this.actionType,
        };
        console.log("新装机单", siftPara);
      }

      // 修机单
      if (this.code == 1) {
        siftPara = {
          svip: this.svip,
          speedError: this.speedError == -1 ? "" : Number(this.speedError),
          nightService:
            this.nightService == -1 ? "" : Number(this.nightService),
          actionType: this.actionType,
        };
        console.log("修机单", siftPara);
      }

      // 装机单
      if (this.code == 2) {
        siftPara = {
          acceptTime: this.acceptTime,
          svip: this.svip,
          flowNode: this.flowNode,
          workType: this.workType,
          actionType: this.actionType,
        };
        console.log("装机单", siftPara);
      }

      // IFM工单
      if (this.code == 3) {
        if (this.ifmCode == 6) {
          // 优化单
          siftPara = {
            ifmSysId: 6,
            acceptTime: this.acceptTime,
            vendor: this.acceptTitle,
            workType: this.workType,
            busiName: this.busiName,
          };
          console.log("优化单", siftPara);
        } else {
          siftPara = {
            ifmSysId: this.ifmCode, // 故障单: 1; 支撑单: 4; 重保单: 5; 预警单: 3
            acceptTime: this.acceptTime,
            acceptTitle: this.acceptTitle,
            balkNo: this.balkNo,
            sheetNo: this.sheetNo,
            specProdType: this.specProdType,
          };
          console.log("ifm工单筛选项", siftPara);
        }
      }

      // 基站单
      if (this.code == 9) {
        siftPara = {
          productNum: this.productNum,
          actionType: this.actionType,
          acceptTitle: this.acceptTitle,
        };
        console.log("基站单", siftPara);
      }

      // 如果参数为空，就不要这个筛选项
      for (var key in siftPara) {
        if (siftPara[key] == "" || siftPara[key] == null) {
          delete siftPara[key];
        }
      }

      // 筛选图标上方显示的筛选项数
      let flag = Object.keys(siftPara).find((e) => e == "ifmSysId");
      let siftNum = flag
        ? Object.keys(siftPara).length - 1
        : Object.keys(siftPara).length;

      // this.$emit('getSiftPara', { siftPara: siftPara, order: this.order, sort: this.sort })

      // 任务筛选工单种类
      if (this.isTask == 1) {
        let sysIds = this.code ? this.code : -1;
        if (this.code == "") {
          siftNum = 0;
        } else {
          // siftNum = siftNum + 1;
        }
        delete siftPara.ifmSysId; // 任务筛选不需要传这个参数
        this.$emit("getSiftPara", siftPara, siftNum, sysIds);
      } else {
        // 如果有接单时间，两个时间算一个筛选项
        if (
          this.jnddStartAcceptTime?.length > 0 &&
          this.jnddEndAcceptTime?.length > 0
        )
          siftNum -= 1;
        this.$emit("getSiftPara", siftPara, siftNum);
      }
    },
    // 重置筛选项显示参数
    resetShowParams() {
      this.showWorkType = false;
      this.showActionType = false;
      this.showSvip = false;
      this.showAcceptTime = false;
      this.showService = false;
      this.showFlowNode = false;
      this.showAcceptTitle = false;
      this.showBalkNo = false;
      this.showSheetNo = false;
      this.showStartTime = false;
      this.showProNum = false;
      this.showSpecProdType = false;
      this.showBusiDom = false;
    },
    // 重置筛选参数
    resetParams() {
      this.workTypeName = "";
      this.workType = "";

      this.actionType = "";
      this.svip = "";
      this.acceptTime = null;
      this.speedError = "";
      this.nightService = "";

      this.flowNodeName = "";
      this.flowNode = "";

      this.acceptTitle = "";
      this.balkNo = "";
      this.sheetNo = "";
      this.jnddStartAcceptTime = null;
      this.jnddEndAcceptTime = null;

      this.productNumName = "";
      this.productNum = "";

      this.specProdTypeName = "";
      this.specProdType = "";

      this.busiName = "";

      this.selectedList = [];
    },
    // 重置
    resetFiltrate() {
      if (this.isTask == 1) {
        this.code = "";
        this.resetShowParams(); // 隐藏筛选条件的显示
      }

      this.resetParams(); // 重置筛选参数

      this.currItem = "全部";
    },
    formatterAll(type, val) {
      if (type === "year") {
        return val + "年";
      }
      if (type === "month") {
        return val + "月";
      }
      if (type === "day") {
        return val + "日";
      }
      if (type === "hour") {
        return val + "时";
      }
      if (type === "minute") {
        return val + "分";
      }
      return val;
    },
    formatter(type, val) {
      if (type === "year") {
        return val + "年";
      }
      if (type === "month") {
        return val + "月";
      }
      if (type === "day") {
        return val + "日";
      }
      return val;
    },
  },
};
</script>

<style scoped lang="less">
.content {
  margin: 12px;
  padding-bottom: 45px;
  .title {
    font-weight: 600;
    text-align: start;
    margin-bottom: 12px;
  }
  /* .sort {
    border-bottom: 3px solid #eee;
    ul {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      margin-bottom: 15px;
      .sortActive {
        // color: #b6c5ed;
        // background: #5888e2;
        color: #2888e2;
        border: 1px solid #5888e2;
      }
      li {
        height: 25px;
        line-height: 25px;
        padding: 8px;
        border: 1px solid #eee;
        border-radius: 5px;
        span {
          display: flex;
          .default {
            color: black;
          }
          .icon {
            margin-left: 4px;
            line-height: 18px;
            .icon-arrowup,
            .icon-arrowdown {
              width: 15px;
              height: 15px;
              font-size: 24px;
            }
            .icon-arrowdown {
              line-height: 35px;
            }
          }
        }
      }
    }
  } */
  .filtrate {
    margin-top: 15px;
    font-size: 16px;
    .panel {
      text-align: start;
      color: #000;
      font-weight: 600;
      margin-bottom: 16px;
      .label {
        margin-bottom: 8px;
      }
      .select {
        width: 95%;
        line-height: 30px;
        font-weight: normal;
        border: 2px solid #eee;
        border-radius: 10px;
        padding: 6px 10px;
        box-sizing: border-box;
        box-shadow: 0.5px 0.5px;
      }
    }
    .opts {
      display: flex;
      flex-wrap: wrap;
      margin-top: 5px;
      font-weight: normal;
      .opt {
        // width: 90px;
        // line-height: 46px;
        padding: 8px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 5px;
        text-align: center;
        margin-right: 12px;
        margin-bottom: 8px;
      }
      .active {
        border-color: #5a90fd;
        background-color: #5a90fd;
        color: #fff;
      }
    }
    .field {
      display: flex;
      width: 100%;
      margin-bottom: 12px;
      font-size: 16px;
      color: #000;
      .label {
        font-weight: 600;
        line-height: 40px;
        width: 80px;
        text-align: left;
        white-space: nowrap;
      }
      input {
        flex: 1;
        padding: 6px 8px;
        line-height: 30px;
        border: 2px solid #eee;
        border-radius: 10px;
        box-sizing: border-box;
      }
    }
    .position {
      position: relative;
      // flex: 1;
    }
    .jiantou {
      position: absolute;
      color: gray;
      right: 6%;
      top: 26%;
    }
    .time-box {
      display: flex;
      font-size: 16px;
      .label {
        width: 80px;
        font-weight: 600;
        text-align: start;
        line-height: 40px;
      }
      .right {
        flex: 1;
        .time {
          width: 100%;
          line-height: 30px;
          margin-bottom: 6px;
          border: 2px solid #eee;
          border-radius: 10px;
          padding: 6px 10px;
          box-sizing: border-box;
        }
      }
    }
  }
  .btns {
    height: 45px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    .van-button--normal {
      width: 50%;
    }
  }
}
</style>