import { listenProxy, unListenProxy, clone, getOrg } from "./until";
let config = {
    key: 'log', // any String
    type: 'trace', // 'trace' | 'error' | 'any String'
    cloneProxy: getOrg
}
let Vue = {}
export default function (obj = {}, vue) {
    Vue = vue || {}
    config = { ...config, ...obj }
    if (obj.copy === 'clone') {
        config.cloneProxy = clone
    }
    listenLog(config)
}

// ----------------------------------------
const { groupCollapsed, groupEnd, trace, log } = console

// const type = 'trace' | 'error' | ''
function listenLog() {
    const isRef = Vue.isRef || (obj => {
        return typeof obj === 'object' && !!obj.constructor && obj.constructor.name === 'RefImpl'
    })
    const unref = Vue.unref || (obj => obj.value)
    const { key, type, cloneProxy } = config

    if (!key) {
        console.error('Missing required parameter: key')
    }
    listenProxy() // 为 new Proxy 对象添加 `instanceof` 支持
    console[key] = function (...arr) {
        const newArr = arr.map(i => {
            if (isRef(i)) {
                return unref(i)
            } else if (i instanceof Proxy) {
                return cloneProxy(i)
            } else {
                return i
            }
        })
        groupCollapsed(...newArr)

        // 以 trace
        if (type === 'trace') {
            // trace(...newArr)
            log('第二行即为调用者所在的文件位置')
            trace('The second line is the file location of the caller')
            groupEnd()
            return
        }
        let stack = new Error().stack || ''

        // stack = stack.replace('Error', 'Log')
        if (type === 'error') {
            log('%c这不是一个错误，请点击第二行的"at"，跳转到对应的文件', 'color: #008000')
            log('%cThis is not an error. Please click "at" in the second line to jump to the corresponding file', 'color: #008000')
            log(stack)
            groupEnd()
            return;
        }

        // 简单输入模式，控制台看起来是简单了，却失去了点击链接直接跳转到对应文件的功能
        const stackArr = stack.match(/at.*\s/g) || []
        log(stackArr[1])
        groupEnd()
    }
}