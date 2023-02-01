<template>
  <div style="height: 100%; background: #f8f7fc">
    <div v-if="isIndex">
      <MyHeader :name="headName" left="arrow-left" @goBackEv="$router.go(-1)" />
      <div class="panel">
        <div class="panel-item">
          <span>受理单标题</span>
          <input
            type="text"
            placeholder="请输入受理单标题（必填）"
            v-model="balkTitle"
          />
        </div>
        <div class="field">
          <div class="label">故障发生时间</div>
          <div style="color: gray" @click="showTime = true">
            <input readonly v-model="currDate" placeholder="请选择故障发生时间" />
            <span style="margin-left: 10px">▼</span>
          </div>
          <van-popup
            v-model="showTime"
            position="bottom"
            :style="{ height: '40%' }"
          >
            <van-datetime-picker
              type="datetime"
              v-model="currentDate"
              :min-date="minDate"
              :max-date="maxDate"
              :columns-order="['year', 'month', 'day', 'hour', 'minute']"
              :formatter="formatter"
              @confirm="chooseTime"
              @cancel="showTime = false"
            />
          </van-popup>
        </div>
        <div class="panel-item">
          <span>故障现象</span>
          <input
            type="text"
            placeholder="请输入故障现象（必填）"
            v-model="balkContent"
          />
        </div>
        <div class="panel-item">
          <span>故障级别</span>
          <div class="after" @click="showOptions = true">
            <input
              readonly
              type="text"
              v-model="currOption"
              placeholder="---请选择故障级别---"
            />
            <span>▼</span>
          </div>
          <van-action-sheet
            v-model="showOptions"
            :actions="optionsList"
            cancel-text="取消"
            close-on-click-action
            @select="selectOption"
          />
        </div>
        <div>
          <div class="field" style="margin-bottom: 0">
            <div class="label">基站查询</div>
            <div class="radio-box" :model="searchKey">
              <span
                :class="searchKey == 0 ? 'active' : ''"
                @click="searchKey = 0"
                >基站名称</span
              >
              <span
                :class="searchKey == 1 ? 'active' : ''"
                @click="searchKey = 1"
                >物理站号</span
              >
            </div>
          </div>
          <!-- 基站 -->
          <div>
            <div class="search">
              <input
                v-model="keyWord"
                :placeholder="
                  searchKey == 0
                    ? '请输入基站名称查询基站'
                    : '请输入物理站号查询基站'
                "
                type="text"
              />
              <van-button size="small" @click="search">查询</van-button>
            </div>
            <div class="base">
              <div
                class="item"
                v-for="(item, index) in selectBaseInfo"
                :key="index"
              >
                {{ item.siteName }}
                <van-icon
                  class="del"
                  color="#BD2123"
                  size="24"
                  name="clear"
                  @click="selectBaseInfo.splice(index, 1)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <van-button block type="info" @click="submit">确定</van-button>
    </div>
    <BaseInfo
      v-else
      :baseInfoList="baseInfoList"
      :total="total"
      @updateIsIndex="isIndex = true"
      @change="getBaseInfo"
    />
  </div>
</template>

<script>
import { formatTime } from '@/utils/common'
import { QueryBaseInfoApi, SaveWirelessApi } from '@/http/tools'
import BaseInfo from '@/views/toolFunction/mobileOptAccept/components/baseInfo'
import { getItem } from '@/utils/sessionStorage'
export default {
  name: 'MobileOptAccept',
  components: { BaseInfo },
  data () {
    return {
      headName: `移动优化受理`,
      balkTitle: '', // 受理单标题
      balkContent: '', // 故障现象
      showTime: false, // 选择时间组件显示隐藏
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2072, 12, 31),
      currentDate: new Date(),
      currDate: null, // 故障时间
      showOptions: false,
      optionsList: [
        { id: 1, name: '一般故障' },
        { id: 2, name: '紧急故障' },
        { id: 3, name: '重大故障' },
        { id: 4, name: '通信故障' },
        { id: 5, name: '重要通信' },
        { id: 6, name: '不明故障' },
      ],
      currOption: '', // 故障级别
      searchKey: 0, // 查询类型
      keyWord: '', // 查询信息
      isIndex: true,
      total: '', // 查询的基站总数
      baseInfoList: [], // 查询基站列表
      selectBaseInfo: [], // 选择的基站信息--子组件选择的
      loginInfo: getItem('loginInfo').defaultSheetGroupList
    }
  },
  methods: {
    async submit () {
      if (this.balkTitle == '') return this.$toast('请输入受理单标题')
      if (this.currDate == null) return this.$toast('请选择故障发生时间')
      if (this.balkContent == '') return this.$toast('请输入故障现象')
      if (this.currOption == '') return this.$toast('请选择故障级别')
      if (this.selectBaseInfo.length == 0) return this.$toast('请选择基站信息')
      let params = {
        balkTitle: this.balkTitle, //	受理单标题
        groupId: this.loginInfo.find(e => e.groupSysId == 3).groupId, //	工作组ID
        balkStartTime: this.currDate, //	故障发生时间
        balkContent: this.balkContent, //	故障现象
        balkLevelId: this.optionsList.find(e => e.name == this.currOption).id, //	故障级别
        acceptUserLong: '', // 受理人经度
        acceptUserLati: '', // 受理人维度
        acceptUserPos: '', //	受理人位置
        baseStationList: this.selectBaseInfo, //	基站信息
      }
      console.log(params)
      let data = await SaveWirelessApi(JSON.stringify(params))
      data.operationSuccessFlag ? this.$toast.success(data.successMessage) : this.$toast.fail(data.errorMessage)
      this.$router.go(-1)
    },
    getBaseInfo (data) {
      this.selectBaseInfo.push(...data)
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        this.selectBaseInfo.forEach(e => {
          if (e.siteName == item.siteName) {
            e.guzhangshebei = item.guzhangshebei
          }
        })
      }
      this.selectBaseInfo = this.removal(this.selectBaseInfo)
      console.log('基站信息', this.selectBaseInfo)
    },
    // 数组去重
    removal (arr) {
      let newArr = []
      for (let i = 0; i < arr.length; i++) {
        newArr.find(item => item.siteName == arr[i].siteName) ? newArr : newArr.push(arr[i])
      }
      return newArr
    },
    async search () {
      if (this.keyWord == '') return this.$toast('请输入名称查询基站')
      let data = await QueryBaseInfoApi(JSON.stringify({ queryParam: this.keyWord, queryType: this.searchKey }))
      console.log(data)
      this.total = data.total
      this.baseInfoList = data.ifmBaseStationList
      this.isIndex = false
    },
    selectOption (item) {
      this.currOption = item.name
      this.showOptions = false
    },
    chooseTime (value) {
      console.log(formatTime(value));
      // 因为组件没有秒，所以在分钟上做文章
      var curr = formatTime(new Date())
      var a = Number(curr.substr(curr.length - 4, 1)) - 1
      var str = curr.substr(0, curr.length-4) + a + curr.substr(curr.length-3)
      console.log('分钟-1后的时间', str)
      // 不能晚于当前时间，包括当前时间
      if (formatTime(value) >= str) {
        return this.$toast('不能晚于当前时间')
      } else {
        this.currDate = formatTime(value)
        this.showTime = false
      }
    },
    formatter (type, val) {
      if (type === 'year') {
        return val + '年'
      }
      if (type === 'month') {
        return val + '月'
      }
      if (type === 'day') {
        return val + '日'
      }
      if (type === 'hour') {
        return val + '时'
      }
      if (type === 'minute') {
        return val + '分'
      }
      return val
    },
  },
}
</script>

<style lang="less" scoped>
.panel {
  .panel-item {
    display: flex;
    padding: 8px 14px;
    justify-content: space-between;
    background: #fff;
    line-height: 30px;
    font-size: 14px;
    margin-bottom: 8px;
    .after {
      position: relative;
      span {
        position: absolute;
        right: 15px;
        color: gray;
      }
    }
    input {
      width: 240px;
      height: 30px;
      margin-left: 3px;
      border: 1px solid #ccc;
      padding: 0 8px;
      font-size: 12px;
      color: gray;
    }
  }
  .field {
    display: flex;
    justify-content: space-between;
    padding: 8px 14px;
    background: #fff;
    line-height: 30px;
    font-size: 14px;
    margin-bottom: 8px;
    .label {
      color: #3b3b3b;
    }
    .radio-box {
      span {
        border: 1px solid #5a90fd;
        display: inline-block;
        width: 80px;
        text-align: center;
        color: #5a90fd;
      }
      .active {
        background-color: #5a90fd;
        color: #fff;
      }
    }
    .iconfont {
      margin-left: 15px;
      font-size: 20px;
    }
  }
  .search {
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    padding: 8px 14px;
    input {
      width: 260px;
      font-size: 14px;
      border: 1px solid #ccc;
      padding: 0 8px;
      color: gray;
    }
    .van-button--small {
      width: 58px;
      color: #5a90fd;
      border: 1px solid #5a90fd;
    }
  }
  .base {
    width: 100%;
    background-color: #fff;
    padding-bottom: 8px;
    .item {
      font-size: 14px;
      width: 95%;
      margin: auto;
      line-height: 36px;
      border: 1px solid #eee;
      border-radius: 5px;
      box-shadow: 0.5px 0.5px;
      margin-bottom: 8px;
      position: relative;
      .del {
        position: absolute;
        right: -5px;
        top: -3px;
      }
    }
  }
}
::v-deep .van-button--block {
  width: 90%;
  margin: 20px auto;
  border-radius: 8px;
}
</style>