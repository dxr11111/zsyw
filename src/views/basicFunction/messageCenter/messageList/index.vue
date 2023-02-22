<template>
  <div class="messageList">
    <!-- 消息中心 -->
    <div class="head" ref="head">
      <MyHeader left="arrow-left" name="消息中心" @goBackEv="goBack" />
    </div>
    <van-tabs
      v-model="isRead"
      swipeable
      @change="tabActive"
      sticky
      :offset-top="offsetTop"
    >
      <van-tab :name="1">
        <template #title>
          <van-badge :content="unReadNum">未读</van-badge>
        </template>
      </van-tab>
      <van-tab :name="2" title="已读"></van-tab>
      <ReadList :postData="postData" @getUnReadNum="getUnReadNum" />
      <!--  <van-tab
        v-for="(item, index) in tabList"
        :key="index"
        :name="item.isRead"
      >
        <template #title>
          <van-badge :content="item.isRead == 1 ? unReadNum : ''">
            {{ item.title }}
          </van-badge>
        </template>
        <ReadList :postData="postData" @getUnReadNum="getUnReadNum" />
      </van-tab> -->
    </van-tabs>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import ReadList from "./components/readList.vue";
import { keepAliveMixin } from "@/utils/mixins/routerKeepAlive";

export default {
  name: "MessageList",
  components: { ReadList },
  mixins: [keepAliveMixin],

  data() {
    return {
      isRead: 1, // 1:未读 2:已读
      tabList: [
        { title: "未读", isRead: 1 },
        { title: "已读", isRead: 2 },
      ],
      postData: {}, // 请求消息列表参数
      unReadNum: "", // 未读消息数
      offsetTop: 0, // 吸顶高度
    };
  },
  computed: {
    ...mapGetters(["getLoginInfo"]),
  },
  methods: {
    // 返回首页
    goBack() {
      this.$router.push("/main/home");
      this.$store.commit("removeThisPage", this.$options.name);
    },
    // 切换标签
    tabActive(name, title) {
      this.isRead = name;
      this.sendParams();
    },

    // 发送请求参数
    sendParams() {
      let isRead = this.isRead;
      let sysIds = [];
      this.getLoginInfo?.userIds.forEach((item) => {
        sysIds.push(item.sysId);
      });
      this.postData = { isRead, sysIds };
    },
    // 从子组件获取消息未读数量
    getUnReadNum(totalCount) {
      this.unReadNum = totalCount;
      if (totalCount == 0) this.unReadNum = "";
    },
  },
  created() {
    // 发送请求参数
    this.sendParams();
  },
  mounted() {
    let headTop = this.$refs.head.clientHeight;
    this.offsetTop = headTop;
  },
};
</script>

<style scoped lang="less">
.messageList {
  min-height: 100%;
  background-color: #f7f4fc;
  .van-tabs {
    /deep/.van-tabs__line {
      background-color: #245bef;
    }
    /deep/.van-tabs__wrap {
      .van-tab__text {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        .van-badge {
          right: inherit;
          padding-top: 1px;
        }
      }
    }
  }
}
</style>