// 判断url是否能够打开
import $ from "jquery";
import vue from "@/main"
export const judgeUrlError = (url, headName) => {
    $.ajax({
        type: "get",
        cache: false, //true的话会读缓存,第二次的时候得到的是上次访问的结果，而不是重新到服务器获取。false的话会在url后面加一个时间缀，让它跑到服务器获取结果。cache只有GET方式的时候有效。
        url,
        dataType: "jsonp", //跨域采用jsonp方式
        processData: false, //processData 默认为true，当设置为true的时候,jquery ajax 提交的时候不会序列化 data，而是直接使用data，false会序列化。
        timeout: 3000, //设置超时 ‘0’：为永不超时，当请求超时后会进入error，可以在error中做超时的处理。
        complete: function (data) {
            //data.status 请求url地址的状态码，以此来判断url是否有效可以访问。
            if (data.status == 200) {
                console.log("访问成功");
                return true
            } else {
            }
        },
        error: function (error) {
            if (error.status !== 200) {
                console.log("访问失败", error.status, error);
                // 进入指定错误页面
                vue.$router.push({
                    name: 'UrlError',
                    query: {
                        headName,
                        url
                    }
                })
                return false
            }
        },
    });
}
