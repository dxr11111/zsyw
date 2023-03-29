<template>
  <div class="phoneKeyBoard">
    <!-- 显示点击的号码 -->
    <van-field
      v-model="num"
      input-align="right"
      placeholder="请输入电话号码"
      readonly
    />
    <div class="key-container">
      <!-- 键盘 -->
      <div class="keyboard" @click.stop="handleKeyPress">
        <div class="handleKey">
          <div class="key-row">
            <div class="key-cell" data-num="1">1</div>
            <div class="key-cell" data-num="2">2</div>
            <div class="key-cell" data-num="3">3</div>
          </div>
          <div class="key-row">
            <div class="key-cell" data-num="4">4</div>
            <div class="key-cell" data-num="5">5</div>
            <div class="key-cell" data-num="6">6</div>
          </div>
          <div class="key-row">
            <div class="key-cell" data-num="7">7</div>
            <div class="key-cell" data-num="8">8</div>
            <div class="key-cell" data-num="9">9</div>
          </div>
          <div class="key-row">
            <div
              class="key-cell"
              data-num="*"
              :style="{ fontSize: '40px', lineHeight: '68px' }"
            >
              *
            </div>
            <div class="key-cell" data-num="0">0</div>
            <div class="key-cell" data-num="#">#</div>
          </div>
          <!-- 被叫手机显示XXX的本机号码 -->
          <van-checkbox v-model="dialFlagChecked"
            >被叫手机显示{{ loginNo }}的本机号码</van-checkbox
          >

          <div class="key-row icon">
            <div class="key-confirm" @click="handleConfirmKey">
              <i class="iconfont icon-dianhuatianchong"></i>
            </div>
            <div class="key-clear" @click="handleDeleteKey">
              <!-- <i class="iconfont icon-cuowu"></i> -->
              <img src="./images/icon.png" alt="" :style="'width:20px'" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PhoneKeyBoard",
  data() {
    return {
      num: "",
      dialFlagChecked: false,
      loginNo: localStorage.getItem("userName") || "",
    };
  },
  inject: ["confirmEvent"],
  watch: {
    "$store.state.workBench.callNumberState.keyShow"(value) {
      if (value) {
        // 拨号键盘显示
        // 清除上一次被叫手机显示XXX的本机号码勾选
        if (this.dialFlagChecked) this.dialFlagChecked = false;
      } else if (value == false) {
        this.num = "";
      }
    },
  },

  methods: {
    // 处理按键
    handleKeyPress(e) {
      const num = e.target.dataset.num; // 点击的那个键盘代表值，即上面data-num嵌入的自定义数据，D：删除，C：清空，S：确认，‘’：无效，0-9：数字
      // 不同按键处理逻辑
      // '' 代表无效按键，直接返回
      if (num === "" || num === undefined) return false;
      this.handleNumberKey(num);
    },
    // 处理删除键
    handleDeleteKey() {
      console.log("点击删除：", this.num);
      // 当点击了数字键盘上的数字后，它也会发生变化的
      const S = this.num;
      // 如果没有输入（或者长度为0），直接返回
      if (!S.length) return false;
      // 否则删除最后一个
      this.num = S.substring(0, S.length - 1);
      console.log("删除：", this.num);
      this.$emit("getManualDialingNum", this.num); // 把删除处理后了的值返回给父组件
    },
    // 处理数字
    handleNumberKey(num) {
      const S = this.num; // 拿到父组件点击的那个输入框的值
      // 在原有的基础上将点击的那个数字按键的数字加在原有数字字符串末尾，
      // 这里应该用模板字符串的，这里写笔记才看到，this.num = `${S}${num}`;  // 这里赋值是为了配合上面删除时使用
      this.num = S + num;
      this.$emit("getManualDialingNum", this.num);
    },
    // 确认键
    handleConfirmKey() {
      const S = this.num;
      console.log("点击确认键：", S);
      // this.$emit('confirmEvent', S);
      this.confirmEvent(S, this.dialFlagChecked);
    },
  },
};
</script>

<style lang="less" scoped>
.phoneKeyBoard {
  position: fixed;
  width: 100%;
  bottom: 0;
  height: 500px;
  padding-top: 20px;
  border: 1px solid #e0e0e0;
  background-color: #fff;
  .van-cell {
    /deep/.van-field__body {
      input {
        text-align: left;
        font-size: 20px;
      }
    }
  }
  .key-container {
    .keyboard {
      .handleKey {
        display: flex;
        flex-direction: column;
        .key-row {
          display: flex;
          justify-content: center;
          font-size: 20px;
          font-weight: 600;
          .key-cell {
            width: 50px;
            height: 50px;
            margin: 10px;
            line-height: 50px;
            border-radius: 25px;
            border: 1px solid @theme-color;
            color: @theme-color;
          }
        }
        .icon {
          position: relative;
          margin-top: 30px;
          .key-confirm {
            width: 100px;
            height: 30px;
            line-height: 30px;
            background-color: @theme-color;
            color: #fff;
          }
          .key-clear {
            position: absolute;
            right: 100px;
            margin-left: 20px;
            color: #3e3838;
          }
        }
        .van-checkbox {
          margin: 20px auto 0;
        }
      }
    }
  }
}
</style>

