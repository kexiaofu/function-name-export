const eventEmitter = require('../utils/event');
const { HANDLE_FUNCTION } = require('../utils/eventHandleEnum')

// var fn = function() {};
// var fn = () => {};
function VariableDeclaratorPlugin() {
  return {
    visitor: {
      VariableDeclarator(path) {
        let name = '',
          parentName = path.node.id.name,
          firstFn = true,
          isFun = false,
          subType = '';
        const startLine = path.node.loc.start.line;
        path.traverse({
          FunctionExpression(path) {
            // console.log('VariableDeclarator ----> FunctionExpression')
            isFun = true;
            if (firstFn && path.get('id').node) {
              // console.log(path.get('id').node.name)
              name = path.get('id').node.name;
              subType = 'FunctionExpression';
            }
            if (firstFn) {
              firstFn = false;
            }
          },

          ArrowFunctionExpression(path) {
            // console.log('VariableDeclarator ----> ArrowFunctionExpression')
            isFun = true;
            subType = 'ArrowFunctionExpression';
          }
        })
        if (isFun) {
          let node = {
            type: 'VariableDeclarator',
            subType,
            name: name ? name : parentName,
            parentName: '',
            line: startLine
          }
          eventEmitter.emit(HANDLE_FUNCTION, node)
        }
      }
    }
  }
}

module.exports = VariableDeclaratorPlugin;