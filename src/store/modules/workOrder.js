import { reqgetWorkOrderBoardSum, reqgetWorkOrderListTab, reqgetHomeList } from '@/http/index'
import { setItem, getItem } from '@/utils/public/sessionStorage'
const state = {
    workOrderList: getItem('workOrderList') || [], // 工单页面显示的列表，公众类... 维护类...
    workOrderBoardNum: {}, // 工单看板数
    workOrderListTab: {}, // 工单看板列表tab
    workOrderTabTaskType: -1,// 工单看板taskType
    workOrderListInfo: {}, // 工单列表
    currWorkGroupInfo: getItem('currWorkGroupInfo') || {}, // 当前选择的group的id和name
    ywjsOrderType: getItem('currYwjsOrderType') || "", // 移网建设工单列表页，当前选中的宏站/室分
}
const mutations = {
    updateYwjsOrderType(state, type) {
        setItem('currYwjsOrderType', type)
        state.ywjsOrderType = type
    },
    updateCurrWorkGroupInfo(state, group) {
        setItem('currWorkGroupInfo', group)
        state.currWorkGroupInfo = group
    },
    GETGDLIST(state, result) {
        setItem('workOrderList', result)
        state.workOrderList = getItem('workOrderList')

    },
    BOARDSUM(state, result) {
        state.workOrderBoardNum = result
    },
    LISTTAB(state, result) {
        state.workOrderListTab = result
    },
    LISTINFO(state, result) {
        state.workOrderListInfo = result
    },
    CHANGEWORKORDERTASKTYPE(state, result) {
        state.workOrderTabTaskType = result
    }

}
const actions = {
    // 工单看板数
    async getWorkOrderBoardSum(context, postData) {
        try {
            let result = await reqgetWorkOrderBoardSum(postData)
            console.log('工单看板数', result)
            context.commit('BOARDSUM', result)
            return result
        } catch (error) {
            console.log('err', error)

        }
    },
    // 工单看板列表tab
    async getWorkOrderListTab(context, postData) {
        try {
            let result = await reqgetWorkOrderListTab(postData)
            console.log('工单列表tab', result)
            context.commit('LISTTAB', result)
            return result
        } catch (error) {
            console.log('err', error)

        }
    },
    // 工单列表
    async getWorkOrderList(context, postData) {
        try {
            let result = await reqgetHomeList(postData)
            console.log('工单列表信息', result)
            context.commit('LISTINFO', result)
            return result
        } catch (error) {
            console.log('err', error)

        }
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}