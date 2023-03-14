<template>
  <!-- 工单详情页面 看板 列表 -->
  <div class="listDetail">
    <div class="static" ref="static">
      <MyHeader
        :name="titleName"
        right="replay"
        left="arrow-left"
        @goBackEv="goBackFn"
        @rightEv="refreshFn"
      />
      <!-- 进度条加svip等标识 -->
      <div class="logo">
        <!-- <van-progress :percentage="percentage" :color="percentColor" /> -->
        <Progress :progress="percentage" />
        <div class="progress" v-if="sysId !== 11 && sysId !== 12">
          <!-- 仅保留超时标识，其他按照sheetLogo字段展示 -->
          <div v-for="(item, index) in tagArr" :key="index" :class="item.class">
            {{ item.name }}
          </div>

          <!-- 超时标识 -->
          <div v-if="this.listDetail.overTime == 1" class="overTime tag">
            超时
          </div>
          <!-- 超时是否确认标识 -->
          <div
            v-if="this.listDetail.chargeFlag == 2"
            class="overTimeConfirm tag"
          >
            超时已确认
          </div>
          <div
            v-if="this.listDetail.chargeFlag == 3"
            class="overTimeUnConfirm tag"
          >
            超时未确认
          </div>
        </div>
      </div>
    </div>
    <!-- tab栏 -->
    <van-tabs
      v-model="nameActive"
      swipeable
      sticky
      :offsetTop="tabMarginTop"
      :style="{ marginTop: tabMarginTop }"
      :ellipsis="false"
      @change="changeTab"
    >
      <van-tab
        :title="base.key"
        v-for="(base, index) in baseInfo"
        :key="'base' + index"
      >
        <div ref="canvas" id="canvas">
          <!-- 处理过程 -->
          <div v-if="base.key == '处理过程'" class="treatProcess">
            <!-- 处理过程有两种情况，一种是折叠面板显示，一种是展开显示 -->
            <!-- 判断base.value为空时显示空状态 -->
            <template v-if="base.value?.length === 0">
              <!-- 显示暂无数据 -->
              <Empty />
            </template>
            <!-- 折叠面板显示 -->
            <div class="treatProcessCollapse" v-if="treaetProcessCollapseShow">
              <van-collapse
                v-model="treatProcessActiveNames"
                v-for="(item, index) in base.value"
                :key="'collapse' + index"
              >
                <van-collapse-item
                  :title="item.key"
                  :name="index"
                  :value="item.value?.length + '条'"
                  :class="item.flagActive == '1' ? 'collapseItem' : ''"
                >
                  <div
                    class="collapseContent"
                    v-for="(content, index) in item.value"
                    :key="'content' + index"
                  >
                    <div class="title">
                      <span style="color: #000">{{ content.text }}</span>
                      <span>{{ content.time }}</span>
                    </div>
                    <div class="content">
                      <p>{{ content.remark }}</p>
                    </div>
                    <!-- 处理过程有procAttachmentInfoList展示附件 -->
                    <div
                      class="procAttachmentInfo"
                      v-if="content.procAttachmentInfoList.length > 0"
                    >
                      <p class="procTitle">附件：</p>
                      <div class="procContent">
                        <p
                          v-for="(
                            attachment, index
                          ) in content.procAttachmentInfoList"
                          :key="'atta' + index"
                          @click="clickProcAttachment(attachment)"
                        >
                          {{ attachment.fileName }}
                        </p>
                      </div>
                    </div>
                  </div>
                </van-collapse-item>
              </van-collapse>
            </div>
            <!-- 展开显示 -->
            <template v-else>
              <div
                v-for="(item, index) in base.value"
                :key="'spread' + index"
                class="treatProcessSpread"
              >
                <div class="title">
                  <span class="text">{{ item.text }}</span>
                  <span class="time">{{ item.time }}</span>
                </div>
                <div class="content">
                  <span class="remark">{{ item.remark }}</span>
                </div>
              </div>
            </template>
          </div>
          <!-- 其他 -->
          <div class="basicInfo" v-else>
            <!-- 判断value和arrInfo为空时显示空状态 -->
            <template
              v-if="
                base.hasOwnProperty('arrInfo') &&
                base.value?.length == 0 &&
                base.arrInfo?.length == 0
              "
            >
              <!-- 显示暂无数据 -->
              <Empty />
            </template>
            <template
              v-if="!base.hasOwnProperty('arrInfo') && base.value?.length == 0"
            >
              <!-- 显示暂无数据 -->
              <Empty />
            </template>

            <!-- baseInfo显示部分 -->
            <div
              v-for="(item, index) in base.value"
              :key="'base' + index"
              class="baseRow"
              v-else
            >
              <!-- 字数过多折叠显示 -->
              <van-collapse v-model="trSpread" v-if="item.content?.length > 30">
                <van-collapse-item
                  :name="index"
                  :title="item.name"
                  :value="item.content.slice(0, 10) + '...'"
                  >{{ item.content }}</van-collapse-item
                >
              </van-collapse>
              <!-- 正常显示 -->
              <!-- sysId=2时资源信息下的新专线号可变蓝点击 -->
              <template v-else>
                <span class="name">{{ item.name }}</span>
                <span
                  class="value"
                  :class="judgeNewLineNumStyle(item)"
                  @click="clickNewLineNum(item)"
                  >{{ item.content }}</span
                >
              </template>
            </div>
            <!-- arrInfo显示部分 -->
            <div
              class="arrRow"
              v-for="(arr, index) in base.arrInfo"
              :key="'arr' + index"
            >
              <div class="title">
                <h4>{{ arr.key }}</h4>
                <!-- 基站定位什么时候出现？ -->
                <span
                  v-if="arr.key == '【基站信息】'"
                  class="jiZhanDingWei"
                  @click="clickJiZhanDingWei"
                  >基站定位>></span
                >
              </div>
              <!-- 点击基站定位跳出选项 -->
              <van-action-sheet
                v-model="jizhanShow"
                :actions="jizhanActions"
                cancel-text="取消"
                close-on-click-action
              />
              <div
                class="baseRow"
                v-for="(arrItem, index) in arr.value"
                :key="'arrItem' + index"
              >
                <!-- 字数过多折叠显示 -->
                <van-collapse
                  v-model="arrInfoSpread"
                  v-if="arrItem.content?.length > 30"
                >
                  <van-collapse-item
                    :name="index"
                    :title="arrItem.name"
                    :value="arrItem.content.slice(0, 10) + '...'"
                    >{{ arrItem.content }}</van-collapse-item
                  >
                </van-collapse>
                <!-- 正常显示 -->
                <template v-else>
                  <span class="name">{{ arrItem.name }}</span>
                  <!-- 基站状态颜色会改变  -->
                  <!-- sysId=3时网管告警时间和网管告警名称字体颜色为蓝色，要做弹窗显示 -->
                  <!-- 基站工单 信源/拉远RRU下 点击电路编号要跳转到资源核查页面，电路编号的value要字体变蓝 -->
                  <span
                    class="value"
                    :class="judgeArrInfoColor(arrItem)"
                    @click="clickJzInfo(arrItem)"
                    >{{ arrItem.content }}</span
                  >
                </template>
              </div>
              <!-- 原始单元格显示 -->
              <!-- <van-cell-group>
              <van-cell
                :title="arrItem.name"
                :value="arrItem.content"
                v-for="(arrItem, index) in arr.value"
                :key="index"
                :value-class="arrItem.name == '基站状态' ? 'value' : ''"
              />
            </van-cell-group> -->
            </div>
            <!-- modelInfo显示部分 -->
            <div
              class="modelRow"
              v-for="(model, index) in base.modelInfo"
              :key="'model' + index"
            >
              <div class="title">
                <h4>{{ model.key }}</h4>
              </div>
              <van-cell-group>
                <van-cell
                  :title="modelItem.name"
                  :value="modelItem.content"
                  v-for="(modelItem, index) in model.value"
                  :key="'modelItem' + index"
                />
              </van-cell-group>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>

    <!-- 附件信息basicInfoAttachmentInfoList 在基本信息最底下展示 -->
    <div
      class="basicInfoAttachment"
      v-if="basicInfoAttachmentInfoList.length > 0 && tabKey == '基本信息'"
    >
      <div class="title">附件信息</div>
      <div class="content">
        <span
          v-for="(atta, index) in basicInfoAttachmentInfoList"
          :key="'atta1' + index"
          @click="clickProcAttachment(atta)"
          >{{ atta.fileName }}</span
        >
      </div>
    </div>
    <!-- 附件信息AttachmentInfoList 在基本信息最底下展示 -->
    <div
      class="basicInfoAttachment"
      v-if="AttachmentInfoList.length > 0 && tabKey == '基本信息'"
    >
      <div class="title">附件信息</div>
      <div class="content">
        <span
          v-for="(atta, index) in AttachmentInfoList"
          :key="'atta2' + index"
          @click="clickProcAttachment(atta)"
          >{{ atta.fileName }}</span
        >
      </div>
    </div>
    <!-- 点击截屏 -->
    <div class="screenShot" @click="saveImage" v-show="nameActive == 0">
      <i class="iconfont icon-24gf-camera2"></i>
      <span>点击截屏</span>
    </div>
    <!-- 底部按钮区域 -->
    <div class="bottomContain">
      <div class="bottom">
        <template v-if="buttonList?.length == 4">
          <van-button
            plain
            type="info"
            v-for="(button, index) in buttonList.slice(0, 4)"
            :key="index"
            @click="clickButton(button.actionId)"
            >{{ button.actionText }}</van-button
          >
        </template>
        <template v-else>
          <van-button
            plain
            type="info"
            v-for="(button, index) in buttonList.slice(0, 3)"
            :key="index"
            @click="clickButton(button.actionId)"
            >{{ button.actionText }}</van-button
          >
        </template>

        <!-- 按钮大于四个显示更多选项 -->
        <!--  <van-popover
          v-model="buttonPopover"
          trigger="click"
          :actions="buttonActions"
          @select="selectButton"
          placement="top-end"
        >
          <template #reference>
            <van-button
              plain
              type="info"
              v-show="buttonList?.length > 4"
              class="more"
            >
              更多
              <van-icon name="arrow-down" />
            </van-button>
          </template>
        </van-popover> -->

        <van-popover
          v-model="buttonPopover"
          trigger="click"
          placement="top-end"
          get-container=".listDetail"
        >
          <van-grid clickable :border="false" column-num="1">
            <van-grid-item
              v-for="(action, index) in buttonActions"
              :key="index"
              :text="action.text"
              @click="selectButton(action)"
            />
          </van-grid>
          <template #reference>
            <van-button
              plain
              type="info"
              v-if="buttonList?.length > 4"
              class="more"
            >
              更多
              <van-icon :name="moreIcon" />
            </van-button> </template
        ></van-popover>
      </div>
    </div>

    <!-- 电话图标 -->
    <PhoneIcon
      :custPhone="listDetail.custPhone"
      @iconMove="iconMove"
      @judgeSelectPhone="judgeSelectPhone"
      v-if="showPhoneIcon"
    />

    <!-- 网管告警维修方案弹出层 -->
    <van-popup v-model="networkManagePlanShow" class="networkManagePlanPop">
      <div class="title">维修方案</div>
      <div class="content">【{{ solvePlan }}】</div>
      <div class="bottom">
        <van-button type="info" @click="networkManagePlanShow = false"
          >关闭</van-button
        >
      </div>
    </van-popup>
    <!-- 网管告警历史弹出层 -->
    <van-popup
      v-model="networkManageHistoryShow"
      class="networkManagePlanPop"
      :style="'height:60%'"
    >
      <div class="title">历史</div>
      <div class="historyContent">
        <van-cell
          title="90天故障数"
          :value="networkManageHistory.totalNumDay90 || '--'"
        />
        <van-cell
          title="90天故障-掉电数"
          :value="networkManageHistory.elecNumDay90 || '--'"
        />
        <van-cell
          title="90天故障-光路数"
          :value="networkManageHistory.optNumDay90 || '--'"
        />
        <van-cell
          title="上次故障时间"
          :value="networkManageHistory.lastAlarmTime || '--'"
        />
        <van-cell
          title="上次故障原因"
          :value="networkManageHistory.lastFaultReason || '--'"
        />
      </div>
      <div class="bottom">
        <van-button type="info" @click="networkManageHistoryShow = false"
          >关闭</van-button
        >
      </div>
    </van-popup>

    <!-- 查看附件弹出层 -->
    <van-popup
      v-model="attachmentShow"
      :style="{ width: '100%', height: '100%' }"
    >
      <img
        :src="'data:image/png;base64,' + attachmentUrl"
        alt=""
        @click="attachmentShow = false"
        :style="{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }"
      />
    </van-popup>

    <!-- 点击截图 图片弹出层 -->
    <van-popup v-model="photoShow" :style="{ width: '90%', height: '90%' }">
      <p :style="{ color: 'red' }">长按图片保存</p>
      <img :src="photoUrl" alt="" style="width: 100%" />
    </van-popup>
  </div>
</template>


<script>
import { mapState, mapGetters } from "vuex";
import { setWaterMark, removeWatermark } from "@/utils/public/waterMark";
import { getItem } from "@/utils/public/sessionStorage";
import buttonSuccess from "@/utils/gdMethods/buttonSuccess";
import { reqDownloadFile } from "@/http/button";
import { reqHuJiaoCall } from "@/http/tools";
import { reqgetListDetail } from "@/http/index";
import { appUrl } from "@/http/pullApp";
import PhoneIcon from "@/components/selectCallNumber/phoneIcon.vue";
import Progress from "@/components/progress";
import html2canvas from "html2canvas";
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive";

export default {
  name: "ListDetail",
  components: { PhoneIcon, Progress },
  mixins: [keepAliveMixin],
  data() {
    return {
      refreshFlag: false, // 刷新标识

      nameActive: 0,
      tabKey: "", // 当前激活的tab栏的key名称
      // 列表传递参数
      paramsData: {},
      // 进度条百分比
      percentage: 0,
      // percentColor: "#1989fa",
      // 标题id
      titleId: "",
      // 工单详情数据
      baseInfo: [],
      // 按钮文本数
      buttonList: [],
      // baseInfo中的tr字数过多折叠显示
      trSpread: [],
      // arrInfo中的tr字数过多折叠显示
      arrInfoSpread: [],
      //底部按钮
      buttonPopover: false,
      // 底部更多按钮右侧箭头指向
      moreIcon: "arrow-down",
      // 通过 actions 属性来定义菜单选项
      buttonActions: [],
      treatProcessActiveNames: [], // 处理过程折叠面板激活名称
      treaetProcessCollapseShow: false, // 处理过程是否折叠显示
      // 基站定位
      jizhanShow: false,
      jizhanActions: [{ name: "高德地图" }, { name: "百度地图" }],
      sysId: -1,
      tabMarginTop: "", // tab栏margin-top

      tagArr: [], // 标识对应颜色及名称

      // 网管告警维修方案弹出层
      networkManagePlanShow: false,
      solvePlan: "",
      // 网管告警历史弹出层
      networkManageHistoryShow: false,
      networkManageHistory: {
        totalNumDay90: "",
        elecNumDay90: "",
        optNumDay90: "",
        lastAlarmTime: "",
        lastFaultReason: "",
      },
      basicInfoAttachmentInfoList: [], // 附件信息1
      AttachmentInfoList: [], // 附件信息2
      // 查看附件信息
      attachmentShow: false,
      attachmentUrl: "",
      // 截屏
      photoShow: false,
      photoUrl: "",
    };
  },
  provide() {
    return { confirmEvent: this.confirmEvent };
  },
  computed: {
    ...mapGetters(["getLoginInfo"]),
    ...mapState("home", ["listDetail"]),
    // 标题详情id
    titleName() {
      if (this.titleId == "") return "详情";
      else return `详情(${this.titleId})`;
    },
    // 是否显示电话标识
    showPhoneIcon() {
      // 列表详情返回的sysId，在[1,2,10]之间，就显示电话标识
      let arr = [1, 2, 10];
      if (arr.indexOf(this.sysId) > -1) return true;
    },
  },
  watch: {
    // 监测按钮是否操作成功
    "$store.state.operationSuccessFlag": {
      handler(newVal, oldVal) {
        if (newVal) {
          console.log("列表刷新标识发生变化", newVal);
          // 按钮操作成功 → 重新调用接口
          // 判断路由是否在当前页 是→直接刷新 不是→存储标识在激活本路由时刷新
          if (this.$route.name == "ListDetail") {
            // 直接刷新
            this.operationSuccessRefresh(false);
            this.refreshFn();
          } else {
            this.refreshFlag = true;
          }
        }
      },
    },
    // 监测更多选项是否弹出
    buttonPopover(value) {
      if (value) {
        // 将更多右侧的箭头改成向上
        this.moreIcon = "arrow-up";
      } else {
        this.moreIcon = "arrow-down";
      }
    },
  },
  methods: {
    // 回退
    goBackFn() {
      this.$store.commit("removeThisPage", this.$options.name);
      this.$router.go(-1);
    },
    //保存图片
    saveImage() {
      this.photoShow = true;
      // 第一个参数是需要生成截图的元素,第二个是自己需要配置的参数,宽高等
      html2canvas(document.getElementById("canvas"), {
        // backgroundColor: null, //画出来的图片有白色的边框,不要可设置背景为透明色（null）
        useCORS: true, //支持图片跨域
        scale: 1, //设置放大的倍数
      }).then((canvas) => {
        this.photoUrl = canvas.toDataURL("image/png"); // toDataURL: 图片格式转成 base64
      });
    },
    // sysId=3时点击网管告警名称或网管告警时间
    clickJzInfo(arrItem) {
      if (this.sysId == 3) {
        if (arrItem.name == "网管告警名称") {
          this.solvePlan = arrItem.jsonObject.solvePlan;
          // 展示网管告警维修方案弹出层
          if (this.solvePlan.length > 0) {
            this.networkManagePlanShow = true;
          }
        }
        if (arrItem.name == "网管告警时间") {
          // 展示网管告警历史弹出层
          let jsonObject = arrItem.jsonObject;
          this.networkManageHistory.totalNumDay90 = jsonObject.totalNumDay90;
          this.networkManageHistory.elecNumDay90 = jsonObject.elecNumDay90;
          this.networkManageHistory.optNumDay90 = jsonObject.optNumDay90;
          this.networkManageHistory.lastAlarmTime = jsonObject.lastAlarmTime;
          this.networkManageHistory.lastFaultReason =
            jsonObject.lastFaultReason;
          this.networkManageHistoryShow = true;
        }
      }
      // 基站工单 信源/拉远RRU下 点击电路编号要跳转到资源核查页面
      if (
        this.sysId == 9 &&
        this.tabKey == "信源/拉远RRU" &&
        arrItem.name == "电路编号"
      ) {
        // 跳转到资源核查
        let circuitNumber = arrItem.content;
        let prefix = appUrl.zyhc;
        let jsonparam =
          '{"oprtype":"circuit_route","param":"' + circuitNumber + '"}';
        // 编码
        jsonparam = escape(jsonparam);
        let url = prefix + jsonparam;
        console.log("资源核查网址", url);
        this.$router.push({
          name: "Zyhc",
          query: {
            url,
          },
        });
      }
    },

    // 判断arrInfo中value的颜色
    judgeArrInfoColor(arrItem) {
      // 基站工单 信源/拉远RRU下 电路编号类名
      let RRUCircuitNumber = "";
      // 网管告警的颜色类名
      let networkManage = "";
      // 基站状态的颜色类名
      let status = "";
      if (this.sysId == 3) {
        if (arrItem.name == "网管告警名称" || arrItem.name == "网管告警时间") {
          networkManage = "networkManage";
        }
      }

      if (arrItem.name == "基站状态") {
        if (arrItem.content == "已修复") status = "statusRecovered";
        else status = "statusUnRepaired";
      }
      // 基站工单 信源/拉远RRU下 点击电路编号要跳转到资源核查页面，电路编号的value要字体变蓝
      if (
        this.sysId == 9 &&
        this.tabKey == "信源/拉远RRU" &&
        arrItem.name == "电路编号"
      ) {
        RRUCircuitNumber = "RRUCircuitNumber";
      }

      return networkManage + " " + status + " " + RRUCircuitNumber;
    },

    // 判断sysId=2时资源信息下的新专线号样式
    judgeNewLineNumStyle(item) {
      if (this.sysId == 2 && item.name == "新专线号") {
        return "newLineNum";
      }
    },
    // 点击sysId=2时资源信息下的新专线号
    clickNewLineNum(item) {
      if (this.sysId == 2 && item.name == "新专线号") {
        // 展示专线路由结果
        console.log("专线路由号码", item.content);
        this.$router.push({
          path: "/speclineInfo",
          query: {
            zhuanXianHao: item.content,
            type: "detail",
          },
        });
      }
    },

    // 切换tab栏
    changeTab(name, title) {
      this.tabKey = title;
      if (title == "处理过程" && this.treaetProcessCollapseShow) {
        // 处理过程下的内容为折叠面板展示
        // 拿到折叠面板元素
        this.$nextTick(() => {
          let collapseItem =
            document.querySelector(".collapseItem")?.firstElementChild;
          if (collapseItem) {
            collapseItem.style = "background:#1989fa";
          }
        });
      }
    },

    // 刷新
    refreshFn() {
      // 刷新当前路由
      this.$store.commit("removeThisPage", this.$options.name);
      this.$router.replace({
        path: "/refresh",
      });

      /* // 清空buttonList
      this.buttonList = [];
      this.buttonActions = [];
      // 重新获取列表详情
      this.getListDetail();
      // 关闭更多按钮弹出层
      if (this.buttonPopover) this.buttonPopover = false; */
      // 竖轴置顶
      // document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    // 点击arrInfo内的基站定位
    clickJiZhanDingWei() {
      this.jizhanShow = true;
    },
    // 点击底部按钮更多的选项
    selectButton(action) {
      this.clickButton(action.id);
    },
    // 点击按钮选项
    async clickButton(buttonId) {
      buttonSuccess(buttonId, this.listDetail);
    },
    // 获取列表详情
    async getListDetail() {
      try {
        // 建设单获取详情接口不一样
        if (getItem("workOrderDetail")?.sysId == 11) {
          // this.sysId = 11
          // // 获取标题
          // this.titleId = this.$route.query.uniqueIdentification
          // // 获取列表详情
          // let uniqueIdentification = this.$route.query.uniqueIdentification
          // let orderType = getItem('currYwjsOrderType')
          // let stepName = ""
          // let baseId = this.$route.query.baseId
          // let baseSchema = ""
          // let taskId = this.$route.query.taskId
          // let postData = { uniqueIdentification, orderType, stepName, baseId, baseSchema, taskId }
          // let result = await reqgetYwjsDetail(JSON.stringify(postData))
          // console.log('基站工单列表详情', result)
          // if (result.operationSuccessFlag) {
          //   this.$store.commit('home/GETLISTDETAIL', result)
          //   // 获取工单详情数据
          //   this.baseInfo = result.data.baseInfo
          //   // 获取modelInfo
          //   // 将modelInfo中key与baseInfo相等的数据追加到baseInfo中
          //   let modelInfo = result.data.modelInfo
          //   modelInfo.forEach(model => {
          //     this.baseInfo.forEach(base => {
          //       if (model.key == base.key) {
          //         // 将arrInfo中的value追加到baseInfo上
          //         this.$set(base, 'modelInfo', model.value)
          //       }
          //     })
          //   })
          //   // 获取按钮数据
          //   let buttonList = result.buttonList
          //   buttonList.forEach((button) => {
          //     let obj = {}
          //     obj.actionText = button.actionText
          //     obj.actionId = button.actionId
          //     this.buttonList.push(obj)
          //   })
          // } else {
          //   // 请求失败
          //   if (result.errorMessage.length > 0) {
          //     this.$toast(result.errorMessage)
          //     this.$destroy()
          //     this.$router.go(-1)
          //   }
          // }
        } else if (getItem("workOrderDetail")?.sysId == 12) {
          // // 投诉需求单
          // this.sysId = 12
          // // 获取标题
          // this.titleId = ''
          // // 获取列表详情
          // let baseId = this.$route.query.baseId
          // let baseSchema = "YWJS_TS"
          // let taskId = this.$route.query.taskId
          // let postData = { baseId, baseSchema, taskId }
          // let result = await reqTsxqDetail(JSON.stringify(postData))
          // console.log('投诉需求单列表详情', result)
          // if (result.operationSuccessFlag) {
          //   this.$store.commit('home/GETLISTDETAIL', result)
          //   // 获取工单详情数据
          //   this.baseInfo = result.data.baseInfo
          //   // 获取modelInfo
          //   // 将modelInfo中key与baseInfo相等的数据追加到baseInfo中
          //   let modelInfo = result.data.modelInfo
          //   modelInfo.forEach(model => {
          //     this.baseInfo.forEach(base => {
          //       if (model.key == base.key) {
          //         // 将arrInfo中的value追加到baseInfo上
          //         this.$set(base, 'modelInfo', model.value)
          //       }
          //     })
          //   })
          //   // 获取按钮数据
          //   let buttonList = result.buttonList
          //   buttonList.forEach((button) => {
          //     let obj = {}
          //     obj.actionText = button.actionText
          //     obj.actionId = button.actionId
          //     this.buttonList.push(obj)
          //   })
          // } else {
          //   // 请求失败
          //   if (result.errorMessage.length > 0) {
          //     this.$toast(result.errorMessage)
          //     this.$destroy()
          //     this.$router.go(-1)
          //   }
          // }
        } else {
          let id = parseInt(this.$route.query.id);
          // hasTaskList 只有 sysId=3,IFM工单,故障单才用这个标识判断是否是工程师,用于判断是否有领单按钮
          // sysId为3时 点击列表详情需要传参hasTaskList,否则只传id
          let hasTaskList;
          let userIds = this.getLoginInfo.userIds;
          userIds.forEach((item) => {
            if (item.sysId == 3) hasTaskList = item.hasTaskList;
          });
          // 提供列表详情页的参数
          if (typeof hasTaskList == "number") {
            this.paramsData = { id, hasTaskList };
          } else {
            this.paramsData = { id };
          }
          let result = await reqgetListDetail(JSON.stringify(this.paramsData));
          // await this.$store.dispatch(
          //   "home/getListDetail",
          //   JSON.stringify(this.paramsData)
          // );
          console.log("获取列表详情", result);
          this.apiResponse(
            result,
            ".listDetail",
            () => {
              // 存储listDetail
              this.$store.commit("home/GETLISTDETAIL", result);
              // 清空buttonList,防止用户连续点击请求，请求结果返回慢造成重复按钮
              this.buttonList = [];
              this.buttonActions = [];
              // 获取sysId
              this.sysId = result.sysId;
              // 获取标识颜色及名称
              this.getTag(result.sheetLogo);

              // 获取标题
              this.titleId = result.orderId || result.id;
              // 获取工单详情数据
              this.baseInfo = result.data.baseInfo;
              this.tabKey = this.baseInfo[0]?.key;
              // 判断数据的key为处理过程时候的数据结构 → 控制折叠 or 展开 显示信息
              for (let base of this.baseInfo) {
                if (base.key == "处理过程") {
                  for (let treat of base.value) {
                    if (treat.hasOwnProperty("key")) {
                      // value里含有key属性的应该折叠显示
                      this.treaetProcessCollapseShow = true;
                      // 将flagActive的结果加到上一级列表内
                      for (let thirdItem of treat.value) {
                        if (thirdItem.flagActive == "1") {
                          this.$set(treat, "flagActive", "1");
                          break;
                        }
                      }
                    }
                  }
                }
              }
              // 将arrInfo中key与baseInfo相等的数据追加到baseInfo中
              let arrInfo = result.data.arrInfo;
              arrInfo.forEach((arr) => {
                this.baseInfo.forEach((base) => {
                  if (arr.key == base.key) {
                    // 将arrInfo中的value追加到baseInfo上
                    this.$set(base, "arrInfo", arr.value);
                  }
                });
              });

              // 获取按钮数据
              console.log("获取按钮数据", result.buttonList);
              result.buttonList.forEach((button) => {
                // console.log("遍历按钮数据", button);
                let obj = {};
                obj.actionText = button.actionText;
                obj.actionId = button.actionId;
                this.buttonList.push(obj);
              });
              console.log("最终按钮数据", this.buttonList);

              // 按钮如果大于四个就显示更多选项
              if (this.buttonList?.length > 4) {
                let [...buttonList2] = this.buttonList;
                buttonList2 = buttonList2.splice(3, buttonList2.length);
                buttonList2.forEach((item) => {
                  let obj = {};
                  obj.text = item.actionText;
                  obj.id = item.actionId;
                  this.buttonActions.push(obj);
                });
              }
              // 在基本信息最末尾展示附件信息basicInfoAttachmentInfoList
              if (result?.basicInfoAttachmentInfoList)
                this.basicInfoAttachmentInfoList =
                  result.basicInfoAttachmentInfoList;
              // 在基本信息最末尾展示附件信息AttachmentInfoList
              if (result?.attachmentInfoList)
                this.AttachmentInfoList = result.attachmentInfoList;
            },
            true
          );
        }
      } catch (error) {
        console.log("err", error);
        // 请求失败 → 返回上一个页面
        this.goBackFn();
      }
    },
    // 获取标识字段及颜色
    getTag(sheetLogo) {
      // e.g. 1,svip|2,测速
      let tag = sheetLogo;
      if (tag?.length > 0) {
        let arr1 = tag.split("|");
        let arr = [];
        arr1.forEach((item) => {
          let obj = {};
          obj.color = item.split(",")[0];
          obj.name = item.split(",")[1];
          // 判断tag颜色
          obj.class = this.judgeSheetLogoColor(item.split(",")[0]);
          arr.push(obj);
        });
        this.tagArr = arr;
      } else {
        // 没有标识字段
        this.tagArr = [];
      }
      // 获取进度条数值
      this.getRatioNum();
    },
    // 根据自定义序号判断tag颜色
    judgeSheetLogoColor(num) {
      switch (num) {
        case "1":
          return "tag colTitle1";
        case "2":
          return "tag colTitle2";
        case "3":
          return "tag colTitle3";
        case "4":
          return "tag colTitle4";
        case "5":
          return "tag colTitle5";
        case "6":
          return "tag colTitle6";
      }
    },
    // 获取进度条数值
    getRatioNum() {
      let ratio = this.listDetail.ratio;
      // 0-79当前颜色即可，80-99为黄色，100为红色
      if (ratio >= 80 && ratio <= 99) {
        // this.percentColor = '#dede7d'
      } else if (ratio >= 100) {
        ratio = 100;
        // this.percentColor = "#ee0a24"
      }
      if (ratio < 0) ratio = 0;
      if (ratio) this.percentage = Math.ceil(ratio);
    },
    // 电话图标移动
    iconMove(status) {
      // 禁止页面滚轴滑动
      // document.querySelector(".listDetail").style.overflowY = status;
      document.querySelector("body").style.overflowY = status;
    },

    // 点击选中的单个号码
    async judgeSelectPhone(phone) {
      this.cloudCall(phone, "手工拨号", false);
    },
    // 点击确认键
    async confirmEvent(res, dialFlagChecked) {
      console.log("确认键：", res);
      // 判断号码格式是否正确 请求云入户
      this.cloudCall(res, "手工拨号", dialFlagChecked);
    },

    // 云入户呼叫
    async cloudCall(num, type, dialFlagChecked) {
      if (num.length == 8 || num.length == 11) {
        this.$store.commit("workBench/CHANGECALLNUMBERSTATE", {
          callNumberShow: false,
          keyShow: false,
        });
        // 请求云入户呼叫
        let id = parseInt(this.$route.query.id);
        let called = num;
        let callNumberType = type;
        let hujiaoFlag = 1;
        let dialFlag = 0;
        if (dialFlagChecked) {
          dialFlag = 1;
        }
        let result = await reqHuJiaoCall(
          JSON.stringify({ id, called, callNumberType, hujiaoFlag, dialFlag })
        );
        console.log("云入户呼叫结果", result);
        this.apiResponse(result, ".changeAppoint", () => {});
      } else {
        this.$toast("格式不正确，需要8位或者11位");
      }
    },
    // 处理过程查看附件
    async clickProcAttachment(attachment) {
      let sysId = attachment.sysId;
      let fileId = attachment.fileId;
      let flowNode = this.listDetail.flowNode;
      let result = await reqDownloadFile(
        JSON.stringify({ sysId, fileId, flowNode })
      );
      console.log("查看附件结果", result);
      this.apiResponse(result, ".listDetail", () => {
        var imgs = ["jpg", "gif", "png"];
        var type = attachment?.fileName.split(".")[1];
        this.attachmentShow = true;
        if (imgs.includes(type)) {
          this.attachmentUrl = result.file;
        }
      });
    },
  },
  mounted() {
    setWaterMark(this.getLoginInfo.userName);
    this.tabMarginTop = this.$refs.static.offsetHeight - 1 + "px";
  },
  created() {
    // 获取列表详情
    this.getListDetail();
  },
  activated() {
    console.log("listDetail已激活");
    // 激活后判断是否要刷新接口
    if (this.refreshFlag) {
      this.refreshFn();
      this.refreshFlag = false;
      this.operationSuccessRefresh(false);
    }
    // 添加水印
    setWaterMark(getItem("loginInfo").userName); // 添加水印
  },
  deactivated() {
    removeWatermark(); // 删除水印
  },
  beforeDestroy() {
    removeWatermark(); // 删除水印
  },
};
</script>

<style scoped lang="less">
@import "@/assets/css/confirmDialog.less";
@theme-color: #1989fa;

.listDetail {
  // position: relative;
  min-height: 100%;
  background-color: #fff;
  .static {
    z-index: 200;
    position: fixed;
    top: 0;
    width: 100%;
    background-color: #fff;
    .logo {
      display: flex;
      .van-progress {
        // flex: 4;
        flex: 1;
        margin: 10px 5px 10px 0;
        // /deep/.van-progress__portion {
        //   width: 80% !important;
        //   .van-progress__pivot {
        //     right: 0 !important;
        //     left: auto !important;
        //   }
        // }
      }
    }
    .progress {
      display: flex;
      margin-left: 5px;
      .tag {
        /* flex: 0.5;
        margin: 0 5px;
        padding: 0 8px;
        font-size: 12px;
        line-height: 25px;
        border-radius: 10px; */
        height: 20px;
        padding: 0 8px;
        margin-top: 2px;
        margin-right: 5px;
        font-size: 10px;
        font-family: YouSheBiaoTiHei;
        font-style: italic;
        font-weight: 600;
        color: #ffffff;
        line-height: 20px;
        border-radius: 0px 0px 0px 8px;
      }
      .colTitle1 {
        background-color: #559eff;
      }
      .colTitle2 {
        background-color: #ff7946;
      }
      .colTitle3 {
        background-color: #04c18a;
      }
      .colTitle4 {
        background-color: #fbb5b5;
      }
      .colTitle5 {
        background-color: #f6bb64;
      }
      .colTitle6 {
        background-color: #f664d6;
      }
      /*       .SVIP {
        background-color: #fff1dc;
        color: #ff7946;
      }
      .importClient {
        background-color: #feeed7;
        color: #c32317;
      }

      .TCSI {
        background-color: #fff1dc;
        color: #eb182c;
      }
      .SSVIP {
        background-color: #fff1dc;
        color: #e0150b;
      }
      .reject {
        background-color: #fff1dc;

        color: #b94b43;
      }
      .night {
        background-color: #e5ebff;
        color: #305bfd;
      }
      .speed {
        background-color: #d3ffeb;
        color: #04c18a;
      } */
      .overTime {
        background-color: #983e3e;
      }
      .overTimeConfirm {
        background-color: #e16767;
      }
      .overTimeUnConfirm {
        background-color: #e16767;
      }
    }
  }
  .van-tabs {
    /deep/.van-sticky {
      z-index: 200;
      .van-tabs__wrap {
        .van-tabs__nav {
          // overflow-x: auto;
          // justify-content: space-around;
          .van-tab {
            // flex: none;
            // padding: 0 10px;
          }
          .van-tabs__line {
            background-color: @theme-color;
          }
        }
        .van-tabs__nav--line {
          z-index: 200; // 遮住水印
          background-color: #fff;
        }
      }
    }
    /deep/.van-tabs__content {
      // height: 800px;
      overflow: auto;
    }
  }

  .basicInfo {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    // border: 1px solid #e0e9f6;
    font-size: 14px;
    color: #323233;
    .baseRow {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #e0e0e0;
      .name {
        width: 30%;
        text-align: left;
      }
      .value {
        width: 70%;
        text-align: right;
        word-break: break-word;
        color: #969a9f;
      }
      .newLineNum {
        color: @theme-color;
        text-decoration: underline;
      }
      .van-collapse {
        width: 100%;
        .van-collapse-item {
          &[class*="van-hairline"]::after {
            border: 0;
          }
          /deep/.van-cell {
            padding: 0;
          }
          /deep/.van-cell__title,
          /deep/.van-collapse-item__content {
            text-align: left;
          }
        }
        &[class*="van-hairline"]::after {
          border: 0;
        }
      }
    }
    .arrRow {
      margin-top: 10px;
      border: 1px solid @theme-color;
      .title {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        border-bottom: 1px solid #e0e0e0;
        .jiZhanDingWei {
          color: @theme-color;
          text-decoration: underline;
        }
      }
      .statusUnRepaired {
        color: red;
      }
      .statusRecovered {
        color: #48ee09;
      }
      .networkManage {
        color: #4949e4;
      }
      .RRUCircuitNumber {
        color: #4949e4;
        text-decoration: underline;
      }
      // .van-cell-group {
      //   .van-cell {
      //     align-items: center;
      //     border-bottom: 1px solid #e0e0e0;
      //     .van-cell__title {
      //       flex: 0.5;
      //       text-align: left;
      //     }
      //     .van-cell__value {
      //       text-align: right;
      //       word-break: break-all;
      //     }
      //     .value {
      //       color: red;
      //     }
      //   }
      // }
    }
    .modelRow {
      margin-top: 10px;
      .title {
        display: flex;
        justify-content: space-between;
        padding-top: 10px;
        background-color: #e0e0e0;
        h4 {
          padding: 10px;
          background-color: #fff;
        }
      }
      .van-cell-group {
        .van-cell {
          border-bottom: 1px solid #e0e0e0;
          .van-cell__title {
            flex: 0.5;
            text-align: left;
          }
          .van-cell__value {
            text-align: right;
          }
        }
      }
    }
  }
  .treatProcess {
    .treatProcessSpread {
      padding: 8px;
      border-bottom: 1px solid #e0e0e0;
      .title {
        display: flex;
        justify-content: space-between;
        padding: 5px;
        font-size: 14px;
        .text {
          text-align: left;
        }
        .time {
          color: #969799;
          text-align: right;
        }
      }
      .content {
        padding: 5px;
        text-align: left;
        font-size: 14px;
        color: #969799;
      }
    }
    .treatProcessCollapse {
      .van-collapse {
        .van-collapse-item {
          /deep/.van-collapse-item__title {
            z-index: 150;
            text-align: left;
            background: #e0e0e0;
            border-bottom: 1px solid #fff;
            .van-cell__title {
              flex: 3;
            }
            .van-cell__value {
              flex: 1;
              color: #6f7073;
            }
          }
          /deep/.van-collapse-item__content {
            padding: 0;
            .collapseContent {
              padding: 10px;
              border-bottom: 1px solid;
              .title {
                display: flex;
                justify-content: space-between;
              }
              .content {
                padding-top: 10px;
                text-align: left;
              }
              .procAttachmentInfo {
                display: flex;
                align-items: center;
                .procContent {
                  color: @theme-color;
                  text-decoration: underline;
                }
              }
            }
          }
        }
      }
    }
  }
  .basicInfoAttachment {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    .content {
      display: flex;
      flex-direction: column;
      text-align: right;
      color: blue;
    }
  }
  .screenShot {
    z-index: 101;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 14px;
    width: 25%;
    margin: 10px auto;
    padding: 5px 20px;
    background-color: @theme-color;
    .iconfont {
      font-size: 20px;
    }
  }
  .bottomContain {
    height: 50px;
    .bottom > * {
      // flex: 1 1 0;
      width: 25%;
    }
    .bottom {
      z-index: 200;
      position: fixed;
      bottom: 0;
      display: flex;
      // justify-content: space-around;
      align-items: center;
      width: 100%;
      height: 50px;
      background-color: #fff;
      box-shadow: 1px 5px 16px rgb(43, 41, 41);
      .van-button {
        flex: 0 0 24%;
        height: 30px;
        border-radius: 5px;
        // margin: 0 5px;
        margin: 0 calc(4% / 8);
        padding: 0 5px;
        font-size: 12px;
      }
      .van-popover__wrapper {
        .van-button {
          width: 90%;
        }
      }

      /deep/.van-popover__content {
        // position: fixed;
        // bottom: 60px;
        // right: 0px;
      }
    }
  }
  .van-grid {
    width: 100px;
    max-height: 500px;
    overflow: auto;
    .van-grid-item {
      border-bottom: 1px solid #e0e0e0;
    }
  }
  .networkManagePlanPop {
    overflow: hidden;
    height: 40%;
    width: 80%;
    padding: 16px;
    .title {
      padding-bottom: 10px;
      color: @theme-color;
    }
    .content {
      overflow-y: auto;
      height: 70%;
      white-space: pre-line;
      text-align: left;
      font-size: 14px;
    }
    .historyContent {
      overflow-y: auto;
      height: 80%;
      .van-cell {
        align-items: center;
        .van-cell__title {
          flex: 1;
          text-align: left;
        }
        .van-cell__value {
          flex: 1.5;
        }
        &::after {
          border-bottom: 1px solid #9f9c9c;
        }
      }
    }
    .bottom {
      padding-top: 10px;
      .van-button {
        width: 60%;
        height: 36px;
        border-radius: 5px;
      }
    }
  }
}
</style>
