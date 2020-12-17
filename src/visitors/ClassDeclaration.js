const eventEmitter = require('../utils/event');
const { HANDLE_FUNCTION } = require('../utils/eventHandleEnum')
const { handleClassFunction } = require('../utils/utils');

// class
function ClassDeclarationPlugin() {
  return {
    visitor: {
      ClassDeclaration(path) {
        const parentName = path.get('id').node.name;
        const classLine = path.node.loc.start.line;
        eventEmitter.emit(HANDLE_FUNCTION, {
          type: 'ClassDeclaration',
          subType: '',
          parentName,
          name: parentName,
          line: classLine
        });
        
        let name = '';
        // console.log(Object.keys(path.get('ClassBody').container.body.body), path.get('ClassBody').container.body.body);
        path.traverse({
          ExpressionStatement(path) {
            path.traverse({
              FunctionExpression(path) {
                // console.log('FunctionExpression ----> ExpressionStatement ----> ClassDeclaration')
                const [name, line] = handleClassFunction(path);

                eventEmitter.emit(HANDLE_FUNCTION, {
                  type: 'ClassDeclaration',
                  subType: 'FunctionExpression',
                  parentName,
                  name: name || parentName,
                  line
                })

              },
              ArrowFunctionExpression(path) {
                // console.log('ArrowFunctionDeclaration ----> ExpressionStatement ----> ClassDeclaration')
                const [name, line] = handleClassFunction(path);

                eventEmitter.emit(HANDLE_FUNCTION, {
                  type: 'ClassDeclaration',
                  subType: 'ArrowFunctionExpression',
                  parentName,
                  name: name || parentName,
                  line
                })
              },
            })
          },
          ClassMethod(path) {
            try {
              let name = path.node.key.name, line = -1;
              if (path.node.loc) {
                line = path.node.loc.start.line;
                eventEmitter.emit(HANDLE_FUNCTION, {
                  type: 'ClassDeclaration',
                  subType: 'ClassMethod',
                  parentName,
                  name: name || parentName,
                  line
                });
              }
            } catch {
              console.log('ClassDeclaration ClassMethod failed');
            }
          }
        })
      }
    }
  }
}

module.exports = ClassDeclarationPlugin;