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

const { log } = console

// 深克隆
export function getOrg(obj, _refs = new WeakMap()) {
    console.info('1')
    const org = proxyMap.get(obj)
    if (!org) return org
    const newObj = new org.constructor()
    _refs.set(org, newObj)
    if (org && typeof org === 'object') {
        for (const key in org) {
            const val = org[key]
            if (key === 'ss') {
                debugger
            }
            if (val instanceof Proxy) {
                if (_refs.has(val)) {
                    log('出现递归调用，如不想展开Proxy内容，请使用copy: "clone"方式')
                    newObj[key] = _refs.get(val)
                } else {
                    newObj[key] = getOrg(val, _refs)
                }
            } else {
                newObj[key] = val
            }
        }
    }
    return newObj
}
export function clone(obj, _refs = new WeakMap()) {
    if (obj === null || obj === undefined) return null
    if (typeof obj !== 'object') return obj
    if (obj.constructor === Date) return new Date(obj)
    if (obj.constructor === RegExp) return new RegExp(obj)
    const newObj = new obj.constructor() //保持继承的原型
    _refs.set(obj, newObj)
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const val = obj[key]
            if (key === 'ss') {
                debugger
            }
            if (typeof val === 'object') {
                if (_refs.has(val)) {
                    newObj[key] = _refs.get(val)
                } else {
                    newObj[key] = clone(val, _refs)
                }
            } else {
                newObj[key] = val
            }
        }
    }
    return newObj
}