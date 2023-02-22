<template>
  <div class="ifmFinish">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <template v-if="hasWorkType == false">
        <!-- 已将下级小交回复内容填充 -->
        <div class="xiaoJiaoFill" v-if="xiaoJiaoFillShow">
          已将下级小交回复内容填充
        </div>
        <!-- 是否误报 -->
        <div class="region" v-if="balkSubSortId == 49">
          <div class="selectButton">
            <span class="title">是否误报</span>
            <div class="button">
              <van-button
                :type="isFalseAlarm === '1' ? 'info' : ''"
                @click="clickIsFalseAlarm(true)"
                native-type="button"
                >是</van-button
              >
              <van-button
                :type="isFalseAlarm === '2' ? 'info' : ''"
                @click="clickIsFalseAlarm(false)"
                native-type="button"
                >否</van-button
              >
            </div>
          </div>
        </div>
        <!-- 故障主处理部门 -->
        <div class="region" v-if="mainDeptShow">
          <div class="selectButton">
            <span class="title">故障主处理部门</span>
            <div class="button">
              <van-button
                :type="isMainDept === '1' ? 'info' : ''"
                @click="clickIsMainDept(true)"
                native-type="button"
                >是</van-button
              >
              <van-button
                :type="isMainDept === '2' ? 'info' : ''"
                @click="clickIsMainDept(false)"
                native-type="button"
                >否</van-button
              >
            </div>
          </div>
        </div>
        <!-- 铁塔是否按时上站 -->
        <div class="region" v-if="ttStation == 2 && mainDeptShow">
          <div class="selectButton">
            <span class="title">铁塔是否按时上站</span>
            <div class="button">
              <van-button
                :type="ttGoSiteOnTime === '1' ? 'info' : ''"
                @click="clickTtGoSiteOnTime(true)"
                native-type="button"
                >是</van-button
              >
              <van-button
                :type="ttGoSiteOnTime === '0' ? 'info' : ''"
                @click="clickTtGoSiteOnTime(false)"
                native-type="button"
                >否</van-button
              >
            </div>
          </div>
        </div>
        <!-- 故障主处理部门选择是-显示 -->
        <template v-if="isMainDept == '1'">
          <div class="region">
            <!-- 故障恢复时间 -->
            <DateTimePicker
              label="故障恢复时间："
              placeholder="请选择故障恢复时间（必填）"
              type="3"
              @getExcludeTime="getExcludeTime"
            />
          </div>
          <!-- 故障原因 -->
          <div class="region">
            <van-field
              label="故障原因："
              :value="faultReasonLevel1Name"
              @click="faultReasonLevel1Show = true"
              placeholder="请选择故障原因"
              is-link
              arrow-direction="down"
              readonly
              class="textRight"
            />
            <van-action-sheet
              v-model="faultReasonLevel1Show"
              :actions="faultReasonLevel1Actions"
              cancel-text="取消"
              close-on-click-action
              @select="selectFaultReasonLevel1"
            />
          </div>
          <!-- 子故障原因 -->
          <div class="region">
            <van-field
              label="子故障原因："
              :value="faultReasonLevel2Name"
              @click="faultReasonLevel2Show = true"
              placeholder="请选择子故障原因"
              is-link
              arrow-direction="down"
              readonly
              class="textRight"
              v-if="faultReasonLevel2Actions.length > 0"
            />
            <van-action-sheet
              v-model="faultReasonLevel2Show"
              :actions="faultReasonLevel2Actions"
              cancel-text="取消"
              close-on-click-action
              @select="selectFaultReasonLevel2"
            />
          </div>
          <!-- 子故障原因 -->
          <div class="region">
            <van-field
              label="子故障原因："
              :value="faultReasonLevel3Name"
              @click="faultReasonLevel3Show = true"
              placeholder="请选择子故障原因"
              is-link
              arrow-direction="down"
              readonly
              class="textRight"
              v-if="faultReasonLevel3Actions.length > 0"
            />
            <van-action-sheet
              v-model="faultReasonLevel3Show"
              :actions="faultReasonLevel3Actions"
              cancel-text="取消"
              close-on-click-action
              @select="selectFaultReasonLevel3"
            />
          </div>
        </template>
        <!-- 是否需要分公司配合 -->
        <div class="region" v-if="showFgsCoordinate == 1">
          <div class="selectButton">
            <span class="title">是否需要分公司配合：</span>
            <div class="button">
              <van-button
                :type="fgsCoordinate === 1 ? 'info' : ''"
                @click="clickFgsCoordinate(true)"
                native-type="button"
                >是</van-button
              >
              <van-button
                :type="fgsCoordinate === 0 ? 'info' : ''"
                @click="clickFgsCoordinate(false)"
                native-type="button"
                >否</van-button
              >
            </div>
          </div>
        </div>
        <!-- 分公司是否按时配合 -->
        <div class="region" v-if="fgsCoordinate === 1">
          <div class="selectButton">
            <span class="title">分公司是否按时配合</span>
            <div class="button">
              <van-button
                :type="fgsCoordinateOnTime === 1 ? 'info' : ''"
                @click="clickFgsCoordinateOnTime(true)"
                native-type="button"
                >是</van-button
              >
              <van-button
                :type="fgsCoordinateOnTime === 0 ? 'info' : ''"
                @click="clickFgsCoordinateOnTime(false)"
                native-type="button"
                >否</van-button
              >
            </div>
          </div>
        </div>
        <!-- 故障已修，提交故障起单部门审核： -->
        <div class="region" v-if="returnDWJ == 1">
          <div class="selectButton">
            <span class="title">故障已修，提交故障起单部门审核：</span>
            <div class="button">
              <van-button
                :type="returnTop === '1' ? 'info' : ''"
                @click="clickReturnTop(true)"
                native-type="button"
                >是</van-button
              >
              <van-button
                :type="returnTop === '2' ? 'info' : ''"
                @click="clickReturnTop(false)"
                native-type="button"
                >否</van-button
              >
            </div>
          </div>
        </div>
        <!-- 排障反馈方 -->
        <div
          class="region"
          v-if="
            balkSubSortId20Show || balkSubSortId21Show || balkSubSortId22Show
          "
        >
          <van-field
            v-model="faultFeedback"
            label="排障反馈方："
            placeholder="请输入排障反馈方（选填）"
            class="inputRegion"
          />
        </div>
        <!-- 排障反馈详情 -->
        <div
          class="region"
          v-if="
            balkSubSortId20Show || balkSubSortId21Show || balkSubSortId22Show
          "
        >
          <van-field
            v-model="faultFeedbackInfo"
            label="排障反馈详情："
            placeholder="请输入排障反馈详情（选填）"
            class="inputRegion"
          />
        </div>
        <!-- 处理时间 -->
        <div
          class="region"
          v-if="
            balkSubSortId20Show || balkSubSortId21Show || balkSubSortId22Show
          "
        >
          <DateTimePicker
            label="处理时间："
            placeholder="请选择处理时间"
            type="1"
            @getDealDate="getDealDate"
          />
        </div>
        <!-- 联系电话 -->
        <div class="region" v-if="balkSubSortId20Show || balkSubSortId21Show">
          <van-field
            v-model="linkTel"
            label="联系电话："
            placeholder="请输入联系电话（选填）"
            class="inputRegion"
          />
        </div>
        <!-- 排障结果验证厂家 -->
        <div class="region" v-if="balkSubSortId21Show">
          <van-field
            v-model="dealResultFactory"
            label="排障结果验证厂家："
            placeholder="请输入排障结果验证厂家（选填）"
            class="inputRegion"
          />
        </div>
        <!-- 问题验证结果 -->
        <div
          class="region"
          v-if="balkSubSortId21Show || balkSubSortId22ShowResult"
        >
          <van-field
            v-model="verificationResult"
            label="问题验证结果："
            placeholder="请输入问题验证结果（选填）"
            class="inputRegion"
          />
        </div>
        <!-- 验证日期 -->
        <div class="region" v-if="balkSubSortId21Show">
          <!-- <van-field
            v-model="verificationDate"
            label="验证日期："
            placeholder="请输入验证日期（选填）"
            class="inputRegion"
          /> -->
          <DateTimePicker
            label="验证日期："
            placeholder="请选择验证日期"
            type="2"
            @getVerificationDate="getVerificationDate"
          />
        </div>
        <!-- 遗留问题 -->
        <div class="region" v-if="balkSubSortId21Show">
          <van-field
            v-model="legacyl"
            label="遗留问题："
            placeholder="请输入遗留问题（选填）"
            class="inputRegion"
          />
        </div>
        <!-- 验证人员 -->
        <div class="region" v-if="balkSubSortId21Show">
          <van-field
            v-model="verificationMan"
            label="验证人员："
            placeholder="请输入验证人员（选填）"
            class="inputRegion"
          />
        </div>
        <!-- 验证人员联系电话 -->
        <div class="region" v-if="balkSubSortId21Show">
          <van-field
            v-model="verificationManTel"
            label="联系电话："
            placeholder="请输入验证人员联系电话（选填）"
            class="inputRegion"
          />
        </div>
        <!-- 验证厂家备注 -->
        <div class="region" v-if="balkSubSortId21Show">
          <van-field
            v-model="verificationFactoryRemark"
            label="验证厂家备注："
            placeholder="请输入验证厂家备注（选填）"
            class="inputRegion"
          />
        </div>
        <!-- 备注 -->
        <div class="region" v-if="balkSubSortId21Show">
          <van-field
            v-model="remark"
            label="备注："
            placeholder="请输入备注（选填）"
            class="inputRegion"
          />
        </div>
        <!-- 是否多次换盘 -->
        <!-- 换盘显示条件：balkSubSortId == 2 && originDeptId == 5962 -->
        <div class="region" v-if="balkSubSortId == 2 && originDeptId == 5962">
          <div class="selectButton">
            <span class="title">是否多次换盘：</span>
            <div class="button">
              <van-button
                :type="huanPan === '1' ? 'info' : ''"
                @click="clickHuanPan(true)"
                native-type="button"
                >是</van-button
              >
              <van-button
                :type="huanPan === '2' ? 'info' : ''"
                @click="clickHuanPan(false)"
                native-type="button"
                >否</van-button
              >
            </div>
          </div>
        </div>
        <!-- isXiaoJiao控制显示 -->
        <template v-if="isXiaoJiao">
          <!-- 现场维修人员 -->
          <div class="region">
            <van-field
              v-model="xiaoJiaoServiceMan"
              label="现场维修人员："
              placeholder="请输入现场维修人员（必填）"
              class="inputRegion"
            />
          </div>
          <!-- 小交品牌 -->
          <div class="region">
            <van-field
              label="小交品牌："
              :value="xiaoJiaoBrandName"
              @click="xiaoJiaoBrandShow = true"
              placeholder="请选择小交品牌"
              is-link
              arrow-direction="down"
              readonly
              class="textRight"
            />
            <van-action-sheet
              v-model="xiaoJiaoBrandShow"
              :actions="xiaoJiaoBrandActions"
              cancel-text="取消"
              close-on-click-action
              @select="selectXiaoJiaoBrand"
            />
          </div>
          <!-- 故障原因类型 -->
          <div class="region">
            <van-field
              label="故障原因类型："
              :value="xiaoJiaoBalkReasonTypeName"
              @click="xiaoJiaoBalkReasonTypeShow = true"
              placeholder="请选择故障原因类型"
              is-link
              arrow-direction="down"
              readonly
              class="textRight"
            />
            <van-action-sheet
              v-model="xiaoJiaoBalkReasonTypeShow"
              :actions="xiaoJiaoBalkReasonTypeActions"
              cancel-text="取消"
              close-on-click-action
              @select="selectXiaoJiaoBalkReasonType"
            />
          </div>
          <!-- 故障原因 -->
          <div class="region">
            <van-field
              v-model="xiaoJiaoBalkReason"
              label="故障原因："
              placeholder="请输入故障原因（必填）"
              class="inputRegion"
            />
          </div>
          <!-- 处理方式 -->
          <div class="region">
            <van-field
              v-model="xiaoJiaoProcMode"
              label="处理方式："
              placeholder="请输入处理方式（必填）"
              class="inputRegion"
            />
          </div>
          <!-- 故障等级 -->
          <div class="region">
            <van-field
              label="故障等级："
              :value="xiaoJiaoBalkGradeName"
              @click="xiaoJiaoBalkGradeShow = true"
              placeholder="请选择故障等级"
              is-link
              arrow-direction="down"
              readonly
              class="textRight"
            />
            <van-action-sheet
              v-model="xiaoJiaoBalkGradeShow"
              :actions="xiaoJiaoBalkGradeActions"
              cancel-text="取消"
              close-on-click-action
              @select="selectXiaoJiaoBalkGrade"
            />
          </div>
          <!-- 是否更换硬件 -->
          <div class="region">
            <div class="selectButton">
              <span class="title">是否更换硬件：</span>
              <div class="button">
                <van-button
                  :type="isChangeHardware === 1 ? 'info' : ''"
                  @click="clickIsChangeHardware(true)"
                  native-type="button"
                  >是</van-button
                >
                <van-button
                  :type="isChangeHardware === 0 ? 'info' : ''"
                  @click="clickIsChangeHardware(false)"
                  native-type="button"
                  >否</van-button
                >
                <van-button
                  type="info"
                  class="addHardWare"
                  @click="addHardWare"
                  v-if="isChangeHardware == 1"
                  >新增硬件</van-button
                >
              </div>
            </div>
            <!-- 更换硬件信息展示 -->
            <div class="changeHardwareList" v-if="isChangeHardware == 1">
              <div
                class="changeHardwareInfo"
                v-for="(item, index) in changeHardwareInfos"
                :key="index"
              >
                <div class="left">
                  <span>类型：{{ item.changeHardwareType }}</span>
                  <span>型号：{{ item.changeHardwareVersion }}</span>
                </div>
                <div class="right">
                  <span>数量：{{ item.changeHardwareNumber }}</span>
                  <van-button type="danger" @click="deleteChangeHardware(index)"
                    >删除</van-button
                  >
                </div>
              </div>
            </div>
          </div>
          <!-- 约定到达时间 -->
          <div class="region">
            <DateTimePicker
              label="约定到达时间："
              placeholder="请选择约定到达时间"
              type="4"
              @getXiaoJiaoReserveArrayTime="getXiaoJiaoReserveArrayTime"
            />
          </div>
          <!-- 实际到达时间 -->
          <div class="region">
            <DateTimePicker
              label="实际到达时间："
              placeholder="请选择实际到达时间"
              type="5"
              @getXiaoJiaoRealityArrayTime="getXiaoJiaoRealityArrayTime"
            />
          </div>
        </template>
      </template>
      <template v-else>
        <!-- 解决方案一 -->
        <div class="region">
          <van-field
            label="解决方案一："
            :value="solution1Name"
            @click="solution1Show = true"
            placeholder="请选择解决方案一"
            is-link
            arrow-direction="down"
            readonly
            class="textRight"
            v-if="solution1Actions.length > 0"
          />
          <van-action-sheet
            v-model="solution1Show"
            :actions="solution1Actions"
            cancel-text="取消"
            close-on-click-action
            @select="selectSolution1"
          />
        </div>
        <!-- 解决方案二 -->
        <div class="region">
          <van-field
            label="解决方案二："
            :value="solution2Name"
            @click="solution2Show = true"
            placeholder="请选择解决方案二"
            is-link
            arrow-direction="down"
            readonly
            class="textRight"
            v-if="solution2Actions.length > 0"
          />
          <van-action-sheet
            v-model="solution2Show"
            :actions="solution2Actions"
            cancel-text="取消"
            close-on-click-action
            @select="selectSolution2"
          />
        </div>
        <!-- 基站当前载波情況 -->
        <!-- workType为5008时且解决方案一为解决闭环(id=1)时显示基站当前載波情況选择区域 -->
        <div class="region" v-if="workType == 5008 && solution1 == 1">
          <van-field
            label="基站当前载波情況"
            :value="carrierName"
            @click="carrierShow = true"
            placeholder="请选择基站当前载波情況"
            is-link
            arrow-direction="down"
            readonly
            class="textRight"
          />
          <van-action-sheet
            v-model="carrierShow"
            :actions="carrierActions"
            cancel-text="取消"
            close-on-click-action
            @select="selectCarrier"
          />
        </div>
        <!-- 基站忙时PRB利用率 -->
        <!-- workType为5008时且解决方案一为解决闭环(id=1)或其他手段解决闭环(id=2)时显示该参数填写区域 -->
        <div
          class="region"
          v-if="workType == 5008 && (solution1 == 1 || solution1 == 2)"
        >
          <van-field
            v-model="prb"
            label="基站忙时PRB利用率："
            placeholder="请输入基站忙时PRB利用率（必填）"
            class="inputRegion"
          />
        </div>
        <!-- 基站指标情况 -->
        <!-- workType=5011时，“解决方案一”为“解决闭环(id=12)”时，显示“基站指标情况” -->
        <div class="region" v-if="workType == 5011 && solution1 == 12">
          <van-field
            v-model="baseStationStatus"
            label="基站指标情况："
            placeholder="请输入基站指标情况（必填）"
            class="inputRegion"
          />
        </div>
        <!-- 复建站点名称 -->
        <!-- workType=5012时，“解决方案一”为“解决闭环(id=15)”时，显示“复建站点名称”，显示“复建站点入网时间” -->
        <div class="region" v-if="workType == 5012 && solution1 == 15">
          <van-field
            v-model="rbBaseStationName"
            label="复建站点名称："
            placeholder="请输入复建站点名称（必填）"
            class="inputRegion"
          />
        </div>
        <!-- 复建站点入网时间 -->
        <div class="region" v-if="workType == 5012 && solution1 == 15">
          <DateTimePicker
            label="复建站点入网时间："
            placeholder="请选择复建站点入网时间"
            type="6"
            @getRbBaseStationEnterTime="getRbBaseStationEnterTime"
          />
        </div>
      </template>
      <!-- 超时原因 -->
      <div class="region" v-if="overTimeShow">
        <van-field
          label="超时原因："
          :value="overTimeReason"
          @click="overTimeReasonShow = true"
          placeholder="请选择超时原因"
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
      <div class="region" v-if="overTimeShow">
        <van-field
          v-model="overTimeIntro"
          label="超时说明："
          placeholder="请输入超时说明（必填）"
          class="inputRegion"
        />
      </div>
      <!-- 回复信息 -->
      <div class="region">
        <van-field
          v-model="finishInfo"
          label="回复信息："
          placeholder="请输入回复信息（必填）"
          class="inputRegion"
        />
      </div>
      <!-- 上传照片 -->
      <div class="region" v-if="hasWorkType == false">
        <div class="upload">
          <p>上传照片（最多5张照片）</p>
          <van-uploader
            v-model="imgList"
            multiple
            :max-count="5"
            :after-read="afterRead"
          >
            <van-button icon="plus" type="default"></van-button>
          </van-uploader>
        </div>
      </div>
      <!-- 上传证据 -->
      <div class="region" v-if="uploadProof">
        <div class="title">上传证据（最多上传五个证据）</div>
        <div class="upload" v-if="uploadProof1">
          <p>{{ proof1 }}</p>
          <div class="uploadRecord">+</div>
        </div>
        <div class="upload" v-if="uploadProof2">
          <p>{{ proof2 }}</p>
          <van-uploader v-model="imgList" multiple :max-count="5">
            <van-button type="default" class="uploadRecord">+</van-button>
          </van-uploader>
        </div>
      </div>
    </div>
    <!-- 弹出层区域 -->
    <van-popup v-model="addHardWarePopShow" class="popRegion">
      <h3>更换硬件</h3>
      <div class="addHardWarePop">
        <van-field
          v-model="changeHardwareType"
          label="类型"
          class="inputRegion"
        />
        <van-field
          v-model="changeHardwareVersion"
          label="型号"
          class="inputRegion"
        />
        <van-field
          v-model="changeHardwareNumber"
          type="digit"
          label="数量"
          class="inputRegion"
        />
      </div>

      <div class="buttonRegion">
        <van-button type="info" @click="cancelAddHardWarePop">取消</van-button>
        <van-button type="info" @click="confirmAddHardWarePop">确认</van-button>
      </div>
    </van-popup>
    <div class="submitButton">
      <van-button type="info" block round @click="receiptCheck"
        >确定</van-button
      >
    </div>
  </div>
</template>

<script>
import {
  reqFinishQuery,
  reqifmFinish,
  reqFinishQueryByTask,
} from "@/http/button";
import { mapState } from "vuex";
import url from "@/http/img";
import { getItem } from "@/utils/public/sessionStorage";
import axios from "axios";
import DateTimePicker from "./components/dateTimePicker.vue";

export default {
  name: "Ifminish",
  components: { DateTimePicker },
  data() {
    return {
      id: -1, // 工单唯一标识
      headName: `回复(${this.$route.query.orderId})`,
      workType: parseInt(this.$route.query.workType), // listDetail传过来的
      hasWorkType: false, // workType是否包含基站扩容那些，控制页面元素显示
      xiaoJiaoFillShow: false, // 显示 已将下级小交回复内容填充
      uploadProof: false, // 是否显示上传证据元素
      uploadProof1: false,
      uploadProof2: false,
      proof1: "", // 证据1提示文字
      proof2: "", // 证据2提示文字
      // 回复前查询
      // isXiaoJiao: 0 否 1 是（显示现场维修人员，小交品牌，故障原因类型，故障原因，处理方式，故障等级，是否更换硬件（选择是新增硬件），约定到达时间，实际到达时间）
      isXiaoJiao: 0,
      returnDWJ: -1, // 判断是否直接回复大网监 0：否，1：是（显示故障已修，提交故障起单部门审核）
      showFgsCoordinate: -1, // 显示是否需分公司配合选项
      ttStation: -1, // 2：显示铁塔是否按时上站按钮
      mainDeptShow: false, // 故障主处理部门是否显示
      balkSubSortId: -1, // =49 显示是否误报按钮
      originDeptId: -1, // 来源部门id
      // 故障分类返回结果显示页面
      balkSubSortId20Show: false, // balkSubSortId=20的情况
      balkSubSortId21Show: false,
      balkSubSortId22Show: false,
      balkSubSortId22ShowResult: false, // balkSubSortId=22并且当前工作组在列表内
      balkReason: [], // 故障原因下拉菜单内容

      // 回复提交
      isMainDept: "2", // 是否故障主处理部门 1：是  2：否
      ttGoSiteOnTime: "", // 铁塔是否按时上站 空：页面上看不到这个选项，0：否，1：是
      // 故障恢复时间
      excludeTime: "",
      faultReasonLevel1: "", // 是否故障主处理部门-故障原因
      faultReasonLevel1Name: "",
      faultReasonLevel1Show: false,
      faultReasonLevel1Actions: [],
      faultReasonLevel2: "",
      faultReasonLevel2Name: "",
      faultReasonLevel2Show: false,
      faultReasonLevel2Actions: [],
      faultReasonLevel3: "",
      faultReasonLevel3Name: "",
      faultReasonLevel3Show: false,
      faultReasonLevel3Actions: [],
      fgsCoordinate: -1, // 是否需分公司配合 -1：该内容页面上不显示；0：否，1：是
      fgsCoordinateOnTime: -1, // 分公司是否按时配合 -1：该内容页面上不显示；0：否，1：是
      returnTop: "-1", // 2：否，1：是（显示故障已修，提交故障起单部门审核）
      faultFeedback: "", // 排障反馈方
      faultFeedbackInfo: "", // 排障反馈详情
      dealDate: "", // 处理时间
      linkTel: "", // 联系电话
      dealResultFactory: "", // 排障结果验证厂家
      verificationResult: "", // 问题验证结果
      verificationDate: "", // 验证日期
      legacyl: "", // 遗留问题
      verificationMan: "", // 验证人员
      verificationManTel: "", // 验证人员联系电话
      verificationFactoryRemark: "", // 验证厂家备注
      remark: "", // 备注
      xiaoJiaoServiceMan: "", // 现场维修人员
      xiaoJiaoBrand: -1, // 小交品牌
      xiaoJiaoBrandName: "", // 小交品牌名称
      xiaoJiaoBrandShow: false,
      xiaoJiaoBrandActions: [
        { name: "AVAYA", value: 1 },
        { name: "NEC", value: 2 },
        { name: "阿尔卡特", value: 3 },
        { name: "爱立信", value: 4 },
        { name: "北电", value: 5 },
        { name: "飞利浦", value: 6 },
        { name: "哈里斯", value: 7 },
        { name: "华为", value: 8 },
        { name: "敏迪", value: 9 },
        { name: "西门子", value: 10 },
        { name: "CISCO", value: 11 },
        { name: "华亨", value: 12 },
        { name: "申瓯", value: 13 },
        { name: "塔迪兰", value: 14 },
        { name: "亿泰", value: 15 },
        { name: "中兴", value: 16 },
      ],
      xiaoJiaoBalkReasonType: "", // 故障原因类型
      xiaoJiaoBalkReasonTypeName: "", // 故障原因类型名称
      xiaoJiaoBalkReasonTypeShow: false,
      xiaoJiaoBalkReasonTypeActions: [
        { name: "小交故障", value: "1" },
        { name: "小交配合", value: "2" },
        { name: "用户需求", value: "3" },
        { name: "用户设备", value: "4" },
      ],
      xiaoJiaoBalkReason: "", // 故障原因
      xiaoJiaoProcMode: "", // 处理方式
      xiaoJiaoBalkGrade: -1, // 故障等级
      xiaoJiaoBalkGradeName: "", // 故障等级名称
      xiaoJiaoBalkGradeShow: false,
      xiaoJiaoBalkGradeActions: [
        { name: "需求", value: 1 },
        { name: "紧急故障", value: 2 },
        { name: "非紧急故障", value: 3 },
      ],
      isChangeHardware: 0, // 是否更换硬件 0为不更换  1为更换
      xiaoJiaoReserveArrayTime: "", // 约定到达时间
      xiaoJiaoRealityArrayTime: "", // 实际到达时间
      finishInfo: "", // 回复信息
      overTimeShow: false, // 是否显示超时原因超时说明
      overTimeIntro: "", // 超时说明
      overTimeReason: "", // 超时原因
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
        { name: "系统故障" },
        { name: "人为因素" },
      ],
      addHardWarePopShow: false, // 增加硬件弹出层
      // 当前正输入的更换硬件信息
      changeHardwareType: "", // 类型
      changeHardwareVersion: "", // 型号
      changeHardwareNumber: null, // 数量
      changeHardwareInfos: [], // 更换硬件信息（回复前查询返回的+手动输入信息）
      imgList: [], // 上传图片列表
      photoIdList: [], // 上传照片id,上传证据
      // 解决方案
      compSolutionInfoList: [],
      solution1: -1,
      solution1Name: "",
      solution1Show: false,
      solution1Actions: [],
      solution2: -1,
      solution2Name: "",
      solution2Show: false,
      solution2Actions: [],
      carrier: -1, // 基站当前载波情況
      carrierName: "",
      carrierShow: false,
      carrierActions: [
        { name: "一载波", value: 1 },
        { name: "二载波", value: 2 },
        { name: "三载波", value: 3 },
      ],
      prb: "", // 基站忙时PRB利用率
      baseStationStatus: "", // 基站指标情况
      rbBaseStationName: "", // 复建站点名称
      // 复建站点入网时间
      rbBaseStationEnterTime: "",
      isFalseAlarm: "", //是否误报 （空-页面上看不到这个选项 1-是 2-否）
      huanPan: "", // 是否多次换盘 空-页面上看不到这个选项 1-是 2-否
    };
  },
  computed: {
    ...mapState("workOrder", ["currWorkGroupInfo"]),
  },
  methods: {
    // 回退
    goBackFn() {
      this.$router.go(-1);
    },
    // 选中小交品牌
    selectXiaoJiaoBrand(action) {
      this.xiaoJiaoBrand = action.value;
      this.xiaoJiaoBrandName = action.name;
    },
    // 选中故障原因类型
    selectXiaoJiaoBalkReasonType(action) {
      this.xiaoJiaoBalkReasonType = action.value;
      this.xiaoJiaoBalkReasonTypeName = action.name;
    },
    // 选中故障等级
    selectXiaoJiaoBalkGrade(action) {
      this.xiaoJiaoBalkGrade = action.value;
      this.xiaoJiaoBalkGradeName = action.name;
    },
    // 选中超时原因
    selectOverTimeReason(action) {
      this.overTimeReason = action.name;
    },
    // 选中故障原因-一级
    selectFaultReasonLevel1(action) {
      this.faultReasonLevel1 = action.value;
      this.faultReasonLevel1Name = action.name;

      // 切换二级菜单
      for (let item of this.balkReason) {
        // 判断选中的是哪一个一级菜单
        if (item.id == action.value) {
          if (item.sonReason.length > 0) {
            // 获取二级菜单
            let arr = [];
            item.sonReason.forEach((secondItem) => {
              let sobj = {};
              sobj.name = secondItem.name;
              sobj.value = secondItem.id;
              arr.push(sobj);
            });
            this.faultReasonLevel2Actions = arr;
            // 默认选中下拉菜单第一个值
            this.faultReasonLevel2 = this.faultReasonLevel2Actions[0].value;
            this.faultReasonLevel2Name = this.faultReasonLevel2Actions[0].name;
            // 判断二级菜单第一个元素是否有三级菜单
            if (item.sonReason[0].sonReason.length > 0) {
              let arr3 = [];
              item.sonReason[0].sonReason.forEach((thirdItem) => {
                let tobj = {};
                tobj.name = thirdItem.name;
                tobj.value = thirdItem.id;
                arr3.push(tobj);
              });
              this.faultReasonLevel3Actions = arr3;
              // 默认选中下拉菜单第一个值
              this.faultReasonLevel3 = this.faultReasonLevel3Actions[0].value;
              this.faultReasonLevel3Name =
                this.faultReasonLevel3Actions[0].name;
              break;
            } else {
              // 隐藏三级原因
              this.faultReasonLevel3Actions = [];
              this.faultReasonLevel3 = "";
              this.faultReasonLevel3Name = "";
            }
          } else {
            // 隐藏二级原因
            this.faultReasonLevel2Actions = [];
            this.faultReasonLevel2 = "";
            this.faultReasonLevel2Name = "";
          }
        }
      }
    },
    // 选中子故障原因-二级菜单
    selectFaultReasonLevel2(action) {
      this.faultReasonLevel2 = action.value;
      this.faultReasonLevel2Name = action.name;
      // 判断选中的二级菜单获取三级菜单
      for (let firstItem of this.balkReason) {
        // 一级菜单
        if (firstItem.sonReason.length > 0) {
          for (let secondItme of firstItem.sonReason) {
            if (secondItme.id == action.value) {
              // 获取三级菜单
              if (secondItme.sonReason.length > 0) {
                let arr3 = [];
                secondItme.sonReason.forEach((thirdItem) => {
                  let tobj = {};
                  tobj.name = thirdItem.name;
                  tobj.value = thirdItem.id;
                  arr3.push(tobj);
                });
                this.faultReasonLevel3Actions = arr3;
                // 默认选中下拉菜单第一个值
                this.faultReasonLevel3 = this.faultReasonLevel3Actions[0].value;
                this.faultReasonLevel3Name =
                  this.faultReasonLevel3Actions[0].name;
              } else {
                // 隐藏三级菜单
                this.faultReasonLevel3Actions = [];
                this.faultReasonLevel3 = "";
                this.faultReasonLevel3Name = "";
              }
              break;
            }
          }
        }
      }
    },
    // 选中子故障原因-三级菜单
    selectFaultReasonLevel3(action) {
      this.faultReasonLevel3 = action.value;
      this.faultReasonLevel3Name = action.name;
    },
    // 选中解决方案一
    selectSolution1(action) {
      this.solution1 = action.value;
      this.solution1Name = action.name;
      // 切换二级下拉菜单
      for (let item of this.compSolutionInfoList) {
        if (action.name == item.name) {
          if (item.sonReason.length > 0) {
            let arr2 = [];
            item.sonReason.forEach((secondItem) => {
              // 获取二级下拉菜单
              let sobj = {};
              sobj.name = secondItem.name;
              sobj.value = secondItem.id;
              arr2.push(sobj);
            });
            this.solution2Actions = arr2;
            this.solution2 = this.solution2Actions[0].value;
            this.solution2Name = this.solution2Actions[0].name;
          } else {
            this.solution2Actions = [];
            this.solution2 = -1;
            this.solution2Name = "";
          }
        }
      }
      // 判断上传证据显示条件
      this.judgeUploadProof();

      // 重置参数
      this.prb = "";
      this.rbBaseStationEnterTime = "";
      this.rbBaseStationName = "";
      this.imgList = [];
      this.photoIdList = [];

      if (this.workType == 5008 && this.solution1 == 1) {
        this.carrierName = "一载波";
        this.carrier = 1;
      }
    },
    // 选中解决方案二
    selectSolution2(action) {
      this.solution2 = action.value;
      this.solution2Name = action.name;
      // 判断上传证据显示条件
      this.judgeUploadProof();
      // 重置参数
      this.imgList = [];
      this.photoIdList = [];
    },
    // 选中基站当前载波情況
    selectCarrier(action) {
      this.carrier = action.value;
      this.carrierName = action.name;
    },
    // 选中是否需分公司配合
    clickFgsCoordinate(bool) {
      if (bool) this.fgsCoordinate = 1;
      else {
        this.fgsCoordinate = 0;
        this.fgsCoordinateOnTime = -1;
      }
    },
    // 选中分公司是否按时配合
    clickFgsCoordinateOnTime(bool) {
      if (bool) this.fgsCoordinateOnTime = 1;
      else this.fgsCoordinateOnTime = 0;
    },
    // 选中是否故障已修，提交故障起单部门审核：
    clickReturnTop(bool) {
      if (bool) this.returnTop = "1";
      else this.returnTop = "2";
    },
    // 选中是否更换硬件
    clickIsChangeHardware(bool) {
      if (bool) this.isChangeHardware = 1;
      else this.isChangeHardware = 0;
    },
    // 选中铁塔是否按时上站
    clickTtGoSiteOnTime(bool) {
      if (bool) this.ttGoSiteOnTime = "1";
      else this.ttGoSiteOnTime = "0";
    },
    // 选中是否故障主处理部门
    clickIsMainDept(bool) {
      if (bool) {
        this.isMainDept = "1";
        this.getFaultReasonPullDown(this.balkReason);
      } else {
        this.isMainDept = "2";
        this.excludeTime = "";
        // 故障主处理部门选"否"或故障主处理部门未显示时,清空故障原因1,2,3
        this.faultReasonLevel1 = "";
        this.faultReasonLevel1Name = "";
        this.faultReasonLevel2 = "";
        this.faultReasonLevel2Name = "";
        this.faultReasonLevel3 = "";
        this.faultReasonLevel3Name = "";
      }
    },
    // 选中是否误报
    clickIsFalseAlarm(bool) {
      if (bool) this.isFalseAlarm = "1";
      else this.isFalseAlarm = "2";
    },
    // 选中是否换盘
    clickHuanPan(bool) {
      if (bool) this.huanPan = "1";
      else this.huanPan = "2";
    },

    // 获取选择的验证日期
    getVerificationDate(val) {
      this.verificationDate = val;
    },
    // 获取选择的故障恢复时间
    getExcludeTime(val) {
      this.excludeTime = val;
    },
    // 获取选择的处理时间
    getDealDate(val) {
      this.dealDate = val;
    },
    // 获取选择的约定到达时间
    getXiaoJiaoReserveArrayTime(val) {
      this.xiaoJiaoReserveArrayTime = val;
    },
    // 获取选择的实际到达时间
    getXiaoJiaoRealityArrayTime(val) {
      this.xiaoJiaoRealityArrayTime = val;
    },
    // 获取选择的复建站点入网时间
    getRbBaseStationEnterTime(val) {
      this.rbBaseStationEnterTime = val;
    },

    // 新增硬件
    addHardWare() {
      this.addHardWarePopShow = true;
    },
    // 取消增加硬件弹出层
    cancelAddHardWarePop() {
      this.addHardWarePopShow = false;
    },
    // 确认增加硬件弹出层
    confirmAddHardWarePop() {
      if (this.changeHardwareType == "")
        return this.$toast("更换硬件类型不能为空");
      if (this.changeHardwareVersion == "")
        return this.$toast("更换硬件型号不能为空");
      if (this.changeHardwareNumber == "")
        return this.$toast("更换硬件数量不能为空");
      let obj = {
        changeHardwareType: this.changeHardwareType,
        changeHardwareVersion: this.changeHardwareVersion,
        changeHardwareNumber: parseInt(this.changeHardwareNumber),
      };
      this.changeHardwareInfos.push(obj);
      this.addHardWarePopShow = false;
      this.changeHardwareType =
        this.changeHardwareVersion =
        this.changeHardwareNumber =
          "";
    },
    // 删除更换硬件
    deleteChangeHardware(index) {
      this.changeHardwareInfos.splice(index, 1);
    },
    // 图片读取完成
    afterRead(file) {
      // console.log('file', file)
    },
    // 获取故障原因下拉菜单
    getFaultReasonPullDown(balkReason) {
      // 取出一级菜单
      let arr1 = [];
      balkReason.forEach((firstItem) => {
        let fobj = {};
        fobj.name = firstItem.name;
        fobj.value = firstItem.id;
        arr1.push(fobj);
      });
      this.faultReasonLevel1Actions = arr1;
      // 默认选中下拉菜单第一个值
      this.faultReasonLevel1 = this.faultReasonLevel1Actions[0].value;
      this.faultReasonLevel1Name = this.faultReasonLevel1Actions[0].name;
      // 判断一级菜单第一个元素是否有二级菜单
      if (this.balkReason[0].sonReason.length > 0) {
        let arr2 = [];
        balkReason[0].sonReason.forEach((secondItem) => {
          let sobj = {};
          sobj.name = secondItem.name;
          sobj.value = secondItem.id;
          arr2.push(sobj);
        });
        this.faultReasonLevel2Actions = arr2;

        // 默认选中下拉菜单第一个值
        this.faultReasonLevel2 = this.faultReasonLevel2Actions[0].value;
        this.faultReasonLevel2Name = this.faultReasonLevel2Actions[0].name;
        // 判断二级菜单第一个元素是否有三级菜单
        if (this.balkReason[0].sonReason[0].sonReason.length > 0) {
          let arr3 = [];
          balkReason[0].sonReason[0].sonReason.forEach((thirdItem) => {
            let tobj = {};
            tobj.name = thirdItem.name;
            tobj.value = thirdItem.id;
            arr3.push(tobj);
          });
          this.faultReasonLevel3Actions = arr3;
          // 默认选中下拉菜单第一个值
          this.faultReasonLevel3 = this.faultReasonLevel3Actions[0].value;
          this.faultReasonLevel3Name = this.faultReasonLevel3Actions[0].name;
        }
      }
    },
    // 判断上传证据显示条件
    judgeUploadProof() {
      if (this.workType == 5009) {
        this.uploadProof = true;
        // 1. workType为5009时且解决方案一为解决闭环(id=5)时，需要上传证据1,2
        if (this.solution1 == 5) {
          this.uploadProof1 = true;
          this.uploadProof2 = true;
          this.proof1 = "证据1：(测试报告或用户认可录音)";
          this.proof2 = "证据2：(现场安装照片)";
        } else if (this.solution1 == 6) {
          // 解决方案一为其他手段解决闭环时
          // 1. 解决方案二“为”RF优化(id=32)“或”新建基站/小基站(id=33)“时，需要上传证据1
          // 2. 解决方案二“为”安抚认可(id=34)“,需要上传证据1,2
          // 3. 解决方案二“为”不具备安装条件/安装无效果申请基站建设(id=57)“时,需要上传证据1,2
          if (this.solution2 == 32 || this.solution2 == 33) {
            this.uploadProof1 = true;
            this.proof1 = "证据1：(用户认可录音)";
            this.uploadProof2 = false;
            this.proof2 = "";
          } else if (this.solution2 == 34) {
            this.uploadProof1 = true;
            this.uploadProof2 = true;
            this.proof1 = "证据1：(用户认可录音)";
            this.proof2 = "证据2：(客服系统笔记)";
          } else if (this.solution2 == 57) {
            this.uploadProof1 = true;
            this.uploadProof2 = true;
            this.proof1 = "证据1：(场安装无效果/不具备安装条件证据)";
            this.proof2 = "证据2：(现场安装无效果/不具备安装条件证据)";
          }
        } else if (this.solution1 == 7) {
          // 解决方案二为”用户原因不同意安装-用户(id=58)“,显示证据1,2
          if (this.solution2 == 58) {
            this.uploadProof1 = true;
            this.uploadProof2 = true;
            this.proof1 = "证据1：(用户不同意录音证明或书面证明)";
            this.proof2 = "证据2：(用户不同意录音证明或书面证明)";
          } else if (this.solution2 == 59) {
            // 解决方案二为”用户原因不同意安装-物业(id=59)“,显示证据1,2
            this.uploadProof1 = true;
            this.uploadProof2 = true;
            this.proof1 =
              "证据1：(物业/涉密单位不同意书面证明（含盖章或签字）或录音证据+投诉用户解释录音)";
            this.proof2 =
              "证据2：(物业/涉密单位不同意书面证明（含盖章或签字）或录音证据+投诉用户解释录音)";
          } else if (this.solution2 == 60) {
            // 解决方案二为”用户原因不同意安装-联系不上用户(id=60)“时
            this.uploadProof1 = false;
            this.uploadProof2 = true;
            this.proof1 = "";
            this.proof2 = "证据1：(联系用户证明，连续5天内有三天有联系记录)";
          }
        }
      } else if (this.workType == 5011) {
        this.uploadProof = true;
        // 解决方案一为“解决闭环(id=12)”时,显示证据1
        if (this.solution1 == 12) {
          this.uploadProof1 = true;
          this.proof1 = "证据1：(测试报告或用户认可录音)";
          this.uploadProof2 = false;
          this.proof2 = "";
        } else if (this.solution1 == 13) {
          // 解决方案一为“不可抗理由闭环(id=13)”时,显示证据1(照片)
          this.uploadProof1 = false;
          this.uploadProof2 = true;
          this.proof1 = "";
          this.proof2 = "证据1：(扫频报告)";
        }
      } else if (this.workType == 5012) {
        // 拆复建
        // 解决方案一为“解决闭环时(id=15)”时，不显示上传证据
        if (this.solution1 == 15) {
          this.uploadProof = false;
        }
        // 解决方案一为“不可抗理由闭环(id=16)”时,显示证据1(照片)
        else if (this.solution1 == 16) {
          this.uploadProof = true;
          this.uploadProof1 = false;
          this.uploadProof2 = true;
          this.proof1 = "";
          this.proof2 = "证据1：(政府拆迁证明)";
        }
      } else if (this.workType == 5013) {
        this.uploadProof = true;
        // 解决方案一”为“解决闭环(id=18)”时，显示“上传证据1,2
        if (this.solution1 == 18) {
          this.uploadProof1 = true;
          this.uploadProof2 = true;
          this.proof1 = "证据1：(补点完成照片)";
          this.proof2 = "证据2：(现场复测报告或用户认可录音)";
        } else if (this.solution1 == 19) {
          // 解决方案一”为“其他手段解决(id=19)”时,”解决方案二“为”小微手段(id=47)“,显示“上传证据1,2
          if (this.solution2 == 47) {
            this.uploadProof1 = true;
            this.uploadProof2 = true;
            this.proof1 = "证据1：(用户认可录音)";
            this.proof2 = "证据2：(现场安装照片)";
          } else if (this.solution2 == 48 || this.solution2 == 49) {
            // 解决方案二“为”RF优化(id=48)“或“单点场景用户安抚(id=49)”,显示证据1
            this.uploadProof1 = true;
            this.proof1 = "证据1：(用户认可录音)";
            this.uploadProof2 = false;
            this.proof2 = "";
          }
        } else if (this.solution1 == 20) {
          // 解决方案一”为“不可抗理由闭环(id=20)”时,”解决方案二“为”用户原因不同意安装-用户(id=61),显示证据1,2
          if (this.solution2 == 61) {
            this.uploadProof1 = true;
            this.uploadProof2 = true;
            this.proof1 = "证据1：(用户不同意书面证明)";
            this.proof2 = "证据2：(现场安装照片)";
          } else if (this.solution2 == 62) {
            // 解决方案二“为”用户原因不同意安装-物业(id=62),显示上传证据1,2
            this.uploadProof1 = true;
            this.uploadProof2 = true;
            this.proof1 =
              "证据1：(物业/涉密单位不同意书面证明（含盖章或签字）)";
            this.proof2 = "证据2：(现场安装照片)";
          }
        }
      } else if (this.workType == 5015) {
        this.uploadProof = true;
        // “解决方案一”为“解决闭环(id=24”时,显示上传证据1
        if (this.solution1 == 24) {
          this.uploadProof1 = true;
          this.proof1 = "证据1：(用户认可录音)";
          this.uploadProof2 = false;
          this.proof2 = "";
        } else if (this.solution1 == 25) {
          // 解决方案一”为“其他手段解决(id=25)”时,显示上传证据1,2
          this.uploadProof1 = true;
          this.uploadProof2 = true;
          this.proof1 = "证据1：(用户认可录音)";
          this.proof2 = "证据2：(安装照片)";
        }
      } else {
        this.uploadProof = false;
      }
    },

    // 回单前查询
    async getFinishQuery() {
      // 判断是否从回任务页面过来
      let result = null;
      if (this.$route.query?.type == 2) {
        result = await reqFinishQueryByTask(
          JSON.stringify({ id: parseInt(this.$route.query.id) })
        );
      } else {
        result = await reqFinishQuery(
          JSON.stringify({ id: parseInt(this.$route.query.id) })
        );
      }

      console.log("回单前查询结果", result);

      this.apiResponse(result, ".ifmFinish", () => {
        // 回任务的id使用reqFinishQueryByTask接口返回的id
        if (this.$route.query?.type == 2) {
          this.id = result.id;
        } else {
          this.id = parseInt(this.$route.query.id);
        }
        // 从listDetail获取workType → 判断参数是否显示
        let workTypeList = [5008, 5009, 5010, 5011, 5012, 5013, 5014, 5015];
        if (workTypeList.includes(this.workType)) {
          this.hasWorkType = true;
        }

        if (this.hasWorkType) {
          // 获取解决方案下拉菜单内容
          this.compSolutionInfoList = result.compSolutionInfoList;
          let arr1 = [];
          this.compSolutionInfoList.forEach((item) => {
            // 获取一级下拉菜单
            let fobj = {};
            fobj.name = item.name;
            fobj.value = item.id;
            arr1.push(fobj);
          });
          this.solution1Actions = arr1;
          this.solution1 = this.solution1Actions[0].value;
          this.solution1Name = this.solution1Actions[0].name;
          // 判断一级菜单第一项是否有二级菜单
          if (this.compSolutionInfoList[0].sonReason.length > 0) {
            let arr2 = [];
            this.compSolutionInfoList[0].sonReason.forEach((secondItem) => {
              // 获取二级下拉菜单
              let sobj = {};
              sobj.name = secondItem.name;
              sobj.value = secondItem.id;
              arr2.push(sobj);
            });
            this.solution2Actions = arr2;
            this.solution2 = this.solution2Actions[0].value;
            this.solution2Name = this.solution2Actions[0].name;
          }

          // 基站当前载波情況
          // workType为5008时且解决方案一为解决闭环(id=1)时显示基站当前載波
          if (this.workType == 5008 && this.solution1 == 1) {
            this.carrierName = "一载波";
            this.carrier = 1;
          }

          // 判断上传证据显示条件
          this.judgeUploadProof();
        } else {
          this.returnDWJ = result.returnDWJ; // 显示故障已修，提交故障起单部门审核
          this.isXiaoJiao = result.isXiaoJiao;
          this.showFgsCoordinate = result.showFgsCoordinate; // 显示是否需分公司配合选项
          this.ttStation = result.ttStation; // 2：显示铁塔是否按时上站按钮
          this.balkSubSortId = result.balkSubSortId;
          this.originDeptId = result.originDeptId;
          if (this.returnDWJ == 1) this.returnTop = "1";
          if (this.showFgsCoordinate == 1) {
            this.fgsCoordinate = 0;
          }
          if (this.balkSubSortId == 49) {
            // balkSubSortId =49 显示是否误报按钮 默认选否
            this.isFalseAlarm = "2";
          }
          // 铁塔是否按时上站
          if (this.ttStation == 2) {
            this.ttGoSiteOnTime = "1"; // 默认选中“是”
          }
          // 是否换盘 换盘显示条件：balkSubSortId == 2 && originDeptId == 5962
          if (this.balkSubSortId == 2 && this.originDeptId == 5962) {
            this.huanPan = "2"; // 默认显示‘否’
          }

          // 故障分类-控制页面显示
          let isMainDeptId = [
            14, 15, 16, 17, 18, 29, 5001, 5002, 5003, 5004, 5005, 5006,
          ];
          if (isMainDeptId.includes(result.balkSubSortId)) {
            this.mainDeptShow = true;
            // 故障类型-获取故障主处理部门选择是下的故障原因下拉菜单
            if (result.balkReason.length > 0) {
              this.balkReason = result.balkReason;
              this.getFaultReasonPullDown(this.balkReason);
            }
          }

          let currentDeptId = this.currWorkGroupInfo.groupId;
          if (result.balkSubSortId == 20) {
            let currentDeptList = [
              5747, 5776, 5793, 5814, 5862, 6043, 6059, 6076, 6094, 6138, 6182,
              6207, 6248, 6260, 6306, 6317,
            ];
            // currentDeptId:[5747,5776,5793,5814,5862,6043,6059,6076,6094,6138,6182,6207,6248,6260,6306,6317]
            if (currentDeptList.includes(currentDeptId)) {
              // 显示-faultFeedbackInfo；faultFeedback;dealDate;linkTel
              this.balkSubSortId20Show = true;
            }
          } else if (result.balkSubSortId == 21) {
            // 显示-faultFeedbackInfo；faultFeedback;dealDate;linkTel;DealResultFactory;VerificationResult;VerificationDate;Legacy;VerificationMan;  VerificationManTel;  VerificationFactoryRemark;  Remark;
            this.balkSubSortId21Show = true;
          } else if (result.balkSubSortId == 22) {
            // 显示-faultFeedback；faultFeedbackInfo；dealDate；
            this.balkSubSortId22Show = true;
            let currentDeptList22 = [
              32926, 32929, 32930, 32931, 32932, 32933, 32907, 32905, 32934,
              32906, 32908, 32909, 32910, 32925, 32927, 32928,
            ];
            if (currentDeptList22.includes(currentDeptId)) {
              // 显示 verificationResult
              this.balkSubSortId22ShowResult = true;
            }
          }

          // 小交信息(取最后一条数据)
          if (result.xiaoJiaoBackInfoList.length > 0) {
            this.xiaoJiaoFillShow = true;
            let xiaoJiaoBackInfo =
              result.xiaoJiaoBackInfoList[
                result.xiaoJiaoBackInfoList.length - 1
              ];
            this.xiaoJiaoReserveArrayTime = xiaoJiaoBackInfo.appointTime;
            this.xiaoJiaoRealityArrayTime = xiaoJiaoBackInfo.realTime;
            this.xiaoJiaoProcMode = xiaoJiaoBackInfo.dealType;
            this.xiaoJiaoServiceMan = xiaoJiaoBackInfo.sceUserName;
            this.xiaoJiaoBalkReason = xiaoJiaoBackInfo.xiaoJiaoBalkReason;
            // 故障等级
            this.xiaoJiaoBalkGrade = xiaoJiaoBackInfo.xiaoJiaoBalkLevel;
            for (let action of this.xiaoJiaoBalkGradeActions) {
              if (action.value == this.xiaoJiaoBalkGrade) {
                this.xiaoJiaoBalkGradeName = action.name;
                break;
              }
            }
            // 故障原因类型
            this.xiaoJiaoBalkReasonType =
              xiaoJiaoBackInfo.xiaoJiaoBalkReasonType.toString();
            for (let action of this.xiaoJiaoBalkReasonTypeActions) {
              if (action.value == this.xiaoJiaoBalkReasonType) {
                this.xiaoJiaoBalkReasonTypeName = action.name;
                break;
              }
            }
            // 小交品牌
            this.xiaoJiaoBrand = xiaoJiaoBackInfo.xiaoJiaoBrand;
            for (let action of this.xiaoJiaoBrandActions) {
              if (action.value == this.xiaoJiaoBrand) {
                this.xiaoJiaoBrandName = action.name;
                break;
              }
            }
            // isChange=1 显示硬件信息
            result.xiaoJiaoBackInfoList.forEach((item) => {
              if (item.isChange) {
                // 显示回单前查询返回的硬件信息
                this.changeHardwareInfos.push(...item.changeHardwareInfoList);
                this.isChangeHardware = 1;
              }
            });
          }
        }
      });
    },
    // 回复提交
    async submitFinish() {
      // 重置一些参数
      if (!(this.workType == 5008 && this.solution1 == 1)) {
        this.carrier = -1; // 清空基站当前载波情況
        this.carrierName = "";
      }

      // 传参
      let postData = {
        id: this.id,
        fgsCoordinate: this.fgsCoordinate,
        fgsCoordinateOnTime: this.fgsCoordinateOnTime,
        returnTop: this.returnTop,
        faultFeedback: this.faultFeedback,
        faultFeedbackInfo: this.faultFeedbackInfo,
        dealDate: this.dealDate,
        linkTel: this.linkTel,
        dealResultFactory: this.dealResultFactory,
        verificationResult: this.verificationResult,
        verificationDate: this.verificationDate,
        legacyl: this.legacyl,
        verificationMan: this.verificationMan,
        verificationManTel: this.verificationManTel,
        verificationFactoryRemark: this.verificationFactoryRemark,
        remark: this.remark,
        xiaoJiaoServiceMan: this.xiaoJiaoServiceMan,
        xiaoJiaoBrand: this.xiaoJiaoBrand,
        xiaoJiaoBalkReasonType: this.xiaoJiaoBalkReasonType,
        xiaoJiaoBalkReason: this.xiaoJiaoBalkReason,
        xiaoJiaoProcMode: this.xiaoJiaoProcMode,
        xiaoJiaoBalkGrade: this.xiaoJiaoBalkGrade,
        isChangeHardware: this.isChangeHardware,
        xiaoJiaoReserveArrayTime: this.xiaoJiaoReserveArrayTime,
        xiaoJiaoRealityArrayTime: this.xiaoJiaoRealityArrayTime,
        finishInfo: this.finishInfo,
        overTimeIntro: this.overTimeIntro,
        overTimeReason: this.overTimeReason,
        dealGroupId:
          this.isMainDept == "1"
            ? this.currWorkGroupInfo.groupId.toString()
            : "", // 处理部门Id
        dealGroupName:
          this.isMainDept == "1" ? this.currWorkGroupInfo.groupName : "", // 处理部门名称
        excludeTime: this.excludeTime,
        isMainDept: this.isMainDept,
        faultReasonLevel1: this.faultReasonLevel1.toString(),
        faultReasonLevel2: this.faultReasonLevel2.toString(),
        faultReasonLevel3: this.faultReasonLevel3.toString(),
        ttStation: "false",
        ttGoSiteOnTime: this.ttGoSiteOnTime,
        isXiaoJiao: this.isXiaoJiao,
        changeHardwareInfos: this.changeHardwareInfos,
        photoIdList: this.photoIdList,
        supportMeans: "", // 预警单，支撑单回复填写
        isFalseAlarm: this.isFalseAlarm,
        huanPan: this.huanPan,
        solution1: this.solution1,
        solution2: this.solution2,
        carrier: this.carrier,
        prb: this.prb,
        baseStationStatus: this.baseStationStatus,
        rbBaseStationName: this.rbBaseStationName,
        rbBaseStationEnterTime: this.rbBaseStationEnterTime,
      };

      let result = await reqifmFinish(JSON.stringify(postData));
      console.log("回复提交结果", result);
      this.apiResponse(result, ".ifmFinish", () => {
        this.$router.push({ name: "WorkBench" }); // 直接返回工作台
        this.$store.commit("removeThisPage", "ListDetail");
        // 只调用接口按钮操作成功 刷新工作台
        this.operationSuccessRefresh(true);
      });
      if (!result.operationSuccessFlag) {
        if (result.errorCode == 20) {
          this.overTimeShow = true;
        }
      }
    },
    // 回单校验
    receiptCheck() {
      // 当请求正在进行时，禁止再次提交
      if (this.$store.state.isLoading)
        return this.$toast("正在提交请求，请勿再次提交");
      // 回单校验-判断是否可以提交
      if (this.hasWorkType) {
        // 校验解决方式，基站当前载波情况，基站忙时PRB利用率，基站指标情况，复建站点名称，复建站点入网时间,上传证据
        if (
          this.workType == 5008 &&
          (this.solution1 == 1 || this.solution1 == 2)
        ) {
          if (this.prb == "") return this.$toast("请输入基站忙时PRB利用率");
        }

        if (this.workType == 5011 && this.solution1 == 12) {
          if (this.baseStationStatus == "")
            return this.$toast("请输入基站指标情况");
        }

        if (this.workType == 5012 && this.solution1 == 15) {
          if (this.rbBaseStationName == "")
            return this.$toast("请输入复建站点名称");
          if (this.rbBaseStationEnterTime == "")
            return this.$toast("请选择复建站点入网时间");
        }

        // 上传证据校验
      } else {
        // 校验其他内容
        if (this.fgsCoordinate == 1 && this.fgsCoordinateOnTime == -1)
          return this.$toast("请选择分公司是否按时配合");

        if (this.isMainDept == "1") {
          if (this.excludeTime == "") return this.$toast("请选择故障恢复时间");
        }

        if (this.isXiaoJiao) {
          if (this.xiaoJiaoBrand == -1) return this.$toast("请选择小交品牌");
          if (this.xiaoJiaoBalkReason == "")
            return this.$toast("请输入故障原因");
          if (this.xiaoJiaoBalkReasonType == "")
            return this.$toast("请选择故障原因类型");
          if (this.xiaoJiaoProcMode == "") return this.$toast("请输入处理方式");
          if (this.xiaoJiaoBalkGrade == -1)
            return this.$toast("请选择故障等级");
          if (this.xiaoJiaoServiceMan == "")
            return this.$toast("请输入现场维修人员");
          if (this.xiaoJiaoReserveArrayTime == "")
            return this.$toast("请选择约定到达时间");
          if (this.xiaoJiaoRealityArrayTime == "")
            return this.$toast("请选择实际到达时间");
          //是否更换硬件选择“是”时，必须有新增硬件内容
          if (
            this.isChangeHardware == 1 &&
            this.changeHardwareInfos.length == 0
          ) {
            return this.$toast(
              "选择更换硬件，至少应有一个硬件信息，不需要请选择否"
            );
          }
        }
      }

      // 校验必有内容
      if (this.finishInfo == "") {
        return this.$toast("请输入回复信息");
      }
      // 校验超时原因
      if (this.overTimeShow) {
        if (this.overTimeReason == "") return this.$toast("请选择超时原因");
        if (this.overTimeIntro == "") return this.$toast("请输入超时说明");
      }

      // 显示上传照片时，获取图片id
      this.getPictureIds();
    },
    // 获取图片id
    getPictureIds() {
      // 提交图片，获取图片id
      // 清空上一次id列表
      this.photoIdList = [];
      // 发送图片id请求
      if (this.imgList.length > 0) {
        this.imgList.forEach((item, index) => {
          // 上传 form-data格式 图片
          let formData = new FormData();
          formData.append("loginNo", getItem("loginNo"));
          formData.append("sheetId", this.id);
          formData.append("pictype", 3);
          formData.append("picName", `${this.id}-${index}`);
          formData.append("file", item.file);

          axios({
            method: "post",
            url: url,
            data: formData,
          })
            .then((res) => {
              console.log("图片id结果", res);
              // 获取图片id
              this.photoIdList.push(parseInt(res.data.id));
              // 判断如果是最后一次图片请求，则发送强制回单/回复 请求
              if (index === this.imgList.length - 1) {
                // 发送强制回单/回复 请求
                this.submitFinish();
                // console.log('最后一次图片id', index)
              }
            })
            .catch((err) => {
              console.log(err);
            });
        });
      } else {
        // 未上传图片，直接发送请求
        this.submitFinish();
      }
    },
  },
  created() {
    // 回单前查询
    this.getFinishQuery();
  },
};
</script>

<style scoped lang="less">
@theme-color: #1989fa;
@import "@/assets/css/confirmDialog.less";
.ifmFinish {
  min-height: 100%;
  background-color: #f8f7fc;
  .main {
    .xiaoJiaoFill {
      padding: 10px;
      background: rgb(250, 250, 101);
      color: @theme-color;
    }
    .region {
      margin-top: 10px;
      background-color: #fff;
      /deep/.van-cell__title {
        flex: 0.5;
      }
      .selectButton {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 45px;
        padding: 0 10px 0 6px;
        background-color: #fff;
        .title {
          display: flex;
          align-items: center;
          color: #646566;
          font-size: 14px;
        }
        .button {
          .van-button {
            width: 50px;
            height: 35px;
            padding: 5px;
            font-size: 13px;
          }
          .addHardWare {
            width: 70px;
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
      .changeHardwareList {
        .changeHardwareInfo {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid;
          .left,
          .right {
            display: flex;
          }
          .right {
            padding-top: 5px;
            span {
              padding-right: 5px;
            }
          }
          .left {
            flex-direction: column;
            span {
              padding: 5px;
              text-align: left;
            }
          }
        }
      }
      .title {
        padding: 10px;
        text-align: left;
        color: red;
      }
      .upload {
        display: flex;
        justify-content: flex-start;
        padding: 20px;
        flex-direction: column;
        text-align: left;
        background-color: #fff;
        p {
          margin-bottom: 20px;
        }
        .uploadRecord {
          width: 50px;
          height: 50px;
          line-height: 50px;
          border: 1px solid #e0e0e0;
          text-align: center;
          font-size: 30px;
        }
      }
    }
  }
  .popRegion {
    width: 80%;
    padding: 10px;
    h3 {
      color: @theme-color;
    }
    .addHardWarePop {
      .inputRegion {
        /deep/.van-cell__title {
          flex: 1;
          span {
            display: inline-block;
            margin-top: 5px;
          }
        }
        /deep/.van-cell__value {
          flex: 5;
          input {
            padding: 5px;
            border: 1px solid #e0e0e0;
            border-radius: 10px;
          }
          input:focus {
            caret-color: @theme-color;
            outline: none;
            border: 1px solid @theme-color;
          }
        }
      }
    }

    .buttonRegion {
      display: flex;
      justify-content: space-around;
      margin: 10px 0;
      .van-button {
        width: 40%;
      }
    }
  }

  .submitButton {
    padding: 30px;
  }
}
</style>