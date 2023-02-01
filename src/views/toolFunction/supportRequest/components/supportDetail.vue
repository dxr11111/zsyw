<template>
  <div>
    <MyHeader
      :name="'支撑申请详情'"
      left="arrow-left"
      @goBackEv="$emit('changeShow')"
    />
    <div>
      <van-cell title="申请单号" :value="detailList.applyNo || '---'" />
      <van-cell
        title="申请部门名称"
        :value="detailList.applyDeptName || '---'"
      />
      <van-cell title="申请人姓名" :value="detailList.applyUserName || '---'" />
      <van-cell
        title="申请人手机"
        :value="detailList.applyUserPhone || '---'"
      />
      <van-cell title="申请时间" :value="detailList.applyTime || '---'" />
      <van-cell title="申请内容" :value="detailList.applyContent || '---'" />
      <van-cell
        title="对应分公司客响名称"
        :value="detailList.dealDeptName || '---'"
      />
      <van-cell
        title="公司客响处理人姓名"
        :value="detailList.dealUserName || '---'"
      />
      <van-cell
        title="公司客响处理时间"
        :value="detailList.dealTime || '---'"
      />
      <van-cell
        class="state"
        title="当前状态"
        :value="formalStatus(detailList.statusId) || '---'"
      />
      <van-cell class="supportNo" title="对应的支撑单号" :value="detailList.supprotNo || '---'" />
    </div>
    <div class="detail" v-if="proclist.length !== 0">
      <div class="title"><span>支撑单处理过程</span></div>
      <div
        class="detail-item"
        v-for="(item, index) in detailList.proclist"
        :key="index"
      >
        <div class="top">
          <div>{{ item.writeDeptName }}</div>
          <div>{{ item.typeName }}</div>
        </div>
        <div class="middle">
          <div>{{ item.writeUserName }}</div>
          <div>{{ item.writeTime }}</div>
        </div>
        <div class="bottom">{{ item.intro }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { SupportRequestApi } from '@/http/tools'
export default {
  props: {
    applyNo: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      detailList: {},
      proclist: []
    }
  },
  mounted () {
    this.getSupportDetail()
  },
  methods: {
    formalStatus (id, value) {
      if (id == 1) {
        value = '未处理'
      } else if (id == 2) {
        value = '生成支撑单'
      } else if (id == 3) {
        value = '绑定支撑单'
      } else if (id == 4) {
        value = '退回外线'
      }
      return value
    },
    async getSupportDetail () {
      let data = await SupportRequestApi(JSON.stringify({ applyNo: this.applyNo }))
      this.detailList = data.supportRequestQueryDetailInfo
      console.log(this.detailList)
      this.proclist = this.detailList.proclist
      this.$nextTick(() => {
        let dom = document.getElementsByClassName('state')[0].children[1]
        // console.log(dom[0].children)
        console.log(dom.innerText)
        if (dom.innerText == '未处理') {
          dom.style.color = '#000'
        } else if (dom.innerText == '退回外线') {
          dom.style.color = 'red'
        } else {
          dom.style.color = '#32D83A'
          document.getElementsByClassName('supportNo')[0].children[1].style.color = '#32D83A'
        }
      })
    },

  },
}
</script>

<style scoped lang="less">
.detail {
  .title {
    text-align: start;
    line-height: 45px;
    background-color: #e5e5e5;
    span {
      width: 125px;
      display: inline-block;
      padding: 0 10px;
      background: #f8f7fc;
      border-top: 14px solid #e5e5e5;
    }
  }
  .detail-item {
    font-size: 14px;
    color: #8d8c91;
    padding: 0 10px;
    border-bottom: 1px solid #ccc;
    .top,
    .middle,
    .bottom {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
    }
    .bottom {
      text-align: start;
    }
  }
}
::v-deep .van-cell::after {
  left: 0;
  right: 0;
  border: 1px solid #e1e1e1;
}
::v-deep .van-cell {
  padding: 8px 12px;
  background: #f8f7fc;
  &:last-child {
    border: 1px solid #e1e1e1;
  }
}
::v-deep .van-cell__title {
  text-align: left;
  -webkit-flex: none;
  -webkit-box-flex: none;
  flex: none;
}
</style>