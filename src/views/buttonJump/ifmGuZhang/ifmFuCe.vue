<template>
  <!-- ifm复测 -->
  <div class="ifmFuCe">
    <MyHeader name="复测" left="arrow-left" @goBackEv="goBackFn" />
    <!-- 障碍类型 -->
    <div class="region" v-if="piaTypeActions.length > 0">
      <van-field
        label="障碍类型："
        :value="piaTypeName"
        @click="piaTypeShow = true"
        placeholder="请选择障碍类型"
        is-link
        arrow-direction="down"
        readonly
        class="textRight"
      />
      <van-action-sheet
        v-model="piaTypeShow"
        :actions="piaTypeActions"
        cancel-text="取消"
        close-on-click-action
        @select="selectPiaType"
      />
    </div>
    <template v-if="balkClassReasonList.length > 0">
      <!-- 故障分类 -->
      <div class="region">
        <van-field
          label="故障分类："
          :value="balkPointName"
          @click="balkPointShow = true"
          placeholder="请选择故障分类"
          is-link
          arrow-direction="down"
          readonly
          class="textRight"
        />
        <van-action-sheet
          v-model="balkPointShow"
          :actions="balkPointActions"
          cancel-text="取消"
          close-on-click-action
          @select="selectBalkPoint"
        />
      </div>
      <!-- 故障原因 -->
      <div class="region">
        <van-field
          label="故障原因："
          :value="balkSort"
          @click="balkSortShow = true"
          placeholder="请选择故障原因"
          is-link
          arrow-direction="down"
          readonly
          class="textRight"
        />
        <van-action-sheet
          v-model="balkSortShow"
          :actions="balkSortActions"
          cancel-text="取消"
          close-on-click-action
          @select="selectBalkSort"
        />
      </div>
      <!-- 是否升速 -->
      <div class="region">
        <van-field
          label="是否升速："
          :value="upgradeName"
          @click="upgradeShow = true"
          placeholder="请选择是否升速"
          is-link
          arrow-direction="down"
          readonly
          class="textRight"
        />
        <van-action-sheet
          v-model="upgradeShow"
          :actions="upgradeActions"
          cancel-text="取消"
          close-on-click-action
          @select="selectUpgrade"
        />
      </div>
    </template>

    <!-- 备注 -->
    <div class="region" v-if="remarkShow">
      <van-field
        v-model="remark"
        label="备注："
        placeholder="请输入备注"
        class="inputRegion"
      />
    </div>
    <template v-if="speedError == 1">
      <!-- 提示语 -->
      <div class="region markedWords">
        {{ markedWords }}
      </div>
      <!-- 复测速率 -->
      <div class="region">
        <van-field
          v-model="retrialSpeed"
          label="复测速率："
          placeholder="请输入复测速率"
          class="inputRegion"
        />
      </div>
      <!-- 复测方式 -->
      <div class="region">
        <van-field
          label="复测方式："
          :value="retrialTypeName"
          @click="retrialTypeShow = true"
          placeholder="请选择复测方式"
          is-link
          arrow-direction="down"
          readonly
          class="textRight"
        />
        <van-action-sheet
          v-model="retrialTypeShow"
          :actions="retrialTypeActions"
          cancel-text="取消"
          close-on-click-action
          @select="selectRetrialType"
        />
      </div>
      <!-- 选择测试时间 -->
      <div class="region">
        <van-field
          label="测试时间："
          is-link
          arrow-direction="down"
          v-model="rcsbdbRetrialTime"
          placeholder="请选择测试时间"
          readonly
          class="textRight"
          @click="rcsbdbRetrialTimeShow = true"
        />
        <van-popup
          v-model="rcsbdbRetrialTimeShow"
          position="bottom"
          :style="{ height: '40%' }"
        >
          <van-datetime-picker
            v-model="rcsbdbRetrialTimeCurrent"
            type="datetime"
            :min-date="minDate"
            :max-date="maxDate"
            :formatter="formatter"
            cancel-button-text="开始时间"
            confirm-button-text="完成"
            @confirm="confirmRcsbdbRetrialTime"
          />
        </van-popup>
      </div>
      <!-- 赔付 -->
      <div class="region">
        <van-field
          label="赔付："
          :value="paBalkLossName"
          @click="paBalkLossShow = true"
          placeholder="请选择赔付"
          is-link
          arrow-direction="down"
          readonly
          class="textRight"
        />
        <van-action-sheet
          v-model="paBalkLossShow"
          :actions="paBalkLossActions"
          cancel-text="取消"
          close-on-click-action
          @select="selectPaBalkLoss"
        />
      </div>
      <!-- wifi类型 -->
      <div class="region">
        <van-field
          label="wifi类型："
          :value="wifiTypeName"
          @click="wifiTypeShow = true"
          placeholder="请选择wifi类型"
          is-link
          arrow-direction="down"
          readonly
          class="textRight"
        />
        <van-action-sheet
          v-model="wifiTypeShow"
          :actions="wifiTypeActions"
          cancel-text="取消"
          close-on-click-action
          @select="selectWifiType"
        />
      </div>
      <!-- wifi是否合格 -->
      <div class="region">
        <van-field
          label="wifi是否合格："
          :value="wifiQualityName"
          @click="wifiQualityShow = true"
          placeholder="请选择wifi是否合格"
          is-link
          arrow-direction="down"
          readonly
          class="textRight"
        />
        <van-action-sheet
          v-model="wifiQualityShow"
          :actions="wifiQualityActions"
          cancel-text="取消"
          close-on-click-action
          @select="selectWifiQuality"
        />
      </div>
      <!-- wifi速率 -->
      <div class="region">
        <van-field
          v-model="wifiRate"
          label="wifi速率："
          placeholder="请输入wifi速率"
          class="inputRegion"
        />
      </div>
    </template>

    <!-- 是否计入代维公司考核 -->
    <div class="region">
      <div class="selectButton">
        <span class="title">是否计入代维公司考核：</span>
        <div class="button">
          <van-button
            :type="isExamDaiwei === 1 ? 'info' : ''"
            @click="clickIsExamDaiwei(true)"
            native-type="button"
            >是</van-button
          >
          <van-button
            :type="isExamDaiwei === 0 ? 'info' : ''"
            @click="clickIsExamDaiwei(false)"
            native-type="button"
            >否</van-button
          >
        </div>
      </div>
    </div>
    <!-- 复测结果 -->
    <div class="region" v-if="retrialResultActions.length > 0">
      <van-field
        label="复测结果："
        :value="retrialResultName"
        @click="retrialResultShow = true"
        placeholder="请选择复测结果"
        is-link
        arrow-direction="down"
        readonly
        class="textRight"
      />
      <van-action-sheet
        v-model="retrialResultShow"
        :actions="retrialResultActions"
        cancel-text="取消"
        close-on-click-action
        @select="selectRetrialResult"
      />
    </div>
    <template v-if="balkSubSortId == 1026">
      <!-- 外线是否上门 -->
      <div class="region">
        <van-field
          label="外线是否上门："
          :value="isVisitName"
          @click="isVisitShow = true"
          placeholder="请选择外线是否上门"
          is-link
          arrow-direction="down"
          readonly
          class="textRight"
        />
        <van-action-sheet
          v-model="isVisitShow"
          :actions="isVisitActions"
          cancel-text="取消"
          close-on-click-action
          @select="selectIsVisit"
        />
      </div>
      <!-- 安抚结果 -->
      <div class="region">
        <div class="selectButton">
          <span class="title">安抚结果：</span>
          <div class="button">
            <van-button
              :type="placteResult === '安抚成功' ? 'info' : ''"
              @click="clickPlacteResult(true)"
              native-type="button"
              >安抚成功</van-button
            >
            <van-button
              :type="placteResult === '安抚不成功' ? 'info' : ''"
              @click="clickPlacteResult(false)"
              native-type="button"
              >安抚不成功</van-button
            >
          </div>
        </div>
      </div>
      <!-- 解决结果 -->
      <div class="region">
        <div class="selectButton">
          <span class="title">解决结果：</span>
          <div class="button">
            <van-button
              :type="solveResult === '问题解决' ? 'info' : ''"
              @click="clickSolveResult(true)"
              native-type="button"
              >问题解决</van-button
            >
            <van-button
              :type="solveResult === '问题未解决' ? 'info' : ''"
              @click="clickSolveResult(false)"
              native-type="button"
              >问题未解决</van-button
            >
          </div>
        </div>
      </div>
      <!-- 修复动作 -->
      <div class="region">
        <div class="checkBox">
          <span class="title">修复动作（可多选）：</span>
          <van-checkbox-group v-model="repairAction">
            <van-checkbox name="局内解决">局内解决</van-checkbox>
            <van-checkbox name="换猫">换猫</van-checkbox>
            <van-checkbox name="光衰线路整治（含光改）"
              >光衰线路整治（含光改）</van-checkbox
            >
            <van-checkbox name="更正LAN口">更正LAN口</van-checkbox>
            <van-checkbox name="WIFI服务">WIFI服务</van-checkbox>
            <van-checkbox name="其他入户服务">其他入户服务</van-checkbox>
            <van-checkbox name="电话沟通">电话沟通</van-checkbox>
          </van-checkbox-group>
        </div>
      </div>
    </template>

    <template v-if="idmLowHighLoadSolve">
      <!-- 低端高载强回说明 -->
      <div class="region">
        <van-field
          v-model="lowHighLoadSolveInfo"
          label="低端高载强回说明:"
          placeholder="请输入低端高载强回说明"
          class="inputRegion"
        />
      </div>
      <!-- 低端高载强回原因 -->
      <div class="region">
        <van-field
          label="低端高载强回原因："
          :value="lowHighLoadSolveReasonName"
          @click="lowHighLoadSolveReasonShow = true"
          placeholder="请选择低端高载强回原因"
          is-link
          arrow-direction="down"
          readonly
          class="textRight"
        />
        <van-action-sheet
          v-model="lowHighLoadSolveReasonShow"
          :actions="lowHighLoadSolveReasonActions"
          cancel-text="取消"
          close-on-click-action
          @select="selectLowHighLoadSolveReason"
        />
      </div>
    </template>

    <!-- 装机地址 -->
    <div class="region" v-if="needPaAdIn">
      <van-field
        v-model="paAdIn"
        label="装机地址："
        placeholder="请输入装机地址"
        class="inputRegion"
      />
    </div>

    <div class="submitButton">
      <van-button type="info" block round @click="onSubmit">提交</van-button>
    </div>
  </div>
</template>

<script>
import { reqIfmRetestQuery, reqIfmRetest } from "@/http/button";
import terminal from "../jzIPRANCircuit/components/terminal.vue";
export default {
  components: { terminal },
  name: "IfmFuCe",
  data() {
    return {
      id: parseInt(this.$route.query.id),

      piaType: -1, // 障碍类型
      piaTypeName: "",
      piaTypeShow: false,
      piaTypeActions: [],

      balkClassReasonList: [], // 故障分类，故障原因联动下拉菜单
      balkPoint: -1, // 故障分类
      balkPointName: "",
      balkPointShow: false,
      balkPointActions: [],

      balkSortName: -1, // 故障原因
      balkSort: "",
      balkSortShow: false,
      balkSortActions: [],

      upgradeState: -1, // 升速降速
      upgradeName: "",
      upgradeShow: false,
      upgradeActions: [],

      speedError: 0, // 控制div显示隐藏

      markedWords: "", // 提示语

      idmLowHighLoadSolve: false,

      lowHighLoadSolveReason: -1, // 低端高载强回原因
      lowHighLoadSolveReasonName: "",
      lowHighLoadSolveReasonShow: false,
      lowHighLoadSolveReasonActions: [],

      lowHighLoadSolveInfo: "", // 低端高载强回说明

      paBalkLoss: -1, // 赔付
      paBalkLossName: "",
      paBalkLossShow: false,
      paBalkLossActions: [],

      retrialType: -1, // 复测方式
      retrialTypeName: "",
      retrialTypeShow: false,
      retrialTypeActions: [],

      retrialSpeed: "", // 复测速率

      wifiType: -1, // wifi类型
      wifiTypeName: "",
      wifiTypeShow: false,
      wifiTypeActions: [],

      wifiQuality: -1, // wifi是否合格
      wifiQualityName: "",
      wifiQualityShow: false,
      wifiQualityActions: [],

      wifiRate: "", // wifi速率

      rcsbdbRetrialTime: "", // 测试时间
      rcsbdbRetrialTimeShow: false,
      rcsbdbRetrialTimeCurrent: new Date(),
      minDate: new Date(2000, 0, 1),
      maxDate: new Date(2090, 10, 1),

      retrialResult: -1, // 复测结果
      retrialResultName: "",
      retrialResultShow: false,
      retrialResultActions: [],

      balkSubSortId: -1,

      isVisit: -1, // 外线是否上门
      isVisitName: "",
      isVisitShow: false,
      isVisitActions: [],

      isExamDaiwei: -1, // 是否计入代维公司考核
      remark: "", // 备注
      remarkShow: false,

      placteResult: "", // 安抚结果
      solveResult: "", // 解决结果
      paAdIn: "", // 装机地址
      needPaAdIn: false,
      repairAction: [], // 修复动作
    };
  },
  methods: {
    // 回退
    goBackFn() {
      this.$router.go(-1);
    },
    // 选择障碍类型
    selectPiaType(action) {
      this.piaType = action.id;
      this.piaTypeName = action.name;
    },
    //  选择故障分类
    selectBalkPoint(action) {
      this.balkPoint = action.id;
      this.balkPointName = action.name;

      // 更换对应故障原因下拉菜单
      this.balkSortName = -1;
      for (let balkClass of this.balkClassReasonList) {
        if (balkClass.id == action.id) {
          this.balkSortActions = balkClass.sonDownBox;
          for (let balkSort of this.balkSortActions) {
            if (balkSort.status == 1) {
              // 故障原因有默认值
              this.balkSortName = balkSort.id;
              this.balkSort = balkSort.name;
              break;
            }
          }
          //  故障原因无默认值
          if (this.balkSortActions.length > 0 && this.balkSortName == -1) {
            this.balkSortName = this.balkSortActions[0].id;
            this.balkSort = this.balkSortActions[0].name;
          }
        }
      }
    },
    // 选择故障原因
    selectBalkSort(action) {
      this.balkSortName = action.id;
      this.balkSort = action.name;
    },
    // 选择升速降速
    selectUpgrade(action) {
      this.upgradeState = action.id;
      this.upgradeName = action.name;
    },
    // 选择复测方式
    selectRetrialType(action) {
      this.retrialType = action.id;
      this.retrialTypeName = action.name;
    },
    // 选择赔付
    selectPaBalkLoss(action) {
      this.paBalkLoss = action.id;
      this.paBalkLossName = action.name;
    },
    // 选择wifi类型
    selectWifiType(action) {
      this.wifiType = action.id;
      this.wifiTypeName = action.name;
    },
    // 选择wifi是否合格
    selectWifiQuality(action) {
      this.wifiQuality = action.id;
      this.wifiQualityName = action.name;
    },
    // 选择复测结果
    selectRetrialResult(action) {
      this.retrialResult = action.id;
      this.retrialResultName = action.name;
    },
    // 选择外线是否上门
    selectIsVisit(action) {
      this.isVisit = action.id;
      this.isVisitName = action.name;
    },
    // 选择低端高载强回原因
    selectLowHighLoadSolveReason(action) {
      this.lowHighLoadSolveReason = action.id;
      this.lowHighLoadSolveReasonName = action.name;
    },

    // 选择测试时间
    confirmRcsbdbRetrialTime(value) {
      this.rcsbdbRetrialTime = this.dataFormat(value);
      this.rcsbdbRetrialTimeShow = false;
    },
    // 选择是否计入代维公司考核
    clickIsExamDaiwei(bool) {
      if (bool) this.isExamDaiwei = 1;
      else this.isExamDaiwei = 0;
    },
    // 选择安抚结果
    clickPlacteResult(bool) {
      if (bool) this.placteResult = "安抚成功";
      else this.placteResult = "安抚不成功";
    },
    // 选择解决结果
    clickSolveResult(bool) {
      if (bool) this.solveResult = "问题解决";
      else this.solveResult = "问题未解决";
    },

    // 时间选择器格式化
    formatter(type, val) {
      if (type === "year") {
        return `${val}年`;
      } else if (type === "month") {
        return `${val}月`;
      } else if (type === "day") {
        return `${val}日`;
      } else if (type === "hour") {
        return `${val}时`;
      } else if (type === "minute") {
        return `${val}分`;
      }
      return val;
    },
    // 补零
    addZero(num) {
      return num < 10 ? "0" + num : num;
    },
    // 时间格式转换 → yyyy-mm-dd hh:mm:ss
    dataFormat(value) {
      let y = new Date(value).getFullYear();
      let m = new Date(value).getMonth() + 1;
      let d = new Date(value).getDate();
      let h = new Date(value).getHours();
      let min = new Date(value).getMinutes();

      let newDate =
        y.toString() +
        "-" +
        this.addZero(m.toString()) +
        "-" +
        this.addZero(d.toString()) +
        " " +
        this.addZero(h.toString()) +
        ":" +
        this.addZero(min.toString()) +
        ":00";
      return newDate;
    },

    // 获取复测信息
    async getFuCeInfo() {
      let result = await reqIfmRetestQuery(JSON.stringify({ id: this.id }));
      console.log("获取ifm复测信息", result);
      this.apiResponse(result, ".ifmFuCe", () => {
        // 响应成功
        this.remarkShow = true;
        // 返回piaTypeList有值时，显示障碍类型下拉框
        let piaTypeList = result.piaTypeList;
        this.piaTypeActions = piaTypeList;
        for (let piaType of piaTypeList) {
          if (piaType.status == 1) {
            // 有默认值
            this.piaType = piaType.id;
            this.piaTypeName = piaType.name;
            break;
          }
        }
        //  piaType没有默认值
        if (piaTypeList.length > 0 && this.piaType == -1) {
          this.piaType = piaTypeList[0].id;
          this.piaTypeName = piaTypeList[0].name;
        }

        /* 返回balkClassReasonList有值时，显示故障分类和故障原因下拉框，
        返回的内容中有标记哪个是默认显示，如果都没有，就默认显示第一个。
        父级为故障分类，对应的下级为故障原因。同时取upgradeList，
        显示是否升速下拉框。 */
        this.balkClassReasonList = result.balkClassReasonList;
        this.balkClassReasonList.forEach((balkPoint) => {
          // 故障分类
          let obj = {};
          obj.name = balkPoint.name;
          obj.id = balkPoint.id;
          this.balkPointActions.push(obj);
          if (balkPoint.status == 1) {
            // 有默认值
            this.balkPoint = balkPoint.id;
            this.balkPointName = balkPoint.name;
            // 获取下级故障原因
            this.balkSortActions = balkPoint.sonDownBox;
            this.balkSortName = balkPoint.sonDownBox[0].id;
            this.balkSort = balkPoint.sonDownBox[0].name;
          }
        });
        //  balkPoint没有默认值
        if (this.balkClassReasonList.length > 0 && this.balkPoint == -1) {
          this.balkPoint = this.balkClassReasonList[0].id;
          this.balkPointName = this.balkClassReasonList[0].name;
          // 下级故障原因
          let balkSortActions = this.balkClassReasonList[0].sonDownBox;
          if (balkSortActions.length > 0) {
            this.balkSortActions = balkSortActions;
            this.balkSortName = balkSortActions[0].id;
            this.balkSort = balkSortActions[0].name;
          }
        }

        if (this.balkClassReasonList.length > 0) {
          //  获取升速下拉框内容
          this.upgradeActions = result.upgradeList;
          for (let upgrade of this.upgradeActions) {
            if (upgrade.status == 1) {
              this.upgradeState = upgrade.id;
              this.upgradeName = upgrade.name;
              break;
            }
          }
          if (this.upgradeActions.length > 0 && this.upgradeState == -1) {
            this.upgradeState = this.upgradeActions[0].id;
            this.upgradeName = this.upgradeActions[0].name;
          }
        }

        // 返回的speedError等于1的时候，
        if (result.speedError == 1) {
          this.speedError = 1;
          this.markedWords = result.markedWords;
          // 取retrialTypeList，显示复测方式下拉框
          this.retrialTypeActions = result.retrialTypeList;
          for (let retrial of this.retrialTypeActions) {
            if (retrial.status == 1) {
              this.retrialType = retrial.id;
              this.retrialTypeName = retrial.name;
              break;
            }
          }
          if (this.retrialTypeActions.length > 0 && this.retrialType == -1) {
            this.retrialType = this.retrialTypeActions[0].id;
            this.retrialTypeName = this.retrialTypeActions[0].name;
          }

          // 取balkLossList，显示赔付下拉框
          this.paBalkLossActions = result.balkLossList;
          for (let item of this.paBalkLossActions) {
            if (item.status == 1) {
              this.paBalkLoss = item.id;
              this.paBalkLossName = item.name;
              break;
            }
          }
          if (this.paBalkLossActions.length > 0 && this.paBalkLoss == -1) {
            this.paBalkLoss = this.paBalkLossActions[0].id;
            this.paBalkLossName = this.paBalkLossActions[0].name;
          }

          // 取wifiTypeList，显示wifi类型下拉框
          this.wifiTypeActions = result.wifiTypeList;
          for (let item of this.wifiTypeActions) {
            if (item.status == 1) {
              this.wifiType = item.id;
              this.wifiTypeName = item.name;
              break;
            }
          }
          if (this.wifiTypeActions.length > 0 && this.wifiType == -1) {
            this.wifiType = this.wifiTypeActions[0].id;
            this.wifiTypeName = this.wifiTypeActions[0].name;
          }

          // 取yesNoList，显示wifi是否合格下拉框
          this.wifiQualityActions = result.yesNoList;
          for (let item of this.wifiQualityActions) {
            if (item.status == 1) {
              this.wifiQuality = item.id;
              this.wifiQualityName = item.name;
              break;
            }
          }
          if (this.wifiQualityActions.length > 0 && this.wifiQuality == -1) {
            this.wifiQuality = this.wifiQualityActions[0].id;
            this.wifiQualityName = this.wifiQualityActions[0].name;
          }
        }

        // 返回的retrialResultList有值时，显示复测结果下拉框
        this.retrialResultActions = result.retrialResultList;
        for (let item of this.retrialResultActions) {
          if (item.status == 1) {
            this.retrialResult = item.id;
            this.retrialResultName = item.name;
            break;
          }
        }
        if (this.retrialResultActions.length > 0 && this.retrialResult == -1) {
          this.retrialResult = this.retrialResultActions[0].id;
          this.retrialResultName = this.retrialResultActions[0].name;
        }

        // balkSubSortId等于1026的的时候，
        if (result.balkSubSortId == 1026) {
          this.balkSubSortId = 1026;
          // 取isVisitEndList，显示外线是否上门下拉框
          this.isVisitActions = result.isVisitEndList;
          for (let item of this.isVisitActions) {
            if (item.status == 1) {
              this.isVisit = item.id;
              this.isVisitName = item.name;
              break;
            }
          }
          if (this.isVisitActions.length > 0 && this.isVisit == -1) {
            this.isVisit = this.isVisitActions[0].id;
            this.isVisitName = this.isVisitActions[0].name;
          }
        }

        // 返回的isIdmLowHighLoadSolve等于true时，显示低端高载强回说明输入框
        this.idmLowHighLoadSolve = result.idmLowHighLoadSolve;
        if (this.idmLowHighLoadSolve) {
          this.lowHighLoadSolveReasonActions =
            result.lowHighLoadSolveReasonList;
          for (let item of this.lowHighLoadSolveReasonActions) {
            if (item.status == 1) {
              this.lowHighLoadSolveReason = item.id;
              this.lowHighLoadSolveReasonName = item.name;
              break;
            }
          }
          if (
            this.lowHighLoadSolveReasonActions.length > 0 &&
            this.lowHighLoadSolveReason == -1
          ) {
            this.lowHighLoadSolveReason =
              this.lowHighLoadSolveReasonActions[0].id;
            this.lowHighLoadSolveReasonName =
              this.lowHighLoadSolveReasonActions[0].name;
          }
        }

        this.needPaAdIn = result.needPaAdIn;
      });
      // 响应失败
      if (!result.operationSuccessFlag) this.$router.go(-1);
    },
    // 提交复测信息
    async onSubmit() {
      // 校验
      if (this.remark == "") return this.$toast("请输入备注");
      if (this.speedError == 1) {
        if (this.retrialSpeed == "") return this.$toast("请输入复测速率");
        if (this.rcsbdbRetrialTime == "") return this.$toast("请选择测试时间");
        if (this.wifiRate == "") return this.$toast("请输入wifi速率");
      }
      if (this.isExamDaiwei == -1)
        return this.$toast("请选择是否计入代维公司考核");
      if (this.balkSubSortId == 1026) {
        if (this.placteResult == "") return this.$toast("请选择安抚结果");
        if (this.solveResult == "") return this.$toast("请选择解决结果");
        if (this.repairAction.length == 0) return this.$toast("请选择修复动作");
      }
      if (this.idmLowHighLoadSolve) {
        if (this.lowHighLoadSolveInfo == "")
          return this.$toast("请输入低端高载强回说明");
      }
      if (this.needPaAdIn) {
        if (this.paAdIn == "") return this.$toast("请输入装机地址");
      }

      let postData = {
        id: this.id,
        piaType: this.piaType,
        balkSortName: this.balkSortName,
        balkPoint: this.balkPoint,
        balkReason: -1,
        upgradeState: this.upgradeState,
        lowHighLoadSolveReason: this.lowHighLoadSolveReason,
        paBalkLoss: this.paBalkLoss,
        retrialType: this.retrialType,
        wifiType: this.wifiType,
        wifiQuality: this.wifiQuality,
        retrialResult: this.retrialResult,
        isVisit: this.isVisit,
        isExamDaiwei: this.isExamDaiwei,
        rcsbdbRetrialTime: this.rcsbdbRetrialTime,
        lowHighLoadSolveInfo: this.lowHighLoadSolveInfo,
        retrialSpeed: this.retrialSpeed,
        wifiRate: this.wifiRate,
        remark: this.remark,
        placteResult: this.placteResult,
        solveResult: this.solveResult,
        paAdIn: this.paAdIn,
        repairAction: this.repairAction,
      };
      let result = await reqIfmRetest(JSON.stringify(postData));
      console.log("提交结果", result);
      this.apiResponse(result, ".ifmFuCe", () => {
        // 操作成功 返回上一个页面并刷新
        this.$router.go(-1);
        // 只调用接口按钮操作成功 刷新工单详情/工作台
        this.operationSuccessRefresh(true);
      });
    },
  },
  created() {
    // 获取复测信息
    this.getFuCeInfo();
  },
};
</script>

<style scoped lang="less">
.ifmFuCe {
  min-height: 100%;
  background-color: @bg-color;
  .region {
    margin-top: 10px;
    background-color: #fff;
    /deep/.van-cell__title {
      flex: 0.8;
    }
    .selectButton {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 45px;
      //   padding: 0 10px 0 6px;
      padding: 0 16px;
      background-color: #fff;
      .title {
        display: flex;
        align-items: center;
        color: #646566;
        font-size: 14px;
      }
      .button {
        .van-button {
          //   width: 50px;
          width: 80px;
          height: 35px;
          padding: 5px;
          font-size: 13px;
        }
      }
    }
    .inputRegion {
      align-items: center;
      /deep/.van-cell__title {
        span {
          display: inline-block;
          margin-top: 5px;
        }
      }
      /deep/.van-cell__value {
        input {
          padding: 5px;
          border: 1px solid #e0e0e0;
        }
      }
    }
    .textRight {
      align-items: center;
      /deep/.van-cell__value.van-field__value {
        input {
          text-align: right;
        }
      }
    }
    .checkBox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px;
      background-color: #fff;
      .title {
        display: flex;
        align-items: center;
        color: #646566;
        font-size: 14px;
        text-align: left;
      }
      .van-checkbox-group {
        flex: 1;
        .van-checkbox {
          margin-top: 5px;
          font-size: 14px;
          /deep/.van-checkbox__label {
            text-align: left;
          }
        }
      }
    }
  }
  .markedWords {
    padding: 10px 16px;
    text-align: left;
    color: red;
  }
  .submitButton {
    padding: 30px;
  }
}
</style>