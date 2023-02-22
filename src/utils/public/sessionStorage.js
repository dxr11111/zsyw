// const key = 'loginInfo'

// 设置 
export const setItem = (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value))
}

// 获取
export const getItem = (key) => JSON.parse(sessionStorage.getItem(key))

// 删除
export const removeItem = (key) => {
    sessionStorage.removeItem(key)
}