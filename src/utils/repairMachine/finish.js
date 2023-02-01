import { reqFinishQuery } from '@/http/button'
import vue from '@/main'

// 回复-回单前查询
let finishQuery = async (buttonInfo) => {
    try {
        let result = await reqFinishQuery(JSON.stringify({ id: buttonInfo.id }))
        console.log('回单前查询', result)

        if (result.operationSuccessFlag) {
            // 无法跳转页面的情况
            if (result.cansubmit) {
                // 回复是否可以提交 false 可以提交，true 不可以提交
                return vue.$toast('换机未完成无法提交')
            } else if (result.testReportCount === 2) {
                // 是否有测试报告提交记录 2：弹出未检测到测试报告，不跳转页面
                return vue.$toast('未检测到测试报告')
            }

            // 选择是否跳转页面的情况
            // 获取是否有预约记录
            if (result.resCount === 0) {
                // 显示 ‘您尚未预约客户，是否继续完成？’
                vue.$dialog.confirm({
                    title: '您尚未预约客户，是否继续完成？',
                }).then(() => {
                    // 成功-判断是否弹出用户二维码信息标识
                    IsAlertQRCode(buttonInfo, result)
                }).catch(() => {
                    // 失败-不跳转页面
                    return
                })
            } else {
                // 没有预约记录-判断是否弹出用户二维码信息标识
                IsAlertQRCode(buttonInfo, result)
            }

        }

    } catch (error) {
        console.log('err', error)

    }
}
// 回复-回单前查询-用户二维码信息标识
let IsAlertQRCode = (buttonInfo, result) => {
    // 跳转到回复页面
    let skipPage = () => {
        let res = JSON.stringify(result)
        return vue.$router.push({
            name: 'Finish',
            query: {
                orderNum: buttonInfo.orderNum,
                id: buttonInfo.id,
                speedError: buttonInfo.speedError,
                res
            }
        })
    }
    if (buttonInfo.sysId == 1) {
        // 是否弹出提示装维
        // 修机单多返回一个字段alertQRCodeInfo=1
        if (result.alertQRCodeInfo == 1) {
            // 弹窗样式
            vue.$dialog.alert({
                title: '回单提示',
                message: '该用户设备已贴码，提醒用户下次保障可扫码',
                className: 'alertQRCodeInfo',
                confirmButtonText: '我知道了',
                getContainer: '#app',
            }).then(() => {
                // 跳转页面
                skipPage()
            });
        } else {
            // 不弹出提示装维
            // 跳转页面
            skipPage()
        }
    } else {
        // 不弹出提示装维
        // 跳转页面
        skipPage()

    }
}
export default finishQuery