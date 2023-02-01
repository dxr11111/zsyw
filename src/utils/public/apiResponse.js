import vue from '@/main'

export default (result, getContainer, success) => {
    if (result.operationSuccessFlag) {
        if (result?.successMessage.length > 0) vue.$toast(result.successMessage)
        success()
    } else {
        if (result?.errorMessage.length > 0) {
            // 当messageModul = 1 时，页面出现弹窗窗口，需用户点击确定关闭提示框
            if (result.messageModul == 1) {
                vue.$dialog.alert({
                    title: '提示',
                    message: result.errorMessage,
                    getContainer: getContainer,
                    className: 'confirmDialog',
                }).then(() => {
                    // on close
                });
            } else if (result.messageModul == 0) {
                vue.$toast(result.errorMessage)
            }
        }

    }
}