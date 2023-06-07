<template>
  <div class="groupZhuanPai">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="$router.go(-1)" />

    <van-form @submit="onSubmit">
      <van-cell>
        <van-radio-group
          v-model="radio"
          direction="horizontal"
          @change="chooseType"
        >
          <van-radio name="1">按专业转派</van-radio>
          <van-radio name="2">按在岗人员转派</van-radio>
        </van-radio-group>
      </van-cell>
      <!-- 专业 -->
      <van-cell v-if="radio == '1'">
        <van-field
          readonly
          label="专业"
          placeholder="请选择专业"
          v-model="dicValue"
          is-link
          arrow-direction="down"
          @focus="showChoice = true"
        ></van-field>
        <van-action-sheet
          v-model="showChoice"
          :round="false"
          :actions="dicNameList"
          close-on-click-action
          lock-scroll
          @select="onSelect"
        />
      </van-cell>
      <!-- 在岗人员 -->
      <van-cell v-else>
        <van-field
          arrow-direction="down"
          readonly
          label="工程师"
          v-model="ngiValue"
          is-link
          placeholder="请选择工程师"
          @focus="show = true"
        ></van-field>
        <van-action-sheet v-model="show">
          <div class="content">
            <div v-if="engineerList.length > 0">
              <table
                class="table"
                border="0"
                rules="rows"
                cellspacing="0"
                align="right"
              >
                <tr class="spec-top" @click="chooseSpec(1)">
                  <th></th>
                  <th>工程师姓名</th>
                  <th>未完成数量</th>
                  <th>在岗专业</th>
                </tr>
                <tr
                  id="spec-item"
                  v-for="(item, index) in engineerList"
                  :key="item.userId"
                  @click="chooseSpec(item.userName)"
                >
                  <td style="width: 3%">
                    <span class="index">{{ index + 1 }}</span>
                  </td>
                  <td class="name">{{ item.userName }}</td>
                  <td>{{ item.wwcNum }}</td>
                  <td>{{ item.specName }}</td>
                </tr>
              </table>
            </div>
            <div v-else style="text-align: center; font-size: 16px">
              暂时没有查询到工程师信息~
            </div>
          </div>
        </van-action-sheet>
      </van-cell>

      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit"
          >确认</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { GetGroupPaiQueryApi, GroupPaiSaveApi } from "@/http/button";
export default {
  name: "GroupZhuanPai",
  data() {
    return {
      radio: "1",
      showChoice: false,
      show: false,
      dicValue: "", // 选择的专业信息
      ngiValue: "", // 选择的在岗人员信息
      dicList: [], // 按专业列表
      dicNameList: [], // 按专业列表 -- 名称
      engineerList: [], // 按在岗人员列表
    };
  },
  computed: {
    headName() {
      return `组内转派(${this.$route.query.orderId})`;
    },
  },
  created() {
    // 获取组内转派信息
    this.getInfo();
  },
  methods: {
    // 获取组内转派信息
    async getInfo() {
      let result = await GetGroupPaiQueryApi(
        JSON.stringify({ id: Number(this.$route.query.id) })
      );
      console.log("组内转派信息", result);
      this.apiResponse(result, ".groupZhuanPai", () => {
        this.dicList = result.dicListItem;
        this.dicNameList = result.dicListItem.map((e) => {
          return { name: e.itemName };
        });
        if (this.dicNameList.length == 0)
          this.dicNameList.push({ name: "暂时没有查询到专业信息~", id: 0 });
        this.engineerList = result.listEngineer;
      });

      /* GetGroupPaiQueryApi(
        JSON.stringify({ id: Number(this.$route.query.id) })
      ).then((res) => {
        if (!res.operationSuccessFlag)
          return this.$toast.fail(res.errorMessage);
        this.dicList = res.dicListItem;
        this.dicNameList = res.dicListItem.map((e) => {
          return { name: e.itemName };
        });
        this.engineerList = res.listEngineer;
      }); */
    },

    chooseType(v) {
      v == 1 ? (this.ngiValue = "") : (this.dicValue = "");
    },
    async onSubmit() {
      let params = {};
      params.id = Number(this.$route.query.id);
      params.disType = Number(this.radio);
      if (this.radio == "1") {
        if (this.dicValue == "") {
          return this.$toast("请选择专业信息");
        }
        params.specId = this.dicList.find(
          (e) => e.itemName == this.dicValue
        )?.itemId;
      } else {
        if (this.ngiValue == "") {
          return this.$toast("请选择在岗人员信息");
        }
        params.engineerId = this.engineerList.find(
          (e) => this.ngiValue == e.userName
        ).userId;
      }
      console.log("组内转派参数", params);
      let data = await GroupPaiSaveApi(JSON.stringify(params));
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
      if (item.id == 0) return;
      this.showChoice = false;
      this.dicValue = item.name;
    },
    chooseSpec(name) {
      this.show = false;
      this.ngiValue = name;
    },
  },
};
</script>

<style lang="less" scoped>
.table {
  text-align: center;
  border-color: #ccc;
  tr {
    line-height: 30px;
    // th,
    // td {
    //   &:first-child {
    //     width: 12px !important;
    //   }
    //   // &:nth-child(n+2) {
    //   //   width: ~"calc((100% - 30px)/3)";
    //   //   // width: 25%;
    //   // }
    // }
  }
  #spec-item td {
    width: 32%;
  }
  .spec-top {
    pointer-events: none;
  }
}

::v-deep .van-radio-group--horizontal {
  justify-content: space-between;
}
.content {
  padding: 15px 12px;
}
</style>