/* 节流 */
export const throttle = (func, delay) => {
    let time = null;
    return function () {
        let args = Array.from(arguments);
        if (time === null) {
            time = setTimeout(() => {
                func(...args);
                clearTimeout(time);
                time = null;
            }, delay);
        }
    };
}