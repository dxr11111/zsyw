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
    });
    return sysIds
}