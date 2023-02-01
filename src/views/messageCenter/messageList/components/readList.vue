<template>
  <div class="readList">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="finishText"
        @load="onLoad"
        offset="1"
        :immediate-check="false"
      >
        <template v-if="msgList.length > 0">
          <div
            class="readItem"
            v-for="(item, index) in msgList"
            :key="index"
            @click="msgDetail(item)"
          >
            <div class="left">
              <div class="icon">
                <van-icon name="volume-o" />
              </div>
            </div>
            <div class="right">
              <div class="top">
                <span class="title">{{ item.title }}</span>
                <!-- <span class="time">{{ item.sendtime }}</span> -->
                <span class="time">{{ item.createtime }}</span>
              </div>
              <div class="bottom">
                <p class="content">{{ item.content }}</p>
              </div>
            </div>
          </div>
        </template>
        <!-- 空状态 -->
        <template v-else><van-empty description="暂无数据" /></template>
        <!-- 加载提示-空 -->
        <template #loading><div></div></template>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { reqgetMessageList } from '@/http'

export default {
  name: 'ReadList',
  props: ["postData",],
  data () {
    return {
      msgList: [],
      page: 1,
      // 下拉刷新 上拉加载
      loading: false,
      finished: false,
      finishText: '没有更多了',
      refreshing: false,
    }
  },
  computed: {
  },
  watch: {
    postData () {
      console.log('父组件切换tab栏')
      // 重置列表数据
      this.finished = false
      this.msgList = [];
      this.page = 1 // 页码重置
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.getMsgList()

    },

  },
  methods: {
    // 查看消息详情
    msgDetail (item) {
      // 跳转页面
      this.$router.push({
        name: "MessageDetail",
        query: {
          msgId: item.id,
        },
      });
    },
    // 获取消息列表
    async getMsgList () {
      let postData = { ...this.postData, page: this.page }
      try {
        let result = await reqgetMessageList(JSON.stringify(postData))
        if (this.postData.isRead == 1) console.log('首页未读消息数', result)
        else console.log('首页已读消息数', result)

        // 请求完成-关闭加载状态
        this.loading = false
        if (result.operationSuccessFlag) {
          // 判断列表是否全部加载完成
          if (this.page >= result.totalPage) {
            this.finished = true;
            this.finishText = '没有更多了'
          }
          // 渲染页面
          if (result.data.length == 0) {
            // 无数据 → 会自动显示空状态 → 不显示finishText
            this.finished = true // 关闭上拉加载
            this.finishText = ''

          }

          this.msgList.push(...result.data)
          // 请求未读数据 → 给父组件传值
          if (postData.isRead == 1) {
            this.$emit('getUnReadNum', result.totalCount)
          }
        } else {
          this.finished = true // 加载失败 关闭上拉加载
          if (this.msgList.length > 0) {
            this.finishText = '没有更多了'
          } else {
            this.finishText = ''
          }
        }
      } catch (error) {
        this.loading = false // 加载失败 关闭加载状态
        this.finished = true // 加载失败 关闭上拉加载
        if (this.msgList.length > 0) {
          this.finishText = '没有更多了'
        } else {
          this.finishText = ''
        }
        console.log('err', error)
      }

    },
    // 下拉刷新
    onRefresh () {
      // 清空列表数据
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
    // 加载资源
    onLoad () {
      // 判断是否是刷新
      if (this.refreshing) {
        // 下拉刷新
        this.msgList = [];
        this.refreshing = false;
        this.page = 1 // 页码重置
      } else {
        // 上拉加载
        this.page++
      }
      this.getMsgList()

    },
  },
  created () {
    // 获取消息列表
    this.getMsgList();

  }
}
</script>

<style scoped lang="less">
@theme-color: #1989fa;
.readList {
  .readItem {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    min-height: 40px;
    padding: 10px;
    background-color: #fff;

    .left {
      display: flex;
      align-items: center;
      .icon {
        width: 30px;
        height: 30px;
        line-height: 30px;
        margin: 10px;
        border-radius: 15px;
        color: #fff;
        background: @theme-color;
      }
    }
    .right {
      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
          text-align: left;
          font-size: 16px;
        }
        .time {
          text-align: right;
          font-size: 12px;
          color: #c2bfbf;
        }
      }
      .bottom {
        padding-top: 10px;
        .content {
          width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
          font-size: 14px;
          color: rgb(103, 100, 100);
        }
      }
    }
  }
  .van-list {
    min-height: 500px;
  }
}
</style>