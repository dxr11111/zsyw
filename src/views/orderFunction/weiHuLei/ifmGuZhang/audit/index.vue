<template>
  <div class="audit">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <van-collapse v-model="activeNames" v-if="auditList.length > 0">
      <van-collapse-item
        :name="String(index + 1)"
        v-for="(item, index) in auditList"
        :key="index"
      >
        <template #title>
          <div style="display: flex; justify-content: space-between">
            <span>{{ item.curtDeptName }}</span>
            <span>{{ item.curtStatusName }}</span>
          </div>
        </template>
        <van-cell-group style="border: 2px sloid blue">
          <van-cell title="工单号" :value="item.sheetNo" />
          <van-cell
            v-for="e in item.colsName"
            :key="e.key"
            :title="e.key"
            :value="e.value"
          />
          <van-cell id="center" title="处理过程" />
          <van-cell
            v-for="(deal, n) in item.listProc"
            :key="n"
            :title="`${deal.typeName}:${deal.writeUserName}`"
            :value="deal.writeTime"
            :label="deal.intro"
          />
          <div class="btns">
            <van-button
              type="info"
              @click="clickButton(item.buttonList[index], item.sheetNo)"
              v-for="(btn, index) in item.translateButtonList"
              :key="'button' + index"
              >{{ btn }}</van-button
            >
            <!-- <van-button type="info" @click="updateAudit(item.sheetNo)"
              >审核</van-button
            >
            <van-button type="info" @click="rejectedAudit(item.sheetNo)"
              >驳回</van-button
            > -->
          </div>
        </van-cell-group>
      </van-collapse-item>
    </van-collapse>
    <Empty v-else />

    <van-popup v-model="show" style="border-radius: 5px">
      <textarea class="reject" v-model="intro" placeholder="请输入驳回原因" />
      <van-button type="info" block @click="comfirmReject">确认驳回</van-button>
    </van-popup>
  </div>
</template>

<script>
import {
  GetAuditSheetApi,
  UpdateAuditSheetApi,
  RejectAuditSheetApi,
} from "@/http/button";
import { matchButton } from "@/utils/public/button";
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive";
import { mapState } from "vuex";

export default {
  name: "Audit",
  mixins: [keepAliveMixin],

  data() {
    return {
      headName: `审核(${this.$route.query.orderId})`,
      activeNames: ["1"],
      auditList: [],
      show: false,
      currSheetId: "",
      intro: "",
      buttonMatch: {
        fuce: "复测",
        rejectKX: "驳回",
        rejectCG: "驳回",
        audit: "审核通过",
        ifmZhuanPai: "转派",
      },
      rejectFlag: -1, // 1：代维驳回，2：客响驳回。
    };
  },
  computed: {
    ...mapState("home", ["listDetail"]),
  },
  created() {
    this.getAuditSheet(false);
  },
  methods: {
    // 回退
    goBackFn() {
      this.$router.go(-1);
      // 返回到列表详情/工作台 → 销毁整个初诊页面
      this.$store.commit("removeThisPage", this.$options.name);
    },
    // 点击按钮
    clickButton(btn, sheetNo) {
      // 判断点击的哪一种按钮
      switch (btn) {
        case "fuce":
          // 复测
          // 进入复测页面
          this.$router.push({
            path: "/ifmFuCe",
            query: {
              id: parseInt(this.$route.query.id),
              sheetNo,
            },
          });
          break;
        case "rejectKX":
          // 驳回
          // 当按钮为“rejectKX”时，rejectFlag传2；
          this.rejectFlag = 2;
          this.rejectedAudit(sheetNo);
          break;
        case "rejectCG":
          // 驳回
          // 当按钮为“rejectCG”时，rejectFlag传1。
          this.rejectFlag = 1;
          this.rejectedAudit(sheetNo);
          break;
        case "audit":
          // 审核通过
          this.updateAudit(sheetNo);
          break;
        case "ifmZhuanPai":
          // 转派
          matchButton(this.listDetail, "ifmZhuanPai");
          break;
      }
    },
    // 确认驳回
    async comfirmReject() {
      if (this.intro == "") return this.$toast("请输入驳回原因");
      let data = await RejectAuditSheetApi(
        JSON.stringify({
          id: Number(this.$route.query.id),
          lowerSheetNo: this.currSheetId,
          intro: this.intro,
          rejectFlag: this.rejectFlag,
        })
      );
      this.apiResponse(data, ".audit", () => {
        this.getAuditSheet(true);
      });

      this.show = false;
      this.intro = "";
    },
    // 驳回
    rejectedAudit(sheetNo) {
      this.show = true;
      this.currSheetId = sheetNo;
    },
    // 审核
    async updateAudit(sheetNo) {
      let data = await UpdateAuditSheetApi(
        JSON.stringify({
          id: Number(this.$route.query.id),
          lowerSheetNo: sheetNo,
        })
      );
      this.apiResponse(data, ".audit", () => {
        this.getAuditSheet(true);
      });
    },
    async getAuditSheet(bool) {
      const data = await GetAuditSheetApi(
        JSON.stringify({ id: Number(this.$route.query.id) })
      );
      console.log("审核数据", data);
      this.apiResponse(data, ".audit", () => {
        // 将sheetAuditInfoList中的buttonList里的英文转成中文
        this.auditList = data.sheetAuditInfoList;
        this.auditList.forEach((audit, index) => {
          let buttonList = audit.buttonList;
          let translateButtonList = [];
          buttonList.forEach((btn) => {
            let value = this.buttonMatch[btn];
            translateButtonList.push(value);
          });
          this.$set(
            this.auditList[index],
            "translateButtonList",
            translateButtonList
          );
        });
      });

      if (bool) {
        // 如果查询没有数据，返回详情页
        if (this.auditList.length == 0) {
          this.goBackFn();
          // 刷新工单详情/工作台
          this.operationSuccessRefresh(true);
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.btns {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  .van-button {
    width: 150px;
    border-radius: 5px;
  }
}
#center {
  margin-left: 35%;
}
.reject {
  width: 95%;
  height: 110px;
  border: 1px solid #eee;
  text-align: start;
  margin-bottom: 15px;
  padding: 8px;
  border-radius: 5px;
  box-sizing: border-box;
}
::v-deep .van-button--block {
  margin: auto;
  border-radius: 5px;
}
::v-deep .van-popup--center {
  width: 90%;
  padding: 15px;
  box-sizing: border-box;
}
::v-deep .van-cell--clickable {
  background-color: #eee;
}
::v-deep .van-collapse-item {
  padding: 10px;
}
::v-deep .van-collapse-item__wrapper {
  // border: 2px sloid rgb(205, 218, 248) !important;
  z-index: 2;
}
::v-deep .van-collapse-item__content {
  // border: 2px sloid rgb(205, 218, 248) !important;
  padding: 0;
}
::v-deep .van-cell__title {
  text-align: left;
}
::v-deep [class*="van-hairline"]::after {
  border: none;
}
::v-deep .van-cell::after {
  left: 0;
  right: 0;
}
</style>