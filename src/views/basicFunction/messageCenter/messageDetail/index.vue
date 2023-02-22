<template>
  <div class="messageDetail">
    <!-- 消息详情 -->
    <MyHeader left="arrow-left" name="消息详情" @goBackEv="goBack" />
    <div class="readItem">
      <div class="title">
        <h3>{{ msgList.title }}</h3>
      </div>
      <div class="content">
        <span class="time">{{ msgList.createtime }}</span>
        <span class="address">{{ msgList.content }}</span>
      </div>
    </div>
    <!-- 查看工单按钮是否展示条件 sheetAllId > 0 -->
    <div class="button">
      <van-button type="info" v-if="msgList.sheetAllId > 0" @click="clickButton"
        >查看工单</van-button
      >
    </div>
  </div>
</template>

<script>
import { reqgetMessageContent, sheetShowDetail } from '@/http'
export default {
  name: "MessageDetail",
  data () {
    return {
      msgList: [],
    }
  },
  methods: {
    goBack () {
      // this.$router.push("/messageCenter/messageList");
      this.$router.go(-1)
    },
    // 点击查看工单
    clickButton () {
      // 跳转到工单详情页 listDetail
      this.$router.push({
        name: "ListDetail",
        query: {
          id: this.msgList.sheetAllId,
        },
      });

    },
    // 发送消息详情请求
    async getMsgDetail () {
      let result = await reqgetMessageContent(JSON.stringify({ msgId: this.$route.query.msgId }))
      console.log('消息详情', result)
      this.apiResponse(result, '.messageDetail', () => {
        this.msgList = result.data
      })

    }
  },
  created () {
    // 发送消息详情请求
    this.getMsgDetail()
  },
  beforeRouteLeave (to, from, next) {
    // 销毁
    let destroyList = ['MessageList']
    if (destroyList.indexOf(to.name) !== -1) {
      // 销毁页面
      this.$destroy()
    }

    next()
  },
};
</script>

<style scoped lang="less">
.messageDetail {
  .readItem {
    height: 100px;
    margin: 10px;
    background-color: #fff;
    text-align: left;
    .title {
      display: flex;
      height: 42px;
      line-height: 42px;
    }
    .content {
      display: flex;
      flex-direction: column;
      .time {
        color: #bfbcc0;
      }
      .address {
        padding-top: 10px;
      }
    }
  }
  .button {
    padding: 20px 20px 0 0;
    text-align: right;
  }
}
</style>