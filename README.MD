# console-proxy-obj

1. 在控制台中打印Proxy对象时，直接打印源对象。
2. 对`Vue3`的`ref`对象做特殊支持，直接打印出值。
3. 打印时，输出调用的文件及行号

```
1. When printing proxy objects in the console, print the source objects directly.
2. Provide special support for the 'ref' object of 'Vue3', and print the value directly.
3. When printing, output the called file and line number
```

## 参数说明 Parameter Description

### `config.key` 

`console`对象上绑定的键，最后执行用的，可以是`console`原有`key`，也可以是自定义的，默认是 `log`

The key bound to the `console` . It can be the original key of the console or the user-defined key. The default is `log`

### `config.type`

因为这个库没有做到直接修改调用者的行号，所以退而求其次，以三种方式曲线打印对应所在的位置：
1. `simple` 默认值，把new Error().stack 切割，并打印调用者所在的文件以及行号。
2. `trace` 以console.trace打印行号。
3. `error` 以new Error 的方式打印行号

Because this library does not directly modify the caller's line number, the next best thing is to print the corresponding position in three ways:
1. 'simple', The default,  replace the new Error() Stack cuts and prints the file and line number of the caller.
2. 'trace', is to print the line number in console.trace.
3. 'error', Print line number in the way of new error

### config.copy
打印Proxy对象的方式有两种方案：
1. `copy` 默认, 深克隆Proxy对象，有一个问题，如果proxy对象中有些键不能遍历，就打印不出来
2. `origin` 直接打印源对象。但很多时候，Proxy 监听的对象和源对象没有对应关系。如：const myProxy = new Proxy({}, {get: () => 1})。并且，对于深层次对象，可能不会完全展开。

两种方案都有弊端，您可根据自己的使用场景，使用一个不经常出错的方式。如果必须要求完全正确，那请换一种打印方式。比如，这个库监听的是console.log，那么您可以使用console.info

1. By default, 'copy' deeply clones the proxy object. There is a problem. If some keys in the proxy object cannot be traversed, they cannot be printed
2. 'origin' Print the source object directly. But in many cases, the objects that the proxy listens to have no correspondence with the source objects. For example, const myProxy=new Proxy ({}, {get: ()=>1}). Also, deep level objects may not be fully expanded.

Both schemes have disadvantages. you can use a method that does not often make mistakes according to their own use scenarios. If it must be completely correct, please change the printing method. For example, if the library listens to console.log, you can use console.info

### vue
因为这个库想尽可能轻便，并没有直接引用vue，以`obj.constructor.name === 'RefImpl'`的方式判断的是否是vue的ref对象。
如果担心这里出错，可以传入业务活动中的vue对象，供我们使用

Because this library wants to be as portable as possible, it does not directly reference vue, and uses' obj. debugger The method of name==='RefImpl '' determines whether it is the ref object of vue.
If you are worried about an error here, you can pass in the vue object in the business activity. Let's use


Both schemes have disadvantages. Users can use a method that does not often make mistakes according to their own use scenarios. If it must be completely correct, please change the printing method. For example, if the library listens to console.log, you can use console.info

## Example
1. 
```js
// 在入口文件(In the entry file) main.js
import { ref, reactive } from 'vue'
import logProxy from 'console-proxy-obj'

logProxy() // === logProxy({key: 'log', type: 'simple', copy: 'clone'})

console.log(ref(0))
console.log(reactive({
    a: 123
}))
```
![console-proxy-ref3.png](https://raw.githubusercontent.com/M76chao/file/main/console-proxy-ref/console-proxy-ref3.png)



```js
// 在入口文件(In the entry file) main.js
import { ref, reactive } from 'vue'
import { ref, reactive, isRef, unref } from 'vue'
import logProxy from 'console-proxy-obj'
logProxy({ key: 'info', type: 'error', copy: 'clone' }, {isRef, unref}) // begin

console.info(ref(0))
console.info(reactive({
    a: 123
}))
```
![console-proxy-ref2.png](https://raw.githubusercontent.com/M76chao/file/main/console-proxy-ref/console-proxy-ref2.png)

```js
// 在入口文件(In the entry file) main.js
import { ref, reactive } from 'vue'
import logProxy from 'console-proxy-obj'
logProxy({ key: 'anyKey-xxx', type: 'trace' }) // begin

console['anyKey-xxx'](ref(0))
console['anyKey-xxx'](reactive({
    a: 123
}))
```
![console-proxy-ref1.png](https://raw.githubusercontent.com/M76chao/file/main/console-proxy-ref/console-proxy-ref1.png)