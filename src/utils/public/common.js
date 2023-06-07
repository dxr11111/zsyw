import that from '@/main'

// 图片旋转处理 -> base64
export const rotateBase64Img = (src, edg, callback) => {
    try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        let imgW = 0 // 图片宽度
        let imgH = 0 // 图片高度
        let size = 0 // canvas初始大小

        if (edg % 90 !== 0) {
            throw new Error('旋转角度必须是90的倍数!')
        }


        (edg < 0) && (edg = (edg % 360) + 360)
        const quadrant = (edg / 90) % 4 // 旋转象限
        const cutCoor = { sx: 0, sy: 0, ex: 0, ey: 0 } // 裁剪坐标

        const image = new Image()
        image.src = src
        image.crossOrigin = 'anonymous'

        image.onload = function () {
            imgW = image.width
            imgH = image.height
            size = imgW > imgH ? imgW : imgH

            canvas.width = size * 2
            canvas.height = size * 2
            switch (quadrant) {
                case 0:
                    cutCoor.sx = size
                    cutCoor.sy = size
                    cutCoor.ex = size + imgW
                    cutCoor.ey = size + imgH
                    break
                case 1:
                    cutCoor.sx = size - imgH
                    cutCoor.sy = size
                    cutCoor.ex = size
                    cutCoor.ey = size + imgW
                    break
                case 2:
                    cutCoor.sx = size - imgW
                    cutCoor.sy = size - imgH
                    cutCoor.ex = size
                    cutCoor.ey = size
                    break
                case 3:
                    cutCoor.sx = size
                    cutCoor.sy = size - imgW
                    cutCoor.ex = size + imgH
                    cutCoor.ey = size + imgW
                    break
            }

            ctx.translate(size, size)
            ctx.rotate(edg * Math.PI / 180)
            ctx.drawImage(image, 0, 0)

            const imgData = ctx.getImageData(cutCoor.sx, cutCoor.sy, cutCoor.ex, cutCoor.ey)
            if (quadrant % 2 === 0) {
                canvas.width = imgW
                canvas.height = imgH
            } else {
                canvas.width = imgH
                canvas.height = imgW
            }
            ctx.putImageData(imgData, 0, 0)

            if (typeof callback === 'function') {
                callback(canvas.toDataURL('image/png', 0.7))
            }
        }
    } catch (e) {
        console.log(e)
    }
}

//格式化时间
export const formatTime = function (dat) {
    //获取年月日，时间
    var year = dat.getFullYear()
    var mon = (dat.getMonth() + 1) < 10 ? "0" + (dat.getMonth() + 1) : dat.getMonth() + 1
    var data = dat.getDate() < 10 ? "0" + (dat.getDate()) : dat.getDate()
    var hour = dat.getHours() < 10 ? "0" + (dat.getHours()) : dat.getHours()
    var min = dat.getMinutes() < 10 ? "0" + (dat.getMinutes()) : dat.getMinutes()
    var seon = dat.getSeconds() < 10 ? "0" + (dat.getSeconds()) : dat.getSeconds()

    var newDate = year + "-" + mon + "-" + data + " " + hour + ":" + min + ":" + seon
    return newDate
}
// 格式化日期
export const formatDate = function (dat) {
    //获取年月日
    var year = dat.getFullYear()
    var mon = (dat.getMonth() + 1) < 10 ? "0" + (dat.getMonth() + 1) : dat.getMonth() + 1
    var data = dat.getDate() < 10 ? "0" + (dat.getDate()) : dat.getDate()
    var newDate = year + "-" + mon + "-" + data
    return newDate
}

// 我的权限sysId对应的种类
export const sysIdList = [
    {
        key: 1,
        value: '修机'
    },
    {
        key: 2,
        value: '装机'
    },
    {
        key: 3,
        value: 'IFM工单'
    },
    {
        key: 4,
        value: 'IFM任务'
    },
    // {
    //     key: 5,
    //     value: '楼宇'
    // },
    // {
    //     key: 6,
    //     value: '管控'
    // },
    {
        key: 7,
        value: '局内工单'
    },
    {
        key: 8,
        value: 'jndd任务'
    },
    {
        key: 9,
        value: '基站'
    },
    {
        key: 10,
        value: '新装机'
    },
    {
        key: 11,
        value: '建设单'
    },
    // {
    //     key: 102,
    //     value: '资源核查'
    // },
    // {
    //     key: 103,
    //     value: '网络优化支撑'
    // },
    // {
    //     key: 104,
    //     value: '基站运维感知'
    // },
    // {
    //     key: 105,
    //     value: '小小智'
    // },
    // {
    //     key: 106,
    //     value: '冬奥资源'
    // },
    // {
    //     key: 107,
    //     value: '冬奥知识库'
    // },
    // {
    //     key: 108,
    //     value: '语音自服务'
    // },
    // {
    //     key: 109,
    //     value: '冬奥互联网账号认证查询工具'
    // },
    // {
    //     key: 110,
    //     value: '重保应急'
    // },
]

// 获取用户userIds里的sysId
export const getSysIds = (userIds) => {
    let sysIds = []
    userIds.forEach((item) => {
        sysIds.push(item.sysId)
    })
    return sysIds
}

// 获取用户userIds里的hasTaskList=1时的sysId
export const getHasTaskListSysId = (userIds) => {
    let sysIds = []
    userIds.forEach((item) => {
        if (item.hasTaskList == 1) sysIds.push(item.sysId)
    })
    return sysIds
}

// 判断用户是否有任务权限和工单权限
export const judgeTaskSheetPermissions = (userIds) => {
    console.log("判断用户是否有任务权限和工单权限");
    // 重置一下权限，防止从有权限的账后退出登录后影响没有权限的账号
    that.$store.commit("workBench/changeTaskSheetPermissions", {
        hasTaskList: 0,
        hasSheetList: 0,
    });
    // 只要有一个item hasSheetList=1就表示有工单权限，hasTaskList=1表示有任务权限
    for (let item of userIds) {
        if (item.hasTaskList == 1) {
            that.$store.commit("workBench/changeTaskSheetPermissions", {
                hasTaskList: 1,
            });
        }
        if (item.hasSheetList == 1) {
            that.$store.commit("workBench/changeTaskSheetPermissions", {
                hasSheetList: 1,
            });
        }
        if (
            that.$store.state.workBench.taskSheetPermissions.hasSheetList &&
            that.$store.state.workBench.taskSheetPermissions.hasTaskList
        ) {
            break;
        }
    }
}

// 根据需求压缩图片
export const getCompressFile = function (file, isHalf) {
    console.log(file);
    return new Promise((resolve, reject) => {
        console.log('压缩前文件大小', file.size);
        console.log('压缩前文件', file);
        // 创建一个读取文件的对象
        let reader = new FileReader()
        // 读取图像文件
        reader.readAsDataURL(file)
        reader.onload = function (e) {
            let image = new Image()     //新建一个img标签（不嵌入DOM节点，仅做canvas操作)
            image.src = e.target.result    //让该标签加载base64格式的原图
            image.onload = function () {    //图片加载完毕后再通过canvas压缩图片，否则图片还没加载完就压缩，结果图片是全黑的
                let canvas = document.createElement('canvas'), //创建一个canvas元素
                    context = canvas.getContext('2d'),    //context相当于画笔，里面有各种可以进行绘图的API
                    imageWidth = isHalf ? image.width / 2 : image.width * (0.25),    //压缩后图片的宽度
                    imageHeight = isHalf ? image.height / 2 : image.height * (0.25),    //压缩后图片的高度
                    data = ''    //存储压缩后的图片
                canvas.width = imageWidth    //设置绘图的宽度
                canvas.height = imageHeight    //设置绘图的高度

                //使用drawImage重新设置img标签中的图片大小，实现压缩
                context.drawImage(image, 0, 0, imageWidth, imageHeight)
                //使用toDataURL将canvas上的图片转换为base64格式
                data = canvas.toDataURL('image/jpeg')
                canvas.toBlob(function (blob) {
                    const f = new File([blob], file.name, { type: 'image/jpeg' })
                    console.log('图片压缩', f)
                    that.$toast('压缩后文件大小' + f.size)
                    resolve(f)
                }, 'image/jpeg')
            }
        }
    })
}