<template>
  <div class="work-report">
    <div class="static">
      <MyHeader :name="name" left="arrow-left" @goBackEv="$router.go(-1)" />
      <!-- <div v-if="!(company && userType)">数据加载中~</div> -->
      <div class="setting">
        <!-- 点击一级按钮 -->
        <van-button
          plain
          hairline
          type="info"
          @click="clickButton(item, index)"
          :class="currentButton === index ? 'activeButton' : ''"
          v-for="(item, index) in buttonList"
          :key="index"
          >{{ item.name }}</van-button
        >
        <div class="SFButton">
          <div v-if="company === '0' && isShowSF">
            <!-- 点击室分日报出现的按钮 -->
            <van-button
              plain
              hairline
              type="info"
              @click="clickSFButton(item, index)"
              :class="currentSFList === index ? 'activeButton' : ''"
              v-for="(item, index) in shiFenReport"
              :key="index"
              >{{ item.name }}</van-button
            >
          </div>
          <!-- 联通三级经理权限 -->
          <!-- <div class="ltRegion" v-if="company === '0' && userType === '1'">
          <van-button
            plain
            hairline
            type="info"
            @click="clickRegionButton(item, index)"
            :class="currentRegionList === index ? 'activeButton' : ''"
            v-for="(item, index) in regionReport"
            :key="index"
            >{{ item.name }}</van-button
          >
        </div> -->
        </div>
        <div class="HZButton">
          <div v-if="company === '0' && isShowHZ">
            <!-- 点击宏站报表出现的按钮 -->
            <van-button
              plain
              hairline
              type="info"
              @click="clickHZButton(item, index)"
              :class="currentHZList === index ? 'activeButton' : ''"
              v-for="(item, index) in HZReport"
              :key="index"
              >{{ item.name }}</van-button
            >
          </div>
        </div>
      </div>
    </div>
    <div class="tableBox" :style="mT">
      <div class="tableInfo" v-html="getTableInfo"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getItem } from "@/utils/public/sessionStorage";
import $, { data } from "jquery";
export default {
  name: "ReportSheet",
  data() {
    return {
      name: "建设工单报表",
      loginNo: "", // admin qiwm1 Zhangxf
      company: "", // 0：联通，1：铁塔
      userType: "", // 用户角色（0:二级经理，1:三级经理，2:项目经理）
      reportType: "", // 1：室分日报，2：宏站周报，3：中心进度汇总，4：部门进度汇总，5：个人进度汇总,6：投诉日报铁塔部门，7：投诉日报铁塔项目经理
      sfType: "-1", // 室分日报类型   4:室分日报 8:室分日报3500 9:室分日报2100
      isAll: "-1", // 0：部门 1：全市
      currentButton: 0, // 默认请求第一个按钮
      currentSFList: 0, // 点击室分日报默认选中室分日报
      currentHZList: 0, // 点击宏站报表默认选中宏站周报
      currentRegionList: -1,
      buttonList: [],
      // 联通
      ltButtonList: [
        { name: "室分日报", reportType: "1" },
        { name: "宏站报表", reportType: "2" },
        { name: "中心进度汇总", reportType: "3" },
        { name: "部门进度汇总", reportType: "4" },
        { name: "个人进度汇总", reportType: "5" },
      ], // 联通二级经理查看权限
      shiFenReport: [
        { name: "室分日报", sfType: "4" },
        { name: "室分日报3500", sfType: "8" },
        { name: "室分日报2100", sfType: "9" },
      ], // 室分日报可选项
      isShowSF: false, // 是否显示室分日报可选项
      // 宏站报表可选项
      HZReport: [
        { name: "宏站周报", sfType: "5" },
        { name: "宏站日报L900", sfType: "6" },
        { name: "宏站扩容日报", sfType: "7" },
      ],
      isShowHZ: false, // 是否显示宏站报表可选项
      // 联通三级经理查看权限
      /* regionReport: [
        { name: "部门", isAll: "0" },
        { name: "全市", isAll: "1" },
      ], */
      // 铁塔
      ttButtonList: [
        { name: "个人进度汇总", reportType: "5" },
        { name: "投诉日报铁塔部门", reportType: "6" },
        { name: "投诉日报铁塔项目经理", reportType: "7" },
      ],
      getTableInfo: "",
      // 表格的margin-top
      mT: "margin-top:90px",
    };
  },
  methods: {
    // 旋转
    setLandScape() {
      var width = document.documentElement.clientWidth;
      var height = document.documentElement.clientHeight;
      if (width < height) {
        // console.log(width + " " + height);
        $(".work-report").width(height);
        $(".work-report").height(width);
        $(".work-report").css("top", (height - width) / 2);
        $(".work-report").css("left", 0 - (height - width) / 2);
      }
    },
    // 点击一级按钮
    clickButton(item, index) {
      this.currentButton = index;
      // 判断室分日报是否显示
      if (item.name !== "室分日报") {
        this.isShowSF = false;
        // 点击其他按钮将sfType值设置成-1
        // this.sfType = "-1";
        // this.currentSFList = 0;
      } else {
        this.isShowSF = true;
        // 默认选项室分日报
        this.sfType = "4";
      }
      // 判断宏站报表是否显示
      if (item.name !== "宏站报表") {
        this.isShowHZ = false;
      } else {
        this.isShowHZ = true;
        // 有个默认选项宏站周报
        this.sfType = "5";
      }
      // 判断reportType类型
      this.reportType = item.reportType;
      // 将表格margin-top值增大
      if (item.name == "室分日报" || item.name == "宏站报表")
        this.mT = "margin-top:130px";
      else this.mT = "margin-top:90px";
      // 触发请求
      this.getTable();
    },
    // 点击室分日报出来的按钮
    clickSFButton(item, index) {
      this.currentSFList = index;
      // 判断室分日报类型
      this.sfType = item.sfType;
      // 触发请求
      this.getTable();
    },
    // 点击宏站报表
    clickHZButton(item, index) {
      this.currentHZList = index;
      // 判断宏站报表选项
      this.sfType = item.sfType;
      // 触发请求
      this.getTable();
    },
    // 联通三级经理可查看部门或全市的报表
    /*  clickRegionButton(item, index) {
      this.currentRegionList = index;
      // 判断是否显示全量数据
      this.isAll = item.isAll;
      // 触发请求
      this.getTable();
    }, */
    // 根据不同权限获取setting中的按钮
    async getSetting() {
      // 发送请求 获取按钮权限
      // 测试
      /* this.company = "0";
      this.userType = "1"; */
      try {
        await this.$store.dispatch("reportSheet/getSettingInfo", this.loginNo);
        let settingInfo = this.$store.state.reportSheet.settingInfo;
        this.company = settingInfo.company;
        this.userType = settingInfo.type;
        // 判断请求成功
        if (settingInfo.operationSuccessFlag) {
          // console.log("请求成功");
          if (this.company === "0") {
            // 联通
            // 判断是二级经理还是三级经理/项目经理
            if (this.userType === "0") {
              // 二级经理 将个人进度汇总过滤掉
              this.buttonList = this.ltButtonList.filter(
                (item) => item.reportType !== "5"
              );
              // console.log("-----", this.buttonList);
            } else if (this.userType === "1" || this.userType === "2") {
              // 三级
              this.buttonList = this.ltButtonList;
            }
            // 默认请求室分日报数据
            this.reportType = "1";
            this.mT = "margin-top:130px";
            this.isShowSF = true;
            this.sfType = "4";
          } else if (this.company === "1") {
            // 铁塔 判断二级or三级
            if (this.userType === "0") {
              // 二级
              this.buttonList = this.ttButtonList.filter(
                (item) => item.reportType !== "5"
              );
              this.reportType = "6";
            } else if (this.userType === "1" || this.userType === "2") {
              this.buttonList = this.ttButtonList;
              this.reportType = "5";
            }
          }
          // 请求默认第一个按钮的表格数据
          this.getTable();
        }
      } catch (error) {
        console.log("err", error);
      }
      // 请求table
      // this.getTable();
    },
    // 获取后台传过来的权限参数和表格
    async getTable() {
      const loginNo = this.loginNo;
      const isAll = this.isAll;
      const type = this.sfType;
      let postData = { loginNo, isAll, type };
      // console.log("postData", postData);
      try {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        document.querySelector(".tableBox").scrollLeft = 0;
        document.querySelector(".tableBox").scrollTop = 0;
        await this.$store.dispatch(
          "reportSheet/getTableInfo",
          JSON.stringify(postData)
        );
        // 将表格信息渲染到页面
        let tableInfo = this.$store.state.reportSheet.tableInfo;
        console.log("table", tableInfo);
        // 判断请求成功
        if (tableInfo.operationSuccessFlag) {
          if (this.company == 0) {
            //联通
            if (this.reportType == 1) {
              //室分日报
              this.getTableInfo = tableInfo.sfList;
            } else if (this.reportType == 2) {
              //宏站周报
              this.getTableInfo = tableInfo.hzList;
            } else if (this.reportType == 3) {
              //中心进度汇总
              this.getTableInfo = tableInfo.secondList;
            } else if (this.reportType == 4) {
              //部门进度汇总
              this.getTableInfo = tableInfo.tertiaryList;
            } else if (this.reportType == 5) {
              //个人进度汇总
              this.getTableInfo = tableInfo.projectList;
            } else {
              console.log("请求类型失败！reportType=" + this.reportType);
            }
          } else if (this.company == 1) {
            //铁塔
            if (this.reportType == 5) {
              //个人进度汇总
              this.getTableInfo = tableInfo.projectList;
            } else if (this.reportType == 6) {
              //投诉日报铁塔部门
              this.getTableInfo = tableInfo.ttDepartmentList;
            } else if (this.reportType == 7) {
              //投诉日报铁塔项目经理
              this.getTableInfo = tableInfo.ttProjectList;
            } else {
              console.log("请求类型失败！reportType=" + this.reportType);
            }
          } else {
            console.log("角色身份错误！company=" + this.company);
          }
        }
      } catch (error) {
        console.log("err", error);
      }
    },
  },
  mounted() {
    // this.getTable();
    this.setLandScape();
  },
  created() {
    let userIds = getItem("loginInfo").userIds;
    userIds.forEach((e) => {
      if (e.sysId == 11) {
        this.loginNo = e.accountId;
      }
    });
    this.getSetting();
  },
};
</script>

<style scoped lang="less">
@bgColor: #245bef;
// viewport 处于纵向，即高度大于等于宽度。
@media screen and (orientation: portrait) {
  .work-report {
    position: absolute;
    transform: rotate(90deg);
    transform-origin: center;
    overflow: auto;
  }
}
.work-report {
  display: flex;
  flex-direction: column;
  align-items: center;

  .static {
    position: fixed;
    top: 0;
    width: 100%;
    // max-width: 640px;
    background-color: #fff;
    .setting {
      width: 100%;
      .SFButton {
        display: flex;
        justify-content: space-around;
      }
      .van-button {
        margin-top: 5px;
        margin-bottom: 5px;
        font-size: 12px;
        height: 30px;
        // border-radius: 5px;
      }
      .van-button--plain.van-button--info {
        color: @bgColor;
      }
      .van-button--hairline::after {
        border-radius: 5px;
      }
      .van-button--plain.van-button--info.activeButton {
        background-color: @bgColor;
        color: #fff;
      }
    }
  }
  .tableBox {
    // display: flex;
    // justify-content: center;
    width: 100%;
    overflow: auto;
    .tableInfo {
      // display: flex;
      // justify-content: center;
      // margin-left: 100px;
      margin: 0 auto;

      width: 1600px;
      // overflow: auto;
    }
  }
}
</style>