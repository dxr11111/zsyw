import { reqgetWorkBoard, reqgetWorkBoardNum } from '@/http/tools'
const state = {
    jizhanInfo: {},
    orderNumInfo: {},

}
const mutations = {

    GETJIZHANINFO(state, result) {
        state.jizhanInfo = result
    },
    GETORDERNUMINFO(state, result) {
        state.orderNumInfo = result
    }


}
const actions = {
    // 获取基站，建设数据
    async getJizhanInfo(context, postData) {
        let result = await reqgetWorkBoard(postData)
        context.commit("GETJIZHANINFO", result)
        return result
    },
    // 获取时间，完工工单数
    async getOrderNumInfo(context, postData) {
        let result = await reqgetWorkBoardNum(postData)
        context.commit("GETORDERNUMINFO", result)
        return result
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}