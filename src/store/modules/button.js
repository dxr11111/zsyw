import { setItem, getItem } from '@/utils/sessionStorage'
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
}
const mutations = {
    // updatePositionFlag (state, flag) {
    //     state.positionFlag = flag
    // },
    // updateCurrIdPosition (state, id) {
    //     state.currIdPosition = id
    // },
    // 更改装机单-回复-posCodeSign弹出层标识
    CHANGEPOSPOPSHOW (state, result) {
        state.posCodePopShow = result
    },
    // 更改pos位置描述
    CHANGEPOSADDRESS (state, result) {
        state.posAddress = result
    },
    // 更改posCodeSign
    CHANGEPOSCODESIGN (state, result) {
        state.posCodeSign = result
    },
    // pos二维码编码
    CHANGEPOSCODE (state, result) {
        state.posCode = result
    },
    // 更改IOM回单页面的参数
    CHANGEIOMFINISHPARAM (state, result) {
        state.iomNewFinishParams = result
    },
    // 更改标准地址
    CHANGEBZDZFIT (state, result) {
        state.bzdzFit = result
    },
    // 标准地址备注
    CHANGEBZDZMARK (state, result) {
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