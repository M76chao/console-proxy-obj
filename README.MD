# console-proxy-obj

1. 在控制台中打印Proxy对象时，直接打印源对象。
2. 对`Vue3`的`ref`对象做特殊支持，直接打印出值。
3. 打印时，输出调用的文件及行号

```
1. When printing proxy objects in the console, print the source objects directly.
2. Provide special support for the 'ref' object of 'Vue3', and print the value directly.
3. When printing, output the called file and line number
```

## Example
1. 
```js
// 在入口文件(In the entry file) main.js
import { ref, reactive } from 'vue'
import logProxy from 'console-proxy-obj'
logProxy() // begin === logProxy({key: 'log', type: 'trace'})

console.log(ref(0))
console.log(reactive({
    a: 123
}))
```
![console-proxy-ref1.png](https://raw.githubusercontent.com/M76chao/file/main/console-proxy-ref/console-proxy-ref1.png)



```js
// 在入口文件(In the entry file) main.js
import { ref, reactive } from 'vue'
import logProxy from 'console-proxy-obj'
logProxy({ key: 'info', type: 'error' }) // begin

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
logProxy({ key: 'anyKey-xxx', type: 'any string not `error` and `trace`' }) // begin

console['anyKey-xxx'](ref(0))
console['anyKey-xxx'](reactive({
    a: 123
}))
```
![console-proxy-ref3.png](https://raw.githubusercontent.com/M76chao/file/main/console-proxy-ref/console-proxy-ref3.png)