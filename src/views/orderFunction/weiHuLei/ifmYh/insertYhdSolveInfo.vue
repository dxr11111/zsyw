<template>
  <!-- 查询解决方案 -->
  <div class="insertYhdSolveInfo">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />

    <div class="main">
      <van-form @submit="onSubmit">
        <!-- 问题原因 -->
        <div class="region">
          <van-field
            label="问题原因"
            :value="reasonTypeName"
            @click="reasonTypeShow = true"
            placeholder="请选择问题原因"
            is-link
            arrow-direction="down"
            readonly
            class="textRight"
          />
          <van-action-sheet
            v-model="reasonTypeShow"
            :actions="reasonTypeActions"
            cancel-text="取消"
            close-on-click-action
            @select="selectReasonType"
          />
        </div>

        <!-- 解决放案 -->
        <div class="region">
          <van-field
            label="解决放案"
            :value="solveTypeName"
            @click="solveTypeShow = true"
            placeholder="请选择解决放案"
            is-link
            arrow-direction="down"
            readonly
            class="textRight"
          />
          <van-action-sheet
            v-model="solveTypeShow"
            :actions="solveTypeActions"
            cancel-text="取消"
            close-on-click-action
            @select="selectSolveType"
          />
        </div>

        <!-- 方案详情 -->
        <div class="region">
          <van-field
            v-model="solveContent"
            label="方案详情"
            placeholder="请输入方案详情"
            :autosize="{ maxHeight: 100, minHeight: 50 }"
            type="textarea"
            class="inputRegion"
          />
        </div>
        <div class="submitButton">
          <van-button type="info" round block native-type="submit"
            >提交</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { reqIfmUpdYhdSolveInfo, reqIfmQueryYhdSolveInfo } from "@/http/button";
import { mapState } from "vuex";
export default {
  name: "InsertYhdSolveInfo",
  data() {
    return {
      headName: "",
      reasonType: -1, // 问题原因
      reasonTypeName: "",
      reasonTypeShow: false,
      reasonTypeActions: [
        { name: "弱覆盖", value: 1 },
        { name: "过覆盖", value: 2 },
        { name: "重叠覆盖", value: 3 },
        { name: "隐性故障", value: 4 },
        { name: "显性故障", value: 5 },
        { name: "上行高底噪", value: 6 },
        { name: "MOD3干扰", value: 7 },
        { name: "拥塞", value: 8 },
        { name: "RRC License受限", value: 9 },
        { name: "高负荷", value: 10 },
        { name: "邻区问题", value: 11 },
        { name: "参数配置问题", value: 12 },
        { name: "CQI差", value: 13 },
        { name: "话务波动", value: 14 },
        { name: "指标波动", value: 15 },
        { name: "其他", value: 16 },
      ],
      solveType: -1, // 解决方案
      solveTypeName: "",
      solveTypeShow: false,
      solveTypeActions: [
        { name: "参数优化", value: 1 },
        { name: "RF优化", value: 2 },
        { name: "干扰排查", value: 3 },
        { name: "隐形故障排查", value: 4 },
        { name: "显性故障排查", value: 5 },
        { name: "扩容License", value: 6 },
        { name: "扩容", value: 7 },
        { name: "小区分裂", value: 8 },
        { name: "自行恢复", value: 9 },
        { name: "室分补点", value: 10 },
        { name: "邻区优化", value: 11 },
        { name: "催开催建", value: 12 },
        { name: "其他", value: 13 },
      ],
      solveContent: "", // 方案详情
    };
  },
  computed: {
    ...mapState("workOrder", ["currWorkGroupInfo"]),
  },
  methods: {
    goBackFn() {
      this.$router.go(-1);
    },
    // 判断头部名称
    async judgeHeadName() {
      if (this.$route.query.buttonId == "insertYhdSolveInfo") {
        this.headName = `填写解决方案${this.$route.query.orderId}`;
      } else if (this.$route.query.buttonId == "updYhdSolveInfo") {
        this.headName = `更新解决方案${this.$route.query.orderId}`;
        // 查询解决方案
        let result = await reqIfmQueryYhdSolveInfo(
          JSON.stringify({ id: parseInt(this.$route.query.id) })
        );
        console.log("查询解决方案", result);
        // 根据参数渲染页面
        this.apiResponse(result, ".insertYhdSolveInfo", () => {
          // 问题原因
          for (let action of this.reasonTypeActions) {
            if (action.value == result.reasonType) {
              this.reasonType = result.reasonType;
              this.reasonTypeName = action.name;
              break;
            }
          }
          // 解决方案
          for (let solve of this.solveTypeActions) {
            if (solve.value == result.solveType) {
              this.solveType = result.solveType;
              this.solveTypeName = solve.name;
              break;
            }
          }
          // 方案详情
          this.solveContent = result.solveContent;
        });
      }
    },
    // 选中问题原因
    selectReasonType(action) {
      this.reasonTypeName = action.name;
      this.reasonType = action.value;
    },
    // 选中解决放案
    selectSolveType(action) {
      this.solveTypeName = action.name;
      this.solveType = action.value;
    },
    // 提交
    async onSubmit() {
      // 表单校验
      if (this.reasonTypeName == "") return this.$toast("请选择问题原因");
      if (this.solveTypeName == "") return this.$toast("请选择解决放案");
      if (this.solveContent == "") return this.$toast("请输入方案详情");

      let postData = {
        id: parseInt(this.$route.query.id),
        // 工作组id，工作组名称
        groupId: this.currWorkGroupInfo.groupId,
        groupName: this.currWorkGroupInfo.groupName,
        reasonType: this.reasonType,
        solveType: this.solveType,
        solveContent: this.solveContent,
      };
      let result = await reqIfmUpdYhdSolveInfo(JSON.stringify(postData));
      console.log("提交结果", result);
      this.apiResponse(result, ".insertYhdSolveInfo", () => {
        // 操作成功 返回上一个页面并刷新
        this.$router.go(-1);
        // 只调用接口按钮操作成功 刷新工单详情/工作台
        this.operationSuccessRefresh(true);
      });
    },
  },
  created() {
    // 判断头部名称
    this.judgeHeadName();
  },
};
</script>

<style scoped lang="less">
.insertYhdSolveInfo {
  .main {
    .inputRegion {
      align-items: center;
      /deep/.van-cell__value {
        textarea {
          padding: 5px;
          border: 1px solid #e0e0e0;
        }
      }
    }
  }
  .submitButton {
    padding: 30px;
  }
}
</style>