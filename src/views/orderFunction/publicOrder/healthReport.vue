<template>
  <div class="healthReport">
    <MyHeader
      :name="headName"
      left="arrow-left"
      right="replay"
      @goBackEv="goBackFn"
      @rightEv="refreshFn"
    />
    <div class="main">
      <van-form @submit="onSubmit">
        <div class="row1">
          <!-- 网线类型 -->
          <van-field
            name="cabelType"
            label="网线类型"
            :value="cabelTypeValue"
            @click="cabelTypeShow = true"
            is-link
            arrow-direction="down"
            placeholder="请选择"
            readonly
          />
          <van-action-sheet
            v-model="cabelTypeShow"
            :actions="cabelTypeActions"
            cancel-text="取消"
            close-on-click-action
            @select="selectCabelType"
          />
          <!-- 生成健康报告 -->
          <van-button type="info">生成健康报告</van-button>
        </div>

        <!-- 是否有IPTV -->
        <div class="iptv">
          <span class="title">是否有IPTV</span>
          <div class="button">
            <van-button
              native-type="button"
              :type="IPTV === 1 ? 'info' : ''"
              @click="clickIPTV(true)"
              >是</van-button
            >
            <van-button
              native-type="button"
              :type="IPTV === 0 ? 'info' : ''"
              @click="clickIPTV(false)"
              >否</van-button
            >
          </div>
        </div>
        <!-- 机顶盒连接方式 -->
        <van-field
          name="connectType"
          label="IPTV机顶盒连接方式"
          :value="connectTypeValue"
          @click="connectTypeShow = true"
          is-link
          arrow-direction="down"
          placeholder="请选择"
          readonly
          class="connect"
          v-if="IPTV == 1"
        />
        <van-action-sheet
          v-model="connectTypeShow"
          :actions="connectTypeActions"
          cancel-text="取消"
          close-on-click-action
          @select="selectConnectType"
        />
      </van-form>
      <div class="record">
        <!-- 健康报告历史记录 -->
        <van-divider
          :style="{
            borderColor: '#9697a6',
            padding: '10px',
          }"
          >健康报告历史记录</van-divider
        >

        <van-collapse v-model="foldItems">
          <!-- 测试状态 -->
          <van-collapse-item
            :value="report.testStatusName"
            v-for="(report, index) in reportList"
            :key="index"
          >
            <template #title>
              <span class="num">{{ index + 1 }}</span>
              <span class="title">{{ report.sendTime }}</span>
            </template>
            <table>
              <th>基本信息</th>
              <tr>
                <td>故障号码</td>
                <td v-if="report.balkPhone">{{ report.balkPhone }}</td>
                <td v-else>--</td>
              </tr>
              <tr>
                <td>宽带账号</td>
                <td v-if="report.broadbandAccount">
                  {{ report.broadbandAccount }}
                </td>
                <td v-else>--</td>
              </tr>
              <tr>
                <td>宽带编码</td>
                <td v-if="report.broadbandCode">{{ report.broadbandCode }}</td>
                <td v-else>--</td>
              </tr>

              <th>宽带</th>
              <tr>
                <td>认证速率</td>
                <td v-if="report.authenticationRate">
                  {{ report.authenticationRate }}
                </td>
                <td v-else>--</td>
              </tr>
              <tr>
                <td>终端类型(ONU型号)</td>
                <td v-if="report.onuType">{{ report.onuType }}</td>
                <td v-else>--</td>
              </tr>
              <tr>
                <td>终端侧接入方式(接入类型&lt;网络&gt;)</td>
                <td v-if="report.terminalLinkType">
                  {{ report.terminalLinkType }}
                </td>
                <td v-else>--</td>
              </tr>
              <tr>
                <td>终端MAC(ONU的MAC)</td>
                <td v-if="report.onuMac">{{ report.onuMac }}</td>
                <td v-else>--</td>
              </tr>
              <tr>
                <td>LAN1速率</td>
                <td v-if="report.hguLan1Rate">{{ report.hguLan1Rate }}</td>
                <td v-else>--</td>
              </tr>
              <tr>
                <td>LAN2速率</td>
                <td v-if="report.hguLan2Rate">{{ report.hguLan2Rate }}</td>
                <td v-else>--</td>
              </tr>
              <tr>
                <td>LAN3速率</td>
                <td v-if="report.hguLan3Rate">{{ report.hguLan3Rate }}</td>
                <td v-else>--</td>
              </tr>
              <tr>
                <td>LAN4速率</td>
                <td v-if="report.hguLan4Rate">{{ report.hguLan4Rate }}</td>
                <td v-else>--</td>
              </tr>
              <tr>
                <td>签约速率</td>
                <td v-if="report.signRate">{{ report.signRate }}</td>
                <td v-else>--</td>
              </tr>
              <tr>
                <td>测速速率</td>
                <td v-if="report.testRate">{{ report.testRate }}</td>
                <td v-else>--</td>
              </tr>
              <tr>
                <td>网线类型</td>
                <td v-if="report.netLineType">
                  {{ cabelTypeActions[report.netLineType - 1]?.name }}
                </td>
                <td v-else>--</td>
              </tr>
              <tr>
                <td>光猫入网时间</td>
                <td v-if="report.onuEnterDate">{{ report.onuEnterDate }}</td>
                <td v-else>--</td>
              </tr>
              <tr>
                <td>ONU接收光功率(dBm)</td>
                <td v-if="report.onuReceiveRate">
                  {{ report.onuReceiveRate }}
                </td>
                <td v-else>--</td>
              </tr>

              <th>WIFI</th>
              <tr>
                <td>中心点WIFI速率</td>
                <td v-if="report.panRate">{{ report.panRate }}</td>
                <td v-else>--</td>
              </tr>
              <tr>
                <td>WIFI速率同城排名</td>
                <td v-if="report.rankings">{{ report.rankings }}</td>
                <td v-else>--</td>
              </tr>

              <th>IPTV</th>
              <tr>
                <td>是否有IPTV</td>
                <td v-if="report.isHaveIptvName">
                  {{ report.isHaveIptvName }}
                </td>
                <td v-else>--</td>
              </tr>
              <tr>
                <td>IPTV账号</td>
                <td v-if="report.iptvAccount">
                  {{ report.iptvAccount }}
                </td>
                <td v-else>--</td>
              </tr>
              <tr>
                <td>是否有3568业务</td>
                <td v-if="report.isHave3568Name">
                  {{ report.isHave3568Name }}
                </td>
                <td v-else>--</td>
              </tr>
              <tr>
                <td>机顶盒型号</td>
                <td v-if="report.setTopBoxType">{{ report.setTopBoxType }}</td>
                <td v-else>--</td>
              </tr>
              <tr>
                <td>机顶盒连接方式</td>
                <td v-if="report.iptvLinkType">
                  {{ connectTypeActions[report.iptvLinkType - 1]?.name }}
                </td>
                <td v-else>--</td>
              </tr>
            </table>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import { reqHealthQuery, reqHealthSubmit } from "@/http/button";
export default {
  name: "HealthReport",
  data() {
    return {
      headName: `健康报告(${this.$route.query.orderNum})`,
      // 网线类型
      cabelTypeShow: false,
      cabelTypeValue: "",
      cabelTypeActions: [
        { name: "五类超五类", id: 1 },
        { name: "六类及以上", id: 2 },
        { name: "未知", id: 3 },
      ],
      // 是否有IPTV
      IPTV: 0, // 1是 0否
      // 机顶盒连接方式
      connectTypeShow: false,
      connectTypeValue: "",
      connectTypeActions: [
        { name: "有线", id: 1 },
        { name: "WIFI6", id: 2 },
        { name: "电力猫", id: 3 },
        { name: "WIFI5及以下", id: 4 },
        { name: "未使用", id: 5 },
      ],
      // 健康报告折叠面板
      foldItems: [],
      reportList: [],
    };
  },
  methods: {
    // 回退
    goBackFn() {
      this.$router.go(-1);
    },
    // 刷新
    refreshFn() {
      this.$router.replace({
        path: "/refresh",
        query: this.$route.query,
      });
    },
    // 选择网线类型
    selectCabelType(action) {
      this.cabelTypeValue = action?.name;
    },
    // 是否选择IPTV
    clickIPTV(bool) {
      if (bool) {
        this.IPTV = 1;
      } else {
        this.IPTV = 0;
      }
    },
    //选择机顶盒连接方式
    selectConnectType(action) {
      this.connectTypeValue = action?.name;
    },
    // 健康报告提交
    async onSubmit(values) {
      // 表单校验
      if (this.cabelTypeValue == "") return this.$toast("请选择网线类型");
      if (this.connectTypeValue == "")
        return this.$toast("请选择IPTV机顶盒连接方式");

      let id = parseInt(this.$route.query.id);
      let cabelType = 0; // 网线类型
      this.cabelTypeActions.forEach((cabel) => {
        if (cabel.name == values.cabelType) {
          cabelType = cabel.id;
        }
      });
      let hasIptv = this.IPTV; // 是否有IPTV
      let stbConnType = 1; // 机顶盒连接方式
      this.connectTypeActions.forEach((cnt) => {
        if (cnt.name == values.connectType) {
          stbConnType = cnt.id;
        }
      });
      let result = await reqHealthSubmit(
        JSON.stringify({ id, cabelType, hasIptv, stbConnType })
      );
      console.log("健康报告提交结果", result);
      this.apiResponse(result, ".healthReport", () => {
        // 操作成功 刷新列表/工作台
        this.operationSuccessRefresh(true);
      });
    },
    // 健康报告查询
    async getHealthQuery() {
      let id = parseInt(this.$route.query.id);
      try {
        let result = await reqHealthQuery(JSON.stringify({ id }));
        this.apiResponse(result, ".healthReport", () => {
          this.reportList = result.balkAdslTestReportInfoList;
        });
      } catch (error) {
        console.log("err", error);
      }
    },
  },
  created() {
    // 健康报告查询
    this.getHealthQuery();
  },
};
</script>

<style lang="less" scoped>
.healthReport {
  height: 100%;
  background-color: #f8f7fc;
  .activeButton {
    background-color: #1989fa;
  }

  .main {
    /deep/.van-cell__value.van-field__value {
      .van-field__body {
        input {
          text-align: right;
        }
      }
    }
    .row1 {
      display: flex;
      .van-cell {
        flex: 2;
      }
      .van-button {
        margin-right: 10px;
      }
    }
    .iptv {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      padding: 0 10px 0 16px;
      background-color: #fff;
      .title {
        display: flex;
        align-items: center;
        color: #646566;
        font-size: 14px;
      }
    }
    .connect {
      margin-top: 10px;
      /deep/.van-cell__title.van-field__label {
        flex: 2;
      }
    }
    .record {
      .van-collapse {
        .van-collapse-item {
          /deep/.van-cell__title {
            display: flex;
            flex: 2;
            .num {
              display: inline-block;
              width: 20px;
              height: 20px;
              margin-right: 5px;
              line-height: 20px;
              border-radius: 10px;
              background-color: #1989fa;
              color: #fff;
            }
          }
        }
        /deep/.van-collapse-item__content {
          table {
            width: 100%;
            text-align: left;
            th {
              display: flex;
              padding: 5px;
              color: #000;
            }
            tr {
              display: flex;
              justify-content: space-between;
              padding: 5px;
              border-bottom: 1px solid #f3f4f5;
            }
          }
        }
      }
    }
  }
}
</style>
