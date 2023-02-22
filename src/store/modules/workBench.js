import { getItem, removeItem, setItem } from '@/utils/public/sessionStorage'

const state = {
    mainSrollTop: getItem('mainSrollTop') || 0, // 工作台页面滚轴置顶高度
    // 工作台-我的任务，工单详情点击电话标识选择呼出号码
    callNumberState: {
        callNumberShow: false,
        keyShow: false,
    },


};
const mutations = {
    CHANGEMAINSCROLLTOP(state, result) {
        setItem('mainSrollTop', result)
        state.mainSrollTop = result
    },
    CHANGECALLNUMBERSTATE(state, result) {
        state.callNumberState = result
    },

}
const actions = {

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}