// 判断设备机型
import vue from '@/main'

export const judgeDeviceType = () => {
    if (window.plus) {
        console.log("开始读取设备信息");
        console.log("系统的名称：", plus.os.name); // Android iOS
        console.log("系统的版本信息：", plus.os.version);

        //imei 设备的国际移动设备身份码
        // console.log("设备身份码:" + plus.device.imei);

        //model 获取设备的型号信息，如果设备不支持则返回空字符串。
        console.log("设备型号信息:" + plus.device.model);

        //vendor 获取设备的生产厂商信息，如果设备不支持则返回空字符串。
        console.log("设备厂商信息:" + plus.device.vendor);

        if (plus.os.name === "iOS") {
            // ios
            console.log('当前设备标识为ios')

            vue.$store.commit("changeClientId", 10);
            vue.$store.commit("changeMobileType", 2);

        } else if (plus.os.name === "Android") {
            // android
            vue.$store.commit("changeClientId", 9);
            vue.$store.commit("changeMobileType", 1);

        }
    }


    // 判断是否增加头部高度
    // 判断当前所在的项目是建维优还是联通网络
    if (vue.$store.state.projectFlag == 1) {
        // 建维优
        // 判断当前是ios/android/web
        if (vue.$store.state.clientId == 11) {
            // web端
            vue.$store.commit("changeAddHead", false);
        } else {
            // 移动端
            vue.$store.commit("changeAddHead", true);
        }
    } else {
        // 联通网络
        vue.$store.commit("changeAddHead", false);
    }

    /* //getInfo: 获取设备信息
    plus.device.getInfo({
        success: function (e) {
            console.log("getDeviceInfo success: " + JSON.stringify(e));
        },
        fail: function (e) {
            console.log("getDeviceInfo failed: " + JSON.stringify(e));
        },
    }); */
}