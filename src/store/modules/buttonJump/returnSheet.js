// 退工单

const state = {
    type: 1, // 1:退工单 2：修改标准地址
    // 退工单页面
    returnSheet: {
        errorReasonCode: '', //退单编码
        explain: '', // 退单说明
        addrKeyword: '', // 标准地址关键词
    },
    // 选择楼房页面
    chooseFirst: {
        buildType: '',
        firstInfoIndex: -1,
        fldcbriefname: '',
        fldcname: '',
        firstList: [],
    },
    // 选择单元页面
    chooseUnit: {
        unitList: [],
        unitInfoIndex: -1, // 选中的单元信息所有
        unitName: '', // 选中单元名称
    },
    // 选择楼层页面
    chooseFloor: {
        floorList: [],
        floorInfoIndex: -1, // 选中的楼层索引
        floorName: '', // 选中的楼层名称
    }


}
const mutations = {
    changeType(state, result) {
        state.type = result
    },
    changeRetrunSheet(state, result) {
        state.returnSheet = result
    },
    changeChooseFirst(state, result) {
        state.chooseFirst = result
    },
    changeChooseUnit(state, result) {
        state.chooseUnit = result
    },
    changeChooseFloor(state, result) {
        state.chooseFloor = result
    }

}
const actions = {

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}