<template>
  <!-- 修机单-回复 -->
  <!-- 回复主页面 -->
  <div class="reply">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <!-- 工单去向 -->
      <div class="selectButton region" v-if="finishGoWhereIsTest">
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
      <div class="noService region" v-if="finishNoGoServiceRemark">
        <p>{{ finishNoGoServiceRemark }}</p>
      </div>
      <!-- speedError=1时 障碍类别和故障分类隐藏 -->
      <template v-if="speedError !== 1">
        <!-- 障碍类别 -->
        <div class="region">
          <van-field
            label="障碍类别"
            :value="barrierCate"
            @click="barrierCateShow = true"
            is-link
            arrow-direction="down"
            readonly
            class="textRight"
          />
          <van-action-sheet
            v-model="barrierCateShow"
            :actions="barrierCateActions"
            cancel-text="取消"
            close-on-click-action
            @select="selectBarrierCate"
          />
        </div>
        <!-- 故障分类 -->
        <div class="region">
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
        </div>
      </template>

      <!-- 故障原因 -->
      <div class="region">
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
      </div>

      <van-form @submit="skipSign">
        <!-- 外包材料 -->
        <div class="region">
          <van-field
            label="外包材料"
            is-link
            arrow-direction="down"
            v-model="materialsValue"
            placeholder="请编辑外包材料"
            readonly
            @click="editMaterials"
            class="textRight"
          />
          <!-- 选择的外包材料内容 -->
          <div class="materialsContent" v-show="materialsInfo.length > 0">
            {{ materialsInfo }}
          </div>
        </div>

        <!-- speedError=1 时显示复测和wifi -->
        <template v-if="speedError == 1">
          <!-- 复测时间 -->
          <div class="region">
            <van-field
              label="复测时间"
              is-link
              arrow-direction="down"
              v-model="fCDateTime"
              placeholder="请选择复测时间"
              readonly
              class="textRight"
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
          </div>
          <!-- 复测速率 -->
          <div class="region">
            <van-field
              v-model="fCSpeed"
              label="复测速率"
              placeholder="请输入复测速率（必填）"
              class="inputRegion"
            />
          </div>
          <!-- 复测方式 -->
          <div class="selectButton region">
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
          <div class="region">
            <van-field
              label="WIFI类型"
              :value="wifiTypeName"
              @click="wifiTypeShow = true"
              placeholder="请选择WIFI类型"
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
          <!-- WIFI类型不等于1时显示 -->
          <template v-if="wifiType !== 1 && wifiType !== -1">
            <!-- WIFI速率 -->
            <div class="region">
              <van-field
                v-model="wifiRate"
                label="WIFI速率"
                placeholder="请输入WIFI速率（必填）"
                class="inputRegion"
              />
            </div>
            <!-- WIFI是否合格 -->
            <div class="selectButton region">
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
          <div class="region">
            <van-field
              label="评价设备好坏"
              is-link
              arrow-direction="down"
              v-model="isDevEvaluate"
              placeholder="请评价设备好坏"
              readonly
              class="textRight"
              @click="devEvaluateShow = true"
            />
          </div>
        </template>

        <!-- ischangeIptv和ischangeOnu为false，并且故障原因选择光猫类终端故障时显示录入新设备按钮及设备信息 -->
        <div
          class="onuIptvList region"
          v-if="onuIptvShow && (leibie == '608' || leibie == '609')"
        >
          <p class="enterTitle">
            <span>共有{{ dealOnuIptvList.length }}条设备信息</span>
            <span class="enterInfo" @click="enterNewDev">[录入新设备]</span>
          </p>
          <div class="device">
            <template v-if="dealOnuIptvList.length > 0">
              <div
                class="listInfo"
                v-for="(item, index) in dealOnuIptvList"
                :key="index"
                @click="changeDev(item, index)"
              >
                <!-- 终端型号 -->
                <div class="title">
                  {{ index + 1 }}/{{ dealOnuIptvList.length }}
                </div>
                <div class="content">
                  <p>
                    <span class="left"
                      >终端厂商：{{ item.supplierName || "--" }}</span
                    >
                    <template>
                      <span v-if="item.resType == 1" class="right"
                        >终端类型：ONU</span
                      >
                      <span v-else-if="item.resType == 4" class="right"
                        >终端类型：IPTV</span
                      >
                    </template>
                  </p>
                  <span>终端串码：{{ item.sn }}</span>
                  <span>终端MAC：{{ item.mac }}</span>
                  <span>终端型号：{{ item.resModelName || "--" }}</span>
                </div>
                <!-- 更换角标 -->
                <template v-if="item.isChange == true">
                  <div class="changeFlag">
                    <span>
                      <em>更换</em>
                    </span>
                  </div>
                </template>
                <!-- 新增角标 -->
                <template v-if="item.isNewAdd == true">
                  <div class="changeFlag newFlag">
                    <span>
                      <em>新增</em>
                    </span>
                  </div>
                </template>
              </div>
            </template>
          </div>
        </div>

        <!-- 标准地址 -->
        <!-- rightAddress=1时，页面新增现实标准地址输入框和提示 -->
        <div class="rightAddress region" v-if="rightAddress == 1">
          <van-field
            v-model="inputRightAddress"
            label="标准地址"
            placeholder="请输入标准地址（回客服时必填）"
            class="inputRegion"
          />
          <p>用户标准地址不准确或为空，如需回客服请填写标准地址</p>
        </div>
        <!-- 修理情况说明 -->
        <div class="region">
          <van-field
            v-model="repairExplain"
            label="修理情况说明"
            placeholder="请输入修理情况说明（必填）"
            class="inputRegion"
          />
        </div>
        <!-- 显示绑定光纤尾码 -->
        <template v-if="showFiber">
          <!-- 绑定光纤尾码 -->
          <div class="selectButton region">
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
            <div class="region">
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
            </div>

            <!-- 无需绑定说明 -->
            <div class="region">
              <van-field
                v-model="noBingReamrk"
                label="无需绑定说明"
                placeholder="请输入无需绑定说明（必填）"
                class="inputRegion"
              />
            </div>
          </div>
          <!-- 需要 -->
          <div v-if="needFiberNo == 1">
            <!-- 光纤尾码 -->
            <div class="region">
              <van-field
                v-model="fiberNo"
                label="光纤尾码"
                right-icon="scan"
                class="fiberNo"
                placeholder="请输入光纤尾码（必填）"
              />
            </div>
            <!-- 上传图片 -->
            <div class="uploadFiberImage region">
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
          <div class="region">
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
          </div>

          <!-- 超时说明 -->
          <div class="region">
            <van-field
              v-model="overTiemContent"
              label="超时说明"
              placeholder="请输入超时说明（必填）"
              class="inputRegion"
            />
          </div>
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
        <div class="devEvaluate">
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
                  :type="
                    devEvaluateResultList[index].isBreak === 1 ? 'info' : ''
                  "
                  @click="clickDevEvaluateResult(index, true)"
                  native-type="button"
                  >好</van-button
                >
                <van-button
                  :type="
                    devEvaluateResultList[index].isBreak === 2 ? 'info' : ''
                  "
                  @click="clickDevEvaluateResult(index, false)"
                  native-type="button"
                  >不好</van-button
                >
              </td>
            </tr>
          </table>
        </div>
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
    <!-- 录入新设备弹出层 -->
    <van-popup v-model="enterOnuIptvPopShow">
      <div class="enterNewDev">
        <!-- 终端型号按钮 -->
        <div class="selectRegion">
          <van-button
            plain
            type="info"
            v-for="(item, index) in selectType"
            :key="index"
            :class="item.value == resType ? 'activeButton' : ''"
            >{{ item.name }}</van-button
          >
        </div>
        <!-- 扫描或录入区域 -->
        <!-- 录入新设备  可输入 -->
        <div class="scanRegion">
          <van-field
            v-model="ysSN"
            label="应收终端串码"
            right-icon="scan"
            placeholder="扫描或录入应收终端串码"
            v-if="isChange == false"
          />
          <van-field
            v-model="ysMAC"
            label="应收MAC地址"
            right-icon="scan"
            placeholder="扫描或录入应收MAC地址"
            v-if="isChange == false"
          />
          <!-- 更换 不可输入 -->
          <van-field
            v-model="changeSn"
            label="应收终端串码"
            right-icon="scan"
            placeholder="扫描或录入应收终端串码"
            v-if="isChange == true"
            readonly
          />
          <van-field
            v-model="changeMAC"
            label="应收MAC地址"
            right-icon="scan"
            placeholder="扫描或录入应收MAC地址"
            v-if="isChange == true"
            readonly
          />

          <van-field
            v-model="ssSN"
            label="实收终端串码"
            right-icon="scan"
            placeholder="扫描或录入实收终端串码"
          />
          <van-field
            v-model="ssMAC"
            label="实收MAC地址"
            right-icon="scan"
            placeholder="扫描或录入实收MAC地址"
          />
          <van-field
            v-model="newSN"
            label="新占用终端串码"
            right-icon="scan"
            placeholder="扫描或录入新占用终端串码"
          />
          <van-field
            v-model="newMAC"
            label="新占用MAC地址"
            right-icon="scan"
            placeholder="扫描或录入新占用MAC地址"
          />
        </div>
        <!-- 确认 取消 -->
        <div class="buttonRegion">
          <van-button type="info" @click="enterOnuIptvPopShow = false"
            >取消</van-button
          >
          <van-button type="danger" @click="deleteDev" v-if="devChanged"
            >删除</van-button
          >
          <van-button type="info" @click="confirmDev">确认</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getItem, removeItem } from "@/utils/public/sessionStorage";
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive";

export default {
  name: "RepairMachineFinish",
  mixins: [keepAliveMixin],
  data() {
    return {
      headName: `回复(${this.$route.query.orderNum})`,
      finishGoWhere: -1, // 工单去向（0：客服，1：工单中心）
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
      buwei: -1, // 传参-故障分类 默认-1
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
        // { name: "机顶盒类故障", value: "609" },
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
        { name: "FTTB铜线ADSLAGISDNPON+D", value: 1 },
        { name: "物业锁门", value: 2 },
        { name: "光分过高", value: 3 },
        { name: "无需上门", value: 4 },
        { name: "其他", value: 9 },
      ],
      noBingReamrk: "", //不需要回填光纤尾码的说明
      // 需要绑定
      fiberNo: "", // 光纤尾码
      photoIdList: [], // 光纤尾码照片在数据库的ID集合
      // 是否显示超时原因
      overTimeShow: false,
      overTimeReason: "", //超时原因
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
      wifiQuality: -1, // WIFI是否合格
      // 评价设备好坏
      ifmChangeInfoHisItem: [], // 回单前查询返回的
      isDevEvaluate: "", // 是否进行评价，评价完显示'已评价'
      devEvaluateShow: false, // 设备评价弹出框
      devEvaluateResultList: [], // 提交的设备评价结果 isBreak 1：好 2：坏
      ifmChangeInfoHisItem: [], // 设备评价弹出框内容
      // speedError 测速不达标弹框
      speedErrorShow: false,
      // 录入新设备时设备信息
      onuIptvList: [], // 原始返回的设备信息
      dealOnuIptvList: [], // 经过处理后显示的设备信息
      onuIptvShow: false,
      enterOnuIptvPopShow: false, // 录入设备弹出层
      // 弹出层终端型号
      selectType: [
        { name: "ONU", value: 1 },
        { name: "IPTV", value: 4 },
        // { name: "沃家产品", value: 6 },
      ],
      resType: 1, // 按钮-终端类型 1：ONU  4：IPTV  6：沃家产品
      isChange: true, // 确认点击的是已有设备还是录入新设备
      devChanged: false, // 点击的设备弹出层是否更换过
      changeIndex: -1, // 更换设备的下标
      // 弹出层展示的设备信息
      ysSN: "", // 应收终端串码
      ysMAC: "", // 应收MAC地址
      ssSN: "", // 实收终端串码
      ssMAC: "", // 实收MAC地址
      newSN: "", // 新占用终端串码
      newMAC: "", // 新占用MAC地址
      changeSn: "", // 点击已有设备显示的终端串码
      changeMAC: "", // 点击已有设备显示的mac地址
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
      this.$store.commit("removeThisPage", this.$options.name);
      this.$router.go(-1);
    },
    // 点击录入新设备
    enterNewDev() {
      // 去掉删除按钮
      if (this.devChanged) this.devChanged = false;
      // 先清空输入框内容
      this.ysSN = "";
      this.ysMAC = "";
      this.ssSN = "";
      this.ssMAC = "";
      this.newSN = "";
      this.newMAC = "";
      // 故障原因为机顶盒类故障 → 录入新设备为iptv
      // 故障原因为光猫类终端故障 → 录入新设备为onu
      if (this.leibie == "608") this.resType = 1;
      else if (this.leibie == "609") this.resType = 4;
      // 确认点击是新设备
      this.isChange = false;
      this.enterOnuIptvPopShow = true;
    },
    // 点击已有设备类型
    changeDev(item, index) {
      this.resType = item.resType;
      this.changeIndex = index;
      // 替换输入框内容
      this.ssSN = item.ssSN || "";
      this.ssMAC = item.ssMAC || "";
      this.newSN = item.newSN || "";
      this.newMAC = item.newMAC || "";

      // 判断点击的是否为新增设备
      if (item.isNewAdd) {
        this.ysSN = item.sn;
        this.ysMAC = item.mac;
      } else {
        // 记录更换的设备信息
        this.changeSn = item.sn;
        this.changeMAC = item.mac;
        // 标识当前弹框点击的是更换按钮
        this.isChange = true;
      }

      this.enterOnuIptvPopShow = true;
      // 记录当前弹出层是否显示删除按键
      this.devChanged = false;
      if (
        this.dealOnuIptvList[index].isChange ||
        this.dealOnuIptvList[index].isNewAdd
      )
        this.devChanged = true;
    },

    // 删除设备内容
    deleteDev() {
      // 判断删除的是更换内容还是新增的内容
      if (this.dealOnuIptvList[this.changeIndex]?.isNewAdd) {
        // 删除新增的整个设备
        this.dealOnuIptvList.splice(this.changeIndex, 1);
        this.devChanged = false; // 弹出层取消删除按钮
      } else {
        // 清空：ssSN,ssMAC,newSN,newMAC
        this.$set(this.dealOnuIptvList[this.changeIndex], "ssSN", "");
        this.$set(this.dealOnuIptvList[this.changeIndex], "ssMAC", "");
        this.$set(this.dealOnuIptvList[this.changeIndex], "newSN", "");
        this.$set(this.dealOnuIptvList[this.changeIndex], "newMAC", "");

        // 页面取消更换标识
        this.$set(this.dealOnuIptvList[this.changeIndex], "isChange", false);
      }
      // 关闭录入新设备/更换弹出层
      this.enterOnuIptvPopShow = false;
    },
    // 确认录入新设备/更换
    confirmDev() {
      // 判断点击的是更换还是录入新设备
      if (this.isChange) {
        // 更换
        this.ysSN = this.changeSn;
        this.ysMAC = this.changeMAC;
      }

      // 判断输入框值是否填写正确
      if (this.newSN.trim() === "" && this.newMAC.trim() === "") {
        return this.$toast("新占用终端串码和MAC地址不能同时为空!");
      }
      if (
        (this.ysSN === "" && this.ysMAC === "") ||
        (this.ssSN === "" && this.ssMAC === "")
      ) {
        return this.$toast("应收串码和MAC与实收串码和MAC不能同时为空");
      }
      if (this.newSN === this.ssSN || this.newSN === this.ysSN) {
        if (this.newSN !== "") {
          return this.$toast("新占用的串码不能与应收或实收的串码相同");
        }
      }
      if (this.newMAC === this.ssMAC || this.newMAC === this.ysMAC) {
        // 都为空的不算
        if (this.newMAC !== "") {
          return this.$toast("新占用的MAC不能与应收或实收的MAC相同");
        }
      }
      // 验证是否填写中文
      let str =
        this.ysSN +
        this.ysMAC +
        this.ssSN +
        this.ssMAC +
        this.newSN +
        this.newMAC;
      let regular = new RegExp("[\\u4E00-\\u9FFF]+", "g");
      if (regular.test(str)) {
        return this.$toast(
          "MAC地址或终端串码格式不正确，请重新扫码或手动填写!"
        );
      }
      // 关闭录入新设备/更换弹出层
      this.enterOnuIptvPopShow = false;
      if (this.isChange) {
        // 更换 可更改：ssSN,ssMAC,newSN,newMAC
        this.$set(
          this.dealOnuIptvList[this.changeIndex],
          "ssSN",
          this.ssSN.trim()
        );
        this.$set(
          this.dealOnuIptvList[this.changeIndex],
          "ssMAC",
          this.ssMAC.trim()
        );
        this.$set(
          this.dealOnuIptvList[this.changeIndex],
          "newSN",
          this.newSN.trim()
        );
        this.$set(
          this.dealOnuIptvList[this.changeIndex],
          "newMAC",
          this.newMAC.trim()
        );

        // 页面显示更换标识
        this.$set(this.dealOnuIptvList[this.changeIndex], "isChange", true);
      } else {
        // 录入新设备
        // 1.判断是否有新增标识 有 → 修改输入框内容 无 → dealOnuIptvList追加一条
        if (this.dealOnuIptvList[this.changeIndex]?.isNewAdd) {
          this.$set(
            this.dealOnuIptvList[this.changeIndex],
            "sn",
            this.ysSN.trim()
          );
          this.$set(
            this.dealOnuIptvList[this.changeIndex],
            "mac",
            this.ysMAC.trim()
          );

          this.$set(
            this.dealOnuIptvList[this.changeIndex],
            "ssSN",
            this.ssSN.trim()
          );
          this.$set(
            this.dealOnuIptvList[this.changeIndex],
            "ssMAC",
            this.ssMAC.trim()
          );
          this.$set(
            this.dealOnuIptvList[this.changeIndex],
            "newSN",
            this.newSN.trim()
          );
          this.$set(
            this.dealOnuIptvList[this.changeIndex],
            "newMAC",
            this.newMAC.trim()
          );
        } else {
          let obj = {};
          obj.sn = this.ysSN.trim();
          obj.mac = this.ysMAC.trim();
          obj.ssSN = this.ssSN.trim();
          obj.ssMAC = this.ssMAC.trim();
          obj.newSN = this.newSN.trim();
          obj.newMAC = this.newMAC.trim();
          obj.resType = this.resType;
          // 存入新增标识
          obj.isNewAdd = true;
          this.dealOnuIptvList.push(obj);
        }
      }
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
      if (this.wifiType == 1) {
        //wifi类型选择“无wifi”时 → WIFI速率不显示，wifiRate取“” ；隐藏“wifi是否合格”
        this.wifiRate = "";
        this.wifiQuality = -1;
      } else {
        // 显示wifi是否合格，默认选是
        this.wifiQuality = 1;
      }
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
      this.apiResponse(result, ".reply", () => {
        // 展示评价设备好坏
        this.ifmChangeInfoHisItem = result.ifmChangeInfoHisItem;
        // 获取设备信息
        this.onuIptvList = result.onuIptvList;
        // ischangeIptv为false并且ischangeOnu为false时，显示设备信息
        if (!result.ischangeIptv && !result.ischangeOnu)
          this.onuIptvShow = true;
        // 是否显示工单去向
        this.finishGoWhereIsTest = result.finishGoWhereIsTest;
        if (this.finishGoWhereIsTest) this.finishGoWhere = 1;
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
        // 障碍类型未显示时 balkType取-1；
        if (this.speedError !== 1) {
          // 障碍类别显示时
          this.balkType = result.piaType;
          // 故障分类显示时
          this.buwei = "600";
        }
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
      });
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
            getContainer: ".reply",
            className: "confirmDialog",
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
      // 障碍类别选择iptv时故障原因才有机顶盒选项
      if (action.value == 6) {
        this.faultReasonActions = [
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
        ];
      } else {
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
      this.leibie = action.value;
      // resType 1：ONU  4：IPTV  6：沃家产品
      if (this.onuIptvShow) {
        // 清空
        this.dealOnuIptvList.splice(0, this.dealOnuIptvList.length);
        if (this.leibie == "608") {
          // 故障原因为光猫类终端故障(608)则设备信息只显示onu
          this.onuIptvList.forEach((onu) => {
            if (onu.resType == 1) {
              this.dealOnuIptvList.push(onu);
            }
          });
        } else if (this.leibie == "609") {
          // 故障原因为机顶盒类故障(609)则设备信息只显示iptv
          this.onuIptvList.forEach((iptv) => {
            if (iptv.resType == 4) {
              this.dealOnuIptvList.push(iptv);
            }
          });
        }
      }
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
      if (bool) {
        // 不需要 → 清空光纤尾码和上传图片
        this.needFiberNo = 0;
        this.noBindingReason = 1;
        this.fiberNo = "";
        this.photoIdList = [];
      } else {
        // 需要 → 清空不绑定原因和无需绑定说明
        this.needFiberNo = 1;
        this.noBindingReason = -1;
        this.noBingReamrk = "";
      }
    },
    // 选中光纤不绑定原因
    selectNoBindingReason(action) {
      this.noBindingReasonName = action.name;
      this.noBindingReason = action.value;
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
            this.inputRightAddress.length >= 1000 ||
            this.inputRightAddress.length <= 5
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
            this.inputRightAddress.length <= 5
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
      // 表单验证
      if (this.materialsValue == "") return this.$toast("请编辑外包材料");
      if (this.repairExplain == "") return this.$toast("请输入修理情况说明");
      if (this.speedError == 1) {
        if (this.fCDateTime == "") return this.$toast("请选择复测时间");
        if (this.fCSpeed == "") return this.$toast("请输入复测速率");
        if (this.wifiTypeName == "") return this.$toast("请选择WIFI类型");
        if (this.wifiType !== 1 && this.wifiType !== -1) {
          if (this.wifiRate == "") return this.$toast("请输入WIFI速率");
        }
      }
      if (this.ifmChangeInfoHisItem.length > 0) {
        if (this.isDevEvaluate == "") return this.$toast("请评价设备好坏");
      }
      if (this.overTimeShow && this.overTiemContent == "")
        return this.$toast("请输入超时说明");
      if (this.showFiber) {
        if (this.needFiberNo == 0 && this.noBingReamrk == "")
          return this.$toast("请输入无需绑定说明");
        if (this.needFiberNo == 1 && this.fiberNo == "")
          return this.$toast("请输入光纤尾码");
      }

      if (this.showFiber === true && this.needFiberNo === -1) {
        return this.$toast("请选择是否绑定光纤尾码");
      }

      let id = parseInt(this.$route.query.id);
      let materialInfoItems = [getItem("saveMaterialInfo")];
      let useMaterial = 0; // 是否使用了外包材料（0：未使用，1：使用）
      let remark = this.repairExplain; // 修理情况说明
      let balkType = this.balkType; // 障碍类别
      let buwei = parseInt(this.buwei); // 故障分类
      let leibie = parseInt(this.leibie); // 故障原因
      let needFiberNo = this.needFiberNo; // 是否需要绑定光纤尾码
      let noBindingReason = this.noBindingReason; // 不需要回填光纤尾码的原因
      let noBingReamrk = this.noBingReamrk; // 不需要回填光纤尾码的说明
      let fiberNo = this.fiberNo; // 光纤尾码
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
      let rightAddress = this.rightAddress; // 标准地址是否有误
      let inputRightAddress = this.inputRightAddress; // 手工输入标准地址内容

      // 将设备信息转换成提交的格式
      let newOnuIptvItems = [];
      this.dealOnuIptvList.forEach((item) => {
        let obj = {};
        obj.resType = item.resType;
        obj.seq = item.devSeq.toString() || "";
        obj.oldSeq = "";
        obj.ysSN = item.sn;
        obj.ysMAC = item.mac;
        obj.ssSN = item.ssSN || "";
        obj.ssMAC = item.ssMAC || "";
        obj.newSN = item.newSN || "";
        obj.newMAC = item.newMAC || "";
        newOnuIptvItems.push(obj);
      });
      let config = {
        balkContent: "",
        newOnuIptvItems, // 设备信息
        reason: 0,
      };
      if (this.materialsInfo.length > 0) useMaterial = 1;
      // 将光纤尾码照片放入vuex
      this.$store.commit("button/changeFinishPhotoIdList", this.photoIdList);

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
        rightAddress,
        inputRightAddress,
        ...config,
      };

      postData = JSON.stringify(postData);

      this.$router.push({
        name: "Signature",
        // 将接口参数传到签名页面
        query: {
          id: this.$route.query.id,
          orderNum: this.$route.query.orderNum,
          isMustUploadPhoto: this.isMustUploadPhoto,
          postData,
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
    if (this.$route.query.overTimeShow) {
      this.overTimeShow = true;
      this.overTimeReason = "用户地址不详";
    }
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
  min-height: 100%;
  background-color: @bg-color;
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
    .noService {
      width: 100%;
      text-align: left;
      color: red;
      p {
        padding: 10px;
      }
    }
    .materialsContent {
      padding: 10px;
      text-align: left;
      background-color: #fff;
      color: #969799;
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
        color: #000;
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
    .devEvaluate {
      height: 88%;
      overflow-y: auto;
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

  .onuIptvList {
    font-size: 14px;
    .enterTitle {
      display: flex;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
      .enterInfo {
        color: red;
      }
    }
    .device {
      .listInfo {
        position: relative;
        display: flex;
        align-items: center;
        padding: 10px;
        background-color: #fff;
        border-bottom: 1px solid #e0e0e0;
        font-size: 12px;
        .title {
          width: 40px;
          height: 40px;
          line-height: 40px;
          background: #1989fa;
          color: #fff;
          border-radius: 20px;
          margin-right: 10px;
        }
        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-self: center;
          text-align: left;
          p {
            display: flex;
            justify-content: space-between;
            .right {
              color: red;
            }
          }
          span {
            white-space: nowrap;
          }
        }
        .changeFlag {
          position: absolute;
          right: 0;
          bottom: 0;
          height: 40px;
          width: 40px;
          span {
            position: absolute;
            top: 0;
            right: 0;
            width: 0;
            height: 0;
            border-bottom: 40px solid @theme-color;
            border-left: 40px solid transparent;
            em {
              position: absolute;
              top: 16px;
              right: 0;
              color: #fff;
              font-size: 12px;
              font-family: Microsoft YaHei;
              white-space: nowrap;
              transform: rotate(315deg);
              -webkit-transform: rotate(315deg);
            }
          }
        }
        .newFlag {
          span {
            border-bottom: 40px solid #4bd181;
          }
        }
      }
    }
  }

  .van-popup {
    .enterNewDev {
      .selectRegion {
        display: flex;
        justify-content: center;
        padding: 10px;
        .van-button {
          width: 100px;
        }
        .activeButton {
          background-color: #1989fa;
          color: #fff;
        }
      }
      .scanRegion {
        /deep/.van-cell__title.van-field__label {
          padding: 5px 0;
          width: 100px;
          white-space: nowrap;
        }
        /deep/.van-cell__value.van-field__value {
          width: 200px;
          input {
            padding: 5px;
            font-size: 12px;
            border: 1px solid #e0e0e0;
          }
          .van-icon {
            font-size: 25px;
          }
        }
      }
      .buttonRegion {
        display: flex;
        justify-content: space-around;
        padding: 10px;
        .van-button {
          width: 30%;
        }
      }
    }
  }
}
</style>