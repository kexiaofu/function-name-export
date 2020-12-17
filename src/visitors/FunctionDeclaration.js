const { handleFunctionDeclaration } = require('../utils/utils');
const eventEmitter = require('../utils/event');
const { HANDLE_FUNCTION } = require('../utils/eventHandleEnum')

function FunctionDeclarationHandler(path) {
  const node = path.node || path;
  // @babel/parser
  if (node.type === 'File') {
    const nodes = node.program.body || [];
    return nodes.forEach(item => FunctionDeclarationHandler(item))
  }
  const [name, line] = handleFunctionDeclaration(path);
  console.log(name, line, '---->')
  if (name && line >= 0) {
    // console.log('FunctionDeclaration')
    eventEmitter.emit(HANDLE_FUNCTION, {
      type: 'FunctionDeclaration',
      subType: '',
      parentName: '',
      name,
      line
    })
  }
}

// function hello() {}
// function() {} is error
function FunctionDeclarationPlugin() {
  return {
    visitor: {
      FunctionDeclaration(path) {
        console.log(path.type)
        FunctionDeclarationHandler(path);
      }
    }
  }
}

module.exports = {
  FunctionDeclarationHandler,
  FunctionDeclarationPlugin
};