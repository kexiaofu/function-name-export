const {
  getLine,
  getName
} = require('../../utils/utils');
const eventEmitter = require('../../utils/event');
const {
  FUNCTION_CALL
} = require('../../utils/eventHandleEnum');

function setResult(node, result) {
  const _result = {
    name: getName(node),
    line: getLine(node)
  }
  if (_result.name && _result.line) {
    result.push(_result);
  }
} 

// 处理 arguments 和 ReturnStatement 场景的数据
function handleData(item, result) {
  if (item && item.type) {

    // 4. for a(fn) / return fn
    if (item.type === 'Identifier') {
      setResult(item, result);
    }

    // 5. for a({fn, b: 123}) / return {fn, b: 123}
    if (item.type === 'ObjectExpression') {
      item.properties.forEach(o => {
        if (o && o.value && o.value.type === 'Identifier') {
          setResult(o.value, result);
        }
      })
    }

    // 6. for a([fn, 123]) / return [fn, 123]
    if (item.type === 'ArrayExpression') {
      item.elements.forEach(a => {
        if (a && a.type === 'Identifier') {
          setResult(a, result);
        }
      })
    }

  }
}

// for CallExpression and JSXExpressionContainer
function isFunctionHadBeenCalled(path) {
  let node = path.node || path;
  let result = [];
  // console.log(node.callee);
  try {
    if (node.type === 'CallExpression') {
      
      // console.log(node.type, '----> isFunctionHadBeenCalled')
      // 1. for fn() / await fn() / () => fn()
      if (node.callee.type === 'Identifier') {
        setResult(node.callee, result);
      }

      // 2. for jsx: onClick={a.bind(this, 1)} 
      //    for: this.hello()
      // onClick={a.bind(this, fn)} fn 函数作为参数暂时检测不了
      // a.b() 暂不支持
      // 因为一般 a = {b: fn} b 暂时检测不了是函数
      if (
        node.callee &&
        node.callee.type === 'MemberExpression'
      ) {
        const object = node.callee.object;
        // a.bind(null, args)
        if (object.type === 'Identifier') {
          setResult(object, result);
        } else if (object.type === 'ThisExpression') {
          // this.hello()
          setResult(node.callee.property, result);
        }
      }

      // for a(arguments)
      if (node.arguments.length > 0) {
        node.arguments.forEach(item => {
          handleData(item, result);
        })
      }
    } 

    // return argument
    if (node.type === 'ReturnStatement') {
      handleData(node.argument, result);
    }

    // 3. for jsx: onClick={a} / onClick={this.hello()}
    if (
      node.type === 'JSXExpressionContainer' &&
      node.expression 
    ) {
      const expression = node.expression;
      // onClick={a}
      if (expression.type === 'Identifier') {
        setResult(expression, result);
      } else if (expression.type === 'MemberExpression') {
        const object = expression.object;
        if (object.type === 'ThisExpression') {
          // onClick={this.hello()}
          setResult(expression.property, result);
        }
      }
    }

    // const a = {fn} || const a = [fn]
    if (
      node.type === 'ObjectExpression' || 
      node.type === 'ArrayExpression'
    ) {
      handleData(node, result);
    }

    if (result.length > 0) {
      result.forEach(item => eventEmitter.emit(FUNCTION_CALL, item));
    }
  } catch (error) {
    console.log('isFunctionHadBeenCalled catch error:');
    console.log(error);
  }
}

module.exports = isFunctionHadBeenCalled;
