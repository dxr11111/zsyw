import { reqgetReportSetting, reqgetReportTable } from '@/http/tools.js'
const state = {
    settingInfo: "",
    tableInfo: "",
}
const mutations = {
    GETSETTINGINFO(state, settingInfo) {
        state.settingInfo = settingInfo
    },
    GETTABLEINFO(state, tableInfo) {
        state.tableInfo = tableInfo
        // console.log('tableInfo', tableInfo)
    }
}
const actions = {
    // 获取按钮权限 返回company，userType
    async getSettingInfo(context, loginNo) {
        // console.log(loginNo)
        try {
            let result = await reqgetReportSetting(loginNo)
            console.log('settingResult', result)
            context.commit('GETSETTINGINFO', result)
            return result

        } catch (error) {
            console.log('err', error)
        }
    },
    // 获取表格数据
    async getTableInfo(context, postData) {
        try {
            let result = await reqgetReportTable(postData)
            // console.log('tableResult', result)
            context.commit('GETTABLEINFO', result)

        } catch (error) {
            console.log('err', error)

        }
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}