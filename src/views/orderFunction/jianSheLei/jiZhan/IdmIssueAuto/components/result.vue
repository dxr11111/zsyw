<template>
  <div>
    <MyHeader :name="headName" left="arrow-left" @goBackEv="$router.go(-1)" />
    <div v-if="resultInfo.length > 0">
      <div v-for="(e, i) in resultInfo" :key="i">
        <div class="title">{{ e.key }}</div>
        <van-cell
          v-for="(info, n) in e.value"
          :key="n"
          :title="info.name"
          :value="info.content"
        />
      </div>
    </div>
    <Empty v-else />
  </div>
</template>

<script>
import { IdmIssueAutoResultApi, IdmIssueAutoRecordApi } from '@/http/button'
export default {
  name: 'IdmIssueAutoResult',
  data() {
    return {
      headName: '',
      type: this.$route.query.type || '-1',
      resultInfo: []
    }
  },
  created() {
    if (this.type == '0') {
      this.headName = `下发结果(${this.$route.query.id})`
    } else if (this.type == '1') {
      this.headName = `注销结果(${this.$route.query.id})`
    } else {
      this.headName = `操作记录(${this.$route.query.id})`
    }
    this.getResult()
  },
  methods: {
    async getResult() {
      let data = null
      // 操作记录查询
      if (this.type == '-1') {
        data = await IdmIssueAutoRecordApi(JSON.stringify({ id: Number(this.$route.query.id) }))
        console.log(data)
      } else {
        // 下发/注销记录查询
        var params = {
          gongdanhao: this.$route.query.gongDanHao,
          engItem: this.type
        }
        console.log(this.$route.query)
        console.log(params)
        data = await IdmIssueAutoResultApi(JSON.stringify({
          gongdanhao: this.$route.query.gongDanHao,
          engItem: this.type
        }))
      }
      console.log(data)
      this.resultInfo = data.showData
    }
  },
}
</script>

<style lang="less" scoped>
::v-deep .van-cell {
  padding: 8px 12px;
  &::after {
    border: none;
  }
  border-bottom: 1px solid #ccc;
}
::v-deep .van-cell__title {
  text-align: left;
  -webkit-flex: none;
  -webkit-box-flex: none;
  flex: none;
}
.title {
  line-height: 42px;
  text-align: left;
  background: #e5e5e5;
  padding-left: 8px;
}
</style>