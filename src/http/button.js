import requests from './request'

// 自动下发
export const IdmIssueAutoInfoApi = (postData) => {
    return requests({ method: 'post', url: '/operation/idm/idmIssueAuto', data: `data=${postData}` })
}
// 自动下发 --- 下发/注销
export const IdmIssueAutoCancelApi = (postData) => {
    return requests({ method: 'post', url: '/operation/idm/idmIssuedAndCancel', data: `data=${postData}` })
}
// 自动下发 --- 下发/注销结果查询
export const IdmIssueAutoResultApi = (postData) => {
    return requests({ method: 'post', url: '/operation/idm/idmQueryIssuedAndCancelResult', data: `data=${postData}` })
}
// 自动下发 --- 操作记录查询
export const IdmIssueAutoRecordApi = (postData) => {
    return requests({ method: 'post', url: '/operation/idm/idmQueryOperatingRecord', data: `data=${postData}` })
}

// 公众客响工单CRIS测试
export const IfmCrisTestApi = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmCrisTest', data: `data=${postData}` })
}

// 上传照片
export const IdmUploadPhotoApi = (postData) => {
    return requests({ method: 'post', url: '/operation/idm/idmUploadPhoto', data: `data=${postData}` })
}
// 自动调度
export const IdmDispatchAutoApi = (postData) => {
    return requests({ method: 'post', url: '/operation/idm/idmDispatchAuto', data: `data=${postData}` })
}
// 入网前查询
export const idmAlarmReviewApi = (postData) => {
    return requests({ method: 'post', url: '/operation/idm/idmAlarmReviewAndInNetTest', data: `data=${postData}` })
}
// 入网 -- alarm
export const IdmAlarmReviewApi = (postData) => {
    return requests({ method: 'post', url: '/operation/idm/idmAlarmReviewButton', data: `data=${postData}` })
}
// 基站 任务处理 --- 作废、驳回、归档、注销、确认、入网（innet）、提交至下一步、催办、审核通过
export const IdmProcessApi = (postData) => {
    return requests({ method: 'post', url: '/operation/idm/idmProcess', data: `data=${postData}` })
}
// 基站 -- 小区信息/RRU列表
export const GetRruOrCellListApi = (postData) => {
    return requests({ method: 'post', url: '/operation/idm/idmQueryRruOrCellList', data: `data=${postData}` })
}
// 基站---电路查询
export const GetIdmCircuitApi = (postData) => {
    return requests({ method: 'post', url: '/operation/idm/idmQueryCircuit', data: `data=${postData}` })
}

// 局内修改端子
export const JndUpdateerminalApi = (postData) => {
    return requests({ method: 'post', url: '/operation/jndd/jnddCircuitNoUpdateRouteTerminal', data: `data=${postData}` })
}
// 局内修改端子时查询
export const JndSpecLineRouteTerminalApi = (postData) => {
    return requests({ method: 'post', url: '/operation/jndd/jnddSpecLineQueryRouteTerminal', data: `data=${postData}` })
}
// 局内修改端子前查询
export const JndCircuitInfoApi = (postData) => {
    return requests({ method: 'post', url: '/operation/jndd/jnddCircuitNoQueryRouteInfo', data: `data=${postData}` })
}
// 局内任务开始处理
export const JndChuLiApi = (postData) => {
    return requests({ method: 'post', url: '/operation/jndd/jnddChuLi', data: `data=${postData}` })
}
// 局内确认撤单
export const JndRepealConfirmApi = (postData) => {
    return requests({ method: 'post', url: '/operation/jndd/jnddRepealConfirm', data: `data=${postData}` })
}
// 局内已阅
export const JndHaveReadApi = (postData) => {
    return requests({ method: 'post', url: '/operation/jndd/jnddHaveRead', data: `data=${postData}` })
}
// 局内工单回复前查询
export const JndBeforeFinishApi = (postData) => {
    return requests({ method: 'post', url: '/operation/jndd/jnddFinishQuery', data: `data=${postData}` })
}
// 回复提交
export const JndFinishApi = (postData) => {
    return requests({ method: 'post', url: '/operation/jndd/jnddFinish', data: `data=${postData}` })
}

// 铁塔计时
export const IfmTimeApi = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ttTime', data: `data=${postData}` })
}

// 重保单回复
export const IfmFinishApi = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmFinish', data: `data=${postData}` })
}
// 重保单回复前查询
export const BeforeFinishApi = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmFinishQuery', data: `data=${postData}` })
}

// 随销单回复
export const SaleFinishApi = (postData) => {
    return requests({ method: 'post', url: '/operation/saleSheet/saleSheetFinish', data: `data=${postData}` })
}

// 派发前查询
export const GetPaiFaQueryApi = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmPaiFaQuery', data: `data=${postData}` })
}
// 针对选择的派发部门（网维、客支等），查询在岗的工程师技能
export const GetPaiFaQueryKzwwApi = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmPaiFaQueryKzww', data: `data=${postData}` })
}
// 派发提交
export const PaiFaConfirmApi = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmPaiFa', data: `data=${postData}` })
}

// 修改场景类型
export const UpdateMiniSceneTypeApi = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmUpdateMiniSceneType', data: `data=${postData}` })
}
// 修改扩容类型
export const UpdateBaseDilatationTypeApi = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmUpdateBaseDilatationType', data: `data=${postData}` })
}

// 产品相关超时前查询
export const GetComplaintProdApi = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmComplaintProdQuery', data: `data=${postData}` })
}
// 添加超时
export const AddOrUpdateOverTimeApi = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmAddOrUpdateOverTimeInfo', data: `data=${postData}` })
}

// 审核前查询
export const GetAuditSheetApi = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmAuditSheetQuery', data: `data=${postData}` })
}
// 审核提交
export const UpdateAuditSheetApi = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmAuditSheet', data: `data=${postData}` })
}
// 审核驳回
export const RejectAuditSheetApi = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmRejectSheet', data: `data=${postData}` })
}

// 指定维护人 - 查询已有的维护人信息
export const GetAssignAccendantNowApi = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmAppointRepairQueryNow', data: `data=${postData}` })
}
// 删除维护人
export const RemoveAssignAccendantNowApi = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmAppointRepairDelete', data: `data=${postData}` })
}
// 查询地址和工程师列表 
export const GetAssignAccendantApi = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmAppointRepairQuery', data: `data=${postData}` })
}
// 添加维护人
export const AddAssignAccendantApi = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmAppointRepairAdd', data: `data=${postData}` })
}

// 组内转派前查询 
export const GetGroupPaiQueryApi = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/groupPaiQuery', data: `data=${postData}` })
}
export const GroupPaiSaveApi = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/groupPaiSave', data: `data=${postData}` })
}

// 上站 
export const GoSiteApi = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/goSite', data: `data=${postData}` })
}

// 通知上级前查询 -- 接收部门参数
export const GetImfSuperListApi = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmGetSuperiorDeptList', data: `data=${postData}` })
}
// 通知上级提交
export const IfmSaveNotifyApi = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmSaveNotify', data: `data=${postData}` })
}

// 按钮接口
// 今日不关注
export const reqUnFocusToday = (postData) => {
    return requests({ method: 'post', url: '/operation/unFocusToday', data: `data=${postData}` })
}

// 签收
export const reqSign = (postData) => {
    return requests({ method: 'post', url: '/operation/taskSign', data: `data=${postData}` })
}
// 确认驳回
export const reqConfirmReject = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/confirmReject', data: `data=${postData}` })
}

// 预约
export const reqReserve = (postData) => {
    return requests({ method: 'post', url: '/operation/reserve', data: `data=${postData}` })
}

// 修改预约
export const reqEditReserve = (postData) => {
    return requests({ method: 'post', url: '/operation/editReserve', data: `data=${postData}` })
}

// 退单
export const reqChargeBack = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmReject', data: `data=${postData}` })
}

// 处理过程
export const reqTreatProcess = (postData) => {
    return requests({ method: 'post', url: '/operation/fillProgress', data: `data=${postData}` })
}

// 健康报告查询
export const reqHealthQuery = (postData) => {
    return requests({ method: 'post', url: '/operation/testReportQuery', data: `data=${postData}` })
}

// 健康报告提交
export const reqHealthSubmit = (postData) => {
    return requests({ method: 'post', url: '/operation/testReportSubmit', data: `data=${postData}` })
}

// 群障申请查询
export const reqGroupBarrierQuery = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmGroupBarrierRequestQuery', data: `data=${postData}` })
}

// 群障申请提交
export const reqGroupBarrierSubmit = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmGroupBarrierRequest', data: `data=${postData}` })
}

// cris测试提交
export const reqCRISTestSubmit = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/testCRISInsert', data: `data=${postData}` })
}

// cris测试历史记录列表
export const reqCRISTestList = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/testCRISQueryList', data: `data=${postData}` })
}

// cris测试历史记录详情
export const reqCRISTestListDetail = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/testCRISQuery', data: `data=${postData}` })
}

// 我已到达
export const reqArrive = (postData) => {
    return requests({ method: 'post', url: '/operation/arrive', data: `data=${postData}` })
}

// 沃推荐
export const reqWoRecommend = (postData) => {
    return requests({ method: 'post', url: '/woRecommend', data: `data=${postData}` })
}

// 换机
// 换机前查询
export const reqChangeDevDispatch = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/changeDevDispatch', data: `data=${postData}` })
}
// 查询换机记录
export const reqChangeDevHis = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/queryChangeDevHis', data: `data=${postData}` })
}
// 换机处理过程
export const reqChangeDevProc = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/queryChangeDevProc', data: `data=${postData}` })
}
// 换机失败原因
export const reqChangeDevFailReason = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/queryChangeDevFailReason', data: `data=${postData}` })
}
// 换机查询资源（录入新设备/更换）
export const reqDevZy = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/queryDevMsgFromZy', data: `data=${postData}` })
}
// 换机提交资源（录入新设备/更换）
export const reqDevSubmit = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/changeDevSubmit', data: `data=${postData}` })
}
// 换机重试
export const reqretryChangeDev = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/retryChangeDev', data: `data=${postData}` })
}

// 强制回单
// 端到端强制回单前查询
export const reqConstraintFinish = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmConstraintFinishQuery', data: `data=${postData}` })
}
// 点击确认提交
export const reqifmFinish = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmFinish', data: `data=${postData}` })
}

// 回复
// 回单前查询
export const reqFinishQuery = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmFinishQuery', data: `data=${postData}` })
}

// 零配置
// 零配置前查询
export const reqIomNewZeroConfigQuery = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewZeroConfigQuery', data: `data=${postData}` })
}

// 零配置查询进度
export const reqIomNewZeroConfigQueryProgress = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewZeroConfigQueryProgress', data: `data=${postData}` })
}

// 零配置提交-ftth
export const reqIomNewZeroConfigFtth = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewZeroConfigFtth', data: `data=${postData}` })
}

// 零配置提交-fttb
export const reqIomNewZeroConfigFttb = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewZeroConfigFttb', data: `data=${postData}` })
}

// 零配置提交-ag
export const reqIomNewZeroConfigAg = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewZeroConfigAg', data: `data=${postData}` })
}

// 零配置提交-pon+d
export const reqIomNewZeroConfigPonD = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewZeroConfigPonD', data: `data=${postData}` })
}

// 零配置提交-adsl
export const reqIomNewZeroConfigAdsl = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewZeroConfigAdsl', data: `data=${postData}` })
}

// 零配置Ag-查询端口
export const reqIomNewQueryAgPort = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewQueryAgPort', data: `data=${postData}` })
}

// 零配置fttb-查询端口
export const reqIomNewQueryFttbPort = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewQueryFttbPort', data: `data=${postData}` })
}

// 零配置PON+D-查询交换区局号
export const reqIomNewQueryExchSystemCode = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewQueryExchSystemCode', data: `data=${postData}` })
}

// 零配置-继续施工
export const reqIomNewZeroConfigGoOnWroking = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewZeroConfigGoOnWroking', data: `data=${postData}` })
}

// 零配置-光猫入网重试
export const reqIomNewLpRetry = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewLpRetry', data: `data=${postData}` })
}

// 零配置-重试
export const reqIomNewZeroConfigAgain = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewZeroConfigAgain', data: `data=${postData}` })
}

// 零配置-转人工
export const reqIomNewZeroConfigTurnPerson = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewZeroConfigTurnPerson', data: `data=${postData}` })
}

// 零配置-确认新装
export const reqIomNewDeleteData = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewDeleteData', data: `data=${postData}` })
}

// 零配置-加装
export const reqIomNewAddInstall = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewZeroConfigAddInstall', data: `data=${postData}` })
}

// 零配置-更改物理号
export const reqIomNewChangePhyNo = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewChangePhyNo', data: `data=${postData}` })
}

// 零配置-驳回
export const reqIomNewZeroConfigReject = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewZeroConfigReject', data: `data=${postData}` })
}

// 退工单、退转派
export const reqIomReject = (postData) => {
    return requests({ method: 'post', url: '/operation/iom/iomReject', data: `data=${postData}` })
}

// 退工单-修改标准地址-查楼房、平房信息
export const reqIomNewQueryFloorInfo = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewQueryFloorInfo', data: `data=${postData}` })
}

// 退工单-修改标准地址-查单元，楼层，房间
export const reqIomNewQueryUitInfo = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewQueryUitInfo', data: `data=${postData}` })
}

// 设备查询
export const reqIomNewQueryDevice = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewQueryDevice', data: `data=${postData}` })
}

// POS绑定-查询
export const reqIomPosInfoQuery = (postData) => {
    return requests({ method: 'post', url: '/operation/iom/iomPosInfoQuery', data: `data=${postData}` })
}
// POS绑定-提交
export const reqIomPosInfoUpdate = (postData) => {
    return requests({ method: 'post', url: '/operation/iom/iomPosInfoUpdate', data: `data=${postData}` })
}

// 与我无关
export const reqIgnore = (postData) => {
    return requests({ method: 'post', url: '/operation/ignore', data: `data=${postData}` })
}

// 抢单
export const reqGrab = (postData) => {
    return requests({ method: 'post', url: '/operation/iom/grab', data: `data=${postData}` })
}

// iptv解绑查询结果
export const reqIomNewIptvUnBundingQuery = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewIptvUnBundingQuery', data: `data=${postData}` })
}

// iptv解绑
export const reqIomNewIptvUnBunding = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewIptvUnBunding', data: `data=${postData}` })
}

// 回复-回复前查询
export const reqIomNewFinishQuery = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewFinishQuery', data: `data=${postData}` })
}
// 回复-回复提交
export const reqIomNewFinish = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewFinish', data: `data=${postData}` })
}
// 回复-发起掌沃通测试
export const reqIomNewSpeedForm = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewSpeedForm', data: `data=${postData}` })
}
// 回复-LAN口协商速率查询(提交测试协商速率)
export const reqIomNewLanInQuire = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewLanInQuire', data: `data=${postData}` })
}
// 回复-WIFI组网测速
export const reqIomNewWifiVm = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewWifiVm', data: `data=${postData}` })
}

// 拆机-拆机前查询
export const reqIomNewDismantlingQuery = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewDismantlingQuery', data: `data=${postData}` })
}
// 拆机-拆机提交
export const reqIomNewDismantling = (postData) => {
    return requests({ method: 'post', url: '/operation/iomNew/iomNewDismantling', data: `data=${postData}` })
}

// 优化单
// 查询解决放案
export const reqIfmQueryYhdSolveInfo = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmQueryYhdSolveInfo', data: `data=${postData}` })
}

// 更新解决放案（提交）
export const reqIfmUpdYhdSolveInfo = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmUpdYhdSolveInfo', data: `data=${postData}` })
}

// 故障单
// 审核前查询
export const reqIfmComplaintProdQuery = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmComplaintProdQuery', data: `data=${postData}` })
}
// 审核提交
export const reqIfmAuditYdProdInfo = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmAuditYdProdInfo', data: `data=${postData}` })
}
// 挂起
export const reqIfmGq = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmUpdateMiniCompSceneReservationTime', data: `data=${postData}` })
}
// 审核挂起-下载证据
export const reqDownloadFile = (postData) => {
    return requests({ method: 'post', url: '/downloadFile', data: `data=${postData}` })
}

// 局内工单
// 退单
export const reqJnddReject = (postData) => {
    return requests({ method: 'post', url: '/operation/jndd/jnddReject', data: `data=${postData}` })
}
// 查询电路信息
export const reqJnddQueryCircuit = (postData) => {
    return requests({ method: 'post', url: '/operation/jndd/jnddQueryCircuit', data: `data=${postData}` })
}
// 退电路
export const reqJnddCircuitBack = (postData) => {
    return requests({ method: 'post', url: '/operation/jndd/jnddCircuitBack', data: `data=${postData}` })
}
// 回复电路
export const reqJnddCircuitFinish = (postData) => {
    return requests({ method: 'post', url: '/operation/jndd/jnddCircuitFinish', data: `data=${postData}` })
}
// 确认驳回电路
export const reqJnddCircuitRejectConfirm = (postData) => {
    return requests({ method: 'post', url: '/operation/jndd/jnddCircuitRejectConfirm', data: `data=${postData}` })
}

// 建设-AI质检条目
export const reqYwjsAIQualityList = (postData) => {
    return requests({ method: 'post', url: '/operation/ywjs/ywjsQualityTestingList', data: `data=${postData}` })
}
// 建设-AI质检照片
export const reqYwjsAIQualityPhotoList = (postData) => {
    return requests({ method: 'post', url: '/operation/ywjs/ywjsPhotoList', data: `data=${postData}` })
}
// 建设-任务进度 流程图
export const reqYwjsTaskSchedule = (postData) => {
    return requests({ method: 'post', url: '/operation/ywjs/ywjsTaskSchedule', data: `data=${postData}` })
}

// 投诉需求-操作处理
export const reqTsxqDoAction = (postData) => {
    return requests({ method: 'post', url: '/operation/tsxq/tsxqDoAction', data: `data=${postData}` })
}

// ifm复测
export const reqIfmRetestQuery = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmRetestQuery', data: `data=${postData}` })
}
export const reqIfmRetest = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmRetest', data: `data=${postData}` })
}

// ifm转派
export const reqIfmReDiagnoseQuery = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmReDiagnoseQuery', data: `data=${postData}` })
}
export const reqIfmReDiagnoseQueryOther = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmReDiagnoseQueryOther', data: `data=${postData}` })
}
export const reqIfmReDiagnose = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmReDiagnose', data: `data=${postData}` })
}

// ifm初诊
export const reqIfmDiagnoseQuery = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmDiagnoseQuery', data: `data=${postData}` })
}
export const reqIfmDiagnoseQueryOther = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmDiagnoseQueryOther', data: `data=${postData}` })
}
export const reqIfmDiagnose = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/ifmDiagnose', data: `data=${postData}` })
}

// 解绑
export const reqAdslNoUnbinding = (postData) => {
    return requests({ method: 'post', url: '/operation/ifm/adslNoUnbinding', data: `data=${postData}` })
}

// 基站-数据制作
export const reqIdmCoreMakeData = (postData) => {
    return requests({ method: 'post', url: '/operation/idm/idmCoreMakeData', data: `data=${postData}` })
}
// 数据制作-指令编排
export const reqIdmInstrustArrange = (postData) => {
    return requests({ method: 'post', url: '/operation/idm/idmInstrustArrange', data: `data=${postData}` })
}
// 数据制作-指令下发
export const reqIdmInstrustIssue = (postData) => {
    return requests({ method: 'post', url: '/operation/idm/idmInstrustIssue', data: `data=${postData}` })
}
