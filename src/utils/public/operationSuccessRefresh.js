import vue from '@/main'
// 工单按钮操作成功后改变刷新标识
// (操作成功失败标识)
export default (isSuccess) => {
    // 操作成功 → 改变vuex内标识 → 工单详情/工作台内监视到按钮操作成功做出对应刷新
    vue.$store.commit('CHANGEOPERATIONSUCCESSFLAG', isSuccess)

}