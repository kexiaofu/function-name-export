const FunctionDeclarationHandler = require('./FunctionDeclarationHandler');
const VariableDeclarationHandler = require('./VariableDeclarationHandler');
const ExpressionStatementHandler = require('./ExpressionStatementHandler');
const ClassDeclarationHandler = require('./ClassDeclarationHandler');
const ClassMethodHandler = require('./ClassMethodHandler');
const ClassPropertyHandler = require('./ClassPropertyHandler');
const isFunctionHadBeenCalled = require('./isFunctionHadBeenCalled')

const handleFunction = {
  'VariableDeclarator': [VariableDeclarationHandler],
  'ExpressionStatement': ExpressionStatementHandler,
  'FunctionDeclaration': FunctionDeclarationHandler,
  'ClassDeclaration': ClassDeclarationHandler,
  'ClassMethod': ClassMethodHandler,
  'ClassProperty': ClassPropertyHandler,
  // 检测函数是否调用过
  'JSXExpressionContainer': isFunctionHadBeenCalled,
  'CallExpression': isFunctionHadBeenCalled,
  'ReturnStatement': isFunctionHadBeenCalled,
  'ObjectExpression': isFunctionHadBeenCalled,
  'ArrayExpression': isFunctionHadBeenCalled
}

module.exports = handleFunction;