<template>
  <div class="big-box">
    <div v-if="isShow">
      <MyHeader :name="headName" left="arrow-left" @goBackEv="$router.go(-1)" />
      <div>
        <div class="selected">
          <div class="title">已派发部门</div>
          <ul>
            <li v-for="(item, index) in wasPaifaNames" :key="index">
              {{ index + 1 }}.{{ item.name }}
            </li>
          </ul>
        </div>
        <div class="paifa">
          <div class="title">
            <span class="tip">选择派发部门：</span>
            <span class="select-btn" @click="isShow = false"
              >请选择派发部门</span
            >
          </div>
          <div class="decp-list" v-if="selectList.length > 0">
            <ul>
              <li v-for="(item, index) in selectList" :key="index">
                {{ index + 1 }}.{{ item.name }}<br />
                <span class="intro" v-if="item.instruction"
                  >(执行要求：{{ item.instruction }})</span
                >
              </li>
            </ul>
          </div>
        </div>
        <!-- 包含特殊字段的内容 -->
        <div class="special" v-if="specialList.length > 0">
          <!-- 有数据展示 -->
          <div v-if="paifaJsonList.length > 0">
            <van-field
              readonly
              label="网维故障处理专业"
              v-model="currDept"
              is-link
              @focus="showChoice = true"
            ></van-field>
            <van-action-sheet
              v-model="showChoice"
              cancel-text="取消"
              :round="false"
              :actions="paifaJsonList"
              close-on-click-action
              @select="onSelect"
            />
          </div>
          <!-- 无数据展示 ${pecialList[0].name}, -->
          <div class="tips" v-else>
            <div>网维故障处理专业</div>
            <span>{{ specialList[0]?.name }},没有任何专业有工程师在岗</span>
          </div>
        </div>
        <div class="btn">
          <van-button type="info" block @click="submit">确定</van-button>
        </div>
      </div>
    </div>
    <SelectedPaifa
      v-else
      :list="paifaAllList"
      :isShow.sync="isShow"
      :wasPaifaNames="wasPaifaNames"
      :selectedList="selectList"
      @getSeclected="getSeclected"
    />
  </div>
</template>

<script>
import {
  GetPaiFaQueryApi,
  GetPaiFaQueryKzwwApi,
  PaiFaConfirmApi,
} from "@/http/button.js";
import SelectedPaifa from "./components/selectedPaifa";
export default {
  name: "Paifa",
  components: { SelectedPaifa },
  data() {
    return {
      headName: `派发(${this.$route.query.orderId})`,
      wasPaifaIds: [], // 已派发的ids
      wasPaifaNames: [], // 已派发的names
      paifaAllList: [], // 派发所有数据
      isShow: true,
      selectList: [], // 子组件选择的派发部门
      specialList: [], // 包含特殊字段的所有数据
      paifaJsonList: [], // 包含特殊字段获取的在岗工程师技能
      showChoice: false,
      currDept: "请选择", // 选择的工程师技能
      choseSpec: "", // 选择的工程师技能对应的key值
    };
  },
  created() {
    this.getPaifaData();
    // console.log(JSON.stringify({ id: Number(this.$route.query.id), orderId: this.$route.query.orderId }));
  },
  methods: {
    async submit() {
      if (this.selectList.length == 0) return this.$toast("请选择派发部门");
      // 公共参数
      let params = {
        id: Number(this.$route.query.id),
        snodeID: this.selectList.map((e) => String(e.paifaFlowNode.nodeId)),
        deptID: this.selectList.map((e) => String(e.paifaFlowNode.groupId)),
        deptNames: this.selectList.map((e) => e.paifaFlowNode.groupName),
        instruction: this.selectList.map((e) => e.instruction),
        isWirelessPhs: 2,
        flowUseTime: "0",
        choseSpec: "",
        assignFlag: "2",
      };
      // 查询到在岗工程师技能，就把所选择的技能key给choseSpec
      if (this.paifaJsonList.length > 0) {
        if (this.currDept == "请选择")
          return this.$toast("请选择网维故障处理专业");
        params.choseSpec = this.paifaJsonList.find(
          (e) => e.name == this.currDept
        ).id;
      }
      console.log("派发提交参数", params);
      let data = await PaiFaConfirmApi(JSON.stringify({ ...params }));
      console.log(data);
      if (data.operationSuccessFlag) {
        this.$toast.success(data.successMessage);
        this.$router.go(-1);
        // 接口按钮操作成功 刷新工单详情/工作台
        this.operationSuccessRefresh(true);
      } else {
        this.$toast.fail(data.errorMessage);
      }
    },
    onSelect(item) {
      this.showChoice = false;
      this.currDept = item.name;
      this.choseSpec = item.id;
    },
    // 接收子组件数据
    async getSeclected(data) {
      console.log("子传父", data);
      this.selectList = data;
      this.specialList = [];
      // 名称包含"维护中心"或者包含“接入网支撑网格”的派发部门调用查询工程师接口
      this.selectList.forEach((e) => {
        if (e.name.includes("维护中心") || e.name.includes("接入网支撑网格")) {
          this.specialList.push(e);
        }
      });
      console.log("特殊列表", this.specialList);
      if (this.specialList.length > 0) {
        // 只查询特殊列表中的第一个部门数据并展示
        let res = await GetPaiFaQueryKzwwApi(
          JSON.stringify({
            id: Number(this.$route.query.id),
            groupId: this.specialList[0]?.paifaFlowNode.groupId,
          })
        );
        console.log("special-Result", res);
        this.paifaJsonList = res.paiFaJsonList.map((e) => ({
          name: e.value,
          id: e.key,
        }));
      }
    },
    // 派发前查询
    async getPaifaData() {
      let data = await GetPaiFaQueryApi(
        JSON.stringify({ id: Number(this.$route.query.id), isFirstPaifa: 2 })
      );
      console.log("派发先查询数据", data);
      if (!data.operationSuccessFlag)
        return this.$toast.fail(data.errorMessage);
      this.wasPaifaIds = data.wasPaifaDeptId;
      this.paifaAllList = data.paiFaTreeView;
      this.wasPaifaIds.forEach((e) => {
        // const curr = this.paifaAllList.find(i => i.paifaFlowNode.groupId == e).paifaFlowNode.groupName
        // 派发部门有的会对应多个工作组，find找到第一个满足元素之后会停止查找
        this.paifaAllList.forEach((item) => {
          if (item.paifaFlowNode.groupId == e) {
            this.wasPaifaNames.push({ name: item.paifaFlowNode.groupName });
          }
        });
        // this.wasPaifaNames.push({ name: curr })
      });
      // 给数组去重，如果派发部门名字一样，只显示一个
      let newArr = [];
      this.wasPaifaNames.forEach((e) => {
        newArr.find((i) => i.name == e.name) ? newArr : newArr.push(e);
      });
      this.wasPaifaNames = newArr;
      console.log("已派发部门", this.wasPaifaNames);
    },
  },
};
</script>

<style scoped lang="less">
.big-box {
  height: 100%;
  width: 100%;
  background-color: rgb(248, 247, 252);
}
.selected {
  background-color: #fff;
  margin: 15px;
  padding: 10px;
  .title {
    text-align: start;
    margin-bottom: 15px;
    margin-left: 10px;
    font-size: 16px;
    font-weight: 700;
  }
  ul li {
    font-size: 14px;
    text-align: left;
  }
}
.decp-list {
  ul {
    // color: #9cadd2;
    color: #9eb1d1;
    font-size: 15px;
    padding: 8px 0;
    text-align: left;
    overflow: auto;
    li {
      line-height: 15px;
      margin-top: 10px;
      .intro {
        font-size: 14px;
        margin-left: 15px;
      }
    }
  }
}
.paifa {
  background-color: #fff;
  margin: 15px;
  padding: 10px;
  line-height: 28px;
  .title {
    display: flex;
    justify-content: space-between;
    .tip {
      font-size: 16px;
      font-weight: 700;
    }
    .select-btn {
      width: 120px;
      height: 25px;
      font-size: 15px;
      color: #5888e2;
      border-radius: 15px;
      border: 1px solid #5888e2;
    }
  }
}
.special {
  ::v-deep .van-cell {
    margin: 15px;
    width: 92%;
  }
  ::v-deep .van-field__label {
    color: #000;
    width: 4.2em;
  }
  ::v-deep .van-cell__right-icon {
    line-height: 11.4vw;
  }
  ::v-deep .van-cell__value {
    top: 10px;
    left: 8px;
  }
  .tips {
    display: flex;
    background-color: #fff;
    margin: 15px;
    padding: 15px;
    div {
      width: 79px;
      margin-right: 10px;
    }
    span {
      flex: 1;
      color: red;
    }
  }
}
.btn {
  height: 60px;
  width: 100%;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  .van-button--block {
    width: 95%;
    margin: auto;
    border-radius: 5px;
  }
}
</style>