<template>
  <!-- 修机单-回复 -->
  <!-- 回复主页面 -->
  <div class="reply">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <!-- 工单去向 -->
      <div class="selectButton" v-if="finishGoWhereIsTest">
        <span class="title">工单去向</span>
        <div class="button">
          <!-- 工单去向-工单中心 -->
          <template v-if="finishGoService == 0">
            <van-button type="info" native-type="button">工单中心</van-button>
          </template>
          <!-- 工单去向-客服/工单中心 -->
          <template v-if="finishGoService == 1">
            <van-button
              :type="finishGoWhere === 0 ? 'info' : ''"
              @click="clickFinishGoWhere(true)"
              native-type="button"
              >客服</van-button
            >
            <van-button
              :type="finishGoWhere === 1 ? 'info' : ''"
              @click="clickFinishGoWhere(false)"
              native-type="button"
              >工单中心</van-button
            >
          </template>
        </div>
      </div>
      <!-- 不允许回客服说明 -->
      <span class="noService" v-if="finishNoGoServiceRemark">{{
        finishNoGoServiceRemark
      }}</span>
      <!-- speedError=1时 障碍类别和故障分类隐藏 -->
      <template v-if="speedError !== 1">
        <!-- 障碍类别 -->
        <van-field
          label="障碍类别"
          :value="barrierCate"
          @click="barrierCateShow = true"
          is-link
          arrow-direction="down"
          readonly
          class="textRight borderTop"
        />
        <van-action-sheet
          v-model="barrierCateShow"
          :actions="barrierCateActions"
          cancel-text="取消"
          close-on-click-action
          @select="selectBarrierCate"
        />

        <!-- 故障分类 -->
        <van-field
          label="故障分类"
          :value="faultCate"
          @click="faultCateShow = true"
          is-link
          arrow-direction="down"
          readonly
          class="textRight"
        />
        <van-action-sheet
          v-model="faultCateShow"
          :actions="faultCateActions"
          cancel-text="取消"
          close-on-click-action
          @select="selectFaultCate"
        />
      </template>

      <!-- 故障原因 -->
      <van-field
        label="故障原因"
        :value="faultReason"
        @click="faultReasonShow = true"
        is-link
        arrow-direction="down"
        readonly
        class="textRight"
      />
      <van-action-sheet
        v-model="faultReasonShow"
        :actions="faultReasonActions"
        cancel-text="取消"
        close-on-click-action
        @select="selectFaultReason"
      />

      <van-form @submit="skipSign">
        <!-- 外包材料 -->
        <van-field
          label="外包材料"
          is-link
          arrow-direction="down"
          v-model="materialsValue"
          placeholder="请编辑外包材料"
          readonly
          :rules="[{ required: true }]"
          @click="editMaterials"
          class="textRight borderTop"
        />
        <!-- 选择的外包材料内容 -->
        <div class="materialsContent" v-show="materialsInfo.length > 0">
          {{ materialsInfo }}
        </div>

        <!-- speedError=1 时显示复测和wifi -->
        <template v-if="speedError == 1">
          <!-- 复测时间 -->
          <van-field
            label="复测时间"
            is-link
            arrow-direction="down"
            v-model="fCDateTime"
            placeholder="请选择复测时间"
            readonly
            :rules="[{ required: true }]"
            class="textRight borderTop"
            @click="fCDateTimeShow = true"
          />
          <!-- 选择复测时间 -->
          <van-popup
            v-model="fCDateTimeShow"
            position="bottom"
            :style="{ height: '40%', width: '390px' }"
          >
            <van-datetime-picker
              v-model="currentDate"
              type="datetime"
              :min-date="minDate"
              :max-date="maxDate"
              :formatter="formatter"
              cancel-button-text="开始时间"
              confirm-button-text="完成"
              @confirm="confirmFCDate"
            />
          </van-popup>
          <!-- 复测速率 -->
          <van-field
            v-model="fCSpeed"
            label="复测速率"
            placeholder="请输入复测速率（必填）"
            class="borderTop inputRegion"
            :rules="[{ required: true }]"
          />
          <!-- 复测方式 -->
          <div class="selectButton">
            <span class="title">复测方式</span>
            <div class="button">
              <van-button
                :type="fCType === '0' ? 'info' : ''"
                @click="clickFCType(true)"
                native-type="button"
                >用户自测</van-button
              >
              <van-button
                :type="fCType === '1' ? 'info' : ''"
                @click="clickFCType(false)"
                native-type="button"
                >局方上门复测</van-button
              >
            </div>
          </div>
          <!-- WIFI类型 -->
          <van-field
            label="WIFI类型"
            :value="wifiTypeName"
            @click="wifiTypeShow = true"
            placeholder="请选择WIFI类型"
            is-link
            arrow-direction="down"
            readonly
            class="textRight"
            :rules="[{ required: true }]"
          />
          <van-action-sheet
            v-model="wifiTypeShow"
            :actions="wifiTypeActions"
            cancel-text="取消"
            close-on-click-action
            @select="selectWifiType"
          />
          <!-- WIFI类型不等于1时显示 -->
          <template v-if="wifiType !== 1 && wifiType !== -1">
            <!-- WIFI速率 -->
            <van-field
              v-model="wifiRate"
              label="WIFI速率"
              placeholder="请输入WIFI速率（必填）"
              class="borderTop inputRegion"
              :rules="[{ required: true }]"
            />
            <!-- WIFI是否合格 -->
            <div class="selectButton">
              <span class="title">WIFI是否合格</span>
              <div class="button">
                <van-button
                  :type="wifiQuality === 1 ? 'info' : ''"
                  @click="clickWifiQuality(true)"
                  native-type="button"
                  >是</van-button
                >
                <van-button
                  :type="wifiQuality === 0 ? 'info' : ''"
                  @click="clickWifiQuality(false)"
                  native-type="button"
                  >否</van-button
                >
              </div>
            </div>
          </template>
        </template>
        <!-- ifmChangeInfoHisItem有值就展示评价设备好坏 -->
        <template v-if="ifmChangeInfoHisItem.length > 0">
          <van-field
            label="评价设备好坏"
            is-link
            arrow-direction="down"
            v-model="isDevEvaluate"
            placeholder="请评价设备好坏"
            readonly
            :rules="[{ required: true }]"
            class="textRight borderTop"
            @click="devEvaluateShow = true"
          />
        </template>

        <!-- 标准地址 -->
        <!-- rightAddress=1时，页面新增现实标准地址输入框和提示 -->
        <div class="rightAddress" v-if="rightAddress == 1">
          <van-field
            v-model="inputRightAddress"
            label="标准地址"
            placeholder="请输入标准地址（回客服时必填）"
            class="borderTop inputRegion"
          />
          <p>用户标准地址不准确或为空，如需回客服请填写标准地址</p>
        </div>
        <!-- 修理情况说明 -->
        <van-field
          v-model="repairExplain"
          label="修理情况说明"
          placeholder="请输入修理情况说明（必填）"
          :rules="[{ required: true }]"
          class="borderTop borderBottom inputRegion"
        />
        <!-- 显示绑定光纤尾码 -->
        <template v-if="showFiber">
          <!-- 绑定光纤尾码 -->
          <div class="selectButton">
            <span class="title">绑定光纤尾码</span>
            <div class="button">
              <van-button
                :type="needFiberNo === 0 ? 'info' : ''"
                @click="clickNeedFiber(true)"
                native-type="button"
                >不需要</van-button
              >
              <van-button
                :type="needFiberNo === 1 ? 'info' : ''"
                @click="clickNeedFiber(false)"
                native-type="button"
                >需要</van-button
              >
            </div>
          </div>
          <!-- 不需要 -->
          <div v-if="needFiberNo == 0">
            <!-- 不绑定的原因 -->
            <van-field
              label="不绑定的原因"
              :value="noBindingReasonName"
              @click="noBindingReasonShow = true"
              is-link
              arrow-direction="down"
              readonly
              class="textRight"
            />
            <van-action-sheet
              v-model="noBindingReasonShow"
              :actions="noBindingReasonActions"
              cancel-text="取消"
              close-on-click-action
              @select="selectNoBindingReason"
            />

            <!-- 无需绑定说明 -->
            <van-field
              v-model="noBingReamrk"
              label="无需绑定说明"
              placeholder="请输入无需绑定说明（必填）"
              :rules="[{ required: true }]"
              class="borderTop borderBottom inputRegion"
            />
          </div>
          <!-- 需要 -->
          <div v-if="needFiberNo == 1">
            <!-- 光纤尾码 -->
            <van-field
              v-model="fiberNo"
              label="光纤尾码"
              right-icon="scan"
              class="fiberNo"
              :rules="[{ required: true }]"
              placeholder="请输入光纤尾码（必填）"
            />
            <!-- 上传图片 -->
            <div class="uploadFiberImage">
              <p>上传图片(最多5张图片)</p>
              <div class="upload">
                <van-uploader
                  v-model="photoIdList"
                  multiple
                  :max-count="5"
                  :after-read="afterRead"
                >
                  <van-button icon="plus" type="default"></van-button>
                </van-uploader>
              </div>
            </div>
          </div>
        </template>

        <!-- 显示超时原因，超时说明 -->
        <template v-if="overTimeShow">
          <!-- 超时原因 -->
          <van-field
            label="超时原因"
            :value="overTimeReason"
            @click="overTimeReasonShow = true"
            is-link
            arrow-direction="down"
            readonly
            class="textRight"
          />
          <van-action-sheet
            v-model="overTimeReasonShow"
            :actions="overTimeReasonActions"
            cancel-text="取消"
            close-on-click-action
            @select="selectOverTimeReason"
          />

          <!-- 超时说明 -->
          <van-field
            v-model="overTiemContent"
            label="超时说明"
            placeholder="请输入超时说明（必填）"
            :rules="[{ required: true }]"
            class="borderTop borderBottom inputRegion"
          />
        </template>

        <div style="padding: 30px">
          <van-button round block type="info" native-type="submit"
            >确定</van-button
          >
        </div>
      </van-form>
      <!-- 设备评价弹出框 -->
      <van-popup
        v-model="devEvaluateShow"
        get-container=".reply"
        class="devEvaluatePop"
      >
        <table>
          <tr>
            <th style="border-right: 1px solid">设备信息</th>
            <th>评价</th>
          </tr>
          <tr v-for="(item, index) in ifmChangeInfoHisItem" :key="index">
            <td style="border-right: 1px solid">
              <div class="listInfo">
                <div class="left">
                  <div class="title" v-if="item.resType === 1">ONU</div>
                  <div class="title" v-else-if="item.resType === 4">IPTV</div>
                  <div class="title" v-else>沃家产品</div>
                  <div class="content">
                    <span>厂家：{{ item.newChangjia }}</span>
                    <span>SN：{{ item.newSn }}</span>
                    <span>MAC：{{ item.newMac }}</span>
                  </div>
                </div>
              </div>
            </td>
            <td>
              <van-button
                :type="devEvaluateResultList[index].isBreak === 1 ? 'info' : ''"
                @click="clickDevEvaluateResult(index, true)"
                native-type="button"
                >好</van-button
              >
              <van-button
                :type="devEvaluateResultList[index].isBreak === 2 ? 'info' : ''"
                @click="clickDevEvaluateResult(index, false)"
                native-type="button"
                >不好</van-button
              >
            </td>
          </tr>
        </table>
        <div class="buttonRegion">
          <van-button type="info" @click="confirmDevEvaluate">确定</van-button>
          <van-button type="info" @click="devEvaluateShow = false"
            >取消</van-button
          >
        </div>
      </van-popup>
      <!-- 测速不达标弹出框 -->
      <van-popup v-model="speedErrorShow" class="speedErrorPop">
        <p>
          如果赔付选项选择有线不达标或有线达标无线不达标，客服会发起赔偿，请务必确认测试结果是否达标。<br />
            附：沃家组网WiFi标准：（一米内无遮挡且断开路由器其他终端连接）<br />
          1.500M 以下（不含 500M）宽带:不低于签约速率80%。<br />
          2.500M及600M宽带：WiFi6白金级或钻石级，不低于签约速率80%；
          WiFi黄金级服务，不低于350Mbps。 <br />
          3.1000M宽带：WiFi6 钻石级，不低于 800Mbps；
          WiFi6白金级，不低于700Mbps； WiFi 黄金级，不低于350Mbps。<br />
        </p>
        <van-button
          block
          type="info"
          style="margin-top: 20px"
          @click="speedErrorShow = false"
          >确定</van-button
        >
      </van-popup>
    </div>
  </div>
</template>

<script>
import { reqFinishQuery, reqifmFinish } from "@/http/button";
import { getItem, removeItem } from "@/utils/sessionStorage";

export default {
  name: "RepairMachineFinish",
  data() {
    return {
      headName: `回复(${this.$route.query.orderNum})`,
      finishGoWhere: 1, // 工单去向（0：客服，1：工单中心）
      finishGoWhereIsTest: 0, // 回客服或回工单中心时，是否试点（0：非试点，1：试点）（是否显示工单去向）
      finishGoService: 0, // 0:不允许回客服 1:允许回客服
      finishNoGoServiceRemark: "", // 不允许回客服说明
      // 障碍类别
      barrierCateShow: false,
      barrierCate: "",
      balkType: -1, // 传参-障碍类别
      barrierCateActions: [
        { name: "PSTN", value: 1 },
        { name: "ISDN", value: 2 },
        { name: "ADSL", value: 3 },
        { name: "模拟专线", value: 4 },
        { name: "单宽", value: 5 },
        { name: "IPTV", value: 6 },
        { name: "延伸服务", value: 7 },
        { name: "京东服务", value: 8 },
        { name: "客户感知", value: 9 },
      ],
      // 故障分类
      faultCateShow: false,
      faultCate: "用户侧原因",
      buwei: "600", // 传参-故障分类
      faultCateActions: [
        { name: "用户侧原因", value: "600" },
        { name: "线路侧原因", value: "650" },
        { name: "网络侧原因", value: "700" },
        { name: "非网络质量问题", value: "800" },
      ],
      // 故障原因
      faultReasonShow: false,
      faultReason: "用户自有设备问题",
      leibie: "601", // 传参-故障原因
      // 用户侧原因
      faultReasonActions: [
        { name: "用户自有设备问题", value: "601" },
        { name: "用户侧其他问题", value: "602" },
        { name: "wifi信号覆盖问题造成视频感知差", value: "603" },
        { name: "申告网速慢但测速正常", value: "604" },
        { name: "查中自恢复", value: "605" },
        { name: "用户操作问题", value: "606" },
        { name: "户内线路故障", value: "607" },
        { name: "光猫类终端故障", value: "608" },
        { name: "机顶盒类故障", value: "609" },
        { name: "路由器、交换设备故障", value: "610" },
        { name: "低端高载", value: "611" },
        { name: "路由器等能力不匹配", value: "612" },
      ],
      materialsInfo: "", // 选择的外包材料内容-展示
      rightAddress: "", // 标准地址是否有误
      inputRightAddress: "", // 手工输入标准地址内容
      repairExplain: "", // 修理情况说明
      // 绑定光纤尾码
      showFiber: false,
      // 不需要绑定光纤尾码
      needFiberNo: -1, // 0：不需要回填光纤尾码，1：需要回填光纤尾码
      noBindingReason: -1, // 不需要回填光纤尾码的原因
      noBindingReasonName: "FTTB铜线ADSLAGISDNPON+D", // 不需要回填光纤尾码的原因
      noBindingReasonShow: false,
      noBindingReasonActions: [
        { name: "FTTB铜线ADSLAGISDNPON+D" },
        { name: "物业锁门" },
        { name: "光分过高" },
        { name: "无需上门" },
        { name: "其他" },
      ],
      noBingReamrk: "", //不需要回填光纤尾码的说明
      // 需要绑定
      fiberNo: "", // 光纤尾码
      photoIdList: [], // 光纤尾码照片在数据库的ID集合
      // 是否显示超时原因
      overTimeShow: false,
      overTimeReason: "用户地址不详", //超时原因
      overTimeReasonShow: false,
      overTimeReasonActions: [
        { name: "用户地址不详" },
        { name: "用户锁门无人" },
        { name: "用户设备自维" },
        { name: "用户违章" },
        { name: "用户设备（话机坏等用户设备原因造成）" },
        { name: "自然灾害造成的故障" },
        { name: "外单位施工影响" },
        { name: "电缆被盗" },
        { name: "局端设备原因" },
        { name: "局端设备原因" },
        { name: "系统故障" },
        { name: "人为因素" },
      ],
      overTiemContent: "", // 超时说明
      // 传给签名页面的参数
      isMustUploadPhoto: 2, // 回单是否必须上传现场照片 1：必须，2：不必须
      speedError: this.$route.query.speedError, // 测速是否达标 1否，0是
      // 复测时间
      fCDateTimeShow: false,
      fCDateTime: "",
      minDate: new Date(2000, 0, 1),
      maxDate: new Date(2090, 10, 1),
      currentDate: new Date(),
      // 复测速率
      fCSpeed: "",
      // 复测方式
      fCType: "0", // 0：用户自测 1：局方上门复测
      // WIFI类型
      wifiType: -1, // 1.无;2.黄金;3.白金;4.钻石
      wifiTypeName: "",
      wifiTypeShow: false,
      wifiTypeActions: [
        { name: "无WIFI", value: 1 },
        { name: "黄金", value: 2 },
        { name: "白金", value: 3 },
        { name: "钻石", value: 4 },
      ],
      wifiRate: "", // WIFI速率
      wifiQuality: 1, // WIFI是否合格
      // 评价设备好坏
      ifmChangeInfoHisItem: [], // 回单前查询返回的
      isDevEvaluate: "", // 是否进行评价，评价完显示'已评价'
      devEvaluateShow: false, // 设备评价弹出框
      devEvaluateResultList: [], // 提交的设备评价结果 isBreak 1：好 2：坏
      ifmChangeInfoHisItem: [], // 设备评价弹出框内容
      // speedError 测速不达标弹框
      speedErrorShow: false,
    };
  },
  computed: {
    materialsValue() {
      // 外包材料是否有值-表单验证
      if (this.materialsInfo) {
        // 外包材料有值
        return "请编辑外包材料";
      } else {
        return "";
      }
    },
  },
  methods: {
    // 回退
    goBackFn() {
      this.destroyRoute(this);
      this.$router.go(-1);
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
    // 选择复测时间
    confirmFCDate(value) {
      // 获取当前时间戳
      let nowData = Date.now();
      // 获取选择的时间戳
      if (nowData > Date.parse(value)) {
        return this.$toast("不能小于当前时间");
      }
      let y = new Date(value).getFullYear();
      let m = new Date(value).getMonth() + 1;
      let d = new Date(value).getDate();
      let h = new Date(value).getHours();
      let min = new Date(value).getMinutes();

      this.fCDateTime =
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

      this.fCDateTimeShow = false;
    },
    // 选中复测方式
    clickFCType(bool) {
      if (bool) this.fCType = "0";
      else this.fCType = "1";
    },
    // 选中wifi类型
    selectWifiType(action) {
      this.wifiTypeName = action.name;
      this.wifiType = action.value;
    },
    // 选中WIFI是否合格
    clickWifiQuality(bool) {
      if (bool) this.wifiQuality = 1;
      else this.wifiQuality = 0;
    },
    // 选中设备评价好坏
    clickDevEvaluateResult(index, bool) {
      if (bool) {
        this.$set(this.devEvaluateResultList[index], "isBreak", 1);
      } else {
        this.$set(this.devEvaluateResultList[index], "isBreak", 2);
      }
    },
    // 确定评价设备好坏
    confirmDevEvaluate() {
      this.devEvaluateShow = false;
      this.isDevEvaluate = "已评价";
    },
    // 得到回单前查询内容
    getFinishQuery() {
      // 详情传过来的speedError为1时，一进入页面就显示弹出框
      if (this.$route.query.speedError == 1) {
        this.speedErrorShow = true;
      }
      let result = JSON.parse(this.$route.query.res);
      if (result.operationSuccessFlag) {
        // 展示评价设备好坏
        this.ifmChangeInfoHisItem = result.ifmChangeInfoHisItem;
        // 是否显示工单去向
        this.finishGoWhereIsTest = result.finishGoWhereIsTest;
        // 是否允许回客服
        this.finishGoService = result.finishGoService;
        // 不允许回客服说明
        this.finishNoGoServiceRemark = result.finishNoGoServiceRemark;
        // 激活工单去向-客服
        if (this.finishGoService === 1) this.finishGoWhere = 0;
        // hasFiber 0:没有尾码，需要扫码 1:有尾码，不要扫码
        // hasFiber为0时显示绑定光纤尾码
        if (result.hasFiber == 0) {
          this.showFiber = true;
        }
        // 得到障碍类别
        // 1:PSTN,2:ISDN,3:ADSL,4:模拟专线,5:单宽,6:IPTV,7:延伸服务,8:京东服务,9:客户感知
        this.barrierCate = this.barrierCateActions[result.piaType - 1].name;
        this.balkType = result.piaType;
        // 获取回单前是否必须上传现场照片
        this.isMustUploadPhoto = result.isMustUploadPhoto;
        // 详情传过来的speedError为1时，不显示障碍类别和故障分类，故障原因为测速不达标
        if (this.$route.query.speedError == 1) {
          this.faultReason = "测速不达标";
          this.leibie = "22";
          this.faultReasonActions = [{ name: "测速不达标", value: "22" }];
        } else {
          // speedError 不等于1时再判断ischangeOnu和ischangeIptv
          // ischangeOnu为true时，故障原因默认为光猫类终端故障
          if (result.ischangeOnu) {
            this.faultReason = "光猫类终端故障";
            this.leibie = "608";
          }
          // ischangeIptv为true时，障碍类别为IPTV，故障原因默认为 机顶盒类故障
          if (result.ischangeIptv) {
            this.barrierCate = "IPTV";
            this.balkType = 6;
            this.faultReason = "机顶盒类故障";
            this.leibie = "609";
          }
        }

        // rightAddress=1时，页面新增现实标准地址输入框和提示
        this.rightAddress = result.rightAddress;

        // 获取设备评价弹出框内容
        this.ifmChangeInfoHisItem = result.ifmChangeInfoHisItem;
        // 根据ifmChangeInfoHisItem生成回复提交的devEvaluateResultList
        if (this.ifmChangeInfoHisItem.length > 0) {
          this.ifmChangeInfoHisItem.forEach((item, index) => {
            let obj = {};
            obj.resType = item.resType;
            obj.mac = item.newMac;
            obj.sn = item.newSn;
            obj.isBreak = 1; // 1好 2 坏
            this.devEvaluateResultList.push(obj);
          });
        }
      }
    },
    // 选中工单去向
    clickFinishGoWhere(bool) {
      if (bool) this.finishGoWhere = 0;
      else this.finishGoWhere = 1;
    },
    // 选中障碍类别
    selectBarrierCate(action) {
      if (action.value !== this.balkType) {
        // 是否修改故障类型
        this.$dialog
          .confirm({
            title: "您确认是否要修改故障类型？",
          })
          .then(() => {
            // 修改故障类型
            this.balkType = action.value;
            this.barrierCate = action.name;
            // 重置故障分类和故障原因
            this.faultCate = "用户侧原因";
            this.buwei = "600";
            this.faultReason = "用户自有设备问题";
            this.leibie = "601";
          })
          .catch(() => {
            // on cancel
          });
      }
    },
    // 选中故障分类
    selectFaultCate(action) {
      this.faultCate = action.name;
      this.buwei = action.value;
      if (this.buwei === "600") {
        // 用户侧原因
        this.faultReason = "用户自有设备问题";
        this.leibie = "601";
        this.faultReasonActions = [
          { name: "用户自有设备问题", value: "601" },
          { name: "用户侧其他问题", value: "602" },
          { name: "wifi信号覆盖问题造成视频感知差", value: "603" },
          { name: "申告网速慢但测速正常", value: "604" },
          { name: "查中自恢复", value: "605" },
          { name: "用户操作问题", value: "606" },
          { name: "户内线路故障", value: "607" },
          { name: "光猫类终端故障", value: "608" },
          { name: "路由器、交换设备故障", value: "610" },
          { name: "低端高载", value: "611" },
          { name: "路由器等能力不匹配", value: "612" },
        ];
      } else if (this.buwei === "650") {
        // 线路侧原因
        this.faultReason = "分光器/分纤盒以下光纤故障";
        this.leibie = "651";
        this.faultReasonActions = [
          { name: "分光器/分纤盒以下光纤故障", value: "651" },
          { name: "分光器/分纤盒故障", value: "652" },
          { name: "冷接故障", value: "653" },
          { name: "热熔接头故障", value: "654" },
          { name: "分光器及以下市政施工/供电故障", value: "655" },
          { name: "分光器以下割接改造", value: "656" },
          { name: "铜线/网线故障", value: "657" },
          { name: "主干光缆故障", value: "658" },
          { name: "分光器以上市政施工/供电故障", value: "659" },
          { name: "分光器以上割接改造", value: "660" },
          { name: "QLT以上线路故障", value: "661" },
        ];
      } else if (this.buwei === "700") {
        // 网络侧原因
        this.faultReason = "平台、支撑系统故障(非IPTV)";
        this.leibie = "702";
        this.faultReasonActions = [
          { name: "平台、支撑系统故障(IPTV)", value: "701" },
          { name: "平台、支撑系统故障(非IPTV)", value: "702" },
          { name: "IPTV节目源、网站服务器故障", value: "703" },
          { name: "QLT及以下网络设备故障", value: "704" },
          { name: "QLT以上网络设备故障", value: "705" },
        ];
      } else if (this.buwei === "800") {
        // 非网络质量原因
        this.faultReason = "欠费、业务咨询等非网络质量问题";
        this.leibie = "801";
        this.faultReasonActions = [
          { name: "欠费、业务咨询等非网络质量问题", value: "801" },
          { name: "非固网问题", value: "802" },
          { name: "其他运营商问题", value: "803" },
        ];
      }
    },
    // 选中故障原因
    selectFaultReason(action) {
      this.faultReason = action.name;
    },
    // 编辑外包材料
    editMaterials() {
      console.log("编辑外包材料");

      this.$router.push({
        name: "Materials",
        query: {
          orderNum: this.$route.query.orderNum,
        },
      });
    },
    // 获取外包材料-显示页面
    getMaterialInfo() {
      if (getItem("saveMaterialInfo")) {
        let MaterialInfo = getItem("saveMaterialInfo");
        let MaterialValues = Object.values(MaterialInfo);
        let MaterialNames = [
          "二芯室内线:米",
          "铁芯电话线(黑皮):米",
          "网线-五类线:米",
          "室内光皮线:米",
          "室外光皮线:米",
          "光纤尾纤:套",
          "冷接插头:个",
          "热熔插头:个",
          "水晶头:个",
          "光跳线:条",
        ];
        let str = "";
        MaterialValues.forEach((value, index) => {
          if (value !== "") {
            let name = MaterialNames[index].split(":")[0];
            let va = value;
            let unit = MaterialNames[index].split(":")[1];
            str += `[${name}:${va}${unit}]`;
          }
        });
        this.materialsInfo = str;
      }
    },
    // 是否需要绑定光纤尾码
    clickNeedFiber(bool) {
      if (bool) this.needFiberNo = 0;
      else this.needFiberNo = 1;
    },
    // 选中光纤不绑定原因
    selectNoBindingReason(action) {
      this.noBindingReasonName = action.name;
    },
    //需要绑定光纤尾码上传图片
    // 图片读取完成
    afterRead(file) {
      console.log("file", file);
    },
    // 选中超时原因
    selectOverTimeReason(action) {
      this.overTimeReason = action.name;
    },
    // 点击确定-跳转到签名页面
    skipSign() {
      // 判断rightAddress是否符合填写要求
      // 1.如果回单前参数rightAddress=1，并且“工单去向”选择为“回客服”时，需要验证标准地址输入框，不能为空，且长度大于5小于1000。
      if (this.rightAddress == 1 && this.finishGoWhere == 0) {
        if (this.inputRightAddress == "") {
          // 选择回客服时，标准地址为空，提示“选择回客服时，标准地址不能为空“
          return this.$dialog
            .alert({
              message: "选择回客服时，标准地址不能为空",
              getContainer: ".reply",
              className: "errorDialog",
            })
            .then(() => {
              // on close
            });
        } else {
          // 选择回客服时，标准地址不为空但长度不符合规则时，提示“标准地址长度需大于5小于1000 “
          if (
            this.inputRightAddress.length > 1000 ||
            this.inputRightAddress.length < 5
          ) {
            return this.$dialog
              .alert({
                message: "标准地址长度需大于5小于1000",
                getContainer: ".reply",
                className: "errorDialog",
              })
              .then(() => {
                // on close
              });
          }
        }
      }
      // 2.如果回单前参数rightAddress=1，并且“工单去向”选择为“工单中心”时，无需验证标准地址，但如果输入了，必须要符合长度大于5小于1000的规则。
      if (this.rightAddress == 1 && this.finishGoWhere == 1) {
        if (this.inputRightAddress.length > 0) {
          if (
            this.inputRightAddress.length > 1000 ||
            this.inputRightAddress.length < 5
          ) {
            return this.$dialog
              .alert({
                message:
                  "回工单中心时，标准地址无需填写，需要填写时长度需大于5小于1000",
                getContainer: ".reply",
                className: "errorDialog",
              })
              .then(() => {
                // on close
              });
          }
        }
      }
      let id = this.$route.query.id;
      let materialInfoItems = [getItem("saveMaterialInfo")];
      let useMaterial = 0; // 是否使用了外包材料（0：未使用，1：使用）
      let remark = this.repairExplain; // 修理情况说明
      let balkType = this.balkType; // 障碍类别
      let buwei = this.buwei; // 故障分类
      let leibie = this.leibie; // 故障原因
      let needFiberNo = this.needFiberNo; // 是否需要绑定光纤尾码
      let noBindingReason = this.noBindingReason; // 不需要回填光纤尾码的原因
      let noBingReamrk = this.noBingReamrk; // 不需要回填光纤尾码的说明
      let fiberNo = this.fiberNo; // 光纤尾码
      let photoIdList = this.photoIdList; // 光纤尾码照片在数据库的ID集合
      let finishGoWhere = this.finishGoWhere; // 回单去向（0：回客服，1：回工单中心）
      let ifmDeviceEvaluateList = this.devEvaluateResultList; // 设备评价好坏结果
      let fCDateTime = this.fCDateTime; // 复测时间
      let fCSpeed = this.fCSpeed; // 复测速率
      let fCType = this.fCType; // 复测方式
      let overTiemContent = this.overTiemContent; // 超时说明
      let overTimeReason = this.overTimeReason; // 超时原因
      let wifiQuality = this.wifiQuality; // wifi是否合格
      let wifiRate = this.wifiRate; // WIFI速率
      let wifiType = this.wifiType; // WIFI类型

      if (this.showFiber === true && needFiberNo === -1) {
        return this.$toast("请选择是否绑定光纤尾码");
      }

      let config = {
        balkContent: "",
        newOnuIptvItems: [], // 录入新设备信息
        reason: 0,
      };
      if (this.materialsInfo.length > 0) useMaterial = 1;

      let postData = {
        id,
        useMaterial,
        materialInfoItems,
        remark,
        balkType,
        buwei,
        leibie,
        needFiberNo,
        noBindingReason,
        noBingReamrk,
        fiberNo,
        photoIdList,
        finishGoWhere,
        ifmDeviceEvaluateList,
        fCDateTime,
        fCSpeed,
        fCType,
        overTiemContent,
        overTimeReason,
        wifiQuality,
        wifiRate,
        wifiType,
        ...config,
      };
      this.$router.push({
        name: "Signature",
        // 将接口参数传到签名页面
        params: {
          postData,
        },
        query: {
          id: this.$route.query.id,
          orderNum: this.$route.query.orderNum,
          isMustUploadPhoto: this.isMustUploadPhoto,
        },
      });
    },
  },
  created() {
    console.log("reply创建");
    // 获取回单前查询结果
    this.getFinishQuery();
  },
  activated() {
    // 获取外包材料
    this.getMaterialInfo();
    // 获取是否填写超时原因
    if (this.$route.params.overTimeShow) this.overTimeShow = true;
    console.log("reply激活");
  },
  deactivated() {
    console.log("reply失活");
  },
  beforeDestroy() {
    console.log("reply销毁");
    removeItem("saveMaterialInfo"); // 销毁
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "ListDetail") {
      this.$destroy();
    }
    next();
  },
};
</script>

<style scoped lang="less">
.reply {
  width: 100%;
  height: 100%;
  background-color: #f8f7fc;
  /deep/.errorDialog {
    .van-dialog__content {
      .van-dialog__message {
        text-align: left;
      }
    }
    .van-dialog__footer {
      padding: 10px;
      .van-button__content {
        width: 100px;
        margin: 0 auto;
        border-radius: 10px;
        background-color: #1989fa;
        color: #fff;
      }
    }
  }
  .main {
    width: 100%;
    height: 100%;
    background-color: #fff;
    .noService {
      width: 100%;
      display: inline-block;
      text-align: left;
      padding: 15px;
      color: red;
    }
    .materialsContent {
      padding: 10px;
      text-align: left;
      background-color: #fff;
      color: #969799;
    }
    .textRight {
      /deep/.van-cell__value.van-field__value {
        input {
          text-align: right;
        }
      }
    }
    .borderTop {
      border-top: 1px solid #e0e0e0;
    }
    .borderBottom {
      border-bottom: 1px solid #e0e0e0;
    }
    .inputRegion {
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
    .selectButton {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 45px;
      padding: 0 10px 0 16px;
      background-color: #fff;
      .title {
        display: flex;
        align-items: center;
        color: #646566;
        font-size: 14px;
      }
      .button {
        .van-button {
          width: 90px;
          height: 35px;
          padding: 5px;
          font-size: 13px;
        }
      }
    }
    .fiberNo {
      /deep/.van-cell__title.van-field__label {
        display: flex;
        align-items: center;
      }
      /deep/.van-cell__value.van-field__value {
        input {
          padding: 5px;
          border: 1px solid #e0e0e0;
        }
        .van-icon {
          font-size: 25px;
        }
      }
    }
    .uploadFiberImage {
      text-align: left;
      padding: 10px 16px;
      p,
      .upload {
        padding: 10px 0;
      }
    }
    .rightAddress {
      p {
        padding: 5px 16px;
        text-align: left;
        color: #1989fa;
        font-size: 12px;
      }
    }
    .speedErrorPop {
      width: 80%;
      border-radius: 20px;
      padding: 10px;
      font-size: 16px;
      text-align: left;
    }
  }
  .devEvaluatePop {
    width: 90%;
    height: 80%;
    table {
      width: 100%;
      th,
      td {
        padding: 10px;
      }
      tr {
        border-bottom: 1px solid #e0e0e0;
        td {
          .listInfo {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            font-size: 14px;
            background-color: #fff;
            .left {
              display: flex;
              .title {
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                top: 50%;
                transform: translateY(-50%);
                width: 50px;
                height: 50px;
                // line-height: 40px;
                background: #1989fa;
                color: #fff;
                border-radius: 25px;
                margin-right: 10px;
                font-size: 12px;
              }
              .content {
                display: flex;
                flex-direction: column;
                align-self: center;
                text-align: left;
                span {
                  white-space: nowrap;
                }
              }
            }
            .right {
              display: flex;
              flex-direction: column;
              text-align: right;
              .van-button {
                width: 90px;
                height: 40px;
                margin-bottom: 5px;
              }
            }
          }
        }
      }
    }
    .buttonRegion {
      display: flex;
      justify-content: space-around;
      padding: 10px;
      .van-button {
        width: 40%;
        border-radius: 10px;
      }
    }
  }
}
</style>