/*
* 修改console.log方法，可以直接打印Proxy 的 Tagger 对象，而不用一级级展开
* */

// 给 Proxy 对象添加 instanceof 关键字的支持 ↓↓↓
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakSet
const proxyInstances = new WeakSet()
const OriginalProxy = window.Proxy
window.Proxy = new Proxy(Proxy, {
    construct(target, args) {
        const newProxy = new OriginalProxy(...args)
        proxyInstances.add(newProxy)
        return newProxy
    },
    get(obj, prop) {
        // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance
        if (prop === Symbol.hasInstance) {
            return instance => proxyInstances.has(instance)
        }
        // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/get
        return Reflect.get(...arguments)
    }
})
// 给 Proxy 对象添加 instanceof  关键字的支持 ↑↑↑

// 深克隆
function clone(obj, _refs = new WeakSet()) {
    if (obj === null || obj === undefined) return null
    if (typeof obj !== 'object') return obj
    if (obj.constructor === Date) return new Date(obj)
    if (obj.constructor === RegExp) return new RegExp(obj)
    const newObj = new obj.constructor() //保持继承的原型
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const val = obj[key]
            if (typeof val === 'object' && !_refs.has(val)) {
                newObj[key] = clone(val)
            } else {
                newObj[key] = val
            }
        }
    }
    return newObj
}


// 修改 log 方法
const log = console.log
console.log = function(...arr) {
    const newArr = arr.map(i => i instanceof Proxy ? clone(i) : i)
    console.group(...newArr)
    // console.groupEnd(...newArr)
    // log(...newArr)
    // 省事的打印↓↓↓
    // console.trace(...newArr)
    const stack = new Error().stack || ''
    // log(stack)
    // const stackArr = stack.split('at')
    const stackArr = stack.match(/\.\/.*[^)\s]/g)

    log(stackArr)
    // const re = /\.\/.*[^)\s]/g;;
    // const str1 = 'at  eval (webpack-internal:///./src/main.js:107:9)';
    // let array1;
    // console.log(re.exec(str1))

    // stackArr[0] = stackArr[0].replace('Error', 'Console')

    // 直接打印stack，但是会有一个Error 的提示 ↓↓↓
    // stackArr.splice(1, 1)
    // stackArr.splice(0, 2)
    // log(stackArr.join('at'))

    // 只打印发起调用的那一行↓↓↓
    // log('at ' + stackArr[2])
    console.groupEnd()
}

