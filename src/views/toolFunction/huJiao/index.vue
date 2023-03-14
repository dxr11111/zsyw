<template>
  <div class="toolHuJiao">
    <!-- 工具-漏话回拨 -->
    <MyHeader name="漏话回拨" left="arrow-left" @goBackEv="goBackFn" />
    <div class="missBackList" v-if="missBackList.length > 0">
      <div
        class="missBackItem"
        v-for="(item, index) in missBackList"
        :key="index"
      >
        <div class="phone" @click="clickPhone(item.mobileNum)">
          <van-icon name="phone-o" />
        </div>
        <div class="content">
          <div class="top">
            <div class="left">
              <span class="custName">{{ item.custName }}</span>
              <span class="mobileNum">{{ item.mobileNum }}</span>
            </div>
            <div class="right">
              <div class="delete" @click="deleteItem(item.id)">
                <van-icon name="delete-o" />
              </div>
            </div>
          </div>
          <div class="bottom">
            <div class="left">
              <span class="workInfo">{{ item.workInfo }}</span>
            </div>
            <div class="right">
              <span class="backTime">
                {{ item.backTime }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Empty v-else></Empty>
    <!-- 呼叫号码弹出层 -->
    <van-popup
      v-model="callNumberShow"
      class="callNumber"
      @click-overlay="cancelCall"
    >
      <ul>
        <li class="title">确认呼出</li>
        <li class="checkBox">
          <!-- 被叫手机显示XXX的本机号码 -->
          <van-checkbox v-model="dialFlagChecked" shape="square"
            >被叫手机显示{{ loginNo }}的本机号码</van-checkbox
          >
        </li>
        <li class="selectRegion">
          <span @click="confirmCall">确认呼出</span>
          <span @click="cancelCall">取消</span>
        </li>
      </ul>
    </van-popup>
  </div>
</template>

<script>
import {
  reqToolMissBackQuery,
  reqToolMissBackDelete,
  reqHuJiaoCall,
} from "@/http/tools";
export default {
  name: "toolHuJiao",
  data() {
    return {
      missBackList: [],
      // 呼出号码
      mobileNum: "",
      callNumberShow: false,
      dialFlagChecked: false,
      loginNo: localStorage.getItem("userName") || "",
    };
  },
  methods: {
    // 回退
    goBackFn() {
      this.$router.go(-1);
    },
    // 漏话回拨-查询
    async getQuery() {
      let callUserName = this.$store.getters.loginNo;
      let result = await reqToolMissBackQuery(JSON.stringify({ callUserName }));
      console.log("漏话回拨查询结果", result);
      this.apiResponse(result, ".toolHuJiao", () => {
        // 响应成功的方法
        this.missBackList = result.listMissBackTel;
      });
    },
    // 点击电话标识
    clickPhone(mobileNum) {
      this.callNumberShow = true;
      this.mobileNum = mobileNum;
      /*       this.$dialog
        .confirm({
          message: mobileNum,
          getContainer: ".toolHuJiao",
          className: "confirmDialog",
          confirmButtonText: "云入户呼叫",
          cancelButtonText: "返回",
        })
        .then(async () => {
          // 点击云入户呼叫
          let id = 0;
          let called = mobileNum;
          let callNumberType = "漏话回拨";
          let hujiaoFlag = 1;
          let result = await reqHuJiaoCall(
            JSON.stringify({ id, called, callNumberType, hujiaoFlag })
          );
          console.log("云入户呼叫结果", result);
          this.apiResponse(result, ".toolHuJiao", () => {this.getQuery();});
        })
        .catch(() => {}); */
    },
    // 点击删除标识
    async deleteItem(id) {
      let result = await reqToolMissBackDelete(JSON.stringify({ id }));
      console.log("删除结果", result);
      this.apiResponse(result, ".toolHuJiao", () => {});
      this.getQuery();
    },
    // 确认呼出
    async confirmCall() {
      // 点击云入户呼叫
      let id = 0;
      let called = this.mobileNum;
      let callNumberType = "漏话回拨";
      let hujiaoFlag = 1;
      let dialFlag = 0;
      if (this.dialFlagChecked) dialFlag = 1;
      let result = await reqHuJiaoCall(
        JSON.stringify({ id, called, callNumberType, hujiaoFlag, dialFlag })
      );
      console.log("云入户呼叫结果", result);
      this.apiResponse(result, ".toolHuJiao", () => {
        this.getQuery();
        this.cancelCall();
      });
    },
    // 取消呼出
    cancelCall() {
      this.callNumberShow = false;
      this.dialFlagChecked = false;
    },
  },
  created() {
    // 漏话回拨-查询
    this.getQuery();
  },
};
</script>

<style scoped lang="less">
.toolHuJiao {
  height: 100%;
  background-color: @bg-color;
  .missBackList {
    .missBackItem {
      display: flex;
      align-items: center;
      padding: 10px;
      margin-bottom: 10px;
      background-color: #fff;
      color: #b5afaf;
      .phone {
        width: 30px;
        height: 30px;
        line-height: 30px;
        margin-right: 10px;
        // border: 1px solid #e0e0e0;
        box-shadow: 0 0 5px #b5afaf;
        border-radius: 15px;
        .van-icon-phone-o {
          color: @theme-color;
        }
      }
      .content {
        flex: 1;
        /* display: flex;
        justify-content: space-between;
        text-align: left;
        .info {
          // flex: 3;
          .top {
            display: flex;
            margin-bottom: 5px;
            color: #232323;
            .mobileNum {
              margin-left: 20px;
            }
          }
          .bottom {
            .workInfo {
              display: inline-block;
              width: 150px;
              overflow: hidden;
              word-break: break-all;
            }
          }
        }
        .right {
          // flex: 1;
          display: flex;
          flex-direction: column;
          text-align: right;
          .delete {
            margin-bottom: 5px;
            .van-icon-delete-o {
              font-size: 20px;
            }
          }
        } */
        .top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          .left {
            flex: 1;
            display: flex;
            align-items: center;
            color: #232323;
            .mobileNum {
              margin-left: 20px;
            }
          }
          .right {
            .delete {
              .van-icon-delete-o {
                font-size: 20px;
              }
            }
          }
        }
        .bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .workInfo {
            word-break: break-all;
          }
        }
        .left {
          text-align: left;
        }
        .right {
          text-align: right;
        }
      }
    }
  }
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
        &.checkBox {
          height: 50px;
        }
        &.selectRegion {
          display: flex;
          justify-content: space-around;
          border: 1px solid #4472c4;
          span {
            width: 30%;
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
}
</style>