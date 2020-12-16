const { handleFunctionDeclaration, expressionStatementLeftNode } = require('../utils/utils');
const eventEmitter = require('../utils/event');
const { HANDLE_FUNCTION } = require('../utils/eventHandleEnum')

// a.b = function hello() {};
// ;(function (arg) {})(arg)
// 如果 (function (arg) {})(arg) 前无分割，则识别不出来
function fromExpressionStatement() {
  return {
    visitor: {
      ExpressionStatement(path) {
        let [leftName, startLine] = expressionStatementLeftNode(path);
        // console.log('ExpressionStatement', '---->')
        let firstFn = true;
        path.traverse({
          FunctionExpression(path) {
            if (firstFn) {
              firstFn = false;
              const [name, line] = handleFunctionDeclaration(path);
              if (name && line >= 0) {
                // console.log('FunctionExpression ----> ExpressionStatement')
                eventEmitter.emit(HANDLE_FUNCTION, {
                  type: 'ExpressionStatement',
                  subType: 'FunctionExpression',
                  parentName: '',
                  name,
                  line
                });
              }
            }
          },
          ArrowFunctionExpression() {
            if (leftName) {
              // console.log('ArrowFunctionExpression ----> ExpressionStatement')
              eventEmitter.emit(HANDLE_FUNCTION, {
                type: 'ExpressionStatement',
                subType: 'ArrowFunctionExpression',
                parentName: '',
                name: leftName,
                line: startLine
              });
            }
          }
        })
      }
    }
  }
}

module.exports = fromExpressionStatement;