<template>
  <div>
    <MyHeader :name="headName" left="arrow-left" @goBackEv="$router.go(-1)" />
    <div v-if="engineerList.length > 0">
      <van-collapse v-model="activeNames">
        <van-collapse-item
          :name="index"
          v-for="(item, index) in engineerList"
          :key="index"
        >
          <template #title>
            <div class="pannel">
              <div class="left">
                <div class="sort">{{ index + 1 }}</div>
                <div class="info">
                  <div>{{ item.userName }}</div>
                  <div class="group-name">{{ item.groupName }}</div>
                </div>
              </div>
              <div class="right">
                <van-icon
                  v-if="item.zgName == '在岗'"
                  color="#5CC400"
                  size="18"
                  name="checked"
                />
                <van-icon
                  v-if="item.zgName == '离岗'"
                  color="#BD2123"
                  size="18"
                  name="clear"
                />
                <span style="margin-left: 8px">{{ item.zgName }}</span>
              </div>
            </div>
          </template>
          <div class="content">
            <van-cell title="专业" :value="item.specNames" />
            <van-cell title="登录账号" :value="item.loginNo" />
            <van-cell title="工程师电话" :value="item.phone || '---'" />
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
    <Empty v-else />
  </div>
</template>

<script>
import { EngineerStatusApi } from '@/http/tools'
export default {
  name: 'EnginnersSchedule',
  data () {
    return {
      headName: `工程师值班`,
      activeNames: [],
      engineerList: []
    }
  },
  created () {
    this.getEnginnersInfo()
  },
  methods: {
    async getEnginnersInfo () {
      let data = await EngineerStatusApi(JSON.stringify({}))
      console.log(data.engineerList)
      this.engineerList = data.engineerList
    }
  },
}
</script>

<style scoped lang="less">
.pannel {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  .left {
    display: flex;
    .sort {
      width: 30px;
      height: 30px;
      line-height: 30px;
      background-color: #5a90fd;
      border-radius: 15px;
      color: #fff;
      // margin-left: -34px;
      // margin-right: 15px;
      margin: 12px 15px 0 -6px;
      text-align: center;
      // padding-right: 5px;
      // box-sizing: border-box;
    }
    .info {
      text-align: left;
      .group-name {
        margin-top: 6px;
      }
    }
  }
}
.content {
  border: 2px solid #5a90fd;
  .van-cell {
    padding: 5px;
    border-bottom: 1px solid #ccc;
    &::after {
      content: none;
    }
    &:last-child {
      border: none;
    }
  }
  ::v-deep .van-cell__title {
    text-align: left;
    -webkit-flex: none;
    -webkit-box-flex: none;
    flex: none;
  }
}
::v-deep .van-collapse-item__content {
  padding: 0;
}
</style>