const state = {
    // 装机单-回复-posCodeSign弹出层
    posCodePopShow: false,
    posAddress: '', // POS位置描述
    posCodeSign: -1, // 符合POS二维码绑码规则 -1，默认，无需绑码；0：需要绑码但未绑，1：需要绑码已绑
    posCode: '', // POS二维码编码
    // 装机单-回复-标准地址
    bzdzFit: -1,
    bzdzMark: '',
    iomNewFinishParams: {}, // IOM回单页面的参数
    // positionFlag: false, // 是否定位
    // currIdPosition: null, // 定位需要用的id参数

    // 装机单-修改客户电话弹出层
    editCustPhone: {
        editCustPhoneShow: false,
        orderId: -1,
    },

    // 我已到达-随销单生成提示
    arriveTipsShow: false,

    // 修机单-回复-光纤尾码照片
    finishPhotoIdList: [],

    // 回复任务
    finishTask: {
        popShow: false,
        id: -1,
        orderId: "",
        flowNode: "",
        workType: -1,
    },

    // 获取经纬度地址--上站、开始处理IFM
    getLocalPopup: {
        code: '', // 判断是哪个操作
        isShow: false,
        id: -1
    }

}
const mutations = {
    // 修改获取经纬度参数
    changeLocalPopup (state, res) {
        state.getLocalPopup = res
    },

    // 存入光纤尾码照片
    changeFinishPhotoIdList(state, result) {
        state.finishPhotoIdList = result
    },
    // 修改我已到达弹出层是否显示
    changeArriveTipsShow(state, result) {
        state.arriveTipsShow = result
    },

    // 修改回复任务参数
    changeFinishTask(state, result) {
        state.finishTask = result
    },

    // 修改客户电话
    changeEditCustPhoneShow(state, result) {
        state.changeEditCustPhoneShow = result
    },

    // updatePositionFlag (state, flag) {
    //     state.positionFlag = flag
    // },
    // updateCurrIdPosition (state, id) {
    //     state.currIdPosition = id
    // },
    // 更改装机单-回复-posCodeSign弹出层标识
    CHANGEPOSPOPSHOW(state, result) {
        state.posCodePopShow = result
    },
    // 更改pos位置描述
    CHANGEPOSADDRESS(state, result) {
        state.posAddress = result
    },
    // 更改posCodeSign
    CHANGEPOSCODESIGN(state, result) {
        state.posCodeSign = result
    },
    // pos二维码编码
    CHANGEPOSCODE(state, result) {
        state.posCode = result
    },
    // 更改IOM回单页面的参数
    CHANGEIOMFINISHPARAM(state, result) {
        state.iomNewFinishParams = result
    },
    // 更改标准地址
    CHANGEBZDZFIT(state, result) {
        state.bzdzFit = result
    },
    // 标准地址备注
    CHANGEBZDZMARK(state, result) {
        state.bzdzMark = result
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