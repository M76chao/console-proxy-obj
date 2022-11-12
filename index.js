import { listenProxy, unListenProxy, clone } from "./until";
import * as Vue from 'vue'
let isRef = () => false
let unref = () => false

if (Vue) {
    isRef = Vue.isRef
    unref = Vue.unref
}

console.log(Vue);
let config = {
    key: 'log', // any String
    type: 'trace', // 'trace' | 'error' | ''
    unListenLog,
    listenLog
}
export default function (obj = {}) {
    config = {...config, ...obj}
    listenLog(config)
    return config
}

// ----------------------------------------



let oldVal = null
let oldKey = null
const groupCollapsed = console.groupCollapsed
const groupEnd = console.groupEnd
const trace = console.trace
const log = console.log

// const type = 'trace' | 'error' | ''
function listenLog({key, type}) {
    key = key || config.key
    config.key = key
    type = type || config.type
    config.type = type

    if (!key) {
        console.error('Missing required parameter: key')
    }
    if (oldVal) {
        unListenLog()
    };
    listenProxy() // 为 new Proxy 对象添加 `instanceof` 支持
    oldKey = key
    oldVal = console[key]
    console[key] = function (...arr) {
        const newArr = arr.map(i => {
            if (isRef(i)) {
                return unref(i)
            } else if (i instanceof Proxy) {
                return clone(i)
            } else {
                return i
            }
        })
        groupCollapsed(...newArr)
        if (type === 'trace') {
            // trace(...newArr)
            trace('第二行即为调用者所在的文件位置')
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

        const stackArr = stack.match(/at.*\s/g) || []
        log(stackArr[1])
        groupEnd()
        return;
    }
}
function unListenLog(clear) {
    console[oldKey] = oldVal
    oldKey = oldVal = null
    if (clear) {
        unListenProxy()
        console.log('The monitoring of Proxy has been removed')
    }
    return true
}



