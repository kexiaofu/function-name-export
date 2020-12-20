### 使用方式
```javascript 
const getFunctionAggregation = require('function-name-export');

const content = 'const fn = () => {}';

let result = getFunctionAggregation(content);

```

### 支持的函数声明
```javascript
  // fn
  const fn = () => {};

  // fnA
  function fnA() {}

  // fnB
  const fnB = function () {}

  // fnD 
  const fnC = function fnD() {}

  class A {
    hello = function() {}

    arrow = () => {}

    render() {}
  }
  
```

### 支持的检测函数执行方式/函数作为值的方式
```jsx
  // js
  fn();

  await fn();

  () => fn();

  this.fn();

  const a = fn();

  return fn;

  return [fn];

  return {fn};

  out(fn);

  out([fn]);

  out({fn});

  const obj = {
    hello: fn
  }

  const arr = [fn];

  // jsx
  onClick={fn}

  onClick={() => fn()}

  onClick={fn.bind(null, 123)}

  onClick={this.fn}

  <div onClick={b}>
    {arr.map(item => fn(item))}
  </div>

```

### Feature
#### 支持的文件类型

- [x] 支持 JavaScript
- [x] 支持 TypeScript
- [x] 支持 Jsx
- [ ] 支持 Vue

#### 优化
- [x] 抽离 visitor
- [x] 采用 event 采集 AST 识别后结果
- [x] 考虑 try catch 情况
- [x] 函数调用未考虑 react 组件
- [x] 检测函数调用中传入函数的场景
- [x] 检测 return 一个函数的方式
- [x] 检测数组/对象中赋值右侧是函数的方式
- [x] 支持 jsx 方法中使用 this.fn

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