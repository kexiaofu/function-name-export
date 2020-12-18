const {
  getName
} = require('../../utils/utils');
const eventEmitter = require('../../utils/event');
const {
  FUNCTION_CALL
} = require('../../utils/eventHandleEnum');

function isFunctionHadBeenCalled(path) {
  const node = path.node || path;

  if (
    node.type === 'ExpressionStatement' &&
    node.expression.type === 'CallExpression' &&
    node.expression.callee.type === 'Identifier'
  ) {
    const name = getName(node.expression.callee);

    eventEmitter.emit(FUNCTION_CALL, name);

    return name;
  }
}

module.exports = isFunctionHadBeenCalled;