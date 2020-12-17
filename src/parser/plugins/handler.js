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

function handler(path, noCheckType=true) {
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