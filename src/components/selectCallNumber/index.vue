<template>
  <!-- 预约，修改预约选择呼出号码 -->
  <div class="selectCallNumber">
    <van-popup
      v-model="callNumberShow"
      class="callNumber"
      @click-overlay="closeCallNumShow"
    >
      <ul>
        <li class="title">选择呼出号码</li>
        <li class="num">
          <div
            v-for="(phone, index) in phoneList"
            :key="index"
            @click="clickPhone(phone)"
            :class="phone === pickPhone ? 'checked' : ''"
          >
            {{ phone }}
          </div>
        </li>
        <li class="checkBox">
          <!-- 被叫手机显示XXX的本机号码 -->
          <van-checkbox v-model="dialFlagChecked" shape="square"
            >被叫手机显示{{ loginNo }}的本机号码</van-checkbox
          >
        </li>
        <li class="selectRegion">
          <span @click="confirmCall">确认呼出</span>
          <span @click="manualDialing">手工拨号</span>
          <span @click="closeCallNumShow">取消</span>
        </li>
      </ul>
    </van-popup>
    <!-- 手工拨号 -->
    <van-overlay :show="keyShow" @click="closeKeyBoard" class="phoneKeyBoard">
      <div class="wrapper" @click.stop>
        <PhoneKeyBoard />
      </div>
    </van-overlay>
  </div>
</template>

<script>
import PhoneKeyBoard from "@/components/selectCallNumber/phoneKeyBoard.vue";
import { mapState } from "vuex";

export default {
  name: "SelectCallNumber",
  components: { PhoneKeyBoard },
  props: ["custPhone"],

  data() {
    return {
      pickPhone: "", // 选中状态的电话号
      dialFlagChecked: false,
      loginNo: localStorage.getItem("userName") || "",
    };
  },
  computed: {
    phoneList() {
      if (this.custPhone) {
        let phoneList = this.custPhone.split(",");
        if (phoneList.length == 1) {
          this.pickPhone = phoneList[0];
        }
        return phoneList;
      }
    },
    ...mapState("workBench", ["callNumberState"]),
    keyShow: {
      get() {
        return this.callNumberState.keyShow; // 控制数字键盘显示/隐藏
      },
      set() {},
    },
    callNumberShow: {
      get() {
        return this.callNumberState.callNumberShow; // 控制呼叫号码弹出层显示/隐藏
      },
      set() {},
    },
  },

  methods: {
    // 数字键盘
    // 点击手工拨号，弹出数字键盘
    manualDialing() {
      this.callNumberShow = false;
      this.keyShow = false;
      setTimeout(() => {
        this.keyShow = true;
      }, 100);
      this.$store.commit("workBench/CHANGECALLNUMBERSTATE", {
        callNumberShow: false,
        keyShow: true,
      });
    },

    // 点击单个号码
    clickPhone(phone) {
      this.pickPhone = phone;
    },
    // 确认呼出
    confirmCall() {
      if (this.pickPhone == "") {
        return this.$toast("请选择呼出号码");
      }
      this.callNumberShow = false;
      this.$store.commit("workBench/CHANGECALLNUMBERSTATE", {
        callNumberShow: false,
        keyShow: false,
      });
      // 向父组件传递选中的号码，以及dialFlag
      this.$emit("judgeSelectPhone", this.pickPhone, this.dialFlagChecked);
    },
    // 关闭呼出号码弹出层
    closeCallNumShow() {
      this.callNumberShow = false;
      this.$store.commit("workBench/CHANGECALLNUMBERSTATE", {
        callNumberShow: false,
        keyShow: false,
      });
    },

    // 关闭手工拨号
    closeKeyBoard() {
      this.keyShow = false;
      this.$store.commit("workBench/CHANGECALLNUMBERSTATE", {
        callNumberShow: false,
        keyShow: false,
      });
    },
  },
};
</script>

<style scoped lang="less">
.selectCallNumber {
  .callNumber {
    border-radius: 10px;
    background-color: #ebeaef;
    ul {
      width: 300px;
      li {
        padding: 10px;
        &.title {
          color: #000;
          border: 1px solid #4472c4;
        }
        &.num {
          width: 50%;
          margin: 10px auto;
          padding: 0;
          border: 1px solid #4472c4;
          color: #c47244;
          .checked {
            background-color: #4472c4;
            color: #fff;
          }
          div {
            padding: 6px;
            border-bottom: 1px solid #4472c4;
            &:last-child {
              border-bottom: 0;
            }
          }
        }
        &.selectRegion {
          display: flex;
          justify-content: space-around;
          border: 1px solid #4472c4;
          span {
            flex: 1;
            padding: 5px;
            margin-left: 5px;
            border-radius: 5px;
            background: #4472c4;
            color: #fff;
            font-size: 14px;
            &:first-child {
              border-right: 1px solid #e0e0e0;
              margin-left: 0;
            }
          }
        }
      }
    }
  }
  .phoneKeyBoard {
    z-index: 1000;
  }
}
</style>