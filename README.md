### Feature
#### 支持的文件类型

- [x] 支持 JavaScript
- [x] 支持 TypeScript
- [x] 支持 Jsx
- [ ] 支持 Tsx
- [ ] 支持 Vue

#### 优化
- [x] 抽离 visitor
- [x] 采用 event 采集 AST 识别后结果
- [x] 考虑 try catch 情况
- [x] 函数调用未考虑 react 组件
- [ ] 检测函数调用中传入函数的场景

### Tips
**如果是表达式/赋值表达式右侧是方法的话，表达式内/方法内，不要深嵌套，如：**

```javascript
arr.map(item => {
  function inner () {
    const a = fn();
  }
})

const example = function () {
  function inner () {
    const a = fn();
  }
}
```

**！！！traverse遍历时，节点对应的方法不能更改 path （不能自主循环调用对应的方法处理），否则会中断traverse对AST的遍历**
如：`VariableDeclarator` 节点对应的处理方法可能考虑到这种情况：

```javascript
var a = function() {
  var b = function () {}
  b();
}
```
在赋值表达式右侧的方法体内，不要想着自己去调用方法传入 Node / Path 去自己检测/处理。这将会打断 traverse 对 AST 的遍历，应该是这种操作更改了 Node / Path 的 parent 节点，导致 AST 的遍历无法进行。