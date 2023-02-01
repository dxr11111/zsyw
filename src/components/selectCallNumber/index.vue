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
        <li
          v-for="(phone, index) in phoneList"
          :key="index"
          @click="clickPhone(phone)"
        >
          {{ phone }}
        </li>
        <li class="selectRegion">
          <span @click="closeCallNumShow">取消</span>
          <span @click="manualDialing">手工拨号</span>
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
import PhoneKeyBoard from '@/components/selectCallNumber/phoneKeyBoard.vue'
import { mapState } from 'vuex'


export default {
  name: 'SelectCallNumber',
  components: { PhoneKeyBoard },
  props: ['custPhone'],

  data () {
    return {

    }
  },
  computed: {
    phoneList () {
      if (this.custPhone) {
        return this.custPhone.split(',')
      }
    },
    ...mapState("workBench", ["callNumberState"]),
    keyShow: {
      get () {
        return this.callNumberState.keyShow // 控制数字键盘显示/隐藏
      },
      set () { },
    },
    callNumberShow: {
      get () {
        return this.callNumberState.callNumberShow // 控制呼叫号码弹出层显示/隐藏

      },
      set () { },
    }
  },

  methods: {
    // 数字键盘
    // 点击手工拨号，弹出数字键盘
    manualDialing () {
      this.callNumberShow = false
      this.keyShow = false;
      setTimeout(() => { this.keyShow = true; }, 100);
      this.$store.commit('workBench/CHANGECALLNUMBERSTATE', {
        callNumberShow: false,
        keyShow: true,
      })
    },

    // 点击单个号码
    clickPhone (phone) {
      this.callNumberShow = false
      this.$store.commit('workBench/CHANGECALLNUMBERSTATE', {
        callNumberShow: false,
        keyShow: false,
      })

      this.$emit('judgeSelectPhone', phone)
    },

    // 关闭呼出号码弹出层
    closeCallNumShow () {
      this.callNumberShow = false
      this.$store.commit('workBench/CHANGECALLNUMBERSTATE', {
        callNumberShow: false,
        keyShow: false,
      })
    },

    // 关闭手工拨号
    closeKeyBoard () {
      this.keyShow = false
      this.$store.commit('workBench/CHANGECALLNUMBERSTATE', {
        callNumberShow: false,
        keyShow: false,
      })

    },
  },

}
</script>

<style scoped lang="less">
.selectCallNumber {
  .callNumber {
    border-radius: 10px;
    background-color: #ebeaef;
    ul {
      width: 200px;
      li {
        padding: 10px;
        color: #4c85d7;
        border-bottom: 1px solid #e6e6e8;
        &.title {
          color: #000;
          font-weight: 600;
        }
        &.selectRegion {
          display: flex;
          justify-content: space-around;
          span {
            flex: 1;
            &:first-child {
              border-right: 1px solid #e0e0e0;
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