<template>
  <div>
    <MyHeader :name="headName" left="arrow-left" @goBackEv="$router.go(-1)" />
    <van-tabs v-model="active" swipeable>
      <van-tab title-active-color="'#5a90fd'" title="基本信息">
        <div class="content" v-if="currInfo.basicInfo.length > 0">
          <van-cell
            v-for="basic in currInfo.basicInfo"
            :key="basic.name"
            :title="basic.name"
            :value="basic.content"
          />
        </div>
        <Empty v-else />
      </van-tab>
      <van-tab
        :title="item.key"
        v-for="(item, index) in currInfo.list"
        :key="index"
      >
        <div v-if="item.value.length > 0">
          <div v-for="(e, i) in item.value" :key="i">
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
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  name: 'IdmIssueAutoDeatil',
  data() {
    return {
      headName: `下发参数详情(${this.$route.query.id})`,
      currInfo: this.$route.query.detail,
      active: 0
    }
  },
  created() {
    console.log(this.$route.query.detail)
  },
}
</script>

<style scoped lang="less">
.van-tab--active {
  color: #5a90fd;
}
::v-deep .van-tabs__content {
  padding-top: 12px;
}
::v-deep .van-cell__value {
  color: gray;
}
::v-deep .van-cell__title {
  margin-right: 6px;
}
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