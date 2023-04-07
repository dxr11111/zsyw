import requests from './request'

// 请求基站运维感知url
export const reqQueryUniToken = (postData) => {
  return requests({ method: 'post', url: '/queryUniToken', data: `data=${postData}` })
}
// 获取建设工单报表用户权限 http://132.91.203.143:7143   http://localhost:8080/api/
export const reqgetReportSetting = (loginNo) => {
  // console.log(`data={"loginNo":"${loginNo}"}`)
  return requests({ method: 'post', url: '/charts/ywjs/ywjsQueryRole', data: `data={"loginNo":"${loginNo}"}` })
}
// 获取建设工单报表按钮对应表格数据
export const reqgetReportTable = (postData) => {
  console.log(postData)
  return requests({ method: 'post', url: '/charts/ywjs/ywjsReportForm', data: `data=${postData}` })
}
// 获取优化工单看板用户权限
export const reqgetYhgdSetting = (loginNo) => {
  return requests({ method: 'post', url: '/charts/ifm/ifmYhdUserAuth', data: `data={"loginNo":"${loginNo}"}` })
}
// 获取优化工单看板图表数据
export const reqgetYhgdTable = (postData) => {
  console.log('postData', postData)
  return requests({ method: 'post', url: '/charts/ifm/ifmQueryYhdNetworkInfo', data: `data=${postData}` })
}
// 获取移网考核看板用户权限（分公司，小网格，代维）
export const reqgetYwkhSetting = (loginNo) => {
  return requests({ method: 'post', url: '/charts/ifm/ifmYdUserAuth', data: `data={"loginNo":"${loginNo}"}` })
}
// 请求移网考核看板-分公司数据
export const reqgetYwkhFGS = (postData) => {
  return requests({ method: 'post', url: '/charts/ifm/ifmYdFGSOrXWGNetworkAssess', data: `data=${postData}` })
}
// 请求移网考核看板-日报数据
export const reqgetYwkhDay = (postData) => {
  return requests({ method: 'post', url: '/charts/ifm/ifmYdNetworkAssess', data: `data=${postData}` })
}
// 请求移网考核看板-周报数据
export const reqgetYwkhWeek = (postData) => {
  return requests({ method: 'post', url: '/charts/ifm/ifmYdNetworkAssessWeek', data: `data=${postData}` })
}
// 请求移网考核看板-月报数据
export const reqgetYwkhMonth = (postData) => {
  return requests({ method: 'post', url: '/charts/ifm/ifmYdNetworkAssessMonth', data: `data=${postData}` })
}
// 请求建设工单看板基站，建设数据
export const reqgetWorkBoard = (postData) => {
  console.log(postData)
  return requests({ method: 'post', url: '/charts/ywjs/ywjsOrderCount', data: `data=${postData}` })
}
// 请求建设工单看板时间，完工工单数
export const reqgetWorkBoardNum = (postData) => {
  console.log(postData)
  return requests({ method: 'post', url: '/charts/idm/idmWanGongKanBan', data: `data=${postData}` })
}

// 智家工单看板
export const ZhiJiaKanBanApi = (postData) => {
  return requests({ method: 'post', url: '/charts/zhiJiaSheetKanBan', data: `data=${postData}` })
}

// 故障受理查询
export const IfmBalkQueryApi = (postData) => {
  return requests({ method: 'post', url: '/operation/ifm/ifmBalkQuery', data: `data=${postData}` })
}
// 故障受理
export const IfmBalkAcceptApi = (postData) => {
  return requests({ method: 'post', url: '/operation/ifm/ifmBalkAccept', data: `data=${postData}` })
}

// 终端设备 -- 转让结果
export const InstChangeResultApi = (postData) => {
  return requests({ method: 'post', url: '/operation/instChangeResult', data: `data=${postData}` })
}
// 终端设备 -- 转让申请信息
export const InstChangeApi = (postData) => {
  return requests({ method: 'post', url: '/operation/instChangeQuery', data: `data=${postData}` })
}
// 终端设备 -- 领用记录
export const ReqRecordApi = (postData) => {
  return requests({ method: 'post', url: '/operation/queryInst', data: `data=${postData}` })
}
// 终端设备 -- 领设备
export const ApplyInstApi = (postData) => {
  return requests({ method: 'post', url: '/operation/applyInst', data: `data=${postData}` })
}

// 沃推荐
export const woRecommendApi = (postData) => {
  return requests({ method: 'post', url: '/woRecommend', data: `data=${postData}` })
}

// 支撑申请新增
export const AddSupportRequestApi = (postData) => {
  return requests({ method: 'post', url: '/supportRequestAdd', data: `data=${postData}` })
}
// 支撑申请
export const SupportRequestApi = (postData) => {
  return requests({ method: 'post', url: '/supportRequestQuery', data: `data=${postData}` })
}

// 移动故障受理
export const SaveWirelessApi = (postData) => {
  return requests({ method: 'post', url: '/operation/ifm/ifmSaveWirelessDeviceInfo', data: `data=${postData}` })
}
// 移动故障受理 -- 查询基站信息
export const QueryBaseInfoApi = (postData) => {
  return requests({ method: 'post', url: '/operation/ifm/ifmQueryBaseStationInfo', data: `data=${postData}` })
}

// 工程师值班 -- 查询在岗状态
export const EngineerStatusApi = (postData) => {
  return requests({ method: 'post', url: '/operation/ifm/ifmEngineerZG', data: `data=${postData}` })
}

// 专线路由-- 查询专线号
export const FindSpeclineApi = (postData) => {
  return requests({ method: 'post', url: '/operation/iom/specLineQueryRouteInfo', data: `data=${postData}` })
}

// 工具栏pos绑定列表，搜索
export const reqToolPosList = (postData) => {
  return requests({ method: 'post', url: '/waitPosList', data: `data=${postData}` })
}
// 工具栏pos绑定查设备，pos查询，pos提交
export const reqToolWaitPos = (postData) => {
  return requests({ method: 'post', url: '/waitPos', data: `data=${postData}` })
}

// 漏话回拨-查询
export const reqToolMissBackQuery = (postData) => {
  return requests({ method: 'post', url: '/missBackQuery', data: `data=${postData}` })
}
// 漏话回拨-删除
export const reqToolMissBackDelete = (postData) => {
  return requests({ method: 'post', url: '/missBackDelete', data: `data=${postData}` })
}
// 云入户
export const reqHuJiaoCall = (postData) => {
  return requests({ method: 'post', url: '/huJiaoCall', data: `data=${postData}` })
}

// 查询光纤尾码
export const reqQueryFiber = (postData) => {
  return requests({ method: 'post', url: '/operation/queryFiber', data: `data=${postData}` })
}
// 绑定光纤尾码
export const reqIfmBindingFiber = (postData) => {
  return requests({ method: 'post', url: '/operation/ifm/ifmBindingFiber', data: `data=${postData}` })
}

// 查询光猫绑码
export const reqOpticalBangYardQuery = (postData) => {
  return requests({ method: 'post', url: '/opticalBangYardQuery', data: `data=${postData}` })
}
// 光猫绑码
export const reqOpticalBangYard = (postData) => {
  return requests({ method: 'post', url: '/opticalBangYard', data: `data=${postData}` })
}