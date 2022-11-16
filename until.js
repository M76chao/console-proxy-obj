// 给 Proxy 对象添加 instanceof 关键字的支持 ↓↓↓
// 记录用户new Proxy操作的所有对象
// WeakSet，WeakMap，都是弱引用，不干预其他模块的垃圾回收机制
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakSet
export const proxyMap = new WeakMap() // 记录所有源对象

let OriginalProxy = null
export function listenProxy() {
    if (OriginalProxy) { // 防止用户多次调用监听
        return
    }
    OriginalProxy = window.Proxy
    window.Proxy = new Proxy(Proxy, {
        construct(target, args) {
            const newProxy = new OriginalProxy(...args)
            proxyMap.set(newProxy, args[0])
            return newProxy
        },
        get(obj, prop) {
            // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance
            if (prop === Symbol.hasInstance) { // 监控 `instanceof` 关键字
                return instance => proxyMap.has(instance)
            }
            // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/get
            return Reflect.get(...arguments)
        }
    })
}
export function unListenProxy() {
    window.Proxy = OriginalProxy || window.Proxy
}

// 深克隆
export function getOrg(obj) {
    return proxyMap.get(obj)
}
export function clone(obj, _refs = new WeakSet()) {
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