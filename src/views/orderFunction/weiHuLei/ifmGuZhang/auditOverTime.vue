<template>
  <div class="auditOverTime">
    <!-- 审核超时 审核超时免责-->
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <template v-if="sheetOverTimeInfo.length > 0">
      <div class="main" v-for="(item, index) in sheetOverTimeInfo" :key="index">
        <van-cell-group>
          <van-cell title="工单号" :value="item.sheetNo" />
          <van-cell title="提交部门" :value="item.operGroupName" />
          <van-cell title="提交人" :value="item.operUserName" />
          <van-cell title="超时原因" :value="item.overTimeReason" />
          <van-cell title="超时原因二级" :value="item.overTimeReason1" />
          <van-cell title="超时说明" :value="item.overTimeIntro" />
          <van-cell title="提交时间" :value="item.operTime" />
          <van-cell title="超时状态" :value="item.overTimeInfoStatusName" />
          <van-cell title="驳回信息" :value="item.rejectInfo" />
        </van-cell-group>
        <van-field
          v-model="item.auditInfo"
          label="审核说明"
          placeholder="请输入审核说明"
          class="inputRegion"
        />
        <div class="selectButton">
          <span class="title">审核确认</span>
          <div class="button">
            <van-button
              :type="item.auditStatus === 1 ? 'info' : ''"
              @click="clickAuditStatus(true, item)"
              native-type="button"
              >通过</van-button
            >
            <van-button
              :type="item.auditStatus === 2 ? 'info' : ''"
              @click="clickAuditStatus(false, item)"
              native-type="button"
              >驳回</van-button
            >
          </div>
        </div>
        <div class="submitButton">
          <van-button type="info" block round @click="onSubmit(item)"
            >确定</van-button
          >
        </div>
      </div>
    </template>

    <!-- 显示暂无数据 -->
    <Empty v-else />
  </div>
</template>

<script>
import { reqIfmComplaintProdQuery, reqIfmAuditYdProdInfo } from "@/http/button";
export default {
  name: "AuditOverTime",
  data() {
    return {
      headName:
        parseInt(this.$route.query.type) == 1
          ? `审核超时(${this.$route.query.orderId})`
          : `审核超时免责(${this.$route.query.orderId})`,
      sheetOverTimeInfo: [], // 审核预约挂起信息
    };
  },
  methods: {
    goBackFn() {
      this.$router.go(-1);
    },
    // 审核前查询
    async getQueryInfo() {
      let id = parseInt(this.$route.query.id);
      let type = 4; // 审核超时 ，审核超时免责
      let queryOverTimeType = parseInt(this.$route.query.type); // 1：审核超时 2：审核超时免责

      let result = await reqIfmComplaintProdQuery(
        JSON.stringify({ id, type, queryOverTimeType })
      );
      console.log("审核超时查询", result);
      this.apiResponse(result, ".auditOverTime", () => {
        // 获取审核超时信息
        this.sheetOverTimeInfo = result.sheetOverTimeInfo;
        this.sheetOverTimeInfo.forEach((item) => {
          this.$set(item, "auditInfo", ""); // 审核说明
          this.$set(item, "auditStatus", -1); // 审核确认 1：审核通过,2:驳回
        });
      });
    },
    // 选中是否审核确认
    clickAuditStatus(bool, item) {
      if (bool) {
        item.auditStatus = 1;
      } else {
        item.auditStatus = 2;
      }
    },
    // 提交
    async onSubmit(item) {
      if (item.auditInfo == "") return this.$toast("请输入审核说明");
      if (item.auditStatus == -1) return this.$toast("请选择审核确认");
      let id = parseInt(this.$route.query.id);
      let type = 2; // 审核超时
      let auditStatus = item.auditStatus;
      let auditInfo = item.auditInfo;
      let prodYdCompZkAudit = {}; // 审核挂起信息 不用
      let sheetOverTimeInfo = item; // 审核超时信息
      let auditOverTimeType = parseInt(this.$route.query.type); // 审核超时类型 1:审核超时，2:审核超时免责
      let postData = {
        id,
        type,
        auditStatus,
        auditInfo,
        prodYdCompZkAudit,
        sheetOverTimeInfo,
        auditOverTimeType,
      };
      let result = await reqIfmAuditYdProdInfo(JSON.stringify(postData));
      this.apiResponse(result, ".auditOverTime", () => {
        // 接口按钮操作成功 刷新工单详情/工作台
        this.$router.go(-1);
        this.operationSuccessRefresh(true);
      });
    },
  },
  created() {
    // 审核前查询
    this.getQueryInfo();
  },
};
</script>

<style scoped lang="less">
.auditOverTime {
  .main {
    margin: 10px;
    border: 1px solid rgb(121, 177, 251);
    .van-cell-group {
      .van-cell {
        border-bottom: 1px solid #e0e0e0;
        .van-cell__title {
          text-align: left;
        }
      }
      .fileName {
        .van-cell__value {
          span {
            color: rgb(145, 98, 245);
          }
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
          width: 50px;
          height: 35px;
          padding: 5px;
          font-size: 13px;
        }
      }
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
    .submitButton {
      padding: 30px;
    }
  }
}
</style>