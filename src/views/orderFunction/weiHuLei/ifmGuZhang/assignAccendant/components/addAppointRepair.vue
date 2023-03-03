<template>
  <div>
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBack" />
    <div>
      <van-form>
        <div>
          <van-field
            readonly
            style="background: #fff"
            label="请选择用户地址"
            v-model="currAddress"
            is-link
            arrow-direction="down"
            @focus="showChoice = true"
          ></van-field>
          <van-action-sheet
            v-model="showChoice"
            cancel-text="取消"
            :round="false"
            :actions="addressList"
            close-on-click-action
            @select="onSelect"
          />

          <van-field
            v-if="currAddress == '其他'"
            style="background: #fff"
            label="请输入用户地址"
            placeholder="请输入用户地址文本框"
            v-model="addressInput"
          >
          </van-field>

          <!-- 手工录入维护人 -->
          <van-cell style="padding: 0">
            <div class="label">手工录入维护人</div>
            <div class="flex">
              <span style="margin-left: 4.27vw"
                >姓名
                <input
                  v-model="userName"
                  class="item"
                  placeholder="请输入姓名"
                  type="text"
                />
              </span>
              <span
                >电话
                <input
                  v-model="phoneNumber"
                  class="item"
                  placeholder="请输入电话"
                  type="tel"
                  oninput="value=value.replace(/[^\d]/g,'')"
              /></span>
              <van-button
                type="info"
                size="mini"
                style="width: 40px; height: 30px; margin-right: 4.27vw"
                @click="addEngineer('hand')"
                >新增</van-button
              >
            </div>
          </van-cell>
          <!-- 选择维护人 -->
          <van-cell style="padding: 0">
            <div class="label">选择维护人</div>
            <table
              v-if="engineerInfoList?.length > 0"
              class="table"
              border="1"
              cellspacing="0"
              width="100%"
            >
              <tr>
                <th>姓名</th>
                <th>电话</th>
                <th>在岗状态</th>
                <th style="color: #fff">操作</th>
              </tr>
              <tbody>
                <tr v-for="item in engineerInfoList" :key="item.userId">
                  <td>{{ item.userName }}</td>
                  <td>{{ item.userPhoneNumber }}</td>
                  <td>{{ item.zgState }}</td>
                  <td>
                    <span v-if="item.isAdded" style="color: #245bef"
                      >已添加</span
                    >
                    <van-button
                      v-else
                      type="info"
                      size="mini"
                      style="width: 40px"
                      @click="addEngineer('auto', item)"
                      >新增</van-button
                    >
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else style="text-align: center">未查询到维护人数据</div>
          </van-cell>
          <!-- 当前已选择维护人 -->
          <van-cell style="padding: 0">
            <div class="label">当前已选择维护人</div>
            <table
              v-if="currSelectedEngineerList.length > 0"
              class="table"
              border="1"
              cellspacing="0"
              width="100%"
            >
              <tr>
                <th>姓名</th>
                <th>电话</th>
                <th>在岗状态</th>
                <th>地址</th>
                <th></th>
              </tr>
              <tr
                v-for="(item, index) in currSelectedEngineerList"
                :key="item.userId"
              >
                <td>{{ item.userName }}</td>
                <td>{{ item.phoneNumber }}</td>
                <td>{{ item.zgState || "---" }}</td>
                <td>{{ item.address }}</td>
                <td>
                  <van-button
                    type="info"
                    size="mini"
                    style="width: 40px"
                    @click="delEngineer(item, index)"
                    >删除</van-button
                  >
                </td>
              </tr>
            </table>
          </van-cell>
        </div>

        <div class="btns">
          <van-button type="info" @click="onSubmit">保存</van-button>
          <van-button type="info" @click="goBack">取消</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { GetAssignAccendantApi, AddAssignAccendantApi } from "@/http/button";
export default {
  props: {
    appointRepairInfoList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      headName: `新增维护人(${this.$route.query.orderId})`,
      currAddress: "",
      addressInput: "", // 手动输入的地址值
      showChoice: false,
      userName: "",
      phoneNumber: "",
      engineerInfoList: [], // 工程师列表
      list: [], // 工程师信息备份
      addressList: [], // 地址列表信息
      currSelectedEngineerList: [], // 当前已选择维护人
    };
  },
  created() {
    GetAssignAccendantApi(
      JSON.stringify({ id: Number(this.$route.query.id) })
    ).then((res) => {
      console.log("查询地址和工程师列表", res);
      if (!res.operationSuccessFlag) return this.$toast.fail(res.errorMessage);
      // this.engineerInfoList = res.appointRepairEngineerInfoList
      // this.list = res.appointRepairEngineerInfoList
      this.addressList = res.addressList.map((e) => ({ name: e }));
      this.addressList.push({ name: "其他" });
      // 查询到的工程师如何已添加过，就不可点击;
      let arr = res.appointRepairEngineerInfoList;
      arr.forEach((e) => {
        var flag = this.appointRepairInfoList.find((i) => i.userId == e.userId);
        if (flag) {
          e.isAdded = true;
        } else {
          e.isAdded = false;
        }
      });
      console.log("工程师数据", arr);
      this.engineerInfoList = arr;
      this.list = arr;
    });
  },
  methods: {
    goBack() {
      this.$emit("updateIsShow");
    },
    onSelect(item) {
      this.showChoice = false;
      this.currAddress = item.name;
    },
    // 添加维护人
    addEngineer(type, item) {
      if (this.currAddress === "") return this.$toast("请选择用户地址");
      if (this.currAddress == "其他" && this.addressInput == "") {
        return this.$toast("请填写用户地址");
      }
      // 维护人信息
      let params = {
        id: "",
        userName: "",
        phoneNumber: "",
        operTime: "",
        address: "",
        userId: "",
      };
      // 手动添加维护人
      if (type == "hand") {
        if (this.userName == "") return this.$toast("请输入姓名");
        if (this.phoneNumber == "") return this.$toast("请输入电话");
        // 校验座机(加上前面区号: /0\d{2,3}-\d{7,8}/)和手机号
        let regZ = /[0-9]{8}/;
        let regP =
          /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
        if (this.phoneNumber.length == 8) {
          if (!regZ.test(this.phoneNumber))
            return this.$toast("电话格式不正确");
        } else if (this.phoneNumber.length == 11) {
          if (!regP.test(this.phoneNumber))
            return this.$toast("电话格式不正确");
        } else {
          return this.$toast("电话格式不正确");
        }
        // 判断用户已选择的维护人是否和当前输入的手机号相同
        var flag = this.currSelectedEngineerList.find(
          (e) => e.phoneNumber == this.phoneNumber
        );
        if (flag) return this.$toast("电话号码不能和已选择维护人电话相同"); // 判断电话号码是否和查询到的已维护人相同
        var flag1 = this.appointRepairInfoList.find(
          (e) => e.phoneNumber == this.phoneNumber
        );
        if (flag1) return this.$toast("电话号码不能和已选择维护人电话相同");
        params = {
          id: 0,
          userName: this.userName,
          phoneNumber: this.phoneNumber,
          address:
            this.currAddress == "其他" ? this.addressInput : this.currAddress,
        };
        // this.currSelectedEngineerList.push(params)
        this.userName = "";
        this.phoneNumber = "";
      } else {
        // 在表格中选择添加维护人
        params = {
          id: 0,
          userName: item.userName,
          phoneNumber: item.userPhoneNumber,
          operTime: "",
          address:
            this.currAddress == "其他" ? this.addressInput : this.currAddress,
          userId: item.userId,
          zgState: item.zgState,
        };
        this.engineerInfoList = this.engineerInfoList.filter(
          (e) => e.userId !== item.userId
        );
      }
      this.currSelectedEngineerList.push(params);
      console.log(params);
    },
    // 删除维护人
    delEngineer(e, i) {
      // 删除已查询维护人之后需要返回到之前的数据
      var curr = this.list.filter((item) => item.userId == e.userId);
      console.log("当前删除的项", curr);
      this.engineerInfoList.push(...curr);
      this.currSelectedEngineerList.splice(i, 1);
    },

    async onSubmit() {
      let arr = this.currSelectedEngineerList.map((e) => {
        return {
          id: 0,
          userName: e.userName,
          phoneNumber: e.phoneNumber,
          operTime: "",
          address: e.address,
          userId: e.userId || -1,
        };
      });
      // console.log(JSON.stringify(arr));
      if (arr.length <= 0) return this.$toast("请先添加已选择维护人");
      console.log("选择的维护人列表", arr);
      let data = await AddAssignAccendantApi(
        JSON.stringify({
          id: Number(this.$route.query.id),
          appointRepairInfoList: arr,
        })
      );
      data.operationSuccessFlag
        ? this.$toast.success(data.successMessage)
        : this.$toast.fail(data.errorMessage);
      this.$emit("updateIsShow");
      // 添加之后，重新获取数据
      this.$parent.getAssignAccendantNow();
    },
  },
};
</script>

<style lang="less" scoped>
table {
  border-color: #eee;
  font-size: 14px;
  text-align: center;
  background-color: #fff;
  margin-bottom: 0.67vw;
  tr {
    height: 35px;
  }
}
::v-deep .van-field__label {
  width: 7.2em;
  color: #000;
}
::v-deep .van-cell {
  background-color: rgb(248, 247, 252);
}
.label {
  // display: inline-block;
  margin: 10px 4.27vw;
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  height: 17.33vw;
  background: #fff;
}
.item {
  width: 24.33vw;
  border: 1px solid #eee;
  margin-left: 5px;
  height: 4.33vw;
  font-size: 13px;
  padding: 8px;
}
.btns {
  margin: 16px;
  display: flex;
  justify-content: space-between;
  .van-button {
    height: 30px;
    width: 90px;
    border-radius: 5px;
  }
}
</style>