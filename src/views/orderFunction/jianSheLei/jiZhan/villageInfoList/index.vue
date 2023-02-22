<template>
  <div>
    <MyHeader :name="headName" left="arrow-left" @goBackEv="$router.go(-1)" />
    <div v-if="infoList.length > 0">
      <div v-for="(item, index) in infoList" :key="index">
        <div class="title">{{ item.key }}</div>
        <van-cell
          v-for="(info, n) in item.value"
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
import { GetRruOrCellListApi } from '@/http/button'
export default {
  name: 'VillageInfoList',
  data () {
    return {
      headName: `小区列表(${this.$route.query.id})`,
      infoList: []
    }
  },
  created () {
    this.getVillInfoList()
  },
  methods: {
    async getVillInfoList () {
      let data = await GetRruOrCellListApi(JSON.stringify({ id: Number(this.$route.query.id), type: '1' }))
      console.log(data)
      this.infoList = data.cellList
    }
  },
}
</script>

<style scoped lang="less">
.title {
  line-height: 42px;
  text-align: left;
  background: #e5e5e5;
  padding-left: 8px;
}
::v-deep .van-cell::after {
  left: 0;
  right: 0;
  border-color: #e1e1e1;
}
::v-deep .van-cell {
  padding: 8px 12px;
}
::v-deep .van-cell__title {
  text-align: left;
  -webkit-flex: none;
  -webkit-box-flex: none;
  flex: none;
}
</style>