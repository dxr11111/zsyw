<template>
  <!-- 转派-选择维护人 -->
  <div class="selectMan">
    <MyHeader name="选择维护人" left="arrow-left" @goBackEv="goBackFn" />
    <!-- 选择维护人 -->
    <div class="region">
      <van-field
        label="维护人："
        :value="menText"
        @click="menShow = true"
        placeholder="请选择维护人"
        is-link
        arrow-direction="down"
        readonly
        class="textRight"
      />
      <van-action-sheet
        v-model="menShow"
        :actions="menActions"
        cancel-text="取消"
        close-on-click-action
        @select="selectMan"
      />
    </div>
    <!-- 派修备注 -->
    <div class="region">
      <van-field
        v-model="dispchRemark"
        label="派修备注："
        placeholder="请输入备注（必填）"
        class="inputRegion"
      />
    </div>
    <div class="submit">
      <van-button type="info" block round @click="onSubmit">提交</van-button>
    </div>
  </div>
</template>

<script>
import { reqIfmDiagnose } from "@/http/button";
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive";

export default {
  name: "IfmChuZhenSelectMan",
  mixins: [keepAliveMixin],

  data() {
    return {
      id: parseInt(this.$route.query.id),
      daiweiId: parseInt(this.$route.query.daiweiId),
      daiweiName: this.$route.query.daiweiName,
      quYuId: parseInt(this.$route.query.quYuId),
      quYuName: this.$route.query.quYuName,
      dispchRemark: "", // 派修备注

      menActions: [],
      menText: "",
      menShow: false,

      menName: "",
      menId: -1,
      crMobileNumber: "",
    };
  },
  methods: {
    // 回退
    goBackFn() {
      this.$router.go(-1);
      // 改变路由跳转步数
      this.$store.commit("changeRouteJumpStep", -1);
    },
    // 提交
    async onSubmit() {
      if (this.dispchRemark == "") return this.$toast("请输入派修备注");

      // String diagremark;// 诊断备注
      let postData = {
        id: this.id,
        showFlag: parseInt(this.$route.query.showFlag),
        rdresult: parseInt(this.$route.query.diagnoseResultId),
        diagremark: this.$route.query.diagremark,
        fenGongSiId: parseInt(this.$route.query.fenGongSiId),
        fenGongSiName: this.$route.query.fenGongSiName,
        dispchRemark: this.dispchRemark,
        daiweiId: this.daiweiId,
        daiweiName: this.daiweiName,
        quYuId: this.quYuId,
        quYuName: this.quYuName,
        menId: this.menId,
        menName: this.menName,
        crMobileNumber: this.crMobileNumber,
      };
      let result = await reqIfmDiagnose(JSON.stringify(postData));
      console.log("提交转派结果", result);
      this.apiResponse(result, ".selectMan", () => {
        // 提交成功后返回详情/工作台并刷新
        this.resetRouteJumpStep();
        // 只调用接口按钮操作成功 刷新工单详情/工作台
        this.operationSuccessRefresh(true);
        // 返回到列表详情/工作台 → 销毁整个初诊页面
        this.$store.commit("removeThisPage", [
          "IfmChuZhenMain",
          "IfmChuZhenSelectGroup",
          "IfmChuZhenSelectDw",
          "IfmChuZhenSelectQuYu",
        ]);
      });
    },
    // 获取传递过来的维护人
    getMan() {
      let menList = JSON.parse(this.$route.query.diagnoseCfgRepairManList);
      menList.forEach((man) => {
        let obj = {};
        obj.name = `${man.crName}[${man.crMobileNumber}][${man.crCurBalkCount}]`;
        obj.crName = man.crName;
        obj.crId = man.crId;
        obj.crCurBalkCount = man.crCurBalkCount;
        obj.crMobileNumber = man.crMobileNumber;
        obj.crUserType = man.crUserType;
        this.menActions.push(obj);
        if (man.status == 1) {
          this.menText = `${man.crName}[${man.crMobileNumber}][${man.crCurBalkCount}]`;
          this.menName = man.crName;
          this.menId = man.crId;
          this.crMobileNumber = man.crMobileNumber;
        }
      });
      // 指定默认维护人
      if (this.menActions.length > 0 && this.menId == -1) {
        this.menText = this.menActions[0].name;
        this.menName = this.menActions[0].crName;
        this.menId = this.menActions[0].crId;
        this.crMobileNumber = this.menActions[0].crMobileNumber;
      }
    },
    // 挑选维护人
    selectMan(action) {
      this.menText = `${action.crName}[${action.crMobileNumber}][${action.crCurBalkCount}]`;
      this.menName = action.crName;
      this.menId = action.crId;
      this.crMobileNumber = action.crMobileNumber;
    },
  },
  created() {
    // 获取传递过来的维护人
    this.getMan();
  },
};
</script>

<style scoped lang="less">
.selectMan {
  .region {
    margin-top: 10px;
    background-color: #fff;
    /deep/.van-cell__title {
      flex: 0.8;
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
  }
  .submit {
    padding: 30px;
  }
}
</style>