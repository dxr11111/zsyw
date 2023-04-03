import vue from '@/main'

function listDetailOperate(getListDetail) {
    // 列表详情页面需要自动返回
    if (getListDetail) {
        vue.$store.commit("removeThisPage", 'ListDetail');
        vue.$router.go(-1);
    }
}

export default (result, getContainer, success, getListDetail = false) => {

    if (result.operationSuccessFlag) {
        if (result?.successMessage?.length > 0) vue.$toast(result.successMessage)
        success()
    } else {
        if (result?.errorMessage?.length > 0) {
            // 当messageModul = 1 时，页面出现弹窗窗口，需用户点击确定关闭提示框
            if (result.messageModul == 1) {
                vue.$dialog.alert({
                    title: '提示',
                    message: result.errorMessage,
                    getContainer: getContainer,
                    className: 'confirmDialog',
                }).then(() => {
                    // on close
                    // 列表详情页面需要自动返回
                    listDetailOperate(getListDetail)
                });
            } else if (result.messageModul == 0) {
                vue.$toast(result.errorMessage)
                // 列表详情页面需要自动返回
                listDetailOperate(getListDetail)
            }

        }

    }
}