import requests from "./request";
// getOssWebUrl来获取后台地址
export const reqGetOssWebUrl = (postData) => {
  return requests({
    method: "post",
    url: "/getOssWebUrl",
    data: `data=${postData}`,
  });
};

// 公告展示
export const reqQueryClientNotice = (postData) => {
  return requests({
    method: "post",
    url: "/queryClientNotice",
    data: `data=${postData}`,
  });
};

// 我的 检查更新
export const reqCheckVersion = (postData) => {
  return requests({
    method: "post",
    url: "/checkVersion",
    data: `data=${postData}`,
  });
};

// 我的 修改手机号
export const GetPhoneNumberApi = (postData) => {
  return requests({
    method: "post",
    url: "/operation/ifm/ifmChangeMobileNumQuery",
    data: `data=${postData}`,
  });
};
export const UpdatPhoneNumberApi = (postData) => {
  return requests({
    method: "post",
    url: "/operation/ifm/ifmChangeMobileNum",
    data: `data=${postData}`,
  });
};

// 我的 消息推送
export const GetPushStatusApi = (postData) => {
  return requests({
    method: "post",
    url: "/setPushStatus",
    data: `data=${postData}`,
  });
};

// 我的 意见反馈
export const SendFeedBackApi = (postData) => {
  return requests({
    method: "post",
    url: "/feedBack",
    data: `data=${postData}`,
  });
};


// 我的 我的权限
export const GetMyPermissionApi = (postData) => {
  return requests({
    method: "post",
    url: "/myPermission",
    data: `data=${postData}`,
  });
};

// 我的 修改密码
export const ChangePassApi = (postData) => {
  return requests({
    method: "post",
    url: "/changePassword",
    data: `data=${postData}`,
  });
};

// 我的 退出登录
export const LogoutApi = (postData) => {
  return requests({
    method: "post",
    url: "/logout",
    data: `data=${postData}`,
  });
};

// 工作台
// 根据权限获取列表信息tab栏
export const reqBillListTab = (postData) => {
  return requests({
    method: "post",
    url: "/homeSysInfo",
    data: `data=${postData}`,
  });
};
// 任务看板数
export const reqTaskSum = (postData) => {
  return requests({ method: 'post', url: '/taskSum', data: `data=${postData}` })
}
// 工单看板数
export const reqSheetReportSum = (postData) => {
  // return requests({ method: 'post', url: '/list/sheetReportSum', data: `data=${postData}` })
  return requests({ method: 'post', url: '/list/sheetKanBan', data: `data=${postData}` })
}

// 多功能查询
export const multiFunction = (postData) => {
  return requests({
    method: "post",
    url: "/multiFunctionQuery",
    data: `data=${postData}`,
  });
};

// 首页个人工作台看板数量
export const reqgetTaskBoard = (postData) => {
  return requests({
    method: "post",
    // url: "/list/homeUniTaskSum",
    url: "/list/homeUniTaskSumWeb",
    data: `data=${postData}`,
  });
};

// 首页根据权限获取工具
export const reqgetTools = (postData) => {
  return requests({
    method: "post",
    url: "/homeSysToolsInfo",
    data: `data=${postData}`,
  });
};


// 首页未读消息
export const reqgetUnReadMessageNum = (postData) => {
  return requests({
    method: "post",
    url: "/homeMsgList",
    data: `data=${postData}`,
  });
};



// 获取列表信息
export const reqgetOrderList = (postData) => {
  return requests({
    method: "post",
    url: "/list/list",
    data: `data=${postData}`,
  });
};

// 首页消息列表
export const reqgetMessageList = (postData) => {
  return requests({
    method: "post",
    url: "/msgList",
    data: `data=${postData}`,
  });
};

// 首页消息详情
export const reqgetMessageContent = (postData) => {
  return requests({
    method: "post",
    url: "/msgContent",
    data: `data=${postData}`,
  });
};

// 登录页
// 登录接口
export const reqgetLogin = (postData) => {
  return requests({
    method: "post",
    url: "/loginUni",
    data: `data=${postData}`,
  });
};

// 退出登录
export const reqgetLogOut = () => {
  return requests({ method: "post", url: "/logout", data: `data={}` });
};

// 密码重置
export const reqgetpwdReset = (postData) => {
  return requests({
    method: "post",
    url: "/pwdProtected",
    data: `data=${postData}`,
  });
};

// 工单列表更多按钮
export const reqIfmShowButton = (postData) => {
  return requests({
    method: "post",
    url: "/operation/ifm/ifmShowButton",
    data: `data=${postData}`,
  });
};
// 列表
export const reqgetHomeList = (postData) => {
  return requests({
    method: "post",
    url: "/list/list",
    data: `data=${postData}`,
  });
};
// 建设单列表
export const reqgetYwjsList = (postData) => {
  return requests({
    method: "post",
    url: "/operation/ywjs/ywjsList",
    data: `data=${postData}`,
  });
};
// 投诉需求-列表
export const reqTsxqList = (postData) => {
  return requests({
    method: "post",
    url: "/operation/tsxq/tsxqList",
    data: `data=${postData}`,
  });
};

// 建设单列表详情
export const reqgetYwjsDetail = (postData) => {
  return requests({
    method: "post",
    url: "/operation/ywjs/ywjsDetail",
    data: `data=${postData}`,
  });
};
// 投诉需求-详情
export const reqTsxqDetail = (postData) => {
  return requests({
    method: "post",
    url: "/operation/tsxq/tsxqDetail",
    data: `data=${postData}`,
  });
};
// 列表详情
export const reqgetListDetail = (postData) => {
  console.log("列表详情传参", postData);
  return requests({
    method: "post",
    url: "/sheetShowDetail",
    data: `data=${postData}`,
  });
};

// 快速查询
export const reqFastQuery = (postData) => {
  return requests({
    method: "post",
    url: "/fastQuery",
    data: `data=${postData}`,
  });
};

// 工单详情
// 列表看板数
export const reqgetWorkOrderBoardSum = (postData) => {
  return requests({
    method: "post",
    url: "/list/sheetReportSum",
    data: `data=${postData}`,
  });
};

// 根据权限获取列表信息tab栏
export const reqgetWorkOrderListTab = (postData) => {
  return requests({
    method: "post",
    url: "/homeSysInfo",
    data: `data=${postData}`,
  });
};

// 部门工单选择工作组
export const reqChangeDefaultGroup = (postData) => {
  return requests({
    method: "post",
    url: "/changeDefaultGroup",
    data: `data=${postData}`,
  });
};

// 每日学习
export const reqEveryDayStudy = (postData) => {
  return requests({
    method: "post",
    url: "/everyDayStudy",
    data: `data=${postData}`,
  });
};

// 网络鉴权服务，获取权限
export const reqUniNetLogin = (postData) => {
  return requests({ method: 'post', url: '/uniNetLogin', data: `data=${postData}` })
}
