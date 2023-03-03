<template>
  <!-- iptv解绑 -->
  <div class="iptvUnBunding">
    <MyHeader
      :name="headName"
      left="arrow-left"
      right="replay"
      @goBackEv="goBackFn"
      @rightEv="refreshFn"
    />
    <div class="main">
      <template v-if="iptvInfo.length > 0">
        <div class="item" v-for="(item, index) in iptvInfo" :key="index">
          <!--  解绑 -->
          <template v-if="item.iptvResultCode === '1'">
            <div class="left">
              <div class="num">{{ index + 1 }}</div>
              <div class="content">
                <div class="title">
                  <span>账号：</span>
                  <span>产品名称：</span>
                </div>
                <div class="value">
                  <span>{{ item.iptvnbr }}</span>
                  <span>{{ item.iptvProdName }}</span>
                </div>
              </div>
            </div>
            <div class="right">
              <van-button type="info" @click="iptvUnBunding(item.iptvnbr, '0')"
                >解绑</van-button
              >
            </div>
          </template>
          <!-- 正在解绑 -->
          <template v-if="item.iptvResultCode === '2'">
            <div class="left">
              <div class="num">{{ index + 1 }}</div>
              <div class="content">
                <div class="title">
                  <span>账号：</span>
                  <span>产品名称：</span>
                </div>
                <div class="value">
                  <span>{{ item.iptvnbr }}</span>
                  <span>{{ item.iptvProdName }}</span>
                </div>
              </div>
            </div>
            <div class="right">→正在解绑</div>
          </template>
          <!-- 重新解绑/异常 -->
          <template
            v-if="item.iptvResultCode === '3' || item.iptvResultCode === '5'"
          >
            <div class="left">
              <div class="num">{{ index + 1 }}</div>
              <div class="content">
                <div class="title">
                  <span>账号：</span>
                  <span>产品名称：</span>
                  <span>解绑结果：</span>
                </div>
                <div class="value">
                  <span>{{ item.iptvnbr }}</span>
                  <span>{{ item.iptvProdName }}</span>
                  <span style="color: red">{{ item.iptvResult }}</span>
                </div>
              </div>
            </div>
            <div class="right">
              <van-button
                type="info"
                style="padding: 0"
                @click="iptvUnBunding(item.iptvnbr, '1')"
                >重新解绑</van-button
              >
            </div>
          </template>
          <!-- 解绑成功 -->
          <template v-if="item.iptvResultCode === '4'">
            <div class="left">
              <div class="num">{{ index + 1 }}</div>
              <div class="content">
                <div class="title">
                  <span>账号：</span>
                  <span>产品名称：</span>
                </div>
                <div class="value">
                  <span>{{ item.iptvnbr }}</span>
                  <span>{{ item.iptvProdName }}</span>
                </div>
              </div>
            </div>
            <div class="right">√解绑成功</div>
          </template>
        </div>
      </template>
      <Empty v-else />
    </div>
  </div>
</template>

<script>
import {
  reqIomNewIptvUnBundingQuery,
  reqIomNewIptvUnBunding,
} from "@/http/button";
import jquery from "jquery";
export default {
  name: "IptvUnBunding",
  data() {
    return {
      headName: `IPTV解绑(${this.$route.query.orderNum})`,
      iptvInfo: [],
    };
  },
  methods: {
    // 回退
    goBackFn() {
      this.$router.go(-1);
    },
    // 刷新
    refreshFn() {
      this.$router.go(0);
    },
    // iptv解绑前查询
    async getIomNewIptvUnBundingQuery() {
      let result = await reqIomNewIptvUnBundingQuery(
        JSON.stringify({ id: parseInt(this.$route.query.id) })
      );
      console.log("iptv解绑前查询结果", result);
      this.apiResponse(result, ".iptvUnBunding", () => {
        this.iptvInfo = result.iptvInfo;
      });
    },
    // iptv解绑
    iptvUnBunding(iptvnbr, type) {
      // 点击解绑
      if (type == "0") {
        this.$dialog
          .confirm({
            title: "提示",
            message: `确认解绑${iptvnbr}吗？`,
            confirmButtonColor: "#1989fa",
          })
          .then(async () => {
            this.sendIptvUnBunding(iptvnbr);
          })
          .catch();
      } else {
        // 点击重新解绑
        this.sendIptvUnBunding(iptvnbr);
      }
    },
    async sendIptvUnBunding(iptvnbr) {
      let id = parseInt(this.$route.query.id);
      let iptvNbrs = [iptvnbr];
      let result = await reqIomNewIptvUnBunding(
        JSON.stringify({ id, iptvNbrs })
      );
      console.log("iptv解绑结果", result);
      this.apiResponse(result, ".iptvUnBunding", () => {
        this.getIomNewIptvUnBundingQuery();
      });
    },
  },
  created() {
    // iptv解绑前查询
    this.getIomNewIptvUnBundingQuery();
  },
};
</script>

<style scoped lang="less">
.iptvUnBunding {
  .main {
    .item {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      border-bottom: 1px solid #e0e0e0;
      .left {
        display: flex;
        align-items: center;
        .num {
          width: 30px;
          height: 30px;
          border-radius: 15px;
          line-height: 30px;
          background: #1989fa;
          color: #fff;
        }
        .content {
          display: flex;
          flex: 1;
          .title,
          .value {
            display: flex;
            flex-direction: column;
            text-align: left;
            span {
              padding: 5px;
            }
          }
          .value {
            flex: 1;
            span {
              color: #7d8186;
            }
          }
          /*  .value span:last-child {
            position: relative;
            bottom: -5px;
          } */
        }
      }
      .right {
        display: flex;
        align-items: center;
        .van-button {
          width: 80px;
          border-radius: 10px;
        }
      }
    }
  }
}
</style>