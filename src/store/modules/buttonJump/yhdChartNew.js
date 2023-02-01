import { reqgetYhgdSetting, reqgetYhgdTable } from '@/http/tools.js'
const state = {
    settingInfo: "",
    tableInfo: "",
}
const mutations = {
    GETSETTINGINFO(state, result) {
        state.settingInfo = result
    },
    GETTABLEINFO(state, result) {
        state.tableInfo = result
    }

}
const actions = {
    async getSettingInfo(context, loginNo) {
        let result = await reqgetYhgdSetting(loginNo)
        context.commit("GETSETTINGINFO", result)
        return result
    },
    async getTableInfo(context, postData) {
        let result = await reqgetYhgdTable(postData)
        context.commit("GETTABLEINFO", result)
        return result
    },

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}