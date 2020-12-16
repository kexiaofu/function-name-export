const { handleFunctionDeclaration } = require('../utils/utils');
const eventEmitter = require('../utils/event');
const { HANDLE_FUNCTION } = require('../utils/eventHandleEnum')

// function hello() {}
// function() {} is error
function fromFunctionDeclaration() {
  return {
    visitor: {
      FunctionDeclaration(path) {
        const [name, line] = handleFunctionDeclaration(path);
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
    }
  }
}

module.exports = fromFunctionDeclaration;