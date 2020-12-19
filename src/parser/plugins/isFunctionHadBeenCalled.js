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

// for CallExpression and JSXExpressionContainer
function isFunctionHadBeenCalled(path) {
  let node = path.node || path;
  let result = [];
  // console.log(node.callee);
  try {
    // console.log(node.type, '----> isFunctionHadBeenCalled')
    // 1. for fn() / await fn() / () => fn()
    if (
      node.type === 'CallExpression' &&
      node.callee.type === 'Identifier'
    ) {
      setResult(node.callee, result);
    }

    // 2. for jsx: onClick={a.bind(this, 1)} 
    //    for: this.hello()
    // onClick={a.bind(this, fn)} fn 函数作为参数暂时检测不了
    // a.b() 暂不支持
    // 因为一般 a = {b: fn} b 暂时检测不了是函数
    if (
      node.type === 'CallExpression' &&
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

    // 3. for jsx: onClick={a}
    if (
      node.type === 'JSXExpressionContainer' &&
      node.expression &&
      node.expression.type === 'Identifier'
    ) {
      setResult(node.expression, result);
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
