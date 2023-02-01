<template>
  <div>
    <MyHeader :name="'我的权限'" left="arrow-left" @goBackEv="$router.go(-1)" />
    <div v-for="(item, index) in Object.keys(permission)" :key="index">
      <div class="title">{{ getValue(item) }}</div>
      <van-cell
        v-for="(info, n) in Object.values(permission)[index]"
        :key="n"
        :title="info.groupName"
      />
    </div>
  </div>
</template>

<script>
import { getItem } from '@/utils/sessionStorage'
import { GetMyPermissionApi } from '@/http/index'
import { sysIdList } from '@/utils/common'
export default {
  data () {
    return {
      sysIds: [],
      activeNames: [0],
      permission: [],
      listSheetGroup: getItem('loginInfo').listSheetGroup,
    }
  },
  created () {
    getItem('loginInfo').userIds.forEach(e => {
      this.sysIds.push(e.sysId)
    });
    GetMyPermissionApi(JSON.stringify({ sysIds: this.sysIds })).then(res => {
      // console.log(res.permission);
      this.permission = res.permission
      console.log(this.permission);
      this.listSheetGroup.forEach(e => {
        if (e.groupSysId == 3) {
          this.permission[3].push(e)
        }
        if (e.groupSysId == 7) {
          this.permission[7].push(e)
        }
      })
    })
  },
  methods: {
    getValue (key, value) {
      //  let keys =  Object.keys(this.permission)
      sysIdList.forEach(e => {
        if (e.key == key) {
          value = e.value
        }
      })
      return value
    }
  },
}
</script>

<style scoped lang="less">
.title {
  line-height: 42px;
  text-align: center;
  margin-bottom: 2px;
  background: #e5e5e5;
}
::v-deep .van-cell::after {
  left: 0;
  right: 0;
  border-color: #e1e1e1;
}
::v-deep .van-cell {
  padding: 8px 12px;
}
</style>