// 给 Proxy 对象添加 instanceof 关键字的支持 ↓↓↓
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakSet
export const proxyInstances = new WeakSet()

let OriginalProxy = null
export function listenProxy() {
    if (OriginalProxy) {
        return
    }
    OriginalProxy = window.Proxy
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
}
export function unListenProxy() {
    window.Proxy = OriginalProxy || window.Proxy
}

// 深克隆
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