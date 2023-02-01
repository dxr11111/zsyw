<template>
  <div class="groupBarrier">
    <MyHeader :name="headName" left="arrow-left" @goBackEv="goBackFn" />
    <div class="main">
      <van-form @submit="onSubmit">
        <van-field
          v-model="explain"
          name="explain"
          label="申请说明"
          placeholder="请输入群障申请说明"
          :rules="[{ required: true }]"
          autocomplete="off"
          type="textarea"
        />

        <div class="buttonRegion">
          <van-button round type="info" native-type="submit"
            >发起申请</van-button
          >
          <van-button round type="info" native-type="button" @click="refreshFn"
            >刷新结果</van-button
          >
        </div>
      </van-form>

      <div class="result">
        <h3>申请结果</h3>
        <div class="data" v-for="(item, index) in resultList" :key="index">
          <div class="left">
            <span class="num">{{ index + 1 }}</span>
            <div class="text">
              <span class="time">{{ item.applyTime }}</span>
              <span class="content">{{ item.applyContent }}</span>
            </div>
          </div>
          <div class="right">
            <span class="status">{{ item.applyStatus }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reqGroupBarrierQuery, reqGroupBarrierSubmit } from '@/http/button'
export default {
  name: 'GroupBarrier',
  data () {
    return {
      headName: `群障申请(${this.$route.query.orderNum})`,
      explain: '', // 申请说明
      resultList: [], // 申请结果
    }
  },
  methods: {
    // 回退
    goBackFn () {
      this.$router.go(-1)
    },
    // 申请查询
    async groupBarrierQuery () {
      let id = parseInt(this.$route.query.id)
      try {
        let result = await reqGroupBarrierQuery(JSON.stringify({ id }))
        console.log('群障申请查询', result)
        if (result.operationSuccessFlag) {
          // 成功
          this.resultList = result.groupBarrierRequestInfoList
        }
      } catch (error) {
        console.log('err', error)

      }

    },
    // 刷新结果
    refreshFn () {
      this.groupBarrierQuery()
    },
    // 申请提交
    async onSubmit (values) {
      let id = parseInt(this.$route.query.id)
      let applyContent = values.explain
      try {
        let result = await reqGroupBarrierSubmit(JSON.stringify({ id, applyContent }))
        console.log('申请提交结果', result)
        if (result.operationSuccessFlag) {
          // 成功
          this.$toast(result.successMessage)
          // 刷新结果
          this.groupBarrierQuery()
        } else {
          this.$toast(result.errorMessage)
        }
      } catch (error) {
        console.log('err', error)

      }


    },
  },
  created () {
    // 申请查询
    this.groupBarrierQuery();
  }
}
</script>

<style lang="less" scoped>
.groupBarrier {
  height: 100%;
  background-color: #f8f7fc;
  .main {
    .buttonRegion {
      display: flex;
      justify-content: space-around;
      margin: 30px;
      .van-button {
        border-radius: 5px;
      }
    }
    .result {
      background-color: #fff;
      font-size: 14px;
      h3 {
        padding: 10px;
        border-bottom: 1px solid #f3f4f5;
        font-size: 14px;
      }
      .data {
        display: flex;
        justify-content: space-between;
        padding: 16px;
        border-bottom: 1px solid #f3f4f5;

        .left {
          display: flex;
          .num {
            display: inline-block;
            width: 30px;
            height: 30px;
            line-height: 30px;
            margin: 5px;
            background-color: #1989fa;
            color: #fff;
            border-radius: 15px;
          }
          .text {
            display: flex;
            flex-direction: column;
            max-width: 240px;
            padding-left: 10px;
            text-align: left;
            .time,
            .content {
              padding: 5px;
              word-break: break-all;
            }
          }
        }
      }
    }
  }
}
</style>