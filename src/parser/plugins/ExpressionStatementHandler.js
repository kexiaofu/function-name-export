
const {
  getLine,
  getName,
  isHadFunctionString
} = require('../../utils/utils');
const eventEmitter = require('../../utils/event');
const {
  HANDLE_FUNCTION
} = require('../../utils/eventHandleEnum');

function ExpressionStatementHandler(path) {
  const node = path.node || path;
  try {
    const rightNode = (node.expression && node.expression.right);

    if (rightNode) {
      if (isHadFunctionString(rightNode.type)) {
        let result = {},
          name = '';

        if (rightNode.id) {
          name = getName(rightNode.id);
        } else {
          const leftNode = node.expression.left;
          if (leftNode.name) {
            name = getName(leftNode);
          } else {
            name = getName(leftNode.object) + '.' + getName(leftNode.property);
          }
        }

        result = {
          type: 'ExpressionStatement',
          name,
          line: getLine(node)
        };

        eventEmitter.emit(HANDLE_FUNCTION, result);

        console.log(result);
        return result
      }
    } else {
      // TODO CallExpression 以后可能会抽出来
      const expressionNode = node.expression;
      if (expressionNode.type === 'CallExpression') {
        const callee = expressionNode.callee;

        if (callee.id) {
          const name = getName(callee.id);

          result = {
            type: 'ExpressionStatement',
            name,
            line: getLine(node)
          };

          eventEmitter.emit(HANDLE_FUNCTION, result);

          console.log(result);
          return result
        }
      }
    }

    return null;
  } catch (e) {
    console.log('ExpressionStatementHandler catch error', e)
    return null;
  }
}

module.exports = ExpressionStatementHandler;