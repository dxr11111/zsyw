import { reqgetYwkhSetting, reqgetYwkhFGS, reqgetYwkhDay, reqgetYwkhWeek, reqgetYwkhMonth } from '@/http/tools'
const state = {
    settingInfo: {},
    fgsInfo: {},
    dayInfo: {},
    weekInfo: {},
    monthInfo: {},
}
const mutations = {

    GETSETTINGINFO(state, result) {
        state.settingInfo = result
    },
    GETFGS(state, result) {
        state.fgsInfo = result
    },
    GETDAY(state, result) {
        state.dayInfo = result
    },
    GETWEEK(state, result) {
        state.weekInfo = result
    },
    GETMONTH(state, result) {
        state.monthInfo = result
    },

}
const actions = {
    // 获取用户权限
    async getSettingInfo(context, postData) {
        let result = await reqgetYwkhSetting(postData)
        context.commit("GETSETTINGINFO", result)
        return result
    },
    // 获取分公司数据
    async getFGS(context, postData) {
        let result = await reqgetYwkhFGS(postData)
        context.commit("GETFGS", result)
        return result
    },
    // 获取日报数据
    async getDay(context, postData) {
        let result = await reqgetYwkhDay(postData)
        console.log('日报数据', result)
        context.commit("GETDAY", result)
        return result
    },
    // 获取周报数据
    async getWeek(context, postData) {
        let result = await reqgetYwkhWeek(postData)
        context.commit("GETWEEK", result)
        return result
    },
    // 获取月报数据
    async getMonth(context, postData) {
        let result = await reqgetYwkhMonth(postData)
        context.commit("GETMONTH", result)
        return result
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}