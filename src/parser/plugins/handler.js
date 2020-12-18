const FunctionDeclarationHandler = require('./FunctionDeclarationHandler');
const VariableDeclarationHandler = require('./VariableDeclarationHandler');
const ExpressionStatementHandler = require('./ExpressionStatementHandler');
const ClassDeclarationHandler = require('./ClassDeclarationHandler');
const ClassMethodHandler = require('./ClassMethodHandler');
const ClassPropertyHandler = require('./ClassPropertyHandler');

const handleFunction = {
  'VariableDeclaration': VariableDeclarationHandler,
  'ExpressionStatement': ExpressionStatementHandler,
  'FunctionDeclaration': FunctionDeclarationHandler,
  'ClassDeclaration': ClassDeclarationHandler,
  'ClassMethod': ClassMethodHandler,
  'ClassProperty': ClassPropertyHandler
}

const handleFunctionKey = Object.keys(handleFunction);

// 该方法只用于检测函数，非函数的节点将不会执行 handleFunction 里的方法
function handler(path, noCheckType=true) {
  // 当在 BlockStatementBody 内执行方法时，将不会检测节点是否是目标集合之一
  if (noCheckType || handleFunctionKey.indexOf(path.node.type) > -1) {
    const node = path.node || path;
    if (JSON.stringify(node).indexOf('BlockStatement') > -1) {
      // console.log(node.type, JSON.stringify(node).length)
      const fn = handleFunction[node.type];
      if (fn) fn(path);
    }
  }
}

module.exports = handler;