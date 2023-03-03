import _this from '@/main'
// 接入联通网络应用组件方法 --- 0调用本地；1调用ios，2调用Android
export const unicomFunc = function () {
  var flag = -1
  if (_this.$store.state.projectFlag == 1) {
    flag = 0
  } else {
    const UA = window.navigator.userAgent.toLowerCase();
    // console.log('UA', UA);
    const isIos = (UA && /iphone|ipad|ipod|ios/.test(UA)) || false;
    console.log('是否是ios', isIos);
    if (isIos) {
      flag = 1
    } else {
      flag = 2
    }
  }
  return flag
}