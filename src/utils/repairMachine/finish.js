import { reqFinishQuery } from '@/http/button'
import vue from '@/main'
import apiResponse from '../public/apiResponse'
import '@/assets/css/confirmDialog.less'


// 回复-回单前查询
let finishQuery = async (buttonInfo) => {
    try {
        let result = await reqFinishQuery(JSON.stringify({ id: buttonInfo.id }))
        console.log('回单前查询', result)
        apiResponse(result, '#app', () => {
            // 无法跳转页面的情况
            if (result.cansubmit && result.testReportCount === 2) {
                // 两种清况都显示
                return vue.$dialog.alert({
                    message: '换机单未竣工，请先完成换机单，再回单',
                    className: 'confirmDialog',
                    getContainer: '#app',
                }).then(
                    () => {
                        vue.$dialog.alert({
                            message: '需要生成[健康报告]后，再回单（具体操作：工单详情->健康报告）',
                            className: 'confirmDialog',
                            getContainer: '#app',
                        }).then()
                    }
                )
            } else {
                if (result.cansubmit) {
                    // 回复是否可以提交 false 可以提交，true 不可以提交
                    // 显示(换机单未竣工，请先完成换机单，再回单)
                    vue.$dialog.alert({
                        message: '换机单未竣工，请先完成换机单，再回单',
                        className: 'confirmDialog',
                        getContainer: '#app',
                    }).then()
                    return
                } else if (result.testReportCount === 2) {
                    // 是否有测试报告提交记录 2：弹出未检测到测试报告，不跳转页面
                    // 显示"需要生成[健康报告]后，再回单（具体操作：工单详情->健康报告）"
                    vue.$dialog.alert({
                        message: '需要生成[健康报告]后，再回单（具体操作：工单详情->健康报告）',
                        className: 'confirmDialog',
                        getContainer: '#app',
                    }).then()
                    return
                }
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
        })


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
            name: 'RepairMachineFinish',
            query: {
                orderNum: buttonInfo.orderId,
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
                message: '该用户设备已贴码，提醒用户下次报障可扫码',
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