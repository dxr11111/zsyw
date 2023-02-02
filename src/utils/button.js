// 匹配按钮发送请求
import {
    IfmCrisTestApi,
    reqifmFinish,
    reqUnFocusToday,
    reqSign,
    reqWoRecommend,
    reqConfirmReject,
    reqIgnore,
    reqGrab,
    reqIomNewDismantlingQuery,
    reqIomNewDismantling,
    GoSiteApi,
    IfmTimeApi,
    JndHaveReadApi,
    JndRepealConfirmApi,
    JndChuLiApi,
    IdmDispatchAutoApi,
    reqIfmReDiagnoseQuery,
    reqIfmDiagnoseQuery,
    reqAdslNoUnbinding
} from '@/http/button'
import { getLocation } from './positionLoaction'
import vue from '@/main'
// 装机单回复前查询
import { IomNewFinishQuery } from '@/utils/iomNew/finish'
// 修机单回复前查询
import finishQuery from '@/utils/repairMachine/finish'

// 无页面按钮操作结果
let getResult = (result) => {
    if (result.operationSuccessFlag) {
        // 成功
        if (result?.successMessage.length > 0) vue.$toast(result.successMessage)
        return true
    } else {
        // 失败
        if (result?.errorMessage.length > 0) vue.$toast(result.errorMessage)
        return false
    }
}


export const matchButton = async (buttonInfo, buttonId) => {
    switch (buttonId) {
        // 基站 -- 自动下发
        case ('AUTOISSUE'):
            vue.$router.push({
                path: '/idmIssueAuto',
                query: {
                    id: buttonInfo.id,
                    businessInfo: buttonInfo.businessInfo
                }
            })
            break
        // 公众客响工单CRIS测试
        case ('ifmCrisTest'):
            console.log(buttonInfo, buttonId);
            vue.$dialog.confirm({
                title: '提示',
                message: '您确认提交CRIS测试？',
                getContainer: '#app',
                className: 'confirmDialog',
            })
                .then(async () => {
                    // on confirm
                    let data = await IfmCrisTestApi(JSON.stringify({ id: buttonInfo.id }))
                    console.log(data);
                    if (data.operationSuccessFlag){
                        vue.$toast.success(data.successMessage)
                        if (vue.$route.path !== '/main/workBench') {
                            vue.$router.push('/main/workBench')
                        }
                        vue.operationSuccessRefresh(true)
                    } else {
                        vue.$toast.fail(data.errorMessage)
                    }
                })
                .catch();
            break
        // 基站 上传照片
        case ('uploadphoto'):
            vue.$router.push({
                path: '/jzdUploadphoto',
                query: {
                    id: buttonInfo.id,
                }
            })
            break
        // 基站 自动调度
        case ('AUTODISPATCH'):
            console.log(buttonInfo.businessInfo);
            var params = {
                id: buttonInfo.id,
                resourcecode: buttonInfo.businessInfo.resourcecode || buttonInfo.businessInfo.infoNum, // 信源编码
                gQianFangShi: buttonInfo.businessInfo.gQianFangShi, // 光纤方式
                netranshid: buttonInfo.businessInfo.netranshID, // 网元id
                portid: buttonInfo.businessInfo.portId, // 端口id
                gxNum: buttonInfo.businessInfo.gxNum, // 光芯数
                sfddqcdl: buttonInfo.businessInfo.sfddqcdl, // 是否调度前传电路
                nrmRoom: buttonInfo.businessInfo.nrmRoom, // 网元机房
                dlwbType: buttonInfo.businessInfo.dlwbType, // IPRAN电路微波类型
                wbRoomId: buttonInfo.businessInfo.ycWbRoomId, // 微波机房ID
                wbRoomName: buttonInfo.businessInfo.ycWbRoomName, // 微波机房名称
                nrmRoomID: buttonInfo.businessInfo.nrmRoomhID, // 网元机房ID
                loopBackIP: buttonInfo.businessInfo.loopBackIp, // oopBackIP
                portType: buttonInfo.businessInfo.portType, // 端口类型
                diaodanHao: buttonInfo.businessInfo.diaodanHao, // 调单号
                portRate: buttonInfo.businessInfo.portRate, // 端口速率
                equname: buttonInfo.businessInfo.equName, // 网元名称
                netManNum: buttonInfo.businessInfo.netManNum, // 端口编号
            }
            console.log('自动调度参数', params);
            var data = await IdmDispatchAutoApi(JSON.stringify(params))
            if (data.operationSuccessFlag){
                vue.$toast.success(data.successMessage)
                vue.operationSuccessRefresh(true)
            } else {
                vue.$toast.fail(data.errorMessage)
            }
            break
        // 基站 作废
        case ('CANCEL'):
        // 催办
        case ('HASTEN'):
        // 提交至下一步
        case ('toPast'):
        // 确认
        case ('toEnter'):
        // 归档
        case ('toClose'):
        // 注销
        case ('ZXDBTN'):
        // 驳回
        case ('toReturn'):
        // 基站入网 --- INNET入网，只能看；Alarm告警审查，可修改
        case ('INNET'):
        case ('Alarm'):
            // 基站工单
            if (buttonInfo.sysId == 9) {
                var curr = buttonInfo.buttonList.filter(e => e.actionId == buttonId)[0]
                console.log('buttonId', buttonInfo, buttonId, curr)
                if (buttonId == 'INNET' || buttonId == 'Alarm') {
                    vue.$router.push({
                        path: '/jzdEnterNet',
                        query: {
                            id: buttonInfo.id,
                            currAction: curr,
                            buttonId: buttonId,
                            resourceCode: buttonInfo.businessInfo.resourceCode || buttonInfo.businessInfo.infoNum
                        }
                    })
                } else {
                    vue.$router.push({
                        path: '/jzdTaskOperations',
                        query: {
                            id: buttonInfo.id,
                            currAction: curr,
                            buttonId: buttonId
                        }
                    })
                }
            } else if (buttonInfo.sysId == 12) {
                // 投诉需求单
                let actionType = ""
                let actionText = ""
                let assignLoginName = ""
                // 从buttonList里找到对应buttonId
                for (let button of buttonInfo.buttonList) {
                    console.log('111111111111', button)
                    if (button.actionId == buttonId) {
                        actionType = button.actionType
                        actionText = button.actionText
                        assignLoginName = button.assignTree[0].assignLoginName
                        break
                    }
                }
                vue.$router.push({
                    path: '/toReturn',
                    query: {
                        orderId: buttonInfo.orderId,
                        taskId: buttonInfo.taskId,
                        baseSchema: buttonInfo.baseSchema,
                        buttonId,
                        actionType,
                        actionText,
                        assignLoginName,
                    }
                })
            }

            break
        // 基站 查看小区信息
        case ('queryIdmXiaoQu'):
            vue.$router.push({
                path: '/villageInfoList',
                query: {
                    id: buttonInfo.id,
                }
            })
            break

        // 基站 IPRAN电路 && 拉远RRU电路
        case ('ipranCircuit'):
        case ('rruCircuit'):
            console.log('buttonInfo', buttonInfo, buttonId)
            vue.$router.push({
                path: '/jzIPRANCircuit',
                query: {
                    id: buttonInfo.id,
                    code: buttonId
                }
            })
            break

        // 局内 确认撤单
        case ('repealConfirm'):
            var data = await JndRepealConfirmApi(JSON.stringify({ id: buttonInfo.id }))
            if (data.operationSuccessFlag){
                vue.$toast.success(data.successMessage)
                if (vue.$route.path !== '/main/workBench') {
                    vue.$router.push('/main/workBench')
                }
                vue.operationSuccessRefresh(true)
            } else {
                vue.$toast.fail(data.errorMessage)
            }
            break
        // 局内 已阅
        case ('haveRead'):
            // var data = await JndHaveReadApi(JSON.stringify({ id: buttonInfo.id }))
            var data = {operationSuccessFlag:true}
            if (data.operationSuccessFlag){
                vue.$toast.success(data.successMessage)
                if (vue.$route.path !== '/main/workBench') {
                    vue.$router.push('/main/workBench')
                }
                vue.operationSuccessRefresh(true)
            } else {
                vue.$toast.fail(data.errorMessage)
            }
            break
        // 开始计时
        case ('startTime'):
            var data = await IfmTimeApi(JSON.stringify({ id: buttonInfo.id, type: 0 }))
            data.operationSuccessFlag ? vue.$toast.success(data.successMessage) : vue.$toast.fail(data.errorMessage)
            break
        // 结束计时
        case ('endTime'):
            var data = await IfmTimeApi(JSON.stringify({ id: buttonInfo.id, type: 1 }))
            data.operationSuccessFlag ? vue.$toast.success(data.successMessage) : vue.$toast.fail(data.errorMessage)
            break

        // 随销单回复
        case ('finishSale'):
            vue.$router.push({
                path: '/finishSale',
                query: {
                    orderId: buttonInfo.orderId,
                    id: buttonInfo.id
                }
            })
            break

        // 任务回复 
        case ('finishTask'):
            // IFM工单
            if (buttonInfo.sysId == 3) {
                if (buttonInfo.flowNode == 1 || buttonInfo.flowNode == 3) {
                    // 故障单 预警单
                    vue.$dialog.confirm({
                        title: '提示',
                        message: '是否回复当前任务？',
                        confirmButtonText: '是',
                        cancelButtonText: '否',
                        getContainer: '#app',
                        className: 'confirmDialog',
                    }).then(async () => {
                        // 调接口
                        var data = await reqifmFinish(JSON.stringify({ id: buttonInfo.id }))
                        if (data.operationSuccessFlag == true) {
                            vue.$dialog.confirm({
                                title: '提示',
                                message: '回复任务成功，是否直接回复工单？',
                                confirmButtonText: '是',
                                cancelButtonText: '否',
                                getContainer: '#app',
                                className: 'confirmDialog',
                            }).then(() => {
                                // 点击是，跳转到回复页面
                                vue.$router.push({
                                    path: '/ifmFinish',
                                    query: {
                                        orderId: buttonInfo.orderId,
                                        id: buttonInfo.id,
                                    }
                                })
                            }).catch(() => {
                                if (vue.$route.path !== '/main/workBench') {
                                    vue.$router.push('/main/workBench')
                                }
                                vue.operationSuccessRefresh(true)
                            })
                        } else {
                            vue.$toast.fail(data.errorMessage)
                        }
                    }).catch()
                }
            }
            break

        // 开始处理 -- 任务
        case ('startHandle'):
            console.log('startHandle', buttonInfo)
            if (buttonInfo.sysId == 3) {
                if (buttonInfo.flowNode == 1) {
                    vue.$dialog.alert({
                        title: '提示',
                        message: '开始处理操作只能提交一次，系统将记录经纬度坐标和地址，请确认到达指定地点后再操作，操作成功之后将无法修改或重复提交',
                        getContainer: '#app',
                        className: 'confirmDialog',
                    }).then(() => {
                        vue.$dialog.confirm({
                            title: '提示',
                            message: '确认开始操作嘛？',
                            getContainer: '#app',
                            className: 'confirmDialog',
                        })
                            .then(() => {
                                var location = getLocation()
                                setTimeout(async () => {
                                    let params = {
                                        id: buttonInfo.id,
                                        posX: location.lng, // 经度
                                        posY: location.lat, // 纬度
                                        address: location.address
                                    }
                                    console.log('参数', params);
                                    let data = await GoSiteApi(JSON.stringify(params))
                                    if (data.operationSuccessFlag) {
                                        vue.$toast.success(data.successMessage)
                                        if (vue.$route.path !== '/main/workBench') {
                                            vue.$router.push('/main/workBench')
                                        }
                                        vue.operationSuccessRefresh(true)
                                    } else {
                                        vue.$toast.fail(data.errorMessage)
                                    }
                                }, 1000)
                            })
                            .catch()
                    })
                }
            } else if (buttonInfo.sysId == 7) {
                // 局内 任务-开始处理
                var data = await JndChuLiApi(JSON.stringify({ id: buttonInfo.id }))
                if (data.operationSuccessFlag) {
                    vue.$toast.success(data.successMessage)
                    if (vue.$route.path !== '/main/workBench') {
                        vue.$router.push('/main/workBench')
                    }
                    vue.operationSuccessRefresh(true)
                } else {
                    vue.$toast.fail(data.errorMessage)
                }
            }
            break

        // 派发
        case ('paifa'):
            vue.$router.push({
                path: '/paifa',
                query: {
                    orderId: buttonInfo.orderId,
                    id: buttonInfo.id
                }
            })
            break

        // 修改场景类型
        case ('ifmXgxwcjlx'):
            vue.$router.push({
                path: '/updateMiniSceneType',
                query: {
                    orderId: buttonInfo.orderId,
                    id: buttonInfo.id
                }
            })
            break

        // 修改扩容类型
        case ('ifmXgkrlx'):
            vue.$router.push({
                path: '/updateDilatationType',
                query: {
                    orderId: buttonInfo.orderId,
                    id: buttonInfo.id
                }
            })
            break

        // 添加超时
        case ('ifmAddOverTimeInfo'):
            vue.$router.push({
                path: '/ifmAddOverTime',
                query: {
                    orderId: buttonInfo.orderId,
                    id: buttonInfo.id
                }
            })
            break

        // 审核
        case ('audit'):
            vue.$router.push({
                path: '/audit',
                query: {
                    orderId: buttonInfo.orderId,
                    id: buttonInfo.id
                }
            })
            break

        // 指定维护人
        case ('assignAccendant'):
            vue.$router.push({
                path: '/assignAccendant',
                query: {
                    orderId: buttonInfo.orderId,
                    id: buttonInfo.id
                }
            })
            break

        // 上站功能
        case ('goSite'):
            console.log('gosite', buttonInfo)
            // vue.$store.commit('button/updatePositionFlag', true)
            vue.$dialog.alert({
                title: '提示',
                message: '上站操作只能提交一次，系统将记录经纬度坐标和地址，请确认到达指定地点后再操作，操作成功之后将无法修改或重复提交',
                getContainer: '#app',
                className: 'confirmDialog',
            }).then(() => {
                vue.$dialog.confirm({
                    title: '提示',
                    message: '确认上站操作嘛？',
                    getContainer: '#app',
                    className: 'confirmDialog',
                })
                    .then(async () => {
                        var location = await getLocation()
                        setTimeout(async () => {
                            let params = {
                                id: buttonInfo.id,
                                posX: location.lng, // 经度
                                posY: location.lat, // 纬度
                                address: location.address
                            }
                            console.log('参数', params);
                            let data = await GoSiteApi(JSON.stringify(params))
                            if (data.operationSuccessFlag) {
                                vue.$toast.success(data.successMessage)
                                if (vue.$route.path !== '/main/workBench') {
                                    vue.$router.push('/main/workBench')
                                }
                                vue.operationSuccessRefresh(true)
                            } else {
                                vue.$toast.fail(data.errorMessage)
                            }
                        }, 2000)
                    })
                    .catch(() => {
                        // on cancel
                    })
            })
            break

        // 组内转派
        case ('groupZhuanPai'):
            vue.$router.push({
                path: '/groupZhuanPai',
                query: {
                    orderId: buttonInfo.orderId,
                    id: buttonInfo.id
                }
            })
            break

        // 通知上级
        case ('notifyOrigin'):
            vue.$router.push({
                path: '/informSuper',
                query: {
                    orderId: buttonInfo.orderId,
                    id: buttonInfo.id
                }
            })
            break


        case ('unFocusToday'):
            // 发送今日不关注请求
            let unFocusTodayResult = await reqUnFocusToday(JSON.stringify({ id: buttonInfo.id }))
            // 返回成功或失败标识 成功即刷新页面
            return getResult(unFocusTodayResult)

        case ('sign'):
            // 签收
            let signResult = await reqSign(JSON.stringify({ id: buttonInfo.id }))
            return getResult(signResult)
        case ('confirmReject'):
            // 确认驳回
            let reqConfirmRejectResult = await reqConfirmReject(JSON.stringify({ id: buttonInfo.id }))
            return getResult(reqConfirmRejectResult)
        case ('reservation'):
            // 预约
            vue.$router.push({
                path: '/appointment',
                query: {
                    orderNum: buttonInfo.orderId,
                    id: buttonInfo.id,
                    custPhone: buttonInfo.custPhone,
                    sysId: buttonInfo.sysId,
                }
            })
            break
        case ('editReservation'):
            // 修改预约
            vue.$router.push({
                path: '/changeAppoint',
                query: {
                    orderNum: buttonInfo.orderId,
                    id: buttonInfo.id,
                    custPhone: buttonInfo.custPhone,
                    sysId: buttonInfo.sysId,
                }
            })
            break
        case ('return'):
            // 退单
            if (buttonInfo.sysId == 7) {
                // 局内工单
                vue.$router.push({
                    path: '/jnReject',
                    query: {
                        orderNum: buttonInfo.orderId,
                        id: buttonInfo.id,
                    }
                })

            } else {
                // 其他工单
                vue.$router.push({
                    path: '/chargeBack',
                    query: {
                        orderNum: buttonInfo.orderId,
                        id: buttonInfo.id,
                        sysId: buttonInfo.sysId,
                        needFuce: buttonInfo.needFuce
                    }
                })
            }
            break
        case ('fillProgress'):
            // 编辑处理过程
            vue.$router.push({
                path: '/treatProcess',
                query: {
                    orderNum: buttonInfo.orderId,
                    id: buttonInfo.id,
                    flowNode: buttonInfo.flowNode,
                    sysId: buttonInfo.sysId
                }
            })
            break
        case ('ifmTestReport'):
            // 健康报告
            vue.$router.push({
                path: '/healthReport',
                query: {
                    orderNum: buttonInfo.orderId,
                    id: buttonInfo.id,
                }
            })
            break
        case ('groupBarrierRequest'):
            // 健康报告
            vue.$router.push({
                path: '/groupBarrier',
                query: {
                    orderNum: buttonInfo.orderId,
                    id: buttonInfo.id,
                }
            })
            break
        case ('test'):
            // CRIS测试
            vue.$router.push({
                path: '/crisTest',
                query: {
                    balkPhone: buttonInfo.balkPhone,
                    id: buttonInfo.id,
                }
            })
            break
        case ('businessPromotion'):
            // 业务推广(跳转到沃推荐)
            let woRecommend = await reqWoRecommend(JSON.stringify({ productNum: buttonInfo.balkPhone }))
            // window.location.href = "https://vant-contrib.gitee.io/vant/v2"
            vue.$router.push({
                name: 'ExternalURL',
                url: woRecommend
            })
            return getResult(woRecommend)
        case ('switch'):
            // 换机
            vue.$router.push({
                path: '/changePlanes',
                query: {
                    orderNum: buttonInfo.orderId,
                    id: buttonInfo.id,
                }
            })
            break
        case ('constraintFinish'):
            // 强制回单
            vue.$router.push({
                path: '/constraintFinish',
                query: {
                    orderNum: buttonInfo.orderId,
                    id: buttonInfo.id,
                }
            })
            break
        case ('finish'):
            // 回复
            console.log('all', buttonInfo)
            // 判断是修机单的回复还是装机单的回复
            if (buttonInfo.sysId == 1) {
                // 修机单
                // 跳转到回单页面前调用回单前查询接口
                finishQuery(buttonInfo)
            } else if (buttonInfo.sysId == 10) {
                // 装机单
                IomNewFinishQuery(buttonInfo)
            } else if (buttonInfo.sysId == 3) {
                if (buttonInfo.flowNode == 1) {
                    // console.log('故障单', buttonInfo)
                    // 故障单
                    vue.$router.push({
                        name: 'Ifminish',
                        query: {
                            orderId: buttonInfo.orderId,
                            id: buttonInfo.id,
                            workType: buttonInfo.workType,
                        }
                    })
                } else if (buttonInfo.flowNode == 3 || buttonInfo.flowNode == 4) {
                    // 3预警单/ 4支撑单
                    vue.$router.push({
                        path: '/warnReply',
                        query: {
                            orderId: buttonInfo.orderId,
                            id: buttonInfo.id,
                            flowNode: buttonInfo.flowNode
                        }
                    })
                } else if (buttonInfo.flowNode == 5) {
                    // 重保单
                    vue.$router.push({
                        path: '/heavyPolicyFinish',
                        query: {
                            orderId: buttonInfo.orderId,
                            id: buttonInfo.id
                        }
                    })
                }

            } else if (buttonInfo.sysId == 7) {
                // 局内工单
                vue.$router.push({
                    path: '/jndFinish',
                    query: {
                        orderId: buttonInfo.orderId,
                        id: buttonInfo.id
                    }
                })
            }
            break
        case ('returnZhuanPai'):
            // 退转派
            vue.$router.push({
                path: '/returnZhuanPai',
                query: {
                    orderNum: buttonInfo.orderId,
                    id: buttonInfo.id,
                }
            })
            break
        case ('returnSheet'):
            // 退工单
            vue.$router.push({
                path: '/returnSheetMain',
                query: {
                    orderNum: buttonInfo.orderId,
                    id: buttonInfo.id,
                    actionType: buttonInfo.actionType
                }
            })
            break
        case ('zeroConfig'):
            // 零配置
            /*   响应参数：
              1. showFlag返回1显示进度页面，zeroConfigInfoList显示零配置进度信息
              2. showFlag返回2显示零配置页面，accessType显示接入方式下拉列表内容，
              当产品类型businessTypeCode = 1 （宽带）时，
              零配置接入方式AG不显示ip输入和查端口，可直接提交，
              零配置接入方式PON + D无需调用查询交换区接口，可直接提交
       当businessTypeCode 不等于 1 时，
              接入方式为AG时，需显示ip输入框，点击查询调用1.8.9.8接口，
              接入方式为PON + D时，进入页面需调用1.8.9.9接口
              3. showFlag返回3显示进度，但不能重新配置 */

            // 调用零配置前查询接口
            vue.$store.dispatch('zeroConfig/getIomNewZeroConfigQuery', JSON.stringify({ id: buttonInfo.id })).then(res => {
                let zeroConfigQueryInfo = vue.$store.state.zeroConfig.zeroConfigQueryInfo
                if (zeroConfigQueryInfo.operationSuccessFlag) {
                    // 成功
                    // 判断 showFlag 进入零配置页面还是进度页面
                    let showFlag = zeroConfigQueryInfo.showFlag
                    if (showFlag === 1) {
                        // 进入进度页面
                        vue.$router.push({
                            name: 'ConfigStatus',
                            query: {
                                orderNum: buttonInfo.orderId,
                                id: buttonInfo.id,
                            }
                        })
                    } else if (showFlag === 2) {

                        // 进入零配置页面
                        vue.$router.push({
                            name: 'NotConfig',
                            query: {
                                orderNum: buttonInfo.orderId,
                                id: buttonInfo.id,
                            }
                        })
                    }

                }
            })


            // vue.$router.push({
            //     path: '/zeroConfig',
            //     query: {
            //         orderNum: buttonInfo.orderId,
            //         id: buttonInfo.id,
            //     }
            // })
            break
        case ('iptvUnBunding'):
            // IPTV解绑
            vue.$router.push({
                path: '/iptvUnBunding',
                query: {
                    orderNum: buttonInfo.orderId,
                    id: buttonInfo.id,
                }
            })
            break
        case ('bindPos'):
            // POS绑定
            vue.$router.push({
                path: '/bindPos',
                query: {
                    orderNum: buttonInfo.orderId,
                    id: buttonInfo.id,
                }
            })
            break
        case ('ignore'):
            // 与我无关
            let ignoreResult = await reqIgnore(JSON.stringify({ id: buttonInfo.id }))
            // 返回成功或失败标识 成功即刷新页面
            return getResult(ignoreResult)
        case ('grab'):
            // 抢单
            let grabResult = await reqGrab(JSON.stringify({ id: buttonInfo.id }))
            // 返回成功或失败标识 成功即刷新页面
            return getResult(grabResult)
        case ('dismantling'):
            // 拆机
            let dismantlingResult = await reqIomNewDismantlingQuery(JSON.stringify({ id: buttonInfo.id, iscanceliptv: buttonInfo.iscanceliptv }))
            console.log('拆机前查询结果', dismantlingResult)
            if (dismantlingResult.operationSuccessFlag) {
                if (dismantlingResult.showFlag == 2) {
                    // 2:未做拆机
                    // 弹框
                    vue.$dialog.confirm({
                        title: '提示',
                        message: '确认拆机操作吗？',
                        getContainer: '.listDetail',
                        className: 'confirmDialog',
                    }).then(async () => {
                        // 拆机提交
                        let dismantQueryResult = await reqIomNewDismantling(JSON.stringify({ id: buttonInfo.id }))
                        console.log('拆机提交结果', dismantQueryResult)
                        // 进入拆机进度页面
                        vue.$router.push({
                            name: 'Dismantle',
                            query: {
                                showFlag: 2, // 拆机标识
                            }
                        })

                    }).catch(() => {
                        // 关闭弹框
                    })
                }
                else if (dismantlingResult.showFlag == 1) {
                    // 跳到拆机进度页面
                    vue.$router.push({
                        name: 'Dismantle',
                        query: {
                            showFlag: 1, // 拆机标识
                            zeroConfigInfoList: dismantlingResult.zeroConfigInfoList // 进度信息
                        }
                    })
                }

            }
            break
        case ('updYhdSolveInfo'): case ('insertYhdSolveInfo'):
            // 填写解决方案
            vue.$router.push({
                path: '/insertYhdSolveInfo',
                query: {
                    orderId: buttonInfo.orderId,
                    id: buttonInfo.id,
                    buttonId,
                }
            })
            break
        case ('ifmAuditGq'):
            // 审核挂起
            vue.$router.push({
                path: '/auditGq',
                query: {
                    orderId: buttonInfo.orderId,
                    id: buttonInfo.id,
                    flowNode: buttonInfo.flowNode
                }
            })
            break
        case ('ifmAuditOverTime'):
            // 审核超时
            vue.$router.push({
                path: '/auditOverTime',
                query: {
                    orderId: buttonInfo.orderId,
                    id: buttonInfo.id,
                }
            })
            break
        case ('ifmGq'):
            // 挂起
            vue.$router.push({
                path: '/ifmGq',
                query: {
                    orderId: buttonInfo.orderId,
                    id: buttonInfo.id,
                }
            })
            break
        case ('circuitInfo'):
            // 电路信息-局内
            vue.$router.push({
                path: '/circuit',
                query: {
                    orderId: buttonInfo.orderId,
                    id: buttonInfo.id,
                }
            })
            break
        case ('aiQuality'):

            // AI质检-建设
            vue.$router.push({
                path: '/aiQuality',
                query: {
                    uniqueIdentification: buttonInfo.uniqueIdentification,
                }
            })
            break
        case ('flowChart'):
            // 流程图-建设
            vue.$router.push({
                path: '/flowChart',
                query: {
                    uniqueIdentification: buttonInfo.uniqueIdentification,
                    taskId: buttonInfo.taskId,
                }
            })
            break
        case ('ifmFuCe'):
            // 复测
            vue.$router.push({
                path: '/ifmFuCe',
                query: {
                    id: buttonInfo.id,
                }
            })
            break
        case ('ifmZhuanPai'):
            // 转派
            let result = await reqIfmReDiagnoseQuery(JSON.stringify({ id: buttonInfo.id }))
            console.log('查询转派类型结果', result)
            vue.apiResponse(result, '', () => {
                let showFlag = result.showFlag
                // 返回的showFlag等于1或者等于2时，页面上显示选择分公司代维
                if (showFlag == 1 || showFlag == 2) {
                    // 获取dwGroupList
                    vue.$router.push({
                        name: 'IfmZhuanPaiSelectDw',
                        query: {
                            id: buttonInfo.id,
                            dwGroupList: JSON.stringify(result.dwGroupList),
                            step: 1,
                        }
                    })
                } else if (showFlag == 3) {
                    // 返回的showFlag等于3时，页面上显示选择分公司
                    // 获取groupList
                    vue.$router.push({
                        name: 'IfmZhuanPaiSelectGroup',
                        query: {
                            id: buttonInfo.id,
                            groupList: JSON.stringify(result.groupList),
                        }
                    })
                }
            })
            break
        case ('ifmChuZhen'):
            // 初诊

            // test
            // vue.$router.push({
            //     name: 'Test1',

            // })
            // return
            let czResult = await reqIfmDiagnoseQuery(JSON.stringify({ id: buttonInfo.id }))
            console.log('查询初诊类型结果', czResult)
            vue.apiResponse(czResult, '', () => {

                if (czResult.showFlag == 1) {
                    // 跳转到初诊页面
                    // 如果“接口1”返回的showFlag = 1，
                    // 则取“接口1”返回的piaTypeList（障碍类型）和diagnoseResultInfoList（诊断结果）
                    vue.$router.push({
                        name: 'IfmChuZhenMain',
                        query: {
                            id: buttonInfo.id,
                            requestType: 1,
                            showFlag: czResult.showFlag,
                            piaTypeDiagnoseResult: JSON.stringify(czResult.piaTypeDiagnoseResult)
                        }
                    })

                } else if (czResult.showFlag == 2) {
                    // 跳转到分公司代维
                    vue.$router.push({
                        name: 'IfmChuZhenSelectDw',
                        query: {
                            id: buttonInfo.id,
                            dwGroupList: JSON.stringify(czResult.dwGroupList),
                            groupId: -1,
                            groupName: '',
                            showFlag: 2,
                            diagnoseResultId: -1,
                            diagremark: '',
                        }
                    })

                } else if (czResult.showFlag == 3) {
                    // 如果“接口1”返回的showFlag = 3，
                    // 则取“接口1”返回的piaTypeList（障碍类型）和diagnoseResultInfoList（诊断结果）
                    vue.$router.push({
                        name: 'IfmChuZhenMain',
                        query: {
                            id: buttonInfo.id,
                            requestType: 2,
                            showFlag: czResult.showFlag,
                            piaTypeDiagnoseResult: JSON.stringify(czResult.piaTypeDiagnoseResult)
                        }
                    })

                }
            })

            break;
        case ('adslNoUnbinding'):
            vue.$dialog.confirm({
                title: '提示',
                message: '确定解除该用户的宽带账号绑定吗？',
                getContainer: '#app',
                className: 'confirmDialog',
            })
                .then(async () => {
                    let adslNoUnbindingResult = await reqAdslNoUnbinding(JSON.stringify({ id: buttonInfo.id }))
                    return getResult(adslNoUnbindingResult)
                })
                .catch();
            break
        case ('BUILDDATA'):
            // 基站-数据制作
            vue.$router.push({
                name: 'IdmBuildData',
                query: {
                    id: buttonInfo.id,
                    baseSN: buttonInfo.baseSn,
                    engItem: buttonInfo.businessInfo.engItem,
                    rbhids: buttonInfo.businessInfo.ycRbsHids,
                    resourcecode: buttonInfo.businessInfo.resourcecode,
                }
            })
            break
        default:
            if (buttonId !== 'more') vue.$toast('当前工单暂不支持该功能')
            break


    }
}