<template>
  <div class="yhgd">
    <div class="static" ref="static">
      <MyHeader :name="name" left="arrow-left" @goBackEv="$router.go(-1)" />
      <div class="settingRegion">
        <!-- 根据 userAuth=1 展示全市 区域 网格按钮 -->
        <div class="authority" v-if="userAuth == 1">
          <van-button
            type="default"
            v-for="item in userAuthList"
            :key="item.value"
            @click="clickUserAuth(item)"
            :class="userAuthIndex == item.value ? 'activeButton' : ''"
            >{{ item.name }}</van-button
          >
        </div>
        <!-- groupId 一级权限点击网格按钮时才展示 || 二级权限 -->
        <div
          class="selectRegion"
          style="margin-bottom: 6px"
          v-if="type == 3 || userAuth == 2"
        >
          <span class="label">网格</span>
          <div class="after" @click="showGroup = true">
            <input type="text" readonly v-model="groupName" />
          </div>
          <van-action-sheet
            v-model="showGroup"
            cancel-text="取消"
            :round="false"
            :actions="groupIdOption"
            close-on-click-action
            @select="onSelectInteCell"
          />
          <!-- <van-dropdown-menu active-color="blue">
            <van-dropdown-item v-model="groupId" :options="groupIdOption" />
          </van-dropdown-menu> -->
        </div>
        <!-- zhiShi -->
        <div class="buttonList">
          <van-button
            type="default"
            v-for="item in zhishiList"
            :key="item.value"
            @click="clickZhiShi(item)"
            :class="modeId == item.value ? 'activeButton' : ''"
            >{{ item.name }}</van-button
          >
        </div>
        <!-- zhiBiao -->
        <div class="selectRegion">
          <span class="label">全部指标</span>
          <div class="after" @click="showZhiBiao = true">
            <input
              type="text"
              readonly
              v-model="monIndexId"
              placeholder="全部"
            />
          </div>
          <van-action-sheet
            v-model="showZhiBiao"
            cancel-text="取消"
            :round="false"
            :actions="zhiBiaoOption"
            close-on-click-action
            @select="onSelectZhiBiao"
          />
          <!-- <van-dropdown-menu active-color="blue">
            <van-dropdown-item
              v-model="zhiBiaoIndex"
              :options="zhiBiaoOption"
              @change="changeZhiBiao"
            />
          </van-dropdown-menu> -->
        </div>
        <!-- 时间选择器 -->
        <div class="dateRegion">
          <div class="date">
            <span>日期</span>
            <van-cell @click="dateShowPopup" style="width: 70%; padding: 4px">{{
              month || pickDate
            }}</van-cell>
            <van-popup
              v-model="datePopShow"
              round
              position="bottom"
              style="height: 40%"
            >
              <van-datetime-picker
                v-model="currentDate"
                type="year-month"
                title="选择年月"
                :min-date="minDate"
                :max-date="maxDate"
                :formatter="formatter"
                @confirm="confirmDate"
                @cancel="datePopShow = false"
              />
            </van-popup>
          </div>
          <div class="week">
            <span>第</span>
            <van-cell @click="weekShowPopup" style="width: 80%; padding: 4px">{{
              weekIndex || pickWeek
            }}</van-cell>
            <van-popup
              round
              v-model="weekPopShow"
              position="bottom"
              style="height: 36%"
              class="selectWeek"
            >
              <ul>
                <li
                  v-for="(item, index) in weekList"
                  :key="index"
                  @click="clickWeek(item, index)"
                  :class="index == currentWeek ? 'pickWeek' : ''"
                >
                  {{ item }}
                </li>
              </ul>
            </van-popup>
            <span>周</span>
          </div>
        </div>
      </div>
    </div>
    <div class="tableContainer" :style="{ marginTop: tableMargin }">
      <div class="tableRegion">
        <table style="width: 100%">
          <tr>
            <th id="tdFormInfo">工单统计</th>
          </tr>
          <tr>
            <td><div id="divFormInfo"></div></td>
          </tr>
          <tr id="trTabBhzbl" v-show="type == 2 || type == 3">
            <th id="tdBhzbl">{{ zhiShi }}闭环指标率</th>
          </tr>
          <tr id="tdTabBhzbl" v-show="type == 2 || type == 3">
            <td>
              <div id="tabBhzblQuYu" class="tab-box" v-show="type == 2">
                <van-tabs type="card" sticky @click="handleClickQuyu">
                  <van-tab
                    v-for="item in quYuList"
                    :key="item.value"
                    :title="item.title"
                  ></van-tab>
                </van-tabs>
              </div>
              <div id="zbbhlData" style="width: 100%; height: 200px"></div>
            </td>
          </tr>
          <tr>
            <th id="tdGdbhscfx">{{ zhiShi }}工单闭环时长分析</th>
          </tr>
          <tr>
            <td>
              <div id="gdbhscfxData" style="width: 100%; height: 200px"></div>
            </td>
          </tr>
          <tr id="trTabFgs" v-show="type == 3">
            <th id="tdGdbhlpm">{{ zhiShi }}工单闭环率排名</th>
          </tr>
          <tr id="tdTabFgs" v-show="type == 3">
            <td>
              <div class="tab-box">
                <van-tabs type="card" sticky @click="handleClickFgs">
                  <van-tab
                    v-for="item in groupTypeList"
                    :key="item.value"
                    :title="item.title"
                  ></van-tab>
                </van-tabs>
                <div id="gdbhlpmData" style="width: 100%; height: 400px"></div>
              </div>
            </td>
          </tr>
          <tr>
            <th id="tdGdbhlzs">{{ zhiShi }}工单闭环率走势</th>
          </tr>
          <tr>
            <td>
              <div id="gdbhlzsData" style="width: 100%; height: 200px"></div>
            </td>
          </tr>
          <!-- <tr><th id="tdCxqzszb">差小区制式占比</th></tr>
						<tr><td><div id="cxqzszbData" style="width:100%;height:200px"></div></td></tr> -->

          <tr id="trQwfqytj" v-show="type == 1">
            <th>全网分区域统计</th>
          </tr>
          <tr id="tdQwfqytj" v-show="type == 1">
            <td>
              <div id="divQwfqytj" style="width: 100%">
                <table
                  id="tabQwfqytj"
                  class="tjTable"
                  style="text-align: center"
                >
                  <tr>
                    <th rowspan="2">区域</th>
                    <th rowspan="2">区局</th>
                    <th rowspan="2">市郊</th>
                    <th colspan="5">汇总</th>
                  </tr>
                  <tr>
                    <th>本周派发工单</th>
                    <th>总派发工单</th>
                    <th>总闭环工单</th>
                    <th>总工单闭环率</th>
                    <th>闭环率环比对比</th>
                  </tr>
                </table>
                <!-- <td id="qwfqytjContent"></td> -->
              </div>
            </td>
          </tr>
          <tr id="trQwfzbtj" v-show="type == 1">
            <th>全网分指标统计</th>
          </tr>
          <tr id="tdQwfzbtj" v-show="type == 1">
            <td>
              <div id="divQwfzbtj" style="width: 100%">
                <table
                  id="tabQwfzbtj"
                  class="tjTable"
                  style="text-align: center"
                >
                  <tr style="background: #ffff00">
                    <th>网格</th>
                    <th>策略分类</th>
                    <th>本周派发工单</th>
                    <th>总派发工单</th>
                    <th>总闭环工单</th>
                    <th>总工单闭环率</th>
                    <th>闭环率环比对比</th>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import $ from "jquery";
import { mapState } from "vuex";
import { Toast } from "vant";
import { getItem } from "@/utils/public/sessionStorage";
export default {
  name: "YhdChartNew",
  data() {
    return {
      name: "优化工单看板",
      tableMargin: "230px",
      loginNo: "", // guzi1 wanglq96
      // 下拉菜单选项
      groupId: 0, // 网格
      groupName: "全部网格",
      showGroup: false,
      groupIdOption: [],
      zhiBiaoIndex: 0,
      showZhiBiao: false,
      monIndexId: "全部指标", // 指标 全部指标传"-"
      zhiBiaoOption: [
        { name: "全部指标", value: 0 },
        { name: "3G无线接通率", value: 1 },
        { name: "VoLTE下行丢包率", value: 2 },
        {
          name: "小区载频平均接收功率",
          value: 3,
        },
        {
          name: "下行速率小于10Mbps比例",
          value: 4,
        },
        {
          name: "小区内用户下行平均速率",
          value: 5,
        },
        { name: "CS域掉话率", value: 6 },
        { name: "同频切换出成功率", value: 7 },
        {
          name: "周期性RSRP大于等于负105dB比例",
          value: 8,
        },
        {
          name: "CQI小于8的采样点比例",
          value: 9,
        },
        {
          name: "VoLTE信令ERAB建立成功率",
          value: 10,
        },
        { name: "无线接通率", value: 11 },
        { name: "单流占比", value: 12 },

        { name: "VoLTE上行丢包率", value: 13 },
        {
          name: "下行PDSCH信道PRB平均利用率",
          value: 14,
        },
        {
          name: "上行每PRB干扰噪声平均值",
          value: 15,
        },
        { name: "LTE业务掉话率", value: 16 },
        { name: "上行底噪", value: 17 },
        {
          name: "周期性RSRP＞＝－110dBm的采样点比例",
          value: 18,
        },
        { name: "上行底噪-室内监控", value: 19 },
        { name: "SA小区掉线率", value: 20 },
        {
          name: "SA小区gNB站内切换成功率",
          value: 21,
        },
        { name: "VoLTE接通率(QCI1)", value: 22 },
        { name: "VoLTE语音掉线率", value: 23 },
        { name: "SA站间切换成功率", value: 24 },
        { name: "5G倒流比", value: 25 },
        { name: "无线接入成功率", value: 26 },
      ],
      // 制式列表
      zhishiList: [
        { name: "全部", value: -1 },
        { name: "3G", value: 2 },
        { name: "4G", value: 4 },
        { name: "5G", value: 5 },
      ],
      zhiShi: "全部",
      modeId: -1, // 制式

      //页面筛选参数
      groupType: "", //空-全部，1-市区，2-大郊，3-小郊
      groupTypeList: [
        { title: "全部", value: 0, groupType: null },
        { title: "市区", value: 1, groupType: 1 },
        { title: "大郊", value: 2, groupType: 2 },
        { title: "小郊", value: 3, groupType: 3 },
      ],
      quYu: "东北", //东北，西北，南区
      quYuList: [
        { title: "东北", value: 0 },
        { title: "西北", value: 1 },
        { title: "南区", value: 2 },
      ],
      type: 1, // 1全市，2区域，3网格
      userAuth: 0, //用户角色 1:一级权限“全市、区域、网格”、2:二级权限“网格”
      userAuthIndex: 0,
      userAuthList: [
        { name: "全市", value: 0 },
        { name: "区域", value: 1 },
        { name: "网格", value: 2 },
      ],
      // 弹出框
      datePopShow: false,
      weekPopShow: false,
      // 时间选择器
      minDate: new Date(1950, 0, 1),
      maxDate: new Date(2100, 10, 1),
      currentDate: new Date(),
      pickDate: "请选择",
      pickWeek: "请选择",
      weekList: ["1", "2", "3", "4", "5", "取消"],
      // weekList: [{name: '1'},{name: '2'},{name: '3'},{name: '4'},{name: '5'}],
      currentWeek: null,
      // 日期
      weekIndex: "", // 第几周
      month: "", // 年月
      //指标闭环率
      labZbbhlArr: [], // 指标名称
      dataZbwgbhlArr: [], //网格闭环率
      dataZbDbbhlArr: [], //东北闭环率
      dataZbXbbhlArr: [], //西北闭环率
      dataZbNqbhlArr: [], //南区闭环率
      dataZbwgbhlVsCityArr: [], //网格闭环率（与全市差值）
      dataZbDbbhlVsCityArr: [], //东北闭环率（与全市差值）
      dataZbXbbhlVsCityArr: [], //西北闭环率（与全市差值）
      dataZbNqbhlVsCityArr: [], //南区闭环率（与全市差值）
    };
  },
  computed: {
    // 根据天数得到周几
    /* weekIndex() {
      let week = new Array(0, 1, 2, 3, 4, 5, 6);
      return week[new Date(this.date).getDay()];
    }, */
    ...mapState("yhdChartNew", ["settingInfo", "tableInfo"]),
  },
  watch: {
    // 监视zhiBiaoIndex 获取最新的monIndexId
    /* zhiBiaoIndex(newvalue) {
      this.monIndexId = this.zhiBiaoOption[newvalue].option;
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      this.getTableInfo();
    }, */
    // 监视groupId 用户选中发送请求
    groupId() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      this.getTableInfo();
    },
  },
  methods: {
    dateShowPopup() {
      this.datePopShow = true;
    },
    weekShowPopup() {
      this.weekPopShow = true;
    },
    // 时间选择器
    formatter(type, val) {
      if (type === "year") {
        return `${val}年`;
      } else if (type === "month") {
        return `${val}月`;
      }
      return val;
    },
    confirmDate(value) {
      let y = new Date(value).getFullYear();
      let m = new Date(value).getMonth() + 1;
      this.month = y.toString() + "-" + this.addZero(m.toString());
      this.datePopShow = false;
      // 选择日期时 强制将weekIndex改为1
      this.weekIndex = "1";
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      // 发送请求
      this.getTableInfo();
    },
    // 补零
    addZero(num) {
      return num < 10 ? "0" + num : num;
    },
    clickWeek(item, index) {
      if (item !== "取消") {
        this.weekIndex = item;
        this.currentWeek = index;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        // 发送请求
        this.getTableInfo();
      }
      this.weekPopShow = false;
    },
    onSelectInteCell(item) {
      this.groupName = item.name;
      this.groupId = item.value;
      // this.userAuthIndex = item.value
    },
    // 改变指标下拉菜单
    // changeZhiBiao (value) {
    //   this.monIndexId = this.zhiBiaoOption[value].option;
    //   document.body.scrollTop = document.documentElement.scrollTop = 0;
    //   this.getTableInfo();
    // },
    onSelectZhiBiao(item) {
      this.monIndexId = item.name;
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      this.getTableInfo();
    },
    // 获取第一个请求回来的groupList
    async getSettingInfo() {
      try {
        await this.$store.dispatch("yhdChartNew/getSettingInfo", this.loginNo);
        console.log("settingInfo", this.settingInfo);
        // 获取groupList
        let groupList = this.settingInfo.groupList;
        let userAuth = this.settingInfo.userAuth;
        // 获取groupName呈现在页面的网格下拉菜单中
        let groupIdOption = [];
        for (let i in groupList) {
          let obj = {};
          obj.name = groupList[i].groupName;
          obj.value = groupList[i].groupId;
          groupIdOption.push(obj);
        }
        // this.groupIdOption = [...this.groupIdOption, ...groupIdOption]
        this.groupIdOption = groupIdOption;
        // this.groupId = groupList[0].groupId;
        // 获取userAuth 1:一级权限“全市、区域、网格”、2:二级权限“网格”
        this.userAuth = userAuth;
        // this.userAuth = 2; // 测试
        // userAuth为2时 type设置为3
        if (this.userAuth == 2) this.type = 3;
        // 请求表格数据 当groupId有值的时候，groupId变化会请求一次数据
        /* if (this.groupId == 0) {
          this.getTableInfo();
        } */
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.getTableInfo();
      } catch (error) {
        console.log("err", error);
      }
    },
    // 获取第二个请求数据
    async getTableInfo() {
      try {
        let type = this.type;
        let modeId = this.modeId;
        let monIndexId = this.monIndexId;
        let groupType = this.groupType;
        let groupId = this.groupId;
        let month = this.month;
        let weekIndex = this.weekIndex;
        let loginNo = this.loginNo;
        if (this.monIndexId == "全部指标") monIndexId = "-";
        let postData = {
          type,
          modeId,
          monIndexId,
          groupType,
          groupId,
          month,
          weekIndex,
          loginNo,
        };
        // document.body.scrollTop = document.documentElement.scrollTop = 0;
        await this.$store.dispatch(
          "yhdChartNew/getTableInfo",
          JSON.stringify(postData)
        );
        let tableInfo = this.tableInfo;
        console.log("tableInfo", tableInfo);
        // 设置表单数据 工单统计
        this.setFormInfo("divFormInfo", tableInfo.yhdFromInfos);
        //指标闭环率
        this.setZbbhlInfo(tableInfo.yhdIndexCloseRatios);
        //工单闭环时长分析
        this.setGdbhscfxInfo(tableInfo.yhdCloseDurationAnalyzes);
        //工单闭环率排名
        this.setGdbhlpmInfo(tableInfo.yhdGroupCloseRatioRankings);
        //工单闭环率走势
        this.setGdbhlzsInfo(tableInfo.yhdStatCloseTrends);
        //全网分区域统计
        this.setQwfqytjInfo(tableInfo.allCityStatisArr);
        //全网分指标统计
        this.setQwfzbtjInfo(tableInfo.allIndexStatisArr);
      } catch (error) {
        console.log("err", error);
      }
    },

    // 点击区域 东北 西北 南区
    handleClickQuyu(index, title) {
      // Toast(title);
      this.quYu = title;
      this.setZbbhlInfoDetail();
    },
    // 点击分公司类别 groupType 空-全部、1-市区、2-大郊、3-小郊
    handleClickFgs(index, title) {
      // Toast(title);
      this.groupType = this.groupTypeList[index].groupType;
      this.getTableInfo();
    },

    // 选中全市 区域 网格按钮
    clickUserAuth(item) {
      this.userAuthIndex = item.value;
      // 改变type值
      this.type = item.value + 1;
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      this.getTableInfo();
    },
    // 选中制式按钮
    clickZhiShi(item) {
      this.modeId = item.value;
      this.zhiShi = item.name;
      this.monIndexId = "全部指标";
      this.zhiBiaoIndex = 0;
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      // 制式不同 指标的下拉区域不同
      if (this.modeId == -1) {
        this.zhiBiaoOption = [
          { name: "全部指标", value: 0 },
          { name: "3G无线接通率", value: 1 },
          { name: "VoLTE下行丢包率", value: 2 },
          {
            name: "小区载频平均接收功率",
            value: 3,
          },
          {
            name: "下行速率小于10Mbps比例",
            value: 4,
          },
          {
            name: "小区内用户下行平均速率",
            value: 5,
          },
          { name: "CS域掉话率", value: 6 },
          { name: "同频切换出成功率", value: 7 },
          {
            name: "周期性RSRP大于等于负105dB比例",
            value: 8,
          },
          {
            name: "CQI小于8的采样点比例",
            value: 9,
          },
          {
            name: "VoLTE信令ERAB建立成功率",
            value: 10,
          },
          { name: "无线接通率", value: 11 },
          { name: "单流占比", value: 12 },

          { name: "VoLTE上行丢包率", value: 13 },
          {
            name: "下行PDSCH信道PRB平均利用率",
            value: 14,
          },
          {
            name: "上行每PRB干扰噪声平均值",
            value: 15,
          },
          { name: "LTE业务掉话率", value: 16 },
          { name: "上行底噪", value: 17 },
          {
            name: "周期性RSRP＞＝－110dBm的采样点比例",
            value: 18,
          },
          { name: "上行底噪-室内监控", value: 19 },
          { name: "SA小区掉线率", value: 20 },
          {
            name: "SA小区gNB站内切换成功率",
            value: 21,
          },
          { name: "VoLTE接通率(QCI1)", value: 22 },
          { name: "VoLTE语音掉线率", value: 23 },
          { name: "SA站间切换成功率", value: 24 },
          { name: "5G倒流比", value: 25 },
          { name: "无线接入成功率", value: 26 },
        ];
      } else if (this.modeId == 2) {
        // 3G
        this.zhiBiaoOption = [
          { name: "全部指标", value: 0 },
          { name: "3G无线接通率", value: 1 },
          {
            name: "小区载频平均接收功率",
            value: 2,
          },
          { name: "CS域掉话率", value: 3 },
        ];
      } else if (this.modeId == 4) {
        // 4G
        this.zhiBiaoOption = [
          { name: "全部指标", value: 0 },
          { name: "无线接通率", value: 1 },
          { name: "LTE业务掉话率", value: 2 },
          { name: "同频切换出成功率", value: 3 },
          {
            name: "周期性RSRP大于等于负105dB比例",
            value: 4,
          },
          {
            name: "CQI小于8的采样点比例",
            value: 5,
          },
          {
            name: "下行速率小于10Mbps比例",
            value: 6,
          },
          { name: "单流占比", value: 7 },
          { name: "上行底噪", value: 8 },
          {
            name: "VoLTE信令ERAB建立成功率",
            value: 9,
          },
          { name: "VoLTE下行丢包率", value: 10 },
          { name: "VoLTE上行丢包率", value: 11 },
          {
            name: "周期性RSRP＞＝－110dBm的采样点比例",
            value: 12,
          },
          { name: "上行底噪-室内监控", value: 13 },
          { name: "VoLTE接通率(QCI1)", value: 14 },
          { name: "VoLTE语音掉线率", value: 15 },
        ];
      } else if (this.modeId == 5) {
        // 5G
        this.zhiBiaoOption = [
          { name: "全部指标", value: 0 },
          { name: "无线接入成功率", value: 1 },
          /* { name: "SgNB添加成功率", value: 1, option: "SgNB添加成功率" },
          { name: "SgNB掉线率", value: 2, option: "SgNB掉线率" },
          {
            name: "SgNB_Pscell站内更换成功率",
            value: 3,
            option: "SgNB_Pscell站内更换成功率",
          },
          {
            name: "SgNB_Pscell站间更换成功率",
            value: 4,
            option: "SgNB_Pscell站间更换成功率",
          }, */
          {
            name: "小区内用户下行平均速率",
            value: 2,
          },
          {
            name: "下行PDSCH信道PRB平均利用率",
            value: 3,
          },
          {
            name: "上行每PRB干扰噪声平均值",
            value: 4,
          },
          {
            name: "SA小区掉线率",
            value: 5,
          },
          {
            name: "SA小区gNB站内切换成功率",
            value: 6,
          },
          { name: "SA站间切换成功率", value: 7 },
          { name: "5G倒流比", value: 8 },
        ];
      }
      // 发送请求
      this.getTableInfo();
    },
    // 表单数据 创建元素节点
    setFormInfo(tableId, jsondata) {
      let table = document.createElement("table");
      document.getElementById(tableId).innerHTML = "";
      let tr, td;
      if (jsondata.length > 0) {
        //如果有数据
        table.className = "imagetable";
        table.style = "width:100%;border-collapse:collapse;text-align:left;";
        for (let info in jsondata) {
          tr = document.createElement("tr");
          for (let cell in jsondata[info]) {
            td = document.createElement("td");
            td.appendChild(document.createTextNode(jsondata[info][cell]));
            //td.style.color = cellData.split('|')[2];
            //td.style.width = cellData.split('|')[3]+"px";
            if (info == 0 || cell == 0)
              //第一行或第一列加粗
              td.style.fontWeight = "bold";
            td.style.height = "30px";
            td.style.border = "1px solid #999";
            td.style.paddingLeft = "5px";
            tr.appendChild(td);
          }
          table.appendChild(tr);
        }
      } else {
        //如果没有数据，则自动加没有数据一行
        tr = document.createElement("tr");
        td = document.createElement("td");
        td.appendChild(document.createTextNode("没有查询到数据"));
        td.setAttribute("colspan", 100);
        tr.appendChild(td);
        table.appendChild(tr);
      }

      document.getElementById(tableId).appendChild(table);
    },

    // 指标闭环率初始化
    setZbbhlInfo(yhdIndexCloseRatios) {
      let zbbhlHeight = 25;
      // 初始化
      this.labZbbhlArr = []; // 指标名称
      this.dataZbwgbhlArr = []; //网格闭环率
      this.dataZbDbbhlArr = []; //东北闭环率
      this.dataZbXbbhlArr = []; //西北闭环率
      this.dataZbNqbhlArr = []; //南区闭环率
      this.dataZbwgbhlVsCityArr = []; //网格闭环率（与全市差值）
      this.dataZbDbbhlVsCityArr = []; //东北闭环率（与全市差值）
      this.dataZbXbbhlVsCityArr = []; //西北闭环率（与全市差值）
      this.dataZbNqbhlVsCityArr = []; //南区闭环率（与全市差值）
      for (let i in yhdIndexCloseRatios) {
        this.labZbbhlArr.push(yhdIndexCloseRatios[i].monIndexId); //指标名称

        for (let j in yhdIndexCloseRatios[i].yhdIndexCloseLevelTwos) {
          //内容
          let closeRat = yhdIndexCloseRatios[i].yhdIndexCloseLevelTwos[j];
          let chazhi = closeRat.vsCityRatio; //网格/区域-全市的差值，复数标识网格差，正数表示网格/区域好
          let areaRatio = closeRat.closeRatio; //网格/区域
          if (chazhi > 0) {
            //网格/区域比全市好
            if (closeRat.closeRatioName == "网格") {
              this.dataZbwgbhlArr.push(areaRatio - chazhi);
              this.dataZbwgbhlVsCityArr.push(chazhi);
            } else if (closeRat.closeRatioName == "东北") {
              this.dataZbDbbhlArr.push(areaRatio - chazhi);
              this.dataZbDbbhlVsCityArr.push(chazhi);
            } else if (closeRat.closeRatioName == "西北") {
              this.dataZbXbbhlArr.push(areaRatio - chazhi);
              this.dataZbXbbhlVsCityArr.push(chazhi);
            } else if (closeRat.closeRatioName == "南区") {
              this.dataZbNqbhlArr.push(areaRatio - chazhi);
              this.dataZbNqbhlVsCityArr.push(chazhi);
            } else {
            }
          } else {
            //网格比全市差
            if (closeRat.closeRatioName == "网格") {
              this.dataZbwgbhlArr.push(areaRatio);
              this.dataZbwgbhlVsCityArr.push(chazhi);
            } else if (closeRat.closeRatioName == "东北") {
              this.dataZbDbbhlArr.push(areaRatio);
              this.dataZbDbbhlVsCityArr.push(chazhi);
            } else if (closeRat.closeRatioName == "西北") {
              this.dataZbXbbhlArr.push(areaRatio);
              this.dataZbXbbhlVsCityArr.push(chazhi);
            } else if (closeRat.closeRatioName == "南区") {
              this.dataZbNqbhlArr.push(areaRatio);
              this.dataZbNqbhlVsCityArr.push(chazhi);
            } else {
            }
          }
        }
        zbbhlHeight += 25;
      }
      $("#zbbhlData").height(zbbhlHeight + "px");
      //根据网格或区域显示图表
      this.setZbbhlInfoDetail();
    },

    // 指标闭环率信息细节
    setZbbhlInfoDetail() {
      // 初始化数据
      let tempDataZbwgbhlArr = [];
      let tempDataZbVsCity = [];
      if (this.type == 1) {
        //全市
      } else if (this.type == 2) {
        //区域
        if (this.quYu == "东北") {
          tempDataZbwgbhlArr = this.dataZbDbbhlArr;
          tempDataZbVsCity = this.dataZbDbbhlVsCityArr;
        } else if (this.quYu == "西北") {
          tempDataZbwgbhlArr = this.dataZbXbbhlArr;
          tempDataZbVsCity = this.dataZbXbbhlVsCityArr;
        } else if (this.quYu == "南区") {
          tempDataZbwgbhlArr = this.dataZbNqbhlArr;
          tempDataZbVsCity = this.dataZbNqbhlVsCityArr;
        }
      } else if (this.type == 3) {
        //网格
        tempDataZbwgbhlArr = this.dataZbwgbhlArr;
        tempDataZbVsCity = this.dataZbwgbhlVsCityArr;
      }
      let labZbbhlArr = this.labZbbhlArr;
      //设置图表
      console.log("tempDataZbVsCity", tempDataZbVsCity);

      this.setzbbhlChartData(labZbbhlArr, tempDataZbwgbhlArr, tempDataZbVsCity);
    },

    // 工单闭环时长分析
    setGdbhscfxInfo(yhdCloseDurationAnalyzes) {
      let labArr = new Array(); //名称
      let dataArr = new Array(); //时长
      for (let i in yhdCloseDurationAnalyzes) {
        labArr.push(yhdCloseDurationAnalyzes[i].areaName); //区域名称
        dataArr.push(yhdCloseDurationAnalyzes[i].durationCount); //时长
      }

      //设置图表
      this.setGdbhscfxChartData(labArr, dataArr);
    },

    // 工单闭环率排名
    setGdbhlpmInfo(yhdGroupCloseRatioRankings) {
      let labgdbhpmArr = new Array();
      let datadbhpmArr = new Array();
      let gdbhlpmHeight = 25;
      for (let i in yhdGroupCloseRatioRankings) {
        labgdbhpmArr.push(yhdGroupCloseRatioRankings[i].groupName);
        datadbhpmArr.push(yhdGroupCloseRatioRankings[i].closeRatio);
        gdbhlpmHeight += 25;
      }
      $("#gdbhlpmData").height(gdbhlpmHeight + "px");
      //设置图表
      this.setGdbhlpmChartData(labgdbhpmArr, datadbhpmArr, gdbhlpmHeight);
    },

    // 工单闭环率走势
    setGdbhlzsInfo(yhdStatCloseTrends) {
      let labDateArr = new Array();
      let labAreaArr = new Array();
      let dataArr = new Array();
      for (let i in yhdStatCloseTrends) {
        if (i == 0) {
          //因为日期数据都一样，所以就取一次，避免数组倍数扩大
          for (let j in yhdStatCloseTrends[i].statDates) {
            labDateArr.push(yhdStatCloseTrends[i].statDates[j]);
          }
        }
        labAreaArr.push(yhdStatCloseTrends[i].closeName);
        dataArr.push(yhdStatCloseTrends[i].closeRatios);
      }
      //设置图表
      this.setGdbhlzsChartData(labDateArr, labAreaArr, dataArr);
    },

    // 全网分区域统计
    setQwfqytjInfo(allCityStatisArr) {
      let table = document.getElementById("tabQwfqytj");
      table.innerHTML = "";
      let firstTr = `<tr>
                    <th rowspan="2" style="padding:8px;background:linear-gradient(to right, #e9f0ff, white);border:1px solid #999999;">区域</th>
                    <th rowspan="2" style="padding:8px;background:linear-gradient(to right, #e9f0ff, white);border:1px solid #999999;">区局</th>
                    <th rowspan="2" style="padding:8px;background:linear-gradient(to right, #e9f0ff, white);border:1px solid #999999;">市郊</th>
                    <th colspan="5" style="padding:8px;background:linear-gradient(to right, #e9f0ff, white);border:1px solid #999999;">汇总</th>
                  </tr>
                  <tr>
                    <th style="padding:8px;border: 1px solid #999999;background:linear-gradient(to right, #e9f0ff, white)">本周派发工单</th>
                    <th style="padding:8px;border: 1px solid #999999;background:linear-gradient(to right, #e9f0ff, white)">总派发工单</th>
                    <th style="padding:8px;border: 1px solid #999999;background:linear-gradient(to right, #e9f0ff, white)">总闭环工单</th>
                    <th style="padding:8px;border: 1px solid #999999;background:linear-gradient(to right, #e9f0ff, white)">总工单闭环率</th>
                    <th style="padding:8px;border: 1px solid #999999;background:linear-gradient(to right, #e9f0ff, white)">闭环率环比对比</th>
                  </tr>`;
      table.insertAdjacentHTML("afterbegin", firstTr);
      let tr, td;
      for (let i in allCityStatisArr) {
        for (let j in allCityStatisArr[i].statisArr) {
          tr = document.createElement("tr");
          let tdBgColor = "white";
          let tdTxtColor = "black";
          if (j == 0) {
            //第1行（第1列合并列）
            td = document.createElement("td");
            td.appendChild(
              document.createTextNode(allCityStatisArr[i].areaName)
            );
            td.setAttribute("rowspan", allCityStatisArr[i].statisArr.length);
            td.style.border = "1px solid #999999";
            td.style.padding = "8px";
            tr.appendChild(td);
            // tdBgColor = "green";
            // tdTxtColor = "white";
          } else if (j == allCityStatisArr[i].statisArr.length - 1) {
            //最后1行
            // tdBgColor = "red";
            // tdTxtColor = "white";
          }

          td = document.createElement("td");
          td.style.background = tdBgColor;
          td.style.color = tdTxtColor;
          td.style.border = "1px solid #999999";
          td.style.padding = "8px";
          td.appendChild(
            document.createTextNode(allCityStatisArr[i].statisArr[j].dist)
          );
          tr.appendChild(td);
          td = document.createElement("td");
          td.style.background = tdBgColor;
          td.style.color = tdTxtColor;
          td.style.border = "1px solid #999999";
          td.style.padding = "8px";
          td.appendChild(
            document.createTextNode(allCityStatisArr[i].statisArr[j].city)
          );
          tr.appendChild(td);
          td = document.createElement("td");
          td.style.background = tdBgColor;
          td.style.color = tdTxtColor;
          td.style.border = "1px solid #999999";
          td.style.padding = "8px";
          td.appendChild(
            document.createTextNode(
              allCityStatisArr[i].statisArr[j].acceptCountWeek
            )
          );
          tr.appendChild(td);
          td = document.createElement("td");
          td.style.background = tdBgColor;
          td.style.color = tdTxtColor;
          td.style.border = "1px solid #999999";
          td.style.padding = "8px";
          td.appendChild(
            document.createTextNode(
              allCityStatisArr[i].statisArr[j].acceptCount
            )
          );
          tr.appendChild(td);
          td = document.createElement("td");
          td.style.background = tdBgColor;
          td.style.color = tdTxtColor;
          td.style.border = "1px solid #999999";
          td.style.padding = "8px";
          td.appendChild(
            document.createTextNode(allCityStatisArr[i].statisArr[j].closeCount)
          );
          tr.appendChild(td);
          td = document.createElement("td");
          td.style.background = tdBgColor;
          td.style.color = tdTxtColor;
          td.style.border = "1px solid #999999";
          td.style.padding = "8px";
          td.appendChild(
            document.createTextNode(allCityStatisArr[i].statisArr[j].closeRatio)
          );
          tr.appendChild(td);
          td = document.createElement("td");
          td.style.background = tdBgColor;
          td.style.color = tdTxtColor;
          td.style.border = "1px solid #999999";
          td.style.padding = "8px";
          td.appendChild(
            document.createTextNode(
              allCityStatisArr[i].statisArr[j].closeRatioHb
            )
          );
          tr.appendChild(td);

          table.appendChild(tr);
        }
      }
    },

    // 全网分指标统计
    setQwfzbtjInfo(allIndexStatisArr) {
      let table = document.getElementById("tabQwfzbtj");
      table.innerHTML = "";
      let firstTr = `<tr>
                    <th style="padding:8px;border: 1px solid #999999;background:linear-gradient(to right, #e9f0ff, white)">网格</th>
                    <th style="padding:8px;border: 1px solid #999999;background:linear-gradient(to right, #e9f0ff, white)">策略分类</th>
                    <th style="padding:8px;border: 1px solid #999999;background:linear-gradient(to right, #e9f0ff, white)">本周派发工单</th>
                    <th style="padding:8px;border: 1px solid #999999;background:linear-gradient(to right, #e9f0ff, white)">总派发工单</th>
                    <th style="padding:8px;border: 1px solid #999999;background:linear-gradient(to right, #e9f0ff, white)">总闭环工单</th>
                    <th style="padding:8px;border: 1px solid #999999;background:linear-gradient(to right, #e9f0ff, white)">总工单闭环率</th>
                    <th style="padding:8px;border: 1px solid #999999;background:linear-gradient(to right, #e9f0ff, white)">闭环率环比对比</th>
                  </tr>`;
      table.insertAdjacentHTML("afterbegin", firstTr);
      let tr, td;
      for (let i in allIndexStatisArr) {
        for (let j in allIndexStatisArr[i].statisArr) {
          tr = document.createElement("tr");
          if (j == 0) {
            td = document.createElement("td");
            td.appendChild(document.createTextNode(allIndexStatisArr[i].mode));
            td.setAttribute("rowspan", allIndexStatisArr[i].statisArr.length);
            td.style.border = "1px solid #999999";
            td.style.padding = "8px";
            tr.appendChild(td);
          }

          td = document.createElement("td");
          td.appendChild(
            document.createTextNode(allIndexStatisArr[i].statisArr[j].monIndex)
          );
          td.style.border = "1px solid #999999";
          td.style.padding = "8px";
          tr.appendChild(td);
          td = document.createElement("td");
          td.appendChild(
            document.createTextNode(
              allIndexStatisArr[i].statisArr[j].acceptCountWeek
            )
          );
          td.style.border = "1px solid #999999";
          td.style.padding = "8px";
          tr.appendChild(td);
          td = document.createElement("td");
          td.appendChild(
            document.createTextNode(
              allIndexStatisArr[i].statisArr[j].acceptCount
            )
          );
          td.style.border = "1px solid #999999";
          td.style.padding = "8px";

          tr.appendChild(td);
          td = document.createElement("td");
          td.appendChild(
            document.createTextNode(
              allIndexStatisArr[i].statisArr[j].closeCount
            )
          );
          td.style.border = "1px solid #999999";
          td.style.padding = "8px";
          tr.appendChild(td);
          td = document.createElement("td");
          td.appendChild(
            document.createTextNode(
              allIndexStatisArr[i].statisArr[j].closeRatio
            )
          );
          td.style.border = "1px solid #999999";
          td.style.padding = "8px";
          tr.appendChild(td);
          td = document.createElement("td");
          td.appendChild(
            document.createTextNode(
              allIndexStatisArr[i].statisArr[j].closeRatioHb
            )
          );
          td.style.border = "1px solid #999999";
          td.style.padding = "8px";
          tr.appendChild(td);

          table.appendChild(tr);
        }
      }
    },

    // 动态组合图标的Data
    getChartData(chartType, nameList, valueList) {
      // console.log(nameList);
      // console.log(valueList);

      let jsonstr = [];
      for (let i = 0; i < nameList.length; i++) {
        let json = {};
        json.name = nameList[i];
        json.data = valueList[i];
        json.type = chartType;
        jsonstr.push(json);
      }

      return jsonstr;
    },

    // 指标闭环率（图表）
    setzbbhlChartData(labArr, dataWgArr, dataQsArr) {
      // let myChart = echarts.init(document.getElementById("zbbhlData"));
      let myChart = echarts.getInstanceByDom(
        document.getElementById("zbbhlData")
      );
      if (myChart == null) {
        myChart = echarts.init(document.getElementById("zbbhlData"));
      }

      //指定图表的配置项和数据
      let option = {
        grid: {
          x: 10,
          y: 20,
          x2: 40,
          y2: 25,
          containLabel: true,
        },
        legend: {
          data: ["闭环率", "与全市闭环率对比"],
        },
        //x轴
        xAxis: {
          type: "value", //值
          axisLabel: {
            show: false,
          },
        },
        //y轴没有显式设置，根据值自动生成y轴
        yAxis: {
          type: "category", //类别
          axisLabel: {
            interval: 0,
          },
          data: labArr,
        },
        //数据-data是最终要显示的数据
        series: [
          {
            name: "闭环率",
            type: "bar",
            stack: "闭环率",
            label: {
              formatter: "{c}%",
              //show : true,//显示数字
              position: "right",
            },
            itemStyle: {
              color: "#61a0a8", //柱状的颜色
            },
            data: dataWgArr,
          },
          {
            name: "与全市闭环率对比",
            type: "bar",
            stack: "闭环率",
            label: {
              formatter: function (params) {
                var chazhi = parseFloat(params.value).toFixed(2);
                if (chazhi > 0) return "↑" + chazhi + "%";
                else return "↓" + chazhi + "%";
              },
              show: true, //显示数字
              position: "right",
            },
            itemStyle: {
              color: "#FF0000", //柱状的颜色
            },
            data: dataQsArr,
          },
        ],
      };
      //使用刚刚指定的配置项和数据项显示图表
      myChart.clear();
      myChart.setOption(option);
      window.onresize = myChart.resize(); //大小有变化，需要重新加载
    },

    // 工单闭环时长分析
    setGdbhscfxChartData(labArr, dataArr) {
      //labArr=["东北","西北","南区"];
      //dataArr=[[100,110,120,130],[120,130,140,150],[130,140,150,160]];
      let myChart = echarts.getInstanceByDom(
        document.getElementById("gdbhscfxData")
      );
      if (myChart == null) {
        myChart = echarts.init(document.getElementById("gdbhscfxData"));
      }

      //指定图表的配置项和数据
      let option = {
        grid: {
          x: 15,
          y: 20,
          x2: 10,
          y2: 15,
          containLabel: true,
        },
        legend: {
          data: labArr,
        },
        //x轴
        xAxis: {
          type: "category", //类别
          axisLabel: {
            interval: 0,
            rotate: 30,
            show: true,
          },
          data: ["1-3天", "4-7天", "8-10天", "10天以上"],
        },
        //y轴
        yAxis: {
          type: "value", //值
          axisLabel: {
            interval: 0,
          },
        },
        //数据-data是最终要显示的数据
        series: this.getChartData("bar", labArr, dataArr),
      };

      //使用刚刚指定的配置项和数据项显示图表
      myChart.clear();
      myChart.setOption(option);
      window.onresize = function () {
        myChart.resize(); //大小有变化，需要重新加载
      };
    },

    // 工单闭环率排名
    setGdbhlpmChartData(labArr, dataArr) {
      // let myChart = echarts.init(document.getElementById("gdbhlpmData"));
      let myChart = echarts.getInstanceByDom(
        document.getElementById("gdbhlpmData")
      );
      if (myChart == null) {
        myChart = echarts.init(document.getElementById("gdbhlpmData"));
      }

      //指定图表的配置项和数据
      let option = {
        grid: {
          x: 20,
          y: 20,
          x2: 50,
          y2: 25,
          containLabel: true,
        },
        //x轴
        xAxis: {
          type: "value", //值
          axisLabel: {
            show: false,
          },
        },
        //y轴没有显式设置，根据值自动生成y轴
        yAxis: {
          type: "category", //类别
          axisLabel: {
            interval: 0,
          },
          data: labArr,
        },
        //数据-data是最终要显示的数据
        series: [
          {
            name: "指标闭环率",
            type: "bar",
            label: {
              formatter: "{c}%",
              show: true, //显示数字
              position: "right",
            },
            itemStyle: {
              color: "#91c7ae", //柱状的颜色
            },
            data: dataArr,
          },
        ],
      };
      myChart.clear();
      //使用刚刚指定的配置项和数据项显示图表
      myChart.setOption(option);
      window.onresize = myChart.resize();
    },

    // 工单闭环率走势(折线图)
    setGdbhlzsChartData(labDateArr, labAreaArr, dataArr) {
      // let myChart = echarts.init(document.getElementById("gdbhlzsData"));
      let myChart = echarts.getInstanceByDom(
        document.getElementById("gdbhlzsData")
      );
      if (myChart == null) {
        myChart = echarts.init(document.getElementById("gdbhlzsData"));
      }
      //指定图表的配置项和数据
      let option = {
        grid: {
          x: 45,
          y: 35,
          x2: 10,
          y2: 45,
        },
        legend: {
          data: labAreaArr,
        },
        //x轴
        xAxis: {
          axisLabel: {
            interval: 0,
            rotate: 30,
          },
          data: labDateArr,
        },
        //y轴没有显式设置，根据值自动生成y轴
        yAxis: {
          axisLabel: {
            interval: 0,
            formatter: "{value}%",
          },
        },
        //数据-data是最终要显示的数据
        series: this.getChartData("line", labAreaArr, dataArr),
      };
      myChart.clear();
      //使用刚刚指定的配置项和数据项显示图表
      myChart.setOption(option);
    },

    //差小区制式占比
    setCxqzszbData(servicedata) {
      // let myChart = echarts.init(document.getElementById("cxqzszbData"));
      let myChart = echarts.getInstanceByDom(
        document.getElementById("cxqzszbData")
      );
      if (myChart == null) {
        myChart = echarts.init(document.getElementById("cxqzszbData"));
      }

      //指定图表的配置项和数据
      let option = {
        series: [
          {
            name: this.title,
            type: "pie",
            selectedMode: "single",
            //radius: ['50%', '70%'],
            clockwise: false,
            label: {
              position: "outside", // 设置标签向外
              formatter: "{b}：{c}%",
            },
            data: servicedata,
          },
        ],
        graphic: {
          // 添加原生图形元素组件
          elements: [
            {
              type: "text", // 组件类型
              left: "center", //定位
              top: "43%", // 定位
              style: {
                // 样式
                text: "", //文字
                fontSize: 13, //文字大小
                textAlign: "center", //定位
                width: 30,
                height: 30,
                fill: "darkgray", // 字体颜色
              },
            },
          ],
        },
      };
      myChart.setOption(option);
    },
  },
  mounted() {
    this.tableMargin = this.$refs.static.clientHeight + 10 + "px";
  },
  created() {
    let userIds = getItem("loginInfo").userIds;
    userIds.forEach((e) => {
      if (e.sysId == 3) {
        this.loginNo = e.accountId;
      }
    });
    // 发送第一个请求获取用户权限
    this.getSettingInfo();
    let y = new Date().getFullYear();
    let m = new Date().getMonth() + 1;
    this.month = y.toString() + "-" + this.addZero(m.toString());
    this.weekIndex = 1;
    this.getTableInfo();
  },
};
</script>

<style scoped lang="less">
@fontSizeSmall: 12px;
@bgColor: #245bef;
@borderColor: #ebedf0;
.yhgd {
  width: 100%;
  height: 2000px;
  position: relative;
  font-size: @fontSizeSmall;
  .static {
    z-index: 900; // 放在echarts图表浮在盒子上
    position: fixed;
    top: 0;
    width: 100%;
    max-width: 640px;
    background-color: #fff;
    .settingRegion {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 185px;
      .activeButton {
        background-color: @bgColor;
        color: #fff;
      }
      .authority {
        width: 90%;
        margin: 5px auto;
        // border-radius: 5px;
        // border: 1px solid #ebedf0;
        .van-button {
          width: 33%;
          height: 30px;
          font-size: 14px;
          &:first-child {
            border-radius: 5px 0 0 5px;
          }
          &:last-child {
            border-radius: 0 5px 5px 0;
          }
        }
      }
      .buttonList {
        width: 90%;
        margin: 0 auto;
        .van-button {
          width: 25%;
          height: 30px;
          font-size: 14px;
          &:first-child {
            border-radius: 5px 0 0 5px;
          }
          &:last-child {
            border-radius: 0 5px 5px 0;
          }
        }
      }
      .selectRegion {
        margin: 0 auto;
        width: 90%;
        line-height: 30px;
        display: flex;
        font-size: 14px;
        .label {
          display: inline-block;
          width: 18%;
          // line-height: 30px;
          text-align: left;
        }
        .after::after {
          content: "▼";
          margin-left: -25px;
          color: gray;
        }
        input {
          width: 220px;
          height: 30px;
          color: gray;
          box-shadow: 0.3px 0.3px;
          margin-left: 6 px;
          padding: 0 8px;
          box-sizing: border-box;
        }
        .van-dropdown-menu {
          width: 82%;
          margin-left: 10px;
        }
        ::v-deep.van-dropdown-menu__bar {
          width: 100%;
          height: 30px !important;
          border: 1px solid @borderColor;
          .van-dropdown-menu__title {
            width: 100%;
            text-align: left;
            // font-size: @fontSizeSmall;
            font-size: 14px;
            color: grey;
            &::after {
              right: 10px;
            }
          }
        }
      }

      .dateRegion {
        display: flex;
        justify-content: space-between;
        width: 90%;
        margin: 0 auto;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        .date {
          display: flex;
          // width: 40%;
          flex: 1;
        }
        .week {
          display: flex;
          width: 35%;
          .pickWeek {
            background-color: @bgColor;
          }
          li {
            font-size: 18px;
          }
        }
        .van-cell__value--alone {
          text-align: left;
          text-indent: 2px;
          font-size: 14px;
          border: 1px solid @borderColor;
          line-height: 30px;
          height: 30px;
          padding: 0 5px;
          &::after {
            position: absolute;
            top: 50%;
            right: 10px;
            margin-top: -4px;
            border: 3px solid;
            border-color: transparent transparent #dcdee0 #dcdee0;
            transform: rotate(-45deg);
            opacity: 0.8;
            content: "";
          }
        }
      }
    }
  }
  .tableContainer {
    width: 95%;
    margin: 230px auto 0;
    .tableRegion {
      width: 100%;
      table {
        border: 1px solid #999999;
        border-collapse: collapse;
        th {
          background: linear-gradient(to right, #e9f0ff, white);
          padding: 8px;
          border: 1px solid #999999;
        }
        td {
          padding: 8px;
          border: 1px solid #999999;
        }
      }
    }
  }
}
</style>